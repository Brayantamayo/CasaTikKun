# Organización del frontend

El código fuente vive en `src` y se divide en aplicación, módulos funcionales y piezas compartidas.

```text
src/
├── aplicacion/       # Composición de la aplicación y proveedores globales
├── modulos/          # Funcionalidades del sitio
│   ├── autenticacion/
│   ├── administracion/
│   ├── alojamientos/
│   ├── reservas/
│   ├── resenas/
│   ├── medios/
│   └── ...           # inicio, galeria, nosotros, preguntas y ubicacion
└── compartido/       # Componentes, datos y utilidades reutilizables
    ├── api/
    ├── componentes/
    ├── constantes/
    ├── datos/
    ├── recursos/
    ├── tipos/
    └── utilidades/
```

Dentro de cada módulo, `componentes/` presenta la interfaz, `paginas/` agrupa pantallas, `servicios/` comunica con el backend y `contexto/` comparte estado cuando hace falta.

## Flujo de una petición

1. Un componente recoge la acción de la persona usuaria.
2. El servicio del módulo llama a `compartido/api/api.ts`.
3. El cliente central envía la petición a NestJS, incluye las cookies de sesión y normaliza errores como `ApiError`.
4. El contexto o la página actualiza el estado visible.

El frontend usa `fetch` nativo centralizado; no necesita Axios para este flujo. Define `VITE_AUTH_API_BASE_URL` en el `.env` del frontend con el origen de NestJS (en local, `http://localhost:3000`). El cliente agrega `/api`. La sesión viaja en una cookie HTTP-only y no se almacena en `localStorage`.

La autenticación, reseñas, medios y Cloudinary ya usan servicios del módulo. Las funciones de cabañas y reservas necesitan rutas disponibles en NestJS para persistirse en el servidor. `ERR_CONNECTION_REFUSED` significa que no hay un backend escuchando en el origen configurado.