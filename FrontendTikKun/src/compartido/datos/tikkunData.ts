import {
  Cabana,
  ServicioExtra,
  Resena,
  ElementoGaleria,
  ElementoCortesia,
  ReglaCabana,
  EspecificacionesCabana,
  InformacionContacto
} from '../tipos';

// Imagen propia de Casa Tikkun usada como respaldo hasta cargar fotos individuales.
const OWN_IMAGE = '/Images/Conocenos.png';

export const HERO_IMAGE = OWN_IMAGE;

export const TIKKUN_SPECIFICATIONS: EspecificacionesCabana = {
  ubicacion: 'Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6, Santa Elena, Medellín, Antioquia',
  distancia: 'A 35 minutos de Medellín',
  horaEntrada: '3:00 PM',
  horaSalida: '12:00 M',
  autoIngreso: 'Self check: instrucciones luego de la reserva',
  informacionAcceso: 'Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6, Santa Elena, Medellín, Antioquia. Check-in 3:00 PM, Check-Out 12:00 M y Self check con instrucciones luego de la reserva.'
};

export const TIKKUN_COURTESIES: ElementoCortesia[] = [
  {
    id: 'cafe',
    nombre: 'Café',
    descripcion: 'Café de origen colombiano selecto para preparar en tu cabaña',
    nombreIcono: 'Coffee'
  },
  {
    id: 'aromaticas',
    nombre: 'Aromáticas',
    descripcion: 'Infusiones naturales de hierbas relajantes de la montaña',
    nombreIcono: 'Leaf'
  },
  {
    id: 'huevos',
    nombre: 'Huevos',
    descripcion: 'Huevos campesinos frescos para tus preparaciones',
    nombreIcono: 'Egg'
  },
  {
    id: 'aguas',
    nombre: 'Aguas',
    descripcion: 'Botellas de agua mineral pura para tu hidratación',
    nombreIcono: 'Droplets'
  },
  {
    id: 'sal',
    nombre: 'Sal',
    descripcion: 'Sal para sazonar a tu gusto en la cocineta campestre',
    nombreIcono: 'Sparkles'
  },
  {
    id: 'maiz-crispetas',
    nombre: 'Maíz para hacer crispetas',
    descripcion: 'Maíz pira listo para preparar crispetas al calor de la chimenea',
    nombreIcono: 'Popcorn'
  }
];

export const TIKKUN_RULES: ReglaCabana[] = [
  {
    id: 'ruido-alto',
    titulo: 'No se permite Ruido alto',
    descripcion: 'Preservamos el silencio, la fauna silvestre y el descanso de todos los huéspedes en el bosque de Santa Elena. Música y volumen moderado en todo momento.',
    nombreIcono: 'VolumeX',
    destacado: true
  },
  {
    id: 'reserva-50',
    titulo: 'Reserva con el 50%',
    descripcion: 'Para apartar y asegurar tu cabaña en la fecha deseada se requiere un anticipo del 50%. El 50% restante se cancela al ingresar.',
    nombreIcono: 'CreditCard'
  },
  {
    id: 'cancelaciones-48h',
    titulo: 'Cancelaciones con minimo 48Horas',
    descripcion: 'Cualquier solicitud de cancelación debe realizarse con un mínimo de 48 horas de anticipación a la fecha de llegada.',
    nombreIcono: 'Clock'
  },
  {
    id: 'cambio-fecha',
    titulo: 'Cambios de Fecha y Devoluciones',
    descripcion: 'Ten presente que el cambio de fecha se debe hacer con minimo 48 horas de anticipacion de lo contrario contamos como reserva efectiva no se hacen devoluciones podemos gestionar cambios de fecha bajo los parametros mencionados anteriormente.',
    nombreIcono: 'CalendarClock',
    destacado: true
  },
  {
    id: 'transporte',
    titulo: 'Si deseas servicio adicional de transporte contáctanos',
    descripcion: 'Si deseas servicio adicional de transporte desde Medellín, el aeropuerto o alrededores, contáctanos previamente a nuestro WhatsApp y con gusto te coordinamos el traslado.',
    nombreIcono: 'Car',
    tipoAccion: 'whatsapp_transport'
  },
  {
    id: 'menores',
    titulo: 'Menores solo con autorización escrita',
    descripcion: 'El ingreso de menores de edad es permitido únicamente presentando autorización expresa y escrita de sus padres o acudientes legales.',
    nombreIcono: 'FileCheck'
  },
  {
    id: 'mascotas',
    titulo: 'Se permiten mascotas (Pet Friendly)',
    descripcion: '¡Tus peluditos son bienvenidos en Casa Tikkun! Disfrutarán de amplias zonas verdes, senderos y aire puro en la montaña.',
    nombreIcono: 'Dog'
  }
];

