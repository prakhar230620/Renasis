'use server';

/**
 * @fileOverview Generates AI-powered business suggestions based on customer review analysis.
 *
 * - generateBusinessSuggestions - A function that generates business suggestions.
 * - GenerateBusinessSuggestionsInput - The input type for the generateBusinessSuggestions function.
 * - GenerateBusinessSuggestionsOutput - The return type for the generateBusinessSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessSuggestionsInputSchema = z.object({
  reviewAnalysis: z
    .string()
    .describe('The analysis of customer reviews, including sentiment, issues, and trends.'),
});
export type GenerateBusinessSuggestionsInput = z.infer<typeof GenerateBusinessSuggestionsInputSchema>;

const GenerateBusinessSuggestionsOutputSchema = z.object({
  suggestions:
    z.string().describe('AI-generated suggestions for actionable business improvements.'),
});
export type GenerateBusinessSuggestionsOutput = z.infer<typeof GenerateBusinessSuggestionsOutputSchema>;

export async function generateBusinessSuggestions(
  input: GenerateBusinessSuggestionsInput
): Promise<GenerateBusinessSuggestionsOutput> {
  return generateBusinessSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessSuggestionsPrompt',
  input: {schema: GenerateBusinessSuggestionsInputSchema},
  output: {schema: GenerateBusinessSuggestionsOutputSchema},
  prompt: `Based on the following analysis of customer reviews, provide actionable business improvements suggestions:\n\n  {{{reviewAnalysis}}}\n  `,
});

const generateBusinessSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateBusinessSuggestionsFlow',
    inputSchema: GenerateBusinessSuggestionsInputSchema,
    outputSchema: GenerateBusinessSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
