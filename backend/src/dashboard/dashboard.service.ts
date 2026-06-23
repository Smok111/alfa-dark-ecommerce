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