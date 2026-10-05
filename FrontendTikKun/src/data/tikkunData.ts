import {
  Cabana,
  ServicioExtra,
  Resena,
  ElementoGaleria,
  PreguntaFrecuente,
  ElementoCortesia,
  ReglaCabana,
  EspecificacionesCabana,
  InformacionContacto
} from '../types';

// Import local generated high-fidelity assets
import heroGlamping from '../assets/images/hero_glamping_dome_1790614291764.jpg';
import cabinLuxury from '../assets/images/cabin_alpina_luxury_1790614303472.jpg';
import jacuzziSunset from '../assets/images/jacuzzi_sunset_nature_1790614313395.jpg';
import campfireNight from '../assets/images/campfire_starlit_night_1790614323241.jpg';
import cabanaMirador from '../assets/images/cabana_mirador_tikkun_1790783983488.jpg';
import interiorBedroom from '../assets/images/interior_bedroom_glamping_1790784033539.jpg';
import deckMalla from '../assets/images/deck_malla_glamping_1790784044690.jpg';

export const HERO_IMAGE = heroGlamping;

export const TIKKUN_SPECIFICATIONS: EspecificacionesCabana = {
  location: 'Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6, Santa Elena, Medellín, Antioquia',
  distance: 'A 35 minutos de Medellín',
  checkIn: '3:00 PM',
  checkOut: '12:00 M',
  selfCheckIn: 'Self check: instrucciones luego de la reserva',
  accessInfo: 'Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6, Santa Elena, Medellín, Antioquia. Check-in 3:00 PM, Check-Out 12:00 M y Self check con instrucciones luego de la reserva.'
};

export const TIKKUN_COURTESIES: ElementoCortesia[] = [
  {
    id: 'cafe',
    name: 'Café',
    description: 'Café de origen colombiano selecto para preparar en tu cabaña',
    iconName: 'Coffee'
  },
  {
    id: 'aromaticas',
    name: 'Aromáticas',
    description: 'Infusiones naturales de hierbas relajantes de la montaña',
    iconName: 'Leaf'
  },
  {
    id: 'huevos',
    name: 'Huevos',
    description: 'Huevos campesinos frescos para tus preparaciones',
    iconName: 'Egg'
  },
  {
    id: 'aguas',
    name: 'Aguas',
    description: 'Botellas de agua mineral pura para tu hidratación',
    iconName: 'Droplets'
  },
  {
    id: 'sal',
    name: 'Sal',
    description: 'Sal para sazonar a tu gusto en la cocineta campestre',
    iconName: 'Sparkles'
  },
  {
    id: 'maiz-crispetas',
    name: 'Maíz para hacer crispetas',
    description: 'Maíz pira listo para preparar crispetas al calor de la chimenea',
    iconName: 'Popcorn'
  }
];

export const TIKKUN_RULES: ReglaCabana[] = [
  {
    id: 'ruido-alto',
    title: 'No se permite Ruido alto',
    description: 'Preservamos el silencio, la fauna silvestre y el descanso de todos los huéspedes en el bosque de Santa Elena. Música y volumen moderado en todo momento.',
    iconName: 'VolumeX',
    highlight: true
  },
  {
    id: 'reserva-50',
    title: 'Reserva con el 50%',
    description: 'Para apartar y asegurar tu cabaña en la fecha deseada se requiere un anticipo del 50%. El 50% restante se cancela al ingresar.',
    iconName: 'CreditCard'
  },
  {
    id: 'cancelaciones-48h',
    title: 'Cancelaciones con minimo 48Horas',
    description: 'Cualquier solicitud de cancelación debe realizarse con un mínimo de 48 horas de anticipación a la fecha de llegada.',
    iconName: 'Clock'
  },
  {
    id: 'cambio-fecha',
    title: 'Cambios de Fecha y Devoluciones',
    description: 'Ten presente que el cambio de fecha se debe hacer con minimo 48 horas de anticipacion de lo contrario contamos como reserva efectiva no se hacen devoluciones podemos gestionar cambios de fecha bajo los parametros mencionados anteriormente.',
    iconName: 'CalendarClock',
    highlight: true
  },
  {
    id: 'transporte',
    title: 'Si deseas servicio adicional de transporte contáctanos',
    description: 'Si deseas servicio adicional de transporte desde Medellín, el aeropuerto o alrededores, contáctanos previamente a nuestro WhatsApp y con gusto te coordinamos el traslado.',
    iconName: 'Car',
    actionType: 'whatsapp_transport'
  },
  {
    id: 'menores',
    title: 'Menores solo con autorización escrita',
    description: 'El ingreso de menores de edad es permitido únicamente presentando autorización expresa y escrita de sus padres o acudientes legales.',
    iconName: 'FileCheck'
  },
  {
    id: 'mascotas',
    title: 'Se permiten mascotas (Pet Friendly)',
    description: '¡Tus peluditos son bienvenidos en Casa Tikkun! Disfrutarán de amplias zonas verdes, senderos y aire puro en la montaña.',
    iconName: 'Dog'
  }
];

