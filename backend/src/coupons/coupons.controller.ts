import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';


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