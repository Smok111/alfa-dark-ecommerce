import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CatalogQueryDto } from './dto/catalog-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Optimized catalog endpoint: returns categories + paginated products
   * in a SINGLE API call to eliminate the sequential waterfall.
   * Only selects listing-needed fields and limits to 1 image per product.
   */
  async getCatalog(query: CatalogQueryDto) {
    const { category, search, sort, page, limit } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 12;
    const skip = (pageNumber - 1) * limitNumber;

    // Build product where clause
    const where: Prisma.ProductWhereInput = {};

    if (category && category !== 'all') {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Determine sort order
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
    }

    // Execute ALL queries in parallel — categories, products, and count
    const [categories, products, total] = await Promise.all([
      // Only fetch categories on first page (they don't change between pages)
      pageNumber === 1
        ? this.prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              name: true,
              slug: true,
              _count: { select: { products: true } },
            },
          })
        : null,

      // Products with minimal fields for listing
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNumber,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          material: true,
          images: {
            select: { imageUrl: true },
            take: 1, // Only first image for listings
          },
          category: {
            select: { name: true, slug: true },
          },
        },
      }),

      this.prisma.product.count({ where }),
    ]);

    return {
      categories: categories || undefined,
      products: products,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

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
    const { search, categoryId, minPrice, maxPrice, featured, sort, page, limit } = query as any;
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

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 12;
    const skip = (pageNumber - 1) * limitNumber;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNumber,
        include: { images: true, category: true }
      }),
      this.prisma.product.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    };
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