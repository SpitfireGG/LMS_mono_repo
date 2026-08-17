import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { createHash } from "crypto";

const SECOND_MS = 1000;

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function extractLastModified(payload: unknown): Date | null {
  if (Array.isArray(payload)) {
    let max: Date | null = null;
    for (const item of payload) {
      const d = extractLastModified(item);
      if (d && (!max || d.getTime() > max.getTime())) max = d;
    }
    return max;
  }
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (record.contentUpdatedAt) {
      const d = toDate(record.contentUpdatedAt);
      if (d) return d;
    }
    if (Array.isArray(record.data)) {
      const d = extractLastModified(record.data);
      if (d) return d;
    }
  }
  return null;
}

function etagMatches(header: string | undefined, etag: string): boolean {
  if (!header) return false;
  if (header.trim() === "*") return true;
  const raw = etag.replace(/^W\//, "");
  return header
    .split(",")
    .map((t) => t.trim().replace(/^W\//, ""))
    .some((t) => t === raw);
}

function modifiedSinceMatches(
  header: string | undefined,
  lastModified: Date,
): boolean {
  if (!header) return false;
  const since = Date.parse(header);
  if (Number.isNaN(since)) return false;
  return (
    Math.floor(lastModified.getTime() / SECOND_MS) <=
    Math.floor(since / SECOND_MS)
  );
}

@Injectable()
export class ConditionalRequestInterceptor
  implements NestInterceptor<unknown, unknown>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (request.method !== "GET" && request.method !== "HEAD") {
      return next.handle();
    }

    response.setHeader("Vary", "Accept-Encoding");

    if (request.user) {
      return next.handle();
    }

    return next.handle().pipe(
      switchMap((data) => {
        const status = response.statusCode;
        if (status < 200 || status >= 300) return of(data);

        if (!response.getHeader("Cache-Control")) {
          response.setHeader(
            "Cache-Control",
            "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
          );
        }

        if (response.getHeader("ETag")) return of(data);

        const etag = `W/"${createHash("sha1")
          .update(JSON.stringify(data ?? ""))
          .digest("hex")}"`;
        response.setHeader("ETag", etag);

        const lastModified = extractLastModified(data);
        if (lastModified) {
          response.setHeader("Last-Modified", lastModified.toUTCString());
        }

        if (etagMatches(request.headers["if-none-match"], etag)) {
          response.status(304);
          return of(data);
        }

        if (
          lastModified &&
          modifiedSinceMatches(
            request.headers["if-modified-since"],
            lastModified,
          )
        ) {
          response.status(304);
          return of(data);
        }

        return of(data);
      }),
    );
  }
}
