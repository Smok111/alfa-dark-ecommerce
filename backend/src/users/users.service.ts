// ============================================================
// ALFA DARK JOYERÍA — Users Service
// ============================================================

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { User } from '@prisma/client';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationDto): Promise<PaginatedResult<SafeUser>> {
    const { page, limit, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { lastname: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          lastname: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users as unknown as SafeUser[],
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user as unknown as SafeUser;
  }

  async update(id: string, dto: UpdateUserDto): Promise<SafeUser> {
    await this.findOne(id);

    if (dto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El correo ya está en uso');
      }

      dto.email = dto.email.toLowerCase();
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user as unknown as SafeUser;
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Usuario eliminado exitosamente' };
  }
}
