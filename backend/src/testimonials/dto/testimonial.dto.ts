import { IsString, IsOptional, IsBoolean, IsNumber, Min, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublishStatus } from '@prisma/client';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { Type } from 'class-transformer';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'best-testimonial-ever' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Best course ever!' })
  @IsString()
  quote: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  authorName: string;

  @ApiProperty({ example: 'Senior Developer' })
  @IsString()
  authorTitle: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;
}

export class UpdateTestimonialDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  quote?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}

export class QueryTestimonialDto extends BaseQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}