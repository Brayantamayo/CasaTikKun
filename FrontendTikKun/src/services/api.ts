import {
  Cabana,
  Resena,
  RespuestaApi,
  SolicitudReservaDTO,
  CrearResenaDTO,
  ConfiguracionMultimediaDTO,
  GuardarCabanaDTO
} from '../types';
import { API_ENDPOINTS, APP_LIMITS, STORAGE_KEYS } from '../constants/storageKeys';
import {
  ACCOMMODATIONS,
  REVIEWS,
  TIKKUN_COURTESIES,
  TIKKUN_RULES,
  TIKKUN_SPECIFICATIONS
} from '../data/tikkunData';

/**
 * Capa de Servicios y Sincronización con el Backend para Casa Tikkun.
 */

async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<RespuestaApi<T> | null> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!response.ok) return null;
    return (await response.json()) as RespuestaApi<T>;
  } catch {
    return null;
  }
}

export const TikkunService = {
  /**
   * Obtiene todas las cabañas activas combinando originales, creadas, modificadas y tarifas.
   */
  getEffectiveCabinsFromStorage(): Cabana[] {
    try {
      const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_CABINS);
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];

      const modifiedRaw = localStorage.getItem(STORAGE_KEYS.MODIFIED_CABINS);
      const modifiedMap: Record<string, Partial<Cabana>> = modifiedRaw ? JSON.parse(modifiedRaw) : {};

      const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CABINS);
      const customCabins: Cabana[] = customRaw ? JSON.parse(customRaw) : [];

      const ratesRaw = localStorage.getItem(STORAGE_KEYS.RATES_OVERRIDES);
      const ratesOverrides = ratesRaw ? JSON.parse(ratesRaw) : {};

      const baseDefaults = ACCOMMODATIONS.filter((acc) => !deletedIds.includes(acc.id)).map((acc) => {
        const mod = modifiedMap[acc.id] || {};
        const merged: Cabana = {
          ...acc,
          ...mod,
          rules: mod.rules || acc.rules || TIKKUN_RULES,
          courtesies: mod.courtesies || acc.courtesies || TIKKUN_COURTESIES,
          specifications: mod.specifications || acc.specifications || TIKKUN_SPECIFICATIONS
        };
        if (ratesOverrides[acc.id]) {
          merged.rates = ratesOverrides[acc.id];
          merged.priceCOP = ratesOverrides[acc.id].weekday;
        }
        return merged;
      });

      const effectiveCustom = customCabins
        .filter((acc) => !deletedIds.includes(acc.id))
        .map((acc) => {
          const customRates = ratesOverrides[acc.id];
          return {
            ...acc,
            rules: acc.rules || TIKKUN_RULES,
            courtesies: acc.courtesies || TIKKUN_COURTESIES,
            specifications: acc.specifications || TIKKUN_SPECIFICATIONS,
            ...(customRates
              ? { rates: customRates, priceCOP: customRates.weekday }
              : {})
          };
        });

      return [...baseDefaults, ...effectiveCustom];
    } catch {
      return ACCOMMODATIONS;
    }
  },

  /**
   * Sincroniza la creación o edición de una cabaña hacia `/api/cabins`.
   */
  async syncCabinToBackend(cabin: GuardarCabanaDTO, method: 'POST' | 'PUT' = 'POST'): Promise<void> {
    await safeFetchJson<Cabana>(API_ENDPOINTS.CABINS, {
      method,
      body: JSON.stringify(cabin)
    });
  },

  /**
   * Sincroniza la eliminación de una cabaña hacia `/api/cabins/:id`.
   */
  async syncDeleteCabinToBackend(cabinId: string): Promise<void> {
    await safeFetchJson<{ deletedId: string }>(`${API_ENDPOINTS.CABINS}/${encodeURIComponent(cabinId)}`, {
      method: 'DELETE'
    });
  },

  /**
   * Carga las reseñas aplicando el límite máximo de 10 reseñas.
   */
  getReviewsFromStorage(): Resena[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUEST_REVIEWS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, APP_LIMITS.MAX_REVIEWS);
        }
      }
    } catch {
      // Fallback
    }
    return REVIEWS.slice(0, APP_LIMITS.MAX_REVIEWS);
  },

  /**
   * Sincroniza una nueva reseña hacia `/api/reviews`.
   */
  async syncReviewToBackend(review: Resena, dto: CrearResenaDTO): Promise<void> {
    await safeFetchJson<Resena>(API_ENDPOINTS.REVIEWS, {
      method: 'POST',
      body: JSON.stringify({ ...dto, id: review.id, date: review.date })
    });
  },

  /**
   * Sincroniza las imágenes del Hero y la Galería hacia `/api/media`.
   */
  async syncMediaToBackend(config: Partial<ConfiguracionMultimediaDTO>): Promise<void> {
    await safeFetchJson<ConfiguracionMultimediaDTO>(API_ENDPOINTS.MEDIA, {
      method: 'PUT',
      body: JSON.stringify(config)
    });
  },

  /**
   * Registra una solicitud de reserva por WhatsApp localmente y en `/api/bookings`.
   */
  async recordBookingInquiry(inquiry: SolicitudReservaDTO): Promise<void> {
    const record: SolicitudReservaDTO = {
      ...inquiry,
      id: inquiry.id || `inq-${Date.now()}`,
      createdAt: inquiry.createdAt || new Date().toISOString()
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKING_INQUIRIES);
      const existing: SolicitudReservaDTO[] = raw ? JSON.parse(raw) : [];
      const updated = [record, ...existing].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.BOOKING_INQUIRIES, JSON.stringify(updated));
    } catch {
      // Ignorar si la cuota de almacenamiento está llena
    }

    await safeFetchJson<SolicitudReservaDTO>(API_ENDPOINTS.BOOKINGS, {
      method: 'POST',
      body: JSON.stringify(record)
    });
  }
};
