// Muestra la portada, el carrusel de imágenes y el formulario de disponibilidad.
import React, { useState, useEffect } from 'react';
import { 
  Calendar, ArrowRight, ShieldCheck, Flame, 
  MessageCircle, Star, Coffee, Lock, ChevronRight,
  Leaf, Waves
} from 'lucide-react';
import { ACCOMMODATIONS } from '../../data/tikkunData';
import { useAdmin } from '../../context/AdminContext';
import { getDefaultStayDates, ensureValidCheckoutDate } from '../../utils/formatters';

// Fotografías de respaldo para el carrusel de la portada.
import heroGlamping from '../../assets/images/hero_glamping_dome_1790614291764.jpg';
import cabanaMirador from '../../assets/images/cabana_mirador_tikkun_1790783983488.jpg';
import cabinLuxury from '../../assets/images/cabin_alpina_luxury_1790614303472.jpg';
import deckMalla from '../../assets/images/deck_malla_glamping_1790784044690.jpg';
import campfireNight from '../../assets/images/campfire_starlit_night_1790614323241.jpg';

interface HeroProps {
  onSearchAvailability: (cabinId: string, checkIn: string, checkOut: string, guests: number) => void;
  onExploreCatalog: () => void;
}

const HERO_SLIDES = [
  {
    image: heroGlamping,
    alt: 'Casa Tikkun - Domo geodésico iluminado en medio del bosque de Santa Elena con fogatero y deck'
  },
  {
    image: cabanaMirador,
    alt: 'Casa Tikkun - Mirador panorámico hacia el bosque de Santa Elena'
  },
  {
    image: cabinLuxury,
    alt: 'Casa Tikkun - Cabaña nórdica alpina entre los pinos'
  },
  {
    image: deckMalla,
    alt: 'Casa Tikkun - Terraza mirador hacia las montañas y la niebla'
  },
  {
    image: campfireNight,
    alt: 'Casa Tikkun - Fogata privada bajo las estrellas'
  }
];

