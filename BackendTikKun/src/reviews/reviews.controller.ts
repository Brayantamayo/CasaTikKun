import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  // Los visitantes solo leen las quince opiniones aprobadas más recientes.
  @Get()
  findAll() {
    return this.reviews.findAll();
  }

  @Get('admin')
  @UseGuards(AdminAuthGuard)
  findAllForAdmin() {
    return this.reviews.findAllForAdmin();
  }

  @Post(':id/approve')
  @UseGuards(AdminAuthGuard)
  approve(@Param('id') id: string) {
    return this.reviews.approve(id);
  }

  // Las nuevas opiniones quedan pendientes; el límite por IP y correo reduce el spam.
  @Post()
  @Throttle({ default: { limit: 3, ttl: 60 * 60 * 1000 } })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() input: CreateReviewDto) {
    return this.reviews.create(input);
  }

  // Solo una sesión de administrador puede retirar una reseña permanentemente.
  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.reviews.remove(id);
  }
}
