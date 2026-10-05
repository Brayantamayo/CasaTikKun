import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { useAdmin, DEFAULT_GALLERY_IMAGES } from '../../context/AdminContext';

const BENTO_SPAN_CLASSES = [
  'md:col-span-2 md:row-span-2 min-h-[340px] md:min-h-[460px]',
  'md:col-span-1 md:row-span-2 min-h-[300px] md:min-h-[460px]',
  'md:col-span-1 md:row-span-1 min-h-[220px]',
  'md:col-span-1 md:row-span-1 min-h-[220px]',
  'md:col-span-1 md:row-span-1 min-h-[240px]',
  'md:col-span-2 md:row-span-1 min-h-[240px]',
  'md:col-span-1 md:row-span-1 min-h-[240px]',
  'md:col-span-2 md:row-span-1 min-h-[260px]'
];

export const GallerySection: React.FC = () => {
  const { galleryImages } = useAdmin();
  const photosList = galleryImages && galleryImages.length > 0 ? galleryImages : DEFAULT_GALLERY_IMAGES;

  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  // Keyboard navigation for cinema lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (activePhotoIdx === null) return;
    if (e.key === 'Escape') setActivePhotoIdx(null);
    if (e.key === 'ArrowLeft') {
      setActivePhotoIdx((prev) => (prev! === 0 ? photosList.length - 1 : prev! - 1));
    }
    if (e.key === 'ArrowRight') {
      setActivePhotoIdx((prev) => (prev! === photosList.length - 1 ? 0 : prev! + 1));
    }
  }, [activePhotoIdx, photosList.length]);

  useEffect(() => {
    if (activePhotoIdx !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhotoIdx, handleKeyDown]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((prev) => (prev! === 0 ? photosList.length - 1 : prev! - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((prev) => (prev! === photosList.length - 1 ? 0 : prev! + 1));
  };

  return (
    <section id="galeria" className="py-24 sm:py-32 bg-[#FAF7F0] border-t border-[#D5DFCA] relative overflow-hidden">
      
      {/* Subtle organic ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B6C29A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#E0A96D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Artistic Section Header */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#E7EEDB] border border-[#CCD8B8] text-[#2C4125] text-[11px] font-bold uppercase tracking-[0.25em] rounded-full mb-4">
              <span>Instantes Tikkun</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1E311A] tracking-tight [text-wrap:balance]">
              Galería de Experiencias
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#465E3C] font-light max-w-xl mx-auto leading-relaxed">
              Una mirada íntima al sosiego de Santa Elena: niebla, fuego, madera y atardeceres dorados entre los pinos.
            </p>
          </div>
        </Reveal>

        {/* 
          EDITORIAL BENTO MOSAIC:
          Dynamic magazine layout with mixed aspect ratios, warm borders, 
          smooth micro-zoom and click-to-expand.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
          {photosList.map((url, idx) => {
            const spanClass = BENTO_SPAN_CLASSES[idx % BENTO_SPAN_CLASSES.length];
            return (
              <Reveal key={`${idx}-${url.slice(-18)}`} delayMs={(idx % 4) * 80} className={spanClass}>
                <div
                  onClick={() => setActivePhotoIdx(idx)}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#D0DBC4] hover:border-[#1E311A] w-full h-full"
                >
                  {/* Photo Image */}
                  <img
                    src={url}
                    alt={`Experiencia Casa Tikkun ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out will-change-transform"
                  />

                  {/* Elegant hover scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-md text-[#1E311A] px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                      <ZoomIn className="w-3.5 h-3.5 text-[#E09B67]" />
                      <span>Ver en grande</span>
                    </div>
                  </div>

                  {/* Minimalist discreet corner indicator */}
                  <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs text-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-mono">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>

      {/* 
        CINEMA FULLSCREEN LIGHTBOX
      */}
      {activePhotoIdx !== null && photosList[activePhotoIdx] && (
        <div
          onClick={() => setActivePhotoIdx(null)}
          className="fixed inset-0 z-50 bg-[#070D09]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Top Bar: Counter & Close button */}
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between text-white py-2 z-10">
            <div className="flex items-center gap-2 text-xs tracking-widest text-[#B6C29A] font-mono">
              <span className="text-white font-bold text-sm">
                {activePhotoIdx + 1 < 10 ? `0${activePhotoIdx + 1}` : activePhotoIdx + 1}
              </span>
              <span className="opacity-40">/</span>
              <span className="opacity-60">
                {photosList.length < 10 ? `0${photosList.length}` : photosList.length}
              </span>
            </div>

            <button
              onClick={() => setActivePhotoIdx(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10 active:scale-95 flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold"
              aria-label="Cerrar visor"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar</span>
            </button>
          </div>

          {/* Central Main Stage: Full Image & Floating Navigation */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-auto py-2"
          >
            <img
              src={photosList[activePhotoIdx]}
              alt="Fotografía Casa Tikkun"
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 select-none animate-in zoom-in-95 duration-200"
            />

            {/* Left Nav Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-90 shadow-xl"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-90 shadow-xl"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Filmstrip Carousel */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl mx-auto pt-3 flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-none"
          >
            {photosList.map((thumbUrl, tIdx) => (
              <button
                key={tIdx}
                type="button"
                onClick={() => setActivePhotoIdx(tIdx)}
                className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                  activePhotoIdx === tIdx
                    ? 'ring-2 ring-[#B6C29A] scale-105 opacity-100 shadow-lg'
                    : 'opacity-40 hover:opacity-80 scale-95'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`Miniatura ${tIdx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

        </div>
      )}

    </section>
  );
};