export const Hero: React.FC<HeroProps> = ({
  onSearchAvailability,
  onExploreCatalog
}) => {
  const { getEffectiveAccommodations, heroImages } = useAdmin();
  const allAccommodations = getEffectiveAccommodations();

  const activeSlides = (heroImages && heroImages.length > 0 ? heroImages : HERO_SLIDES.map((s) => s.image)).map(
    (imgUrl, idx) => ({
      image: imgUrl,
      alt: `Casa Tikkun - Imagen principal ${idx + 1}`
    })
  );

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Mantener el índice dentro del rango si cambia la cantidad de imágenes.
  useEffect(() => {
    if (currentSlideIndex >= activeSlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [activeSlides.length, currentSlideIndex]);

  // Cambiar automáticamente la imagen de fondo cada seis segundos.
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeSlides.length]);

  // Obtener fechas predeterminadas sin desfases horarios.
  const { todayStr, tomorrowStr, dayAfterStr } = getDefaultStayDates();

  const [selectedCabinId, setSelectedCabinId] = useState<string>(allAccommodations[0]?.id || ACCOMMODATIONS[0]?.id || '');
  const [checkIn, setCheckIn] = useState<string>(tomorrowStr);
  const [checkOut, setCheckOut] = useState<string>(dayAfterStr);
  const [guests, setGuests] = useState<number>(2);

  const selectedCabin = allAccommodations.find((a) => a.id === selectedCabinId) || allAccommodations[0];
  const maxGuests = selectedCabin?.capacity || 6;

  // Seleccionar la primera cabaña disponible si aún no hay una elegida.
  useEffect(() => {
    if (!selectedCabinId && allAccommodations.length > 0) {
      setSelectedCabinId(allAccommodations[0].id);
    }
  }, [allAccommodations, selectedCabinId]);

  useEffect(() => {
    if (guests > maxGuests) {
      setGuests(maxGuests);
    }
  }, [maxGuests, guests]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchAvailability(selectedCabinId, checkIn, checkOut, guests);
  };

  return (
    <section 
      id="inicio" 
      className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-10 sm:pb-14 overflow-hidden"
    >
      
      {/* Fondo dinámico con fotografías de Casa Tikkun. */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeSlides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center"
              />
            </div>
          );
        })}

        {/* Degradado suave para conservar la visibilidad del paisaje. */}
        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-black/25 z-1 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-black/20 via-transparent to-transparent z-1 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center">
        
        {/* Identificación del alojamiento y su ubicación. */}
        <div className="mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs sm:text-[13px] font-medium tracking-wide shadow-md">
            <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>GLAMPING & CASA CAMPESTRE</span>
            <span className="text-white/60">•</span>
            <span>Santa Elena, Antioquia</span>
          </div>
        </div>

        {/* Título y descripción principal. */}
        <div className="mb-4 sm:mb-5 max-w-3xl text-center">
          
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-[84px] font-normal text-white leading-tight tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
            <span>Casa </span>
            <span className="italic">Tikkun</span>
          </h1>

          {/* Frase principal de la marca. */}
          <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-white font-light mt-1.5 sm:mt-2.5 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-balance">
            Un paraíso de descanso, amor y frío en Santa Elena
          </p>

          {/* Descripción breve del alojamiento. */}
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-white/95 leading-relaxed font-normal max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] text-balance">
            Despierta entre pinos y neblina andina a solo 50 minutos de Medellín. Domos geodésicos y cabañas nórdicas con jacuzzi privado a 38°C, chimenea de leña y desayuno campestre incluido.
          </p>
        </div>

        {/* Atributos destacados de la estadía. */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl w-full mb-5 sm:mb-6">
          
          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-xs">
            <Waves className="w-4 h-4 text-[#7AD1D6] shrink-0" />
            <span>Jacuzzi a 38°C</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-xs">
            <Flame className="w-4 h-4 text-[#F3A76C] shrink-0" />
            <span>Fogatero & Leña</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-xs">
            <Coffee className="w-4 h-4 text-[#E2C799] shrink-0" />
            <span>Desayuno incluido</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-xs">
            <Lock className="w-4 h-4 text-white/90 shrink-0" />
            <span>Privacidad total</span>
          </div>

        </div>

        {/* Formulario rápido para consultar disponibilidad. */}
        <div className="w-full max-w-4xl bg-tikkun-brand-cream rounded-3xl p-4 sm:p-5 shadow-2xl border border-[#D5DFCA]">
          
          {/* Encabezado del formulario de disponibilidad. */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#D6DFC7] text-xs">
            
            <div className="flex items-center gap-2 text-tikkun-brand-deep font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#3A5630]" />
              <span>RESERVA TU ESTADÍA EN CASA TIKKUN</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-[#2E4826]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3E652E]" />
                Trato directo con el anfitrión
              </span>
              <span className="text-[#A2AF84]">•</span>
              <span className="flex items-center gap-1 text-[#1EB854] font-semibold">
                <MessageCircle className="w-3.5 h-3.5 fill-[#1EB854] text-white" />
                Respuesta inmediata por WhatsApp
              </span>
            </div>

          </div>

          {/* Campos de búsqueda de estadía. */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-end text-left">
            
            {/* 1. Selección de cabaña. */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="hero-cabin" className="block text-[10px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                ALOJAMIENTO
              </label>
              <div className="relative">
                <select
                  id="hero-cabin"
                  value={selectedCabinId}
                  onChange={(e) => setSelectedCabinId(e.target.value)}
                  className="w-full bg-[#EFF5E8] border border-[#C5D3B0] focus:border-tikkun-brand-deep rounded-xl px-3 py-2.5 text-xs text-tikkun-brand-deep font-semibold focus:outline-hidden transition-all cursor-pointer truncate"
                >
                  {allAccommodations.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.cabinNumberLabel} - {acc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Fecha de llegada. */}
            <div className="sm:col-span-1 lg:col-span-2">
              <label htmlFor="hero-checkin" className="block text-[10px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                LLEGADA
              </label>
              <input
                id="hero-checkin"
                type="date"
                min={todayStr}
                value={checkIn}
                onChange={(e) => {
                  const nextIn = e.target.value;
                  setCheckIn(nextIn);
                  setCheckOut((prevOut) => ensureValidCheckoutDate(nextIn, prevOut));
                }}
                className="w-full bg-[#EFF5E8] border border-[#C5D3B0] focus:border-tikkun-brand-deep rounded-xl px-2.5 py-2.5 text-xs text-tikkun-brand-deep font-semibold focus:outline-hidden transition-all cursor-pointer"
              />
            </div>

            {/* 3. Fecha de salida. */}
            <div className="sm:col-span-1 lg:col-span-2">
              <label htmlFor="hero-checkout" className="block text-[10px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                SALIDA
              </label>
              <input
                id="hero-checkout"
                type="date"
                min={checkIn || tomorrowStr}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-[#EFF5E8] border border-[#C5D3B0] focus:border-tikkun-brand-deep rounded-xl px-2.5 py-2.5 text-xs text-tikkun-brand-deep font-semibold focus:outline-hidden transition-all cursor-pointer"
              />
            </div>

            {/* 4. Número de huéspedes. */}
            <div className="sm:col-span-1 lg:col-span-2">
              <label htmlFor="hero-guests" className="block text-[10px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                HUÉSPEDES
              </label>
              <select
                id="hero-guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-[#EFF5E8] border border-[#C5D3B0] focus:border-tikkun-brand-deep rounded-xl px-2.5 py-2.5 text-xs text-tikkun-brand-deep font-semibold focus:outline-hidden transition-all cursor-pointer"
              >
                {Array.from({ length: maxGuests }, (_, idx) => idx + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Huésped' : 'Huéspedes'}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Consultar disponibilidad. */}
            <div className="sm:col-span-1 lg:col-span-3">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-tikkun-brand-deep hover:bg-[#122210] rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer group"
              >
                <span>CONSULTAR DISPONIBILIDAD</span>
                <ChevronRight className="w-4 h-4 text-tikkun-brand-sage group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </form>

        </div>

        {/* Calificación y acceso al catálogo. */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-white/95">
          
          <div className="flex items-center gap-1.5">
            <div className="flex text-[#F4B251]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-white">4.9/5.0</span>
          </div>

          <span className="text-white/40">|</span>

          <span className="text-white/90">Más de 240 estadías verificadas</span>

          <span className="text-white/40">|</span>

          <button
            type="button"
            onClick={onExploreCatalog}
            className="inline-flex items-center gap-1 text-white hover:text-tikkun-brand-sage font-semibold underline underline-offset-4 cursor-pointer transition-colors"
          >
            <span>Ver fotos y detalles de las {allAccommodations.length} cabañas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

        {/* Indicadores para elegir la imagen de fondo. */}
        <div className="flex items-center gap-1.5 mt-3.5 z-10">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Ver fondo ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlideIndex 
                  ? 'w-7 bg-tikkun-brand-sage'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </div>

    </section>
  );
};
