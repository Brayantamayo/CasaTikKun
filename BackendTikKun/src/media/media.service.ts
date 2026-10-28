import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMediaDto } from './dto/update-media.dto';

// Guarda una única configuración de medios compartida por todas las visitas al sitio.
@Injectable()
export class MediaService {
constructor(private readonly prisma: PrismaService) {}

async get() {
  const media = await this.prisma.siteMedia.findUnique({ where: { id: 'main' } });
  return {
    imagenesHero: media?.heroImages ?? [],
    imagenesGaleria: media?.galleryImages ?? [],
    actualizadoEn: media?.updatedAt.toISOString(),
  };
}

/// esta funciona para actualizar  la imagen subida 
async update(dto: UpdateMediaDto) {
    const media = await this.prisma.siteMedia.upsert({
      where: { id: 'main' },
      update: {
        ...(dto.imagenesHero !== undefined ? { heroImages: dto.imagenesHero } : {}),
        ...(dto.imagenesGaleria !== undefined ? { galleryImages: dto.imagenesGaleria } : {}),
      },
      create: {
        id: 'main',
        heroImages: dto.imagenesHero ?? [],
        galleryImages: dto.imagenesGaleria ?? [],
      },
    });return { imagenesHero: media.heroImages, imagenesGaleria: media.galleryImages, actualizadoEn: media.updatedAt };
}
}
