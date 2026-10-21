// Formulario modal para crear o editar los datos de una cabaña.
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Plus, Trash2, Image as ImageIcon, Check, 
  Upload, AlertCircle, Sparkles,
  Bed, Users, DollarSign, Home
} from 'lucide-react';
import { Cabana, ComodidadCabana } from '@/compartido/tipos';
import { formatCOP } from '@/compartido/utilidades/formatters';
import { compressImageFile } from '@/compartido/utilidades/imageUtils';
import { deleteImageFromCloudinary, uploadImageToCloudinary } from '@/compartido/utilidades/cloudinaryService';
import { notificar } from '@/compartido/utilidades/notificaciones';

interface CabinEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabinToEdit?: Cabana | null;
  onSave: (cabin: Cabana) => Promise<unknown>;
  nextCabinNumber: number;
  savedCabins: Cabana[];
}

export const CabinEditorModal: React.FC<CabinEditorModalProps> = ({
  isOpen,
  onClose,
  cabinToEdit,
  onSave,
  nextCabinNumber,
  savedCabins
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
  const popularAmenities = useMemo(() => {
    const catalog = new Map<string, { amenity: ComodidadCabana; count: number }>();
    for (const cabin of savedCabins) {
      const seenInCabin = new Set<string>();
      for (const amenity of cabin.comodidades || []) {
        const label = amenity.etiqueta.trim();
        const key = label.toLocaleLowerCase();
        if (!label || seenInCabin.has(key)) continue;
        seenInCabin.add(key);
        const existing = catalog.get(key);
        catalog.set(key, { amenity: existing?.amenity || amenity, count: (existing?.count || 0) + 1 });
      }
    }
    for (const amenity of selectedAmenities) {
      const label = amenity.etiqueta.trim();
      const key = label.toLocaleLowerCase();
      if (label && !catalog.has(key)) catalog.set(key, { amenity, count: 0 });
    }
    return [...catalog.values()].sort((a, b) => b.count - a.count || a.amenity.etiqueta.localeCompare(b.amenity.etiqueta, 'es'));
  }, [savedCabins, selectedAmenities]);

  // Fotografías.
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const uploadedImages = useRef(new Set<string>());

  const handleClose = () => {
    if (isSaving || isUploadingImages) return;
    const orphanedImages = [...uploadedImages.current];
    uploadedImages.current.clear();
    void Promise.allSettled(orphanedImages.map((url) => deleteImageFromCloudinary(url))).then((results) => {
      if (results.some((result) => result.status === 'rejected')) {
        notificar.error('No se pudieron limpiar algunas fotos que no se guardaron.');
      }
    });
    onClose();
  };

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
      setName('');
      setDescription('');
      setCapacityInput('2');
      setBeds('');
      setWeekdayPriceInput('');
      setFridayPriceInput('');
      setWeekendPriceInput('');
      setFeatures([]);
      setSelectedAmenities([]);
      setGalleryImages([]);
      setErrorMsg(null);
    }
  }, [cabinToEdit, nextCabinNumber, isOpen]);

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
    const key = amenity.etiqueta.trim().toLocaleLowerCase();
    const exists = selectedAmenities.some((a) => a.etiqueta.trim().toLocaleLowerCase() === key);
    if (exists) {
      setSelectedAmenities(selectedAmenities.filter((a) => a.etiqueta.trim().toLocaleLowerCase() !== key));
    } else {
      if (selectedAmenities.length >= 30) {
        setErrorMsg('Cada cabaña puede tener hasta 30 comodidades.');
        return;
      }
      setSelectedAmenities([...selectedAmenities, amenity]);
      setErrorMsg(null);
    }
  };

  const handleAddCustomAmenity = () => {
    const label = customAmenityText.trim();
    if (!label) return;
    if (label.length > 100) {
      setErrorMsg('La comodidad debe tener máximo 100 caracteres.');
      return;
    }
    if (selectedAmenities.some((a) => a.etiqueta.trim().toLocaleLowerCase() === label.toLocaleLowerCase())) {
      setErrorMsg('Esa comodidad ya está seleccionada.');
      return;
    }
    if (selectedAmenities.length >= 30) {
      setErrorMsg('Cada cabaña puede tener hasta 30 comodidades.');
      return;
    }
    setSelectedAmenities([...selectedAmenities, { nombreIcono: 'Sparkles', etiqueta: label }]);
    setCustomAmenityText('');
    setErrorMsg(null);
  };

  // Sube varias fotos juntas y deja que se revisen o quiten antes de guardar la cabaña.
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - galleryImages.length;
    const selectedFiles = Array.from(files);
    e.target.value = '';
    if (remainingSlots <= 0) {
      setErrorMsg('Ya alcanzaste el máximo de 10 fotos.');
      return;
    }

    const filesToProcess = selectedFiles.slice(0, remainingSlots);
    if (selectedFiles.length > remainingSlots) {
      notificar.error(`Solo se subirán ${remainingSlots} foto(s): el máximo por cabaña es 10.`);
    }

    setIsUploadingImages(true);
    setErrorMsg(null);
    let uploadedCount = 0;
    const failures: string[] = [];
    try {
      // Procesa y envía cada archivo de forma secuencial para evitar picos de memoria al elegir muchas fotos.
      for (const [index, file] of filesToProcess.entries()) {
        setUploadStatus(`Preparando foto ${index + 1} de ${filesToProcess.length}…`);
        let compressed: string;
        try {
          compressed = await compressImageFile(file);
        } catch (error) {
          const reason = error instanceof Error ? error.message : 'Error desconocido.';
          failures.push(`${file.name}: ${reason}`);
          continue;
        }

        setUploadStatus(`Subiendo foto ${index + 1} de ${filesToProcess.length}…`);
        try {
          const url = await uploadImageToCloudinary(compressed, 'cabins');
          uploadedImages.current.add(url);
          setGalleryImages((previous) => [...previous, url].slice(0, 10));
          uploadedCount += 1;
        } catch (error) {
          const reason = error instanceof Error ? error.message : 'Error desconocido.';
          failures.push(`${file.name}: ${reason}`);
          // Un error del servicio afecta al lote completo; evita repetir solicitudes fallidas para cada archivo.
          break;
        }
      }

      if (failures.length > 0) {
        const successMessage = uploadedCount > 0 ? `Se subieron ${uploadedCount} foto(s). ` : '';
        const extraFailures = failures.length > 1 ? ` También fallaron ${failures.length - 1} foto(s).` : '';
        const notAttempted = filesToProcess.length - uploadedCount - failures.length;
        const skippedMessage = notAttempted > 0 ? ` No se intentaron las ${notAttempted} fotos restantes por el error de carga.` : '';
        const message = `${successMessage}No se pudo subir ${failures[0]}${extraFailures}${skippedMessage}`;
        setErrorMsg(message);
        notificar.error(message);
      } else if (uploadedCount > 0) {
        notificar.exito(`${uploadedCount} foto(s) lista(s). Puedes quitar las que no quieras antes de guardar.`);
      }
    } finally {
      setUploadStatus('');
      setIsUploadingImages(false);
    }
  };

  const handleRemoveImage = (idx: number) => {
    const removedUrl = galleryImages[idx];
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
    if (uploadedImages.current.delete(removedUrl)) {
      void deleteImageFromCloudinary(removedUrl).catch(() => {
        notificar.error('La foto se quitó del formulario, pero no se pudo borrar de Cloudinary.');
      });
    }
  };

  const handleMakeCoverPhoto = (idx: number) => {
    if (idx === 0) return;
    const item = galleryImages[idx];
    const rest = galleryImages.filter((_, i) => i !== idx);
    setGalleryImages([item, ...rest]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      calificacion: cabinToEdit?.calificacion ?? 0,
      cantidadResenas: cabinToEdit?.cantidadResenas || 0,
      insigniaPopular: cabinToEdit?.insigniaPopular,
      imagenPrincipal: galleryImages[0],
      imagenesGaleria: galleryImages,
      caracteristicas: features,
      comodidades: selectedAmenities
    };

    setIsSaving(true);
    try {
      await onSave(newCabin);
      uploadedImages.current.clear();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar la cabaña.';
      setErrorMsg(message);
      notificar.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={() => { if (!isSaving && !isUploadingImages) handleClose(); }}
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
            onClick={() => { if (!isSaving && !isUploadingImages) handleClose(); }}
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
                    Comodidades guardadas
                  </span>
                  <p className="text-xs text-stone-500">
                    Las más usadas aparecen primero. Las nuevas quedan disponibles al guardar esta cabaña.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {popularAmenities.map(({ amenity, count }) => {
                    const isSelected = selectedAmenities.some((a) => a.etiqueta.trim().toLocaleLowerCase() === amenity.etiqueta.trim().toLocaleLowerCase());
                    return (
                      <button
                        key={amenity.etiqueta.toLocaleLowerCase()}
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
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        </div>
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-tikkun-brand-deep' : 'text-stone-700'}`}>
                          {amenity.etiqueta}
                          {count > 0 && <span className="ml-1 text-[10px] font-medium text-stone-500">· {count} {count === 1 ? 'cabaña' : 'cabañas'}</span>}
                        </span>
                      </button>
                    );
                  })}
                  {popularAmenities.length === 0 && (
                    <p className="col-span-full rounded-xl border border-dashed border-[#CCD8B8] p-4 text-xs text-stone-500">
                      Aún no hay comodidades guardadas. Añade una y publícala para reutilizarla en otras cabañas.
                    </p>
                  )}
                </div>

                {/* Agregar comodidad personalizada. */}
                <div className="pt-3 border-t border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider block">
                    ¿Falta alguna comodidad personalizada?
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={100}
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
                
                {/* Selector múltiple: las fotos quedan en la cuadrícula para revisarlas antes de guardar. */}
                <div className="p-4 bg-[#EFF4E6] rounded-2xl border border-[#CCD8B8] space-y-2">
                  <span className="text-xs font-bold text-tikkun-brand-deep uppercase tracking-wider block">
                    Sube fotos desde tu equipo
                  </span>
                  <label className={`inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-tikkun-brand-deep hover:bg-[#2C4623] text-white font-bold text-xs rounded-xl transition-colors shadow-xs ${isUploadingImages || galleryImages.length >= 10 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingImages ? uploadStatus : 'Seleccionar varias fotografías'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      disabled={isUploadingImages || galleryImages.length >= 10}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-stone-600">JPG, PNG o WebP · hasta 10 fotos. Revísalas y elimina las que no quieras antes de publicar.</p>
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
                      Todavía no hay fotos. Puedes seleccionar varias desde tu equipo.
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
                  <span>{isUploadingImages ? 'Esperando a que terminen de subir las fotos…' : 'Revisa las fotos y guarda la cabaña cuando estés listo'}</span>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving || isUploadingImages}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isUploadingImages}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-tikkun-brand-deep hover:bg-[#2C4623] text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-wait"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSaving ? 'Guardando…' : isEditing ? 'Guardar Cambios' : 'Publicar Cabaña'}</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
