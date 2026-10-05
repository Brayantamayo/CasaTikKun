import {
  Cabana,
  TarifasCabana,
  NivelTarifaDia,
  CalculoNoche,
  ResultadoCalculoEstadia
} from '../types';
import { formatLocalDateISO } from './formatters';

export type { NivelTarifaDia, CalculoNoche, ResultadoCalculoEstadia };
export type DayTier = NivelTarifaDia;
export type NightCalculation = CalculoNoche;
export type StayCalculationResult = ResultadoCalculoEstadia;

/**
 * Festivos oficiales de Colombia (2025-2027).
 * En puente festivo (lunes festivo), la noche del domingo aplica tarifa de Fin de Semana y Festivo.
 */
const COLOMBIAN_HOLIDAYS = new Set<string>([
  // 2025
  '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18',
  '2025-05-01', '2025-06-02', '2025-06-23', '2025-06-30', '2025-07-20',
  '2025-08-07', '2025-08-18', '2025-10-13', '2025-11-03', '2025-11-17',
  '2025-12-08', '2025-12-25',
  // 2026
  '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
  '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
  '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
  '2026-11-16', '2026-12-08', '2026-12-25',
  // 2027
  '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26',
  '2027-05-01', '2027-05-10', '2027-05-31', '2027-06-07', '2027-07-05',
  '2027-07-20', '2027-08-07', '2027-08-16', '2027-10-18', '2027-11-01',
  '2027-11-15', '2027-12-08', '2027-12-25'
]);

/**
 * Devuelve la estructura garantizada de 3 tarifas por noche para cualquier cabaña.
 */
export function getEffectiveCabinRates(accommodation: Pick<Cabana, 'rates' | 'priceCOP'>): TarifasCabana {
  if (accommodation.rates) {
    return accommodation.rates;
  }
  return {
    weekday: accommodation.priceCOP,
    friday: Math.round(accommodation.priceCOP * 1.15),
    weekendHoliday: Math.round(accommodation.priceCOP * 1.25)
  };
}

/**
 * Determina cuál de los 3 niveles tarifarios de Casa Tikkun aplica para una noche:
 * - Viernes (day === 5): 'friday'
 * - Sábados, Domingos de Puente y vísperas de Festivos: 'weekendHoliday'
 * - Domingo a Jueves (ordinarios): 'weekday'
 */
export function getNightTier(date: Date): { tier: NivelTarifaDia; label: string; badge: string } {
  const day = date.getDay(); // 0 = Domingo, 5 = Viernes, 6 = Sábado
  const dateStr = formatLocalDateISO(date);

  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  const nextDayStr = formatLocalDateISO(nextDay);

  const isHolidayEveOrDay = COLOMBIAN_HOLIDAYS.has(dateStr) || COLOMBIAN_HOLIDAYS.has(nextDayStr);

  if (day === 6 || (day === 0 && isHolidayEveOrDay) || COLOMBIAN_HOLIDAYS.has(nextDayStr)) {
    return {
      tier: 'weekendHoliday',
      label: 'Sábados, Domingos & Festivos',
      badge: 'Fin de Semana & Festivo'
    };
  }

  if (day === 5) {
    return {
      tier: 'friday',
      label: 'Viernes',
      badge: 'Viernes'
    };
  }

  return {
    tier: 'weekday',
    label: 'Domingo a Jueves',
    badge: 'Entre Semana'
  };
}

/**
 * Calcula el desglose noche por noche y el valor total de la estadía en COP.
 */
export function calculateStayNights(
  checkInStr: string,
  checkOutStr: string,
  rates?: TarifasCabana,
  fallbackBasePrice: number = 390000
): ResultadoCalculoEstadia {
  if (!checkInStr || !checkOutStr) {
    return {
      nights: [],
      totalAccommodationCOP: fallbackBasePrice,
      weekdayCount: 0,
      fridayCount: 0,
      weekendHolidayCount: 0
    };
  }

  const checkIn = new Date(`${checkInStr}T12:00:00`);
  const checkOut = new Date(`${checkOutStr}T12:00:00`);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
    return {
      nights: [],
      totalAccommodationCOP: fallbackBasePrice,
      weekdayCount: 0,
      fridayCount: 0,
      weekendHolidayCount: 0
    };
  }

  const nights: CalculoNoche[] = [];
  const current = new Date(checkIn);
  let total = 0;
  let weekdayCount = 0;
  let fridayCount = 0;
  let weekendHolidayCount = 0;

  while (current < checkOut) {
    const dayOfWeek = current.getDay();
    const { tier, label } = getNightTier(current);
    let price = fallbackBasePrice;

    if (rates) {
      if (tier === 'weekday') {
        price = rates.weekday;
        weekdayCount++;
      } else if (tier === 'friday') {
        price = rates.friday;
        fridayCount++;
      } else {
        price = rates.weekendHoliday;
        weekendHolidayCount++;
      }
    } else {
      weekdayCount++;
    }

    nights.push({
      dateStr: formatLocalDateISO(current),
      dayOfWeek,
      tier,
      tierLabel: label,
      priceCOP: price
    });

    total += price;
    current.setDate(current.getDate() + 1);
  }

  return {
    nights,
    totalAccommodationCOP: total,
    weekdayCount,
    fridayCount,
    weekendHolidayCount
  };
}
