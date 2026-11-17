# Casa Tikkun

Sitio web con React, Vite y TypeScript; API NestJS; Prisma y PostgreSQL/Neon; almacenamiento de imágenes en Cloudinary.

## Desarrollo local

1. Copia `.env.development.example` como `.env.development` y completa allí `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` y las variables de Cloudinary. El archivo real está ignorado por Git. No reutilices secretos que hayan sido compartidos antes; rótalos antes del despliegue.
2. Crea `FrontendTikKun/.env` con `VITE_AUTH_API_BASE_URL=http://localhost:3000`.
3. Desde la raíz, ejecuta `docker compose -f docker-compose.dev.yml up --build`.
4. Abre `http://localhost:3001`. El frontend habla con NestJS en `http://localhost:3000`.

La cuenta inicial se crea una sola vez. Usa una contraseña de al menos 20 caracteres; el backend almacena su hash Argon2id. Después de crear la cuenta, `ADMIN_PASSWORD` se puede quitar del entorno. Las variables `VITE_*` son públicas y nunca deben contener credenciales.

## Despliegue

1. Configura secretos nuevos en el entorno de despliegue: rota base de datos, cuenta de administrador y Cloudinary si esas credenciales estuvieron expuestas previamente. Nunca pongas secretos reales en Git.
2. Copia `.env.production.example` como `.env.production` en el servidor y configura `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `JWT_SECRET` (64 caracteres aleatorios como mínimo), `ADMIN_EMAIL`, `ADMIN_PASSWORD` (al menos 20 caracteres para el primer arranque), `FRONTEND_ORIGIN` (origen HTTPS público exacto) y las credenciales de Cloudinary.
3. Ajusta `FRONTEND_PORT` si hace falta y ejecuta `docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d`. Nginx enruta `/api` al backend, así la cookie HttpOnly se mantiene en el mismo origen.
4. Configura el proxy o balanceador TLS para enviar tráfico a `127.0.0.1:8080`; el puerto del backend queda enlazado solo a loopback. Mantén `FRONTEND_ORIGIN` igual al dominio HTTPS desde el que se carga el sitio.
5. Tras verificar el primer inicio, elimina `ADMIN_PASSWORD` de los secretos del entorno. Conserva `JWT_SECRET` estable (también se usa para la deduplicación HMAC de reseñas). Configura Cloudinary completo para que funcione la administración de imágenes.

La API y Nginx aceptan cargas de hasta 16 MB. Mantén HTTPS, el dominio del frontend y la ruta `/api` al cambiar el proxy. Las migraciones se aplican al iniciar cuando `RUN_MIGRATIONS=true`.
