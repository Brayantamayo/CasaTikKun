import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CabinsModule } from './cabins/cabins.module';
import { MediaModule } from './media/media.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // Hace disponibles las variables de entorno mediante ConfigService en todos los módulos.
    ConfigModule.forRoot({ isGlobal: true }),
    // Límite general por IP para proteger la API; /auth/login además define su propio límite más estricto.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    CloudinaryModule,
    CabinsModule,
    MediaModule,
    ReviewsModule,
  ],
  // Registra el limitador como guard global para aplicar la protección a todos los controladores.
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

