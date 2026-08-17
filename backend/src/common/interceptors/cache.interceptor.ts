import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { NO_CACHE_KEY } from "../decorators/no-cache.decorator";

interface CacheEntry {
  data: unknown;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = parseInt(process.env.CACHE_TTL ?? "60", 10) * 1000;

@Injectable()
export class CacheInterceptor implements NestInterceptor<unknown, unknown> {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (request.method !== "GET" || request.user) {
      return next.handle();
    }

    // Streaming handlers write the response themselves — replaying a cached
    // empty body would leave the request hanging.
    const noCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (noCache) return next.handle();

    const key = `${request.originalUrl ?? request.url}`;
    const cached = cache.get(key);

    if (cached && cached.expiry > Date.now()) {
      return of(cached.data);
    }

    return next.handle().pipe(
      tap((data) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          cache.set(key, { data, expiry: Date.now() + TTL });
        }
      }),
    );
  }
}
