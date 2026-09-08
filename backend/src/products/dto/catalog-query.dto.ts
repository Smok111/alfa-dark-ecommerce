// ============================================================
// ALFA DARK JOYERÍA — Catalog Query DTO
// Optimized single-endpoint query for the public catalog
// ============================================================

import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CatalogQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'anillos', description: 'Category slug to filter by' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Oro 18k', description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'price_asc', description: 'Sort order' })
  @IsOptional()
  @IsString()
  sort?: string;
}
