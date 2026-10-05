import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Bed, ArrowRight, Eye, 
  ChevronLeft, ChevronRight, Check, MessageCircle
} from 'lucide-react';
import { Cabana } from '../../types';
import { formatCOP } from '../../utils/formatters';
import { getEffectiveCabinRates } from '../../utils/pricing';

interface AccommodationCardProps {
  accommodation: Cabana;
  onBookNow: (accommodation: Cabana) => void;
  onViewDetails: (accommodation: Cabana) => void;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  onBookNow,
  onViewDetails
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const images = accommodation.galleryImages && accommodation.galleryImages.length > 0
    ? accommodation.galleryImages
    : [accommodation.image];

  // Auto-rotating photo slideshow:
  // Changes every 4 seconds, slightly staggered per cabin number so they don't flip synchronously
  useEffect(() => {
    if (isHovered || images.length <= 1) return;

    const intervalTime = 3800 + (accommodation.cabinNumber * 350);

    timerRef.current = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, images.length, accommodation.cabinNumber]);

  const rates = getEffectiveCabinRates(accommodation);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div 
      onClick={() => onViewDetails(accommodation)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-3xl border border-stone-200/90 hover:border-[#1E311A]/40 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
    >
      
      {/* 
        1. IMAGE CAROUSEL WITH AUTO-ROTATING TRANSITION:
        Smooth crossfading images with soft progress indicator
      */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-900">
        
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              activeImageIndex === idx ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={img}
              alt={`${accommodation.name} - Foto ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
            />
          </div>
        ))}
        
        {/* Soft, gentle bottom gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 z-2 pointer-events-none" />

        {/* Top Badges: Soft, refined pill */}
        <div className="absolute top-3.5 left-3.5 z-3 flex flex-wrap items-center gap-1.5">
          <span className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs">
            {accommodation.cabinNumberLabel}
          </span>
        </div>

        {/* Rating overlay (soft pill) */}
        <div className="absolute top-3.5 right-3.5 z-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-xs">
          <span className="text-amber-300">★</span>
          <span>{accommodation.rating}</span>
          <span className="text-white/60 text-[10px]">({accommodation.reviewsCount})</span>
        </div>

        {/* Navigation Arrows (discreet on hover) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
              aria-label="Siguiente foto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Bottom Progress Dots */}
        <div className="absolute bottom-3 left-3 z-3 flex items-center gap-1.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeImageIndex === idx
                  ? 'bg-white w-5'
                  : 'bg-white/50 hover:bg-white/80 w-1.5'
              }`}
              aria-label={`Ir a foto ${idx + 1}`}
            />
          ))}
          <span className="text-[10px] text-white/80 font-medium ml-1.5 drop-shadow-sm">
            {activeImageIndex + 1}/{images.length}
          </span>
        </div>

        {/* View Details Hint */}
        <div className="absolute bottom-3 right-3 z-3 bg-white/90 backdrop-blur-xs text-[#1E311A] px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity shadow-xs">
          <Eye className="w-3 h-3 text-[#5A744C]" />
          <span>Explorar</span>
        </div>
      </div>

      {/* 
        2. CONTENT DETAILS (Soft, neutral, friendly typography)
      */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          
          {/* Subtle specs line (Sentence case, clean icons - matching cabin creation fields only) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-normal">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#5A744C]" />
              Hasta {accommodation.capacity} huéspedes
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1 truncate max-w-[180px]">
              <Bed className="w-3.5 h-3.5 text-[#5A744C] shrink-0" />
              {accommodation.beds}
            </span>
          </div>

          {/* Cabin Title */}
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1E311A] group-hover:text-[#3B5430] transition-colors leading-snug">
            {accommodation.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2 pt-1">
            {accommodation.description}
          </p>

          {/* Key Inclusions (from cabin features configured on creation) */}
          {accommodation.features && accommodation.features.length > 0 && (
            <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-700">
              {accommodation.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#4A6E3B] shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* 
          3. PRICING & ACTION BUTTONS
        */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
                Desde
              </span>
              <span className="text-[9.5px] bg-[#EFF4E6] text-[#44603B] px-1.5 py-0.2 rounded font-semibold border border-[#CCD8B8]/60">
                Dom a Jue
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#1E311A]">
                {formatCOP(rates.weekday)}
              </span>
              <span className="text-xs text-stone-500">COP</span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              Vie: {formatCOP(rates.friday)} · Sáb/Fest: {formatCOP(rates.weekendHoliday)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            
            {/* View Details Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(accommodation);
              }}
              className="px-3 py-2 text-xs font-semibold text-[#1E311A] bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>Detalles</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Direct WhatsApp Reservation Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(accommodation);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E311A] hover:bg-[#122210] rounded-xl transition-all shadow-xs hover:shadow-md active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Reservar</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
