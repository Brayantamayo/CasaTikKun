// Presenta las tarifas de una cabaña para días de semana, viernes y festivos.
import React from 'react';
import { Calendar } from 'lucide-react';
import { Cabana } from '../../types';
import { formatCOP } from '../../utils/formatters';
import { getEffectiveCabinRates } from '../../utils/pricing';

interface CabinRatesTableProps {
  accommodation: Cabana;
  compact?: boolean;
}

export const CabinRatesTable: React.FC<CabinRatesTableProps> = ({
  accommodation,
  compact = false
}) => {
  const rates = getEffectiveCabinRates(accommodation);

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div className="bg-tikkun-brand-cream p-2 rounded-xl border border-[#D5DFCA]">
          <span className="block text-[9.5px] font-bold uppercase tracking-wider text-[#557048]">
            Dom - Jue
          </span>
          <span className="block text-xs sm:text-sm font-serif font-bold text-tikkun-brand-deep mt-0.5">
            {formatCOP(rates.weekday)}
          </span>
        </div>

        <div className="bg-tikkun-brand-cream p-2 rounded-xl border border-[#D5DFCA]">
          <span className="block text-[9.5px] font-bold uppercase tracking-wider text-[#7A5C29]">
            Viernes
          </span>
          <span className="block text-xs sm:text-sm font-serif font-bold text-tikkun-brand-deep mt-0.5">
            {formatCOP(rates.friday)}
          </span>
        </div>

        <div className="bg-[#EFF4E6] p-2 rounded-xl border border-tikkun-brand-sage">
          <span className="block text-[9.5px] font-bold uppercase tracking-wider text-tikkun-brand-deep">
            Sáb / Dom / Fest
          </span>
          <span className="block text-xs sm:text-sm font-serif font-bold text-tikkun-brand-deep mt-0.5">
            {formatCOP(rates.weekendHoliday)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#D5DFCA] shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#4A6B3B]" />
          <h3 className="text-sm sm:text-base font-serif font-bold text-tikkun-brand-deep">
            Tarifas por Noche (COP)
          </h3>
        </div>
        <span className="text-[11px] text-stone-500">
          Incluye desayuno campesino, leña y Cortesía Tikkun
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded-xl bg-[#F8FAF5] border border-[#DCE6D0] flex sm:flex-col items-center sm:items-start justify-between gap-1">
          <span className="text-xs font-medium text-stone-600">Domingo a Jueves</span>
          <span className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep tabular-nums">
            {formatCOP(rates.weekday)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#EDE3CE] flex sm:flex-col items-center sm:items-start justify-between gap-1">
          <span className="text-xs font-medium text-stone-600">Noche de Viernes</span>
          <span className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep tabular-nums">
            {formatCOP(rates.friday)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#F2F6EC] border border-[#C6D5B5] flex sm:flex-col items-center sm:items-start justify-between gap-1">
          <span className="text-xs font-semibold text-tikkun-brand-deep">Sáb, Dom y Festivos</span>
          <span className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep tabular-nums">
            {formatCOP(rates.weekendHoliday)}
          </span>
        </div>
      </div>
    </div>
  );
};
