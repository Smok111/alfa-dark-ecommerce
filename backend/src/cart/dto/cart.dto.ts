// ============================================================
// ALFA DARK JOYERÍA — Cart DTOs
// ============================================================

import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 1, description: 'Cantidad del producto' })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, description: 'Nueva cantidad del producto' })
  @IsInt()
  @Min(1)
  quantity: number;
}
