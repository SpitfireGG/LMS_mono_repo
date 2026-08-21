import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  Square,
  GraduationCap,
  AlertCircle,
  Volume2,
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { useLiveInterpreterSession } from "../hooks/useLiveInterpreterSession";
import { extractPdfText, type ExtractedPdf } from "../lib/pdf";

export default function MockTestView() {
  const { status, statusLabel, transcript, error, isActive, start, stop } =
    useLiveInterpreterSession();
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Uploaded document state.
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ExtractedPdf | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setParseError("Please choose a PDF file.");
      return;
    }
    setParseError(null);
    setParsed(null);
    setFileName(file.name);
    setParsing(true);
    try {
      const result = await extractPdfText(file);
      if (!result.text) {
        setParseError(
          "Couldn't read any text from this PDF (it may be scanned/image-only).",
        );
        setFileName(null);
      } else {
        setParsed(result);
      }
    } catch {
      setParseError("Failed to read this PDF. Try a different file.");
      setFileName(null);
    } finally {
      setParsing(false);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setParsed(null);
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const beginTest = () => {
    if (!parsed) return;
    start({ text: parsed.text, fileName: fileName ?? undefined });
  };

  const orbState =
    status === "ai-speaking"
      ? "ai"
      : status === "your-turn" || status === "listening"
        ? "candidate"
        : "idle";

  const showSetup = !isActive; // upload + start are shown when not in a live session

  return (
    <div className="max-w-4xl mx-auto px-2 py-2">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-accent text-[12px] font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4" />
          Speaking Mock Test
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          PDF-based Mock Test
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Upload any PDF and an AI examiner runs an IELTS-style spoken test on it.
        </p>
      </div>

      {/* Document upload (only before/between sessions) */}
      {showSetup && (
        <div className="mb-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {!parsed ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={parsing}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className="w-full border-2 border-dashed border-zinc-800 hover:border-accent/60 rounded-2xl py-10 px-6 flex flex-col items-center gap-3 transition-colors cursor-pointer disabled:cursor-wait"
            >
              {parsing ? (
                <>
                  <Loader2 className="w-7 h-7 text-accent animate-spin" />
                  <span className="text-sm font-semibold text-zinc-200">
                    Reading {fileName}…
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-7 h-7 text-zinc-500" />
                  <span className="text-sm font-semibold text-zinc-200">
                    Upload a PDF to test on
                  </span>
                  <span className="text-xs text-zinc-500">
                    Click to browse or drag &amp; drop · text PDFs only
                  </span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800/80 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dark/20 text-accent flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {fileName}
                </p>
                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {parsed.pageCount} page{parsed.pageCount === 1 ? "" : "s"} ready
                  {parsed.truncated ? " · trimmed to fit" : ""}
                </p>
              </div>
              <button
                onClick={clearFile}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {parseError && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {parseError}
            </div>
          )}
        </div>
      )}

      {/* Stage */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-8 flex flex-col items-center">
        {/* Mic orb */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          <AnimatePresence>
            {isActive && (
              <motion.div
                key="pulse"
                className={`absolute inset-0 rounded-full ${
                  orbState === "ai" ? "bg-accent/20" : "bg-emerald-500/20"
                }`}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.25, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
          <div
            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-colors duration-300 shadow-xl ${
              orbState === "ai"
                ? "bg-accent-dark text-white shadow-accent-dark/30"
                : orbState === "candidate"
                  ? "bg-emerald-600 text-white shadow-emerald-600/30"
                  : "bg-zinc-900 text-zinc-500"
            }`}
          >
            {orbState === "ai" ? (
              <Volume2 className="w-10 h-10" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </div>
        </div>

        {/* Status label */}
        <div className="text-center mb-6 h-6">
          <span
            className={`text-sm font-semibold ${
              status === "error" ? "text-red-400" : "text-zinc-200"
            }`}
          >
            {isActive || status === "ended" || status === "error"
              ? statusLabel
              : parsed
                ? "Ready when you are"
                : "Upload a PDF to begin"}
          </span>
        </div>

        {/* Controls */}
        {!isActive ? (
          <button
            onClick={beginTest}
            disabled={!parsed}
            className="px-6 py-3 rounded-xl bg-accent-dark hover:bg-accent text-white font-bold text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-accent-dark/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Mic className="w-4 h-4" />
            {status === "ended" ? "Restart test" : "Start test"}
          </button>
        ) : (
          <button
            onClick={stop}
            className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm transition-colors cursor-pointer flex items-center gap-2"
            disabled={status === "connecting"}
          >
            <Square className="w-4 h-4 fill-current" />
            End test
          </button>
        )}

        {error && (
          <div className="mt-5 flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* How it works */}
      {status === "idle" && (
        <p className="text-zinc-500 text-xs text-center mt-4 max-w-md mx-auto">
          The examiner studies your PDF and asks a question, then a beep signals
          your turn — answer aloud. Another beep, and it continues. At the end you
          get a band score and feedback. Allow microphone access when prompted.
        </p>
      )}

      {/* Transcript */}
      {transcript.length > 0 && (
        <div className="mt-6 bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 mb-4">
            Transcript
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {transcript.map((entry, i) => (
              <div
                key={i}
                className={`flex ${entry.role === "candidate" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    entry.role === "ai"
                      ? "bg-zinc-900 text-zinc-200 rounded-tl-sm"
                      : "bg-accent-dark/80 text-white rounded-tr-sm"
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">
                    {entry.role === "ai" ? "Examiner" : "You"}
                  </span>
                  {entry.text}
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
