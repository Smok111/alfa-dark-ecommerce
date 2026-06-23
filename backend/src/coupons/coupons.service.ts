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