// Define el contrato compartido y el hook para leer el estado administrativo.
import { createContext, useContext } from 'react';
import type { Cabana } from '@/compartido/tipos';

export interface AdminContextType {
  getEffectiveAccommodations: () => Cabana[];
  addCabin: (cabin: Cabana) => Promise<Cabana>;
  updateCabin: (cabin: Cabana) => Promise<Cabana>;
  deleteCabin: (cabinId: string) => Promise<void>;
  heroImages: string[];
  setHeroImagesList: (urls: string[]) => Promise<void>;
  resetHeroImagesToDefault: () => Promise<void>;
  galleryImages: string[];
  setGalleryImagesList: (urls: string[]) => Promise<void>;
  resetGalleryImagesToDefault: () => Promise<void>;
}

export const contextoAdmin = createContext<AdminContextType | undefined>(undefined);

export function useAdmin(): AdminContextType {
  const context = useContext(contextoAdmin);
  if (!context) throw new Error('useAdmin debe usarse dentro de AdminProvider.');
  return context;
}
