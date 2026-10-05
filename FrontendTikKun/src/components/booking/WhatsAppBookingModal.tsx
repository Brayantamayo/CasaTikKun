// Recopila los datos de la estadía, calcula el precio y prepara la consulta por WhatsApp.
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Calendar, Users, MessageCircle, ArrowRight, 
  CheckCircle2, ShieldCheck, Sparkles, Phone, User, ExternalLink,
  ChevronDown, ChevronUp, CreditCard, Info, Mail
} from 'lucide-react';
import { ACCOMMODATIONS, TIKKUN_CONTACT } from '../../data/tikkunData';
import { useAdmin } from '../../context/AdminContext';
import {
  formatCOP,
  getDefaultStayDates,
  ensureValidCheckoutDate,
  formatHumanDate,
  getCabinShortName,
  buildWhatsAppUrl
} from '../../utils/formatters';
import { calculateStayNights, getEffectiveCabinRates } from '../../utils/pricing';
import { TikkunService } from '../../services/api';

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccommodationId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export const WhatsAppBookingModal: React.FC<WhatsAppBookingModalProps> = ({
  isOpen,
  onClose,
  selectedAccommodationId,
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 2
}) => {
  const { getEffectiveAccommodations } = useAdmin();
  const allAccommodations = getEffectiveAccommodations();

  // Determinar el alojamiento seleccionado inicialmente.
  const defaultAccId = selectedAccommodationId || allAccommodations[0]?.id || ACCOMMODATIONS[0].id;
  const [currentAccId, setCurrentAccId] = useState<string>(defaultAccId);

  useEffect(() => {
    if (selectedAccommodationId) {
      setCurrentAccId(selectedAccommodationId);
    }
  }, [selectedAccommodationId]);

  const accommodation = useMemo(() => {
    return allAccommodations.find((a) => a.id === currentAccId) || allAccommodations[0];
  }, [currentAccId, allAccommodations]);

  // Obtener fechas predeterminadas sin problemas de zona horaria.
  const { todayStr, tomorrowStr, dayAfterStr } = useMemo(() => getDefaultStayDates(), []);

  // Estado de las fechas y los datos de contacto.
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn || tomorrowStr);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut || dayAfterStr);
  const [guests, setGuests] = useState<number>(initialGuests);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Sincronizar el formulario si cambian sus propiedades iniciales.
  useEffect(() => {
    if (initialCheckIn) {
      setCheckIn(initialCheckIn);
      setCheckOut((prev) => ensureValidCheckoutDate(initialCheckIn, initialCheckOut || prev));
    } else if (initialCheckOut) {
      setCheckOut(initialCheckOut);
    }
    if (initialGuests) setGuests(initialGuests);
  }, [initialCheckIn, initialCheckOut, initialGuests]);

  // Ajustar el número de huéspedes si se elige una cabaña con menor capacidad.
  useEffect(() => {
    if (accommodation && guests > accommodation.capacity) {
      setGuests(accommodation.capacity);
    }
  }, [accommodation, guests]);

  // Restablecer el estado del formulario al abrir la ventana.
  useEffect(() => {
    if (isOpen) {
      setIsSent(false);
      setDateError(null);
    }
  }, [isOpen, currentAccId]);

  const effectiveRates = useMemo(() => getEffectiveCabinRates(accommodation), [accommodation]);

  // Calcular el desglose de la estadía según las tres tarifas:
  // 1. Domingo a Jueves
  // 2. Viernes
  // 3. Sábados, Domingos y Festivos
  const stayBreakdown = useMemo(() => {
    return calculateStayNights(checkIn, checkOut, effectiveRates, accommodation.priceCOP);
  }, [checkIn, checkOut, effectiveRates, accommodation.priceCOP]);

  const nights = stayBreakdown.nights.length > 0 ? stayBreakdown.nights.length : 1;
  const estimatedTotal = stayBreakdown.totalAccommodationCOP;
  const deposit50 = Math.round(estimatedTotal * 0.5);

  // Crear el mensaje de WhatsApp con el desglose exacto de las tarifas.
  const messageText = useMemo(() => {
    const rateLines: string[] = [];
    if (stayBreakdown.weekdayCount > 0) {
      rateLines.push(`  • ${stayBreakdown.weekdayCount} noche(s) Entre semana (Dom-Jue)`);
    }
    if (stayBreakdown.fridayCount > 0) {
      rateLines.push(`  • ${stayBreakdown.fridayCount} noche(s) Viernes`);
    }
    if (stayBreakdown.weekendHolidayCount > 0) {
      rateLines.push(`  • ${stayBreakdown.weekendHolidayCount} noche(s) Sáb/Dom/Festivo`);
    }

    const lines = [
      `🌿 *CONSULTA DE RESERVA - CASA TIKKUN* 🌿`,
      ``,
      `¡Hola Casa Tikkun! Quisiera consultar disponibilidad para reservar en la *${accommodation.cabinNumberLabel} (${accommodation.name})*.`,
      ``,
      `📅 *Llegada (Check-in):* ${formatHumanDate(checkIn)} (3:00 PM)`,
      `📅 *Salida (Check-out):* ${formatHumanDate(checkOut)} (12:00 M)`,
      `🌙 *Estadía:* ${nights} noche(s)`,
      rateLines.length > 0 ? ` *Desglose de noches:*\n${rateLines.join('\n')}` : '',
      `👥 *Huéspedes:* ${guests} persona(s)`,
      name ? `👤 *Nombre:* ${name}` : '',
      email ? `📧 *Correo:* ${email}` : '',
      phone ? `📱 *Teléfono:* ${phone}` : '',
      notes ? `💬 *Mensaje:* ${notes}` : '',
      `💰 *Total estimado:* ${formatCOP(estimatedTotal)} COP`,
      `🔒 *Anticipo del 50%:* ${formatCOP(deposit50)} COP (50% restante al ingresar)`,
      ``,
      `🛏️ *Acomodación:* ${accommodation.beds} (Hasta ${accommodation.capacity} personas)`,
      `✨ *Cortesía Tikkun:* Café selecto, aromáticas, huevos campesinos, aguas, sal y maíz crispetas`,
      `🕒 *Horarios:* Check-in 3:00 PM · Check-Out 12:00 M`,
      accommodation.features && accommodation.features.length > 0
        ? `🌟 *Lo más destacado:* ${accommodation.features.slice(0, 2).join(' · ')}`
        : '',
      ``,
      `¿Tienen disponibilidad para estas fechas? Quedo atento(a) para confirmar los detalles. ¡Muchas gracias!`
    ].filter(Boolean);

    return lines.join('\n');
  }, [accommodation, checkIn, checkOut, nights, guests, name, email, phone, notes, estimatedTotal, deposit50, stayBreakdown]);

  const whatsappUrl = buildWhatsAppUrl(TIKKUN_CONTACT.whatsappNumber, messageText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      return;
    }

    if (checkOut <= checkIn) {
      setDateError('La fecha de salida debe ser posterior a la fecha de llegada.');
      return;
    }

    setDateError(null);

    // Registrar la solicitud localmente y en la API del servidor.
    void TikkunService.recordBookingInquiry({
      accommodationId: accommodation.id,
      accommodationName: accommodation.name,
      guestName: name.trim(),
      guestEmail: email.trim() || undefined,
      guestPhone: phone.trim() || undefined,
      checkIn,
      checkOut,
      nights,
      guestsCount: guests,
      estimatedTotalCOP: estimatedTotal,
      deposit50COP: deposit50,
      notes: notes.trim() || undefined
    });

    // Abrir la conversación de WhatsApp.
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsSent(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Encabezado de la ventana de reserva. */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-100 bg-[#F9F7F2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#EFECE2] text-[#2C4124] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#446338]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep">
                Reserva tu estadía
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                Atención directa e inmediata por WhatsApp
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 stroke-2" />
          </button>
        </div>

        {/* Contenido de la ventana. */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-5">
          
          {isSent ? (
            /* Confirmación de envío de la solicitud. */
            <div className="py-6 text-center space-y-5 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xl font-serif font-bold text-tikkun-brand-deep">
                  ¡Te hemos redirigido a WhatsApp!
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Se ha generado tu solicitud de reserva para <strong>{accommodation.name}</strong>. Nuestro anfitrión te confirmará en breve.
                </p>
              </div>

              {/* Resumen de la solicitud. */}
              <div className="bg-tikkun-brand-cream rounded-2xl p-4 border border-stone-200 text-left text-xs space-y-2">
                <div className="flex justify-between text-stone-700 font-medium">
                  <span className="text-stone-500">Cabaña:</span>
                  <span>{accommodation.name}</span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span className="text-stone-500">Fechas:</span>
                  <span>{formatHumanDate(checkIn)} — {formatHumanDate(checkOut)} ({nights} noches)</span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span className="text-stone-500">Huéspedes:</span>
                  <span>{guests} {guests === 1 ? 'huésped' : 'huéspedes'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-sm text-tikkun-brand-deep">
                  <span>Total estimado:</span>
                  <span>{formatCOP(estimatedTotal)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20BD5A] rounded-xl shadow-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Abrir conversación</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Modificar datos
                </button>
              </div>
            </div>
          ) : (
            /* Formulario de reserva. */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Selector de cabaña. */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-2">
                  Selecciona la cabaña:
                </label>
                
                <div className="grid grid-cols-5 gap-1.5 p-1 bg-[#F5F2EA] rounded-2xl border border-stone-200/70">
                  {allAccommodations.map((acc) => {
                    const isSelected = acc.id === currentAccId;
                    const shortName = getCabinShortName(acc.name);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setCurrentAccId(acc.id)}
                        className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-tikkun-brand-deep text-white shadow-xs font-semibold'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-white/60 font-normal'
                        }`}
                      >
                        <span className="block text-xs truncate">
                          {acc.cabinNumberLabel}
                        </span>
                        <span className={`block text-[10px] truncate ${isSelected ? 'text-tikkun-brand-sage' : 'text-stone-400'}`}>
                          {shortName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resumen de la cabaña seleccionada y sus tarifas. */}
              <div className="bg-tikkun-brand-cream rounded-2xl border border-stone-200 p-3 space-y-2.5">
                <div className="flex items-center gap-3">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="w-14 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-tikkun-brand-deep truncate">
                        {accommodation.name}
                      </span>
                      <span className="text-[11px] text-[#557048] font-medium hidden sm:inline">
                        · Hasta {accommodation.capacity} pers.
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs text-stone-500 font-normal">Desde</span>
                      <span className="text-xs font-bold text-tikkun-brand-deep">
                        {formatCOP(accommodation.rates?.weekday || accommodation.priceCOP)}
                      </span>
                      <span className="text-[11px] text-stone-500 font-normal">/ noche · Chimenea & desayuno</span>
                    </div>
                  </div>
                </div>

                {/* Desglose de las tres tarifas por noche. */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10.5px] pt-2 border-t border-stone-200/60">
                  <div className="p-1.5 bg-white rounded-lg border border-[#D5DFCA]">
                    <span className="block text-stone-500 text-[9px] font-medium">Dom a Jue</span>
                    <strong className="block text-tikkun-brand-deep font-bold text-[11px]">
                      {formatCOP(accommodation.rates?.weekday || accommodation.priceCOP)}
                    </strong>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-[#D5DFCA]">
                    <span className="block text-amber-700 text-[9px] font-medium">Viernes</span>
                    <strong className="block text-tikkun-brand-deep font-bold text-[11px]">
                      {formatCOP(accommodation.rates?.friday || Math.round(accommodation.priceCOP * 1.15))}
                    </strong>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-[#D5DFCA]">
                    <span className="block text-tikkun-brand-deep text-[9px] font-medium">Sáb/Dom/Fest</span>
                    <strong className="block text-tikkun-brand-deep font-bold text-[11px]">
                      {formatCOP(accommodation.rates?.weekendHoliday || Math.round(accommodation.priceCOP * 1.25))}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Fechas de llegada y salida. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label htmlFor="modal-checkin" className="text-xs font-medium text-stone-700 mb-1.5 flex items-center justify-between">
                    <span>Fecha de llegada (Check-in)</span>
                    <span className="text-[10px] text-stone-400">3:00 PM</span>
                  </label>
                  <input
                    id="modal-checkin"
                    type="date"
                    required
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => {
                      const nextIn = e.target.value;
                      setCheckIn(nextIn);
                      setCheckOut((prevOut) => ensureValidCheckoutDate(nextIn, prevOut));
                      if (dateError) setDateError(null);
                    }}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-[#3B5430]/20 focus:border-[#2D4523] focus:outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="modal-checkout" className="text-xs font-medium text-stone-700 mb-1.5 flex items-center justify-between">
                    <span>Fecha de salida (Check-out)</span>
                    <span className="text-[10.5px] text-[#557048] font-bold">12:00 M</span>
                  </label>
                  <input
                    id="modal-checkout"
                    type="date"
                    required
                    min={checkIn || tomorrowStr}
                    value={checkOut}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      if (dateError) setDateError(null);
                    }}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-[#3B5430]/20 focus:border-[#2D4523] focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              {dateError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  {dateError}
                </div>
              )}

              {/* Número de huéspedes y nombre de contacto. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label htmlFor="modal-guests" className="block text-xs font-medium text-stone-700 mb-1.5">
                    Huéspedes
                  </label>
                  <select
                    id="modal-guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-[#3B5430]/20 focus:border-[#2D4523] focus:outline-hidden transition-all cursor-pointer"
                  >
                    {Array.from({ length: accommodation.capacity }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'huésped' : 'huéspedes'} {num === 2 ? '(pareja)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-name" className="block text-xs font-medium text-stone-700 mb-1.5">
                    Tu nombre
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    placeholder="Ej. Brayan Tamayo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-[#3B5430]/20 focus:border-[#2D4523] focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Correo electrónico y teléfono. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label htmlFor="modal-email" className="text-xs font-medium text-stone-700 mb-1.5 flex items-center justify-between">
                    <span>Correo electrónico</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="modal-email"
                      type="email"
                      placeholder="Ej. brayan@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-[#3B5430]/20 focus:border-[#2D4523] focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-phone" className="text-xs font-medium text-stone-700 mb-1.5 flex items-center justify-between">
                    <span>WhatsApp o teléfono</span>
                    <span className="text-stone-400 font-normal text-[10.5px]">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="modal-phone"
                      type="tel"
                      placeholder="+57 300 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-[#3B5430]/20 focus:border-[#2D4523] focus:outline-hidden transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Solicitud especial o nota. */}
              <div>
                <label htmlFor="modal-notes" className="text-xs font-medium text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>Petición especial o nota</span>
                  <span className="text-stone-400 font-normal text-[10.5px]">(opcional)</span>
                </label>
                <input
                  id="modal-notes"
                  type="text"
                  placeholder="Aniversario, cena romántica, decoración..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-[#3B5430]/20 focus:border-[#2D4523] focus:outline-hidden transition-all"
                />
              </div>

              {/* Características de la cabaña y cortesías incluidas. */}
              <div className="bg-[#EFF4E6] p-3 sm:p-3.5 rounded-xl border border-[#CCD8B8] space-y-1.5 text-xs text-[#2A3F23]">
                <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-tikkun-brand-deep">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#547343]" />
                    {accommodation.cabinNumberLabel} · {accommodation.name}
                  </span>
                  <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-md text-[#486637] border border-[#CCD8B8]/60 font-semibold">
                    Hasta {accommodation.capacity} huéspedes
                  </span>
                </div>
                <div className="text-[11px] text-[#364F2C] leading-snug space-y-1">
                  <p>• <strong>Acomodación:</strong> {accommodation.beds}</p>
                  <p>• <strong>Cortesía Tikkun incluida:</strong> Café selecto, aromáticas, huevos campesinos, aguas, sal y maíz para crispetas.</p>
                  <p>• <strong>Horarios generales:</strong> Check-in 3:00 PM · Check-Out 12:00 M (Self check-in con instrucciones).</p>
                  {accommodation.features && accommodation.features.length > 0 && (
                    <p className="pt-0.5">• <strong>Refugio:</strong> {accommodation.features.slice(0, 2).join(' · ')}</p>
                  )}
                </div>
              </div>

              {/* Nota sobre la atención directa por WhatsApp. */}
              <div className="flex items-center gap-2 text-xs text-stone-500 bg-[#FBF9F5] p-2.5 rounded-xl border border-stone-100">
                <ShieldCheck className="w-4 h-4 text-[#557048] shrink-0" />
                <span>Trato directo con el anfitrión · Consulta sin compromiso ni cobros previos</span>
              </div>

              {/* Precio total, anticipo y envío de la solicitud. */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-auto">
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <span className="font-semibold text-tikkun-brand-deep">Total ({nights} {nights === 1 ? 'noche' : 'noches'}):</span>
                    {stayBreakdown.nights.length > 0 && (
                      <span className="text-[10px] text-[#4A643E] bg-[#EFF4E6] px-1.5 py-0.5 rounded font-medium">
                        {stayBreakdown.weekdayCount > 0 ? `${stayBreakdown.weekdayCount} Dom-Jue ` : ''}
                        {stayBreakdown.fridayCount > 0 ? `${stayBreakdown.fridayCount} Vie ` : ''}
                        {stayBreakdown.weekendHolidayCount > 0 ? `${stayBreakdown.weekendHolidayCount} Fds/Fest ` : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-serif font-bold text-tikkun-brand-deep">
                      {formatCOP(estimatedTotal)}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold">COP</span>
                  </div>
                  <div className="text-[11px] text-[#3E5C31] font-medium flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-[#527341]" />
                    <span>Anticipo 50%: <strong>{formatCOP(deposit50)} COP</strong> · 50% al llegar</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-tikkun-brand-deep hover:bg-[#11200E] rounded-xl transition-all shadow-md active:scale-98 cursor-pointer group"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Continuar a WhatsApp</span>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
