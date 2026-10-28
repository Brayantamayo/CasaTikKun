import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

// Mantiene juntas las rutas y la integración con Cloudinary, reutilizando la autenticación de admin.
@Module({
  imports: [AuthModule],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
})
export class CloudinaryModule {}
