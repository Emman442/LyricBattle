'use server';
/**
 * @fileOverview This file implements a Genkit flow for evaluating player lyric guesses.
 *
 * - aiLyricScoring - A function that evaluates a player's lyric guess against the correct line.
 * - AiLyricScoringInput - The input type for the aiLyricScoring function.
 * - AiLyricScoringOutput - The return type for the aiLyricScoring function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiLyricScoringInputSchema = z.object({
  correctLyricLine: z.string().describe('The actual correct line of the song lyric.'),
  playerGuess: z.string().describe('The player\u0027s submitted guess for the lyric line.'),
  isStreetModeActive: z.boolean().describe('Whether \u0027Street Mode\u0027 is active, allowing for slang and regional variations.'),
  genre: z.string().describe('The music genre of the song, to aid contextual understanding.'),
});
export type AiLyricScoringInput = z.infer<typeof AiLyricScoringInputSchema>;

const AiLyricScoringOutputSchema = z.object({
  aiScore: z.number().min(0.0).max(10.0).describe('An accuracy score from 0.0 (completely incorrect) to 10.0 (perfect).'),
  isCorrect: z.boolean().describe('True if the guess is considered correct based on the AI\u0027s evaluation and score threshold.'),
  feedback: z.string().optional().describe('Optional feedback explaining the score or suggesting improvements.'),
});
export type AiLyricScoringOutput = z.infer<typeof AiLyricScoringOutputSchema>;

export async function aiLyricScoring(input: AiLyricScoringInput): Promise<AiLyricScoringOutput> {
  return aiLyricScoringFlow(input);
}

const aiLyricScoringPrompt = ai.definePrompt({
  name: 'aiLyricScoringPrompt',
  input: { schema: AiLyricScoringInputSchema },
  output: { schema: AiLyricScoringOutputSchema },
  prompt: `You are an expert lyric evaluator for a game called "LyricBattle". Your task is to compare a player's guess against the correct song lyric and provide an accuracy score from 0.0 to 10.0. You must also determine if the guess is considered correct.

Consider the following details:
-   **Genre:** {{{genre}}}
-   **Correct Lyric Line:** "{{{correctLyricLine}}}"
-   **Player's Guess:** "{{{playerGuess}}}"

{{#if isStreetModeActive}}
**Important:** 'Street Mode' is active. This means you should be lenient with spelling, punctuation, capitalization, and allow for common slang, regional variations, and phonetic spellings that are contextually appropriate for the "{{{genre}}}" genre. The goal is to reward understanding, not strict adherence to grammar. A score of 7.0 or higher should typically be considered correct.
{{else}}
**Important:** 'Street Mode' is NOT active. While minor variations are acceptable, strive for higher accuracy in spelling, punctuation, and wording. A score of 8.5 or higher should typically be considered correct.
{{/if}}

Based on the similarity, contextual relevance, and the active mode, provide a score from 0.0 (completely incorrect) to 10.0 (perfect) and determine if the guess is considered correct. Also, provide an optional brief feedback message.

Output your response in JSON format.`,
});

const aiLyricScoringFlow = ai.defineFlow(
  {
    name: 'aiLyricScoringFlow',
    inputSchema: AiLyricScoringInputSchema,
    outputSchema: AiLyricScoringOutputSchema,
  },
  async (input) => {
    const { output } = await aiLyricScoringPrompt(input);
    if (!output) {
      throw new Error('Failed to get output from AI lyric scoring prompt.');
    }
    return output;
  },
);
