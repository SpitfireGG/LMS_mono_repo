import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { SEO_KEY, SeoOptions } from "../decorators/seo.decorator";

@Injectable()
export class RobotsHeaderInterceptor implements NestInterceptor<unknown, unknown> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const options = this.reflector.getAllAndOverride<SeoOptions>(SEO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const response = context.switchToHttp().getResponse();
    const isProduction = process.env.APP_ENV === "production";
    const indexable = !!options?.indexable && isProduction;

    response.setHeader(
      "X-Robots-Tag",
      indexable
        ? "index, follow, max-image-preview:large, max-snippet:-1"
        : "noindex, nofollow",
    );

    return next.handle();
  }
}
