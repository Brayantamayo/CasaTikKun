import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { CabinDto } from './dto/cabin.dto';
import { CabinsService } from './cabins.service';

// Expone el catálogo público y limita cualquier cambio al administrador autenticado.
@Controller('cabins')
export class CabinsController {
  constructor(private readonly cabins: CabinsService) {}

  @Get()
  async findAll() {
    return { success: true, data: await this.cabins.findAll() };
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async create(@Body() dto: CabinDto) {
    return { success: true, data: await this.cabins.create(dto) };
  }

  @Put(':id')
  @UseGuards(AdminAuthGuard)
  async update(@Param('id') id: string, @Body() dto: CabinDto) {
    return { success: true, data: await this.cabins.update(id, dto) };
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async remove(@Param('id') id: string) {
    await this.cabins.remove(id);
    return { success: true, data: null };
  }

}
