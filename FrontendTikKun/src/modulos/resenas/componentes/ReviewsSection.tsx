// Muestra y permite gestionar las reseñas de los huéspedes.
import React, { useState, useMemo } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X, Filter, Quote } from 'lucide-react';
import { useReviews } from '@/modulos/resenas/contexto/ReviewsContext';
import { useAdmin } from '@/modulos/administracion/contexto/contextoAdmin';
import { notificar } from '@/compartido/utilidades/notificaciones';

export const ReviewsSection: React.FC<{ onOpenLegal?: () => void }> = ({ onOpenLegal }) => {
  const { reviews, addReview } = useReviews();
  const { getEffectiveAccommodations } = useAdmin();
  const allAccommodations = getEffectiveAccommodations();

  const [selectedCabinFilter, setSelectedCabinFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado del formulario para publicar una reseña.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [accommodationId, setAccommodationId] = useState(allAccommodations[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [travelType, setTravelType] = useState('En Pareja');
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const filteredReviews = useMemo(() => {
    if (selectedCabinFilter === 'all') return reviews;
    return reviews.filter((r) => r.cabanaId === selectedCabinFilter);
  }, [reviews, selectedCabinFilter]);
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.calificacion, 0) / reviews.length
    : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((value) => ({
    value,
    count: reviews.filter((review) => review.calificacion === value).length,
  }));

  const formatReviewDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : new Intl.DateTimeFormat('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric',
    }).format(date);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanCity = city.trim();
    const cleanComment = comment.trim();
    if (cleanName.length < 2 || cleanName.length > 100) {
      setSubmitError('Escribe tu nombre (entre 2 y 100 caracteres).');
      return;
    }
    if (cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setSubmitError('Revisa el formato de tu correo electrónico.');
      return;
    }
    if (cleanCity.length > 120) {
      setSubmitError('La ciudad debe tener máximo 120 caracteres.');
      return;
    }
    if (cleanComment.length < 10 || cleanComment.length > 2000) {
      setSubmitError('Tu reseña debe tener entre 10 y 2.000 caracteres.');
      return;
    }
    if (!privacyAccepted) {
      setSubmitError('Acepta la política de privacidad para publicar tu reseña.');
      return;
    }
    setSubmitError('');
    setIsSubmitting(true);
    try {
      if (!accommodationId) throw new Error('No hay alojamientos publicados para asociar la reseña.');
      const cabin = allAccommodations.find((item) => item.id === accommodationId);
      await addReview({ nombreHuesped: cleanName, correoHuesped: cleanEmail, ciudadHuesped: cleanCity, calificacion: rating, cabanaId: accommodationId, nombreCabana: cabin?.nombre, comentario: cleanComment, tipoViaje: travelType });
      notificar.exito('Gracias, recibimos tu reseña. El equipo la revisará antes de publicarla.');
      setIsModalOpen(false);
      setName(''); setEmail(''); setCity(''); setComment(''); setRating(5); setPrivacyAccepted(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo publicar la reseña.';
      setSubmitError(message);
      notificar.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="resenas" className="py-20 sm:py-24 bg-[#F2F6EC] border-t border-[#CCD8B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado de reseñas. */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-9 sm:mb-11 gap-6">
          <div>
            <div className="inline-block px-3 py-1 bg-tikkun-brand-sage text-tikkun-brand-deep text-xs font-bold uppercase tracking-widest rounded-md mb-2">
              Testimonios de Huéspedes
            </div>
            <h2 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-tikkun-brand-deep tracking-tight text-balance leading-[1.05]">
              Lo que dicen quienes han vivido Casa Tikkun
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#465E3C]">
              Opiniones reales de viajeros que encontraron en Santa Elena su lugar favorito de reconexión y descanso.
            </p>
          </div>

          <button
            type="button"
            onClick={() => { setPrivacyAccepted(false); setIsModalOpen(true); }}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-tikkun-brand-deep hover:bg-[#101F0D] rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-tikkun-brand-sage" />
            <span>Compartir tu Experiencia</span>
          </button>
        </div>

        {/* Resumen general de calificaciones. */}
        <div className="mb-8 sm:mb-10 overflow-hidden rounded-3xl border border-[#D5DFCA] bg-gradient-to-br from-white via-[#FBFAF5] to-[#E8EFDF] p-5 sm:p-8 shadow-sm">
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-[minmax(190px,0.8fr)_1.2fr] items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-5 md:border-r md:border-[#D5DFCA] md:pr-8">
                <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#E2E8D8]">
                  <span className="font-serif text-4xl font-bold leading-none text-tikkun-brand-deep">{averageRating.toFixed(1)}</span>
                  <div className="mt-2 flex gap-0.5 text-[#C48E2E]" aria-label={`${averageRating.toFixed(1)} de 5 estrellas`}>
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-3 w-3 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-stone-300'}`} />)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-tikkun-brand-deep">Experiencias compartidas</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#526947]">{reviews.length} {reviews.length === 1 ? 'opinión de huésped' : 'opiniones de huéspedes'}</p>
                </div>
              </div>
              <div className="space-y-2" aria-label="Distribución de calificaciones">
                {ratingCounts.map(({ value, count }) => (
                  <div key={value} className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-3 text-xs text-[#526947]">
                    <span className="flex items-center gap-1">{value} <Star className="h-3 w-3 fill-[#C48E2E] text-[#C48E2E]" /></span>
                    <div className="h-2 overflow-hidden rounded-full bg-[#E3E9DA]"><div className="h-full rounded-full bg-[#8A9E68] transition-all" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} /></div>
                    <span className="text-right tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-3 text-center sm:py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#C48E2E] shadow-sm"><Star className="h-6 w-6" /></div>
              <h3 className="font-serif text-xl font-bold text-tikkun-brand-deep">Tu experiencia puede ser la primera</h3>
              <p className="max-w-md text-sm text-[#526947]">Aún no hay reseñas publicadas. Comparte cómo fue tu estadía y ayuda a otros viajeros.</p>
            </div>
          )}
        </div>

        {/* Filtros de reseñas por cabaña. */}
        <div className="mb-8 flex flex-wrap items-center gap-2 pb-1">
          <span className="text-xs font-bold text-[#3B5430] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedCabinFilter('all')}
            className={`max-w-full px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCabinFilter === 'all'
                ? 'bg-tikkun-brand-deep text-white shadow-xs'
                : 'bg-tikkun-brand-cream text-[#384E33] hover:bg-[#DCE6CA] border border-[#CCD8B8]'
            }`}
          >
            Todas ({reviews.length})
          </button>
          {allAccommodations.map((acc) => {
            const count = reviews.filter((r) => r.cabanaId === acc.id).length;
            const shortName = acc.nombre.split('·')[1]?.trim() || acc.nombre;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => setSelectedCabinFilter(acc.id)}
                className={`max-w-full px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCabinFilter === acc.id
                    ? 'bg-tikkun-brand-deep text-white shadow-xs'
                    : 'bg-tikkun-brand-cream text-[#384E33] hover:bg-[#DCE6CA] border border-[#CCD8B8]'
                }`}
              >
                {acc.etiquetaNumeroCabana} · {shortName} ({count})
              </button>
            );
          })}
        </div>

        {/* Tarjetas de reseñas. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-[#C6D3B6] bg-white/70 p-9 text-center text-sm text-[#465E3C]">
              <Star className="mx-auto mb-2 h-6 w-6 text-[#A3B28A]" />
              {reviews.length === 0 ? 'Aún no hay reseñas publicadas.' : 'No hay reseñas para este alojamiento.'}
            </div>
          ) : filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="group relative overflow-hidden bg-white p-6 sm:p-7 rounded-2xl border border-[#D5DFCA] hover:border-[#A9BB8E] flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <Quote aria-hidden="true" className="absolute right-4 top-3 h-9 w-9 rotate-180 text-[#E8EFDF] transition-transform group-hover:scale-105" />
              <div>
                {/* Calificación y datos de la reseña. */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[#C48E2E]">
                    {[...Array(rev.calificacion)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="relative z-10 pr-8 text-[11px] text-[#698256] font-semibold">
                    {formatReviewDate(rev.fecha)}
                  </span>
                </div>

                {/* Cabaña asociada a la reseña. */}
                <div className="inline-block px-2.5 py-1 bg-tikkun-brand-sage/40 text-tikkun-brand-deep text-xs font-bold rounded-md mb-3">
                  {rev.nombreCabana}
                </div>

                {/* Comentario del huésped. */}
                <p className="relative text-sm text-[#384E33] leading-relaxed">
                  &ldquo;{rev.comentario}&rdquo;
                </p>
              </div>

              {/* Datos de quien publicó la reseña. */}
              <div className="pt-4 mt-4 border-t border-[#DEE6D5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8EFDF] font-serif text-sm font-bold text-tikkun-brand-deep">{rev.nombreHuesped.trim().charAt(0).toUpperCase()}</div>
                  <div>
                    <h5 className="text-xs font-bold text-tikkun-brand-deep">
                      {rev.nombreHuesped}
                    </h5>
                    <p className="text-[11px] text-[#5B7549]">
                      {rev.ciudadHuesped} · {rev.tipoViaje}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Ventana para añadir una reseña. */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#0E1712]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-tikkun-brand-cream rounded-3xl max-w-3xl w-full border-2 border-[#D5DFCA] shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200"
          >
            {/* Botón para cerrar la ventana. */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#EAEFD9] hover:bg-[#DCE6CA] text-tikkun-brand-deep transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Columna izquierda: fotografía y calificación. */}
              <div className="md:col-span-5 relative p-6 sm:p-7 text-white flex flex-col justify-between overflow-hidden">
                <img
                  src="/Images/Conocenos.png"
                  alt="Paisaje de montañas y atardecer en Casa Tikkun"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#101C11] via-[#101C11]/70 to-[#101C11]/40" />

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

                {/* Selector de estrellas. */}
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
                        aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                        aria-pressed={rating === star}
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

                {/* Distintivo informativo. */}
                <div className="relative z-10 text-[11px] text-stone-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-tikkun-brand-sage" />
                  <span>El correo evita reseñas duplicadas</span>
                </div>
              </div>

              {/* Columna derecha: campos del formulario. */}
              <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between bg-tikkun-brand-cream">
                <form onSubmit={handleAddReview} className="space-y-3.5">
                  
                  {/* Fila 1: nombre y ciudad. */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                        Tu Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        autoComplete="name"
                        placeholder="Ej. Laura Gómez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-xs sm:text-sm text-tikkun-brand-deep focus:ring-1 focus:ring-tikkun-brand-deep focus:outline-hidden transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">Correo electrónico *</label>
                      <input type="email" required maxLength={254} autoComplete="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-[#CCD8B8] rounded-xl px-3 py-2 text-xs sm:text-sm" />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                        Ciudad / Origen
                      </label>
                      <input
                        type="text"
                        maxLength={120}
                        autoComplete="address-level2"
                        placeholder="Medellín, Colombia"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-xs sm:text-sm text-tikkun-brand-deep focus:ring-1 focus:ring-tikkun-brand-deep focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  {submitError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">{submitError}</p>}

                  {/* Fila 2: cabaña y tipo de viaje. */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                        Cabaña
                      </label>
                      <select
                        value={accommodationId}
                        onChange={(e) => setAccommodationId(e.target.value)}
                        className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-xs text-tikkun-brand-deep focus:ring-1 focus:ring-tikkun-brand-deep focus:outline-hidden transition-all truncate"
                      >
                        {allAccommodations.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.etiquetaNumeroCabana} · {a.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                        Tipo de Viaje
                      </label>
                      <select
                        value={travelType}
                        onChange={(e) => setTravelType(e.target.value)}
                        className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-xs text-tikkun-brand-deep focus:ring-1 focus:ring-tikkun-brand-deep focus:outline-hidden transition-all"
                      >
                        <option value="En Pareja">En Pareja</option>
                        <option value="Familia">En Familia</option>
                        <option value="Amigos">Con Amigos</option>
                        <option value="Escapada Solitaria">Retiro Solitario</option>
                      </select>
                    </div>
                  </div>

                  {/* Fila 3: comentario. */}
                  <div>
                    <label className="block text-[11px] font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                      Tu Reseña / Experiencia *
                    </label>
                    <textarea
                      required
                      rows={3}
                      minLength={10}
                      maxLength={2000}
                      placeholder="Cuéntanos sobre la chimenea de leña, el frío de la montaña, la niebla, el desayuno y tu descanso..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl p-3 text-xs sm:text-sm text-tikkun-brand-deep focus:ring-1 focus:ring-tikkun-brand-deep focus:outline-hidden transition-all resize-none leading-relaxed"
                    />
                    <p className="mt-1 text-right text-[10px] text-[#698256]">{comment.trim().length}/2.000 caracteres · mínimo 10</p>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl border border-[#D5DFCA] bg-white p-3 text-xs leading-5 text-[#465E3C]">
                    <input id="reviews-privacy-consent" type="checkbox" required checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} className="mt-1 accent-[#294326]" />
                    <div><label htmlFor="reviews-privacy-consent">Autorizo el tratamiento de mis datos para gestionar esta reseña y que mi nombre y comentario sean visibles públicamente, según la </label><button type="button" onClick={onOpenLegal} className="font-semibold underline underline-offset-2">Política de Privacidad</button>.</div>
                  </div>

                  {/* Acciones del formulario. */}
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => { if (!isSubmitting) setIsModalOpen(false); }}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#465E3C] hover:bg-[#EAEFD9] rounded-xl transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !allAccommodations.length}
                      className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-tikkun-brand-deep hover:bg-[#122210] rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer border border-tikkun-brand-sage/40"
                    >
                      {isSubmitting ? 'Enviando…' : !allAccommodations.length ? 'No hay cabañas disponibles' : 'Enviar para revisión'}
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
