import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import { Prisma, Review } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}

  // El público solo recibe las quince reseñas aprobadas más recientes.
  async findAll() {
    const records = await this.prisma.review.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' }, take: 15 });
    return records.map((review) => this.toPublicReview(review));
  }

  async findAllForAdmin() {
    const records = await this.prisma.review.findMany({ orderBy: [{ status: 'asc' }, { createdAt: 'desc' }] });
    return records.map((review) => ({ ...this.toPublicReview(review), estado: review.status }));
  }

  async create(input: CreateReviewDto) {
    // Se normaliza el correo y se calcula una huella con clave privada; el dato personal no se guarda ni se devuelve.
    const secret = this.config.getOrThrow<string>('JWT_SECRET');
    const emailHash = createHmac('sha256', secret).update(input.email.trim().toLowerCase()).digest('hex');
    const cabin = await this.prisma.cabin.findUnique({ where: { id: input.cabinId.trim() }, select: { id: true, nombre: true } });
    if (!cabin) throw new NotFoundException('No encontramos el alojamiento seleccionado. Recarga la página e inténtalo de nuevo.');
    try {
      const review = await this.prisma.review.create({
        data: {
          guestName: input.guestName.trim(),
          guestCity: input.guestCity?.trim() || 'Medellín, Colombia',
          emailHash,
          rating: input.rating,
          cabinId: input.cabinId.trim(),
          // El backend obtiene el nombre real del catálogo; nunca confía en uno enviado por el visitante.
          cabinName: cabin.nombre,
          comment: input.comment.trim(),
          travelType: input.travelType.trim(),
        },
      });
      return { recibido: true, pendienteAprobacion: true };
    } catch (error) {
      // El índice único en PostgreSQL cierra también carreras de dos solicitudes simultáneas.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe una reseña asociada a este correo.');
      }
      throw error;
    }
  }

  async approve(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // Serialize approvals so simultaneous admin clicks cannot exceed the 15-publication limit.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(734821506)`;
      const review = await tx.review.findUnique({ where: { id } });
      if (!review) throw new NotFoundException('No se encontró la reseña solicitada.');
      if (review.status === 'PUBLISHED') return this.toPublicReview(review);

      const publishedCount = await tx.review.count({ where: { status: 'PUBLISHED' } });
      if (publishedCount >= 15) {
        const oldest = await tx.review.findFirst({ where: { status: 'PUBLISHED' }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] });
        if (oldest) await tx.review.delete({ where: { id: oldest.id } });
      }

      const approved = await tx.review.update({ where: { id }, data: { status: 'PUBLISHED' } });
      return this.toPublicReview(approved);
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.review.delete({ where: { id } });
      return { deletedId: id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('No se encontró la reseña solicitada.');
      }
      throw error;
    }
  }

  private toPublicReview(review: Review) {
    return {
      id: review.id,
      nombreHuesped: review.guestName,
      ciudadHuesped: review.guestCity,
      calificacion: review.rating,
      fecha: review.createdAt.toISOString(),
      cabanaId: review.cabinId,
      nombreCabana: review.cabinName,
      comentario: review.comment,
      tipoViaje: review.travelType,
      // Solo el proceso administrativo de verificar reservas podría marcar una reseña como verificada.
      reservaVerificada: false,
    };
  }
}
