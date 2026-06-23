import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/favorite.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  addFavorite(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.addFavorite(req.user.id, createFavoriteDto);
  }

  @Get()
  getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Delete(':productId')
  removeFavorite(@Request() req, @Param('productId') productId: string) {
    return this.favoritesService.removeFavorite(req.user.id, productId);
  }
}