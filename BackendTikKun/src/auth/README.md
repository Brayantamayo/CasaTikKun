# Módulo de autenticación del administrador

Este módulo deja que solo el administrador inicie sesión. NestJS valida el DTO antes de llegar al servicio; Prisma consulta la cuenta; Argon2id compara el hash; y NestJS firma una sesión corta que el navegador conserva en una cookie `HttpOnly`.

## Archivos

- `auth.controller.ts`: endpoints HTTP de inicio, cierre y consulta de sesión.
- `auth.service.ts`: verificación de credenciales y creación inicial de la cuenta desde el entorno.
- `admin-auth.guard.ts`: protege endpoints que requieren una sesión administrativa válida.
- `dto/login.dto.ts`: reglas de validación de las credenciales.
- `prisma/schema.prisma`: modelo persistente `Admin`.

## Arranque local

1. Configura `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET` y `FRONTEND_ORIGIN` en `BackendTikKun/.env`. Prisma usa `DATABASE_URL` para la aplicación y la conexión directa `DATABASE_URL_UNPOOLED` para migraciones. La contraseña inicial no puede tener menos de 20 caracteres y `JWT_SECRET` debe tener al menos 64.
2. Desde `BackendTikKun`, instala dependencias y genera el cliente: `pnpm install` y `pnpm prisma:generate`.
3. Aplica la migración de administradores: `pnpm prisma:migrate`.
4. Inicia la API: `pnpm start:dev`. Por defecto escucha en `http://localhost:3000`.
5. Configura `VITE_AUTH_API_BASE_URL=http://localhost:3000` en el frontend local.

La primera vez que el servidor arranca después de aplicar la migración crea la cuenta indicada por `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Si la cuenta ya existe, no cambia su contraseña al reiniciar. Después de crearla puedes quitar `ADMIN_PASSWORD` del entorno; la base de datos conserva únicamente el hash.

La sesión vive ocho horas, usa cookie `HttpOnly` con `SameSite=Strict`, y el endpoint de login acepta cinco intentos por minuto por IP. Configura HTTPS en producción y define allí las variables en el gestor de secretos del proveedor. Mantén el frontend y la API bajo el mismo sitio para que el navegador envíe la cookie.
