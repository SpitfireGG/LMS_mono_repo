import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp: string;

  constructor(data: T) {
    this.success = true;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T[];

  @ApiProperty()
  meta: PaginationMetaDto;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp: string;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.success = true;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  limit: number;

  @ApiProperty({ example: 9 })
  totalPages: number;

  constructor(meta: { total: number; page: number; limit: number; totalPages: number }) {
    this.total = meta.total;
    this.page = meta.page;
    this.limit = meta.limit;
    this.totalPages = meta.totalPages;
  }
}