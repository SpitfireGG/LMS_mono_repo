import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsInt,
  Min,
  Max,
  Length,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { MockTestKind, PublishStatus } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/** Multipart fields arrive as strings — coerce the non-string ones. */
const toBool = () =>
  Transform(({ value }) =>
    typeof value === "string" ? value === "true" || value === "1" : value,
  );

export class CreateMockTestDto {
  @ApiProperty({ example: "Medical Consultation — Endoscopy" })
  @IsString()
  @Length(3, 160)
  title: string;

  @ApiPropertyOptional({ example: "medical-consultation-endoscopy" })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @ApiPropertyOptional({ example: "Nepali" })
  @IsOptional()
  @IsString()
  @Length(2, 64)
  language?: string;

  @ApiPropertyOptional({ example: "health" })
  @IsOptional()
  @IsString()
  @Length(2, 64)
  category?: string;

  @ApiPropertyOptional({ example: "All Levels" })
  @IsOptional()
  @IsString()
  @Length(2, 64)
  level?: string;

  @ApiPropertyOptional({ enum: MockTestKind, default: MockTestKind.MOCK_TEST })
  @IsOptional()
  @IsEnum(MockTestKind)
  kind?: MockTestKind;

  @ApiPropertyOptional({ description: "Playable without an account" })
  @IsOptional()
  @toBool()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ enum: PublishStatus, default: PublishStatus.DRAFT })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @ApiPropertyOptional({ description: "Media length in seconds, read in the browser" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(86_400)
  durationSeconds?: number;
}

export class UpdateMockTestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 160)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 200)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 64)
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 64)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 64)
  level?: string;

  @ApiPropertyOptional({ enum: MockTestKind })
  @IsOptional()
  @IsEnum(MockTestKind)
  kind?: MockTestKind;

  @ApiPropertyOptional()
  @IsOptional()
  @toBool()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ enum: PublishStatus })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(86_400)
  durationSeconds?: number;
}

export class QueryMockTestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 200)
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 64)
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 64)
  category?: string;

  @ApiPropertyOptional({ enum: MockTestKind })
  @IsOptional()
  @IsEnum(MockTestKind)
  kind?: MockTestKind;

  @ApiPropertyOptional({ enum: PublishStatus, description: "Admin listing only" })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 24;
}

export class CreateAttemptDto {
  @ApiPropertyOptional({ description: "Recording length in seconds" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(86_400)
  durationSeconds?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}
