'use server';
/**
 * @fileOverview An AI assistant that verifies if a student's free-text description aligns with their selected subject.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssignmentVerificationAssistantInputSchema = z.object({
  subject: z
    .enum(['Big Data Analytics', 'Blockchain', 'Cloud Computing', 'Digital Business Management'])
    .describe('The subject selected by the student.'),
  freeTextDescription: z
    .string()
    .describe(
      'Any additional free-text description provided by the student about their assignment.'
    ),
});
export type AssignmentVerificationAssistantInput = z.infer<
  typeof AssignmentVerificationAssistantInputSchema
>;

const AssignmentVerificationAssistantOutputSchema = z.object({
  isAligned: z
    .boolean()
    .describe(
      'True if the freeTextDescription generally aligns with the selected subject, false otherwise.'
    ),
  suggestion: z
    .string()
    .describe(
      'A suggestion or explanation regarding the alignment. If not aligned, suggest a more appropriate subject or how to refine the description.'
    ),
});
export type AssignmentVerificationAssistantOutput = z.infer<
  typeof AssignmentVerificationAssistantOutputSchema
>;

export async function assignmentVerificationAssistant(
  input: AssignmentVerificationAssistantInput
): Promise<AssignmentVerificationAssistantOutput> {
  return assignmentVerificationAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assignmentVerificationAssistantPrompt',
  input: {schema: AssignmentVerificationAssistantInputSchema},
  output: {schema: AssignmentVerificationAssistantOutputSchema},
  prompt: `You are an AI assistant helping a student verify their assignment details.
Your task is to determine if the student's 'freeTextDescription' aligns with their selected 'subject'.

Selected Subject: {{{subject}}}
Free Text Description: {{{freeTextDescription}}}

Carefully assess if the description contains keywords, concepts, or themes that are generally relevant to the selected subject. Respond with a boolean indicating alignment and a helpful suggestion or explanation. If there's a mismatch, suggest a better subject or how the description could be improved for clarity and accuracy.`,
});

const assignmentVerificationAssistantFlow = ai.defineFlow(
  {
    name: 'assignmentVerificationAssistantFlow',
    inputSchema: AssignmentVerificationAssistantInputSchema,
    outputSchema: AssignmentVerificationAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
