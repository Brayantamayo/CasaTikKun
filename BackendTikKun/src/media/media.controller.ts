import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {constructor(private readonly media: MediaService) {}

// La landing pública necesita leer qué imágenes y orden debe mostrar.
@Get()
async get() {return { success: true, data: await this.media.get() };
}

// Solo el administrador autenticado puede cambiar las imágenes activas del sitio.
@Put()
@UseGuards(AdminAuthGuard) @Throttle({ default: { limit: 30, ttl: 60_000 } }) async update(@Body() dto: UpdateMediaDto) {return { success: true, data: await this.media.update(dto) };}}
