import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { images, categoryId, name, ...rest } = createProductDto as any;
    return this.prisma.product.create({
      data: {
        ...rest,
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        category: { connect: { id: categoryId } },
        images: {
          create: images?.map((url: string) => ({ imageUrl: url })) || []
        }
      },
      include: { images: true, category: true }
    });
  }

  async findAll(query: ProductQueryDto) {
    const { search, categoryId, minPrice, maxPrice, featured, sort } = query as any;
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    if (featured !== undefined) where.featured = featured;

    let orderBy = {};
    switch (sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      default: orderBy = { createdAt: 'desc' }; break;
    }

    return this.prisma.product.findMany({
      where,
      orderBy,
      include: { images: true, category: true }
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true, reviews: { include: { user: { select: { name: true, lastname: true, avatar: true } } } } }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: true, category: true, reviews: { include: { user: { select: { name: true, lastname: true, avatar: true } } } } }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto as any,
      include: { images: true }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}