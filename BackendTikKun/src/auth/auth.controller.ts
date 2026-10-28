
// Importa los decoradores necesarios para gestionar rutas y peticiones HTTP.
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
// Permite acceder a las variables de configuración.
import { ConfigService } from '@nestjs/config';
// Importa el tipo Response de Express para gestionar cookies.
import { Response } from 'express';
// Limita la cantidad de intentos de inicio de sesión.
import { Throttle } from '@nestjs/throttler';
// Importa el guard de autenticación y el tipo de petición del administrador.
import { AdminAuthGuard, AdminRequest } from './admin-auth.guard';
// Importa el servicio que gestiona la autenticación.
import { AuthService } from './auth.service';
// Importa la estructura de datos requerida para iniciar sesión.
import { LoginDto } from './dto/login.dto';

// Define la duración de la sesión: 8 horas en milisegundos.
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

// Controller que gestiona las rutas de autenticación bajo /auth.
@Controller('auth')
export class AuthController {
  // Inyecta los servicios de autenticación y configuración.
  constructor(private readonly auth: AuthService, private readonly config: ConfigService) {}

  // Inicia sesión, valida las credenciales y guarda el token en una cookie.
  @Post('login')
  // Permite un máximo de 5 intentos cada 60 segundos, según la configuración del limitador.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    // Comprueba las credenciales y obtiene los datos del administrador.
    const admin = await this.auth.login(dto.email, dto.password);

    // Guarda el token de sesión en una cookie con opciones de seguridad.
    response.cookie('admin_session', admin.token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_MAX_AGE_MS,
    });

    // Devuelve los datos públicos del administrador, sin enviar el token.
    return { success: true, data: { id: admin.id, email: admin.email } };
  }

  // Cierra la sesión eliminando la cookie del administrador.
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    // Elimina la cookie usando las mismas opciones con las que fue creada.
    response.clearCookie('admin_session', {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { success: true };
  }

  // Consulta los datos del administrador que tiene una sesión válida.
  @Get('me')
  // Protege la ruta verificando la sesión antes de permitir el acceso.
  @UseGuards(AdminAuthGuard)
  me(@Req() request: AdminRequest) {
    // Devuelve los datos del administrador que el guard validó.
    return { success: true, data: request.admin };
  }
}

