// Central configuration for the voice mock test that runs over the Gemini Live
// API (native audio). The test is driven by a PDF the student uploads: the AI
// studies the document and runs an IELTS-style spoken Q&A about it, then gives a
// score and feedback. Anything content/policy related lives here.

// --- Model -------------------------------------------------------------------
// Native-audio Live model: a single low-latency model that produces natural,
// emotion-aware speech and handles turn-taking via built-in VAD. Kept as one
// constant so it is trivially swappable. Re-confirm the current id against
// https://ai.google.dev/gemini-api/docs/models — preview ids rotate.
//   Alternative (newer preview): 'gemini-3.1-flash-live-preview'
//   GA candidate:                'gemini-live-2.5-flash-native-audio'
// NOTE: also inlined in api/live-token.ts (a Vercel function can't import this
// file at runtime); keep the two in sync.
export const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

// Native-audio prebuilt voice. See the Live API docs for the full voice list.
export const LIVE_VOICE = 'Charon';

// Audio sample rates fixed by the Live API contract.
export const INPUT_SAMPLE_RATE = 16000; // mic -> model (16-bit PCM, mono)
export const OUTPUT_SAMPLE_RATE = 24000; // model -> speakers

// --- System instruction ------------------------------------------------------
// Built at runtime from the uploaded PDF's text. Defines an IELTS-style speaking
// examiner that grounds the whole test in the provided material.
export interface TestSource {
  /** Extracted text of the uploaded PDF. */
  text: string;
  /** Original file name, for a natural reference in the briefing. */
  fileName?: string;
}

export function buildSystemInstruction({ text, fileName }: TestSource): string {
  const docLabel = fileName ? `the document "${fileName}"` : 'the document below';
  return [
    'You are a friendly but professional English-speaking examiner conducting a spoken mock test,',
    'in the style of the IELTS speaking test. The entire test is based on the source material the',
    `student has provided (${docLabel}). Speak naturally, like a real human examiner — warm,`,
    'clear, and conversational. Never mention that you are an AI or a language model.',
    '',
    'HOW THE TEST RUNS — follow these rules:',
    '1. First, study the source material at the end of this prompt so all of your questions are',
    '   grounded in it. Do not invent facts that contradict it.',
    '2. Begin with a short spoken briefing (2-3 sentences): greet the student, say this is a',
    '   speaking mock test based on their uploaded material, and explain that you will ask a series',
    '   of questions which they should answer aloud in full sentences.',
    '3. Then ask ONE question at a time. After each question, STOP and wait for the student to',
    '   answer. Do NOT answer your own questions.',
    '4. Base questions on the material: start with comprehension (facts/details from the document),',
    '   then move to analysis and opinion ("why do you think…", "how would you…", "do you agree…").',
    '   Ask brief, natural follow-ups when an answer is short, vague, or interesting.',
    '5. Keep a natural conversational pace. Ask roughly 6-8 questions in total (use judgement —',
    '   fewer if answers are long, more if they are short).',
    '6. Do NOT grade or correct the student mid-test. Just acknowledge briefly and move on.',
    '7. WHEN THE TEST IS COMPLETE, give a closing assessment, spoken aloud:',
    '   - An overall band score out of 9 (you may use half-bands, e.g. 6.5).',
    '   - 2-3 sentences of feedback: what the student did well and what to improve',
    '     (fluency, vocabulary, grammar, and how well they used the material).',
    '   Then thank them and end the session.',
    '',
    '=== SOURCE MATERIAL (the uploaded document) ===',
    text || '(The document appears to be empty or could not be read.)',
  ].join('\n');
}
