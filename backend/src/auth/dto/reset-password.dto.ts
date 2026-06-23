// ============================================================
// ALFA DARK JOYERÍA — Reset Password DTO
// ============================================================

import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token!: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword!: string;
}
