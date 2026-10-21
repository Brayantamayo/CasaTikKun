// Comparte reseñas y operaciones de lectura, creación y eliminación.
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Resena, CrearResenaDTO } from '@/compartido/tipos';
import { reviewsService } from '@/modulos/resenas/servicios/reviewsService';

interface ReviewsContextType {
  reviews: Resena[];
  getCabinReviews: (cabinId: string) => Resena[];
  getCabinStats: (cabinId: string) => { average: number; count: number };
  addReview: (input: CrearResenaDTO) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Resena[]>([]);
  const [hasLoadedReviews, setHasLoadedReviews] = useState(false);

  // Las reseñas se leen siempre del backend, sin mostrar copias locales antiguas.
  useEffect(() => {
    let active = true;
    void reviewsService.list()
      .then((remoteReviews) => { if (active) setReviews(remoteReviews); })
      .catch((error) => { console.error('No se pudieron cargar las reseñas desde el backend.', error); })
      .finally(() => { if (active) setHasLoadedReviews(true); });
    return () => { active = false; };
  }, []);

  const getCabinReviews = (cabinId: string): Resena[] => {
    return reviews.filter((review) => review.cabanaId === cabinId);
  };

  const getCabinStats = (cabinId: string) => {
    const cabinReviews = getCabinReviews(cabinId);
    if (cabinReviews.length === 0) return { average: 0, count: 0 };
    const average = cabinReviews.reduce((sum, review) => sum + review.calificacion, 0) / cabinReviews.length;
    return { average: Number(average.toFixed(1)), count: cabinReviews.length };
  };

  const addReview = async (input: CrearResenaDTO) => {
    const savedReview = await reviewsService.create(input);
    setReviews((previous) => [savedReview, ...previous.filter((review) => review.id !== savedReview.id)]);
  };

  const deleteReview = async (reviewId: string) => {
    await reviewsService.remove(reviewId);
    setReviews((previous) => previous.filter((review) => review.id !== reviewId));
  };

  return (
    <ReviewsContext.Provider value={{ reviews: hasLoadedReviews ? reviews : [], getCabinReviews, getCabinStats, addReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within a ReviewsProvider');
  return context;
};
