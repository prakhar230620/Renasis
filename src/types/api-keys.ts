export interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'rate_limited' | 'inactive';
  createdAt: string;
  lastUsed?: string;
  rateLimitResetTime?: string;
  usageCount: number;
}

export interface ApiKeyManagerState {
  keys: ApiKey[];
  currentKeyId: string | null;
  isFirstTime: boolean;
}

// Custom error class for API key related errors
export class ApiKeyError extends Error {
  public readonly type: 'invalid_key' | 'rate_limit' | 'network_error' | 'unknown';
  public readonly keyId?: string;

  constructor(error: { type: ApiKeyError['type']; message: string; keyId?: string }) {
    super(error.message);
    this.name = 'ApiKeyError';
    this.type = error.type;
    this.keyId = error.keyId;
  }
}
