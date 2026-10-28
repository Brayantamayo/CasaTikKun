// Página principal para gestionar contenidos desde el panel de administración.
import React, { useEffect, useState } from 'react';
import { 
  LogOut, Star, Check, RefreshCw, LoaderCircle,
  Plus, Edit3, Trash2, Users, Bed, Image as ImageIcon, 
  Search, Upload, Monitor, ArrowUp,
  LayoutGrid, List, Settings, DollarSign
} from 'lucide-react';
import { TikkunLogo } from '@/modulos/Home/TikkunLogo';
import { useAuth } from '@/modulos/autenticacion/contexto/AuthContext';
import { useAdmin } from '@/modulos/administracion/contexto/contextoAdmin';
import { useReviews } from '@/modulos/resenas/contexto/ReviewsContext';
import { Cabana } from '@/compartido/tipos';
import { CabinEditorModal } from '@/modulos/administracion/componentes/CabinEditorModal';
import { formatCOP } from '@/compartido/utilidades/formatters';
import { compressImageFile, compressMultipleImageFiles } from '@/compartido/utilidades/imageUtils';
import { deleteImageFromCloudinary, uploadImageToCloudinary, uploadImagesToCloudinary } from '@/compartido/utilidades/cloudinaryService';
import { notificar } from '@/compartido/utilidades/notificaciones';
import { reviewsService } from '@/modulos/resenas/servicios/reviewsService';
import type { ResenaAdministracion } from '@/compartido/tipos';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { logout, admin } = useAuth();
  const { 
    getEffectiveAccommodations,
    addCabin,
    updateCabin,
    deleteCabin,
    heroImages,
    setHeroImagesList,
    resetHeroImagesToDefault,
    galleryImages,
    setGalleryImagesList,
    resetGalleryImagesToDefault
  } = useAdmin();

  const { reviews, deleteReview, refreshReviews } = useReviews();
  const [adminReviews, setAdminReviews] = useState<ResenaAdministracion[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const allAccommodations = getEffectiveAccommodations();

  const handleLogout = async () => {
    try {
      await logout();
      notificar.exito('Sesión cerrada correctamente.');
    } catch {
      // Se cierra el panel localmente aunque la API no responda; el usuario verá que el servidor no confirmó la cookie.
      notificar.error('Saliste del panel, pero no se pudo confirmar el cierre con el servidor. Comprueba tu conexión.');
    } finally {
      onLogout();
    }
  };

  // Pestañas principales de navegación.
  const [activeTab, setActiveTab] = useState<'cabins' | 'landing' | 'gallery' | 'reviews'>('cabins');

  useEffect(() => {
    if (activeTab !== 'reviews') return;
    let active = true;
    setIsLoadingReviews(true);
    void reviewsService.listForAdmin()
      .then((items) => { if (active) setAdminReviews(items); })
      .catch((error) => { if (active) showError(error instanceof Error ? error.message : 'No se pudieron cargar las reseñas.'); })
      .finally(() => { if (active) setIsLoadingReviews(false); });
    return () => { active = false; };
  }, [activeTab]);

  // Modo de visualización de cabañas: cuadrícula o tabla.
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtro de búsqueda.
  const [searchQuery, setSearchQuery] = useState('');

  // Estado de la ventana para crear o editar una cabaña.
  const [isCabinModalOpen, setIsCabinModalOpen] = useState(false);
  const [cabinEditingTarget, setCabinEditingTarget] = useState<Cabana | null>(null);

  // Confirmaciones en línea.
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Campos para ingresar direcciones de imágenes.
  const [pendingHeroFiles, setPendingHeroFiles] = useState<Array<{ file: File; previewUrl: string }>>([]);
  const [pendingGalleryFiles, setPendingGalleryFiles] = useState<Array<{ file: File; previewUrl: string }>>([]);
  const [heroUploadStatus, setHeroUploadStatus] = useState('');
  const [isHeroUploading, setIsHeroUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // Libera las URLs locales de vista previa al salir del panel.
  useEffect(() => () => {
    [...pendingHeroFiles, ...pendingGalleryFiles].forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
  }, [pendingHeroFiles, pendingGalleryFiles]);

  // Notificaciones.
  const showSuccess = (msg: string) => notificar.exito(msg);
  const showError = (msg: string) => notificar.error(msg);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      setAdminReviews((items) => items.filter((item) => item.id !== reviewId));
      showSuccess('Reseña eliminada.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo eliminar la reseña.');
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await reviewsService.approve(reviewId);
      const refreshed = await reviewsService.listForAdmin();
      setAdminReviews(refreshed);
      await refreshReviews();
      showSuccess('Reseña aprobada. Si ya había 15 publicadas, se retiró automáticamente la más antigua.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo aprobar la reseña.');
    }
  };

  // Indicadores y métricas.
  const totalCapacity = allAccommodations.reduce((acc, c) => acc + (c.capacidad || 2), 0);
  const averageReviewRating = reviews.length > 0
    ? reviews.reduce((total, review) => total + review.calificacion, 0) / reviews.length
    : null;
  const averageWeekdayPrice = allAccommodations.length > 0
    ? Math.round(allAccommodations.reduce((acc, c) => acc + (c.tarifas?.diaSemana || c.precioCOP || 0), 0) / allAccommodations.length)
    : 0;

  // Número de la siguiente cabaña.
  const nextCabinNumber = allAccommodations.length > 0 
    ? Math.max(...allAccommodations.map((a) => a.numeroCabana || 0)) + 1
    : 1;

  // Cabañas filtradas.
  const filteredCabins = allAccommodations.filter((cabin) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cabin.nombre.toLowerCase().includes(q) ||
      cabin.etiquetaNumeroCabana.toLowerCase().includes(q) ||
      cabin.camas.toLowerCase().includes(q)
    );
  });

  // Acciones del panel.
  const handleOpenCreateCabin = () => {
    setCabinEditingTarget(null);
    setIsCabinModalOpen(true);
  };

  const handleOpenEditCabin = (cabin: Cabana) => {
    setCabinEditingTarget(cabin);
    setIsCabinModalOpen(true);
  };

  const handleSaveCabinFromModal = async (savedCabin: Cabana) => {
    if (cabinEditingTarget) {
      await updateCabin(savedCabin);
      const removedPhotos = (cabinEditingTarget.imagenesGaleria || [])
        .filter((url) => !savedCabin.imagenesGaleria.includes(url));
      const cleanup = await Promise.allSettled(removedPhotos.map((url) => deleteImageFromCloudinary(url)));
      if (cleanup.some((result) => result.status === 'rejected')) {
        showError('La cabaña se guardó, pero algunas fotos anteriores siguen en Cloudinary.');
      } else {
        showSuccess(`Cabaña "${savedCabin.nombre}" actualizada.`);
      }
    } else {
      const created = await addCabin(savedCabin);
      showSuccess(`Cabaña "${created.nombre}" creada y guardada.`);
    }
  };

  const handleConfirmDeleteCabin = async (cabin: Cabana) => {
    if (allAccommodations.length <= 1) {
      showError('Debes mantener al menos una cabaña activa en el sitio.');
      setConfirmDeleteId(null);
      return;
    }
    try {
      await deleteCabin(cabin.id);
      setConfirmDeleteId(null);
      const cleanup = await Promise.allSettled((cabin.imagenesGaleria || []).map((url) => deleteImageFromCloudinary(url)));
      if (cleanup.some((result) => result.status === 'rejected')) {
        showError('La cabaña se eliminó, pero algunas fotos anteriores siguen en Cloudinary.');
      } else {
        showSuccess(`Cabaña "${cabin.nombre}" eliminada.`);
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo eliminar la cabaña.');
    }
  };

  // --- ACCIONES DE LA PORTADA ---
  const handleHeroFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mantiene los archivos seleccionados para que el administrador confirme antes de subirlos.
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    e.target.value = '';
    if (fileList.length > 5) {
      showError('Selecciona máximo 5 imágenes por carga para evitar problemas de memoria o conexión.');
      return;
    }
    if (heroImages.length + fileList.length > 50) {
      showError(`El Hero admite hasta 50 imágenes. Ya tienes ${heroImages.length}; puedes agregar ${Math.max(0, 50 - heroImages.length)} más.`);
      return;
    }
    setPendingHeroFiles(fileList.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })));
  };

  const handleConfirmHeroUpload = async () => {
    if (pendingHeroFiles.length === 0) return;
    setIsHeroUploading(true);
    let savedImages = [...heroImages];
    try {
      for (const [index, pending] of pendingHeroFiles.entries()) {
        setHeroUploadStatus(`Optimizando imagen ${index + 1} de ${pendingHeroFiles.length}…`);
        const compressed = await compressImageFile(pending.file);
        setHeroUploadStatus(`Subiendo imagen ${index + 1} de ${pendingHeroFiles.length} a Cloudinary…`);
        const uploadedUrl = await uploadImageToCloudinary(compressed, 'hero');
        const nextImages = [...savedImages, uploadedUrl];
        setHeroUploadStatus(`Guardando imagen ${index + 1} de ${pendingHeroFiles.length}…`);
        try {
          await setHeroImagesList(nextImages);
        } catch (error) {
          await deleteImageFromCloudinary(uploadedUrl).catch(() => false);
          throw error;
        }
        savedImages = nextImages;
      }
      setHeroUploadStatus('');
      showSuccess(`${pendingHeroFiles.length} ${pendingHeroFiles.length === 1 ? 'imagen agregada' : 'imágenes agregadas'} a la portada.`);
      setPendingHeroFiles([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron subir las imágenes al Hero.';
      setHeroUploadStatus('');
      const completedCount = savedImages.length - heroImages.length;
      showError(completedCount > 0 ? `${message} Se guardaron ${completedCount} ${completedCount === 1 ? 'imagen antes del error' : 'imágenes antes del error'}.` : message);
      console.error('[Hero upload]', error);
    } finally {
      setIsHeroUploading(false);
    }
  };

  const handleReplaceSingleHeroImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    // Optimiza la imagen elegida y reemplaza solo la posición indicada después de subirla.
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const compressed = await compressImageFile(file);
      const result = await uploadImageToCloudinary(compressed, 'hero');
      const updated = [...heroImages];
      updated[idx] = result;
      try {
        await setHeroImagesList(updated);
      } catch (error) {
        await deleteImageFromCloudinary(result).catch(() => false);
        throw error;
      }
      try {
        await deleteImageFromCloudinary(heroImages[idx]);
      } catch {
        showError('La portada se reemplazó, pero no se pudo limpiar la imagen anterior de Cloudinary.');
        return;
      }
      showSuccess(`Imagen #${idx + 1} de la portada reemplazada.`);
    } catch {
      showError('No se pudo reemplazar la imagen en Cloudinary.');
    }
  };

  const handleRemoveHeroImage = async (idx: number) => {
    if (heroImages.length <= 1) {
      showError('El Hero principal debe mantener al menos 1 imagen.');
      return;
    }
    const removedImage = heroImages[idx];
    try {
      await setHeroImagesList(heroImages.filter((_, i) => i !== idx));
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo guardar el cambio de portada.');
      return;
    }
    try {
      await deleteImageFromCloudinary(removedImage);
    } catch {
      showError('La imagen salió del sitio, pero no se pudo limpiar de Cloudinary.');
      return;
    }
    showSuccess('Imagen eliminada de la portada.');
  };

  const handleMakeFirstHeroImage = async (idx: number) => {
    if (idx === 0) return;
    const item = heroImages[idx];
    const rest = heroImages.filter((_, i) => i !== idx);
    try {
      await setHeroImagesList([item, ...rest]);
      showSuccess('Imagen establecida como portada principal.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo cambiar el orden del Hero.');
    }
  };

  // --- ACCIONES DE LA GALERÍA ---
  const handleGalleryFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Conserva las imágenes elegidas para mostrarlas antes de confirmar la carga.
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    e.target.value = '';
    if (fileList.length > 5) {
      showError('Selecciona máximo 5 imágenes por carga.');
      return;
    }
    setPendingGalleryFiles(fileList.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })));
  };

  const handleConfirmGalleryUpload = async () => {
    if (pendingGalleryFiles.length === 0) return;
    setIsGalleryUploading(true);
    try {
      const compressed = await compressMultipleImageFiles(pendingGalleryFiles.map(({ file }) => file));
      const loadedUrls = await uploadImagesToCloudinary(compressed, 'gallery');
      if (loadedUrls.length > 0) {
        try {
          await setGalleryImagesList([...loadedUrls, ...galleryImages]);
        } catch (error) {
          await Promise.allSettled(loadedUrls.map((url) => deleteImageFromCloudinary(url)));
          throw error;
        }
        showSuccess('Fotografía(s) agregada(s) a la Galería de Experiencias.');
        setPendingGalleryFiles([]);
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudieron subir las fotos de la galería.');
    } finally {
      setIsGalleryUploading(false);
    }
  };

  const handleReplaceSingleGalleryImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    // Mantiene las demás fotos de la galería y sustituye únicamente la seleccionada.
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const compressed = await compressImageFile(file);
      const result = await uploadImageToCloudinary(compressed, 'gallery');
      const updated = [...galleryImages];
      updated[idx] = result;
      try {
        await setGalleryImagesList(updated);
      } catch (error) {
        await deleteImageFromCloudinary(result).catch(() => false);
        throw error;
      }
      try {
        await deleteImageFromCloudinary(galleryImages[idx]);
      } catch {
        showError('La galería se actualizó, pero no se pudo limpiar la foto anterior de Cloudinary.');
        return;
      }
      showSuccess(`Fotografía #${idx + 1} de la galería reemplazada.`);
    } catch {
      showError('No se pudo reemplazar la fotografía en Cloudinary.');
    }
  };

  const handleRemoveGalleryImage = async (idx: number) => {
    if (galleryImages.length <= 1) {
      showError('La galería debe mantener al menos 1 fotografía.');
      return;
    }
    const removedImage = galleryImages[idx];
    try {
      await setGalleryImagesList(galleryImages.filter((_, i) => i !== idx));
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo guardar el cambio de galería.');
      return;
    }
    try {
      await deleteImageFromCloudinary(removedImage);
    } catch {
      showError('La fotografía salió del sitio, pero no se pudo limpiar de Cloudinary.');
      return;
    }
    showSuccess('Fotografía eliminada de la Galería.');
  };

  const handleMakeFirstGalleryImage = async (idx: number) => {
    if (idx === 0) return;
    const item = galleryImages[idx];
    const rest = galleryImages.filter((_, i) => i !== idx);
    try {
      await setGalleryImagesList([item, ...rest]);
      showSuccess('Fotografía destacada en el primer lugar.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo cambiar el orden de la galería.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5EF] text-tikkun-brand-deep font-sans pb-20 selection:bg-[#435B48] selection:text-white">
      
      {/* Encabezado original del panel con acciones de acceso rápido. */}
      <header className="sticky top-0 z-30 border-b border-[#E4E7DC] bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          
          <div className="flex min-w-0 items-center gap-3">
            <TikkunLogo size="sm" className="rounded-xl border border-[#DCE4D3] shadow-sm" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#718267]">Casa Tikkun</p>
              <h1 className="truncate text-base font-serif font-bold leading-tight text-[#1C2E20] sm:text-lg">
                Panel de administración
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {activeTab === 'cabins' && <button
              type="button"
              onClick={handleOpenCreateCabin}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#203820] px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#314A2F] active:translate-y-0 active:scale-[.98]"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Nueva cabaña</span>
              <span className="sm:hidden">Nueva</span>
            </button>}

            <button
              type="button"
              onClick={() => { void handleLogout(); }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7E9E1] px-3 py-2.5 text-xs font-semibold text-[#596354] transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="h-4 w-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal del panel. */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 pt-7 sm:px-6 lg:px-8 lg:pt-9">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold text-[#718267]">ADMINISTRACIÓN DEL SITIO</p>
            <h2 className="mt-1 text-2xl font-serif font-bold tracking-tight text-[#1C2E20] sm:text-3xl">Todo en orden, desde aquí.</h2>
            <p className="mt-1 text-sm text-stone-500">Gestiona alojamientos, fotos y opiniones en un solo lugar.</p>
          </div>
          {admin?.email && <span className="text-xs text-stone-500">Sesión: <strong className="font-medium text-[#465E3C]">{admin.email}</strong></span>}
        </div>

        {/* Tarjetas de resumen e indicadores. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          
          <button type="button" onClick={() => setActiveTab('cabins')} aria-label="Abrir alojamientos" className="group w-full cursor-pointer space-y-1 rounded-2xl border border-[#E1E5D9] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#B8C9A5] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CAF83] sm:p-5">
            <span className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Alojamientos</span>
              <span className="rounded-xl bg-[#EEF3E8] p-2 text-[#556F48] transition-transform duration-200 group-hover:scale-110"><Users className="h-4 w-4" /></span>
            </span>
            <span className="block text-xl font-serif font-bold text-tikkun-brand-deep sm:text-2xl">
              {allAccommodations.length} <span className="text-xs font-sans font-normal text-stone-500">refugios</span>
            </span>
            <span className="block text-[11px] font-semibold text-[#556F48]">
              {allAccommodations.length > 0
                ? `Hasta ${totalCapacity} huéspedes simultáneos`
                : 'Agrega cabañas para calcular la capacidad'}
            </span>
          </button>

          <button type="button" onClick={() => setActiveTab('gallery')} aria-label="Abrir galería" className="group w-full cursor-pointer space-y-1 rounded-2xl border border-[#E1E5D9] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#B8C9A5] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CAF83] sm:p-5">
            <span className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Fotografías</span>
              <span className="rounded-xl bg-[#EEF3E8] p-2 text-[#556F48] transition-transform duration-200 group-hover:scale-110"><ImageIcon className="h-4 w-4" /></span>
            </span>
            <span className="block text-xl font-serif font-bold text-tikkun-brand-deep sm:text-2xl">
              {heroImages.length + galleryImages.length} <span className="text-xs font-sans font-normal text-stone-500">fotos</span>
            </span>
            <span className="block text-[11px] text-stone-500">
              {heroImages.length} en portada · {galleryImages.length} en galería
            </span>
          </button>

          <button type="button" onClick={() => setActiveTab('reviews')} aria-label="Abrir reseñas" className="group w-full cursor-pointer space-y-1 rounded-2xl border border-[#E1E5D9] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#E9D6B3] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AA5E] sm:p-5">
            <span className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Opiniones de huéspedes</span>
              <span className="rounded-xl bg-[#FBF2E3] p-2 text-amber-500 transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110"><Star className="h-4 w-4 fill-amber-500" /></span>
            </span>
            <span className="block text-xl font-serif font-bold text-tikkun-brand-deep sm:text-2xl">
              {averageReviewRating === null ? '—' : `${averageReviewRating.toFixed(1)}★`}
            </span>
            <span className="block text-[11px] font-semibold text-[#556F48]">
              {reviews.length === 0
                ? 'Aún no hay reseñas'
                : `${reviews.length} ${reviews.length === 1 ? 'reseña' : 'reseñas'}`}
            </span>
          </button>

        </div>

        {/* Pestañas de navegación. */}
        <div className="rounded-2xl border border-[#E1E5D9] bg-white p-1.5 shadow-sm">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            
            <button
              type="button"
              onClick={() => setActiveTab('cabins')}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-semibold transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CAF83] sm:text-sm ${
                activeTab === 'cabins'
                  ? 'bg-[#203820] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-[#F4F7EE] hover:text-tikkun-brand-deep'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Alojamientos <span className={activeTab === 'cabins' ? 'text-[#D4E0C2]' : 'text-stone-400'}>({allAccommodations.length})</span></span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('landing')}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-semibold transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CAF83] sm:text-sm ${
                activeTab === 'landing'
                  ? 'bg-[#203820] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-[#F4F7EE] hover:text-tikkun-brand-deep'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Portada <span className={activeTab === 'landing' ? 'text-[#D4E0C2]' : 'text-stone-400'}>({heroImages.length})</span></span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-semibold transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CAF83] sm:text-sm ${
                activeTab === 'gallery'
                  ? 'bg-[#203820] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-[#F4F7EE] hover:text-tikkun-brand-deep'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Galería <span className={activeTab === 'gallery' ? 'text-[#D4E0C2]' : 'text-stone-400'}>({galleryImages.length})</span></span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-semibold transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CAF83] sm:text-sm ${
                activeTab === 'reviews'
                  ? 'bg-[#203820] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-[#F4F7EE] hover:text-tikkun-brand-deep'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reseñas <span className={activeTab === 'reviews' ? 'text-[#D4E0C2]' : 'text-stone-400'}>({adminReviews.filter((review) => review.estado === 'PENDING').length})</span></span>
            </button>

          </div>
        </div>

        {/* TAB 1: CABAÑAS & GLAMPINGS */}
        {activeTab === 'cabins' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Filtros y modo de visualización. */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5DFCA] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep flex items-center gap-2">
                  <span>Inventario de Cabañas</span>
                  <span className="text-xs font-sans font-semibold text-[#556F48] px-2.5 py-0.5 rounded-full bg-[#EFF4E6] border border-[#CCD8B8]">
                    {filteredCabins.length} activas
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Gestiona precios por noche, fotos, capacidad y disponibilidad de cada cabaña en Santa Elena.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Búsqueda de cabañas. */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, cama..."
                    className="w-full sm:w-56 bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl pl-9 pr-3 py-2 text-xs text-tikkun-brand-deep placeholder-stone-400 focus:outline-hidden"
                  />
                </div>

                {/* Alternar entre cuadrícula y tabla. */}
                <div className="flex items-center gap-1 bg-tikkun-brand-cream p-1 rounded-xl border border-[#CCD8B8]">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-tikkun-brand-deep text-white font-bold shadow-2xs' : 'text-stone-600 hover:text-tikkun-brand-deep'
                    }`}
                    title="Vista en tarjetas"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-tikkun-brand-deep text-white font-bold shadow-2xs' : 'text-stone-600 hover:text-tikkun-brand-deep'
                    }`}
                    title="Vista en tabla"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreateCabin}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-tikkun-brand-deep hover:bg-[#2C4623] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-tikkun-brand-sage stroke-[2.5]" />
                  <span>Crear Nueva Cabaña</span>
                </button>
              </div>
            </div>

            {/* Vista de cuadrícula. */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCabins.map((cabin) => {
                  const photosCount = cabin.imagenesGaleria?.length || (cabin.imagenPrincipal ? 1 : 0);
                  const r = cabin.tarifas || {
                    diaSemana: cabin.precioCOP,
                    viernes: Math.round(cabin.precioCOP * 1.15),
                    finDeSemanaFestivo: Math.round(cabin.precioCOP * 1.25)
                  };
                  const isConfirmingDelete = confirmDeleteId === cabin.id;

                  return (
                    <div
                      key={cabin.id}
                      className="bg-white rounded-2xl border border-[#D5DFCA] shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                    >
                      {/* Fotografía de la cabaña. */}
                      <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                        <img
                          src={cabin.imagenPrincipal}
                          alt={cabin.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="bg-white/95 backdrop-blur-xs text-tikkun-brand-deep text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-stone-200">
                            {cabin.etiquetaNumeroCabana}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>{photosCount} fotos</span>
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-base sm:text-lg font-serif font-bold text-white truncate drop-shadow-sm">
                            {cabin.nombre}
                          </h3>
                        </div>
                      </div>

                      {/* Datos de la cabaña. */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                            {cabin.descripcion}
                          </p>

                          {/* Capacidad y camas. */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-700 pt-1">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-tikkun-brand-deep">
                              <Users className="w-3.5 h-3.5 text-[#556F48]" />
                              <span>Hasta {cabin.capacidad} personas</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-stone-600">
                              <Bed className="w-3.5 h-3.5 text-[#556F48]" />
                              <span className="truncate max-w-[160px]">{cabin.camas}</span>
                            </span>
                          </div>

                          {/* Tarifas por noche. */}
                          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-stone-100 text-center">
                            <div className="p-2 bg-tikkun-brand-cream rounded-xl border border-[#E2EBD8]">
                              <span className="block text-[9px] uppercase tracking-wider text-stone-500">Dom-Jue</span>
                              <strong className="text-xs text-tikkun-brand-deep font-bold">{formatCOP(r.diaSemana)}</strong>
                            </div>
                            <div className="p-2 bg-tikkun-brand-cream rounded-xl border border-[#E2EBD8]">
                              <span className="block text-[9px] uppercase tracking-wider text-stone-500">Viernes</span>
                              <strong className="text-xs text-tikkun-brand-deep font-bold">{formatCOP(r.viernes)}</strong>
                            </div>
                            <div className="p-2 bg-[#EFF4E6] rounded-xl border border-[#CCD8B8]">
                              <span className="block text-[9px] uppercase tracking-wider text-[#556F48] font-bold">Sáb/Fest</span>
                              <strong className="text-xs text-tikkun-brand-deep font-bold">{formatCOP(r.finDeSemanaFestivo)}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Acciones de la tarjeta. */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                          {isConfirmingDelete ? (
                            <div className="w-full flex items-center justify-between gap-2 bg-red-50 p-2 rounded-xl border border-red-200">
                              <span className="text-[11px] text-red-800 font-medium">¿Confirmar eliminación?</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleConfirmDeleteCabin(cabin)}
                                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                                >
                                  Sí, borrar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEditCabin(cabin)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-tikkun-brand-deep bg-[#EFF4E6] hover:bg-[#DCE7CF] rounded-xl transition-colors cursor-pointer border border-[#CCD8B8]"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#556F48]" />
                                <span>Editar</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(cabin.id)}
                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Eliminar cabaña"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Vista de tabla. */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl border border-[#D5DFCA] shadow-2xs overflow-hidden">
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3.5 bg-[#F4F7EE] border-b border-[#D5DFCA] text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider">
                  <div className="col-span-4">Cabaña</div>
                  <div className="col-span-3">Capacidad & Camas</div>
                  <div className="col-span-3">Tarifas COP (Dom-Jue / Vie / Sáb)</div>
                  <div className="col-span-2 text-right">Acciones</div>
                </div>

                <div className="divide-y divide-stone-100">
                  {filteredCabins.map((cabin) => {
                    const photosCount = cabin.imagenesGaleria?.length || (cabin.imagenPrincipal ? 1 : 0);
                    const r = cabin.tarifas || {
                      diaSemana: cabin.precioCOP,
                      viernes: Math.round(cabin.precioCOP * 1.15),
                      finDeSemanaFestivo: Math.round(cabin.precioCOP * 1.25)
                    };
                    const isConfirmingDelete = confirmDeleteId === cabin.id;

                    return (
                      <div
                        key={cabin.id}
                        className="p-4 sm:px-6 sm:py-4 hover:bg-tikkun-brand-cream/70 transition-colors grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
                      >
                        <div className="lg:col-span-4 flex items-center gap-3.5 min-w-0">
                          <div
                            onClick={() => handleOpenEditCabin(cabin)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200 bg-stone-100 cursor-pointer group"
                          >
                            <img
                              src={cabin.imagenPrincipal}
                              alt={cabin.nombre}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1 rounded flex items-center gap-0.5">
                              <ImageIcon className="w-2.5 h-2.5" />
                              <span>{photosCount}</span>
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] text-[#556F48] font-bold block">
                              {cabin.etiquetaNumeroCabana}
                            </span>
                            <h3
                              onClick={() => handleOpenEditCabin(cabin)}
                              className="text-sm font-serif font-bold text-tikkun-brand-deep hover:text-[#2C4623] truncate cursor-pointer"
                            >
                              {cabin.nombre}
                            </h3>
                            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                              {cabin.descripcion}
                            </p>
                          </div>
                        </div>

                        <div className="lg:col-span-3 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 font-semibold text-tikkun-brand-deep">
                            <Users className="w-3.5 h-3.5 text-[#556F48] shrink-0" />
                            <span>Hasta {cabin.capacidad} personas</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-600 truncate">
                            <Bed className="w-3.5 h-3.5 text-[#556F48] shrink-0" />
                            <span className="truncate">{cabin.camas}</span>
                          </div>
                        </div>

                        <div className="lg:col-span-3 grid grid-cols-3 gap-2 text-xs">
                          <div className="p-2 bg-tikkun-brand-cream rounded-xl border border-[#E2EBD8]">
                            <span className="block text-[9px] text-stone-500">Dom-Jue</span>
                            <strong className="text-tikkun-brand-deep font-bold">{formatCOP(r.diaSemana)}</strong>
                          </div>
                          <div className="p-2 bg-tikkun-brand-cream rounded-xl border border-[#E2EBD8]">
                            <span className="block text-[9px] text-stone-500">Viernes</span>
                            <strong className="text-tikkun-brand-deep font-bold">{formatCOP(r.viernes)}</strong>
                          </div>
                          <div className="p-2 bg-[#EFF4E6] rounded-xl border border-[#CCD8B8]">
                            <span className="block text-[9px] text-[#556F48] font-semibold">Sáb/Fest</span>
                            <strong className="text-tikkun-brand-deep font-bold">{formatCOP(r.finDeSemanaFestivo)}</strong>
                          </div>
                        </div>

                        <div className="lg:col-span-2 flex items-center lg:justify-end gap-2">
                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-xl border border-red-200">
                              <button
                                type="button"
                                onClick={() => handleConfirmDeleteCabin(cabin)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                              >
                                Borrar
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEditCabin(cabin)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-tikkun-brand-deep bg-[#EFF4E6] hover:bg-[#DCE7CF] rounded-xl transition-colors cursor-pointer border border-[#CCD8B8]"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#556F48]" />
                                <span>Editar</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(cabin.id)}
                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Eliminar cabaña"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Pestaña 2: portada. */}
        {activeTab === 'landing' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFCA] space-y-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-[#556F48]" />
                    <span>Módulo Portada Hero</span>
                    <span className="text-xs font-sans font-semibold text-[#556F48] px-2.5 py-0.5 rounded-full bg-[#EFF4E6] border border-[#CCD8B8]">
                      {heroImages.length} diapositivas
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Carrusel principal a pantalla completa. La primera foto es la que aparece al abrir la página web.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const previousImages = heroImages;
                      await resetHeroImagesToDefault();
                      const cleanup = await Promise.allSettled(previousImages.map((url) => deleteImageFromCloudinary(url)));
                      if (cleanup.some((result) => result.status === 'rejected')) {
                        showError('La portada se restauró, pero algunas imágenes antiguas siguen en Cloudinary.');
                        return;
                      }
                      showSuccess('Se vació la lista de imágenes de portada.');
                    } catch (error) {
                      showError(error instanceof Error ? error.message : 'No se pudo restaurar la portada.');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Vaciar lista</span>
                </button>
              </div>

              {/* El administrador elige imágenes, revisa la vista previa y confirma la carga a Cloudinary. */}
              <div className="space-y-4">
                <label className={`p-4 bg-tikkun-brand-cream border-2 border-dashed border-[#9FB386] rounded-2xl flex flex-col items-center justify-center gap-2 text-xs sm:text-sm font-bold text-tikkun-brand-deep transition-colors text-center ${isHeroUploading ? 'opacity-70 cursor-wait' : 'hover:border-tikkun-brand-deep cursor-pointer'}`}>
                  <Upload className="w-4 h-4 text-[#556F48]" />
                  <span>{isHeroUploading ? heroUploadStatus : 'Seleccionar imágenes para la portada'}</span>
                  {!isHeroUploading && <span className="font-normal text-stone-500">JPG, PNG o WebP · máximo 20 MB por imagen · hasta 5 por carga</span>}
                  <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleHeroFileSelection} disabled={isHeroUploading} className="hidden" />
                </label>
                {pendingHeroFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {pendingHeroFiles.map(({ file, previewUrl }, index) => (
                        <div key={`${file.name}-${file.lastModified}-${index}`} className="overflow-hidden rounded-xl border border-[#D5DFCA] bg-white">
                          <img src={previewUrl} alt={`Vista previa ${file.name}`} className="h-28 w-full object-cover" />
                          <p className="truncate px-2 py-1.5 text-[10px] text-stone-600" title={file.name}>{file.name}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={handleConfirmHeroUpload} disabled={isHeroUploading} className="inline-flex items-center gap-2 rounded-xl bg-tikkun-brand-deep px-4 py-2.5 text-xs font-bold text-white hover:bg-[#2C4623] disabled:opacity-60">
                        {isHeroUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {isHeroUploading ? heroUploadStatus : `Confirmar subida (${pendingHeroFiles.length})`}
                      </button>
                      <button type="button" onClick={() => setPendingHeroFiles([])} disabled={isHeroUploading} className="rounded-xl px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-60">Cancelar selección</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Imágenes de la portada. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {heroImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border ${
                    idx === 0 ? 'border-tikkun-brand-deep ring-2 ring-tikkun-brand-sage' : 'border-[#D5DFCA]'
                  } overflow-hidden shadow-2xs flex flex-col group`}
                >
                  <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={`Hero ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3">
                      {idx === 0 ? (
                        <span className="bg-tikkun-brand-deep text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          Portada Principal
                        </span>
                      ) : (
                        <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                          Slide #{idx + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-2 bg-tikkun-brand-cream">
                    <div className="flex items-center gap-1.5">
                      <label className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-tikkun-brand-deep bg-[#EFF4E6] hover:bg-[#DCE7CF] rounded-lg border border-[#CCD8B8] transition-colors cursor-pointer">
                        <Upload className="w-3 h-3 text-[#556F48]" />
                        <span>Reemplazar</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplaceSingleHeroImage(idx, e)}
                          className="hidden"
                        />
                      </label>

                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleMakeFirstHeroImage(idx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-stone-700 hover:text-tikkun-brand-deep bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                          <span>Hacer 1ª</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveHeroImage(idx)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar imagen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GALERÍA DE EXPERIENCIAS */}
        {activeTab === 'gallery' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFCA] space-y-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#556F48]" />
                    <span>Módulo Galería de Experiencias</span>
                    <span className="text-xs font-sans font-semibold text-[#556F48] px-2.5 py-0.5 rounded-full bg-[#EFF4E6] border border-[#CCD8B8]">
                      {galleryImages.length} fotos
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Mosaico visual de la página principal donde los huéspedes descubren fogatas, jacuzzi y naturaleza.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const previousImages = galleryImages;
                      await resetGalleryImagesToDefault();
                      const cleanup = await Promise.allSettled(previousImages.map((url) => deleteImageFromCloudinary(url)));
                      if (cleanup.some((result) => result.status === 'rejected')) {
                        showError('La galería se restauró, pero algunas fotos antiguas siguen en Cloudinary.');
                        return;
                      }
                      showSuccess('Se vació la lista de imágenes de galería.');
                    } catch (error) {
                      showError(error instanceof Error ? error.message : 'No se pudo restaurar la galería.');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Vaciar lista</span>
                </button>
              </div>

              {/* Selección y confirmación separadas para revisar las fotos antes de enviarlas. */}
              <div className="space-y-4">
                <label className={`p-4 bg-tikkun-brand-cream border-2 border-dashed border-[#9FB386] hover:border-tikkun-brand-deep rounded-2xl flex flex-col items-center justify-center gap-2 text-xs sm:text-sm font-bold text-tikkun-brand-deep transition-colors text-center ${isGalleryUploading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}>
                  <Upload className="w-4 h-4 text-[#556F48]" />
                  <span>Seleccionar fotos para la galería</span>
                  <span className="font-normal text-stone-500">JPG, PNG o WebP · máximo 20 MB por imagen · hasta 5 por carga</span>
                  <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleGalleryFileSelection} disabled={isGalleryUploading} className="hidden" />
                </label>
                {pendingGalleryFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {pendingGalleryFiles.map(({ file, previewUrl }, index) => (
                        <div key={`${file.name}-${file.lastModified}-${index}`} className="overflow-hidden rounded-xl border border-[#D5DFCA] bg-white">
                          <img src={previewUrl} alt={`Vista previa ${file.name}`} className="h-28 w-full object-cover" />
                          <p className="truncate px-2 py-1.5 text-[10px] text-stone-600" title={file.name}>{file.name}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={handleConfirmGalleryUpload} disabled={isGalleryUploading} className="inline-flex items-center gap-2 rounded-xl bg-tikkun-brand-deep px-4 py-2.5 text-xs font-bold text-white hover:bg-[#2C4623] disabled:opacity-60">
                        {isGalleryUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {isGalleryUploading ? 'Subiendo fotos…' : `Confirmar subida (${pendingGalleryFiles.length})`}
                      </button>
                      <button type="button" onClick={() => setPendingGalleryFiles([])} disabled={isGalleryUploading} className="rounded-xl px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-60">Cancelar selección</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fotografías de la galería. */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border ${
                    idx === 0 ? 'border-tikkun-brand-deep ring-2 ring-tikkun-brand-sage' : 'border-[#D5DFCA]'
                  } overflow-hidden shadow-2xs flex flex-col group`}
                >
                  <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={`Foto Galería ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

                    <div className="absolute top-2.5 left-2.5">
                      {idx === 0 ? (
                        <span className="bg-tikkun-brand-deep text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          Destacada
                        </span>
                      ) : (
                        <span className="bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 flex items-center justify-between gap-1.5 bg-tikkun-brand-cream">
                    <label className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-tikkun-brand-deep bg-[#EFF4E6] hover:bg-[#DCE7CF] rounded-lg border border-[#CCD8B8] transition-colors cursor-pointer">
                      <Upload className="w-2.5 h-2.5 text-[#556F48]" />
                      <span>Cambiar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleReplaceSingleGalleryImage(idx, e)}
                        className="hidden"
                      />
                    </label>

                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleMakeFirstGalleryImage(idx)}
                        className="p-1 text-stone-600 hover:text-tikkun-brand-deep hover:bg-stone-200 rounded-lg text-[10px] cursor-pointer"
                        title="Mover al primer lugar"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESEÑAS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-5 border border-[#D5DFCA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Moderación de reseñas ({adminReviews.filter((review) => review.estado === 'PENDING').length} pendientes · {reviews.length}/15 publicadas)</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Aprueba las reseñas que quieras mostrar. Al aprobar con 15 publicadas, la más antigua se reemplaza automáticamente.
                </p>
              </div>
            </div>

            {isLoadingReviews && <p className="rounded-xl border border-[#D5DFCA] bg-white p-4 text-sm text-stone-500">Cargando reseñas…</p>}
            {!isLoadingReviews && adminReviews.filter((review) => review.estado === 'PENDING').length === 0 && (
              <p className="rounded-xl border border-[#D5DFCA] bg-white p-4 text-sm text-stone-500">No hay reseñas pendientes de aprobación.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminReviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 shadow-2xs ${rev.estado === 'PENDING' ? 'border-amber-300' : 'border-[#D5DFCA]'}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-tikkun-brand-deep">{rev.nombreHuesped}</span>
                        <span className="text-xs text-stone-400"> · {rev.ciudadHuesped}</span>
                      </div>

                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.calificacion }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-[#556F48] font-medium">
                      {rev.nombreCabana || 'Cabaña'} · {rev.tipoViaje} · <span className="text-stone-400">{rev.fecha}</span> · <span className={rev.estado === 'PENDING' ? 'text-amber-700' : 'text-emerald-700'}>{rev.estado === 'PENDING' ? 'Pendiente' : 'Publicada'}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                      "{rev.comentario}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">ID: {rev.id}</span>
                    <div className="flex items-center gap-2">
                      {rev.estado === 'PENDING' && <button type="button" onClick={() => void handleApproveReview(rev.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl cursor-pointer transition-colors"><Check className="w-3.5 h-3.5" /><span>Aprobar</span></button>}
                      <button
                        type="button"
                        onClick={() => void handleDeleteReview(rev.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{rev.estado === 'PENDING' ? 'Rechazar' : 'Retirar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Ventana para crear o editar una cabaña. */}
      <CabinEditorModal
        isOpen={isCabinModalOpen}
        onClose={() => setIsCabinModalOpen(false)}
        cabinToEdit={cabinEditingTarget}
        onSave={handleSaveCabinFromModal}
        nextCabinNumber={nextCabinNumber}
        savedCabins={allAccommodations}
      />
    </div>
  );
};
