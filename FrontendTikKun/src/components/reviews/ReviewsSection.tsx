import React, { useState, useMemo } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X, Filter } from 'lucide-react';
import { useReviews } from '../../context/ReviewsContext';
import { useAdmin } from '../../context/AdminContext';
import landscapePhoto from '../../assets/images/panorama_montana_sunset_1790795159192.jpg';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview } = useReviews();
  const { getEffectiveAccommodations } = useAdmin();
  const allAccommodations = getEffectiveAccommodations();

  const [selectedCabinFilter, setSelectedCabinFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [accommodationId, setAccommodationId] = useState(allAccommodations[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [travelType, setTravelType] = useState('En Pareja');
  const [comment, setComment] = useState('');

  const filteredReviews = useMemo(() => {
    if (selectedCabinFilter === 'all') return reviews;
    return reviews.filter((r) => r.accommodationId === selectedCabinFilter);
  }, [reviews, selectedCabinFilter]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    addReview({
      guestName: name,
      guestCity: city,
      rating,
      accommodationId,
      comment,
      travelType
    });

    setIsModalOpen(false);
    setName('');
    setCity('');
    setComment('');
    setRating(5);
  };

  return (
    <section id="resenas" className="py-20 sm:py-24 bg-[#F2F6EC] border-t border-[#CCD8B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div>
            <div className="inline-block px-3 py-1 bg-[#B6C29A] text-[#1E311A] text-xs font-bold uppercase tracking-widest rounded-md mb-2">
              Testimonios de Huéspedes
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1E311A] tracking-tight [text-wrap:balance]">
              Lo que dicen quienes han vivido Casa Tikkun
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#465E3C]">
              Opiniones reales de viajeros que encontraron en Santa Elena su lugar favorito de reconexión y descanso.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#1E311A] hover:bg-[#101F0D] rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#B6C29A]" />
            <span>Compartir tu Experiencia</span>
          </button>
        </div>

        {/* Global Rating Scoreboard */}
        <div className="bg-[#FAF8F2] rounded-2xl p-6 sm:p-8 border-2 border-[#CCD8B8] mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Big Score */}
            <div className="md:col-span-4 text-center md:text-left md:border-r border-[#D5DFCA] md:pr-8">
              <div className="text-5xl sm:text-6xl font-serif font-bold text-[#1E311A] tabular-nums">
                4.98
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-[#C48E2E] my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#526947] font-medium">
                Basado en más de 240 estadías verificadas en Google & Directo
              </p>
            </div>

            {/* Category Scores */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-[#1E311A]">
                  <span>Paz, Silencio & Naturaleza</span>
                  <span className="font-bold text-[#2A4222]">5.0 / 5.0</span>
                </div>
                <div className="w-full bg-[#DEE6D5] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#6B854E] h-full rounded-full w-full" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-[#1E311A]">
                  <span>Calor de Chimenea & Acogida</span>
                  <span className="font-bold text-[#2A4222]">5.0 / 5.0</span>
                </div>
                <div className="w-full bg-[#DEE6D5] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#6B854E] h-full rounded-full w-full" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-[#1E311A]">
                  <span>Desayuno Campesino & Sabor</span>
                  <span className="font-bold text-[#2A4222]">4.9 / 5.0</span>
                </div>
                <div className="w-full bg-[#DEE6D5] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#6B854E] h-full rounded-full w-[98%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-[#1E311A]">
                  <span>Limpieza & Lencería de Cama</span>
                  <span className="font-bold text-[#2A4222]">4.9 / 5.0</span>
                </div>
                <div className="w-full bg-[#DEE6D5] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#6B854E] h-full rounded-full w-[99%]" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Cabin Filter Tabs for Reviews */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="text-xs font-bold text-[#3B5430] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedCabinFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCabinFilter === 'all'
                ? 'bg-[#1E311A] text-white shadow-xs'
                : 'bg-[#FAF8F2] text-[#384E33] hover:bg-[#DCE6CA] border border-[#CCD8B8]'
            }`}
          >
            Todas ({reviews.length})
          </button>
          {allAccommodations.map((acc) => {
            const count = reviews.filter((r) => r.accommodationId === acc.id).length;
            const shortName = acc.name.split('·')[1]?.trim() || acc.name;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => setSelectedCabinFilter(acc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCabinFilter === acc.id
                    ? 'bg-[#1E311A] text-white shadow-xs'
                    : 'bg-[#FAF8F2] text-[#384E33] hover:bg-[#DCE6CA] border border-[#CCD8B8]'
                }`}
              >
                {acc.cabinNumberLabel} · {shortName} ({count})
              </button>
            );
          })}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF8F2] p-6 sm:p-7 rounded-2xl border-2 border-[#D5DFCA] hover:border-[#B6C29A] flex flex-col justify-between shadow-xs hover:shadow-lg transition-all"
            >
              <div>
                {/* Top reviewer meta */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[#C48E2E]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#698256] font-semibold">
                    {rev.date}
                  </span>
                </div>

                {/* Accommodation Tag */}
                <div className="inline-block px-2.5 py-1 bg-[#B6C29A]/40 text-[#1E311A] text-xs font-bold rounded-md mb-3">
                  {rev.accommodationName}
                </div>

                {/* Comment quote */}
                <p className="text-sm text-[#384E33] leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 mt-4 border-t border-[#DEE6D5] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1E311A]">
                    {rev.guestName}
                  </h5>
                  <p className="text-[11px] text-[#5B7549]">
                    {rev.guestCity} · {rev.travelType}
                  </p>
                </div>

                {rev.verifiedBooking && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#3E652E]">
                    <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                    Verificada
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#0E1712]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F2] rounded-3xl max-w-3xl w-full border-2 border-[#D5DFCA] shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200"
          >
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#EAEFD9] hover:bg-[#DCE6CA] text-[#1E311A] transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Left Column: Scenic Landscape Background & Interactive Star Rating Hero */}
              <div className="md:col-span-5 relative p-6 sm:p-7 text-white flex flex-col justify-between overflow-hidden">
                <img
                  src={landscapePhoto}
                  alt="Paisaje de montañas y atardecer en Casa Tikkun"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101C11] via-[#101C11]/70 to-[#101C11]/40" />

                <div className="relative z-10">
                  <div className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md text-white rounded-md text-[10px] font-bold uppercase tracking-widest mb-3">
                    Casa Tikkun · Huéspedes
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                    Tu historia en la montaña
                  </h3>
                  <p className="text-xs text-white/85 mt-2 leading-relaxed">
                    Comparte tu experiencia para ayudar a otros viajeros a elegir su refugio ideal en Santa Elena.
                  </p>
                </div>

                {/* Star Rating Block with Glassmorphism */}
                <div className="relative z-10 my-5 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
                  <span className="block text-[11px] font-bold text-[#F0B87F] uppercase tracking-wider mb-2">
                    Tu Calificación General
                  </span>
                  
                  <div className="flex items-center gap-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-hidden"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'fill-[#F4B251] text-[#F4B251] drop-shadow-md'
                              : 'text-white/30 hover:text-[#F4B251]/70'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-white">
                    {rating === 5 && '⭐️⭐️⭐️⭐️⭐️ 5.0 · Experiencia Inolvidable'}
                    {rating === 4 && '⭐️⭐️⭐️⭐️ 4.0 · Muy Buena Estadía'}
                    {rating === 3 && '⭐️⭐️⭐️ 3.0 · Estadía Agradable'}
                    {rating === 2 && '⭐️⭐️ 2.0 · Regular'}
                    {rating === 1 && '⭐️ 1.0 · A Mejorar'}
                  </span>
                </div>

                {/* Footer badge */}
                <div className="relative z-10 text-[11px] text-stone-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B6C29A]" />
                  <span>Reseña verificada de huésped</span>
                </div>
              </div>

              {/* Right Column: Form Fields */}
              <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between bg-[#FAF8F2]">
                <form onSubmit={handleAddReview} className="space-y-3.5">
                  
                  {/* Row 1: Nombre & Ciudad */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#1E311A] uppercase tracking-wider mb-1">
                        Tu Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Laura Gómez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-[#CCD8B8] focus:border-[#1E311A] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1E311A] focus:ring-1 focus:ring-[#1E311A] focus:outline-hidden transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1E311A] uppercase tracking-wider mb-1">
                        Ciudad / Origen
                      </label>
                      <input
                        type="text"
                        placeholder="Medellín, Colombia"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-[#CCD8B8] focus:border-[#1E311A] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1E311A] focus:ring-1 focus:ring-[#1E311A] focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Alojamiento & Tipo de Viaje */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#1E311A] uppercase tracking-wider mb-1">
                        Cabaña
                      </label>
                      <select
                        value={accommodationId}
                        onChange={(e) => setAccommodationId(e.target.value)}
                        className="w-full bg-white border border-[#CCD8B8] focus:border-[#1E311A] rounded-xl px-3 py-2 text-xs text-[#1E311A] focus:ring-1 focus:ring-[#1E311A] focus:outline-hidden transition-all truncate"
                      >
                        {allAccommodations.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.cabinNumberLabel} · {a.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1E311A] uppercase tracking-wider mb-1">
                        Tipo de Viaje
                      </label>
                      <select
                        value={travelType}
                        onChange={(e) => setTravelType(e.target.value)}
                        className="w-full bg-white border border-[#CCD8B8] focus:border-[#1E311A] rounded-xl px-3 py-2 text-xs text-[#1E311A] focus:ring-1 focus:ring-[#1E311A] focus:outline-hidden transition-all"
                      >
                        <option value="En Pareja">En Pareja</option>
                        <option value="Familia">En Familia</option>
                        <option value="Amigos">Con Amigos</option>
                        <option value="Escapada Solitaria">Retiro Solitario</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Comentario */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#1E311A] uppercase tracking-wider mb-1">
                      Tu Reseña / Experiencia *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Cuéntanos sobre la chimenea de leña, el frío de la montaña, la niebla, el desayuno y tu descanso..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-white border border-[#CCD8B8] focus:border-[#1E311A] rounded-xl p-3 text-xs sm:text-sm text-[#1E311A] focus:ring-1 focus:ring-[#1E311A] focus:outline-hidden transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#465E3C] hover:bg-[#EAEFD9] rounded-xl transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#1E311A] hover:bg-[#122210] rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer border border-[#B6C29A]/40"
                    >
                      Publicar Reseña
                    </button>
                  </div>

                </form>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
};
