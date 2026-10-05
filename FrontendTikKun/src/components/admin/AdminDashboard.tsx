// Administra el catálogo, las imágenes de portada y galería, y las reseñas.
import React, { useState } from 'react';
import { 
  LogOut, Star, Check, RefreshCw,
  Home, Plus, Edit3, Trash2, Users, Bed, Image as ImageIcon, 
  Search, AlertCircle, Upload, Monitor, ArrowUp,
  LayoutGrid, List, CheckCircle2, Settings, DollarSign
} from 'lucide-react';
import { TikkunEmblem } from '../common/TikkunLogo';
import { useAdmin } from '../../context/AdminContext';
import { useReviews } from '../../context/ReviewsContext';
import { Cabana } from '../../types';
import { CabinEditorModal } from './CabinEditorModal';
import { formatCOP } from '../../utils/formatters';
import { compressImageFile, compressMultipleImageFiles } from '../../utils/imageUtils';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const { 
    logout, 
    getEffectiveAccommodations,
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
  } = useAdmin();

  const { reviews, deleteReview } = useReviews();
  const allAccommodations = getEffectiveAccommodations();

  // Pestañas principales de navegación.
  const [activeTab, setActiveTab] = useState<'cabins' | 'landing' | 'gallery' | 'reviews'>('cabins');

  // Modo de visualización de cabañas: cuadrícula o tabla.
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtro de búsqueda.
  const [searchQuery, setSearchQuery] = useState('');

  // Estado de la ventana para crear o editar una cabaña.
  const [isCabinModalOpen, setIsCabinModalOpen] = useState(false);
  const [cabinEditingTarget, setCabinEditingTarget] = useState<Cabana | null>(null);

  // Confirmaciones en línea.
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmResetCabins, setConfirmResetCabins] = useState(false);

  // Campos para ingresar direcciones de imágenes.
  const [heroUrlInput, setHeroUrlInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  // Notificaciones.
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorBannerMsg, setErrorBannerMsg] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorBannerMsg(msg);
    setTimeout(() => setErrorBannerMsg(null), 3500);
  };

  // Indicadores y métricas.
  const totalCapacity = allAccommodations.reduce((acc, c) => acc + (c.capacity || 2), 0);
  const averageWeekdayPrice = allAccommodations.length > 0
    ? Math.round(allAccommodations.reduce((acc, c) => acc + (c.rates?.weekday || c.priceCOP || 0), 0) / allAccommodations.length)
    : 0;

  // Número de la siguiente cabaña.
  const nextCabinNumber = allAccommodations.length > 0 
    ? Math.max(...allAccommodations.map((a) => a.cabinNumber || 0)) + 1
    : 1;

  // Cabañas filtradas.
  const filteredCabins = allAccommodations.filter((cabin) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cabin.name.toLowerCase().includes(q) ||
      cabin.cabinNumberLabel.toLowerCase().includes(q) ||
      cabin.beds.toLowerCase().includes(q)
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

  const handleSaveCabinFromModal = (savedCabin: Cabana) => {
    if (cabinEditingTarget) {
      updateCabin(savedCabin);
      showSuccess(`Cabaña "${savedCabin.name}" actualizada con éxito.`);
    } else {
      addCabin(savedCabin);
      showSuccess(`Nueva cabaña "${savedCabin.name}" creada y publicada con éxito.`);
    }
  };

  const handleConfirmDeleteCabin = (cabin: Cabana) => {
    if (allAccommodations.length <= 1) {
      showError('Debes mantener al menos una cabaña activa en el sitio.');
      setConfirmDeleteId(null);
      return;
    }
    deleteCabin(cabin.id);
    setConfirmDeleteId(null);
    showSuccess(`Cabaña "${cabin.name}" eliminada.`);
  };

  const handleResetAllCabins = () => {
    resetAllCabinsToDefault();
    setConfirmResetCabins(false);
    showSuccess('Se han restaurado las 5 cabañas originales de Casa Tikkun.');
  };

  // --- ACCIONES DE LA PORTADA ---
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    e.target.value = '';

    try {
      const loadedUrls = await compressMultipleImageFiles(fileList);
      if (loadedUrls.length > 0) {
        setHeroImagesList([...heroImages, ...loadedUrls]);
        showSuccess('Imágenes optimizadas y agregadas a la portada (Hero).');
      }
    } catch {
      showError('No se pudo procesar la imagen seleccionada.');
    }
  };

  const handleReplaceSingleHeroImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const result = await compressImageFile(file);
      const updated = [...heroImages];
      updated[idx] = result;
      setHeroImagesList(updated);
      showSuccess(`Imagen #${idx + 1} de la portada reemplazada.`);
    } catch {
      showError('No se pudo reemplazar la imagen.');
    }
  };

  const handleAddHeroUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroUrlInput.trim()) return;
    setHeroImagesList([...heroImages, heroUrlInput.trim()]);
    setHeroUrlInput('');
    showSuccess('Imagen agregada a la portada.');
  };

  const handleRemoveHeroImage = (idx: number) => {
    if (heroImages.length <= 1) {
      showError('El Hero principal debe mantener al menos 1 imagen.');
      return;
    }
    setHeroImagesList(heroImages.filter((_, i) => i !== idx));
    showSuccess('Imagen eliminada de la portada.');
  };

  const handleMakeFirstHeroImage = (idx: number) => {
    if (idx === 0) return;
    const item = heroImages[idx];
    const rest = heroImages.filter((_, i) => i !== idx);
    setHeroImagesList([item, ...rest]);
    showSuccess('Imagen establecida como portada principal.');
  };

  // --- ACCIONES DE LA GALERÍA ---
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    e.target.value = '';

    try {
      const loadedUrls = await compressMultipleImageFiles(fileList);
      if (loadedUrls.length > 0) {
        setGalleryImagesList([...loadedUrls, ...galleryImages]);
        showSuccess('Fotografía(s) agregada(s) a la Galería de Experiencias.');
      }
    } catch {
      showError('No se pudo procesar la fotografía.');
    }
  };

  const handleReplaceSingleGalleryImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const result = await compressImageFile(file);
      const updated = [...galleryImages];
      updated[idx] = result;
      setGalleryImagesList(updated);
      showSuccess(`Fotografía #${idx + 1} de la galería reemplazada.`);
    } catch {
      showError('No se pudo reemplazar la fotografía.');
    }
  };

  const handleAddGalleryUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryUrlInput.trim()) return;
    setGalleryImagesList([galleryUrlInput.trim(), ...galleryImages]);
    setGalleryUrlInput('');
    showSuccess('Fotografía agregada a la Galería.');
  };

  const handleRemoveGalleryImage = (idx: number) => {
    if (galleryImages.length <= 1) {
      showError('La galería debe mantener al menos 1 fotografía.');
      return;
    }
    setGalleryImagesList(galleryImages.filter((_, i) => i !== idx));
    showSuccess('Fotografía eliminada de la Galería.');
  };

  const handleMakeFirstGalleryImage = (idx: number) => {
    if (idx === 0) return;
    const item = galleryImages[idx];
    const rest = galleryImages.filter((_, i) => i !== idx);
    setGalleryImagesList([item, ...rest]);
    showSuccess('Fotografía destacada en el primer lugar.');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-tikkun-brand-deep font-sans pb-24 selection:bg-[#435B48] selection:text-white">
      
      {/* Encabezado fijo del panel administrativo. */}
      <header className="sticky top-0 z-30 bg-tikkun-brand-deep text-white border-b border-[#2C4623] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logotipo e información de marca. */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-tikkun-brand-sage text-tikkun-brand-deep flex items-center justify-center font-bold shadow-sm shrink-0 overflow-hidden p-1 border border-[#CCD8B8]/60">
              <TikkunEmblem size={34} color="#1E311A" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide leading-tight">
                Casa Tikkun · Panel de Administración
              </h1>
              <p className="text-[11px] text-tikkun-brand-sage hidden md:block">
                Santa Elena, Antioquia · Gestión de Cabañas, Tarifas y Contenidos
              </p>
            </div>
          </div>

          {/* Acciones rápidas del encabezado. */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCreateCabin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-tikkun-brand-deep bg-tikkun-brand-sage hover:bg-[#C8D3AE] rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nueva Cabaña</span>
            </button>

            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-tikkun-brand-sage" />
              <span className="hidden sm:inline">Ver Sitio Web</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-200 hover:text-white hover:bg-red-500/20 rounded-xl transition-all cursor-pointer"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal del panel. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Notificaciones generales. */}
        {saveSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-emerald-950 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 stroke-[2.3]" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessMsg(null)}
              className="text-xs text-emerald-700 hover:underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {errorBannerMsg && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-red-900 shadow-xs animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorBannerMsg}</span>
          </div>
        )}

        {/* Tarjetas de resumen e indicadores. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#D5DFCA] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span className="font-medium">Cabañas Activas</span>
              <Users className="w-4 h-4 text-[#556F48]" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-tikkun-brand-deep">
              {allAccommodations.length} <span className="text-xs font-sans font-normal text-stone-500">refugios</span>
            </div>
            <div className="text-[11px] text-[#556F48] font-semibold">
              Hasta {totalCapacity} huéspedes simultáneos
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#D5DFCA] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span className="font-medium">Galería & Portada</span>
              <ImageIcon className="w-4 h-4 text-[#556F48]" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-tikkun-brand-deep">
              {heroImages.length + galleryImages.length} <span className="text-xs font-sans font-normal text-stone-500">fotos</span>
            </div>
            <div className="text-[11px] text-stone-500">
              {heroImages.length} en portada · {galleryImages.length} en galería
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#D5DFCA] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span className="font-medium">Calificación</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-tikkun-brand-deep">
              5.0★
            </div>
            <div className="text-[11px] text-[#556F48] font-semibold">
              {reviews.length} opiniones aprobadas
            </div>
          </div>

        </div>

        {/* Pestañas de navegación. */}
        <div className="bg-white p-1.5 rounded-2xl border border-[#D5DFCA] shadow-2xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            
            <button
              type="button"
              onClick={() => setActiveTab('cabins')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'cabins'
                  ? 'bg-tikkun-brand-deep text-white shadow-2xs'
                  : 'text-stone-600 hover:text-tikkun-brand-deep hover:bg-[#F4F7EE]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Cabañas & Glampings ({allAccommodations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'landing'
                  ? 'bg-tikkun-brand-deep text-white shadow-2xs'
                  : 'text-stone-600 hover:text-tikkun-brand-deep hover:bg-[#F4F7EE]'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Portada Hero ({heroImages.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'bg-tikkun-brand-deep text-white shadow-2xs'
                  : 'text-stone-600 hover:text-tikkun-brand-deep hover:bg-[#F4F7EE]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Galería de Experiencias ({galleryImages.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-tikkun-brand-deep text-white shadow-2xs'
                  : 'text-stone-600 hover:text-tikkun-brand-deep hover:bg-[#F4F7EE]'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reseñas ({reviews.length})</span>
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
                  const photosCount = cabin.galleryImages?.length || (cabin.image ? 1 : 0);
                  const r = cabin.rates || {
                    weekday: cabin.priceCOP,
                    friday: Math.round(cabin.priceCOP * 1.15),
                    weekendHoliday: Math.round(cabin.priceCOP * 1.25)
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
                          src={cabin.image}
                          alt={cabin.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="bg-white/95 backdrop-blur-xs text-tikkun-brand-deep text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-stone-200">
                            {cabin.cabinNumberLabel}
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
                            {cabin.name}
                          </h3>
                        </div>
                      </div>

                      {/* Datos de la cabaña. */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                            {cabin.description}
                          </p>

                          {/* Capacidad y camas. */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-700 pt-1">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-tikkun-brand-deep">
                              <Users className="w-3.5 h-3.5 text-[#556F48]" />
                              <span>Hasta {cabin.capacity} personas</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-stone-600">
                              <Bed className="w-3.5 h-3.5 text-[#556F48]" />
                              <span className="truncate max-w-[160px]">{cabin.beds}</span>
                            </span>
                          </div>

                          {/* Tarifas por noche. */}
                          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-stone-100 text-center">
                            <div className="p-2 bg-tikkun-brand-cream rounded-xl border border-[#E2EBD8]">
                              <span className="block text-[9px] uppercase tracking-wider text-stone-500">Dom-Jue</span>
                              <strong className="text-xs text-tikkun-brand-deep font-bold">{formatCOP(r.weekday)}</strong>
                            </div>
                            <div className="p-2 bg-tikkun-brand-cream rounded-xl border border-[#E2EBD8]">
                              <span className="block text-[9px] uppercase tracking-wider text-stone-500">Viernes</span>
                              <strong className="text-xs text-tikkun-brand-deep font-bold">{formatCOP(r.friday)}</strong>
                            </div>
                            <div className="p-2 bg-[#EFF4E6] rounded-xl border border-[#CCD8B8]">
                              <span className="block text-[9px] uppercase tracking-wider text-[#556F48] font-bold">Sáb/Fest</span>
                              <strong className="text-xs text-tikkun-brand-deep font-bold">{formatCOP(r.weekendHoliday)}</strong>
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
                    const photosCount = cabin.galleryImages?.length || (cabin.image ? 1 : 0);
                    const r = cabin.rates || {
                      weekday: cabin.priceCOP,
                      friday: Math.round(cabin.priceCOP * 1.15),
                      weekendHoliday: Math.round(cabin.priceCOP * 1.25)
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
                              src={cabin.image}
                              alt={cabin.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1 rounded flex items-center gap-0.5">
                              <ImageIcon className="w-2.5 h-2.5" />
                              <span>{photosCount}</span>
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] text-[#556F48] font-bold block">
                              {cabin.cabinNumberLabel}
                            </span>
                            <h3
                              onClick={() => handleOpenEditCabin(cabin)}
                              className="text-sm font-serif font-bold text-tikkun-brand-deep hover:text-[#2C4623] truncate cursor-pointer"
                            >
                              {cabin.name}
                            </h3>
                            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                              {cabin.description}
                            </p>
                          </div>
                        </div>

                        <div className="lg:col-span-3 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 font-semibold text-tikkun-brand-deep">
                            <Users className="w-3.5 h-3.5 text-[#556F48] shrink-0" />
                            <span>Hasta {cabin.capacity} personas</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-600 truncate">
                            <Bed className="w-3.5 h-3.5 text-[#556F48] shrink-0" />
                            <span className="truncate">{cabin.beds}</span>
                          </div>
                        </div>

                        <div className="lg:col-span-3 grid grid-cols-3 gap-2 text-xs">
                          <div className="p-2 bg-tikkun-brand-cream rounded-xl border border-[#E2EBD8]">
                            <span className="block text-[9px] text-stone-500">Dom-Jue</span>
                            <strong className="text-tikkun-brand-deep font-bold">{formatCOP(r.weekday)}</strong>
                          </div>
                          <div className="p-2 bg-tikkun-brand-cream rounded-xl border border-[#E2EBD8]">
                            <span className="block text-[9px] text-stone-500">Viernes</span>
                            <strong className="text-tikkun-brand-deep font-bold">{formatCOP(r.friday)}</strong>
                          </div>
                          <div className="p-2 bg-[#EFF4E6] rounded-xl border border-[#CCD8B8]">
                            <span className="block text-[9px] text-[#556F48] font-semibold">Sáb/Fest</span>
                            <strong className="text-tikkun-brand-deep font-bold">{formatCOP(r.weekendHoliday)}</strong>
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

            {/* Restablecer los datos de las cabañas predeterminadas. */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
              {confirmResetCabins ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-700 font-medium">¿Confirmar restaurar las 5 cabañas estándar iniciales?</span>
                  <button
                    type="button"
                    onClick={handleResetAllCabins}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Sí, restaurar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmResetCabins(false)}
                    className="px-2 py-1 bg-stone-200 text-stone-700 font-medium text-xs rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmResetCabins(true)}
                  className="text-stone-400 hover:text-stone-700 text-[11px] underline underline-offset-4 cursor-pointer self-start sm:self-auto"
                >
                  Restablecer las 5 cabañas originales por defecto
                </button>
              )}
            </div>
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
                  onClick={() => {
                    resetHeroImagesToDefault();
                    showSuccess('Imágenes de portada restablecidas a las originales.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restaurar Originales</span>
                </button>
              </div>

              {/* Cargar una imagen o ingresar su dirección. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="p-4 bg-tikkun-brand-cream border-2 border-dashed border-[#9FB386] hover:border-tikkun-brand-deep rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-tikkun-brand-deep transition-colors cursor-pointer text-center">
                  <Upload className="w-4 h-4 text-[#556F48]" />
                  <span>Subir nueva imagen al Hero desde tu dispositivo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleHeroFileUpload}
                    className="hidden"
                  />
                </label>

                <form onSubmit={handleAddHeroUrl} className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={heroUrlInput}
                    onChange={(e) => setHeroUrlInput(e.target.value)}
                    placeholder="O pega el enlace (URL) de una imagen..."
                    className="flex-1 bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-3 text-xs sm:text-sm text-tikkun-brand-deep focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-tikkun-brand-deep hover:bg-[#2C4623] text-white text-xs font-bold rounded-xl cursor-pointer shrink-0 transition-all shadow-xs"
                  >
                    Agregar
                  </button>
                </form>
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
                  onClick={() => {
                    resetGalleryImagesToDefault();
                    showSuccess('Galería de Experiencias restablecida.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restaurar Originales</span>
                </button>
              </div>

              {/* Cargar una imagen o ingresar su dirección. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="p-4 bg-tikkun-brand-cream border-2 border-dashed border-[#9FB386] hover:border-tikkun-brand-deep rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-tikkun-brand-deep transition-colors cursor-pointer text-center">
                  <Upload className="w-4 h-4 text-[#556F48]" />
                  <span>Subir fotos a la galería desde tu dispositivo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryFileUpload}
                    className="hidden"
                  />
                </label>

                <form onSubmit={handleAddGalleryUrl} className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    placeholder="O pega el enlace (URL) de una foto..."
                    className="flex-1 bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-3 text-xs sm:text-sm text-tikkun-brand-deep focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-tikkun-brand-deep hover:bg-[#2C4623] text-white text-xs font-bold rounded-xl cursor-pointer shrink-0 transition-all shadow-xs"
                  >
                    Agregar
                  </button>
                </form>
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
                  <span>Reseñas de Huéspedes ({reviews.length} / 10 máx.)</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  El sistema mantiene las opiniones más relevantes. Puedes eliminar las no deseadas en cualquier momento.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-5 border border-[#D5DFCA] hover:border-tikkun-brand-deep transition-all flex flex-col justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-tikkun-brand-deep">{rev.guestName}</span>
                        <span className="text-xs text-stone-400"> · {rev.guestCity}</span>
                      </div>

                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-[#556F48] font-medium">
                      {rev.accommodationName || 'Cabaña'} · {rev.travelType} · <span className="text-stone-400">{rev.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">ID: {rev.id}</span>
                    <button
                      type="button"
                      onClick={() => deleteReview(rev.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
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
      />
    </div>
  );
};
