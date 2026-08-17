import { SetMetadata } from "@nestjs/common";

export const SKIP_TRANSFORM_KEY = "common:skipTransform";

export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);
