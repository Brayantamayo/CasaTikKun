import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser = require('cookie-parser');
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  // Las imágenes comprimidas llegan en base64; este límite admite archivos grandes sin aceptar cuerpos ilimitados.
  app.useBodyParser('json', { limit: '16mb' });
  // En producción CORS falla de forma cerrada: nunca habilita localhost por una variable olvidada.
  const configuredFrontendOrigin = process.env.FRONTEND_ORIGIN?.trim();
  if (process.env.NODE_ENV === 'production' && !configuredFrontendOrigin) {
    throw new Error('FRONTEND_ORIGIN must be configured with the production frontend origin.');
  }
  let frontendOrigin = 'http://localhost:3001';
  if (configuredFrontendOrigin) {
    let parsedOrigin: URL;
    try {
      parsedOrigin = new URL(configuredFrontendOrigin);
    } catch {
      throw new Error('FRONTEND_ORIGIN must be a valid origin URL.');
    }
    if (parsedOrigin.pathname !== '/' || parsedOrigin.search || parsedOrigin.hash || parsedOrigin.username || parsedOrigin.password) {
      throw new Error('FRONTEND_ORIGIN must contain only the frontend origin, without a path or credentials.');
    }
    if (process.env.NODE_ENV === 'production' && parsedOrigin.protocol !== 'https:') {
      throw new Error('FRONTEND_ORIGIN must use HTTPS in production.');
    }
    frontendOrigin = parsedOrigin.origin;
  }
  const allowedFrontendOrigins = new Set([frontendOrigin]);
  // En desarrollo Vite puede usar el siguiente puerto libre si el preferido ya está ocupado.
  if (process.env.NODE_ENV !== 'production') {
    allowedFrontendOrigins.add('http://localhost:3000');
    allowedFrontendOrigins.add('http://localhost:3001');
  }

  // Helmet agrega cabeceras HTTP defensivas y cookie-parser permite leer la cookie de sesión.
  app.use(helmet());
  app.use(cookieParser());
  // CORS con credenciales habilita la cookie solo desde el frontend configurado.
  app.enableCors({ origin: [...allowedFrontendOrigins], credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type'], exposedHeaders: ['Set-Cookie'] });
  app.enableShutdownHooks();
  // Prefijo común de API y validación global estricta de todos los DTO de entrada.
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: true,
  }));

  // NestJS usa el puerto 3000; Vite sirve el frontend en el 3001.
  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}

void bootstrap();
