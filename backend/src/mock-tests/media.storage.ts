import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { randomUUID } from "crypto";
import * as fs from "fs";

export const MEDIA_DIR = join(process.cwd(), "uploads");

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

export const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_MEDIA_BYTES = 512 * 1024 * 1024; // 512 MB — a long MP4 interview
export const MAX_RECORDING_BYTES = 64 * 1024 * 1024;

const PDF_EXT = /\.pdf$/i;
const MEDIA_EXT = /\.(mp4|m4a|mp3|wav|ogg|oga|webm|mov|aac)$/i;
const RECORDING_EXT = /\.(webm|ogg|oga|mp4|m4a|mp3|wav)$/i;

/**
 * Uploaded files are stored under a random UUID name, never the name the
 * browser supplied. That kills path traversal at the source and lets the
 * serving route mark every asset immutable — a file name never refers to
 * different bytes twice.
 */
export function mediaDiskStorage() {
  return diskStorage({
    destination: MEDIA_DIR,
    filename: (_req, file, cb) => {
      cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
    },
  });
}

function extensionFilter(pattern: RegExp, label: string) {
  return (
    _req: unknown,
    file: { originalname: string },
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!pattern.test(extname(file.originalname))) {
      return cb(new BadRequestException(`Expected ${label}`), false);
    }
    cb(null, true);
  };
}

export const pdfFilter = extensionFilter(PDF_EXT, "a PDF file");
export const mediaFilter = extensionFilter(MEDIA_EXT, "an MP4, MP3, M4A, WAV, OGG or WebM file");
export const recordingFilter = extensionFilter(RECORDING_EXT, "an audio recording");

/** The upload options for the combined PDF + media admin form. */
export const practiceUploadFields = [
  { name: "pdf", maxCount: 1 },
  { name: "media", maxCount: 1 },
];

export function practiceUploadOptions() {
  return {
    storage: mediaDiskStorage(),
    limits: { fileSize: MAX_MEDIA_BYTES, files: 2 },
    fileFilter: (
      _req: unknown,
      file: { fieldname: string; originalname: string },
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      const pattern = file.fieldname === "pdf" ? PDF_EXT : MEDIA_EXT;
      if (!pattern.test(extname(file.originalname))) {
        return cb(new BadRequestException(`Unsupported file for "${file.fieldname}"`), false);
      }
      if (file.fieldname === "pdf" && (file as any).size > MAX_PDF_BYTES) {
        return cb(new BadRequestException("PDF is larger than 25 MB"), false);
      }
      cb(null, true);
    },
  };
}

export function publicUrlFor(filename: string): string {
  return `/api/media/${filename}`;
}

/** Removes a previously stored asset; missing files are not an error. */
export function deleteAsset(url?: string | null): void {
  if (!url) return;
  const filename = url.split("/").pop();
  if (!filename || !isSafeFilename(filename)) return;
  fs.promises.unlink(join(MEDIA_DIR, filename)).catch(() => undefined);
}

/** Only the UUID names we generate are ever served. */
export function isSafeFilename(filename: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]{1,5}$/i.test(
    filename,
  );
}

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".oga": "audio/ogg",
};

export function contentTypeFor(filename: string): string {
  return CONTENT_TYPES[extname(filename).toLowerCase()] ?? "application/octet-stream";
}
