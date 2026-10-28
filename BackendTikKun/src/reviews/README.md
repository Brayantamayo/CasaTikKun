# Módulo de reseñas

Las reseñas se guardan en PostgreSQL y NestJS es la única API que las crea o elimina.

## API para el frontend

- `GET /api/reviews`: público; devuelve hasta 15 reseñas aprobadas.
- `POST /api/reviews`: público; requiere `guestName`, `email`, `rating` (1–5), `cabinId`, `comment` (10–2000 caracteres) y `travelType`. `guestCity` es opcional y el servidor obtiene el nombre de la cabaña del catálogo.
- `GET /api/reviews/admin`: solo administrador; lista pendientes y publicadas.
- `POST /api/reviews/:id/approve`: solo administrador; aprueba una reseña y, si ya hay 15, sustituye atómicamente la publicada más antigua.
- `DELETE /api/reviews/:id`: solo administrador; rechaza una pendiente o retira una publicada. Requiere `credentials: 'include'` para enviar la cookie HttpOnly `admin_session`.

La creación exitosa responde `201` con `{ recibido: true, pendienteAprobacion: true }`; correo repetido responde `409`; el límite de frecuencia responde `429`; administrar sin sesión responde `401`. El backend normaliza el correo y guarda únicamente una huella HMAC con `JWT_SECRET`; ese secreto debe permanecer estable para mantener la deduplicación. La migración de moderación conserva como publicadas las 15 más recientes y elimina del almacenamiento las más antiguas que excedan ese límite.

## Privacidad y verificación

El correo se usa para impedir una segunda reseña y no se devuelve al público ni al panel. Esta regla significa una reseña por correo en todo el sistema. No demuestra que el autor sea una persona distinta ni verifica que se haya hospedado. Hasta conectar las reseñas con reservas confirmadas o verificar el correo con un código, la API devuelve `reservaVerificada: false`.

## Base de datos

La migración `20261013010000_add_reviews` crea la tabla y un índice único de `email_hash`, que también impide duplicados simultáneos. Aplicar las migraciones desde `BackendTikKun` con `pnpm prisma migrate deploy` antes de levantar la API.
