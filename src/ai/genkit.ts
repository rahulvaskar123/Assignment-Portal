import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Genkit initialization with hardcoded API key for simplified deployment.
 */
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: "AIzaSyB4UWUcTreh6y4PemKvyxNIQakbQtq6iWQ",
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
