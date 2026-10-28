import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

// Agrupa la lectura pública y la edición protegida de las imágenes de la landing.
@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
