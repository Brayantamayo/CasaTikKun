// Comparte las reseñas, limita su cantidad y las sincroniza con el servidor.
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resena, CrearResenaDTO } from '../types';
import { APP_LIMITS, STORAGE_KEYS } from '../constants/storageKeys';
import { TikkunService } from '../services/api';
import { getCabinShortName } from '../utils/formatters';

interface ReviewsContextType {
  reviews: Resena[];
  maxReviews: number;
  getCabinReviews: (cabinId: string) => Resena[];
  getCabinStats: (cabinId: string) => { average: number; count: number };
  addReview: (input: CrearResenaDTO) => void;
  deleteReview: (reviewId: string) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Resena[]>(() => TikkunService.getReviewsFromStorage());

  // Sincronizar las reseñas con localStorage y mantener un máximo de diez.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.GUEST_REVIEWS,
        JSON.stringify(reviews.slice(0, APP_LIMITS.MAX_REVIEWS))
      );
    } catch (e) {
      console.warn('Could not save reviews to localStorage', e);
    }
  }, [reviews]);

  // Filtrar las reseñas de una cabaña, incluidas las personalizadas o modificadas.
  const getCabinReviews = (cabinId: string): Resena[] => {
    const allCabins = TikkunService.getEffectiveCabinsFromStorage();
    const targetCabin = allCabins.find((a) => a.id === cabinId);
    return reviews.filter((r) => {
      if (r.accommodationId === cabinId) return true;
      if (targetCabin && r.accommodationName) {
        const accLower = r.accommodationName.toLowerCase();
        const shortName = getCabinShortName(targetCabin.name).toLowerCase();
        const labelLower = targetCabin.cabinNumberLabel.toLowerCase();
        if (accLower.includes(labelLower) || (shortName && accLower.includes(shortName))) {
          return true;
        }
      }
      return false;
    });
  };

  // Calcular las estadísticas de calificación de una cabaña.
  const getCabinStats = (cabinId: string) => {
    const cabinRevs = getCabinReviews(cabinId);
    if (cabinRevs.length === 0) {
      const allCabins = TikkunService.getEffectiveCabinsFromStorage();
      const targetCabin = allCabins.find((a) => a.id === cabinId);
      return {
        average: targetCabin ? targetCabin.rating : 5.0,
        count: 0
      };
    }
    const sum = cabinRevs.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Number((sum / cabinRevs.length).toFixed(1));
    return {
      average: avg,
      count: cabinRevs.length
    };
  };

  const addReview = (input: CrearResenaDTO) => {
    const allCabins = TikkunService.getEffectiveCabinsFromStorage();
    const targetCabin = allCabins.find((a) => a.id === input.accommodationId) || allCabins[0];

    const newReview: Resena = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      guestName: input.guestName.trim(),
      guestCity: input.guestCity?.trim() || 'Medellín, Colombia',
      rating: input.rating,
      date: 'Hace un momento',
      accommodationId: targetCabin ? targetCabin.id : input.accommodationId,
      accommodationName: input.accommodationName || (targetCabin ? targetCabin.name : 'Cabaña Casa Tikkun'),
      comment: input.comment.trim(),
      travelType: input.travelType || 'En Pareja',
      verifiedBooking: true
    };

    // Mantener como máximo diez reseñas y retirar la más antigua al superar el límite.
    setReviews((prev) => [newReview, ...prev].slice(0, APP_LIMITS.MAX_REVIEWS));

    // Sincronizar con la API del servidor sin bloquear la interfaz.
    void TikkunService.syncReviewToBackend(newReview, input);
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        maxReviews: APP_LIMITS.MAX_REVIEWS,
        getCabinReviews,
        getCabinStats,
        addReview,
        deleteReview
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
