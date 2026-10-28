# Módulo de cabañas

Administra el inventario de alojamientos desde NestJS. El catálogo público solo permite lectura; crear, editar y eliminar requieren la cookie de sesión HttpOnly emitida por `AuthModule`.

## Rutas

| Método | Ruta | Acceso | Uso |
| --- | --- | --- | --- |
| `GET` | `/api/cabins` | Público | Lista cabañas en orden numérico. |
| `POST` | `/api/cabins` | Admin | Crea una cabaña; el servidor asigna el identificador. |
| `PUT` | `/api/cabins/:id` | Admin | Actualiza todos los campos editables de una cabaña. |
| `DELETE` | `/api/cabins/:id` | Admin | Elimina la cabaña; se conserva al menos una activa. |

Las rutas de escritura usan DTOs con `class-validator`. El `ValidationPipe` global transforma números, rechaza propiedades desconocidas y detiene la petición ante datos inválidos. El número de cabaña es único en PostgreSQL y una colisión devuelve `409 Conflict`.

Las fotos deben subirse a Cloudinary por el módulo autenticado `/api/cloudinary/images`; el DTO de cabañas persiste sus URLs seguras, no archivos o credenciales.

## Prisma y Neon

El modelo y la migración versionada están en `prisma/schema.prisma` y `prisma/migrations/20261013020000_add_cabins/`. Después de generar el cliente Prisma, aplica las migraciones con `npm run prisma:migrate` desde `BackendTikKun`. El script usa `DATABASE_URL_UNPOOLED` para migraciones y `DATABASE_URL` para consultas de la API.

La migración `20261013030000_remove_demo_cabins` borra solo los cinco IDs fijos usados por el catálogo de demostración anterior; las cabañas creadas desde el panel conservan UUIDs y no coinciden con esos IDs.
