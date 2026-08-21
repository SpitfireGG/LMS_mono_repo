import { useCallback, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import {
  LIVE_MODEL,
  LIVE_VOICE,
  buildSystemInstruction,
  type TestSource,
} from '../lib/liveConfig';
import { MicCapture, PlaybackQueue, playBuzzer } from '../lib/audio';

export type SessionStatus =
  | 'idle'
  | 'connecting'
  | 'ai-speaking'
  | 'your-turn'
  | 'listening'
  | 'ended'
  | 'error';

export interface TranscriptEntry {
  role: 'ai' | 'candidate';
  text: string;
}

const STATUS_LABEL: Record<SessionStatus, string> = {
  idle: 'Ready',
  connecting: 'Connecting…',
  'ai-speaking': 'Examiner speaking',
  'your-turn': 'Your turn — answer now',
  listening: 'Listening…',
  ended: 'Session ended',
  error: 'Something went wrong',
};

export function useLiveInterpreterSession() {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mutable session state kept in refs so callbacks always see the latest value.
  const sessionRef = useRef<any>(null);
  const micRef = useRef<MicCapture | null>(null);
  const playbackRef = useRef<PlaybackQueue | null>(null);
  const turnCompleteRef = useRef(false); // model signalled end-of-turn
  const candidateTurnRef = useRef(false); // waiting on / hearing the candidate

  const appendTranscript = useCallback((role: TranscriptEntry['role'], delta: string) => {
    if (!delta) return;
    setTranscript((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === role) {
        return [...prev.slice(0, -1), { role, text: last.text + delta }];
      }
      return [...prev, { role, text: delta }];
    });
  }, []);

  const stop = useCallback(() => {
    micRef.current?.stop();
    playbackRef.current?.close();
    try { sessionRef.current?.close(); } catch { /* noop */ }
    micRef.current = null;
    playbackRef.current = null;
    sessionRef.current = null;
    setStatus((s) => (s === 'error' ? s : 'ended'));
  }, []);

  const start = useCallback(async (source: TestSource) => {
    setError(null);
    setTranscript([]);
    setStatus('connecting');
    try {
      // 1. Mint an ephemeral token server-side; the API key never reaches the browser.
      const res = await fetch('/api/live-token');
      if (!res.ok) throw new Error('Could not get a session token');
      const { token } = await res.json();

      const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: 'v1alpha' } });

      // 2. Playback queue: when the model's audio drains AND its turn is complete,
      //    that is the AI→candidate handoff — beep and hand the floor over.
      const playback = new PlaybackQueue();
      playback.onDrained = () => {
        if (turnCompleteRef.current) {
          turnCompleteRef.current = false;
          candidateTurnRef.current = true;
          playBuzzer();
          setStatus('your-turn');
        }
      };
      playbackRef.current = playback;

      // 3. Open the live session.
      const session = await ai.live.connect({
        model: LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: buildSystemInstruction(source),
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: LIVE_VOICE } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            // The kickoff message is sent after connect() resolves (below), not
            // here — `session` is still being assigned while this fires.
          },
          onmessage: (message: any) => {
            const sc = message.serverContent;
            if (!sc) return;

            // Candidate barged in while the AI was talking.
            if (sc.interrupted) {
              playback.clear();
              setStatus('listening');
            }

            // Audio from the model.
            const parts = sc.modelTurn?.parts ?? [];
            for (const part of parts) {
              const data = part.inlineData?.data;
              if (data) {
                // Candidate→AI handoff: first chunk of a new model turn.
                if (candidateTurnRef.current) {
                  candidateTurnRef.current = false;
                  playBuzzer();
                }
                setStatus('ai-speaking');
                playback.enqueue(data);
              }
            }

            // Live transcripts for the on-screen panel.
            if (sc.outputTranscription?.text) appendTranscript('ai', sc.outputTranscription.text);
            if (sc.inputTranscription?.text) {
              appendTranscript('candidate', sc.inputTranscription.text);
              if (!playback.isPlaying) setStatus('listening');
            }

            // Model finished its turn; the drain handler fires the handoff buzzer.
            if (sc.turnComplete) {
              turnCompleteRef.current = true;
              if (!playback.isPlaying) playback.onDrained?.();
            }
          },
          onerror: (e: any) => {
            console.error('[live] error', e);
            setError(e?.message || 'Live session error');
            setStatus('error');
          },
          onclose: (e: any) => {
            // Surface the WebSocket close code/reason — this is what tells us
            // *why* Gemini dropped the session (bad model, quota, bad config…).
            console.warn('[live] closed', { code: e?.code, reason: e?.reason });
            if (e?.reason) {
              setError(`Session closed: ${e.reason}`);
              setStatus('error');
              return;
            }
            setStatus((s) => (s === 'error' ? s : 'ended'));
          },
        },
      });
      sessionRef.current = session;

      // Kick the examiner off now that the session is fully established.
      session.sendClientContent({
        turns: [{ role: 'user', parts: [{ text: 'Please begin the mock test now.' }] }],
      });

      // 4. Stream the microphone to the model.
      const mic = new MicCapture();
      micRef.current = mic;
      await mic.start((base64Pcm) => {
        sessionRef.current?.sendRealtimeInput({
          audio: { data: base64Pcm, mimeType: 'audio/pcm;rate=16000' },
        });
      });
    } catch (e: any) {
      setError(e?.message || 'Failed to start the session');
      setStatus('error');
      stop();
    }
  }, [appendTranscript, stop]);

  return {
    status,
    statusLabel: STATUS_LABEL[status],
    transcript,
    error,
    isActive: status !== 'idle' && status !== 'ended' && status !== 'error',
    start,
    stop,
  };
}
