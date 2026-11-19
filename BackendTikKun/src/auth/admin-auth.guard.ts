import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';

export interface AdminRequest extends Request {
  // El guard agrega esta identidad después de validar el token y consultar la cuenta activa.
  admin?: { id: string; email: string };
}

// Guard de NestJS: rechaza peticiones sin sesión válida antes de ejecutar el controller protegido.
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // La sesión viaja en cookie HttpOnly, inaccesible desde JavaScript del navegador.
    const request = context.switchToHttp().getRequest<AdminRequest>();
    context.switchToHttp().getResponse().setHeader('Cache-Control', 'no-store, private');
    const token = request.cookies?.admin_session;
    if (!token) throw new UnauthorizedException('Inicia sesión para continuar.');

    // Verificar CSRF en todas las mutaciones autenticadas.
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const cookieToken = request.cookies?.admin_csrf;
      const headerValue = request.headers['x-csrf-token'];
      const headerToken = Array.isArray(headerValue) ? headerValue[0] : headerValue;
      const cookieBytes = cookieToken ? Buffer.from(cookieToken) : undefined;
      const headerBytes = headerToken ? Buffer.from(headerToken) : undefined;
      const csrfTokenMatches = Boolean(
        cookieBytes && headerBytes && cookieBytes.length === headerBytes.length &&
        timingSafeEqual(cookieBytes, headerBytes),
      );

      // Si frontend y API son orígenes distintos, el navegador no permite leer una cookie host-only.
      // En ese caso el Origin exacto permitido por CORS sirve como segunda defensa contra CSRF.
      const requestOrigin = request.get('origin');
      const allowedOrigins = new Set<string>();
      const configuredOrigin = this.config.get<string>('FRONTEND_ORIGIN')?.trim();
      if (configuredOrigin) {
        try { allowedOrigins.add(new URL(configuredOrigin).origin); } catch { /* main.ts valida esta variable al iniciar. */ }
      }
      if (this.config.get<string>('NODE_ENV') !== 'production') {
        allowedOrigins.add('http://localhost:3000');
        allowedOrigins.add('http://localhost:3001');
      }

      if (!csrfTokenMatches && (!requestOrigin || !allowedOrigins.has(requestOrigin))) {
        throw new ForbiddenException('Solicitud no válida. Recarga la página e inténtalo de nuevo.');
      }
    }

    let subject: string;
    try {
      // verifyAsync valida firma, vencimiento, emisor y audiencia configurados en AuthModule.
      const payload = await this.jwt.verifyAsync<{ sub: string }>(token);
      subject = payload.sub;
      if (!subject) throw new Error('Missing subject');
    } catch {
      throw new UnauthorizedException('Sesión no válida o vencida.');
    }

    request.admin = await this.auth.getAuthenticatedAdmin(subject);
    return true;
  }
}
