import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { CloudinaryService } from './cloudinary.service';
import { DeleteImageDto } from './dto/delete-image.dto';
import { UploadImageDto } from './dto/upload-image.dto';

// Solo una sesión válida de administrador puede subir o borrar imágenes del sitio.
@Controller('cloudinary/images')
@UseGuards(AdminAuthGuard)
export class CloudinaryController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async upload(@Body() dto: UploadImageDto) {
    const url = await this.cloudinary.upload(dto.image, dto.folder);
    return { success: true, data: { url } };
  }

  @Delete()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async delete(@Body() dto: DeleteImageDto) {
    const deleted = await this.cloudinary.delete(dto.url);
    return { success: true, data: { deleted } };
  }
}
