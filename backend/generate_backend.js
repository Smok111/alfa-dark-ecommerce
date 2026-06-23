const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');

const modules = {
  orders: {
    dto: `
import { IsString, IsArray, IsNumber, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsNumber()
  total: number;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
`,
    service: `
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        userId,
        total: createOrderDto.total,
        items: {
          create: createOrderDto.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: { include: { product: true } } }
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: true }
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { status: updateOrderStatusDto.status }
    });
  }
}
`,
    controller: `
import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get('my-orders')
  findUserOrders(@Request() req) {
    return this.ordersService.findUserOrders(req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}
`
  },
  coupons: {
    dto: `
import { IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  discount: number;

  @IsBoolean()
  active: boolean;

  @IsDateString()
  expirationDate: string;
}

export class ValidateCouponDto {
  @IsString()
  code: string;
}
`,
    service: `
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, ValidateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        ...createCouponDto,
        expirationDate: new Date(createCouponDto.expirationDate)
      }
    });
  }

  async findAll() {
    return this.prisma.coupon.findMany();
  }

  async validate(validateCouponDto: ValidateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: validateCouponDto.code }
    });

    if (!coupon) throw new NotFoundException('Coupon not found');
    if (!coupon.active) throw new BadRequestException('Coupon is inactive');
    if (new Date() > coupon.expirationDate) throw new BadRequestException('Coupon expired');

    return coupon;
  }

  async remove(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }
}
`,
    controller: `
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  findAll() {
    return this.couponsService.findAll();
  }

  @Post('validate')
  @Public()
  validate(@Body() validateCouponDto: ValidateCouponDto) {
    return this.couponsService.validate(validateCouponDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
`
  },
  reviews: {
    dto: `
import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
`,
    service: `
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
`,
    controller: `
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, createReviewDto);
  }

  @Get('product/:productId')
  @Public()
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
`
  },
  favorites: {
    dto: `
import { IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  productId: string;
}
`,
    service: `
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
`,
    controller: `
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/favorite.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  addFavorite(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.addFavorite(req.user.id, createFavoriteDto);
  }

  @Get()
  getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Delete(':productId')
  removeFavorite(@Request() req, @Param('productId') productId: string) {
    return this.favoritesService.removeFavorite(req.user.id, productId);
  }
}
`
  },
  dashboard: {
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalOrders, revenue, pendingOrders] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'PAID' }
      }),
      this.prisma.order.count({ where: { status: 'PENDING' } })
    ]);

    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    return {
      totalUsers,
      totalOrders,
      totalRevenue: revenue._sum.total || 0,
      pendingOrders,
      topProducts
    };
  }
}
`,
    controller: `
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }
}
`
  }
};

async function generate() {
  for (const [modName, files] of Object.entries(modules)) {
    const modDir = path.join(baseDir, modName);
    if (!fs.existsSync(modDir)) fs.mkdirSync(modDir, { recursive: true });

    if (files.dto) {
      const dtoDir = path.join(modDir, 'dto');
      if (!fs.existsSync(dtoDir)) fs.mkdirSync(dtoDir, { recursive: true });
      fs.writeFileSync(path.join(dtoDir, modName.slice(0, -1) + '.dto.ts'), files.dto.trim());
    }

    if (files.service) {
      fs.writeFileSync(path.join(modDir, modName + '.service.ts'), files.service.trim());
    }

    if (files.controller) {
      fs.writeFileSync(path.join(modDir, modName + '.controller.ts'), files.controller.trim());
    }
  }
  console.log('All backend modules generated successfully!');
}

generate();