const RAW_ACCOMMODATIONS: Cabana[] = [
  {
    id: 'cabana-1-abba',
    cabinNumber: 1,
    cabinNumberLabel: 'Cabaña 1',
    name: 'Cabaña 1 · Abba',
    type: 'chalet',
    tagline: 'Refugio celestial con chimenea de leña tradicional, terraza mirador y ventanal panorámico a la niebla de Santa Elena',
    description: 'Abba es nuestro santuario insignia de intimidad y descanso profundo. Diseñado con ventanales de piso a techo orientados hacia el bosque de pinos, terraza mirador privada en madera, chimenea de leña interior, cama king size con plumón térmico y desayuno campesino incluido.',
    capacity: 2,
    beds: '1 Cama King Size con lencería de 400 hilos',
    bathrooms: 1,
    priceCOP: 390000,
    priceUSD: 100,
    rates: {
      weekday: 390000,        // Domingo a Jueves
      friday: 450000,         // Noche de Viernes
      weekendHoliday: 490000  // Sábados, Domingos y Festivos
    },
    rating: 4.98,
    reviewsCount: 84,
    sizeM2: 52,
    image: heroGlamping,
    popularBadge: 'Más Solicitada por Parejas',
    galleryImages: [heroGlamping, deckMalla, interiorBedroom, cabanaMirador, campfireNight],
    features: [
      'Terraza panorámica en madera con vista a los pinos',
      'Terraza privada con mirador al bosque',
      'Desayuno campesino de Santa Elena incluido',
      'Copa de vino de bienvenida & fogata nocturna privada',
      'Calefacción ambiental y chimenea de leña tradicional',
      'Wi-Fi Starlink de alta velocidad'
    ],
    amenities: [
      { iconName: 'Eye', label: 'Mirador a los Pinos' },
      { iconName: 'Flame', label: 'Chimenea de Leña' },
      { iconName: 'Coffee', label: 'Desayuno Incluido' },
      { iconName: 'Wifi', label: 'Starlink Wi-Fi' },
      { iconName: 'Sparkles', label: 'Baño de Lujo' },
      { iconName: 'Heart', label: 'Ideal Parejas' }
    ]
  },
  {
    id: 'cabana-2-avinu',
    cabinNumber: 2,
    cabinNumberLabel: 'Cabaña 2',
    name: 'Cabaña 2 · Avinu',
    type: 'cabana',
    tagline: 'Arquitectura nórdica en madera con chimenea tradicional, terraza mirador y asador campestre',
    description: 'Avinu evoca la calidez de un hogar sagrado en la montaña. Con estructura tipo A-frame en madera de pino, dos niveles, sala con chimenea de piedra natural y un mirador perfecto para ver el atardecer en Santa Elena.',
    capacity: 4,
    beds: '1 Cama King + 1 Sofá Cama Queen',
    bathrooms: 1,
    priceCOP: 460000,
    priceUSD: 115,
    rates: {
      weekday: 460000,        // Domingo a Jueves
      friday: 520000,         // Noche de Viernes
      weekendHoliday: 580000  // Sábados, Domingos y Festivos
    },
    rating: 4.96,
    reviewsCount: 62,
    sizeM2: 78,
    image: cabinLuxury,
    popularBadge: 'Ideal Parejas & Familias',
    galleryImages: [cabinLuxury, interiorBedroom, campfireNight, cabanaMirador, deckMalla],
    features: [
      'Chimenea de leña tradicional con provisión ilimitada',
      'Terraza de madera con mirador hacia los pinos',
      'Cocina campestre totalmente equipada',
      'Terraza con asador a carbón y comedor al aire libre',
      'Ducha con claraboya de cristal para ver los árboles',
      'Juegos de mesa artesanales y biblioteca de lectura'
    ],
    amenities: [
      { iconName: 'Flame', label: 'Chimenea Tradicional' },
      { iconName: 'Eye', label: 'Mirador al Bosque' },
      { iconName: 'Utensils', label: 'Cocina Equipada' },
      { iconName: 'Users', label: 'Hasta 4 Huéspedes' },
      { iconName: 'Coffee', label: 'Café de Especialidad' },
      { iconName: 'Wifi', label: 'Wi-Fi Rápido' }
    ]
  },
  {
    id: 'cabana-3-ahav',
    cabinNumber: 3,
    cabinNumberLabel: 'Cabaña 3',
    name: 'Cabaña 3 · Ahav',
    type: 'suite',
    tagline: 'Consagrada al amor de pareja: inmersión en la niebla con balcón mirador y chimenea romántica',
    description: 'Ahav significa amor. Creada especialmente para celebrar aniversarios, pedidas de mano y lunas de miel en Santa Elena. Disfruta de la terraza mirador para ver las estrellas entre los pinos y chimenea tradicional acogedora.',
    capacity: 2,
    beds: '1 Cama King Ergonómica con plumón térmico',
    bathrooms: 1,
    priceCOP: 420000,
    priceUSD: 105,
    rates: {
      weekday: 420000,        // Domingo a Jueves
      friday: 480000,         // Noche de Viernes
      weekendHoliday: 530000  // Sábados, Domingos y Festivos
    },
    rating: 4.97,
    reviewsCount: 49,
    sizeM2: 58,
    image: cabanaMirador,
    popularBadge: 'Experiencia Romántica',
    galleryImages: [cabanaMirador, deckMalla, interiorBedroom, heroGlamping, campfireNight],
    features: [
      'Terraza mirador privada sobre el bosque de niebla',
      'Terraza privada para atardeceres y noches de estrellas',
      'Desayuno servido en terraza privada a la hora deseada',
      'Copa de vino de bienvenida y chimenea encendida',
      'Sistema de sonido envolvente Bluetooth Marshall',
      'Baño privado con calentador de agua continuo'
    ],
    amenities: [
      { iconName: 'Eye', label: 'Terraza Mirador' },
      { iconName: 'Heart', label: 'Especial Parejas' },
      { iconName: 'Music', label: 'Audio Marshall' },
      { iconName: 'Coffee', label: 'Desayuno a la Cama' },
      { iconName: 'Flame', label: 'Chimenea Romántica' },
      { iconName: 'Wifi', label: 'Wi-Fi Starlink' }
    ]
  },
  {
    id: 'cabana-4-agape',
    cabinNumber: 4,
    cabinNumberLabel: 'Cabaña 4',
    name: 'Cabaña 4 · Agape',
    type: 'villa',
    tagline: 'Amor incondicional: espaciosa y acogedora con fogatero privado de piedra y mirador',
    description: 'Agape simboliza el amor más puro y generoso. Espacio amplio y armonioso para familias o grupos de amigos en Santa Elena. Cuenta con zona social con fogatero circular de piedra, cocina gourmet y hamacas rodeadas de naturaleza.',
    capacity: 6,
    beds: '2 Camas Queen + 2 Camas Sencillas',
    bathrooms: 2,
    priceCOP: 720000,
    priceUSD: 180,
    rates: {
      weekday: 720000,        // Domingo a Jueves
      friday: 810000,         // Noche de Viernes
      weekendHoliday: 890000  // Sábados, Domingos y Festivos
    },
    rating: 4.94,
    reviewsCount: 38,
    sizeM2: 125,
    image: campfireNight,
    popularBadge: 'Para Familias & Grupos',
    galleryImages: [campfireNight, interiorBedroom, cabinLuxury, deckMalla, heroGlamping],
    features: [
      'Capacidad hasta 6 personas con total privacidad',
      'Zona social con fogatero circular de piedra',
      'Corredor perimetral con hamacas y mirador',
      'Cocina campestre amplia con dotación completa',
      '2 baños privados completos con agua caliente solar',
      'Parqueadero privado junto a la cabaña'
    ],
    amenities: [
      { iconName: 'Users', label: 'Hasta 6 Personas' },
      { iconName: 'Flame', label: 'Fogatero Privado' },
      { iconName: 'Utensils', label: 'Cocina Completa' },
      { iconName: 'Car', label: 'Parqueadero Privado' },
      { iconName: 'Coffee', label: 'Desayuno Incluido' },
      { iconName: 'Bath', label: '2 Baños Completos' }
    ]
  },
  {
    id: 'cabana-5-nido-en-el-cielo',
    cabinNumber: 5,
    cabinNumberLabel: 'Cabaña 5',
    name: 'Cabaña 5 · Nido en el Cielo',
    type: 'cabana',
    tagline: 'En lo más alto del bosque: vista panorámica al mar de nubes y chimenea tradicional',
    description: 'Nido en el Cielo es un mirador suspendido entre las nubes y los pinos de Santa Elena. Cuenta con un deck volado con vista 180° a los valles andinos, ventanales de cristal templado, cama king y fogata privada bajo las constelaciones.',
    capacity: 3,
    beds: '1 Cama King + 1 Cama Nido',
    bathrooms: 1,
    priceCOP: 440000,
    priceUSD: 110,
    rates: {
      weekday: 440000,        // Domingo a Jueves
      friday: 500000,         // Noche de Viernes
      weekendHoliday: 550000  // Sábados, Domingos y Festivos
    },
    rating: 4.99,
    reviewsCount: 27,
    sizeM2: 65,
    image: cabanaMirador,
    popularBadge: 'Mirador en la Cima',
    galleryImages: [cabanaMirador, deckMalla, interiorBedroom, cabinLuxury, campfireNight],
    features: [
      'Deck en madera teca volado sobre la montaña',
      'Vista privilegiada a la salida del sol y mar de nubes',
      'Chimenea de leña tradicional con madera de roble',
      'Fogata privada exterior con leña seca incluida',
      'Desayuno campesino artesanal servido al despertar',
      'Cafetera de origen y bar de infusiones orgánicas'
    ],
    amenities: [
      { iconName: 'Flame', label: 'Chimenea de Leña' },
      { iconName: 'Flame', label: 'Fogata al Aire Libre' },
      { iconName: 'Eye', label: 'Vista a las Nubes' },
      { iconName: 'Coffee', label: 'Café & Desayuno' },
      { iconName: 'Wifi', label: 'Starlink Wi-Fi' },
      { iconName: 'Users', label: 'Hasta 3 Personas' }
    ]
  }
];