const RAW_ACCOMMODATIONS: Cabana[] = [
  {
    id: 'cabana-1-abba',
    numeroCabana: 1,
    etiquetaNumeroCabana: 'Cabaña 1',
    nombre: 'Cabaña 1 · Abba',
    tipo: 'chalet',
    subtitulo: 'Refugio celestial con chimenea de leña tradicional, terraza mirador y ventanal panorámico a la niebla de Santa Elena',
    descripcion: 'Abba es nuestro santuario insignia de intimidad y descanso profundo. Diseñado con ventanales de piso a techo orientados hacia el bosque de pinos, terraza mirador privada en madera, chimenea de leña interior, cama king size con plumón térmico y desayuno campesino incluido.',
    capacidad: 2,
    camas: '1 Cama King Size con lencería de 400 hilos',
    banos: 1,
    precioCOP: 390000,
    precioUSD: 100,
    tarifas: {
      diaSemana: 390000,        // Domingo a Jueves
      viernes: 450000,         // Noche de Viernes
      finDeSemanaFestivo: 490000  // Sábados, Domingos y Festivos
    },
    calificacion: 4.98,
    cantidadResenas: 84,
    tamanoM2: 52,
    imagenPrincipal: OWN_IMAGE,
    insigniaPopular: 'Más Solicitada por Parejas',
    imagenesGaleria: [OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE],
    caracteristicas: [
      'Terraza panorámica en madera con vista a los pinos',
      'Terraza privada con mirador al bosque',
      'Desayuno campesino de Santa Elena incluido',
      'Copa de vino de bienvenida & fogata nocturna privada',
      'Calefacción ambiental y chimenea de leña tradicional',
      'Wi-Fi Starlink de alta velocidad'
    ],
    comodidades: [
      { nombreIcono: 'Eye', etiqueta: 'Mirador a los Pinos' },
      { nombreIcono: 'Flame', etiqueta: 'Chimenea de Leña' },
      { nombreIcono: 'Coffee', etiqueta: 'Desayuno Incluido' },
      { nombreIcono: 'Wifi', etiqueta: 'Starlink Wi-Fi' },
      { nombreIcono: 'Sparkles', etiqueta: 'Baño de Lujo' },
      { nombreIcono: 'Heart', etiqueta: 'Ideal Parejas' }
    ]
  },
  {
    id: 'cabana-2-avinu',
    numeroCabana: 2,
    etiquetaNumeroCabana: 'Cabaña 2',
    nombre: 'Cabaña 2 · Avinu',
    tipo: 'cabana',
    subtitulo: 'Arquitectura nórdica en madera con chimenea tradicional, terraza mirador y asador campestre',
    descripcion: 'Avinu evoca la calidez de un hogar sagrado en la montaña. Con estructura tipo A-frame en madera de pino, dos niveles, sala con chimenea de piedra natural y un mirador perfecto para ver el atardecer en Santa Elena.',
    capacidad: 4,
    camas: '1 Cama King + 1 Sofá Cama Queen',
    banos: 1,
    precioCOP: 460000,
    precioUSD: 115,
    tarifas: {
      diaSemana: 460000,        // Domingo a Jueves
      viernes: 520000,         // Noche de Viernes
      finDeSemanaFestivo: 580000  // Sábados, Domingos y Festivos
    },
    calificacion: 4.96,
    cantidadResenas: 62,
    tamanoM2: 78,
    imagenPrincipal: OWN_IMAGE,
    insigniaPopular: 'Ideal Parejas & Familias',
    imagenesGaleria: [OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE],
    caracteristicas: [
      'Chimenea de leña tradicional con provisión ilimitada',
      'Terraza de madera con mirador hacia los pinos',
      'Cocina campestre totalmente equipada',
      'Terraza con asador a carbón y comedor al aire libre',
      'Ducha con claraboya de cristal para ver los árboles',
      'Juegos de mesa artesanales y biblioteca de lectura'
    ],
    comodidades: [
      { nombreIcono: 'Flame', etiqueta: 'Chimenea Tradicional' },
      { nombreIcono: 'Eye', etiqueta: 'Mirador al Bosque' },
      { nombreIcono: 'Utensils', etiqueta: 'Cocina Equipada' },
      { nombreIcono: 'Users', etiqueta: 'Hasta 4 Huéspedes' },
      { nombreIcono: 'Coffee', etiqueta: 'Café de Especialidad' },
      { nombreIcono: 'Wifi', etiqueta: 'Wi-Fi Rápido' }
    ]
  },
  {
    id: 'cabana-3-ahav',
    numeroCabana: 3,
    etiquetaNumeroCabana: 'Cabaña 3',
    nombre: 'Cabaña 3 · Ahav',
    tipo: 'suite',
    subtitulo: 'Consagrada al amor de pareja: inmersión en la niebla con balcón mirador y chimenea romántica',
    descripcion: 'Ahav significa amor. Creada especialmente para celebrar aniversarios, pedidas de mano y lunas de miel en Santa Elena. Disfruta de la terraza mirador para ver las estrellas entre los pinos y chimenea tradicional acogedora.',
    capacidad: 2,
    camas: '1 Cama King Ergonómica con plumón térmico',
    banos: 1,
    precioCOP: 420000,
    precioUSD: 105,
    tarifas: {
      diaSemana: 420000,        // Domingo a Jueves
      viernes: 480000,         // Noche de Viernes
      finDeSemanaFestivo: 530000  // Sábados, Domingos y Festivos
    },
    calificacion: 4.97,
    cantidadResenas: 49,
    tamanoM2: 58,
    imagenPrincipal: OWN_IMAGE,
    insigniaPopular: 'Experiencia Romántica',
    imagenesGaleria: [OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE],
    caracteristicas: [
      'Terraza mirador privada sobre el bosque de niebla',
      'Terraza privada para atardeceres y noches de estrellas',
      'Desayuno servido en terraza privada a la hora deseada',
      'Copa de vino de bienvenida y chimenea encendida',
      'Sistema de sonido envolvente Bluetooth Marshall',
      'Baño privado con calentador de agua continuo'
    ],
    comodidades: [
      { nombreIcono: 'Eye', etiqueta: 'Terraza Mirador' },
      { nombreIcono: 'Heart', etiqueta: 'Especial Parejas' },
      { nombreIcono: 'Music', etiqueta: 'Audio Marshall' },
      { nombreIcono: 'Coffee', etiqueta: 'Desayuno a la Cama' },
      { nombreIcono: 'Flame', etiqueta: 'Chimenea Romántica' },
      { nombreIcono: 'Wifi', etiqueta: 'Wi-Fi Starlink' }
    ]
  },
  {
    id: 'cabana-4-agape',
    numeroCabana: 4,
    etiquetaNumeroCabana: 'Cabaña 4',
    nombre: 'Cabaña 4 · Agape',
    tipo: 'villa',
    subtitulo: 'Amor incondicional: espaciosa y acogedora con fogatero privado de piedra y mirador',
    descripcion: 'Agape simboliza el amor más puro y generoso. Espacio amplio y armonioso para familias o grupos de amigos en Santa Elena. Cuenta con zona social con fogatero circular de piedra, cocina gourmet y hamacas rodeadas de naturaleza.',
    capacidad: 6,
    camas: '2 Camas Queen + 2 Camas Sencillas',
    banos: 2,
    precioCOP: 720000,
    precioUSD: 180,
    tarifas: {
      diaSemana: 720000,        // Domingo a Jueves
      viernes: 810000,         // Noche de Viernes
      finDeSemanaFestivo: 890000  // Sábados, Domingos y Festivos
    },
    calificacion: 4.94,
    cantidadResenas: 38,
    tamanoM2: 125,
    imagenPrincipal: OWN_IMAGE,
    insigniaPopular: 'Para Familias & Grupos',
    imagenesGaleria: [OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE],
    caracteristicas: [
      'Capacidad hasta 6 personas con total privacidad',
      'Zona social con fogatero circular de piedra',
      'Corredor perimetral con hamacas y mirador',
      'Cocina campestre amplia con dotación completa',
      '2 baños privados completos con agua caliente solar',
      'Parqueadero privado junto a la cabaña'
    ],
    comodidades: [
      { nombreIcono: 'Users', etiqueta: 'Hasta 6 Personas' },
      { nombreIcono: 'Flame', etiqueta: 'Fogatero Privado' },
      { nombreIcono: 'Utensils', etiqueta: 'Cocina Completa' },
      { nombreIcono: 'Car', etiqueta: 'Parqueadero Privado' },
      { nombreIcono: 'Coffee', etiqueta: 'Desayuno Incluido' },
      { nombreIcono: 'Bath', etiqueta: '2 Baños Completos' }
    ]
  },
  {
    id: 'cabana-5-nido-en-el-cielo',
    numeroCabana: 5,
    etiquetaNumeroCabana: 'Cabaña 5',
    nombre: 'Cabaña 5 · Nido en el Cielo',
    tipo: 'cabana',
    subtitulo: 'En lo más alto del bosque: vista panorámica al mar de nubes y chimenea tradicional',
    descripcion: 'Nido en el Cielo es un mirador suspendido entre las nubes y los pinos de Santa Elena. Cuenta con un deck volado con vista 180° a los valles andinos, ventanales de cristal templado, cama king y fogata privada bajo las constelaciones.',
    capacidad: 3,
    camas: '1 Cama King + 1 Cama Nido',
    banos: 1,
    precioCOP: 440000,
    precioUSD: 110,
    tarifas: {
      diaSemana: 440000,        // Domingo a Jueves
      viernes: 500000,         // Noche de Viernes
      finDeSemanaFestivo: 550000  // Sábados, Domingos y Festivos
    },
    calificacion: 4.99,
    cantidadResenas: 27,
    tamanoM2: 65,
    imagenPrincipal: OWN_IMAGE,
    insigniaPopular: 'Mirador en la Cima',
    imagenesGaleria: [OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE, OWN_IMAGE],
    caracteristicas: [
      'Deck en madera teca volado sobre la montaña',
      'Vista privileged a la salida del sol y mar de nubes',
      'Chimenea de leña tradicional con madera de roble',
      'Fogata privada exterior con leña seca incluida',
      'Desayuno campesino artesanal servido al despertar',
      'Cafetera de origen y bar de infusiones orgánicas'
    ],
    comodidades: [
      { nombreIcono: 'Flame', etiqueta: 'Chimenea de Leña' },
      { nombreIcono: 'Flame', etiqueta: 'Fogata al Aire Libre' },
      { nombreIcono: 'Eye', etiqueta: 'Vista a las Nubes' },
      { nombreIcono: 'Coffee', etiqueta: 'Café & Desayuno' },
      { nombreIcono: 'Wifi', etiqueta: 'Starlink Wi-Fi' },
      { nombreIcono: 'Users', etiqueta: 'Hasta 3 Personas' }
    ]
  }
];

