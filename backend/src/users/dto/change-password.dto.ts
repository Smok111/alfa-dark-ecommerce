// ============================================================
// ALFA DARK JOYERÍA — Change Password DTO
// ============================================================

import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword!: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword!: string;
}
