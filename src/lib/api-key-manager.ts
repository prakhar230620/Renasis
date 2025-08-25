import { ApiKey, ApiKeyManagerState, ApiKeyError } from '@/types/api-keys';

const STORAGE_KEY = 'renasis_api_keys';

export class ApiKeyManager {
  private static instance: ApiKeyManager;
  private state: ApiKeyManagerState;

  private constructor() {
    this.state = this.loadFromStorage();
  }

  static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  private loadFromStorage(): ApiKeyManagerState {
    if (typeof window === 'undefined') {
      return { keys: [], currentKeyId: null, isFirstTime: true };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { keys: [], currentKeyId: null, isFirstTime: true };
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading API keys from storage:', error);
      return { keys: [], currentKeyId: null, isFirstTime: true };
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving API keys to storage:', error);
    }
  }

  addApiKey(name: string, key: string): ApiKey {
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name,
      key,
      status: 'inactive',
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    this.state.keys.push(newKey);
    this.state.isFirstTime = false;
    
    // If this is the first key, make it current
    if (this.state.keys.length === 1) {
      this.state.currentKeyId = newKey.id;
      newKey.status = 'active';
    }

    this.saveToStorage();
    return newKey;
  }

  removeApiKey(keyId: string): boolean {
    const keyIndex = this.state.keys.findIndex(k => k.id === keyId);
    if (keyIndex === -1) return false;

    this.state.keys.splice(keyIndex, 1);

    // If we removed the current key, switch to another active key
    if (this.state.currentKeyId === keyId) {
      const activeKey = this.state.keys.find(k => k.status === 'active');
      this.state.currentKeyId = activeKey?.id || null;
    }

    this.saveToStorage();
    return true;
  }

  updateApiKey(keyId: string, updates: Partial<ApiKey>): boolean {
    const key = this.state.keys.find(k => k.id === keyId);
    if (!key) return false;

    Object.assign(key, updates);
    this.saveToStorage();
    return true;
  }

  setCurrentKey(keyId: string): boolean {
    const key = this.state.keys.find(k => k.id === keyId);
    if (!key || key.status === 'rate_limited') return false;

    // Deactivate current key
    if (this.state.currentKeyId) {
      const currentKey = this.state.keys.find(k => k.id === this.state.currentKeyId);
      if (currentKey) {
        currentKey.status = 'inactive';
      }
    }

    // Activate new key
    key.status = 'active';
    this.state.currentKeyId = keyId;
    this.saveToStorage();
    return true;
  }

  getCurrentKey(): ApiKey | null {
    if (!this.state.currentKeyId) return null;
    return this.state.keys.find(k => k.id === this.state.currentKeyId) || null;
  }

  getAvailableKeys(): ApiKey[] {
    return this.state.keys.filter(k => k.status !== 'rate_limited');
  }

  getAllKeys(): ApiKey[] {
    return [...this.state.keys];
  }

  markKeyAsRateLimited(keyId: string, resetTime?: string): void {
    const key = this.state.keys.find(k => k.id === keyId);
    if (!key) return;

    key.status = 'rate_limited';
    key.rateLimitResetTime = resetTime;

    // If this was the current key, switch to another available key
    if (this.state.currentKeyId === keyId) {
      const availableKey = this.state.keys.find(k => k.status === 'active' || k.status === 'inactive');
      if (availableKey) {
        this.setCurrentKey(availableKey.id);
      } else {
        this.state.currentKeyId = null;
      }
    }

    this.saveToStorage();
  }

  incrementUsage(keyId: string): void {
    const key = this.state.keys.find(k => k.id === keyId);
    if (!key) return;

    key.usageCount++;
    key.lastUsed = new Date().toISOString();
    this.saveToStorage();
  }

  getNextAvailableKey(): ApiKey | null {
    const availableKeys = this.getAvailableKeys();
    if (availableKeys.length === 0) return null;

    // Return the key with the lowest usage count
    return availableKeys.reduce((prev, current) => 
      prev.usageCount <= current.usageCount ? prev : current
    );
  }

  isFirstTime(): boolean {
    return this.state.isFirstTime;
  }

  resetFirstTime(): void {
    this.state.isFirstTime = false;
    this.saveToStorage();
  }

  validateApiKey(key: string): boolean {
    // Basic validation for Google AI API key format
    return key.startsWith('AIza') && key.length >= 35;
  }

  clearAllKeys(): void {
    this.state = { keys: [], currentKeyId: null, isFirstTime: true };
    this.saveToStorage();
  }
}
