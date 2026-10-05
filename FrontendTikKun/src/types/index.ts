/**
 * ============================================================================
 * TIPOS Y MODELOS DE DOMINIO - CASA TIKKUN (SANTA ELENA, ANTIOQUIA)
 * ============================================================================
 * Archivo centralizado y organizado por módulos en español:
 * 1. Cabañas, Tarifas y Reglas
 * 2. Cotización por Noche y Reservas
 * 3. Servicios Adicionales (Experiencias)
 * 4. Reseñas de Huéspedes (Máx. 10 FIFO)
 * 5. Galería y Preguntas Frecuentes (FAQ)
 * 6. Información de Contacto
 */

// ============================================================================
// 1. MÓDULO DE CABAÑAS, TARIFAS Y REGLAS
// ============================================================================

/**
 * Estructura de las 3 tarifas por noche en Pesos Colombianos (COP).
 */
export interface TarifasCabana {
  /** Domingo a Jueves ordinarios (ej. 380.000 COP) */
  weekday: number;
  /** Noche de Viernes (ej. 440.000 COP) */
  friday: number;
  /** Sábados, Domingos de puente y Festivos (ej. 480.000 COP) */
  weekendHoliday: number;
}

/**
 * Tipos de arquitectura de alojamiento en Casa Tikkun.
 */
export type TipoAlojamiento = 'chalet' | 'cabana' | 'suite' | 'villa';

/**
 * Comodidad o equipamiento destacado dentro de una cabaña.
 */
export interface ComodidadCabana {
  iconName: string;
  label: string;
}

/**
 * Elemento incluido sin costo en la Cortesía Tikkun de bienvenida.
 */
export interface ElementoCortesia {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

/**
 * Regla de convivencia o política esencial de la estadía.
 */
export interface ReglaCabana {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlight?: boolean;
  actionType?: 'whatsapp_transport' | 'none';
}

/**
 * Especificaciones de llegada, ubicación y horarios de cada cabaña.
 */
export interface EspecificacionesCabana {
  location: string;
  distance: string;
  checkIn: string;
  checkOut: string;
  selfCheckIn: string;
  accessInfo: string;
}

/**
 * Modelo principal de una Cabaña / Alojamiento de Casa Tikkun.
 */
export interface Cabana {
  id: string;
  cabinNumber: number;
  cabinNumberLabel: string;
  name: string;
  type: TipoAlojamiento;
  tagline: string;
  description: string;
  capacity: number;
  beds: string;
  bathrooms: number;
  priceCOP: number;
  priceUSD: number;
  rates?: TarifasCabana;
  rating: number;
  reviewsCount: number;
  image: string;
  galleryImages: string[];
  features: string[];
  amenities: ComodidadCabana[];
  popularBadge?: string;
  sizeM2: number;
  rules?: ReglaCabana[];
  courtesies?: ElementoCortesia[];
  specifications?: EspecificacionesCabana;
}

// ============================================================================
// 2. MÓDULO DE COTIZACIÓN POR NOCHE Y RESERVAS
// ============================================================================

/**
 * Categoría tarifaria aplicable según el día de la semana o festivo.
 */
export type NivelTarifaDia = 'weekday' | 'friday' | 'weekendHoliday';

/**
 * Desglose individual de una noche dentro del cálculo de estadía.
 */
export interface CalculoNoche {
  dateStr: string;
  dayOfWeek: number;
  tier: NivelTarifaDia;
  tierLabel: string;
  priceCOP: number;
}

/**
 * Resultado completo del cálculo de noches y precio total de la estadía.
 */
export interface ResultadoCalculoEstadia {
  nights: CalculoNoche[];
  totalAccommodationCOP: number;
  weekdayCount: number;
  fridayCount: number;
  weekendHolidayCount: number;
}

/**
 * Estados posibles de una reserva.
 */
export type EstadoReserva = 'confirmada' | 'pendiente';

/**
 * Datos completos de una reserva registrada.
 */
export interface DatosReserva {
  id: string;
  accommodationId: string;
  accommodationName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guestsCount: number;
  selectedExtras: string[];
  extrasTotalCOP: number;
  accommodationTotalCOP: number;
  grandTotalCOP: number;
  specialRequests?: string;
  status: EstadoReserva;
  createdAt: string;
}

// ============================================================================
// 3. MÓDULO DE SERVICIOS ADICIONALES (EXPERIENCIAS)
// ============================================================================

export type CategoriaServicioExtra = 'romance' | 'wellness' | 'gastronomia' | 'aventura';

/**
 * Servicio o experiencia adicional complementaria a la reserva.
 */
export interface ServicioExtra {
  id: string;
  name: string;
  description: string;
  priceCOP: number;
  priceUSD: number;
  category: CategoriaServicioExtra;
}

// ============================================================================
// 4. MÓDULO DE RESEÑAS DE HUÉSPEDES
// ============================================================================

/**
 * Reseña y calificación dejada por un huésped (máximo 10 activas en cola FIFO).
 */
export interface Resena {
  id: string;
  guestName: string;
  guestCity: string;
  rating: number;
  date: string;
  accommodationId: string;
  accommodationName: string;
  comment: string;
  travelType: string;
  verifiedBooking: boolean;
}

// ============================================================================
// 5. MÓDULO DE GALERÍA Y PREGUNTAS FRECUENTES (FAQ)
// ============================================================================

export type CategoriaGaleria =
  | 'todos'
  | 'alojamientos'
  | 'paisajes'
  | 'relax'
  | 'fogatas'
  | 'gastronomia'
  | string;

/**
 * Elemento fotográfico de la Galería de Experiencias.
 */
export interface ElementoGaleria {
  id: string;
  imageUrl: string;
  title?: string;
  category?: CategoriaGaleria;
  description?: string;
  aspect?: 'landscape' | 'portrait' | 'square';
}

export type CategoriaPreguntaFrecuente =
  | 'llegada'
  | 'estadia'
  | 'servicios'
  | 'politicas'
  | 'alojamiento'
  | 'ubicacion'
  | string;

/**
 * Pregunta y respuesta del Centro de Ayuda (FAQ).
 */
export interface PreguntaFrecuente {
  question: string;
  answer: string;
  category: CategoriaPreguntaFrecuente;
}

// ============================================================================
// 6. MÓDULO DE INFORMACIÓN DE CONTACTO
// ============================================================================

export interface InformacionContacto {
  phone: string;
  cellphone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  secondaryEmail: string;
  instagram: string;
  location: string;
  address: string;
  mapsCoords: string;
}

// ============================================================================
// ALIAS DE COMPATIBILIDAD
// ============================================================================
export type Alojamiento = Cabana;

export * from './api';
