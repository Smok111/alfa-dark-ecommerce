// ============================================================
// ALFA DARK JOYERÍA — Cart Service
// ============================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addItem(userId: string, createCartItemDto: CreateCartItemDto) {
    const { productId, quantity } = createCartItemDto;

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: { product: true }
    });
  }

  async getUserCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { 
        product: {
          include: { category: true, images: true }
        } 
      },
    });

    const total = items.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    return { items, total };
  }

  async updateQuantity(userId: string, productId: string, updateCartItemDto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (!item) throw new NotFoundException('Producto no encontrado en el carrito');

    return this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: updateCartItemDto.quantity },
      include: { product: true }
    });
  }

  async removeItem(userId: string, productId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (!item) throw new NotFoundException('Producto no encontrado en el carrito');

    return this.prisma.cartItem.delete({
      where: { id: item.id }
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { userId }
    });
  }
}
