import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublishStatus } from '@prisma/client';
import { BaseQueryDto } from '../../common/dto/base-query.dto';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'new-course-launch' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'New NAATI CCL Course Launched!' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ example: '/courses/naati-ccl' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ example: 'View Course' })
  @IsOptional()
  @IsString()
  linkText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;
}

export class UpdateAnnouncementDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;
}

export class QueryAnnouncementDto extends BaseQueryDto {}