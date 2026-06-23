// ============================================================
// ALFA DARK JOYERÍA — Application Bootstrap
// ============================================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:5173'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ALFA DARK JOYERÍA API')
    .setDescription('API REST para la plataforma de e-commerce de joyería premium')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('Auth', 'Autenticación y autorización')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Products', 'Gestión de productos')
    .addTag('Categories', 'Gestión de categorías')
    .addTag('Cart', 'Carrito de compras')
    .addTag('Orders', 'Gestión de pedidos')
    .addTag('Coupons', 'Gestión de cupones')
    .addTag('Reviews', 'Reseñas de productos')
    .addTag('Favorites', 'Productos favoritos')
    .addTag('Dashboard', 'Panel administrativo')
    .addTag('Storage', 'Gestión de archivos')
    .addTag('Stripe', 'Pagos con Stripe')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);

  // Start server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 ALFA DARK JOYERÍA API running on http://localhost:${port}`);
  logger.log(`📖 Swagger docs at http://localhost:${port}/api/v1/docs`);
}

bootstrap();
