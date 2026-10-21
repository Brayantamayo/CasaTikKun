// Vista detallada de un alojamiento y sus características.
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Users, Bed, Sparkles, Check, ChevronLeft, ChevronRight, 
  MessageCircle, ShieldCheck, Star, CheckCircle, CheckCircle2, X,
  Share2, MessageSquarePlus, CreditCard, Clock
} from 'lucide-react';
import { Cabana } from '@/compartido/tipos';
import { TIKKUN_CONTACT } from '@/compartido/datos/tikkunData';
import { useReviews } from '@/modulos/resenas/contexto/ReviewsContext';
import { useAdmin } from '@/modulos/administracion/contexto/contextoAdmin';
import { CabinRatesTable } from '@/modulos/alojamientos/componentes/CabinRatesTable';
import { CabinRulesAndCourtesies } from '@/modulos/alojamientos/componentes/CabinRulesAndCourtesies';
import {
  formatCOP,
  getDefaultStayDates,
  ensureValidCheckoutDate,
  getCabinShortName
} from '@/compartido/utilidades/formatters';
import { calculateStayNights, getEffectiveCabinRates } from '@/compartido/utilidades/pricing';
import { notificar } from '@/compartido/utilidades/notificaciones';

interface CabinDetailViewProps {
  cabinId: string;
  onBackToCatalog: () => void;
  onSelectAnotherCabin: (cabinId: string) => void;
  onBookNow: (accommodationId: string, checkIn?: string, checkOut?: string, guests?: number) => void;
  onOpenLegal?: () => void;
}

