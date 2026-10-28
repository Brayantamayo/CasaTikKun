import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AdminAuthGuard } from './admin-auth.guard';
import { AuthService } from './auth.service';

// Agrupa las rutas, la lógica y la protección compartida de la autenticación administrativa.
@Module({
  imports: [
    // Lee JWT_SECRET desde ConfigService y fija emisor/audiencia para validar solo tokens de esta API.
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret || secret.length < 64) throw new Error('JWT_SECRET must contain at least 64 characters.');
        return {
          secret,
          signOptions: { expiresIn: '8h', issuer: 'casa-tikkun-api', audience: 'casa-tikkun-admin' },
          verifyOptions: { issuer: 'casa-tikkun-api', audience: 'casa-tikkun-admin' },
        };
      },
    }),
  ],
  // El controller expone login/logout/me; el servicio implementa el flujo y el guard protege rutas privadas.
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard],
  // Permite que otros módulos NestJS protejan sus endpoints con la misma sesión de administrador.
  exports: [AdminAuthGuard, AuthService, JwtModule],
})
export class AuthModule {}
