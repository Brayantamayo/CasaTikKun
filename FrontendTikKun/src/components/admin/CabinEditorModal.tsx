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

const PRESET_AMENITIES: ComodidadCabana[] = [
  { nombreIcono: 'Eye', etiqueta: 'Mirador a los Pinos' },
  { nombreIcono: 'Flame', etiqueta: 'Chimenea de Leña' },
  { nombreIcono: 'Coffee', etiqueta: 'Desayuno Campesino' },
  { nombreIcono: 'Wifi', etiqueta: 'Starlink Wi-Fi' },
  { nombreIcono: 'Sparkles', etiqueta: 'Baño de Lujo' },
  { nombreIcono: 'Heart', etiqueta: 'Ideal Parejas' },
  { nombreIcono: 'Users', etiqueta: 'Familiar & Amigos' },
  { nombreIcono: 'Utensils', etiqueta: 'Cocina Equipada' },
  { nombreIcono: 'Music', etiqueta: 'Audio Marshall' },
  { nombreIcono: 'Flame', etiqueta: 'Fogatero Privado' },
  { nombreIcono: 'Car', etiqueta: 'Parqueadero Privado' }
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
      setCabinNumberInput(String(cabinToEdit.numeroCabana || nextCabinNumber));
      setName(cabinToEdit.nombre || '');
      setDescription(cabinToEdit.descripcion || '');
      setCapacityInput(String(cabinToEdit.capacidad || 2));
      setBeds(cabinToEdit.camas || '');

      const r = cabinToEdit.tarifas || {
        diaSemana: cabinToEdit.precioCOP,
        viernes: Math.round(cabinToEdit.precioCOP * 1.15),
        finDeSemanaFestivo: Math.round(cabinToEdit.precioCOP * 1.25)
      };
      setWeekdayPriceInput(String(r.diaSemana));
      setFridayPriceInput(String(r.viernes));
      setWeekendPriceInput(String(r.finDeSemanaFestivo));

      setFeatures(cabinToEdit.caracteristicas || []);
      setSelectedAmenities(cabinToEdit.comodidades || []);

      const imgs = cabinToEdit.imagenesGaleria && cabinToEdit.imagenesGaleria.length > 0
        ? cabinToEdit.imagenesGaleria
        : [cabinToEdit.imagenPrincipal];
      setGalleryImages(imgs);
      setErrorMsg(null);
    } else {
      setCabinNumberInput(String(nextCabinNumber));
      setName(`Cabaña ${nextCabinNumber}`);
      setDescription('');
      setCapacityInput('2');
      setBeds('1 Cama King Size');
      setWeekdayPriceInput('380000');
      setFridayPriceInput('440000');
      setWeekendPriceInput('480000');
      setFeatures([
        'Chimenea de leña tradicional con provisión incluida',
        'Terraza mirador privada con vista a los pinos',
        'Desayuno campesino artesanal servido al despertar',
        'Copa de vino de bienvenida & fogata nocturna'
      ]);
      setSelectedAmenities([
        PRESET_AMENITIES[0],
        PRESET_AMENITIES[1],
        PRESET_AMENITIES[2],
        PRESET_AMENITIES[3]
      ]);
      setGalleryImages([cabinLuxury]);
      setErrorMsg(null);
    }
  }, [cabinToEdit, nextCabinNumber, isOpen]);

  const handleApplyTemplate = (tmpl: typeof SUGGESTED_TEMPLATES[0]) => {
    setName(tmpl.name);
    setDescription(tmpl.description);
    setCapacityInput(String(tmpl.capacity));
    setBeds(tmpl.beds);
    setWeekdayPriceInput(String(tmpl.weekday));
    setFridayPriceInput(String(tmpl.friday));
    setWeekendPriceInput(String(tmpl.weekend));
    setFeatures(tmpl.features);

    const matched = PRESET_AMENITIES.filter((a) => tmpl.amenities.includes(a.etiqueta));
    setSelectedAmenities(matched);
  };

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
    const exists = selectedAmenities.some((a) => a.etiqueta === amenity.etiqueta);
    if (exists) {
      setSelectedAmenities(selectedAmenities.filter((a) => a.etiqueta !== amenity.etiqueta));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddCustomAmenity = () => {
    const label = customAmenityText.trim();
    if (label && !selectedAmenities.some((a) => a.etiqueta.toLowerCase() === label.toLowerCase())) {
      setSelectedAmenities([...selectedAmenities, { nombreIcono: 'Sparkles', etiqueta: label }]);
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
      numeroCabana: parsedCabinNumber,
      etiquetaNumeroCabana: cabinNumberLabel,
      nombre: name.trim(),
      tipo: cabinToEdit?.tipo || 'cabana',
      subtitulo: cabinToEdit?.subtitulo || '',
      descripcion: description.trim(),
      capacidad: parsedCapacity,
      camas: beds.trim(),
      banos: cabinToEdit?.banos || 1,
      tamanoM2: cabinToEdit?.tamanoM2 || 0,
      precioCOP: parsedWeekday,
      precioUSD: Math.round(parsedWeekday / 4000),
      tarifas: {
        diaSemana: parsedWeekday,
        viernes: parsedFriday,
        finDeSemanaFestivo: parsedWeekend
      },
      calificacion: cabinToEdit?.calificacion || 5.0,
      cantidadResenas: cabinToEdit?.cantidadResenas || 0,
      insigniaPopular: cabinToEdit?.insigniaPopular,
      imagenPrincipal: galleryImages[0],
      imagenesGaleria: galleryImages,
      caracteristicas: features,
      comodidades: selectedAmenities
    };

    onSave(newCabin);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 my-auto overflow-hidden max-h-[92vh] flex flex-col font-sans"
      >
        {/* Encabezado. */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-100 bg-[#F9F7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFECE2] text-tikkun-brand-deep flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-tikkun-brand-deep" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-tikkun-brand-deep">
                {isEditing ? `Editar Cabaña: ${cabinToEdit?.nombre}` : 'Agregar Nueva Cabaña'}
              </h3>
              <p className="text-xs text-stone-500">
                Configura tarifas por noche, comodidades, capacidad y galería de fotos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Pestañas de navegación interna. */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setEditorTab('general')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              editorTab === 'general'
                ? 'border-tikkun-brand-deep text-tikkun-brand-deep bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Información General
          </button>

          <button
            type="button"
            onClick={() => setEditorTab('rates')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              editorTab === 'rates'
                ? 'border-tikkun-brand-deep text-tikkun-brand-deep bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Tarifas por Noche
          </button>

          <button
            type="button"
            onClick={() => setEditorTab('amenities')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              editorTab === 'amenities'
                ? 'border-tikkun-brand-deep text-tikkun-brand-deep bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. Comodidades ({selectedAmenities.length})
          </button>

          <button
            type="button"
            onClick={() => setEditorTab('photos')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              editorTab === 'photos'
                ? 'border-tikkun-brand-deep text-tikkun-brand-deep bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            4. Fotografías ({galleryImages.length})
          </button>
        </div>

        {/* Mensaje de error si falta algún campo. */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Contenido del editor. */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Pestaña 1: Información General. */}
            {editorTab === 'general' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                
                {/* Plantillas sugeridas para agilizar la creación. */}
                {!isEditing && (
                  <div className="bg-[#EFF4E6] p-4 rounded-2xl border border-[#CCD8B8] space-y-2">
                    <span className="text-[11px] font-bold text-[#3B5430] uppercase tracking-wider block">
                      Plantillas Rápidas (Haz clic para autocompletar)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SUGGESTED_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyTemplate(tmpl)}
                          className="p-2.5 bg-white hover:bg-stone-50 rounded-xl border border-[#CCD8B8] text-left transition-colors cursor-pointer group"
                        >
                          <span className="block text-xs font-bold text-tikkun-brand-deep group-hover:text-[#2C4623]">
                            {tmpl.name}
                          </span>
                          <span className="block text-[11px] text-stone-500 truncate">
                            Hasta {tmpl.capacity} personas · {tmpl.beds}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                      Número de Cabaña
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={cabinNumberInput}
                      onChange={(e) => setCabinNumberInput(e.target.value)}
                      className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2.5 text-xs text-tikkun-brand-deep font-bold focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                      Nombre de la Cabaña *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Cabaña 6 · Shalom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-tikkun-brand-deep font-bold focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                      Capacidad Máxima de Huéspedes *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={12}
                      value={capacityInput}
                      onChange={(e) => setCapacityInput(e.target.value)}
                      className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2.5 text-xs text-tikkun-brand-deep font-semibold focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                      Acomodación / Camas *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 1 Cama King Size + 1 Sofá Cama Queen"
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2.5 text-xs text-tikkun-brand-deep font-semibold focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider mb-1">
                    Descripción Completa *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe los ventanales, la chimenea de leña, el balcón mirador y la atmósfera de descanso..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-2xl p-3.5 text-xs sm:text-sm text-tikkun-brand-deep leading-relaxed focus:outline-hidden resize-none"
                  />
                </div>

                {/* Lista de servicios destacados. */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <label className="block text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider">
                    Servicios y Atributos Destacados
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Terraza privada con malla catamarán"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      className="flex-1 bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-xs text-tikkun-brand-deep focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFeature()}
                      className="px-3.5 py-2 bg-tikkun-brand-deep text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#2C4623] transition-colors"
                    >
                      Añadir
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-tikkun-brand-cream border border-[#CCD8B8] text-xs text-[#2A3F23]"
                      >
                        <span className="truncate pr-2">• {feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Pestaña 2: Tarifas por Noche. */}
            {editorTab === 'rates' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                
                <div className="bg-[#EFF4E6] p-4 rounded-2xl border border-[#CCD8B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-tikkun-brand-deep block">
                      Cálculo Automático de Tarifas
                    </span>
                    <span className="text-[11px] text-stone-600">
                      Calcula +15% para Viernes y +25% para Sábados/Festivos
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoCalculateRates}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-tikkun-brand-deep text-white text-xs font-bold hover:bg-[#2C4623] transition-colors cursor-pointer shrink-0"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Autocalcular Viernes & Festivos</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-tikkun-brand-cream border border-[#CCD8B8] space-y-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#557048]">
                      Domingo a Jueves (COP) *
                    </span>
                    <input
                      type="number"
                      required
                      step={5000}
                      value={weekdayPriceInput}
                      onChange={(e) => setWeekdayPriceInput(e.target.value)}
                      className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-base font-serif font-bold text-tikkun-brand-deep focus:outline-hidden"
                    />
                    <span className="block text-[10.5px] text-stone-500">
                      Tarifa estándar entre semana: {formatCOP(parseInt(weekdayPriceInput, 10) || 0)}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-tikkun-brand-cream border border-[#CCD8B8] space-y-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#7A5C29]">
                      Noche de Viernes (COP) *
                    </span>
                    <input
                      type="number"
                      required
                      step={5000}
                      value={fridayPriceInput}
                      onChange={(e) => setFridayPriceInput(e.target.value)}
                      className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-base font-serif font-bold text-tikkun-brand-deep focus:outline-hidden"
                    />
                    <span className="block text-[10.5px] text-stone-500">
                      Inicio de fin de semana: {formatCOP(parseInt(fridayPriceInput, 10) || 0)}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#EFF4E6] border border-[#CCD8B8] space-y-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-tikkun-brand-deep">
                      Sáb, Dom & Festivos (COP) *
                    </span>
                    <input
                      type="number"
                      required
                      step={5000}
                      value={weekendPriceInput}
                      onChange={(e) => setWeekendPriceInput(e.target.value)}
                      className="w-full bg-white border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-base font-serif font-bold text-tikkun-brand-deep focus:outline-hidden"
                    />
                    <span className="block text-[10.5px] text-stone-500">
                      Puentes y fin de semana: {formatCOP(parseInt(weekendPriceInput, 10) || 0)}
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Pestaña 3: Comodidades. */}
            {editorTab === 'amenities' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <span className="text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider block mb-1">
                    Selecciona las comodidades de esta cabaña
                  </span>
                  <p className="text-xs text-stone-500">
                    Se mostrarán en la tarjeta del catálogo y en la vista detallada
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_AMENITIES.map((amenity, idx) => {
                    const isSelected = selectedAmenities.some((a) => a.etiqueta === amenity.etiqueta);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#EFF4E6] border-tikkun-brand-deep shadow-2xs'
                            : 'bg-tikkun-brand-cream border-[#CCD8B8] hover:bg-stone-50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-tikkun-brand-deep border-tikkun-brand-deep text-white'
                              : 'bg-white border-stone-300 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-tikkun-brand-deep' : 'text-stone-700'}`}>
                          {amenity.etiqueta}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Agregar comodidad personalizada. */}
                <div className="pt-3 border-t border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider block">
                    ¿Falta alguna comodidad personalizada?
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Tina hidromasaje nórdica"
                      value={customAmenityText}
                      onChange={(e) => setCustomAmenityText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomAmenity();
                        }
                      }}
                      className="flex-1 bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3 py-2 text-xs text-tikkun-brand-deep focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="px-3.5 py-2 bg-tikkun-brand-deep text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-[#2C4623] transition-colors"
                    >
                      Añadir Comodidad
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Pestaña 4: Fotografías. */}
            {editorTab === 'photos' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                
                {/* Cargar archivos locales o ingresar una dirección URL. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#EFF4E6] rounded-2xl border border-[#CCD8B8] space-y-2">
                    <span className="text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider block">
                      Subir fotos desde tu equipo
                    </span>
                    <label className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-tikkun-brand-deep hover:bg-[#2C4623] text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>Seleccionar fotografías (PNG, JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="p-4 bg-tikkun-brand-cream rounded-2xl border border-[#CCD8B8] space-y-2">
                    <span className="text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider block">
                      O ingresar dirección web / URL
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
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
