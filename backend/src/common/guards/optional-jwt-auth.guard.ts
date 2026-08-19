import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Attaches the user when a valid token is present, and lets the request through
 * when it isn't. Used by routes that are public but show more to a signed-in
 * visitor.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch {
      // An absent or invalid token simply means "anonymous".
    }
    return true;
  }

  handleRequest<TUser = unknown>(_err: unknown, user: unknown): TUser {
    return (user || undefined) as TUser;
  }
}