export const ACCOMMODATIONS: Cabana[] = RAW_ACCOMMODATIONS.map((cabin) => ({
  ...cabin,
  rules: TIKKUN_RULES,
  courtesies: TIKKUN_COURTESIES,
  specifications: TIKKUN_SPECIFICATIONS
}));

export const EXTRA_SERVICES: ServicioExtra[] = [
  {
    id: 'cena-romantica',
    name: 'Cena Romántica a la Luz de Velas',
    description: 'Menú gourmet de 3 tiempos preparado por nuestro chef con ingredientes frescos de la región, servido en su deck privado con antorchas y botella de vino tinto o blanco.',
    priceCOP: 180000,
    priceUSD: 45,
    category: 'romance'
  },
  {
    id: 'kit-fogata-masmelos',
    name: 'Kit Fogata Campestre & Masmelo Delights',
    description: 'Cesta rústica con leña de roble aromático, masmelos prémium, galletas artesanales de mantequilla, chocolate amargo 70% antioqueño y copas de vino caliente especiado.',
    priceCOP: 65000,
    priceUSD: 16,
    category: 'aventura'
  },
  {
    id: 'masaje-relajante-pareja',
    name: 'Masaje Terapéutico Holístico (en pareja)',
    description: 'Sesión de 60 minutos con terapeuta certificada en su glamping, utilizando aceites esenciales de pino, eucalipto y lavanda para una profunda desconexión muscular y mental.',
    priceCOP: 240000,
    priceUSD: 60,
    category: 'wellness'
  },
  {
    id: 'decoracion-especial',
    name: 'Decoración de Aniversario / Cumpleaños',
    description: 'Camino de velas aromáticas, pétalos de rosas frescas en la habitación y chimenea encendida, letrero personalizado en madera tallada y chocolates artesanales de autor.',
    priceCOP: 120000,
    priceUSD: 30,
    category: 'romance'
  },
  {
    id: 'desayuno-campesino-vip',
    name: 'Desayuno Típico de Santa Elena & Quesos',
    description: 'Tabla de quesos frescos campesinos, arepas de choclo hechas en fogón de leña, huevos campesinos de gallina feliz, chocolate caliente espumoso y jugo de mora silvestre.',
    priceCOP: 50000,
    priceUSD: 13,
    category: 'gastronomia'
  }
];

