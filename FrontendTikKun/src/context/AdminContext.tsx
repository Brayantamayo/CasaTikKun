// Comparte el estado administrativo y sincroniza los cambios del catálogo y las imágenes.
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TarifasCabana, Cabana } from '../types';
import { ACCOMMODATIONS, TIKKUN_RULES, TIKKUN_COURTESIES, TIKKUN_SPECIFICATIONS } from '../data/tikkunData';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { TikkunService } from '../services/api';

// Recursos predeterminados para la portada y la galería.
import heroGlamping from '../assets/images/hero_glamping_dome_1790614291764.jpg';
import cabanaMirador from '../assets/images/cabana_mirador_tikkun_1790783983488.jpg';
import cabinLuxury from '../assets/images/cabin_alpina_luxury_1790614303472.jpg';
import deckMalla from '../assets/images/deck_malla_glamping_1790784044690.jpg';
import campfireNight from '../assets/images/campfire_starlit_night_1790614323241.jpg';
import panoramaMontana from '../assets/images/panorama_montana_sunset_1790795159192.jpg';
import interiorBedroom from '../assets/images/interior_bedroom_glamping_1790784033539.jpg';
import santaElenaMist from '../assets/images/santa_elena_mist_1790871640380.jpg';
import comodidadesBg from '../assets/images/comodidades_sunset_view_1790795592886.jpg';

export const DEFAULT_HERO_IMAGES: string[] = [
  heroGlamping,
  cabanaMirador,
  cabinLuxury,
  deckMalla,
  campfireNight
];

