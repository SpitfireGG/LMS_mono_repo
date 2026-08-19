"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { assetUrl } from "@/app/lib/api/client";
import { useIsAuthenticated } from "@/app/lib/auth";
import {
  useMockTestBySlug,
  useMyAttempts,
  useSaveAttempt,
  useDeleteAttempt,
} from "@/app/lib/api/hooks";

const SPEEDS = [0.75, 1, 1.25, 1.5];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatBytes(bytes?: number | null): string {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

/* ── Recording hook ──────────────────────────────────────────────── */

interface RecorderState {
  supported: boolean;
  recording: boolean;
  seconds: number;
  level: number;
  blob: Blob | null;
  error: string;
}

function useRecorder() {
  const [state, setState] = useState<RecorderState>({
    supported: true,
    recording: false,
    seconds: 0,
    level: 0,
    blob: null,
    error: "",
  });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setState((s) => ({
      ...s,
      supported:
        typeof window !== "undefined" &&
        typeof window.MediaRecorder !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia,
    }));
  }, []);

  const teardown = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (tickRef.current) window.clearInterval(tickRef.current);
    rafRef.current = null;
    tickRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => undefined);
    audioCtxRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const start = useCallback(async () => {
    setState((s) => ({ ...s, error: "", blob: null, seconds: 0 }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      // Live input level, so a dead microphone is obvious before you speak.
      const AudioCtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const buffer = new Uint8Array(analyser.frequencyBinCount);

      const sample = () => {
        analyser.getByteTimeDomainData(buffer);
        let peak = 0;
        for (let i = 0; i < buffer.length; i++) {
          peak = Math.max(peak, Math.abs(buffer[i] - 128) / 128);
        }
        setState((s) => (s.recording ? { ...s, level: peak } : s));
        rafRef.current = requestAnimationFrame(sample);
      };
      rafRef.current = requestAnimationFrame(sample);

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setState((s) => ({ ...s, recording: false, level: 0, blob }));
        teardown();
      };

      recorder.start(250);
      recorderRef.current = recorder;

      const startedAt = Date.now();
      tickRef.current = window.setInterval(() => {
        setState((s) => ({ ...s, seconds: (Date.now() - startedAt) / 1000 }));
      }, 200);

      setState((s) => ({ ...s, recording: true }));
    } catch (error) {
      teardown();
      setState((s) => ({
        ...s,
        recording: false,
        error:
          error instanceof DOMException && error.name === "NotAllowedError"
            ? "Microphone access was blocked. Allow it in your browser settings to record."
            : "Could not start recording. Check that a microphone is connected.",
      }));
    }
  }, [teardown]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, []);

  const discard = useCallback(() => {
    setState((s) => ({ ...s, blob: null, seconds: 0 }));
  }, []);

  return { ...state, start, stop, discard };
}

/* ── Icons ───────────────────────────────────────────────────────── */

const Icon = {
  play: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  ),
  pause: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
    </svg>
  ),
  back: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 4L4 11l7 7" /><path d="M4 11h9a7 7 0 010 14h-1" />
    </svg>
  ),
  forward: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M13 4l7 7-7 7" /><path d="M20 11h-9a7 7 0 000 14h1" />
    </svg>
  ),
  mic: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" />
    </svg>
  ),
  stop: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  ),
};

/* ── Player ──────────────────────────────────────────────────────── */

