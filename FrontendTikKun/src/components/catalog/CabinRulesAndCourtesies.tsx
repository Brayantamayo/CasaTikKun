import React, { useState } from 'react';
import { 
  VolumeX, CreditCard, Clock, CalendarClock, 
  FileCheck, Dog, Car, Coffee, Leaf, 
  Egg, Droplets, Sparkles, Popcorn, 
  Key, MapPin, ChevronRight, HelpCircle
} from 'lucide-react';
import { ReglaCabana, ElementoCortesia, EspecificacionesCabana } from '../../types';
import { TIKKUN_RULES, TIKKUN_COURTESIES, TIKKUN_SPECIFICATIONS, TIKKUN_CONTACT } from '../../data/tikkunData';

interface CabinRulesAndCourtesiesProps {
  cabinName?: string;
  cabinNumberLabel?: string;
  rules?: ReglaCabana[];
  courtesies?: ElementoCortesia[];
  specifications?: EspecificacionesCabana;
}

export const CabinRulesAndCourtesies: React.FC<CabinRulesAndCourtesiesProps> = ({
  rules = TIKKUN_RULES,
  courtesies = TIKKUN_COURTESIES,
  specifications = TIKKUN_SPECIFICATIONS
}) => {
  const [activeTab, setActiveTab] = useState<'cortesias' | 'horarios' | 'reglas'>('cortesias');

  const renderCourtesyIcon = (iconName: string) => {
    const iconClass = "w-4 h-4 text-[#3E5C31]";
    switch (iconName.toLowerCase()) {
      case 'cafe':
      case 'coffee':
        return <Coffee className={iconClass} />;
      case 'aromaticas':
      case 'leaf':
        return <Leaf className={iconClass} />;
      case 'huevos':
      case 'egg':
        return <Egg className={iconClass} />;
      case 'aguas':
      case 'droplets':
        return <Droplets className={iconClass} />;
      case 'sal':
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      case 'maiz':
      case 'maiz-crispetas':
      case 'popcorn':
        return <Popcorn className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const renderRuleIcon = (iconName: string) => {
    const iconClass = "w-4 h-4 text-[#3E5C31] shrink-0";
    switch (iconName.toLowerCase()) {
      case 'volumex':
      case 'volume-x':
        return <VolumeX className={iconClass} />;
      case 'creditcard':
      case 'credit-card':
        return <CreditCard className={iconClass} />;
      case 'clock':
        return <Clock className={iconClass} />;
      case 'calendarclock':
      case 'calendar-clock':
        return <CalendarClock className={iconClass} />;
      case 'filecheck':
      case 'file-check':
        return <FileCheck className={iconClass} />;
      case 'dog':
        return <Dog className={iconClass} />;
      case 'car':
        return <Car className={iconClass} />;
      default:
        return <HelpCircle className={iconClass} />;
    }
  };

  const handleOpenWhatsAppTransport = () => {
    const text = encodeURIComponent('Hola Casa Tikkun, quisiera consultar sobre el servicio de transporte para mi reserva en Santa Elena.');
    window.open(`https://wa.me/${TIKKUN_CONTACT.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D5DFCA] p-4 sm:p-5 shadow-2xs space-y-3.5">
      {/* Header with Title and Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#E3EBD7]">
        <div>
          <span className="text-[10px] font-bold text-[#557048] uppercase tracking-wider block">
            Información General Casa Tikkun
          </span>
          <h4 className="text-sm sm:text-base font-serif font-bold text-[#1E311A]">
            Cortesías, Horarios y Reglas
          </h4>
        </div>

        {/* Compact Segmented Control */}
        <div className="flex items-center gap-1 bg-[#EFF4E6] p-1 rounded-xl border border-[#CCD8B8]/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('cortesias')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'cortesias'
                ? 'bg-[#1E311A] text-white shadow-2xs'
                : 'text-[#3E5C31] hover:text-[#1E311A] hover:bg-white/60'
            }`}
          >
            Cortesías ({courtesies.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('horarios')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'horarios'
                ? 'bg-[#1E311A] text-white shadow-2xs'
                : 'text-[#3E5C31] hover:text-[#1E311A] hover:bg-white/60'
            }`}
          >
            Horarios
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reglas')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'reglas'
                ? 'bg-[#1E311A] text-white shadow-2xs'
                : 'text-[#3E5C31] hover:text-[#1E311A] hover:bg-white/60'
            }`}
          >
            Reglas ({rules.length})
          </button>
        </div>
      </div>

      {/* TAB 1: CORTESÍAS DE BIENVENIDA */}
      {activeTab === 'cortesias' && (
        <div className="space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-[#4A643E]">
            <p>Incluido sin costo adicional en todas nuestras cabañas para tu estadía:</p>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#355029] bg-[#EFF4E6] px-2 py-0.5 rounded-md">
              100% Cortesía
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {courtesies.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#CCD8B8] flex items-center gap-2 hover:bg-[#F2F6EC] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EFF4E6] flex items-center justify-center shrink-0">
                  {renderCourtesyIcon(item.iconName)}
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[#1E311A] truncate">{item.name}</span>
                  <span className="block text-[10px] text-stone-500 truncate">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HORARIOS Y ESPECIFICACIONES */}
      {activeTab === 'horarios' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-in fade-in duration-200">
          <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#CCD8B8] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E311A]">
              <Clock className="w-3.5 h-3.5 text-[#557048]" />
              <span>Llegada (Check-in)</span>
            </div>
            <p className="text-sm font-serif font-bold text-[#1E311A]">{specifications.checkIn}</p>
            <p className="text-[10.5px] text-stone-500 leading-tight">Entrega de cabaña a partir de las 3:00 PM</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#CCD8B8] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E311A]">
              <Clock className="w-3.5 h-3.5 text-[#557048]" />
              <span>Salida (Check-out)</span>
            </div>
            <p className="text-sm font-serif font-bold text-[#1E311A]">{specifications.checkOut}</p>
            <p className="text-[10.5px] text-stone-500 leading-tight">Entrega hasta el mediodía (12:00 M)</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#CCD8B8] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E311A]">
              <Key className="w-3.5 h-3.5 text-[#557048]" />
              <span>Self Check-in</span>
            </div>
            <p className="text-xs font-semibold text-[#1E311A]">Instrucciones Claras</p>
            <p className="text-[10.5px] text-stone-500 leading-tight">Envío de clave de acceso luego de la reserva</p>
          </div>

          <div className="sm:col-span-3 p-2.5 rounded-xl bg-[#EFF4E6] border border-[#CCD8B8] flex items-center justify-between text-xs text-[#2F4925]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#557048] shrink-0" />
              <span><strong>Ubicación:</strong> {specifications.location} ({specifications.distance})</span>
            </div>
            <span className="text-[10.5px] font-semibold text-[#3E5C31]">Vía pavimentada</span>
          </div>
        </div>
      )}

      {/* TAB 3: REGLAS GENERALES DE CONVIVENCIA */}
      {activeTab === 'reglas' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {rules.map((rule) => {
              const isTransport = rule.actionType === 'whatsapp_transport';
              return (
                <div
                  key={rule.id}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                    rule.highlight
                      ? 'bg-[#F9FAF4] border-[#CCD8B8]'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="mt-0.5">{renderRuleIcon(rule.iconName)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[#1E311A] text-xs">{rule.title}</span>
                    </div>
                    <p className="text-[11px] text-[#47603B] leading-snug mt-0.5">{rule.description}</p>
                    {isTransport && (
                      <button
                        type="button"
                        onClick={handleOpenWhatsAppTransport}
                        className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-bold text-[#204018] bg-[#EFF4E6] hover:bg-[#DEE8CF] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        <span>Solicitar transporte por WhatsApp</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
