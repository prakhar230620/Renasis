'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the sentiment of customer reviews in a batch.
 *
 * It includes functions to:
 * - analyzeCustomerSentiment - A wrapper function that takes multiple customer reviews as input and returns the sentiment analysis results for each.
 * - AnalyzeCustomerSentimentInput - The input type for the analyzeCustomerSentiment function.
 * - AnalyzeCustomerSentimentOutput - The output type for the analyzeCustomerSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SingleReviewSentimentSchema = z.object({
  reviewText: z.string().describe('The original text of the customer review.'),
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the customer review.'),
  confidence: z
    .number()
    .describe('The confidence level of the sentiment analysis (0-1).'),
});

const AnalyzeCustomerSentimentInputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of customer review texts to analyze.'),
});
export type AnalyzeCustomerSentimentInput = z.infer<typeof AnalyzeCustomerSentimentInputSchema>;

const AnalyzeCustomerSentimentOutputSchema = z.object({
  results: z.array(SingleReviewSentimentSchema).describe('An array of sentiment analysis results for each review.')
});
export type AnalyzeCustomerSentimentOutput = z.infer<typeof AnalyzeCustomerSentimentOutputSchema>;

export async function analyzeCustomerSentiment(input: AnalyzeCustomerSentimentInput): Promise<AnalyzeCustomerSentimentOutput> {
  return analyzeCustomerSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCustomerSentimentPrompt',
  input: {schema: AnalyzeCustomerSentimentInputSchema},
  output: {schema: AnalyzeCustomerSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following customer reviews. For each review, return the original text, its sentiment ("positive", "negative", or "neutral"), and a confidence score from 0 to 1. If a review is empty or nonsensical, you can still include it in the results, but assign a 'neutral' sentiment and a low confidence score.

Reviews:
{{#each reviews}}
- "{{this}}"
{{/each}}
`,
});

const analyzeCustomerSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerSentimentFlow',
    inputSchema: AnalyzeCustomerSentimentInputSchema,
    outputSchema: AnalyzeCustomerSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
