import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TarifasCabana, Cabana } from '../types';
import { ACCOMMODATIONS, TIKKUN_RULES, TIKKUN_COURTESIES, TIKKUN_SPECIFICATIONS } from '../data/tikkunData';
import { DEFAULT_ADMIN_CREDENTIALS, STORAGE_KEYS } from '../constants/storageKeys';
import { TikkunService } from '../services/api';

// Default assets for Hero and Gallery
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
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  updatePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  ratesOverrides: Record<string, TarifasCabana>;
  updateCabinRates: (cabinId: string, rates: TarifasCabana) => void;
  resetRatesToDefault: () => void;
  getEffectiveAccommodations: () => Cabana[];
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  // Cabin CRUD
  addCabin: (cabin: Cabana) => void;
  updateCabin: (cabin: Cabana) => void;
  deleteCabin: (cabinId: string) => void;
  resetAllCabinsToDefault: () => void;
  // Landing Hero Images CRUD
  heroImages: string[];
  setHeroImagesList: (urls: string[]) => void;
  resetHeroImagesToDefault: () => void;
  // Landing Gallery Images CRUD
  galleryImages: string[];
  setGalleryImagesList: (urls: string[]) => void;
  resetGalleryImagesToDefault: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Store rates overrides in localStorage
  const [ratesOverrides, setRatesOverrides] = useState<Record<string, TarifasCabana>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RATES_OVERRIDES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Store custom created cabins
  const [customCabins, setCustomCabins] = useState<Cabana[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_CABINS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Store modified default cabins
  const [modifiedCabins, setModifiedCabins] = useState<Record<string, Partial<Cabana>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODIFIED_CABINS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Store deleted cabin ids
  const [deletedCabinIds, setDeletedCabinIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELETED_CABINS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Store Hero Images
  const [heroImages, setHeroImages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO_IMAGES);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_HERO_IMAGES;
    } catch {
      return DEFAULT_HERO_IMAGES;
    }
  });

  // Store Gallery Images
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY_IMAGES);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_GALLERY_IMAGES;
    } catch {
      return DEFAULT_GALLERY_IMAGES;
    }
  });

  // Login handler
  const login = (username: string, pass: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const currentPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || DEFAULT_ADMIN_CREDENTIALS.PASS;

    const isValidUser =
      cleanUser === DEFAULT_ADMIN_CREDENTIALS.USER || cleanUser === DEFAULT_ADMIN_CREDENTIALS.SHORT_USER;
    const isValidPass = pass === currentPass;

    if (isValidUser && isValidPass) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const updatePassword = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    const currentPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || DEFAULT_ADMIN_CREDENTIALS.PASS;
    if (oldPass !== currentPass) {
      return { success: false, error: 'La contraseña actual no es correcta.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'La nueva contraseña debe tener mínimo 6 caracteres.' };
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, newPass);
    return { success: true };
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
        // Ignore storage error
      }
      return updated;
    });
  };

  const resetRatesToDefault = () => {
    setRatesOverrides({});
    localStorage.removeItem(STORAGE_KEYS.RATES_OVERRIDES);
  };

  // Add new cabin
  const addCabin = (newCabin: Cabana) => {
    const enriched: Cabana = {
      ...newCabin,
      rules: newCabin.rules || TIKKUN_RULES,
      courtesies: newCabin.courtesies || TIKKUN_COURTESIES,
      specifications: newCabin.specifications || TIKKUN_SPECIFICATIONS
    };

    setCustomCabins((prev) => {
      const updated = [...prev, enriched];
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_CABINS, JSON.stringify(updated));
      } catch {
        // Fallback if quota reached
      }
      return updated;
    });

    if (enriched.rates) {
      updateCabinRates(enriched.id, enriched.rates);
    }

    // Non-blocking sync to Backend API
    void TikkunService.syncCabinToBackend(enriched, 'POST');
  };

  // Update existing cabin (custom or default)
  const updateCabin = (updatedCabin: Cabana) => {
    const isCustom = customCabins.some((c) => c.id === updatedCabin.id);

    if (isCustom) {
      setCustomCabins((prev) => {
        const updated = prev.map((c) => (c.id === updatedCabin.id ? updatedCabin : c));
        try {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_CABINS, JSON.stringify(updated));
        } catch {
          // Ignore quota error
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
          // Ignore quota error
        }
        return updated;
      });
    }

    if (updatedCabin.rates) {
      updateCabinRates(updatedCabin.id, updatedCabin.rates);
    }

    // Non-blocking sync to Backend API
    void TikkunService.syncCabinToBackend(updatedCabin, 'PUT');
  };

  // Delete cabin (custom or hide default)
  const deleteCabin = (cabinId: string) => {
    setCustomCabins((prev) => {
      const updated = prev.filter((c) => c.id !== cabinId);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_CABINS, JSON.stringify(updated));
      } catch {
        // Ignore quota error
      }
      return updated;
    });

    setDeletedCabinIds((prev) => {
      if (!prev.includes(cabinId)) {
        const updated = [...prev, cabinId];
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_CABINS, JSON.stringify(updated));
        } catch {
          // Ignore quota error
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

  // Hero images handlers
  const setHeroImagesList = (urls: string[]) => {
    setHeroImages(urls);
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_IMAGES, JSON.stringify(urls));
    } catch {
      // Fallback if localStorage quota exceeded
    }
    void TikkunService.syncMediaToBackend({ heroImages: urls });
  };

  const resetHeroImagesToDefault = () => {
    setHeroImages(DEFAULT_HERO_IMAGES);
    localStorage.removeItem(STORAGE_KEYS.HERO_IMAGES);
    void TikkunService.syncMediaToBackend({ heroImages: DEFAULT_HERO_IMAGES });
  };

  // Gallery images handlers
  const setGalleryImagesList = (urls: string[]) => {
    setGalleryImages(urls);
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY_IMAGES, JSON.stringify(urls));
    } catch {
      // Fallback if localStorage quota exceeded
    }
    void TikkunService.syncMediaToBackend({ galleryImages: urls });
  };

  const resetGalleryImagesToDefault = () => {
    setGalleryImages(DEFAULT_GALLERY_IMAGES);
    localStorage.removeItem(STORAGE_KEYS.GALLERY_IMAGES);
    void TikkunService.syncMediaToBackend({ galleryImages: DEFAULT_GALLERY_IMAGES });
  };

  const getEffectiveAccommodations = (): Cabana[] => {
    const baseDefaults = ACCOMMODATIONS
      .filter((acc) => !deletedCabinIds.includes(acc.id))
      .map((acc) => {
        const mod = modifiedCabins[acc.id] || {};
        const merged = { ...acc, ...mod };
        const customRates = ratesOverrides[acc.id];
        if (customRates) {
          merged.rates = customRates;
          merged.priceCOP = customRates.weekday;
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
            rates: customRates,
            priceCOP: customRates.weekday
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
        updatePassword,
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
