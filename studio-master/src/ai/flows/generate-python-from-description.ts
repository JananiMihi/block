
'use server';
/**
 * @fileOverview This file defines a Genkit flow that generates Python code from a user-provided description.
 *
 * - generatePythonFromDescription - A function that accepts a program description and returns generated Python code.
 * - GeneratePythonFromDescriptionInput - The input type for the generatePythonFromDescription function.
 * - GeneratePythonFromDescriptionOutput - The return type for the generatePythonFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePythonFromDescriptionInputSchema = z.object({
  description: z.string().describe('A description of the program to generate Python code for.'),
});
export type GeneratePythonFromDescriptionInput = z.infer<typeof GeneratePythonFromDescriptionInputSchema>;

const GeneratePythonFromDescriptionOutputSchema = z.object({
  pythonCode: z.string().describe('The generated Python code.'),
});
export type GeneratePythonFromDescriptionOutput = z.infer<typeof GeneratePythonFromDescriptionOutputSchema>;

export async function generatePythonFromDescription(
  input: GeneratePythonFromDescriptionInput
): Promise<GeneratePythonFromDescriptionOutput> {
  return generatePythonFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePythonFromDescriptionPrompt',
  input: {schema: GeneratePythonFromDescriptionInputSchema},
  output: {schema: GeneratePythonFromDescriptionOutputSchema},
  prompt: `You are an AI code generator that generates Python code based on the user's description.

  Description: {{{description}}}

  Please provide only valid Python code. Do not include any comments or explanations. Just the code.
  `,
});

const generatePythonFromDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePythonFromDescriptionFlow',
    inputSchema: GeneratePythonFromDescriptionInputSchema,
    outputSchema: GeneratePythonFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
