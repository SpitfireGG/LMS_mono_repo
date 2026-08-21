import type { IncomingMessage, ServerResponse } from 'node:http';

// Kept in sync with LIVE_MODEL in src/lib/liveConfig.ts. Inlined (not imported)
// because a Vercel serverless function cannot import a .ts file from outside the
// /api directory at runtime — doing so crashes the function on load.
const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

// Vercel serverless function: GET /api/live-token
//
// The production counterpart of vite-plugin-live-token.ts (which only runs
// during `vite dev`). It mints a short-lived, single-use ephemeral token for the
// Gemini Live API so the GEMINI_API_KEY stays server-side — the browser receives
// only a scoped token and connects to Gemini directly with it.
//
// Requires the GEMINI_API_KEY environment variable to be set in the Vercel
// project settings (Settings → Environment Variables), enabled for the
// environment you are testing (Production and/or Preview).
//
// Everything risky (the SDK import + network call) runs inside the try/catch so a
// failure surfaces as readable JSON instead of an opaque FUNCTION_INVOCATION_FAILED.
export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    if (!apiKey) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not set in the Vercel environment' }));
      return;
    }

    const { GoogleGenAI, Modality } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
    const now = Date.now();
    const token = await ai.authTokens.create({
      config: {
        uses: 1, // single Live session
        expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(now + 2 * 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: LIVE_MODEL,
          config: { responseModalities: [Modality.AUDIO] },
        },
        httpOptions: { apiVersion: 'v1alpha' },
      },
    });
    res.statusCode = 200;
    res.end(JSON.stringify({ token: token.name }));
  } catch (err) {
    const e = err as Error;
    console.error('[live-token]', e?.message, e?.stack);
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'Failed to mint ephemeral token', detail: e?.message }));
  }
}
