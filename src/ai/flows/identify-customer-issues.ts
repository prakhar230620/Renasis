'use server';

/**
 * @fileOverview Identifies common issues raised in customer reviews using AI.
 * 
 * - identifyCustomerIssues - A function that identifies common issues in customer reviews.
 * - IdentifyCustomerIssuesInput - The input type for the identifyCustomerIssues function.
 * - IdentifyCustomerIssuesOutput - The return type for the identifyCustomerIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyCustomerIssuesInputSchema = z.object({
  reviews: z
    .string()
    .describe('The customer reviews to analyze.'),
});
export type IdentifyCustomerIssuesInput = z.infer<typeof IdentifyCustomerIssuesInputSchema>;

const IdentifyCustomerIssuesOutputSchema = z.object({
  issues:
    z.array(z.string())
      .describe('The common issues identified in the customer reviews.')
});
export type IdentifyCustomerIssuesOutput = z.infer<typeof IdentifyCustomerIssuesOutputSchema>;

export async function identifyCustomerIssues(input: IdentifyCustomerIssuesInput): Promise<IdentifyCustomerIssuesOutput> {
  return identifyCustomerIssuesFlow(input);
}

const identifyCustomerIssuesPrompt = ai.definePrompt({
  name: 'identifyCustomerIssuesPrompt',
  input: {schema: IdentifyCustomerIssuesInputSchema},
  output: {schema: IdentifyCustomerIssuesOutputSchema},
  prompt: `You are an AI assistant helping to identify common issues from customer reviews.\n\n  Analyze the following customer reviews and identify the key issues or pain points that customers are mentioning. Provide a list of these issues.\n  Reviews: {{{reviews}}}\n\n  Output the list of issues.`,
});

const identifyCustomerIssuesFlow = ai.defineFlow(
  {
    name: 'identifyCustomerIssuesFlow',
    inputSchema: IdentifyCustomerIssuesInputSchema,
    outputSchema: IdentifyCustomerIssuesOutputSchema,
  },
  async input => {
    const {output} = await identifyCustomerIssuesPrompt(input);
    return output!;
  }
);

