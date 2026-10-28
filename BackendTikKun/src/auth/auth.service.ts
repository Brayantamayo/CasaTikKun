import {
  Injectable,
  OnModuleInit,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { argon2id, hash, verify, type HashOptions } from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

// Parámetros de Argon2id para almacenar contraseñas con resistencia al cálculo paralelo.
const ARGON2_OPTIONS: HashOptions = {
  type: argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

@Injectable()
export class AuthService implements OnModuleInit {
  // Hash aleatorio para que un correo inexistente también consuma tiempo verificando una contraseña.
  private dummyPasswordHash = '';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    // Las credenciales iniciales se leen del entorno; nunca se guardan en el código fuente.
    const email = this.config.get<string>('ADMIN_EMAIL')?.trim().toLowerCase();
    const password = this.config.get<string>('ADMIN_PASSWORD');
    const jwtSecret = this.config.get<string>('JWT_SECRET');

    if (!email || !jwtSecret || jwtSecret.length < 64) {
      throw new Error('Auth configuration is incomplete. Set ADMIN_EMAIL and a JWT_SECRET of at least 64 characters.');
    }

    // Crea el hash señuelo una sola vez para reducir diferencias de tiempo en respuestas de login.
    this.dummyPasswordHash = await hash(randomBytes(32).toString('base64url'), ARGON2_OPTIONS);

    // El arranque es idempotente: si el administrador ya existe, no sobrescribe su contraseña.
    const existingAdmin = await this.prisma.admin.findUnique({ where: { email }, select: { id: true } });
    if (existingAdmin) return;
    if (!password || password.length < 20) {
      throw new Error('Set an ADMIN_PASSWORD of at least 20 characters to create the first admin.');
    }

    const passwordHash = await hash(password, ARGON2_OPTIONS);
    await this.prisma.admin.create({ data: { email, passwordHash } });
  }

  async login(emailInput: string, password: string): Promise<{ id: string; email: string; token: string }> {
    // Normaliza el correo para que mayúsculas o espacios no creen identidades distintas.
    const email = emailInput.trim().toLowerCase();
    const admin = await this.prisma.admin.findUnique({ where: { email } });

    // Verify a fixed-cost dummy hash for unknown users to reduce email enumeration timing leaks.
    const validPassword = admin
      ? await verify(admin.passwordHash, password).catch(() => false)
      : await this.verifyUnknownUser(password);

    if (!admin || !admin.isActive || !validPassword) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    // El JWT identifica al administrador; el controller lo entrega solo mediante cookie HttpOnly.
    const token = await this.jwt.signAsync({ sub: admin.id, email: admin.email });
    return { id: admin.id, email: admin.email, token };
  }

  async getAuthenticatedAdmin(id: string): Promise<{ id: string; email: string }> {
    // Consulta el estado actual en la base de datos para poder revocar acceso desactivando la cuenta.
    const admin = await this.prisma.admin.findUnique({ where: { id }, select: { id: true, email: true, isActive: true } });
    if (!admin?.isActive) throw new UnauthorizedException('Sesión no válida.');
    return { id: admin.id, email: admin.email };
  }

  private async verifyUnknownUser(password: string): Promise<boolean> {
    // Si no existe el hash señuelo, el módulo no está listo para autenticar con seguridad.
    if (!this.dummyPasswordHash) throw new ServiceUnavailableException('Autenticación temporalmente no disponible.');
    return verify(this.dummyPasswordHash, password).catch(() => false);
  }
}
