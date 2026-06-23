import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Storage')
@Controller('storage')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: false, forbidNonWhitelisted: false }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body('bucket') bucket: string) {
    return this.storageService.uploadFile(file, bucket || 'products');
  }
}