export const REVIEWS: Resena[] = [
  // Cabaña 1 · Abba
  {
    id: 'rev-1',
    guestName: 'Valeria Restrepo & Camilo G.',
    guestCity: 'Medellín, Colombia',
    rating: 5,
    date: 'Hace 5 días',
    accommodationId: 'cabana-1-abba',
    accommodationName: 'Cabaña 1 · Abba',
    comment: 'Una experiencia transformadora en Abba. Vivir en Medellín con tanto ruido y llegar en solo 50 minutos a este remanso de paz en Santa Elena fue increíble. La chimenea crepitando con vista a los pinos mientras caía la niebla no tiene precio.',
    travelType: 'En Pareja',
    verifiedBooking: true
  },
  {
    id: 'rev-1b',
    guestName: 'Carlos Mario & Juliana V.',
    guestCity: 'Envigado, Antioquia',
    rating: 5,
    date: 'Hace 2 semanas',
    accommodationId: 'cabana-1-abba',
    accommodationName: 'Cabaña 1 · Abba',
    comment: 'Pasamos el fin de semana en la cabaña Abba. La terraza mirador en madera entre los pinos es perfecta para descansar y ver el atardecer con un buen vino caliente. La cama king es sumamente abrigada y cómoda.',
    travelType: 'En Pareja',
    verifiedBooking: true
  },
  // Cabaña 2 · Avinu
  {
    id: 'rev-2',
    guestName: 'Mateo Cárdenas & Sofia',
    guestCity: 'Bogotá, Colombia',
    rating: 5,
    date: 'Hace 1 semana',
    accommodationId: 'cabana-2-avinu',
    accommodationName: 'Cabaña 2 · Avinu',
    comment: 'La cabaña alpina Avinu superó todas nuestras expectativas. La arquitectura nórdica en madera es bellísima, la chimenea de piedra calienta delicioso toda la noche y el silencio de la montaña te renueva por completo.',
    travelType: 'En Pareja',
    verifiedBooking: true
  },
  {
    id: 'rev-2b',
    guestName: 'Andrés Felipe Gómez',
    guestCity: 'Medellín, Colombia',
    rating: 5,
    date: 'Hace 3 semanas',
    accommodationId: 'cabana-2-avinu',
    accommodationName: 'Cabaña 2 · Avinu',
    comment: 'Estuvimos en Avinu en familia. La cocina campestre está muy bien dotada, la terraza con asador fue un plan espectacular y la vista a los pinos de Santa Elena transmite una paz inmensa.',
    travelType: 'Familia',
    verifiedBooking: true
  },
  // Cabaña 3 · Ahav
  {
    id: 'rev-3',
    guestName: 'Ana Sofía Morales & David',
    guestCity: 'Envigado, Antioquia',
    rating: 5,
    date: 'Hace 10 días',
    accommodationId: 'cabana-3-ahav',
    accommodationName: 'Cabaña 3 · Ahav',
    comment: 'Celebramos nuestro aniversario en Ahav. La decoración con velas aromáticas, la chimenea encendida y la privacidad absoluta hicieron la noche inolvidable. El sonido de los pájaros en la mañana es poesía pura.',
    travelType: 'En Pareja',
    verifiedBooking: true
  },
  {
    id: 'rev-3b',
    guestName: 'Laura Henao & Santiago',
    guestCity: 'Medellín, Colombia',
    rating: 5,
    date: 'Hace 1 mes',
    accommodationId: 'cabana-3-ahav',
    accommodationName: 'Cabaña 3 · Ahav',
    comment: 'Ahav es el santuario perfecto para reconectar en pareja. La vista a la niebla al despertar y el desayuno con arepa de choclo caliente en la terraza privada nos fascinó. Volveremos cada año.',
    travelType: 'En Pareja',
    verifiedBooking: true
  },
  // Cabaña 4 · Agape
  {
    id: 'rev-4',
    guestName: 'Daniel Jaramillo & Familia',
    guestCity: 'Rionegro, Antioquia',
    rating: 5,
    date: 'Hace 2 semanas',
    accommodationId: 'cabana-4-agape',
    accommodationName: 'Cabaña 4 · Agape',
    comment: 'Viajamos en familia con nuestros dos hijos y mi mamá. El espacio de Agape es muy generoso, seguro y acogedor. Los niños disfrutaron mucho el fogatero circular de piedra en la noche para asar masmelos bajo las estrellas.',
    travelType: 'Familia',
    verifiedBooking: true
  },
  {
    id: 'rev-4b',
    guestName: 'Carolina Echeverri & Grupo',
    guestCity: 'Sabaneta, Antioquia',
    rating: 5,
    date: 'Hace 1 mes',
    accommodationId: 'cabana-4-agape',
    accommodationName: 'Cabaña 4 · Agape',
    comment: 'Fuimos un grupo de amigos para desconectar del trabajo. Los 2 baños completos son súper cómodos, el agua sale bien caliente y la cocina nos permitió preparar una cena campestre deliciosa.',
    travelType: 'Familia',
    verifiedBooking: true
  },
  // Cabaña 5 · Nido en el Cielo
  {
    id: 'rev-5',
    guestName: 'Mariana Uribe & Sebastián T.',
    guestCity: 'Sabaneta, Antioquia',
    rating: 5,
    date: 'Hace 4 días',
    accommodationId: 'cabana-5-nido-en-el-cielo',
    accommodationName: 'Cabaña 5 · Nido en el Cielo',
    comment: 'Estar en lo más alto del predio en Nido en el Cielo viendo el mar de nubes abrirse sobre Santa Elena no tiene comparación. La chimenea de leña y la tranquilidad del bosque son un 10/10.',
    travelType: 'En Pareja',
    verifiedBooking: true
  },
  {
    id: 'rev-5b',
    guestName: 'Ricardo Gómez & Marcela',
    guestCity: 'Medellín, Colombia',
    rating: 5,
    date: 'Hace 3 semanas',
    accommodationId: 'cabana-5-nido-en-el-cielo',
    accommodationName: 'Cabaña 5 · Nido en el Cielo',
    comment: 'La vista panorámica de 180 grados a los valles andinos te deja sin palabras. La fogata exterior privada bajo el cielo despejado y el café recién colado en la mañana hicieron nuestra estadía perfecta.',
    travelType: 'En Pareja',
    verifiedBooking: true
  }
];

