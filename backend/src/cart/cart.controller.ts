// ============================================================
// ALFA DARK JOYERÍA — Cart Controller
// ============================================================

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto, UpdateCartItemDto } from './dto/cart.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito' })
  addItem(@Request() req, @Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.addItem(req.user.id, createCartItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener el carrito del usuario' })
  getUserCart(@Request() req) {
    return this.cartService.getUserCart(req.user.id);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Actualizar cantidad de un producto' })
  updateQuantity(
    @Request() req, 
    @Param('productId') productId: string, 
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartService.updateQuantity(req.user.id, productId, updateCartItemDto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Eliminar producto del carrito' })
  removeItem(@Request() req, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Vaciar carrito' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
