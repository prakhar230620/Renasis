import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-customer-sentiment.ts';
import '@/ai/flows/generate-business-suggestions.ts';
import '@/ai/flows/identify-customer-issues.ts';