export const GALLERY_ITEMS: ElementoGaleria[] = [
  {
    id: 'gal-1',
    title: 'Amanecer entre la Niebla en la Cabaña',
    category: 'alojamientos',
    imageUrl: heroGlamping,
    description: 'La luz de la mañana bañando las cabañas rodeadas de bosques de coníferas en Santa Elena.',
    aspect: 'landscape'
  },
  {
    id: 'gal-2',
    title: 'Mirador al Bosque y Atardeceres',
    category: 'paisajes',
    imageUrl: cabanaMirador,
    description: 'Vista directa a los atardeceres dorados de la cordillera andina entre los pinos de Santa Elena.',
    aspect: 'landscape'
  },
  {
    id: 'gal-3',
    title: 'Arquitectura Alpina en Madera Serena',
    category: 'alojamientos',
    imageUrl: cabinLuxury,
    description: 'Diseño nórdico minimalista que rinde homenaje a la tradición maderera y campestre antioqueña.',
    aspect: 'landscape'
  },
  {
    id: 'gal-4',
    title: 'Noches de Fogata bajo el Cielo Estrellado',
    category: 'fogatas',
    imageUrl: campfireNight,
    description: 'El calor del fuego de roble mientras contemplas una de las noches más despejadas de Antioquia.',
    aspect: 'landscape'
  },
  {
    id: 'gal-5',
    title: 'Desconexión y Lectura en la Naturaleza',
    category: 'paisajes',
    imageUrl: deckMalla,
    description: 'El silencio absoluto del bosque solo acompañado por el trino de las aves nativas.',
    aspect: 'square'
  },
  {
    id: 'gal-6',
    title: 'Noches Iluminadas en Casa Tikkun',
    category: 'fogatas',
    imageUrl: heroGlamping,
    description: 'Luces cálidas que acogen a los viajeros al caer la tarde en las montañas de Santa Elena.',
    aspect: 'landscape'
  }
];

