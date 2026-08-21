import { GoogleGenAI, Modality } from '@google/genai';
import { loadEnv, type Plugin } from 'vite';
import { LIVE_MODEL } from './src/lib/liveConfig';

// Dev-server endpoint that mints short-lived, single-use ephemeral tokens for the
// Gemini Live API. The GEMINI_API_KEY never leaves the server: the browser receives
// only a scoped token and connects to Gemini directly with it.
//
// In production the same logic would live on a real backend (e.g. Express server.js);
// this plugin covers `vite dev` / `vite preview`.
export function liveTokenPlugin(): Plugin {
  let apiKey = '';

  return {
    name: 'live-token-endpoint',
    config(_, { mode }) {
      // Vite does not put un-prefixed vars on process.env, so load them explicitly.
      const env = loadEnv(mode, process.cwd(), '');
      apiKey = env.GEMINI_API_KEY || env.API_KEY || '';
    },
    configureServer(server) {
      server.middlewares.use('/api/live-token', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not set in .env.local' }));
          return;
        }
        try {
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
          server.config.logger.error(`[live-token] ${(err as Error).message}`);
          res.statusCode = 502;
          res.end(JSON.stringify({ error: 'Failed to mint ephemeral token' }));
        }
      });
    },
  };
}