export const ACCOMMODATIONS: Cabana[] = RAW_ACCOMMODATIONS.map((cabin) => ({
  ...cabin,
  reglas: TIKKUN_RULES,
  cortesias: TIKKUN_COURTESIES,
  especificaciones: TIKKUN_SPECIFICATIONS
}));

export const EXTRA_SERVICES: ServicioExtra[] = [
  {
    id: 'cena-romantica',
    nombre: 'Cena Romántica a la Luz de Velas',
    descripcion: 'Menú gourmet de 3 tiempos preparado por nuestro chef con ingredientes frescos de la región, servido en su deck privado con antorchas y botella de vino tinto o blanco.',
    precioCOP: 180000,
    precioUSD: 45,
    categoria: 'romance'
  },
  {
    id: 'kit-fogata-masmelos',
    nombre: 'Kit Fogata Campestre & Masmelo Delights',
    descripcion: 'Cesta rústica con leña de roble aromático, masmelos prémium, galletas artesanales de mantequilla, chocolate amargo 70% antioqueño y copas de vino caliente especiado.',
    precioCOP: 65000,
    precioUSD: 16,
    categoria: 'aventura'
  },
  {
    id: 'masaje-relajante-pareja',
    nombre: 'Masaje Terapéutico Holístico (en pareja)',
    descripcion: 'Sesión de 60 minutos con terapeuta certificada en su glamping, utilizando aceites esenciales de pino, eucalipto y lavanda para una profunda desconexión muscular y mental.',
    precioCOP: 240000,
    precioUSD: 60,
    categoria: 'wellness'
  },
  {
    id: 'decoracion-especial',
    nombre: 'Decoración de Aniversario / Cumpleaños',
    descripcion: 'Camino de velas aromáticas, pétalos de rosas frescas en la habitación y chimenea encendida, letrero personalizado en madera tallada y chocolates artesanales de autor.',
    precioCOP: 120000,
    precioUSD: 30,
    categoria: 'romance'
  },
  {
    id: 'desayuno-campesino-vip',
    nombre: 'Desayuno Típico de Santa Elena & Quesos',
    descripcion: 'Tabla de quesos frescos campesinos, arepas de choclo hechas en fogón de leña, huevos campesinos de gallina feliz, chocolate caliente espumoso y jugo de mora silvestre.',
    precioCOP: 50000,
    precioUSD: 13,
    categoria: 'gastronomia'
  }
];

