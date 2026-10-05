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
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Datos para crear o actualizar una Cabaña en el Backend.
 */
export type GuardarCabanaDTO = Omit<Cabana, 'rules' | 'courtesies' | 'specifications'> & {
  rules?: Cabana['rules'];
  courtesies?: Cabana['courtesies'];
  specifications?: Cabana['specifications'];
};

/**
 * Datos para publicar una nueva Reseña de Huésped (se aplica límite máximo de 10 en cola FIFO).
 */
export interface CrearResenaDTO {
  guestName: string;
  guestCity?: string;
  rating: number;
  accommodationId: string;
  accommodationName?: string;
  comment: string;
  travelType?: string;
}

/**
 * Configuración de imágenes dinámicas de la Landing (Hero y Galería de Experiencias).
 */
export interface ConfiguracionMultimediaDTO {
  heroImages: string[];
  galleryImages: string[];
  updatedAt?: string;
}

/**
 * Datos de una solicitud de reserva enviada por WhatsApp para registro en el Backend.
 */
export interface SolicitudReservaDTO {
  id?: string;
  accommodationId: string;
  accommodationName: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  estimatedTotalCOP: number;
  deposit50COP: number;
  notes?: string;
  createdAt?: string;
}

/**
 * Solicitud y respuesta de inicio de sesión del Panel de Administración.
 */
export interface SolicitudLoginAdminDTO {
  username: string;
  password: string;
}

export interface RespuestaLoginAdminDTO {
  authenticated: boolean;
  token?: string;
  user?: {
    email: string;
    role: 'admin';
  };
}

/**
 * Mapa de tarifas personalizadas por identificador de cabaña.
 */
export interface MapaSobrescrituraTarifas {
  [cabinId: string]: TarifasCabana;
} // Se conservan las claves existentes para mantener la compatibilidad con la API.
