'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the sentiment of customer reviews.
 *
 * It includes functions to:
 * - analyzeCustomerSentiment - A wrapper function that takes customer review text as input and returns the sentiment analysis result.
 * - AnalyzeCustomerSentimentInput - The input type for the analyzeCustomerSentiment function.
 * - AnalyzeCustomerSentimentOutput - The output type for the analyzeCustomerSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCustomerSentimentInputSchema = z.object({
  reviewText: z
    .string()
    .describe('The text of the customer review to analyze.'),
});
export type AnalyzeCustomerSentimentInput = z.infer<typeof AnalyzeCustomerSentimentInputSchema>;

const AnalyzeCustomerSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the customer review.'),
  confidence: z
    .number()
    .describe('The confidence level of the sentiment analysis (0-1).'),
});
export type AnalyzeCustomerSentimentOutput = z.infer<typeof AnalyzeCustomerSentimentOutputSchema>;

export async function analyzeCustomerSentiment(input: AnalyzeCustomerSentimentInput): Promise<AnalyzeCustomerSentimentOutput> {
  return analyzeCustomerSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCustomerSentimentPrompt',
  input: {schema: AnalyzeCustomerSentimentInputSchema},
  output: {schema: AnalyzeCustomerSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following customer review.  Return either \"positive\", \"negative\", or \"neutral\".  Also return a confidence 0-1.\n
Review: {{{reviewText}}}`,
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

