// Organiza y filtra el catálogo de cabañas y ofrece accesos a sus detalles y reservas.
import React, { useState, useMemo } from 'react';
import { Home, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { Cabana } from '../../types';
import { AccommodationCard } from './AccommodationCard';
import { Reveal } from '../common/Reveal';
import { useAdmin } from '../../context/AdminContext';
import { getCabinShortName } from '../../utils/formatters';

interface CatalogSectionProps {
  onOpenBookingModal: (accommodationId?: string) => void;
  onViewCabinDetails: (cabinId: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  onOpenBookingModal,
  onViewCabinDetails
}) => {
  const { getEffectiveAccommodations } = useAdmin();
  const allAccommodations = getEffectiveAccommodations();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Crear filtros dinámicos para las cabañas predeterminadas y personalizadas.
  const filterTabs = useMemo(() => [
    { id: 'all', label: `Nuestras ${allAccommodations.length} Cabañas`, number: null },
    ...allAccommodations.map((acc) => ({
      id: acc.id,
      label: getCabinShortName(acc.name),
      number: String(acc.cabinNumber || '')
    }))
  ], [allAccommodations]);

  const filteredAccommodations = useMemo(() => {
    if (activeFilter === 'all') {
      return allAccommodations;
    }
    return allAccommodations.filter((acc) => acc.id === activeFilter);
  }, [activeFilter, allAccommodations]);

  const handleBookNow = (acc: Cabana) => {
    onOpenBookingModal(acc.id);
  };

  const handleViewDetails = (acc: Cabana) => {
    onViewCabinDetails(acc.id);
  };

  return (
    <section id="catalogo" className="py-20 sm:py-24 bg-[#F2F6EC] border-y border-[#CCD8B8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado del catálogo. */}
        <Reveal>
          <div className="max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-tikkun-brand-sage text-tikkun-brand-deep text-xs font-bold uppercase tracking-wider rounded-md mb-2.5 shadow-2xs">
              <Home className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Nuestras {allAccommodations.length} Cabañas Exclusivas · Santa Elena</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-tikkun-brand-deep tracking-tight text-balance">
              Conoce Nuestras {allAccommodations.length} Cabañas en Santa Elena
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm text-[#465E3C] leading-relaxed text-balance">
              Cinco refugios independientes diseñados en madera y arquitectura de montaña en medio del bosque de niebla. Cada cabaña cuenta con <strong>chimenea de leña tradicional</strong>, terraza mirador panorámica, desayuno campesino y total privacidad para descansar.
            </p>
          </div>
        </Reveal>

        {/* Filtros del catálogo. */}
        <Reveal delayMs={100}>
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-[#CCD8B8]">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-2xs whitespace-nowrap ${
                    isActive
                      ? 'bg-tikkun-brand-deep text-white shadow-xs scale-[1.02]'
                      : 'bg-white text-stone-700 hover:bg-tikkun-brand-sage/30 border border-stone-200'
                  }`}
                >
                  {tab.number && (
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-tikkun-brand-sage text-tikkun-brand-deep' : 'bg-[#E5ECD9] text-tikkun-brand-deep'
                    }`}>
                      {tab.number}
                    </span>
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {activeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#44603B] hover:text-tikkun-brand-deep underline underline-offset-4 cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ver todas las {allAccommodations.length} cabañas</span>
              </button>
            )}
          </div>

          {/* Acceso a especificaciones, cortesías y reglas. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 p-3.5 bg-white rounded-2xl border border-[#CCD8B8] shadow-2xs text-xs text-[#283E22]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5A7C49] shrink-0" />
              <span><strong>Ubicación & Horarios:</strong> Santa Elena KM 6 (35 min Medellín) · Check-in 3:00 PM · Check-Out 12:00 M</span>
            </div>
            <div className="flex items-center gap-2 sm:border-x sm:border-[#CCD8B8] sm:px-3">
              <span className="w-2 h-2 rounded-full bg-[#C28E34] shrink-0" />
              <span><strong>Cortesía Tikkun:</strong> Café, aromáticas, huevos, aguas, sal y maíz para crispetas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tikkun-brand-deep shrink-0" />
              <span><strong>Reglas de Convivencia:</strong> No ruido alto · Reserva 50% · Cancelaciones y cambios mín. 48h · Pet friendly</span>
            </div>
          </div>
        </Reveal>

        {/* Cuadrícula de cabañas con animación de entrada. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {filteredAccommodations.map((acc, idx) => (
            <Reveal key={acc.id} delayMs={(idx % 2) * 100} direction="up">
              <AccommodationCard
                accommodation={acc}
                onBookNow={handleBookNow}
                onViewDetails={handleViewDetails}
              />
            </Reveal>
          ))}
        </div>

        {/* Información sobre la reserva directa. */}
        <Reveal delayMs={150}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#577241] flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C48E2E]" />
                Atención y Reserva Directa en Casa Tikkun
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-tikkun-brand-deep">
                ¿Tienes dudas sobre cuál cabaña elegir para tu fecha?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Escríbenos por WhatsApp. Te compartimos videos, fotos en vivo y te recomendamos la cabaña ideal para tu ocasión.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenBookingModal()}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-tikkun-brand-deep hover:bg-[#122210] rounded-xl transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer"
            >
              <span>Consultar Disponibilidad</span>
              <ArrowRight className="w-4 h-4 text-tikkun-brand-sage" />
            </button>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