export const FAQS: PreguntaFrecuente[] = [
  {
    question: '¿Dónde está ubicada Casa Tikkun y cuánto se tarda desde Medellín?',
    answer: 'Estamos ubicados en Santa Elena, Antioquia KM 6, a tan solo 35 minutos de Medellín. La vía principal está completamente pavimentada en excelente estado y el acceso es apto y cómodo para cualquier tipo de automóvil particular.',
    category: 'llegada'
  },
  {
    question: '¿Cuáles son los horarios de Check-in y Check-out?',
    answer: 'El Check-in es a partir de las 3:00 PM y el Check-out es a las 12:00 M (Mediodía). Contamos con modalidad de Self Check-in con instrucciones detalladas de acceso entregadas luego de confirmar tu reserva.',
    category: 'politicas'
  },
  {
    question: '¿Qué incluye la Cortesía Tikkun en cada cabaña?',
    answer: 'Cada cabaña cuenta con nuestra Cortesía Tikkun de bienvenida: Café selecto colombiano, Aromáticas naturales de la montaña, Huevos campesinos frescos, Aguas minerales puras, Sal para cocinar y Maíz para hacer crispetas al calor de la chimenea.',
    category: 'servicios'
  },
  {
    question: '¿Cómo se manejan las tarifas y precios de las cabañas?',
    answer: 'Manejamos 3 tarifas diferenciadas por noche para cada cabaña: Domingo a Jueves (tarifa entre semana, la más económica), Viernes (inicio de fin de semana) y Sábados, Domingos y Festivos (temporada alta / puentes). Todas las tarifas incluyen desayuno campesino artesanal, chimenea de leña tradicional con provisión de leña y la Cortesía Tikkun completa. El cotizador calcula el total exacto según los días de tu estadía.',
    category: 'politicas'
  },
  {
    question: '¿Cuáles son las reglas de reserva, cancelaciones y cambios de fecha?',
    answer: 'Se reserva con el 50% de anticipo. Las cancelaciones deben realizarse con mínimo 48 horas de anticipación. Ten presente que el cambio de fecha se debe hacer con mínimo 48 horas de anticipación de lo contrario contamos como reserva efectiva, no se hacen devoluciones; podemos gestionar cambios de fecha bajo los parámetros mencionados anteriormente.',
    category: 'politicas'
  },
  {
    question: '¿Se permite ruido o música a alto volumen?',
    answer: 'No se permite ruido alto. Casa Tikkun es un refugio consagrado a la desconexión, la paz, el descanso y la conservación de la fauna nativa de Santa Elena, por lo que solicitamos volumen moderado en todo momento.',
    category: 'politicas'
  },
  {
    question: '¿Se permiten mascotas y menores de edad?',
    answer: '¡Sí! Se permiten mascotas (somos 100% Pet Friendly con amplias zonas verdes). Respecto a menores de edad, su ingreso y alojamiento es permitido solo con autorización escrita de sus padres o tutores legales.',
    category: 'politicas'
  },
  {
    question: '¿Ofrecen servicio adicional de transporte?',
    answer: '¡Sí! Si deseas servicio adicional de transporte privado desde Medellín, el Aeropuerto José María Córdova (MDE) o alrededores, contáctanos previamente a nuestro WhatsApp y lo coordinamos para ti.',
    category: 'servicios'
  },
  {
    question: '¿Cómo funciona el Self Check-in?',
    answer: 'Una vez confirmada tu reserva recibirás un instructivo claro y privado con las indicaciones de llegada exacta al KM 6 y el código / acceso autónomo para ingresar a tu cabaña con total comodidad.',
    category: 'llegada'
  },
  {
    question: '¿Las cabañas cuentan con chimenea de leña y calefacción?',
    answer: 'Sí, todas las cabañas y chalets de Casa Tikkun cuentan con chimenea de leña tradicional con provisión de leña seca de roble incluida, cobijas térmicas afelpadas y fogateros exteriores privados para disfrutar del clima fresco de la montaña.',
    category: 'servicios'
  },
  {
    question: '¿Tienen buena conexión a internet para teletrabajo?',
    answer: 'Sí. Todas las instalaciones de Casa Tikkun cuentan con internet satelital Starlink de alta velocidad (120-220 Mbps estables) con cobertura Wi-Fi en cada cabaña y terrazas, ideal para nómadas digitales o personas que deseen trabajar en medio de la naturaleza.',
    category: 'servicios'
  }
];

export const TIKKUN_CONTACT: InformacionContacto = {
  phone: '+57 311 328 1789',
  cellphone: '+57 311 328 1789',
  secondaryPhone: '+57 312 849 5210',
  whatsappNumber: '573113281789',
  email: 'info@casatikkun.com',
  secondaryEmail: 'reservas@casatikkun.com',
  instagram: '@casatikkun.glamping',
  location: 'Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6, Santa Elena, Medellín, Antioquia',
  address: 'Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6, Santa Elena, Medellín, Antioquia',
  mapsCoords: '6.2086, -75.4983'
};

export {
  type NivelTarifaDia,
  type CalculoNoche,
  type ResultadoCalculoEstadia,
  type DayTier,
  type NightCalculation,
  type StayCalculationResult,
  getEffectiveCabinRates,
  getNightTier,
  calculateStayNights
} from '../utils/pricing';


