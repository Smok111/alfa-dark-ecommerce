// ============================================================
// ALFA DARK JOYERÍA — Product Query DTO
// ============================================================

import { IsOptional, IsString, IsNumber, Min, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ProductQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'uuid-de-la-categoria' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Oro 18k' })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  featured?: boolean;
}