export const REVIEWS: Resena[] = [
  {
    id: 'rev-1',
    nombreHuesped: 'Valeria Restrepo & Camilo G.',
    ciudadHuesped: 'Medellín, Colombia',
    calificacion: 5,
    fecha: 'Hace 5 días',
    cabanaId: 'cabana-1-abba',
    nombreCabana: 'Cabaña 1 · Abba',
    comentario: 'Una experiencia transformadora en Abba. Vivir en Medellín con tanto ruido y llegar en solo 50 minutos a este remanso de paz en Santa Elena fue increíble. La chimenea crepitando con vista a los pinos mientras caía la niebla no tiene precio.',
    tipoViaje: 'En Pareja',
    reservaVerificada: true
  },
  {
    id: 'rev-1b',
    nombreHuesped: 'Carlos Mario & Juliana V.',
    ciudadHuesped: 'Envigado, Antioquia',
    calificacion: 5,
    fecha: 'Hace 2 semanas',
    cabanaId: 'cabana-1-abba',
    nombreCabana: 'Cabaña 1 · Abba',
    comentario: 'Pasamos el fin de semana en la cabaña Abba. La terraza mirador en madera entre los pinos es perfecta para descansar y ver el atardecer con un buen vino caliente. La cama king es sumamente abrigada y cómoda.',
    tipoViaje: 'En Pareja',
    reservaVerificada: true
  },
  {
    id: 'rev-2',
    nombreHuesped: 'Mateo Cárdenas & Sofia',
    ciudadHuesped: 'Bogotá, Colombia',
    calificacion: 5,
    fecha: 'Hace 1 semana',
    cabanaId: 'cabana-2-avinu',
    nombreCabana: 'Cabaña 2 · Avinu',
    comentario: 'La cabaña alpina Avinu superó todas nuestras expectativas. La arquitectura nórdica en madera es bellísima, la chimenea de piedra calienta delicioso toda la noche y el silencio de la montaña te renueva por completo.',
    tipoViaje: 'En Pareja',
    reservaVerificada: true
  },
  {
    id: 'rev-2b',
    nombreHuesped: 'Andrés Felipe Gómez',
    ciudadHuesped: 'Medellín, Colombia',
    calificacion: 5,
    fecha: 'Hace 3 semanas',
    cabanaId: 'cabana-2-avinu',
    nombreCabana: 'Cabaña 2 · Avinu',
    comentario: 'Estuvimos en Avinu en familia. La cocina campestre está muy bien dotada, la terraza con asador fue un plan espectacular y la vista a los pinos de Santa Elena transmite una paz inmensa.',
    tipoViaje: 'Familia',
    reservaVerificada: true
  },
  {
    id: 'rev-3',
    nombreHuesped: 'Ana Sofía Morales & David',
    ciudadHuesped: 'Envigado, Antioquia',
    calificacion: 5,
    fecha: 'Hace 10 días',
    cabanaId: 'cabana-3-ahav',
    nombreCabana: 'Cabaña 3 · Ahav',
    comentario: 'Celebramos nuestro aniversario en Ahav. La decoración con velas aromáticas, la chimenea encendida y la privacidad absoluta hicieron la noche inolvidable. El sonido de los pájaros en la mañana es poesía pura.',
    tipoViaje: 'En Pareja',
    reservaVerificada: true
  },
  {
    id: 'rev-3b',
    nombreHuesped: 'Laura Henao & Santiago',
    ciudadHuesped: 'Medellín, Colombia',
    calificacion: 5,
    fecha: 'Hace 1 mes',
    cabanaId: 'cabana-3-ahav',
    nombreCabana: 'Cabaña 3 · Ahav',
    comentario: 'Ahav es el santuario perfecto para reconectar en pareja. La vista a la niebla al despertar y el desayuno con arepa de choclo caliente en la terraza privada nos fascinó. Volveremos cada año.',
    tipoViaje: 'En Pareja',
    reservaVerificada: true
  },
  {
    id: 'rev-4',
    nombreHuesped: 'Daniel Jaramillo & Familia',
    ciudadHuesped: 'Rionegro, Antioquia',
    calificacion: 5,
    fecha: 'Hace 2 semanas',
    cabanaId: 'cabana-4-agape',
    nombreCabana: 'Cabaña 4 · Agape',
    comentario: 'Viajamos en familia con nuestros dos hijos y mi mamá. El espacio de Agape es muy generoso, seguro y acogedor. Los niños disfrutaron mucho el fogatero circular de piedra en la noche para asar masmelos bajo las estrellas.',
    tipoViaje: 'Familia',
    reservaVerificada: true
  },
  {
    id: 'rev-4b',
    nombreHuesped: 'Carolina Echeverri & Grupo',
    ciudadHuesped: 'Sabaneta, Antioquia',
    calificacion: 5,
    fecha: 'Hace 1 mes',
    cabanaId: 'cabana-4-agape',
    nombreCabana: 'Cabaña 4 · Agape',
    comentario: 'Fuimos un grupo de amigos para desconectar del trabajo. Los 2 baños completos son súper cómodos, el agua sale bien caliente y la cocina nos permitió preparar una cena campestre deliciosa.',
    tipoViaje: 'Familia',
    reservaVerificada: true
  },
  {
    id: 'rev-5',
    nombreHuesped: 'Mariana Uribe & Sebastián T.',
    ciudadHuesped: 'Sabaneta, Antioquia',
    calificacion: 5,
    fecha: 'Hace 4 días',
    cabanaId: 'cabana-5-nido-en-el-cielo',
    nombreCabana: 'Cabaña 5 · Nido en el Cielo',
    comentario: 'Estar en lo más alto del predio en Nido en el Cielo viendo el mar de nubes abrirse sobre Santa Elena no tiene comparación. La chimenea de leña y la tranquilidad del bosque son un 10/10.',
    tipoViaje: 'En Pareja',
    reservaVerificada: true
  },
  {
    id: 'rev-5b',
    nombreHuesped: 'Ricardo Gómez & Marcela',
    ciudadHuesped: 'Medellín, Colombia',
    calificacion: 5,
    fecha: 'Hace 3 semanas',
    cabanaId: 'cabana-5-nido-en-el-cielo',
    nombreCabana: 'Cabaña 5 · Nido en el Cielo',
    comentario: 'La vista panorámica de 180 grados a los valles andinos te deja sin palabras. La fogata exterior privada bajo el cielo despejado y el café recién colado en la mañana hicieron nuestra estadía perfecta.',
    tipoViaje: 'En Pareja',
    reservaVerificada: true
  }
];

