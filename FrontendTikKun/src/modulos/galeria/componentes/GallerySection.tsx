// Galería pública de fotografías de las experiencias Casa Tikkun.
import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Reveal } from '@/modulos/Home/Reveal';
import { useAdmin } from '@/modulos/administracion/contexto/contextoAdmin';

// Distribución editorial: una foto protagonista, una vertical y fotos pequeñas alrededor.
const MOSAIC_SPAN_CLASSES = [
  'min-[420px]:col-span-2 min-[420px]:row-span-2',
  'min-[420px]:row-span-2',
  'min-[420px]:col-start-4',
  'min-[420px]:col-start-4',
  'min-[420px]:col-start-1',
  'min-[420px]:col-span-2',
  'min-[420px]:col-start-4',
  'min-[420px]:col-span-2',
];

export const GallerySection: React.FC = () => {
  const { galleryImages } = useAdmin();
  const photosList = galleryImages.filter((url) => typeof url === 'string' && url.length > 0);

  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  // Permitir la navegación con el teclado dentro del visor.
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
    <section id="galeria" className="relative overflow-hidden border-t border-[#D5DFCA] bg-[#FAF7F0] py-16 sm:py-20">
      
      {/* Resplandores ambientales de fondo. */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-tikkun-brand-sage/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#E0A96D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado de la galería. */}
        <Reveal>
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#E7EEDB] border border-[#CCD8B8] text-[#2C4125] text-[11px] font-bold uppercase tracking-[0.25em] rounded-full mb-4">
              <span>Instantes Tikkun</span>
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-tight text-tikkun-brand-deep text-balance sm:text-4xl lg:text-5xl">
              Galería de Experiencias
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#465E3C] font-light max-w-xl mx-auto leading-relaxed">
              Una mirada íntima al sosiego de Santa Elena: niebla, fuego, madera y atardeceres dorados entre los pinos.
            </p>
          </div>
        </Reveal>

        {/* Mosaico editorial con una imagen destacada y tamaños alternados. */}
        <div className="grid grid-cols-2 gap-3 min-[420px]:auto-rows-[110px] min-[420px]:grid-cols-4 sm:auto-rows-[135px] sm:gap-4 md:auto-rows-[150px] xl:auto-rows-[165px]">
          {photosList.length === 0 ? (
            <p className="col-span-full py-12 text-center text-sm text-stone-500">Pronto compartiremos fotos de nuestras experiencias.</p>
          ) : photosList.map((url, idx) => {
            return (
              <Reveal key={`${idx}-${url.slice(-18)}`} delayMs={(idx % 4) * 60} className={MOSAIC_SPAN_CLASSES[idx % MOSAIC_SPAN_CLASSES.length]}>
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  aria-label={`Ampliar fotografía ${idx + 1}`}
                  className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border border-[#D0DBC4] bg-[#E8E9DF] text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#788F68] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#708B5C] focus-visible:ring-offset-2 min-[420px]:h-full min-[420px]:aspect-auto sm:rounded-3xl"
                >
                  {/* Fotografía de la galería. */}
                  <img
                    src={url}
                    alt={`Experiencia Casa Tikkun ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Acción para ampliar la fotografía. */}
                  <span className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/55 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="flex translate-y-4 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-tikkun-brand-deep opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <ZoomIn className="w-3.5 h-3.5 text-[#E09B67]" />
                      <span>Ver en grande</span>
                    </span>
                  </span>

                  {/* Número de posición de la fotografía. */}
                  <span className="absolute bottom-2 right-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-black/50 px-2 font-mono text-[11px] text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:bottom-3 sm:right-3">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

      </div>

      {/* Visor de fotografías a pantalla completa. */}
      {activePhotoIdx !== null && photosList[activePhotoIdx] && (
        <div
          onClick={() => setActivePhotoIdx(null)}
          className="fixed inset-0 z-50 bg-[#070D09]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Barra superior: contador y botón para cerrar. */}
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between text-white py-2 z-10">
            <div className="flex items-center gap-2 text-xs tracking-widest text-tikkun-brand-sage font-mono">
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

          {/* Fotografía ampliada y controles de navegación. */}
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

            {/* Fotografía anterior. */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-90 shadow-xl"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Fotografía siguiente. */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-90 shadow-xl"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Tira de miniaturas. */}
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
                    ? 'ring-2 ring-tikkun-brand-sage scale-105 opacity-100 shadow-lg'
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
