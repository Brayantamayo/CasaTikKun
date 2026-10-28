# Medios de la landing

`MediaModule` conserva en PostgreSQL las listas ordenadas de imágenes para que Hero y Galería sean iguales para todos los visitantes y sobrevivan reinicios del servidor.

- `GET /api/media`: lectura pública usada al iniciar la landing.
- `PUT /api/media`: escritura autenticada del administrador; permite actualizar Hero o Galería sin sobrescribir la otra lista.
- `SiteMedia`: registro singleton que guarda las URLs de Cloudinary y su orden.

La migración `20261013000000_add_site_media` crea la tabla. Después de actualizar el cliente de Prisma, aplica las migraciones con `pnpm prisma:generate` y `pnpm prisma:migrate` desde `BackendTikKun`.
