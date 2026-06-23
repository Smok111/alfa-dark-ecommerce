// ============================================================
// ALFA DARK JOYERÍA — Categories DTOs
// ============================================================

import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Anillos', description: 'Nombre de la categoría' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'anillos', description: 'Slug de la categoría' })
  @IsString()
  @MinLength(3)
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
