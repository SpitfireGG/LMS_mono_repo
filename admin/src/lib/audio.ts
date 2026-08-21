// Web Audio helpers for the Live API session: microphone capture (16kHz PCM in),
// model audio playback (24kHz PCM out), and a buzzer cue for turn handoffs.
import { INPUT_SAMPLE_RATE, OUTPUT_SAMPLE_RATE } from './liveConfig';

// --- base64 <-> bytes --------------------------------------------------------
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// --- Microphone capture ------------------------------------------------------
// Captures mic audio, downsamples to 16kHz mono, converts to 16-bit PCM and emits
// base64 chunks ready for session.sendRealtimeInput({ audio: { data, mimeType } }).
export class MicCapture {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;

  async start(onChunk: (base64Pcm: string) => void): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    });
    this.ctx = new AudioContext();
    this.source = this.ctx.createMediaStreamSource(this.stream);
    // ScriptProcessor is deprecated but universally supported and adequate here.
    this.processor = this.ctx.createScriptProcessor(4096, 1, 1);

    const inputRate = this.ctx.sampleRate;
    this.processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcm16 = floatTo16kPcm(input, inputRate);
      if (pcm16.byteLength > 0) onChunk(bytesToBase64(new Uint8Array(pcm16.buffer)));
    };

    this.source.connect(this.processor);
    // Connect to destination so the processor is pulled; gain 0 keeps it silent.
    const sink = this.ctx.createGain();
    sink.gain.value = 0;
    this.processor.connect(sink);
    sink.connect(this.ctx.destination);
  }

  stop(): void {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());
    this.ctx?.close();
    this.processor = null;
    this.source = null;
    this.stream = null;
    this.ctx = null;
  }
}

// Downsample a Float32 buffer (at inputRate) to 16kHz and encode as little-endian
// 16-bit PCM.
function floatTo16kPcm(input: Float32Array, inputRate: number): Int16Array {
  const ratio = inputRate / INPUT_SAMPLE_RATE;
  const outLength = Math.floor(input.length / ratio);
  const out = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const sample = input[Math.floor(i * ratio)];
    const clamped = Math.max(-1, Math.min(1, sample));
    out[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }
  return out;
}

// --- Model audio playback ----------------------------------------------------
// Schedules incoming 24kHz PCM chunks back-to-back for gapless playback, and
// reports when the queue drains (used to detect the AI finished speaking).
export class PlaybackQueue {
  private ctx: AudioContext;
  private nextStartTime = 0;
  private active = new Set<AudioBufferSourceNode>();
  onDrained: (() => void) | null = null;

  constructor() {
    this.ctx = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
  }

  enqueue(base64Pcm: string): void {
    const bytes = base64ToBytes(base64Pcm);
    const pcm16 = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
    const buffer = this.ctx.createBuffer(1, pcm16.length, OUTPUT_SAMPLE_RATE);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < pcm16.length; i++) channel[i] = pcm16[i] / 0x8000;

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    const startAt = Math.max(now, this.nextStartTime);
    src.start(startAt);
    this.nextStartTime = startAt + buffer.duration;

    this.active.add(src);
    src.onended = () => {
      this.active.delete(src);
      if (this.active.size === 0) this.onDrained?.();
    };
  }

  /** Stop everything immediately (e.g. on barge-in / interruption). */
  clear(): void {
    this.active.forEach((s) => {
      try { s.stop(); } catch { /* already stopped */ }
    });
    this.active.clear();
    this.nextStartTime = 0;
  }

  get isPlaying(): boolean {
    return this.active.size > 0;
  }

  async close(): Promise<void> {
    this.clear();
    await this.ctx.close();
  }
}

// --- Buzzer ------------------------------------------------------------------
// Short synthesized beep marking a turn handoff. No audio asset required.
let buzzerCtx: AudioContext | null = null;

export function playBuzzer(): void {
  buzzerCtx ||= new AudioContext();
  const ctx = buzzerCtx;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.25, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.2);
}
