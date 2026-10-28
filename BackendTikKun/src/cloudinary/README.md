# Imágenes de Cloudinary

Este módulo centraliza las subidas y eliminaciones de imágenes para la portada Hero y la galería pública.

## Organización

- `cloudinary.controller.ts`: rutas HTTP protegidas por `AdminAuthGuard`.
- `cloudinary.service.ts`: firma las peticiones del servidor y se comunica con Cloudinary.
- `dto/`: valida el formato de la imagen, la carpeta permitida y la URL recibida.
- `cloudinary.module.ts`: registra el servicio y reutiliza el módulo de autenticación.

## Rutas

- `POST /api/cloudinary/images`: recibe `{ "image": "data:image/...", "folder": "hero" }` y devuelve la URL segura.
- `DELETE /api/cloudinary/images`: recibe `{ "url": "https://res.cloudinary.com/..." }`; elimina de Cloudinary solo recursos de `casa-tikkun/hero`, `casa-tikkun/gallery` o `casa-tikkun/cabins` pertenecientes a la cuenta configurada.

Ambas rutas requieren la cookie de sesión del administrador. Configura `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` en `BackendTikKun/.env`. El secreto nunca debe exponerse en variables `VITE_*` ni enviarse al navegador.

El frontend conserva las URLs y el orden de las imágenes en su estado administrativo; la landing usa esos mismos datos para el carrusel Hero y la galería con visor ampliado, navegación y miniaturas.
