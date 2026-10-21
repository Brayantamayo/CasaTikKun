// Comparte el catálogo sincronizado con Neon y la configuración de imágenes del sitio.
import React, { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Cabana } from '@/compartido/tipos';
import { accommodationsService } from '@/modulos/alojamientos/servicios/accommodationsService';
import { mediaService } from '@/compartido/utilidades/mediaService';
import { notificar } from '@/compartido/utilidades/notificaciones';
import { contextoAdmin, type AdminContextType } from '@/modulos/administracion/contexto/contextoAdmin';

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cabins, setCabins] = useState<Cabana[]>([]);
  const [hasLoadedMedia, setHasLoadedMedia] = useState(false);
  const [mediaLoadError, setMediaLoadError] = useState<Error | null>(null);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // El catálogo publicado proviene exclusivamente del backend.
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const remoteCabins = await accommodationsService.list();
        if (active) setCabins(remoteCabins);
      } catch (error) {
        if (active) {
          setCabins([]);
          console.error('No se pudo cargar el catálogo desde el backend.', error);
          notificar.error(error instanceof Error ? error.message : 'No se pudo cargar el inventario de cabañas.');
        }
      }
    })();
    return () => { active = false; };
  }, []);

  // La API conserva las imágenes activas y su orden para la página pública.
  useEffect(() => {
    let active = true;
    void mediaService.get().then((media) => {
      if (!active) return;
      setHeroImages(media.imagenesHero);
      setGalleryImages(media.imagenesGaleria);
      setHasLoadedMedia(true);
    }).catch((error) => {
      if (!active) return;
      console.error('No se pudieron cargar las imágenes desde el backend.', error);
      setMediaLoadError(error instanceof Error ? error : new Error('No se pudieron cargar las imágenes.'));
      notificar.error('No se pudieron cargar las imágenes del sitio. Revisa la conexión con la API.');
      setHasLoadedMedia(true);
    });
    try {
      localStorage.removeItem('casatikkun_admin_auth');
      localStorage.removeItem('casatikkun_admin_pass');
      for (const legacyKey of [
        'casatikkun_custom_cabins',
        'casatikkun_modified_cabins',
        'casatikkun_deleted_cabins',
        'casatikkun_rates_overrides',
        'casatikkun_hero_images',
        'casatikkun_gallery_images',
        'casatikkun_guest_reviews_v1',
      ]) localStorage.removeItem(legacyKey);
    } catch { /* La sesión del servidor no depende del almacenamiento local. */ }
    return () => { active = false; };
  }, []);

  const addCabin = async (cabin: Cabana): Promise<Cabana> => {
    const created = await accommodationsService.create(cabin);
    setCabins((current) => [...current, created].sort((a, b) => a.numeroCabana - b.numeroCabana));
    return created;
  };

  const updateCabin = async (cabin: Cabana): Promise<Cabana> => {
    const updated = await accommodationsService.update(cabin);
    setCabins((current) => current.map((item) => item.id === updated.id ? updated : item));
    return updated;
  };

  const deleteCabin = async (cabinId: string): Promise<void> => {
    await accommodationsService.remove(cabinId);
    setCabins((current) => current.filter((item) => item.id !== cabinId));
  };

  const setHeroImagesList = async (urls: string[]) => {
    if (mediaLoadError) throw mediaLoadError;
    if (!hasLoadedMedia) throw new Error('Espera a que cargue la configuración de imágenes antes de editarla.');
    await mediaService.update({ imagenesHero: urls });
    setHeroImages(urls);
  };

  const resetHeroImagesToDefault = async () => setHeroImagesList([]);

  const setGalleryImagesList = async (urls: string[]) => {
    if (mediaLoadError) throw mediaLoadError;
    if (!hasLoadedMedia) throw new Error('Espera a que cargue la configuración de imágenes antes de editarla.');
    await mediaService.update({ imagenesGaleria: urls });
    setGalleryImages(urls);
  };

  const resetGalleryImagesToDefault = async () => setGalleryImagesList([]);

  const value = useMemo<AdminContextType>(() => ({
    getEffectiveAccommodations: () => cabins,
    addCabin,
    updateCabin,
    deleteCabin,
    heroImages,
    setHeroImagesList,
    resetHeroImagesToDefault,
    galleryImages,
    setGalleryImagesList,
    resetGalleryImagesToDefault,
  }), [cabins, heroImages, galleryImages, hasLoadedMedia, mediaLoadError]);

  return <contextoAdmin.Provider value={value}>{children}</contextoAdmin.Provider>;
};
