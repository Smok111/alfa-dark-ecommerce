import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, CreateManualSaleDto } from './dto/order.dto';

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

  async createManualSale(userId: string, dto: CreateManualSaleDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product || product.stock < dto.quantity) {
      throw new BadRequestException('Stock insuficiente o producto no encontrado');
    }

    await this.prisma.product.update({
      where: { id: dto.productId },
      data: { stock: { decrement: dto.quantity } }
    });

    return this.prisma.order.create({
      data: {
        userId,
        total: dto.price * dto.quantity,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        items: {
          create: [{
            productId: dto.productId,
            quantity: dto.quantity,
            price: dto.price
          }]
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