export const CabinDetailView: React.FC<CabinDetailViewProps> = ({
  cabinId,
  onBackToCatalog,
  onSelectAnotherCabin,
  onBookNow,
  onOpenLegal,
}) => {
  const { getEffectiveAccommodations } = useAdmin();
  const allAccommodations = getEffectiveAccommodations();
  const accommodation = allAccommodations.find((a) => a.id === cabinId);
  const { getCabinReviews, getCabinStats, addReview } = useReviews();
  const availableImages = accommodation?.imagenesGaleria?.length
    ? accommodation.imagenesGaleria
    : accommodation?.imagenPrincipal ? [accommodation.imagenPrincipal] : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Obtener fechas predeterminadas para la reserva rápida sin desfases horarios.
  const { todayStr, tomorrowStr, dayAfterStr } = getDefaultStayDates();

  const [checkIn, setCheckIn] = useState<string>(tomorrowStr);
  const [checkOut, setCheckOut] = useState<string>(dayAfterStr);
  const [guests, setGuests] = useState<number>(Math.min(2, accommodation?.capacidad || 2));
  const [copiedLink, setCopiedLink] = useState(false);

  // Estado de la ventana para publicar una reseña de esta cabaña.
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revCity, setRevCity] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revTravelType, setRevTravelType] = useState('En Pareja');
  const [revComment, setRevComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewPrivacyAccepted, setReviewPrivacyAccepted] = useState(false);

  // Restablecer la fotografía activa y el desplazamiento al cambiar de cabaña.
  useEffect(() => {
    if (!accommodation) return;
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
    setGuests(Math.min(2, accommodation.capacidad));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [cabinId, accommodation?.capacidad]);

  // Permite cerrar el visor y recorrer las fotos con el teclado.
  useEffect(() => {
    if (!isLightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
      if (event.key === 'ArrowRight' && availableImages.length > 1) {
        setActiveImageIndex((current) => (current + 1) % availableImages.length);
      }
      if (event.key === 'ArrowLeft' && availableImages.length > 1) {
        setActiveImageIndex((current) => (current - 1 + availableImages.length) % availableImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, availableImages.length]);

  if (!accommodation) {
    return (
      <section className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 text-center text-[#465E3C]">
        <p>Este alojamiento ya no está disponible.</p>
        <button type="button" onClick={onBackToCatalog} className="font-semibold underline">Volver al catálogo</button>
      </section>
    );
  }

  // Obtener las reseñas y estadísticas de esta cabaña.
  const cabinReviews = getCabinReviews(accommodation.id);
  const cabinStats = getCabinStats(accommodation.id);
  const effectiveRates = getEffectiveCabinRates(accommodation);

  // Calcular el precio de la estadía según las tres tarifas vigentes.
  const stayBreakdown = calculateStayNights(
    checkIn,
    checkOut,
    effectiveRates,
    accommodation.precioCOP
  );
  const stayNightsCount = stayBreakdown.noches.length > 0 ? stayBreakdown.noches.length : 1;
  const stayTotalCOP = stayBreakdown.totalAlojamientoCOP;
  const deposit50 = Math.round(stayTotalCOP * 0.5);

  const images = availableImages;

  const handleNextPhoto = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevPhoto = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddCabinReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revEmail.trim() || !revComment.trim() || !reviewPrivacyAccepted) return;
    setReviewError('');
    setIsReviewSubmitting(true);
    try {
      await addReview({ nombreHuesped: revName, correoHuesped: revEmail, ciudadHuesped: revCity, calificacion: revRating, cabanaId: accommodation.id, nombreCabana: accommodation.nombre, comentario: revComment, tipoViaje: revTravelType });
      notificar.exito('Gracias, tu reseña fue publicada.');
      setIsReviewModalOpen(false);
      setRevName(''); setRevEmail(''); setRevCity(''); setRevComment(''); setRevRating(5); setReviewPrivacyAccepted(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo publicar la reseña.';
      setReviewError(message);
      notificar.error(message);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  // Obtener las otras cabañas para mostrarlas al final de la página.
  const otherCabins = allAccommodations.filter((a) => a.id !== accommodation.id);
  const shortName = getCabinShortName(accommodation.nombre);

  return (
    <div className="pt-28 sm:pt-32 lg:pt-36 pb-16 bg-tikkun-brand-cream min-h-screen">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navegación de la página y selector de cabañas. */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#EFF4E6] p-2.5 sm:p-3 rounded-2xl border border-[#CCD8B8] shadow-2xs">
          
          {/* Volver al catálogo. */}
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-tikkun-brand-deep bg-tikkun-brand-cream hover:bg-white border border-[#CCD8B8] transition-all cursor-pointer group shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#5D7743] group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver a todas las cabañas</span>
          </button>

          {/* Selector rápido de cabaña. */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar max-w-full">
            <span className="text-[10px] font-bold text-[#556F48] uppercase tracking-wider mr-1 hidden lg:inline">
              Cabañas:
            </span>
            {allAccommodations.map((acc) => {
              const isCurrent = acc.id === accommodation.id;
              const cabinShort = getCabinShortName(acc.nombre);
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => onSelectAnotherCabin(acc.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-tikkun-brand-deep text-white shadow-2xs'
                      : 'bg-tikkun-brand-cream text-[#334E2B] hover:bg-tikkun-brand-sage/30 border border-[#CCD8B8]'
                  }`}
                >
                  <span className="opacity-75">{acc.etiquetaNumeroCabana} · </span>
                  <span>{cabinShort}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Encabezado con nombre, distintivos y opción para compartir. */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-tikkun-brand-deep text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                {accommodation.etiquetaNumeroCabana}
              </span>
              {/* Calificación y cantidad de reseñas de esta cabaña. */}
              {cabinReviews.length > 0 && <span className="px-3 py-1 bg-[#EFF4E6] text-[#2C4423] border border-[#CCD8B8] rounded-lg text-xs font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C48E2E] text-[#C48E2E]" />
                <span>{cabinStats.average} ({cabinReviews.length} reseñas en esta cabaña)</span>
              </span>}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-tikkun-brand-deep tracking-tight">
              {accommodation.nombre}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CCD8B8] bg-white hover:bg-[#EFF4E6] text-xs font-semibold text-tikkun-brand-deep transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#5D7743]" />
              <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>
          </div>
        </div>

        {/* Carrusel principal de fotografías. */}
        <div className="mb-10 space-y-3">
          <div className="relative rounded-2xl overflow-hidden aspect-16/10 sm:aspect-16/9 lg:aspect-21/9 bg-[#101D0E] shadow-xl group">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Ampliar fotografía de la cabaña"
              className="absolute inset-0 z-0 cursor-zoom-in"
            >
              <img
                src={images[activeImageIndex]}
                alt={`${accommodation.nombre} - Foto ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </button>
            
            {/* Degradado para facilitar la lectura sobre la fotografía. */}
            <div className="absolute inset-0 z-[1] bg-linear-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

            {/* Contador de fotografías. */}
            <div className="absolute z-10 bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-semibold text-white">
              Foto {activeImageIndex + 1} de {images.length}
            </div>

            {/* Controles para cambiar de fotografía. */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute z-10 left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-tikkun-brand-deep flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute z-10 right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-tikkun-brand-deep flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                  aria-label="Siguiente foto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas de las fotografías. */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-tikkun-brand-deep ring-2 ring-tikkun-brand-sage scale-102'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {isLightboxOpen && images[activeImageIndex] && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Fotografía ampliada de ${accommodation.nombre}`}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Cerrar fotografía"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <X className="h-6 w-6" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); handlePrevPhoto(); }}
                  aria-label="Foto anterior"
                  className="absolute left-3 sm:left-8 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); handleNextPhoto(); }}
                  aria-label="Siguiente foto"
                  className="absolute right-3 sm:right-8 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <img
              src={images[activeImageIndex]}
              alt={`${accommodation.nombre} - Foto ${activeImageIndex + 1}`}
              onClick={(event) => event.stopPropagation()}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {activeImageIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Detalles de la cabaña y formulario de reserva en dos columnas. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna izquierda: descripción, destacados y comodidades. */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Resumen de capacidad y camas. */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#EFF4E6] rounded-2xl border border-[#CCD8B8] text-center">
              <div className="space-y-0.5">
                <Users className="w-4 h-4 text-[#5B7947] mx-auto" />
                <span className="text-[10px] uppercase font-bold text-[#556F48] block">Capacidad</span>
                <span className="text-xs font-bold text-tikkun-brand-deep">Hasta {accommodation.capacidad} pers.</span>
              </div>
              <div className="space-y-0.5 border-l border-[#CCD8B8]">
                <Bed className="w-4 h-4 text-[#5B7947] mx-auto" />
                <span className="text-[10px] uppercase font-bold text-[#556F48] block">Acomodación</span>
                <span className="text-xs font-bold text-tikkun-brand-deep truncate block px-1">{accommodation.camas}</span>
              </div>
            </div>

            {/* Descripción de la cabaña. */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep">
                Acerca de este refugio
              </h3>
              <p className="text-xs sm:text-sm text-[#384E33] leading-relaxed">
                {accommodation.descripcion}
              </p>
            </div>

            {/* Servicios destacados. */}
            <div className="space-y-2.5 pt-4 border-t border-[#D6DFC7]">
              <h3 className="text-sm sm:text-base font-serif font-bold text-tikkun-brand-deep">
                Lo más destacado de {shortName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#2A3F26]">
                {(accommodation.caracteristicas || []).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5B7947] shrink-0 mt-0.5" />
                    <span className="text-[#253921] leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comodidades disponibles. */}
            <div className="space-y-2.5 pt-4 border-t border-[#D6DFC7]">
              <h3 className="text-sm sm:text-base font-serif font-bold text-tikkun-brand-deep">
                Comodidades
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(accommodation.comodidades || []).map((amenity, idx) => (
                  <div key={idx} className="p-2.5 bg-[#EFF4E6] rounded-lg border border-[#CCD8B8] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#5D7743] shrink-0" />
                    <span className="text-xs font-semibold text-tikkun-brand-deep">{amenity.etiqueta}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabla de tarifas por día. */}
            <div className="pt-5 border-t border-[#D6DFC7]">
              <CabinRatesTable accommodation={accommodation} />
            </div>

            {/* Reglas, horarios y cortesías de la cabaña. */}
            <div className="pt-5 border-t border-[#D6DFC7]">
              <CabinRulesAndCourtesies
                cabinName={accommodation.nombre}
                cabinNumberLabel={accommodation.etiquetaNumeroCabana}
                rules={accommodation.reglas || undefined}
                courtesies={accommodation.cortesias || undefined}
                specifications={accommodation.especificaciones || undefined}
              />
            </div>

          </div>

          {/* Columna derecha: formulario de reserva fijo al desplazarse. */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            
            <div className="bg-tikkun-brand-cream rounded-2xl p-5 sm:p-6 border-2 border-tikkun-brand-sage shadow-lg space-y-4">
              
              {/* Precio calculado según la tarifa de cada noche. */}
              <div className="pb-3 border-b border-[#D6DFC7] flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#5A734D] uppercase tracking-wider block">
                    {checkIn && checkOut ? `Total para ${stayNightsCount} noche(s)` : 'Tarifa por noche'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-tikkun-brand-deep">
                      {formatCOP(stayTotalCOP)}
                    </span>
                    <span className="text-xs text-[#526D46] font-semibold">
                      {checkIn && checkOut ? 'COP' : 'COP / noche'}
                    </span>
                  </div>
                  {checkIn && checkOut && (
                    <div className="text-[11px] text-[#3E5C31] font-semibold mt-1 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#527341]" />
                      <span>Anticipo 50%: <strong>{formatCOP(deposit50)} COP</strong></span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10.5px] text-[#5B7947] font-bold block">{accommodation.etiquetaNumeroCabana}</span>
                  <span className="text-[10px] text-stone-500 font-medium">Desde {formatCOP(accommodation.tarifas?.diaSemana || accommodation.precioCOP)} / noche</span>
                </div>
              </div>

              {/* Selección de fechas y huéspedes. */}
              <div className="space-y-2.5">
                
                {/* Fechas de llegada y salida. */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                      Llegada (Check-in)
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={checkIn}
                      onChange={(e) => {
                        const nextIn = e.target.value;
                        setCheckIn(nextIn);
                        setCheckOut((prevOut) => ensureValidCheckoutDate(nextIn, prevOut));
                      }}
                      className="w-full bg-[#EFF5E8] border border-[#C5D3B0] focus:border-tikkun-brand-deep rounded-lg px-2.5 py-1.5 text-xs font-semibold text-tikkun-brand-deep focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                      Salida (Check-out)
                    </label>
                    <input
                      type="date"
                      min={checkIn || tomorrowStr}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-[#EFF5E8] border border-[#C5D3B0] focus:border-tikkun-brand-deep rounded-lg px-2.5 py-1.5 text-xs font-semibold text-tikkun-brand-deep focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Número de huéspedes. */}
                <div>
                  <label className="block text-[10px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                    Número de Huéspedes
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-[#EFF5E8] border border-[#C5D3B0] focus:border-tikkun-brand-deep rounded-lg px-2.5 py-1.5 text-xs font-semibold text-tikkun-brand-deep focus:outline-hidden"
                  >
                    {[...Array(accommodation.capacidad)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Huésped' : i === 1 ? 'Huéspedes (Pareja)' : 'Huéspedes'}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Información tomada de los datos de la cabaña. */}
              <div className="space-y-2 text-xs text-[#3E5636] pt-2.5 border-t border-[#D6DFC7]">
                <div className="flex items-center gap-2 text-tikkun-brand-deep">
                  <Users className="w-3.5 h-3.5 text-[#5B7947] shrink-0" />
                  <span>Capacidad máxima: <strong>Hasta {accommodation.capacidad} personas</strong></span>
                </div>
                <div className="flex items-center gap-2 text-tikkun-brand-deep">
                  <Bed className="w-3.5 h-3.5 text-[#5B7947] shrink-0" />
                  <span>Acomodación: <strong>{accommodation.camas}</strong></span>
                </div>
                {accommodation.caracteristicas && accommodation.caracteristicas.length > 0 && (
                  <div className="space-y-1 pt-1.5 border-t border-[#D6DFC7]/60">
                    <span className="text-[10px] font-bold text-[#556F48] uppercase tracking-wider block">
                      Incluido en este refugio:
                    </span>
                    {accommodation.caracteristicas.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#3E5636]">
                        <Check className="w-3 h-3 text-[#5B7947] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#2D4525] pt-1.5 border-t border-[#D6DFC7]/50 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#5B7947] shrink-0" />
                  <span>Check-in <strong>3:00 PM</strong> · Check-out <strong>12:00 M</strong></span>
                </div>
                <div className="flex items-center gap-2 text-[#2D4525] text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-[#5B7947] shrink-0" />
                  <span>Cortesía Tikkun: café, huevos, aromáticas y maíz</span>
                </div>
              </div>

              {/* Continuar la reserva por WhatsApp. */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onBookNow(accommodation.id, checkIn, checkOut, guests)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white bg-tikkun-brand-deep hover:bg-[#122210] rounded-xl transition-all shadow-md active:scale-98 border border-tikkun-brand-sage/50 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Reservar {shortName} por WhatsApp</span>
                </button>
              </div>

              {/* Nota sobre la reserva directa. */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#4E6743] font-medium text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5B7947]" />
                <span>Trato directo con el anfitrión · Reserva con el 50%</span>
              </div>

            </div>

            {/* Contacto telefónico directo. */}
            <div className="bg-[#EFF4E6] rounded-xl p-3 border border-[#CCD8B8] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#5B7947] uppercase tracking-wider block">¿Dudas rápidas?</span>
                <span className="text-xs font-bold text-tikkun-brand-deep">Llámanos al celular</span>
              </div>
              <a
                href={`tel:${TIKKUN_CONTACT.telefono}`}
                className="px-3 py-1 rounded-lg bg-tikkun-brand-deep text-white text-xs font-bold hover:bg-[#122210] transition-colors"
              >
                {TIKKUN_CONTACT.telefono}
              </a>
            </div>

          </div>

        </div>

        {/* Reseñas correspondientes únicamente a esta cabaña. */}
        <div id="resenas-cabana" className="mt-14 pt-10 border-t border-[#CCD8B8]">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-tikkun-brand-sage text-tikkun-brand-deep rounded-md text-xs font-bold uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-tikkun-brand-deep" />
                <span>Reseñas Exclusivas · {accommodation.etiquetaNumeroCabana}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-tikkun-brand-deep">
                Opiniones sobre {accommodation.nombre}
              </h2>
              <p className="text-xs sm:text-sm text-[#465E3C] mt-1">
                Comentarios y calificaciones reales de huéspedes que se alojaron en esta cabaña.
              </p>
            </div>

            {/* Añadir una reseña para esta cabaña. */}
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-tikkun-brand-deep hover:bg-[#101F0D] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <MessageSquarePlus className="w-4 h-4 text-tikkun-brand-sage" />
              <span>Dejar reseña para {shortName}</span>
            </button>
          </div>

          {/* Resumen de calificaciones de la cabaña. */}
          <div className="bg-[#EFF4E6] rounded-2xl p-4 sm:p-6 border border-[#CCD8B8] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="text-4xl sm:text-5xl font-serif font-bold text-tikkun-brand-deep tabular-nums">
                {cabinReviews.length > 0 ? cabinStats.average : '—'}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#C48E2E] mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        cabinReviews.length > 0 && i < Math.round(cabinStats.average)
                          ? 'fill-current'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#48623E] font-medium">
                  {cabinReviews.length} {cabinReviews.length === 1 ? 'reseña publicada' : 'reseñas publicadas'} para {accommodation.nombre}
                </p>
              </div>
            </div>

            {cabinReviews.length > 0 && <div className="flex items-center gap-2 text-xs font-semibold text-[#2C4423] bg-white/70 px-3.5 py-2 rounded-xl border border-[#CCD8B8]">
              <CheckCircle className="w-4 h-4 text-[#4A7238]" />
              <span>{cabinReviews.length} reseñas recibidas</span>
            </div>}
          </div>

          {/* Reseñas de esta cabaña. */}
          {cabinReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {cabinReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D5DFCA] shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Calificación y fecha de la reseña. */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#C48E2E]">
                        {[...Array(rev.calificacion)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#698256] font-medium">
                        {rev.fecha}
                      </span>
                    </div>

                    {/* Comentario del huésped. */}
                    <p className="text-xs sm:text-sm text-[#2E4529] leading-relaxed italic">
                      &ldquo;{rev.comentario}&rdquo;
                    </p>
                  </div>

                  {/* Datos del huésped que publicó la reseña. */}
                  <div className="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-tikkun-brand-deep">
                        {rev.nombreHuesped}
                      </h4>
                      <p className="text-[11px] text-[#5B7549]">
                        {rev.ciudadHuesped} · {rev.tipoViaje}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-[#CCD8B8] text-center space-y-3">
              <Star className="w-8 h-8 text-[#C48E2E] mx-auto opacity-60" />
              <h4 className="text-base font-serif font-bold text-tikkun-brand-deep">
                Sé el primero en calificar {accommodation.nombre}
              </h4>
              <p className="text-xs text-[#526D46] max-w-md mx-auto">
                ¿Te has hospedado en esta cabaña? Comparte tus recuerdos sobre la chimenea, el despertar en la niebla y tu descanso.
              </p>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-tikkun-brand-deep text-white text-xs font-bold uppercase tracking-wider"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-tikkun-brand-sage" />
                <span>Escribir la primera reseña</span>
              </button>
            </div>
          )}

        </div>

        {/* Explorar otras cabañas. */}
        <div className="mt-14 pt-8 border-t border-[#CCD8B8]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B7947]">
                Explora Más
              </span>
              <h3 className="text-xl font-serif font-bold text-tikkun-brand-deep">
                Conoce las otras cabañas de Casa Tikkun
              </h3>
            </div>
            <button
              type="button"
              onClick={onBackToCatalog}
              className="text-xs font-bold text-tikkun-brand-deep hover:underline"
            >
              Ver todas →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherCabins.map((other) => (
              <div
                key={other.id}
                onClick={() => onSelectAnotherCabin(other.id)}
                className="bg-tikkun-brand-cream rounded-xl border border-[#D5DFCA] hover:border-tikkun-brand-deep overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer group"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-[#1E2E20]">
                  <img
                    src={other.imagenPrincipal}
                    alt={other.nombre}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-tikkun-brand-deep text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                    {other.etiquetaNumeroCabana}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                  <div>
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-tikkun-brand-deep group-hover:text-[#3B5430] transition-colors truncate">
                      {other.nombre}
                    </h4>
                    <p className="text-[10px] text-[#526D46] truncate">
                      Hasta {other.capacidad} pers. · {other.camas}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#DEE6D5] flex items-center justify-between text-xs">
                    <span className="font-bold text-tikkun-brand-deep">
                      {formatCOP(other.precioCOP)}
                    </span>
                    <span className="text-[10px] font-bold text-[#5B7947]">
                      Ver →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Ventana para escribir una reseña de esta cabaña. */}
      {isReviewModalOpen && (
        <div
          onClick={() => setIsReviewModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#0E1712]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-tikkun-brand-cream rounded-3xl max-w-lg w-full border-2 border-[#D5DFCA] shadow-2xl overflow-hidden relative my-auto p-6 sm:p-7 space-y-4"
          >
            {/* Cerrar la ventana. */}
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#EAEFD9] hover:bg-[#DCE6CA] text-tikkun-brand-deep transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div>
              <div className="inline-block px-2.5 py-0.5 bg-tikkun-brand-sage text-tikkun-brand-deep rounded-md text-[10px] font-bold uppercase tracking-wider mb-1">
                {accommodation.etiquetaNumeroCabana}
              </div>
              <h3 className="text-xl font-serif font-bold text-tikkun-brand-deep">
                Tu opinión sobre {accommodation.nombre}
              </h3>
              <p className="text-xs text-[#48623E] mt-0.5">
                Cuéntale a la comunidad cómo fue tu estadía en esta cabaña.
              </p>
            </div>

            {/* Selector de calificación. */}
            <div className="bg-[#EFF4E6] p-3.5 rounded-xl border border-[#CCD8B8]">
              <span className="block text-[10px] font-bold text-[#556F48] uppercase tracking-wider mb-1.5">
                Tu Calificación
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRevRating(star)}
                    className="p-0.5 hover:scale-120 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= revRating
                          ? 'fill-[#F4B251] text-[#F4B251]'
                          : 'text-stone-300 hover:text-[#F4B251]/70'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-tikkun-brand-deep ml-2">
                  {revRating}.0 estrellas
                </span>
              </div>
            </div>

            {/* Formulario de reseña. */}
            <form onSubmit={handleAddCabinReview} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carolina M."
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-xs text-tikkun-brand-deep focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">Correo electrónico *</label>
                  <input type="email" required maxLength={254} placeholder="tu@correo.com" value={revEmail} onChange={(e) => setRevEmail(e.target.value)} className="w-full bg-white border border-[#CCD8B8] rounded-xl px-3 py-2 text-xs text-tikkun-brand-deep focus:outline-hidden" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                    Ciudad / Origen
                  </label>
                  <input
                    type="text"
                    placeholder="Medellín, Colombia"
                    value={revCity}
                    onChange={(e) => setRevCity(e.target.value)}
                    className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-xs text-tikkun-brand-deep focus:outline-hidden"
                  />
                </div>
              </div>

              {reviewError && <p role="alert" className="text-sm text-red-700">{reviewError}</p>}

              <label className="flex items-start gap-2 rounded-xl border border-[#D5DFCA] bg-white p-3 text-xs leading-5 text-[#465E3C]">
                <input type="checkbox" required checked={reviewPrivacyAccepted} onChange={(event) => setReviewPrivacyAccepted(event.target.checked)} className="mt-1 accent-[#294326]" />
                  <span>Autorizo el tratamiento de mis datos para gestionar esta reseña y que mi nombre y comentario sean visibles públicamente, según la política de privacidad.</span>
              </label>
                <button type="button" onClick={onOpenLegal} className="-mt-2 text-left text-xs font-semibold text-[#365530] underline underline-offset-2">Leer Política de Privacidad</button>

              <div>
                <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                  Tipo de Viaje
                </label>
                <select
                  value={revTravelType}
                  onChange={(e) => setRevTravelType(e.target.value)}
                  className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-xs text-tikkun-brand-deep focus:outline-hidden"
                >
                  <option value="En Pareja">En Pareja</option>
                  <option value="Familia">En Familia</option>
                  <option value="Amigos">Con Amigos</option>
                  <option value="Escapada Solitaria">Retiro Solitario</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                  Tu Experiencia en {shortName} *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={`¿Qué fue lo que más disfrutaste de ${shortName}? La chimenea, la vista a los pinos, el descanso...`}
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl p-3 text-xs text-tikkun-brand-deep focus:outline-hidden resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#465E3C] hover:bg-[#EAEFD9] rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isReviewSubmitting}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-tikkun-brand-deep hover:bg-[#122210] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {isReviewSubmitting ? 'Publicando…' : `Publicar en ${shortName}`}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
