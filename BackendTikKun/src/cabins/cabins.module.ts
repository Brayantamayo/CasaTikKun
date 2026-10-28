import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CabinsController } from './cabins.controller';
import { CabinsService } from './cabins.service';

// Agrupa rutas y reglas de negocio del inventario de alojamientos.
@Module({ imports: [PrismaModule, AuthModule], controllers: [CabinsController], providers: [CabinsService] })
export class CabinsModule {}
