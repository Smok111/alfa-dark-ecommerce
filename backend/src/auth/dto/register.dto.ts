// ============================================================
// ALFA DARK JOYERÍA — Register DTO
// ============================================================

import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastname!: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @ApiPropertyOptional({ example: '+52 555 123 4567' })
  @IsOptional()
  @IsString()
  phone?: string;
}
