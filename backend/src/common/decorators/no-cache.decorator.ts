import { SetMetadata } from "@nestjs/common";

export const NO_CACHE_KEY = "noCache";

/**
 * Opts a route out of the in-memory response cache. Required for handlers that
 * write to the response themselves (file streams), because a cached hit would
 * otherwise replay an empty body and never send anything.
 */
export const NoCache = () => SetMetadata(NO_CACHE_KEY, true);
