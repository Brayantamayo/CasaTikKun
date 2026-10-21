// Reúne los tipos de dominio compartidos por los módulos del sitio.
/**
 * ============================================================================
 * TIPOS Y MODELOS DE DOMINIO - CASA TIKKUN (SANTA ELENA, ANTIOQUIA)
 * ============================================================================
 * Modelos 100% en español sincronizados con el schema de Prisma.
 */

// ============================================================================
// 1. MÓDULO DE CABAÑAS, TARIFAS Y REGLAS
// ============================================================================

/**
 * Estructura de las 3 tarifas por noche en Pesos Colombianos (COP).
 */
export interface TarifasCabana {
  /** Domingo a Jueves ordinarios (ej. 380.000 COP) */
  diaSemana: number;
  /** Noche de Viernes (ej. 440.000 COP) */
  viernes: number;
  /** Sábados, Domingos de puente y Festivos (ej. 480.000 COP) */
  finDeSemanaFestivo: number;
}

/**
 * Tipos de arquitectura de alojamiento en Casa Tikkun.
 */
export type TipoAlojamiento = 'chalet' | 'cabana' | 'suite' | 'villa';

/**
 * Comodidad o equipamiento destacado dentro de una cabaña.
 */
export interface ComodidadCabana {
  nombreIcono: string;
  etiqueta: string;
}

/**
 * Elemento incluido sin costo en la Cortesía Tikkun de bienvenida.
 */
export interface ElementoCortesia {
  id: string;
  nombre: string;
  descripcion: string;
  nombreIcono: string;
}

/**
 * Regla de convivencia o política esencial de la estadía.
 */
export interface ReglaCabana {
  id: string;
  titulo: string;
  descripcion: string;
  nombreIcono: string;
  destacado?: boolean;
  tipoAccion?: 'whatsapp_transport' | 'none';
}

/**
 * Especificaciones de llegada, ubicación y horarios de cada cabaña.
 */
export interface EspecificacionesCabana {
  ubicacion: string;
  distancia: string;
  horaEntrada: string;
  horaSalida: string;
  autoIngreso: string;
  informacionAcceso: string;
}

/**
 * Modelo principal de una Cabaña / Alojamiento de Casa Tikkun.
 */
export interface Cabana {
  id: string;
  numeroCabana: number;
  etiquetaNumeroCabana: string;
  nombre: string;
  tipo: TipoAlojamiento;
  subtitulo: string;
  descripcion: string;
  capacidad: number;
  camas: string;
  banos: number;
  precioCOP: number;
  precioUSD: number;
  tarifas?: TarifasCabana;
  calificacion: number;
  cantidadResenas: number;
  imagenPrincipal: string;
  imagenesGaleria: string[];
  caracteristicas: string[];
  comodidades: ComodidadCabana[];
  insigniaPopular?: string;
  tamanoM2: number;
  reglas?: ReglaCabana[];
  cortesias?: ElementoCortesia[];
  especificaciones?: EspecificacionesCabana;
}

// ============================================================================
// 2. MÓDULO DE COTIZACIÓN POR NOCHE Y RESERVAS
// ============================================================================

/**
 * Categoría tarifaria aplicable según el día de la semana o festivo.
 */
export type NivelTarifaDia = 'diaSemana' | 'viernes' | 'finDeSemanaFestivo';

/**
 * Desglose individual de una noche dentro del cálculo de estadía.
 */
export interface CalculoNoche {
  fechaStr: string;
  diaDeSemana: number;
  nivelTarifa: NivelTarifaDia;
  etiquetaNivel: string;
  precioCOP: number;
}

/**
 * Resultado completo del cálculo de noches y precio total de la estadía.
 */
export interface ResultadoCalculoEstadia {
  noches: CalculoNoche[];
  totalAlojamientoCOP: number;
  cantidadDiasSemana: number;
  cantidadViernes: number;
  cantidadFinDeSemanaFestivo: number;
}

/**
 * Estados posibles de una reserva.
 */
export type EstadoReserva = 'confirmada' | 'pendiente' | 'cancelada';

/**
 * Datos completos de una reserva registrada.
 */
export interface DatosReserva {
  id: string;
  cabanaId: string;
  nombreCabana: string;
  nombreHuesped: string;
  emailHuesped: string;
  telefonoHuesped: string;
  fechaEntrada: string; // YYYY-MM-DD
  fechaSalida: string; // YYYY-MM-DD
  noches: number;
  cantidadHuespedes: number;
  serviciosExtrasSeleccionados: string[];
  totalExtrasCOP: number;
  totalAlojamientoCOP: number;
  totalGeneralCOP: number;
  solicitudesEspeciales?: string;
  estado: EstadoReserva;
  creadoEn: string;
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
  nombre: string;
  descripcion: string;
  precioCOP: number;
  precioUSD: number;
  categoria: CategoriaServicioExtra;
}

// ============================================================================
// 4. MÓDULO DE RESEÑAS DE HUÉSPEDES
// ============================================================================

/**
 * Reseña y calificación guardada por el backend.
 */
export interface Resena {
  id: string;
  nombreHuesped: string;
  ciudadHuesped: string;
  calificacion: number;
  fecha: string;
  cabanaId: string;
  nombreCabana: string;
  comentario: string;
  tipoViaje: string;
  reservaVerificada: boolean;
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
  urlImagen: string;
  titulo?: string;
  categoria?: CategoriaGaleria;
  descripcion?: string;
  aspecto?: 'horizontal' | 'vertical' | 'cuadrado' | 'landscape' | 'portrait' | 'square';
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
  pregunta: string;
  respuesta: string;
  categoria: CategoriaPreguntaFrecuente;
}

// ============================================================================
// 6. MÓDULO DE INFORMACIÓN DE CONTACTO
// ============================================================================

export interface InformacionContacto {
  telefono: string;
  celular: string;
  telefonoSecundario: string;
  numeroWhatsapp: string;
  correo: string;
  correoSecundario: string;
  instagram: string;
  ubicacion: string;
  direccion: string;
  coordenadasMapa: string;
}

// ============================================================================
// ALIAS DE COMPATIBILIDAD
// ============================================================================
export type Alojamiento = Cabana;

export * from '@/compartido/tipos/api';
