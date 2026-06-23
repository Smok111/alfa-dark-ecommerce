// ============================================================
// ALFA DARK JOYERÍA — Create Product DTO
// ============================================================

import {
  IsString, IsNumber, IsBoolean, IsOptional, IsUUID,
  Min, MaxLength, MinLength, IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Anillo Diamante Imperial' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ example: 'Anillo de oro 18k con diamante de 0.5 quilates' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2499.99 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiPropertyOptional({ example: 'Oro 18k' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  material?: string;

  @ApiPropertyOptional({ example: 3.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  weight?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ example: 'uuid-de-la-categoria' })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({ type: [String], example: ['https://storage.url/img1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
