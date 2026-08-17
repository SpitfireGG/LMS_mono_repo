import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
  Max,
} from "class-validator";
import { PublishStatus } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BaseQueryDto, SortOrder } from "../../common/dto/base-query.dto";
import { Type } from "class-transformer";

export class CreateCourseDto {
  @ApiProperty({ example: "lang" })
  @IsString()
  category: string;

  @ApiProperty({ example: "NAATI CCL" })
  @IsString()
  tag: string;

  @ApiProperty({ example: "NAATI CCL Complete Mastery" })
  @IsString()
  title: string;

  @ApiProperty({ example: "naati-ccl-complete-mastery" })
  @IsString()
  slug: string;

  @ApiProperty({ example: "naati faculty" })
  @IsString()
  author: string;

  @ApiProperty({ example: "All Levels" })
  @IsString()
  level: string;

  @ApiProperty({ example: 42 })
  @IsNumber()
  @Min(1)
  lessons: number;

  @ApiProperty({ example: 18 })
  @IsNumber()
  @Min(1)
  hours: number;

  @ApiProperty({ example: 3200 })
  @IsNumber()
  @Min(0)
  students: number;

  @ApiProperty({ example: 4.9 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 249 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 390 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional({ example: "dark" })
  @IsOptional()
  @IsString()
  tone?: string;

  @ApiPropertyOptional({ example: "interpreting" })
  @IsOptional()
  @IsString()
  glyph?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  noindex?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  nofollow?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImageAlt?: string;
}

export class UpdateCourseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lessons?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  hours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  students?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  originalPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  glyph?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  noindex?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  nofollow?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImageAlt?: string;
}

export class QueryCourseDto extends BaseQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ default: "popular" })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 12;
}
