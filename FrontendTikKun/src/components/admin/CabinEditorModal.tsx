// Permite crear y editar los datos, tarifas, comodidades y fotografías de una cabaña.
import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Image as ImageIcon, Check, 
  Upload, AlertCircle, Sparkles, Calculator,
  Bed, Users, DollarSign, Home
} from 'lucide-react';
import { Cabana, ComodidadCabana } from '../../types';
import { formatCOP } from '../../utils/formatters';
import { compressMultipleImageFiles } from '../../utils/imageUtils';

// Fotografías de alta calidad disponibles en los recursos locales.
import heroGlamping from '../../assets/images/hero_glamping_dome_1790614291764.jpg';
import cabanaMirador from '../../assets/images/cabana_mirador_tikkun_1790783983488.jpg';
import cabinLuxury from '../../assets/images/cabin_alpina_luxury_1790614303472.jpg';
import deckMalla from '../../assets/images/deck_malla_glamping_1790784044690.jpg';
import campfireNight from '../../assets/images/campfire_starlit_night_1790614323241.jpg';
import interiorBedroom from '../../assets/images/interior_bedroom_glamping_1790784033539.jpg';
import jacuzziSunset from '../../assets/images/jacuzzi_sunset_nature_1790614313395.jpg';

const PRESET_GALLERY_IMAGES = [
  { label: 'Cabaña Alpina Luxury', url: cabinLuxury },
  { label: 'Cabaña Mirador Pinos', url: cabanaMirador },
  { label: 'Deck Malla Catamarán', url: deckMalla },
  { label: 'Domo Glamping Noche', url: heroGlamping },
  { label: 'Habitación King Interior', url: interiorBedroom },
  { label: 'Fogata Nocturna Estrellas', url: campfireNight },
  { label: 'Jacuzzi Atardecer Bosque', url: jacuzziSunset }
];

const PRESET_AMENITIES = [
  { iconName: 'Eye', label: 'Mirador a los Pinos' },
  { iconName: 'Flame', label: 'Chimenea de Leña' },
  { iconName: 'Coffee', label: 'Desayuno Campesino' },
  { iconName: 'Wifi', label: 'Starlink Wi-Fi' },
  { iconName: 'Sparkles', label: 'Baño de Lujo' },
  { iconName: 'Heart', label: 'Ideal Parejas' },
  { iconName: 'Users', label: 'Familiar & Amigos' },
  { iconName: 'Utensils', label: 'Cocina Equipada' },
  { iconName: 'Music', label: 'Audio Marshall' },
  { iconName: 'Flame', label: 'Fogatero Privado' },
  { iconName: 'Car', label: 'Parqueadero Privado' }
];

const SUGGESTED_TEMPLATES = [
  {
    name: 'Refugio Mirador de Orión',
    description: 'Cabaña alpina de madera nativa con ventanal panorámico de 180° hacia el bosque de niebla en Santa Elena. Cuenta con chimenea tradicional de leña, cama king con lencería térmica de 400 hilos, terraza privada volada con malla catamarán y kit de café selecto colombiano.',
    capacity: 2,
    beds: '1 Cama King + Malla Catamarán exterior',
    weekday: 340000,
    friday: 390000,
    weekend: 430000,
    features: [
      'Malla catamarán suspendida sobre el bosque de pinos',
      'Chimenea de leña tradicional con carga incluida',
      'Desayuno campesino artesanal servido en la cabaña',
      'Copa de vino de bienvenida y fogata privada al atardecer'
    ],
    amenities: ['Mirador a los Pinos', 'Chimenea de Leña', 'Desayuno Campesino', 'Starlink Wi-Fi', 'Audio Marshall', 'Fogatero Privado']
  },
  {
    name: 'Santuario Bosque de Niebla',
    description: 'Exclusivo refugio campestre rodeado de cipreses centenarios y jardines de orquídeas en Santa Elena. Equipado con estufa escandinava, tina de inmersión con vista al bosque, cocina campestre equipada y espacio de fogata íntima bajo las estrellas.',
    capacity: 4,
    beds: '1 Cama King + 1 Cama Semidoble en altillo',
    weekday: 390000,
    friday: 450000,
    weekend: 495000,
    features: [
      'Terraza en madera teca con vista al atardecer',
      'Estufa de leña tradicional y calefacción ambiental',
      'Cocina campestre completa con cafetera de émbolo',
      'Wi-Fi Starlink de alta velocidad para descanso o trabajo'
    ],
    amenities: ['Mirador a los Pinos', 'Chimenea de Leña', 'Cocina Equipada', 'Starlink Wi-Fi', 'Familiar & Amigos', 'Parqueadero Privado']
  }
];

