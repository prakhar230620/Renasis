import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ApiKeyError } from '@/types/api-keys';

export class AIClient {
  private static instance: AIClient;

  private constructor() {}

  static getInstance(): AIClient {
    if (!AIClient.instance) {
      AIClient.instance = new AIClient();
    }
    return AIClient.instance;
  }

  private createAIInstance(apiKey: string) {
    return genkit({
      plugins: [googleAI({ apiKey })],
      model: 'googleai/gemini-2.0-flash',
    });
  }

  async executeWithRetry<T>(
    operation: (ai: any) => Promise<T>,
    apiKey: string,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: ApiKeyError | null = null;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const ai = this.createAIInstance(apiKey);
        const result = await operation(ai);
        return result;
        
      } catch (error: any) {
        attempts++;
        lastError = this.parseError(error);
        
        // For network errors, wait before retry
        if (lastError.type === 'network_error' && attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          continue;
        }
        
        // If it's not a rate limit or network error, break immediately
        if (lastError.type !== 'rate_limit' && lastError.type !== 'network_error') {
          break;
        }
      }
    }

    // All retries exhausted
    throw lastError || new ApiKeyError({
      type: 'unknown',
      message: 'All retry attempts failed',
    });
  }

  private parseError(error: any): ApiKeyError {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    // Check for rate limiting errors
    if (errorMessage.includes('quota') || 
        errorMessage.includes('rate limit') || 
        errorMessage.includes('429') ||
        errorMessage.includes('RATE_LIMIT_EXCEEDED')) {
      return new ApiKeyError({
        type: 'rate_limit',
        message: 'API rate limit exceeded.',
      });
    }
    
    // Check for invalid API key errors
    if (errorMessage.includes('API key') || 
        errorMessage.includes('authentication') || 
        errorMessage.includes('401') ||
        errorMessage.includes('UNAUTHENTICATED')) {
      return new ApiKeyError({
        type: 'invalid_key',
        message: 'Invalid API key. Please check your API key.',
      });
    }
    
    // Check for network/fetch errors
    if (errorMessage.includes('fetch failed') || 
        errorMessage.includes('network') || 
        errorMessage.includes('timeout') || 
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('ECONNRESET') ||
        errorMessage.includes('ETIMEDOUT') ||
        errorMessage.includes('connection') ||
        errorMessage.toLowerCase().includes('failed to fetch')) {
      return new ApiKeyError({
        type: 'network_error',
        message: 'Network connection failed. Please check your internet connection and try again.',
      });
    }
    
    return new ApiKeyError({
      type: 'network_error',
      message: 'Connection to Google AI failed. Please check your internet connection and API key.',
    });
  }
}
