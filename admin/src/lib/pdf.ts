// Client-side PDF text extraction for the mock test. The student uploads a PDF;
// we pull its text out in the browser and feed it to the AI examiner as the
// source material for the session. Text PDFs only — scanned/image-only PDFs
// yield little/no text (would need OCR, out of scope).
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Keep the prompt within a sane budget; very long PDFs are truncated.
const MAX_CHARS = 24000;

export interface ExtractedPdf {
  text: string;
  pageCount: number;
  truncated: boolean;
}

export async function extractPdfText(file: File): Promise<ExtractedPdf> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const doc = await loadingTask.promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (line) pages.push(line);
  }
  const pageCount = doc.numPages;
  await loadingTask.destroy();

  let text = pages.join('\n\n').trim();
  const truncated = text.length > MAX_CHARS;
  if (truncated) text = text.slice(0, MAX_CHARS);

  return { text, pageCount, truncated };
}
