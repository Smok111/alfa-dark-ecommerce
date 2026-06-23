const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');

const modules = {
  products: {
    service: `
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
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        images: {
          create: createProductDto.images?.map(url => ({ imageUrl: url })) || []
        }
      },
      include: { images: true, category: true }
    });
  }

  async findAll(query: ProductQueryDto) {
    const { search, categoryId, minPrice, maxPrice, sort, featured } = query;
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
`,
    controller: `
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
`
  },
  stripe: {
    dto: `
import { IsArray, ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  name: string;
}

export class CreateCheckoutSessionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
`,
    service: `
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutSessionDto } from './dto/stripe.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createCheckoutSession(userId: string, data: CreateCheckoutSessionDto) {
    try {
      const line_items = data.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: \`\${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}\`,
        cancel_url: \`\${process.env.FRONTEND_URL}/checkout/cancel\`,
        metadata: {
          userId,
        },
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      throw new InternalServerErrorException('Error creating checkout session');
    }
  }

  async handleWebhook(signature: string, body: Buffer) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      throw new Error(\`Webhook Error: \${err.message}\`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      // You would typically find the order and mark it as PAID here
      // const userId = session.metadata.userId;
    }

    return { received: true };
  }
}
`,
    controller: `
import { Controller, Post, Body, Headers, Req, UseGuards, Request, RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/stripe.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createCheckoutSession(@Request() req, @Body() data: CreateCheckoutSessionDto) {
    return this.stripeService.createCheckoutSession(req.user.id, data);
  }

  @Post('webhook')
  @Public()
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.stripeService.handleWebhook(signature, req.rawBody);
  }
}
`
  },
  storage: {
    dto: `
import { IsString } from 'class-validator';

export class UploadImageDto {
  @IsString()
  bucket: string;
}
`,
    service: `
import { Injectable, BadRequestException } from '@nestjs/common';
// In a real app, import the Supabase client here

@Injectable()
export class StorageService {
  constructor() {}

  async uploadFile(file: Express.Multer.File, bucket: string) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    // Mock Supabase storage response
    // const filePath = \`\${bucket}/\${Date.now()}-\${file.originalname}\`;
    // const { data, error } = await supabase.storage.from(bucket).upload(filePath, file.buffer);
    
    return {
      url: \`https://mock-supabase-url.com/storage/v1/object/public/\${bucket}/\${file.originalname}\`
    };
  }

  async deleteFile(path: string, bucket: string) {
    // const { error } = await supabase.storage.from(bucket).remove([path]);
    return { success: true };
  }
}
`,
    controller: `
import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Storage')
@Controller('storage')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body('bucket') bucket: string) {
    return this.storageService.uploadFile(file, bucket || 'products');
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
  console.log('Additional backend modules generated successfully!');
}

generate();
