import { ApiKeyManager } from '@/lib/api-key-manager';
import { ApiKeyError } from '@/types/api-keys';

export interface AnalysisRequest {
  reviews: Array<{ text: string }>;
}

export interface AnalysisResponse {
  issues: string[];
  suggestions: Array<{ title: string; points: string[] }>;
  sentiment: Array<{ reviewText: string; sentiment: string; confidence: number }>;
}

export class AnalysisService {
  private keyManager: ApiKeyManager;

  constructor() {
    this.keyManager = ApiKeyManager.getInstance();
  }

  async analyzeReviews(reviews: Array<{ text: string }>): Promise<AnalysisResponse> {
    const currentKey = this.keyManager.getCurrentKey();
    
    if (!currentKey) {
      throw new ApiKeyError({
        type: 'invalid_key',
        message: 'No API key available. Please add an API key to continue.',
      });
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviews,
          apiKey: currentKey.key,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          // Handle rate limiting
          this.keyManager.markKeyAsRateLimited(currentKey.id);
          const nextKey = this.keyManager.getNextAvailableKey();
          
          if (nextKey && nextKey.id !== currentKey.id) {
            this.keyManager.setCurrentKey(nextKey.id);
            throw new ApiKeyError({
              type: 'rate_limit',
              message: 'Rate limit exceeded. Switched to next available key. Please try again.',
              keyId: currentKey.id,
            });
          } else {
            throw new ApiKeyError({
              type: 'rate_limit',
              message: 'All API keys have reached their rate limits. Please wait before trying again.',
              keyId: currentKey.id,
            });
          }
        }

        throw new ApiKeyError({
          type: 'unknown',
          message: errorData.error || `Server error: ${response.status}`,
          keyId: currentKey.id,
        });
      }

      const data = await response.json();
      
      // Success - increment usage count
      this.keyManager.incrementUsage(currentKey.id);
      
      return data;
    } catch (error) {
      if (error instanceof ApiKeyError) {
        throw error;
      }
      
      throw new ApiKeyError({
        type: 'network_error',
        message: 'Failed to connect to the analysis service. Please check your internet connection.',
        keyId: currentKey.id,
      });
    }
  }

  hasAvailableKeys(): boolean {
    return this.keyManager.getAvailableKeys().length > 0;
  }

  getCurrentKeyInfo() {
    return this.keyManager.getCurrentKey();
  }
}
