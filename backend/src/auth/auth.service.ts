// ============================================================
// ALFA DARK JOYERÍA — Auth Service
// ============================================================

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: string;
    avatar: string | null;
  };
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        lastname: dto.lastname,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        phone: dto.phone,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return success even if user not found (security best practice)
      return { message: 'Si el correo existe, recibirás un enlace de recuperación' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'reset' },
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      await this.sendResetEmail(user.email, user.name, resetUrl);
    } catch (error) {
      this.logger.error('Error sending reset email', error);
    }

    return { message: 'Si el correo existe, recibirás un enlace de recuperación' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      if (payload.type !== 'reset') {
        throw new BadRequestException('Token inválido');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { password: hashedPassword },
      });

      return { message: 'Contraseña actualizada exitosamente' };
    } catch {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  // ---- Private Methods ----

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<AuthTokens> {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async sendResetEmail(
    to: string,
    name: string,
    resetUrl: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });

    await transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM'),
      to,
      subject: 'ALFA DARK JOYERÍA - Recuperar Contraseña',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FFFFFF; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4AF37; font-family: 'Playfair Display', serif;">ALFA DARK</h1>
            <p style="color: #888;">JOYERÍA PREMIUM</p>
          </div>
          <p>Hola <strong>${name}</strong>,</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #D4AF37; color: #0A0A0A; padding: 14px 32px; text-decoration: none; font-weight: bold; border-radius: 4px;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #888; font-size: 12px;">Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.</p>
        </div>
      `,
    });
  }
}
