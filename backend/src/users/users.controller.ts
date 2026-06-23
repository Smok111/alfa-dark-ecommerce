// ============================================================
// ALFA DARK JOYERÍA — Users Controller
// ============================================================

import {
  Controller, Get, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los usuarios (Admin)' })
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.findOne(user.sub);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener usuario por ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Actualizar perfil del usuario actual' })
  updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.sub, dto);
  }

  @Put('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña del usuario actual' })
  changePassword(@CurrentUser() user: JwtPayload, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.sub, dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar usuario por ID (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario (Admin)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
