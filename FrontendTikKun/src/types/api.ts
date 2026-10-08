import { Cabana, TarifasCabana } from './index';

/**
 * ============================================================================
 * CONTRATOS Y DTOs PARA EL BACKEND (API REST) - CASA TIKKUN
 * ============================================================================
 */

/**
 * Estructura estándar de respuesta para todos los endpoints del Backend (`/api/*`).
 */
export interface RespuestaApi<T> {
  exito: boolean;
  datos?: T;
  error?: string;
  marcaTiempo: string;
}

/**
 * Datos para crear o actualizar una Cabaña en el Backend.
 */
export type GuardarCabanaDTO = Omit<Cabana, 'reglas' | 'cortesias' | 'especificaciones'> & {
  reglas?: Cabana['reglas'];
  cortesias?: Cabana['cortesias'];
  especificaciones?: Cabana['especificaciones'];
};

/**
 * Datos para publicar una nueva Reseña de Huésped (se aplica límite máximo de 10 en cola FIFO).
 */
export interface CrearResenaDTO {
  nombreHuesped: string;
  ciudadHuesped?: string;
  calificacion: number;
  cabanaId: string;
  nombreCabana?: string;
  comentario: string;
  tipoViaje?: string;
}

/**
 * Configuración de imágenes dinámicas de la Landing (Hero y Galería de Experiencias).
 */
export interface ConfiguracionMultimediaDTO {
  imagenesHero: string[];
  imagenesGaleria: string[];
  actualizadoEn?: string;
}

/**
 * Datos de una solicitud de reserva enviada por WhatsApp para registro en el Backend.
 */
export interface SolicitudReservaDTO {
  id?: string;
  cabanaId: string;
  nombreCabana: string;
  nombreHuesped: string;
  emailHuesped?: string;
  telefonoHuesped?: string;
  fechaEntrada: string;
  fechaSalida: string;
  noches: number;
  cantidadHuespedes: number;
  totalEstimadoCOP: number;
  anticipo50COP: number;
  notas?: string;
  creadoEn?: string;
}

/**
 * Solicitud y respuesta de inicio de sesión del Panel de Administración.
 */
export interface SolicitudLoginAdminDTO {
  usuario: string;
  clave: string;
}

export interface RespuestaLoginAdminDTO {
  autenticado: boolean;
  token?: string;
  usuario?: {
    correo: string;
    rol: 'admin';
  };
}

/**
 * Mapa de tarifas personalizadas por identificador de cabaña.
 */
export interface MapaSobrescrituraTarifas {
  [cabanaId: string]: TarifasCabana;
}
