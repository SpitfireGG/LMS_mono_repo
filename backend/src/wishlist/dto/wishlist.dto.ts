import { IsString, IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AddToWishlistDto {
  @ApiProperty({ example: "ccl-nepali" })
  @IsString()
  courseId: string;
}

export class QueryWishlistDto {
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