export default function PracticePlayer({ slug }: { slug: string }) {
  const { data: session, isLoading, error } = useMockTestBySlug(slug);
  const isAuthenticated = useIsAuthenticated();

  const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showPdf, setShowPdf] = useState(true);
  const [saveError, setSaveError] = useState("");

  const recorder = useRecorder();
  const saveAttempt = useSaveAttempt();
  const deleteAttempt = useDeleteAttempt();
  const { data: attempts } = useMyAttempts(session?.id);

  const pdfHref = assetUrl(session?.pdfUrl);
  const mediaHref = assetUrl(session?.mediaUrl);
  const isVideo = !!session?.mediaMimeType?.startsWith("video/");

  const recordingUrl = useMemo(
    () => (recorder.blob ? URL.createObjectURL(recorder.blob) : null),
    [recorder.blob]
  );
  useEffect(() => {
    return () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    };
  }, [recordingUrl]);

  const toggle = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }, []);

  const seekBy = useCallback((delta: number) => {
    const el = mediaRef.current;
    if (!el) return;
    el.currentTime = Math.min(Math.max(el.currentTime + delta, 0), el.duration || 0);
  }, []);

  /** Starts the brief and the recording together — one button for a full run. */
  const startRun = useCallback(async () => {
    const el = mediaRef.current;
    if (el) {
      el.currentTime = 0;
      await el.play().catch(() => undefined);
    }
    await recorder.start();
  }, [recorder]);

  const finishRun = useCallback(() => {
    recorder.stop();
    mediaRef.current?.pause();
  }, [recorder]);

  // Keyboard shortcuts, skipped while typing in a field.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      if (event.code === "Space") {
        event.preventDefault();
        toggle();
      } else if (event.code === "ArrowLeft") {
        seekBy(-10);
      } else if (event.code === "ArrowRight") {
        seekBy(10);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, seekBy]);

  const persist = async () => {
    if (!recorder.blob || !session) return;
    setSaveError("");
    try {
      await saveAttempt.mutateAsync({
        mockTestId: session.id,
        recording: recorder.blob,
        durationSeconds: recorder.seconds,
      });
      recorder.discard();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save that recording.");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1320px] px-[60px] max-sm:px-[20px]">
        <div className="grid grid-cols-[1fr_390px] gap-[22px] max-lg:grid-cols-1">
          <div className="h-[680px] animate-pulse rounded-[20px] bg-white/70" />
          <div className="h-[420px] animate-pulse rounded-[20px] bg-white/70" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-[20px] text-center">
        <p className="text-[20px] font-medium text-[#0a4a29]">That practice session isn&apos;t available</p>
        <p className="mt-[8px] text-[15px] text-[#566b5d]">It may be unpublished or renamed.</p>
        <Link href="/practice" className="mt-[22px] inline-block rounded-[12px] bg-[#0a4a29] px-[20px] py-[11px] text-[14px] font-medium text-white no-underline hover:bg-[#056839]">
          All practice sessions
        </Link>
      </div>
    );
  }

  const locked = session.locked && !isAuthenticated;
  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-[1320px] px-[60px] max-sm:px-[20px]">
      {/* Header */}
      <div className="mb-[20px] flex flex-wrap items-end justify-between gap-[16px]">
        <div>
          <nav className="flex items-center gap-[8px] text-[14px] text-[#566b5d]" aria-label="Breadcrumb">
            <Link href="/practice" className="hover:text-[#056839]">Practice</Link>
            <span aria-hidden>/</span>
            <span className="font-medium text-[#0a4a29]">{session.title}</span>
          </nav>
          <h1 className="mt-[10px] text-[30px]/[1.15] font-medium tracking-[-0.02em] text-[#0a4a29] max-sm:text-[24px]">
            {session.title}
          </h1>
          <div className="mt-[8px] flex flex-wrap items-center gap-[8px] text-[13.5px] text-[#566b5d]">
            <span className="rounded-full bg-[#e8f6ee] px-[10px] py-[3px] font-medium text-[#056839]">
              {session.language}
            </span>
            <span className="rounded-full bg-[#eef4ee] px-[10px] py-[3px] capitalize">{session.category}</span>
            <span className="rounded-full bg-[#eef4ee] px-[10px] py-[3px]">
              {session.kind === "INTERVIEW" ? "Mock interview" : "Mock test"}
            </span>
            {session.durationSeconds ? <span>{formatTime(session.durationSeconds)}</span> : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPdf((v) => !v)}
          className="rounded-[12px] border border-[#cfe3d6] bg-white px-[16px] py-[10px] text-[14px] font-medium text-[#0a4a29] transition-colors hover:bg-[#e8f6ee] cursor-pointer max-lg:hidden"
        >
          {showPdf ? "Hide script" : "Show script"}
        </button>
      </div>

      {locked ? (
        <div className="rounded-[20px] border border-[#f0d9a8] bg-[#fdf6e6] p-[28px] text-center">
          <p className="text-[17px] font-medium text-[#7a5a1e]">Log in to open this session</p>
          <p className="mt-[6px] text-[15px] text-[#7a5a1e]">
            Free sessions play without an account — this one needs you signed in.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(`/practice/${slug}`)}`}
            className="mt-[18px] inline-block rounded-[12px] bg-[#0a4a29] px-[20px] py-[11px] text-[14px] font-medium text-white no-underline hover:bg-[#056839]"
          >
            Log in
          </Link>
        </div>
      ) : (
        <div className={cn("grid gap-[22px] items-start", showPdf ? "grid-cols-[1fr_390px] max-lg:grid-cols-1" : "grid-cols-1")}>
          {/* ── Script ─────────────────────────────────────── */}
          {showPdf && (
            <section className="overflow-hidden rounded-[20px] border border-[#dbe6dd] bg-white shadow-[var(--shadow-e1)]">
              <header className="flex items-center justify-between gap-[12px] border-b border-[#e6efe8] px-[18px] py-[12px]">
                <p className="text-[14px] font-semibold text-[#0a4a29]">
                  Script &amp; questions
                  {session.pdfName && (
                    <span className="ml-[8px] font-normal text-[#8a988e]">{session.pdfName}</span>
                  )}
                </p>
                {pdfHref && (
                  <a
                    href={pdfHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[13px] font-medium text-[#056839] no-underline hover:underline"
                  >
                    Open in new tab
                  </a>
                )}
              </header>

              {pdfHref ? (
                /* The browser's native viewer — no PDF library to download. */
                <object
                  data={`${pdfHref}#view=FitH&toolbar=1`}
                  type="application/pdf"
                  className="block h-[760px] w-full max-lg:h-[520px]"
                  aria-label={`${session.title} script`}
                >
                  <div className="p-[24px] text-center text-[15px] text-[#566b5d]">
                    Your browser can&apos;t display PDFs inline.{" "}
                    <a href={pdfHref} className="font-medium text-[#056839]" target="_blank" rel="noopener noreferrer">
                      Open the script
                    </a>
                    .
                  </div>
                </object>
              ) : (
                <p className="p-[28px] text-center text-[15px] text-[#8a988e]">
                  No script was attached to this session.
                </p>
              )}
            </section>
          )}

          {/* ── Playback + recording ───────────────────────── */}
          <aside className="flex flex-col gap-[18px] lg:sticky lg:top-[16px]">
            <section className="rounded-[20px] border border-[#dbe6dd] bg-white p-[20px] shadow-[var(--shadow-e1)]">
              <p className="text-[14px] font-semibold text-[#0a4a29]">Audio brief</p>

              {mediaHref ? (
                <>
                  {isVideo ? (
                    <video
                      ref={mediaRef}
                      src={mediaHref}
                      preload="metadata"
                      playsInline
                      className="mt-[12px] w-full rounded-[14px] bg-black"
                      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                      onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      onEnded={() => setPlaying(false)}
                    />
                  ) : (
                    <audio
                      ref={mediaRef}
                      src={mediaHref}
                      preload="metadata"
                      className="hidden"
                      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                      onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      onEnded={() => setPlaying(false)}
                    />
                  )}

                  {/* Scrubber */}
                  <label className="sr-only" htmlFor="seek">Seek</label>
                  <input
                    id="seek"
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={current}
                    onChange={(e) => {
                      const el = mediaRef.current;
                      if (el) el.currentTime = Number(e.target.value);
                      setCurrent(Number(e.target.value));
                    }}
                    className="mt-[14px] w-full accent-[#056839]"
                    style={{ background: `linear-gradient(to right, #cfe3d6 ${progress}%, #eef4ee ${progress}%)` }}
                  />
                  <div className="mt-[4px] flex justify-between text-[12.5px] tabular-nums text-[#8a988e]">
                    <span>{formatTime(current)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  <div className="mt-[12px] flex items-center gap-[10px]">
                    <button type="button" onClick={() => seekBy(-10)} aria-label="Back 10 seconds"
                      className="grid h-[38px] w-[38px] place-items-center rounded-full border border-[#cfe3d6] text-[#0a4a29] transition-colors hover:bg-[#e8f6ee] cursor-pointer">
                      {Icon.back}
                    </button>
                    <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"}
                      className="grid h-[48px] w-[48px] place-items-center rounded-full bg-[#0a4a29] text-white transition-colors hover:bg-[#056839] cursor-pointer">
                      {playing ? Icon.pause : Icon.play}
                    </button>
                    <button type="button" onClick={() => seekBy(10)} aria-label="Forward 10 seconds"
                      className="grid h-[38px] w-[38px] place-items-center rounded-full border border-[#cfe3d6] text-[#0a4a29] transition-colors hover:bg-[#e8f6ee] cursor-pointer">
                      {Icon.forward}
                    </button>

                    <select
                      value={speed}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setSpeed(next);
                        if (mediaRef.current) mediaRef.current.playbackRate = next;
                      }}
                      aria-label="Playback speed"
                      className="ml-auto rounded-[10px] border border-[#cfe3d6] bg-white px-[10px] py-[8px] text-[13px] font-medium text-[#0a4a29] cursor-pointer"
                    >
                      {SPEEDS.map((s) => (
                        <option key={s} value={s}>{s}×</option>
                      ))}
                    </select>
                  </div>

                  <p className="mt-[10px] text-[12px] text-[#8a988e]">
                    Space plays and pauses · ← → skip 10 seconds
                  </p>
                </>
              ) : (
                <p className="mt-[12px] text-[14px] text-[#8a988e]">No audio was attached to this session.</p>
              )}
            </section>

            {/* Recorder */}
            <section className="rounded-[20px] border border-[#dbe6dd] bg-white p-[20px] shadow-[var(--shadow-e1)]">
              <p className="text-[14px] font-semibold text-[#0a4a29]">Your interpretation</p>
              <p className="mt-[4px] text-[13px]/[1.5] text-[#566b5d]">
                Start the run to play the brief and record yourself at the same time.
              </p>

              {!recorder.supported ? (
                <p className="mt-[12px] rounded-[10px] bg-[#fbeee9] px-[12px] py-[9px] text-[13px] text-[#c0603e]">
                  This browser can&apos;t record audio. Try Chrome, Edge or Firefox.
                </p>
              ) : (
                <>
                  <div className="mt-[14px] flex items-center gap-[10px]">
                    {recorder.recording ? (
                      <button type="button" onClick={finishRun}
                        className="inline-flex flex-1 items-center justify-center gap-[8px] rounded-[13px] bg-[#c0603e] px-[16px] py-[12px] text-[14.5px] font-medium text-white transition-colors hover:bg-[#a94f30] cursor-pointer">
                        {Icon.stop} Stop · {formatTime(recorder.seconds)}
                      </button>
                    ) : (
                      <button type="button" onClick={startRun}
                        className="inline-flex flex-1 items-center justify-center gap-[8px] rounded-[13px] bg-[#0a4a29] px-[16px] py-[12px] text-[14.5px] font-medium text-white transition-colors hover:bg-[#056839] cursor-pointer">
                        {Icon.mic} Start the run
                      </button>
                    )}
                  </div>

                  {/* Live input level */}
                  {recorder.recording && (
                    <div className="mt-[12px]">
                      <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#eef4ee]">
                        <div
                          className="h-full rounded-full bg-[#50bc7e] transition-[width] duration-75"
                          style={{ width: `${Math.min(100, Math.round(recorder.level * 140))}%` }}
                        />
                      </div>
                      <p className="mt-[6px] text-[12px] text-[#8a988e]">
                        {recorder.level < 0.02 ? "No sound detected — check your microphone" : "Recording…"}
                      </p>
                    </div>
                  )}

                  {recorder.error && (
                    <p className="mt-[12px] rounded-[10px] bg-[#fbeee9] px-[12px] py-[9px] text-[13px] text-[#c0603e]">
                      {recorder.error}
                    </p>
                  )}

                  {recordingUrl && !recorder.recording && (
                    <div className="mt-[14px] rounded-[14px] bg-[#f2f8f4] p-[14px]">
                      <p className="text-[13px] font-medium text-[#0a4a29]">
                        Take recorded · {formatTime(recorder.seconds)}
                      </p>
                      <audio src={recordingUrl} controls className="mt-[10px] w-full" />
                      <div className="mt-[12px] flex flex-wrap gap-[8px]">
                        {isAuthenticated ? (
                          <button type="button" onClick={persist} disabled={saveAttempt.isPending}
                            className="rounded-[11px] bg-[#056839] px-[14px] py-[9px] text-[13.5px] font-medium text-white transition-colors hover:bg-[#0a4a29] cursor-pointer disabled:opacity-60">
                            {saveAttempt.isPending ? "Saving…" : "Save to my recordings"}
                          </button>
                        ) : (
                          <Link href={`/login?next=${encodeURIComponent(`/practice/${slug}`)}`}
                            className="rounded-[11px] bg-[#056839] px-[14px] py-[9px] text-[13.5px] font-medium text-white no-underline hover:bg-[#0a4a29]">
                            Log in to save
                          </Link>
                        )}
                        <a href={recordingUrl} download={`${session.slug}-take.webm`}
                          className="rounded-[11px] border border-[#cfe3d6] bg-white px-[14px] py-[9px] text-[13.5px] font-medium text-[#0a4a29] no-underline hover:bg-[#e8f6ee]">
                          Download
                        </a>
                        <button type="button" onClick={recorder.discard}
                          className="rounded-[11px] border border-[#e6dcd6] bg-white px-[14px] py-[9px] text-[13.5px] font-medium text-[#8a988e] transition-colors hover:border-[#c0603e] hover:text-[#c0603e] cursor-pointer">
                          Discard
                        </button>
                      </div>
                      {saveError && <p className="mt-[10px] text-[13px] text-[#c0603e]">{saveError}</p>}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Saved takes */}
            {isAuthenticated && attempts && attempts.length > 0 && (
              <section className="rounded-[20px] border border-[#dbe6dd] bg-white p-[20px] shadow-[var(--shadow-e1)]">
                <p className="text-[14px] font-semibold text-[#0a4a29]">
                  Saved takes <span className="font-normal text-[#8a988e]">({attempts.length})</span>
                </p>
                <ul className="mt-[12px] flex flex-col gap-[12px]">
                  {attempts.map((attempt) => (
                    <li key={attempt.id} className="rounded-[12px] bg-[#f7faf6] p-[12px]">
                      <div className="flex items-center justify-between gap-[10px]">
                        <span className="text-[13px] text-[#566b5d] tabular-nums">
                          {new Date(attempt.createdAt).toLocaleString()} ·{" "}
                          {formatTime(attempt.durationSeconds ?? 0)} · {formatBytes(attempt.recordingSize)}
                        </span>
                        <button type="button" onClick={() => deleteAttempt.mutate(attempt.id)}
                          aria-label="Delete recording"
                          className="shrink-0 text-[12.5px] font-medium text-[#8a988e] transition-colors hover:text-[#c0603e] cursor-pointer">
                          Delete
                        </button>
                      </div>
                      {attempt.recordingUrl && (
                        <audio src={assetUrl(attempt.recordingUrl)} controls preload="none" className="mt-[8px] w-full" />
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
