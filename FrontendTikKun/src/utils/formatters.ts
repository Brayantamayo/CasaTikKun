/**
 * Reusable formatting and timezone-safe date utilities for Casa Tikkun.
 */

/**
 * Formats a number or numeric string as Colombian Pesos (COP) without decimals.
 */
export function formatCOP(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(num);
}

/**
 * Formats a Date object into local YYYY-MM-DD (avoids UTC shift after 7:00 PM in Colombia).
 */
export function formatLocalDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns default check-in (tomorrow) and check-out (3 days from today) in local YYYY-MM-DD.
 */
export function getDefaultStayDates(): {
  todayStr: string;
  tomorrowStr: string;
  dayAfterStr: string;
} {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 3);

  return {
    todayStr: formatLocalDateISO(today),
    tomorrowStr: formatLocalDateISO(tomorrow),
    dayAfterStr: formatLocalDateISO(dayAfter)
  };
}

/**
 * Ensures checkOut date is strictly after checkIn date.
 * If newCheckIn >= currentCheckOut, returns newCheckIn + 1 day.
 */
export function ensureValidCheckoutDate(newCheckIn: string, currentCheckOut: string): string {
  if (!newCheckIn) return currentCheckOut;
  if (!currentCheckOut || currentCheckOut <= newCheckIn) {
    const parts = newCheckIn.split('-').map(Number);
    if (parts.length === 3) {
      const nextDay = new Date(parts[0], parts[1] - 1, parts[2] + 1);
      return formatLocalDateISO(nextDay);
    }
  }
  return currentCheckOut;
}

/**
 * Formats a YYYY-MM-DD string into a human-friendly Spanish date (e.g. "sáb, 4 oct 2026").
 */
export function formatHumanDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) return dateStr;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Extracts the short cabin name after the middle dot (e.g., "Cabaña 1 · Abba" -> "Abba").
 */
export function getCabinShortName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.split('·');
  return parts.length > 1 ? parts[1].trim() : fullName.trim();
}

/**
 * Builds a clean WhatsApp click-to-chat URL.
 */
export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const cleanPhone = whatsappNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
