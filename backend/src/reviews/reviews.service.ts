import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const existing = await this.prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId: createReviewDto.productId }
      }
    });

    if (existing) throw new ConflictException('You already reviewed this product');

    return this.prisma.review.create({
      data: {
        userId,
        ...createReviewDto
      }
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true, lastname: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async remove(id: string) {
    return this.prisma.review.delete({ where: { id } });
  }
}