export const GALLERY_ITEMS: ElementoGaleria[] = [
  {
    id: 'gal-1',
    titulo: 'Amanecer entre la Niebla en la Cabaña',
    categoria: 'alojamientos',
    urlImagen: OWN_IMAGE,
    descripcion: 'La luz de la mañana bañando las cabañas rodeadas de bosques de coníferas en Santa Elena.',
    aspecto: 'horizontal'
  },
  {
    id: 'gal-2',
    titulo: 'Mirador al Bosque y Atardeceres',
    categoria: 'paisajes',
    urlImagen: OWN_IMAGE,
    descripcion: 'Vista directa a los atardeceres dorados de la cordillera andina entre los pinos de Santa Elena.',
    aspecto: 'horizontal'
  },
  {
    id: 'gal-3',
    titulo: 'Arquitectura Alpina en Madera Serena',
    categoria: 'alojamientos',
    urlImagen: OWN_IMAGE,
    descripcion: 'Diseño nórdico minimalista que rinde homenaje a la tradición maderera y campestre antioqueña.',
    aspecto: 'horizontal'
  },
  {
    id: 'gal-4',
    titulo: 'Noches de Fogata bajo el Cielo Estrellado',
    categoria: 'fogatas',
    urlImagen: OWN_IMAGE,
    descripcion: 'El calor del fuego de roble mientras contemplas una de las noches más despejadas de Antioquia.',
    aspecto: 'horizontal'
  },
  {
    id: 'gal-5',
    titulo: 'Desconexión y Lectura en la Naturaleza',
    categoria: 'paisajes',
    urlImagen: OWN_IMAGE,
    descripcion: 'El silencio absoluto del bosque solo acompañado por el trino de las aves nativas.',
    aspecto: 'cuadrado'
  },
  {
    id: 'gal-6',
    titulo: 'Noches Iluminadas en Casa Tikkun',
    categoria: 'fogatas',
    urlImagen: OWN_IMAGE,
    descripcion: 'Luces cálidas que acogen a los viajeros al caer la tarde en las montañas de Santa Elena.',
    aspecto: 'horizontal'
  }
];

export const TIKKUN_CONTACT: InformacionContacto = {
  telefono: '+57 311 328 1789',
  celular: '+57 311 328 1789',
  telefonoSecundario: '+57 312 849 5210',
  numeroWhatsapp: '573113281789',
  correo: 'info@casatikkun.com',
  correoSecundario: 'reservas@casatikkun.com',
  instagram: '@casatikkun.glamping',
  ubicacion: 'Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6, Santa Elena, Medellín, Antioquia',
  direccion: 'Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6, Santa Elena, Medellín, Antioquia',
  coordenadasMapa: '6.2086, -75.4983'
};

export {
  type NivelTarifaDia,
  type CalculoNoche,
  type ResultadoCalculoEstadia,
  getEffectiveCabinRates,
  getNightTier,
  calculateStayNights
} from '../utilidades/pricing';
