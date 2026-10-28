import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
  constructor(private readonly jwt: JwtService, private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // La sesión viaja en cookie HttpOnly, inaccesible desde JavaScript del navegador.
    const request = context.switchToHttp().getRequest<AdminRequest>();
    const token = request.cookies?.admin_session;
    if (!token) throw new UnauthorizedException('Inicia sesión para continuar.');

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
