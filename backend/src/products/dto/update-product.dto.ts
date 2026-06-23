// ============================================================
// ALFA DARK JOYERÍA — Update Product DTO
// ============================================================

import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