export const DEFAULT_GALLERY_IMAGES: string[] = [
  panoramaMontana,
  cabinLuxury,
  interiorBedroom,
  campfireNight,
  santaElenaMist,
  heroGlamping,
  cabanaMirador,
  comodidadesBg
];

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  ratesOverrides: Record<string, TarifasCabana>;
  updateCabinRates: (cabinId: string, rates: TarifasCabana) => void;
  resetRatesToDefault: () => void;
  getEffectiveAccommodations: () => Cabana[];
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  // Operaciones para crear, consultar, actualizar y eliminar cabañas.
  addCabin: (cabin: Cabana) => void;
  updateCabin: (cabin: Cabana) => void;
  deleteCabin: (cabinId: string) => void;
  resetAllCabinsToDefault: () => void;
  // Administración de imágenes de la portada.
  heroImages: string[];
  setHeroImagesList: (urls: string[]) => void;
  resetHeroImagesToDefault: () => void;
  // Administración de imágenes de la galería.
  galleryImages: string[];
  setGalleryImagesList: (urls: string[]) => void;
  resetGalleryImagesToDefault: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Al cargar la app, pregunta al backend si la cookie HttpOnly todavía representa una sesión válida.
    const authApi = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:3001';
    void fetch(`${authApi}/api/auth/me`, { credentials: 'include' })
      .then((response) => setIsAuthenticated(response.ok))
      .catch(() => setIsAuthenticated(false));
    try {
      localStorage.removeItem('casatikkun_admin_auth');
      localStorage.removeItem('casatikkun_admin_pass');
    } catch {
      // La autenticación del servidor no depende del almacenamiento local.
    }
  }, []);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Guardar las tarifas personalizadas en localStorage.
  const [ratesOverrides, setRatesOverrides] = useState<Record<string, TarifasCabana>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RATES_OVERRIDES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Guardar las cabañas personalizadas.
  const [customCabins, setCustomCabins] = useState<Cabana[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_CABINS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Guardar los cambios de las cabañas predeterminadas.
  const [modifiedCabins, setModifiedCabins] = useState<Record<string, Partial<Cabana>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODIFIED_CABINS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Guardar los identificadores de las cabañas ocultas.
  const [deletedCabinIds, setDeletedCabinIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELETED_CABINS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Guardar las imágenes de la portada.
  const [heroImages, setHeroImages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO_IMAGES);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_HERO_IMAGES;
    } catch {
      return DEFAULT_HERO_IMAGES;
    }
  });

  // Guardar las imágenes de la galería.
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY_IMAGES);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_GALLERY_IMAGES;
    } catch {
      return DEFAULT_GALLERY_IMAGES;
    }
  });

  // Gestionar el inicio de sesión.
  const login = async (username: string, pass: string): Promise<boolean> => {
    // credentials: 'include' permite enviar y recibir la cookie de sesión segura del backend.
    const authApi = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:3001';
    try {
      const response = await fetch(`${authApi}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password: pass }),
      });
      if (!response.ok) return false;
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    // Solicita al backend borrar la cookie; la interfaz también se cierra si la API no responde.
    const authApi = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:3001';
    try {
      await fetch(`${authApi}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      // La interfaz se cierra aunque el servidor no responda.
    }
    setIsAuthenticated(false);
  };


  const updateCabinRates = (cabinId: string, rates: TarifasCabana) => {
    setRatesOverrides((prev) => {
      const updated = {
        ...prev,
        [cabinId]: rates
      };
      try {
        localStorage.setItem(STORAGE_KEYS.RATES_OVERRIDES, JSON.stringify(updated));
      } catch {
        // Continuar si el almacenamiento local no está disponible.
      }
      return updated;
    });
  };

  const resetRatesToDefault = () => {
    setRatesOverrides({});
    localStorage.removeItem(STORAGE_KEYS.RATES_OVERRIDES);
  };

  // Añadir una cabaña.
  const addCabin = (newCabin: Cabana) => {
    const enriched: Cabana = {
      ...newCabin,
      reglas: newCabin.reglas || TIKKUN_RULES,
      cortesias: newCabin.cortesias || TIKKUN_COURTESIES,
      especificaciones: newCabin.especificaciones || TIKKUN_SPECIFICATIONS
    };

    setCustomCabins((prev) => {
      const updated = [...prev, enriched];
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_CABINS, JSON.stringify(updated));
      } catch {
        // Usar el comportamiento alternativo si se alcanza el límite de almacenamiento.
      }
      return updated;
    });

    if (enriched.tarifas) {
      updateCabinRates(enriched.id, enriched.tarifas);
    }

    // Sincronizar con la API del servidor sin bloquear la interfaz.
    void TikkunService.syncCabinToBackend(enriched, 'POST');
  };

  // Actualizar una cabaña personalizada o predeterminada.
  const updateCabin = (updatedCabin: Cabana) => {
    const isCustom = customCabins.some((c) => c.id === updatedCabin.id);

    if (isCustom) {
      setCustomCabins((prev) => {
        const updated = prev.map((c) => (c.id === updatedCabin.id ? updatedCabin : c));
        try {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_CABINS, JSON.stringify(updated));
        } catch {
          // Continuar si se alcanza el límite de almacenamiento.
        }
        return updated;
      });
    } else {
      setModifiedCabins((prev) => {
        const updated = {
          ...prev,
          [updatedCabin.id]: updatedCabin
        };
        try {
          localStorage.setItem(STORAGE_KEYS.MODIFIED_CABINS, JSON.stringify(updated));
        } catch {
          // Continuar si se alcanza el límite de almacenamiento.
        }
        return updated;
      });
    }

    if (updatedCabin.tarifas) {
      updateCabinRates(updatedCabin.id, updatedCabin.tarifas);
    }

    // Sincronizar con la API del servidor sin bloquear la interfaz.
    void TikkunService.syncCabinToBackend(updatedCabin, 'PUT');
  };

  // Eliminar una cabaña personalizada u ocultar una predeterminada.
  const deleteCabin = (cabinId: string) => {
    setCustomCabins((prev) => {
      const updated = prev.filter((c) => c.id !== cabinId);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_CABINS, JSON.stringify(updated));
      } catch {
        // Continuar si se alcanza el límite de almacenamiento.
      }
      return updated;
    });

    setDeletedCabinIds((prev) => {
      if (!prev.includes(cabinId)) {
        const updated = [...prev, cabinId];
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_CABINS, JSON.stringify(updated));
        } catch {
          // Continuar si se alcanza el límite de almacenamiento.
        }
        return updated;
      }
      return prev;
    });

    void TikkunService.syncDeleteCabinToBackend(cabinId);
  };

  const resetAllCabinsToDefault = () => {
    setCustomCabins([]);
    setModifiedCabins({});
    setDeletedCabinIds([]);
    setRatesOverrides({});
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_CABINS);
    localStorage.removeItem(STORAGE_KEYS.MODIFIED_CABINS);
    localStorage.removeItem(STORAGE_KEYS.DELETED_CABINS);
    localStorage.removeItem(STORAGE_KEYS.RATES_OVERRIDES);
  };

  // Acciones para administrar las imágenes de portada.
  const setHeroImagesList = (urls: string[]) => {
    setHeroImages(urls);
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_IMAGES, JSON.stringify(urls));
    } catch {
      // Usar el comportamiento alternativo si se alcanza el límite de localStorage.
    }
    void TikkunService.syncMediaToBackend({ imagenesHero: urls });
  };

  const resetHeroImagesToDefault = () => {
    setHeroImages(DEFAULT_HERO_IMAGES);
    localStorage.removeItem(STORAGE_KEYS.HERO_IMAGES);
    void TikkunService.syncMediaToBackend({ imagenesHero: DEFAULT_HERO_IMAGES });
  };

  // Acciones para administrar las imágenes de la galería.
  const setGalleryImagesList = (urls: string[]) => {
    setGalleryImages(urls);
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY_IMAGES, JSON.stringify(urls));
    } catch {
      // Usar el comportamiento alternativo si se alcanza el límite de localStorage.
    }
    void TikkunService.syncMediaToBackend({ imagenesGaleria: urls });
  };

  const resetGalleryImagesToDefault = () => {
    setGalleryImages(DEFAULT_GALLERY_IMAGES);
    localStorage.removeItem(STORAGE_KEYS.GALLERY_IMAGES);
    void TikkunService.syncMediaToBackend({ imagenesGaleria: DEFAULT_GALLERY_IMAGES });
  };

  const getEffectiveAccommodations = (): Cabana[] => {
    const baseDefaults = ACCOMMODATIONS
      .filter((acc) => !deletedCabinIds.includes(acc.id))
      .map((acc) => {
        const mod = modifiedCabins[acc.id] || {};
        const merged = { ...acc, ...mod };
        const customRates = ratesOverrides[acc.id];
        if (customRates) {
          merged.tarifas = customRates;
          merged.precioCOP = customRates.diaSemana;
        }
        return merged;
      });

    const effectiveCustom = customCabins
      .filter((acc) => !deletedCabinIds.includes(acc.id))
      .map((acc) => {
        const customRates = ratesOverrides[acc.id];
        if (customRates) {
          return {
            ...acc,
            tarifas: customRates,
            precioCOP: customRates.diaSemana
          };
        }
        return acc;
      });

    return [...baseDefaults, ...effectiveCustom];
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        ratesOverrides,
        updateCabinRates,
        resetRatesToDefault,
        getEffectiveAccommodations,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        addCabin,
        updateCabin,
        deleteCabin,
        resetAllCabinsToDefault,
        heroImages,
        setHeroImagesList,
        resetHeroImagesToDefault,
        galleryImages,
        setGalleryImagesList,
        resetGalleryImagesToDefault
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
