import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Cabin } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CabinDto } from './dto/cabin.dto';

type PublicCabin = Omit<Cabin, 'createdAt' | 'updatedAt'>;

// Centraliza las lecturas y escrituras del catálogo persistente de cabañas.
@Injectable()
export class CabinsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PublicCabin[]> {
    const cabins = await this.prisma.cabin.findMany({ orderBy: { numeroCabana: 'asc' } });
    return cabins.map((cabin) => this.toPublicCabin(cabin));
  }

  async create(dto: CabinDto): Promise<PublicCabin> {
    try {
      const cabin = await this.prisma.cabin.create({ data: this.toCreateData(dto) });
      return this.toPublicCabin(cabin);
    } catch (error) {
      this.handleUniqueConflict(error);
      throw error;
    }
  }

  async update(id: string, dto: CabinDto): Promise<PublicCabin> {
    this.validateId(id);
    try {
      const cabin = await this.prisma.cabin.update({ where: { id }, data: this.toUpdateData(dto) });
      return this.toPublicCabin(cabin);
    } catch (error) {
      if (this.isPrismaCode(error, 'P2025')) throw new NotFoundException('No encontramos esa cabaña.');
      this.handleUniqueConflict(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.validateId(id);
    try {
      await this.prisma.$transaction(async (transaction) => {
        const count = await transaction.cabin.count();
        if (count <= 1) throw new ConflictException('Debe permanecer al menos una cabaña en el catálogo.');
        await transaction.cabin.delete({ where: { id } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (this.isPrismaCode(error, 'P2025')) throw new NotFoundException('No encontramos esa cabaña.');
      if (this.isPrismaCode(error, 'P2034')) {
        throw new ConflictException('El catálogo cambió mientras se eliminaba. Recarga e inténtalo de nuevo.');
      }
      throw error;
    }
  }

  private toCreateData(dto: CabinDto): Prisma.CabinUncheckedCreateInput {
    return {
      id: dto.id ?? randomUUID(),
      numeroCabana: dto.numeroCabana,
      etiquetaNumeroCabana: dto.etiquetaNumeroCabana,
      nombre: dto.nombre,
      tipo: dto.tipo,
      subtitulo: dto.subtitulo,
      descripcion: dto.descripcion,
      capacidad: dto.capacidad,
      camas: dto.camas,
      banos: dto.banos,
      precioCOP: dto.precioCOP,
      precioUSD: dto.precioUSD,
      tarifas: dto.tarifas as unknown as Prisma.InputJsonValue,
      calificacion: dto.calificacion,
      cantidadResenas: dto.cantidadResenas,
      imagenPrincipal: dto.imagenPrincipal,
      imagenesGaleria: dto.imagenesGaleria,
      caracteristicas: dto.caracteristicas,
      comodidades: dto.comodidades as unknown as Prisma.InputJsonValue,
      insigniaPopular: dto.insigniaPopular,
      tamanoM2: dto.tamanoM2,
      ...(dto.reglas ? { reglas: dto.reglas as unknown as Prisma.InputJsonValue } : {}),
      ...(dto.cortesias ? { cortesias: dto.cortesias as unknown as Prisma.InputJsonValue } : {}),
      ...(dto.especificaciones ? { especificaciones: dto.especificaciones as unknown as Prisma.InputJsonValue } : {}),
    };
  }

  private toUpdateData(dto: CabinDto): Prisma.CabinUncheckedUpdateInput {
    const { id: _id, ...fields } = this.toCreateData(dto);
    return fields;
  }

  private validateId(id: string): void {
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{1,119}$/.test(id)) {
      throw new NotFoundException('No encontramos esa cabaña.');
    }
  }

  // Los timestamps son de solo lectura y no forman parte del contrato público del catálogo.
  private toPublicCabin(cabin: Cabin): PublicCabin {
    const { createdAt, updatedAt, ...publicCabin } = cabin;
    void createdAt;
    void updatedAt;
    return publicCabin;
  }

  private isPrismaCode(error: unknown, code: string): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
  }

  private handleUniqueConflict(error: unknown): void {
    if (this.isPrismaCode(error, 'P2002')) {
      throw new ConflictException('Ya existe una cabaña con ese número.');
    }
  }
}
