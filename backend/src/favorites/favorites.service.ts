import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: string, createFavoriteDto: CreateFavoriteDto) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId: createFavoriteDto.productId }
      }
    });

    if (existing) throw new ConflictException('Already in favorites');

    return this.prisma.favorite.create({
      data: {
        userId,
        productId: createFavoriteDto.productId
      }
    });
  }

  async getUserFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { product: { include: { images: true } } }
    });
  }

  async removeFavorite(userId: string, productId: string) {
    return this.prisma.favorite.delete({
      where: {
        userId_productId: { userId, productId }
      }
    });
  }
}