interface CabinEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabinToEdit?: Cabana | null;
  onSave: (cabin: Cabana) => void;
  nextCabinNumber: number;
}

export const CabinEditorModal: React.FC<CabinEditorModalProps> = ({
  isOpen,
  onClose,
  cabinToEdit,
  onSave,
  nextCabinNumber
}) => {
  const isEditing = Boolean(cabinToEdit);

  // Estado del formulario.
  const [cabinNumberInput, setCabinNumberInput] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Especificaciones.
  const [capacityInput, setCapacityInput] = useState<string>('');
  const [beds, setBeds] = useState<string>('');

  // Tarifas.
  const [weekdayPriceInput, setWeekdayPriceInput] = useState<string>('');
  const [fridayPriceInput, setFridayPriceInput] = useState<string>('');
  const [weekendPriceInput, setWeekendPriceInput] = useState<string>('');

  // Servicios destacados.
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState<string>('');

  // Comodidades.
  const [selectedAmenities, setSelectedAmenities] = useState<ComodidadCabana[]>([]);
  const [customAmenityText, setCustomAmenityText] = useState<string>('');

  // Fotografías.
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Navegación entre los pasos del editor.
  const [editorTab, setEditorTab] = useState<'general' | 'rates' | 'amenities' | 'photos'>('general');

  // Restablecer o inicializar el formulario al abrir la ventana.
  useEffect(() => {
    if (cabinToEdit) {
      setCabinNumberInput(String(cabinToEdit.cabinNumber || nextCabinNumber));
      setName(cabinToEdit.name || '');
      setDescription(cabinToEdit.description || '');
      setCapacityInput(String(cabinToEdit.capacity || 2));
      setBeds(cabinToEdit.beds || '');

      const r = cabinToEdit.rates || {
        weekday: cabinToEdit.priceCOP,
        friday: Math.round(cabinToEdit.priceCOP * 1.15),
        weekendHoliday: Math.round(cabinToEdit.priceCOP * 1.25)
      };
      setWeekdayPriceInput(String(r.weekday));
      setFridayPriceInput(String(r.friday));
      setWeekendPriceInput(String(r.weekendHoliday));

      setFeatures(cabinToEdit.features || []);
      setSelectedAmenities(cabinToEdit.amenities || []);

      const imgs = cabinToEdit.galleryImages && cabinToEdit.galleryImages.length > 0
        ? cabinToEdit.galleryImages
        : cabinToEdit.image
          ? [cabinToEdit.image]
          : [];
      setGalleryImages(imgs);
    } else {
      setCabinNumberInput(String(nextCabinNumber));
      setName('');
      setDescription('');
      setCapacityInput('2');
      setBeds('');
      setWeekdayPriceInput('');
      setFridayPriceInput('');
      setWeekendPriceInput('');
      setFeatures([]);
      setNewFeatureText('');
      setSelectedAmenities([]);
      setCustomAmenityText('');
      setGalleryImages([]);
      setUrlInput('');
    }
    setEditorTab('general');
    setErrorMsg(null);
  }, [cabinToEdit, nextCabinNumber, isOpen]);

  if (!isOpen) return null;

  // Plantilla rápida para agilizar el llenado del formulario.
  const handleLoadTemplate = () => {
    const template = SUGGESTED_TEMPLATES[Math.floor(Math.random() * SUGGESTED_TEMPLATES.length)];
    setName(template.name);
    setDescription(template.description);
    setCapacityInput(String(template.capacity));
    setBeds(template.beds);
    setWeekdayPriceInput(String(template.weekday));
    setFridayPriceInput(String(template.friday));
    setWeekendPriceInput(String(template.weekend));
    setFeatures(template.features);

    const matchedAmenities: ComodidadCabana[] = PRESET_AMENITIES
      .filter((a) => template.amenities.includes(a.label))
      .map((a) => ({ iconName: a.iconName, label: a.label }));
    setSelectedAmenities(matchedAmenities);

    if (galleryImages.length === 0) {
      setGalleryImages([cabanaMirador, interiorBedroom, campfireNight]);
    }
  };

  // Calculadora de tarifas.
  const handleAutoCalculateRates = () => {
    const base = parseInt(weekdayPriceInput, 10);
    if (!base || isNaN(base) || base <= 0) {
      setErrorMsg('Ingresa primero la tarifa de Domingo a Jueves para calcular las demás.');
      return;
    }
    // Redondear al múltiplo de 5.000 COP más cercano.
    const fri = Math.round((base * 1.15) / 5000) * 5000;
    const weekend = Math.round((base * 1.25) / 5000) * 5000;
    setFridayPriceInput(String(fri));
    setWeekendPriceInput(String(weekend));
    setErrorMsg(null);
  };

  // Acciones para administrar los servicios destacados.
  const handleAddFeature = (text?: string) => {
    const toAdd = (text || newFeatureText).trim();
    if (toAdd && !features.includes(toAdd)) {
      setFeatures([...features, toAdd]);
      if (!text) setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Acciones para administrar las comodidades.
  const toggleAmenity = (amenity: ComodidadCabana) => {
    const exists = selectedAmenities.some((a) => a.label === amenity.label);
    if (exists) {
      setSelectedAmenities(selectedAmenities.filter((a) => a.label !== amenity.label));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddCustomAmenity = () => {
    const label = customAmenityText.trim();
    if (label && !selectedAmenities.some((a) => a.label.toLowerCase() === label.toLowerCase())) {
      setSelectedAmenities([...selectedAmenities, { iconName: 'Sparkles', label }]);
      setCustomAmenityText('');
    }
  };

  // Acciones para administrar las fotografías.
  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return;
    if (galleryImages.length >= 10) {
      setErrorMsg('Máximo 10 fotos por cabaña.');
      return;
    }
    setGalleryImages([...galleryImages, urlInput.trim()]);
    setUrlInput('');
  };

  const handleSelectPresetImage = (url: string) => {
    if (galleryImages.length >= 10) {
      setErrorMsg('Máximo 10 fotos por cabaña.');
      return;
    }
    if (!galleryImages.includes(url)) {
      setGalleryImages([...galleryImages, url]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - galleryImages.length;
    if (remainingSlots <= 0) {
      setErrorMsg('Ya alcanzaste el máximo de 10 fotos.');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    e.target.value = '';

    try {
      const compressed = await compressMultipleImageFiles(filesToProcess);
      setGalleryImages((prev) => [...prev, ...compressed].slice(0, 10));
    } catch {
      setErrorMsg('No se pudo procesar una o más fotos.');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  const handleMakeCoverPhoto = (idx: number) => {
    if (idx === 0) return;
    const item = galleryImages[idx];
    const rest = galleryImages.filter((_, i) => i !== idx);
    setGalleryImages([item, ...rest]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsedCabinNumber = parseInt(cabinNumberInput, 10) || nextCabinNumber;
    const parsedWeekday = parseInt(weekdayPriceInput, 10) || 0;
    const parsedFriday = parseInt(fridayPriceInput, 10) || 0;
    const parsedWeekend = parseInt(weekendPriceInput, 10) || 0;
    const parsedCapacity = parseInt(capacityInput, 10) || 2;

    if (!name.trim()) {
      setErrorMsg('Por favor ingresa el nombre de la cabaña.');
      setEditorTab('general');
      return;
    }

    if (parsedWeekday <= 0 || parsedFriday <= 0 || parsedWeekend <= 0) {
      setErrorMsg('Por favor ingresa las 3 tarifas por noche.');
      setEditorTab('rates');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Por favor ingresa la descripción de la cabaña.');
      setEditorTab('general');
      return;
    }

    if (!beds.trim()) {
      setErrorMsg('Por favor indica la acomodación o tipo de camas.');
      setEditorTab('general');
      return;
    }

    if (galleryImages.length === 0) {
      setErrorMsg('Por favor agrega al menos 1 foto para la cabaña.');
      setEditorTab('photos');
      return;
    }

    const id = cabinToEdit
      ? cabinToEdit.id
      : `cabana-${parsedCabinNumber}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;

    const cabinNumberLabel = `Cabaña ${parsedCabinNumber}`;

    const newCabin: Cabana = {
      ...(cabinToEdit || {}),
      id,
      cabinNumber: parsedCabinNumber,
      cabinNumberLabel,
      name: name.trim(),
      type: cabinToEdit?.type || 'cabana',
      tagline: cabinToEdit?.tagline || '',
      description: description.trim(),
      capacity: parsedCapacity,
      beds: beds.trim(),
      bathrooms: cabinToEdit?.bathrooms || 1,
      sizeM2: cabinToEdit?.sizeM2 || 0,
      priceCOP: parsedWeekday,
      priceUSD: Math.round(parsedWeekday / 4000),
      rates: {
        weekday: parsedWeekday,
        friday: parsedFriday,
        weekendHoliday: parsedWeekend
      },
      rating: cabinToEdit?.rating || 5.0,
      reviewsCount: cabinToEdit?.reviewsCount || 0,
      popularBadge: cabinToEdit?.popularBadge,
      image: galleryImages[0],
      galleryImages,
      features,
      amenities: selectedAmenities
    };

    onSave(newCabin);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-4xl bg-white text-tikkun-brand-deep rounded-3xl shadow-2xl border border-[#D5DFCA] overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado del editor. */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-tikkun-brand-deep text-white border-b border-[#2C4623]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-tikkun-brand-sage text-tikkun-brand-deep flex items-center justify-center shrink-0 shadow-sm">
              <Home className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide leading-tight">
                {isEditing ? `Editar · ${cabinToEdit?.name}` : 'Crear Nueva Cabaña'}
              </h3>
              <p className="text-xs text-tikkun-brand-sage">
                Casa Tikkun · Santa Elena, Antioquia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={handleLoadTemplate}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Carga datos de ejemplo para editar más rápido"
              >
                <Sparkles className="w-3.5 h-3.5 text-tikkun-brand-sage" />
                <span>Cargar Plantilla</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pestañas de navegación del editor. */}
        <div className="flex items-center gap-1.5 px-6 pt-3.5 pb-2.5 border-b border-[#E2EBD8] bg-tikkun-brand-cream text-xs font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setEditorTab('general')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              editorTab === 'general'
                ? 'bg-tikkun-brand-deep text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-tikkun-brand-deep hover:bg-[#EFF4E6]'
            }`}
          >
            <span>1. Información General</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorTab('rates')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              editorTab === 'rates'
                ? 'bg-tikkun-brand-deep text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-tikkun-brand-deep hover:bg-[#EFF4E6]'
            }`}
          >
            <span>2. Tarifas por Noche</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorTab('amenities')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              editorTab === 'amenities'
                ? 'bg-tikkun-brand-deep text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-tikkun-brand-deep hover:bg-[#EFF4E6]'
            }`}
          >
            <span>3. Comodidades & Destacados ({features.length + selectedAmenities.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorTab('photos')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              editorTab === 'photos'
                ? 'bg-tikkun-brand-deep text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-tikkun-brand-deep hover:bg-[#EFF4E6]'
            }`}
          >
            <span>4. Fotos ({galleryImages.length})</span>
          </button>
        </div>

        {/* Contenido desplazable del formulario. */}
        <div className="overflow-y-auto p-6 sm:p-7 flex-1 space-y-6 bg-white">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="cabin-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* TAB 1: INFORMACIÓN GENERAL */}
            {editorTab === 'general' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-tikkun-brand-deep mb-1.5">
                      Número de Cabaña *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#556F48] font-bold">#</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={cabinNumberInput}
                        onChange={(e) => setCabinNumberInput(e.target.value)}
                        placeholder="Ej. 6"
                        className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl pl-8 pr-3.5 py-2.5 text-xs sm:text-sm text-tikkun-brand-deep focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-tikkun-brand-deep mb-1.5">
                      Nombre de la Cabaña *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Cabaña Mirador del Bosque"
                      className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-tikkun-brand-deep focus:outline-hidden font-medium"
                    />
                  </div>
                </div>

                {/* Capacidad y camas. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className=" text-xs font-semibold text-tikkun-brand-deep mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#556F48]" />
                      <span>Capacidad Máxima (Huéspedes) *</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      required
                      value={capacityInput}
                      onChange={(e) => setCapacityInput(e.target.value)}
                      placeholder="Ej. 2"
                      className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-tikkun-brand-deep focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className=" text-xs font-semibold text-tikkun-brand-deep mb-1.5 flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-[#556F48]" />
                      <span>Acomodación y Camas *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      placeholder="Ej. 1 Cama King + Malla catamarán"
                      className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-tikkun-brand-deep focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Descripción. */}
                <div>
                  <label className="block text-xs font-semibold text-tikkun-brand-deep mb-1.5">
                    Descripción del Refugio *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe la experiencia de descanso, la vista a los pinos, chimenea y detalles especiales..."
                    className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl p-3.5 text-xs sm:text-sm text-tikkun-brand-deep focus:outline-hidden leading-relaxed resize-none"
                  />
                  <span className="text-[11px] text-stone-500 block mt-1">
                    Esta descripción es la que verán los huéspedes al ingresar al detalle de la cabaña.
                  </span>
                </div>
              </div>
            )}

            {/* Pestaña 2: tarifas por noche. */}
            {editorTab === 'rates' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-4 bg-[#EFF4E6] border border-[#CCD8B8] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-tikkun-brand-deep flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-[#556F48]" />
                      Calculadora de Tarifas Recomendadas
                    </span>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      Ingresa el valor entre semana y calcula automáticamente las tarifas de fin de semana y festivos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoCalculateRates}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-tikkun-brand-deep hover:bg-[#2C4623] text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-all shadow-xs"
                  >
                    <span>Calcular (+15% / +25%)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-tikkun-brand-cream rounded-2xl border border-[#D5DFCA] space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#556F48] font-bold block">
                      Domingo a Jueves *
                    </span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-bold">$</span>
                      <input
                        type="number"
                        min="50000"
                        step="5000"
                        required
                        value={weekdayPriceInput}
                        onChange={(e) => setWeekdayPriceInput(e.target.value)}
                        placeholder="280000"
                        className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm text-tikkun-brand-deep font-bold focus:outline-hidden"
                      />
                    </div>
                    <span className="text-[10.5px] text-stone-500 block">
                      {weekdayPriceInput ? `${formatCOP(Number(weekdayPriceInput))} COP` : 'Tarifa base regular'}
                    </span>
                  </div>

                  <div className="p-4 bg-tikkun-brand-cream rounded-2xl border border-[#D5DFCA] space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#556F48] font-bold block">
                      Viernes *
                    </span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-bold">$</span>
                      <input
                        type="number"
                        min="50000"
                        step="5000"
                        required
                        value={fridayPriceInput}
                        onChange={(e) => setFridayPriceInput(e.target.value)}
                        placeholder="320000"
                        className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm text-tikkun-brand-deep font-bold focus:outline-hidden"
                      />
                    </div>
                    <span className="text-[10.5px] text-stone-500 block">
                      {fridayPriceInput ? `${formatCOP(Number(fridayPriceInput))} COP` : 'Aprox. +15%'}
                    </span>
                  </div>

                  <div className="p-4 bg-tikkun-brand-cream rounded-2xl border border-[#D5DFCA] space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#556F48] font-bold block">
                      Sábados / Festivos *
                    </span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-bold">$</span>
                      <input
                        type="number"
                        min="50000"
                        step="5000"
                        required
                        value={weekendPriceInput}
                        onChange={(e) => setWeekendPriceInput(e.target.value)}
                        placeholder="350000"
                        className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm text-tikkun-brand-deep font-bold focus:outline-hidden"
                      />
                    </div>
                    <span className="text-[10.5px] text-stone-500 block">
                      {weekendPriceInput ? `${formatCOP(Number(weekendPriceInput))} COP` : 'Aprox. +25%'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña 3: comodidades y servicios destacados. */}
            {editorTab === 'amenities' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Servicios destacados. */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider">
                      Puntos Clave Destacados ({features.length})
                    </label>
                    <span className="text-[11px] text-stone-500">Aparecen en la tarjeta y en la ficha</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="Ej. Tina de hidromasaje privada con vista a los pinos"
                      className="flex-1 bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2 text-xs sm:text-sm text-tikkun-brand-deep focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFeature()}
                      className="px-3.5 py-2 bg-tikkun-brand-deep hover:bg-[#2C4623] text-white text-xs font-bold rounded-xl cursor-pointer shrink-0 transition-colors"
                    >
                      Añadir
                    </button>
                  </div>

                  {features.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 p-2.5 bg-tikkun-brand-cream rounded-xl border border-[#E2EBD8] text-xs text-tikkun-brand-deep"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#556F48] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="text-stone-400 hover:text-red-600 p-1 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comodidades disponibles. */}
                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider">
                      Comodidades de la Cabaña ({selectedAmenities.length} seleccionadas)
                    </label>
                    <span className="text-[11px] text-stone-500">Toca para marcar o desmarcar</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {PRESET_AMENITIES.map((amenity, idx) => {
                      const isSelected = selectedAmenities.some((a) => a.label === amenity.label);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-tikkun-brand-deep text-white font-bold shadow-xs'
                              : 'bg-[#F4F7EE] text-[#2C4623] hover:bg-[#E6EDDD] border border-[#CCD8B8]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{amenity.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Campo para agregar una comodidad personalizada. */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={customAmenityText}
                      onChange={(e) => setCustomAmenityText(e.target.value)}
                      placeholder="O escribe otra comodidad personalizada..."
                      className="flex-1 bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-1.5 text-xs text-tikkun-brand-deep focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="px-3 py-1.5 bg-[#EFF4E6] hover:bg-[#DCE7CF] text-tikkun-brand-deep text-xs font-semibold rounded-xl cursor-pointer shrink-0 border border-[#CCD8B8]"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña 4: fotografías y galería. */}
            {editorTab === 'photos' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Cargar fotografías o ingresar sus direcciones. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="p-4 bg-tikkun-brand-cream border-2 border-dashed border-[#9FB386] hover:border-tikkun-brand-deep rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-tikkun-brand-deep cursor-pointer transition-colors text-center">
                    <Upload className="w-4 h-4 text-[#556F48] shrink-0" />
                    <span>Subir fotos desde tu dispositivo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="O pega el enlace de una foto..."
                      className="flex-1 bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-3 text-xs text-tikkun-brand-deep focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3.5 py-3 bg-tikkun-brand-deep text-white font-bold text-xs rounded-xl cursor-pointer shrink-0 hover:bg-[#2C4623] transition-colors"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                {/* Fotografías sugeridas. */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                    Fotografías Sugeridas de Casa Tikkun (Haz clic para agregar)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {PRESET_GALLERY_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPresetImage(preset.url)}
                        className="group relative aspect-4/3 rounded-xl overflow-hidden border border-[#D5DFCA] hover:border-tikkun-brand-deep transition-colors cursor-pointer bg-stone-100 text-left"
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white transition-opacity p-1 text-center">
                          + Agregar
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lista de fotografías seleccionadas. */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider">
                      Fotos de esta cabaña ({galleryImages.length} / 10 máx.)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      La primera foto es la portada principal
                    </span>
                  </div>

                  {galleryImages.length === 0 ? (
                    <div className="p-8 text-center bg-tikkun-brand-cream rounded-2xl border border-[#CCD8B8] text-stone-500 text-xs">
                      No has agregado fotos todavía. Sube una foto o selecciona una sugerida arriba.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative aspect-4/3 rounded-2xl overflow-hidden border ${
                            idx === 0 ? 'border-tikkun-brand-deep ring-2 ring-tikkun-brand-sage' : 'border-stone-200'
                          } bg-stone-100 group shadow-2xs`}
                        >
                          <img
                            src={img}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {idx === 0 && (
                            <span className="absolute top-2 left-2 bg-tikkun-brand-deep text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                              Portada
                            </span>
                          )}

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleMakeCoverPhoto(idx)}
                                className="px-2 py-1 bg-white/30 hover:bg-white/50 text-white text-[10px] font-semibold rounded-lg cursor-pointer transition-colors"
                              >
                                Portada
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg cursor-pointer transition-colors"
                              title="Eliminar foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Acciones del editor. */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-500">
                {editorTab !== 'photos' ? (
                  <span>Revisa las pestañas para completar los datos</span>
                ) : (
                  <span>Listo para guardar la cabaña</span>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-tikkun-brand-deep hover:bg-[#2C4623] text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isEditing ? 'Guardar Cambios' : 'Publicar Cabaña'}</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
