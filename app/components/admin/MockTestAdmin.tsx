"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { useSession } from "@/app/lib/auth";
import { assetUrl } from "@/app/lib/api/client";
import {
  useAdminMockTests,
  useCreateMockTest,
  useUpdateMockTest,
  useDeleteMockTest,
} from "@/app/lib/api/hooks";
import type { MockTestItem, MockTestKind, PublishStatus } from "@/app/lib/api/types";

const LANGUAGES = [
  "Nepali", "Hindi", "Punjabi", "Urdu", "Bangla", "Tamil", "Telugu", "Gujarati",
  "Malayalam", "Sinhala", "Mandarin", "Cantonese", "Vietnamese", "Arabic",
  "Persian", "Filipino", "Korean", "Japanese", "Spanish", "Swahili", "Malay",
];

const CATEGORIES = [
  "health", "legal", "immigration", "education", "social", "financial",
  "housing", "employment", "community", "general",
];

const MAX_PDF_MB = 25;
const MAX_MEDIA_MB = 512;

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

/** Reads the duration straight from the file, so the admin never types it. */
function readDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(probe.duration) ? probe.duration : undefined);
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(undefined);
    };
    probe.src = url;
  });
}

/* ── File drop zone ──────────────────────────────────────────────── */

function FileDrop({
  label,
  hint,
  accept,
  file,
  onSelect,
  maxMb,
  existing,
}: {
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  onSelect: (file: File | null) => void;
  maxMb: number;
  existing?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const take = (candidate: File | undefined) => {
    if (!candidate) return;
    if (candidate.size > maxMb * 1024 * 1024) {
      setError(`That file is ${formatBytes(candidate.size)} — the limit is ${maxMb} MB.`);
      return;
    }
    setError("");
    onSelect(candidate);
  };

  return (
    <div>
      <p className="mb-[7px] text-[13.5px] font-medium text-[#0a4a29]">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          take(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[14px] border-2 border-dashed px-[16px] py-[22px] text-center transition-colors",
          dragging ? "border-[#50bc7e] bg-[#e8f6ee]" : "border-[#cfe3d6] bg-[#fbfdfb] hover:border-[#9ec7ac]"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => take(e.target.files?.[0])}
        />
        {file ? (
          <>
            <p className="text-[14px] font-medium text-[#0a4a29]">{file.name}</p>
            <p className="mt-[3px] text-[12.5px] text-[#566b5d]">{formatBytes(file.size)}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="mt-[8px] text-[12.5px] font-medium text-[#c0603e] hover:underline cursor-pointer"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <p className="text-[14px] font-medium text-[#0a4a29]">Drop a file or click to browse</p>
            <p className="mt-[3px] text-[12.5px] text-[#8a988e]">{hint}</p>
            {existing && (
              <a
                href={assetUrl(existing)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-[8px] text-[12.5px] font-medium text-[#056839] hover:underline"
              >
                Current file attached — view
              </a>
            )}
          </>
        )}
      </div>
      {error && <p className="mt-[6px] text-[12.5px] text-[#c0603e]">{error}</p>}
    </div>
  );
}

/* ── Admin screen ────────────────────────────────────────────────── */

const emptyForm = {
  title: "",
  description: "",
  language: "Nepali",
  category: "health",
  level: "All Levels",
  kind: "MOCK_TEST" as MockTestKind,
  status: "PUBLISHED" as PublishStatus,
  isFree: false,
  sortOrder: 0,
};

export default function MockTestAdmin() {
  const session = useSession();
  const [form, setForm] = useState(emptyForm);
  const [pdf, setPdf] = useState<File | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading } = useAdminMockTests({ limit: 50 });
  const create = useCreateMockTest();
  const update = useUpdateMockTest();
  const remove = useDeleteMockTest();

  const busy = create.isPending || update.isPending;
  const sessions = data?.data ?? [];

  if (session && session.user.role !== "admin") {
    return (
      <Shell>
        <p className="text-[17px] font-medium text-[#0a4a29]">Admins only</p>
        <p className="mt-[8px] text-[15px] text-[#566b5d]">
          You&apos;re signed in as {session.user.email}, which isn&apos;t an admin account.
        </p>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <p className="text-[17px] font-medium text-[#0a4a29]">Log in to manage practice sessions</p>
        <Link
          href="/login?next=%2Fadmin%2Fmock-tests"
          className="mt-[18px] inline-block rounded-[12px] bg-[#0a4a29] px-[20px] py-[11px] text-[14px] font-medium text-white no-underline hover:bg-[#056839]"
        >
          Log in
        </Link>
      </Shell>
    );
  }

  const reset = () => {
    setForm(emptyForm);
    setPdf(null);
    setMedia(null);
    setEditingId(null);
    setProgress(0);
  };

  const edit = (item: MockTestItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description ?? "",
      language: item.language,
      category: item.category,
      level: item.level,
      kind: item.kind,
      status: item.status,
      isFree: item.isFree,
      sortOrder: item.sortOrder,
    });
    setPdf(null);
    setMedia(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Give the session a title.");
      return;
    }
    if (!editingId && (!pdf || !media)) {
      setError("A new session needs both a PDF and an audio or video file.");
      return;
    }

    const durationSeconds = media ? await readDuration(media) : undefined;
    const input = { ...form, description: form.description || undefined, durationSeconds };
    const files = { pdf: pdf ?? undefined, media: media ?? undefined };

    try {
      if (editingId) {
        await update.mutateAsync({
          id: editingId,
          input,
          files,
          onProgress: (p) => setProgress(p.percent),
        });
        setMessage("Session updated.");
      } else {
        await create.mutateAsync({
          input,
          files,
          onProgress: (p) => setProgress(p.percent),
        });
        setMessage("Session published.");
      }
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setProgress(0);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-[60px] max-sm:px-[20px]">
      <div className="grid grid-cols-[minmax(0,1fr)_420px] items-start gap-[28px] max-lg:grid-cols-1">
        {/* ── Existing sessions ─────────────────────────── */}
        <section>
          <h2 className="text-[20px] font-medium text-[#0a4a29]">
            Practice sessions{" "}
            <span className="text-[15px] font-normal text-[#8a988e]">({data?.meta.total ?? 0})</span>
          </h2>

          {isLoading ? (
            <div className="mt-[16px] flex flex-col gap-[10px]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[74px] animate-pulse rounded-[14px] bg-white/70" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="mt-[16px] rounded-[16px] border border-dashed border-[#cfe3d6] bg-white p-[28px] text-center text-[15px] text-[#566b5d]">
              Nothing uploaded yet. Add the first session with the form.
            </p>
          ) : (
            <ul className="mt-[16px] flex flex-col gap-[10px]">
              {sessions.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "rounded-[14px] border bg-white p-[16px] transition-colors",
                    editingId === item.id ? "border-[#50bc7e] ring-2 ring-[#50bc7e]/25" : "border-[#dbe6dd]"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-[12px]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-[8px]">
                        <p className="text-[15.5px] font-medium text-[#0a4a29]">{item.title}</p>
                        <span
                          className={cn(
                            "rounded-full px-[8px] py-[2px] text-[11px] font-semibold uppercase tracking-[0.05em]",
                            item.status === "PUBLISHED"
                              ? "bg-[#e3f2e8] text-[#056839]"
                              : "bg-[#f8f0dd] text-[#8f6410]"
                          )}
                        >
                          {item.status.toLowerCase()}
                        </span>
                        {item.isFree && (
                          <span className="rounded-full bg-[#e8f6ee] px-[8px] py-[2px] text-[11px] font-semibold text-[#056839]">
                            free
                          </span>
                        )}
                      </div>
                      <p className="mt-[4px] text-[13px] text-[#566b5d]">
                        {item.language} · <span className="capitalize">{item.category}</span> ·{" "}
                        {item.kind === "INTERVIEW" ? "Interview" : "Mock test"}
                        {item.pdfName ? " · PDF" : " · no PDF"}
                        {item.mediaName ? " · media" : " · no media"}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-[8px]">
                      <Link
                        href={`/practice/${item.slug}`}
                        className="rounded-[10px] border border-[#cfe3d6] px-[12px] py-[7px] text-[13px] font-medium text-[#0a4a29] no-underline hover:bg-[#e8f6ee]"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => edit(item)}
                        className="rounded-[10px] border border-[#cfe3d6] px-[12px] py-[7px] text-[13px] font-medium text-[#0a4a29] hover:bg-[#e8f6ee] cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${item.title}" and its files?`)) {
                            remove.mutate(item.id);
                          }
                        }}
                        className="rounded-[10px] border border-[#e6dcd6] px-[12px] py-[7px] text-[13px] font-medium text-[#8a988e] transition-colors hover:border-[#c0603e] hover:text-[#c0603e] cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Upload form ───────────────────────────────── */}
        <form
          onSubmit={submit}
          className="rounded-[20px] border border-[#dbe6dd] bg-white p-[22px] shadow-[var(--shadow-e1)] lg:sticky lg:top-[16px]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#0a4a29]">
              {editingId ? "Edit session" : "New session"}
            </h2>
            {editingId && (
              <button type="button" onClick={reset} className="text-[13px] font-medium text-[#056839] hover:underline cursor-pointer">
                Cancel
              </button>
            )}
          </div>

          <div className="mt-[16px] flex flex-col gap-[14px]">
            <Field label="Title">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Medical consultation — endoscopy"
                className={inputClass}
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="What the candidate should expect"
                className={cn(inputClass, "resize-y")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-[12px]">
              <Field label="Language">
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className={inputClass}>
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Topic">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={cn(inputClass, "capitalize")}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-[12px]">
              <Field label="Type">
                <select
                  value={form.kind}
                  onChange={(e) => setForm({ ...form, kind: e.target.value as MockTestKind })}
                  className={inputClass}
                >
                  <option value="MOCK_TEST">Mock test</option>
                  <option value="INTERVIEW">Mock interview</option>
                </select>
              </Field>
              <Field label="Visibility">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as PublishStatus })}
                  className={inputClass}
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </Field>
            </div>

            <label className="flex items-center gap-[10px] text-[14px] text-[#3f4f45] cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
                className="h-[17px] w-[17px] accent-[#056839]"
              />
              Playable without an account (free sample)
            </label>

            <FileDrop
              label="Script (PDF)"
              hint={`PDF up to ${MAX_PDF_MB} MB`}
              accept="application/pdf,.pdf"
              file={pdf}
              onSelect={setPdf}
              maxMb={MAX_PDF_MB}
              existing={editingId ? sessions.find((s) => s.id === editingId)?.pdfUrl : undefined}
            />

            <FileDrop
              label="Audio or video"
              hint={`MP4, MP3, M4A, WAV, OGG or WebM up to ${MAX_MEDIA_MB} MB`}
              accept="video/*,audio/*,.mp4,.mp3,.m4a,.wav,.ogg,.webm,.mov"
              file={media}
              onSelect={setMedia}
              maxMb={MAX_MEDIA_MB}
              existing={editingId ? sessions.find((s) => s.id === editingId)?.mediaUrl : undefined}
            />

            {busy && (
              <div>
                <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#eef4ee]">
                  <div className="h-full rounded-full bg-[#50bc7e] transition-[width] duration-150" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-[6px] text-[12.5px] tabular-nums text-[#566b5d]">Uploading… {progress}%</p>
              </div>
            )}

            {error && <p className="rounded-[10px] bg-[#fbeee9] px-[12px] py-[9px] text-[13px] text-[#c0603e]">{error}</p>}
            {message && <p className="rounded-[10px] bg-[#e3f2e8] px-[12px] py-[9px] text-[13px] text-[#056839]">{message}</p>}

            <button
              type="submit"
              disabled={busy}
              className="rounded-[13px] bg-[#0a4a29] px-[20px] py-[13px] text-[15px] font-medium text-white transition-colors hover:bg-[#056839] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy ? "Uploading…" : editingId ? "Save changes" : "Upload session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-[11px] border border-[#dbe6dd] bg-white px-[13px] py-[10px] text-[14.5px] text-[#0a4a29] placeholder:text-[#b3c2b8] focus:border-[#50bc7e] focus:outline-none focus:ring-2 focus:ring-[#50bc7e]/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-[6px] block text-[13px] font-medium text-[#0a4a29]">{label}</span>
      {children}
    </label>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[560px] px-[20px]">
      <div className="rounded-[20px] border border-[#dbe6dd] bg-white p-[32px] text-center shadow-[var(--shadow-e1)]">
        {children}
      </div>
    </div>
  );
}
