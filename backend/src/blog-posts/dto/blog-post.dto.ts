import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { PublishStatus } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BaseQueryDto } from "../../common/dto/base-query.dto";

export class QueryBlogPostDto extends BaseQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;
}

export class CreateBlogPostDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsString() tag: string;
  @ApiProperty() @IsString() excerpt: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() coverImage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() author?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() readTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(PublishStatus) status?: PublishStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() metaTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() noindex?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() nofollow?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() ogImageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ogImageAlt?: string;
}

export class UpdateBlogPostDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tag?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() excerpt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() coverImage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() author?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() readTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(PublishStatus) status?: PublishStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() metaTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() noindex?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() nofollow?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() ogImageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ogImageAlt?: string;
}
