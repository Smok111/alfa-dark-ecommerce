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