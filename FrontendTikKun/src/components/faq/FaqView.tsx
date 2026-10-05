import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, ChevronUp, Search, MessageCircle, 
  ArrowLeft, Calendar, HelpCircle, Sparkles, ShieldCheck, 
  MapPin, Coffee, Waves, Heart, CheckCircle2 
} from 'lucide-react';
import { FAQS, TIKKUN_CONTACT } from '../../data/tikkunData';

interface FaqViewProps {
  onBackToHome: () => void;
  onOpenBookingModal: () => void;
}

export const FaqView: React.FC<FaqViewProps> = ({
  onBackToHome,
  onOpenBookingModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: 'todos', label: 'Todas las preguntas' },
    { id: 'alojamiento', label: 'Cabañas & Chimenea' },
    { id: 'servicios', label: 'Alimentación & Desayuno' },
    { id: 'politicas', label: 'Mascotas & Políticas' },
    { id: 'ubicacion', label: 'Llegada & Clima' },
  ];

  // Extended and enriched list of FAQs
  const allFaqs = useMemo(() => {
    const base = [...FAQS];
    
    // Add additional practical FAQs for this dedicated view
    const extraFaqs = [
      {
        question: '¿A qué distancia queda Casa Tikkun de Medellín y cómo es la carretera?',
        answer: 'Estamos ubicados en Santa Elena KM 6, a tan solo 35 minutos de Medellín. Todo el trayecto es carretera pavimentada en excelente estado y el acceso es apto y cómodo para cualquier tipo de automóvil particular o taxi.',
        category: 'ubicacion'
      },
      {
        question: '¿Qué clima hace en Santa Elena y qué ropa recomiendan llevar?',
        answer: 'Santa Elena tiene un clima de montaña fresco y acogedor. Durante el día la temperatura suele estar entre 18°C y 22°C con sol suave, y en las noches baja a entre 12°C y 16°C con niebla andina. Te recomendamos traer abrigo, suéter, ropa cómoda y calzado para caminar si deseas explorar los senderos.',
        category: 'ubicacion'
      },
      {
        question: '¿Las cabañas cuentan con chimenea de leña y cobijas térmicas?',
        answer: 'Sí. Cada una de las 5 cabañas cuenta con chimenea de leña tradicional con provisión de leña seca de roble incluida, cobijas térmicas afelpadas y fogatero exterior para disfrutar del frío y la niebla de Santa Elena.',
        category: 'alojamiento'
      },
      {
        question: '¿Cómo funciona el proceso de reserva directa por WhatsApp?',
        answer: 'Es muy sencillo y seguro: seleccionas tu cabaña y fechas preferidas, y te ponemos en contacto directo con el anfitrión por WhatsApp. Verificamos la disponibilidad en tiempo real, te compartimos fotos y videos si lo deseas, y coordinas el anticipo mediante transferencia bancaria (Bancolombia, Nequi, etc.) sin comisiones de intermediarios.',
        category: 'alojamiento'
      },
      {
        question: '¿Qué incluye el desayuno campesino?',
        answer: 'Todas las estadías incluyen desayuno típico preparado con ingredientes locales frescos de Santa Elena: café recién colado, arepa de choclo caliente, quesito fresco de finca, huevos al gusto y fruta de temporada.',
        category: 'servicios'
      },
      {
        question: '¿Son Pet Friendly (aceptan mascotas)?',
        answer: '¡Sí! En Casa Tikkun amamos a los animales. Tus perritos o gatitos son bienvenidos con previo aviso al momento de reservar para coordinar los detalles de su estadía en el entorno natural.',
        category: 'politicas'
      }
    ];

    // Combine avoiding exact duplicates
    const combined = [...base];
    extraFaqs.forEach((extra) => {
      if (!combined.some(f => f.question.toLowerCase() === extra.question.toLowerCase())) {
        combined.push(extra);
      }
    });

    return combined;
  }, []);

  // Filter by category and search term
  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      const matchesCategory = selectedCategory === 'todos' || faq.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allFaqs, selectedCategory, searchQuery]);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-24 sm:pt-28 pb-20">
      
      {/* Top Breadcrumb & Back Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2F4726] hover:text-[#142310] transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#E8EFE0] group-hover:bg-[#D7E3CB] flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#1E311A] group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Volver al inicio de Casa Tikkun</span>
        </button>
      </div>

      {/* Main Header Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5ECD8] border border-[#CAD9B7] text-[#243B1D] text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-[#4E6E3D]" />
          <span>Centro de Ayuda & Preguntas Frecuentes</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1E311A] tracking-tight [text-wrap:balance]">
          Todo lo que necesitas saber antes de tu viaje
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed [text-wrap:balance]">
          Resolvemos tus dudas sobre reservas, jacuzzis climatizados a 38°C, clima en Santa Elena, mascotas y cómo llegar desde Medellín.
        </p>

        {/* Live Search Input */}
        <div className="mt-6 max-w-lg mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por palabra (ej. jacuzzi, mascotas, clima, comida...)"
            className="w-full bg-white border border-stone-200/90 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#3B5430]/20 focus:border-[#2D4523] shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E311A] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-[#F2ECE1] hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* FAQs List Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 mb-12 sm:mb-16">
        
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-sm text-stone-500">
              No encontramos preguntas que coincidan con &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('todos'); }}
              className="mt-3 text-xs font-semibold text-[#1E311A] underline underline-offset-4 cursor-pointer"
            >
              Ver todas las preguntas
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                >
                  <span className="text-sm sm:text-base font-serif font-bold text-[#1E311A] leading-snug">
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    isOpen ? 'bg-[#1E311A] text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4 stroke-[2.2]" /> : <ChevronDown className="w-4 h-4 stroke-[2.2]" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 mt-1 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}

      </div>

      {/* Direct WhatsApp Contact Card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#EDF2E4] rounded-3xl p-6 sm:p-8 border border-[#CAD8B5] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          
          <div className="text-center sm:text-left space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F5B32] uppercase tracking-wider">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              ¿Tienes alguna pregunta especial?
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1E311A]">
              Habla directamente con nuestro anfitrión
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md">
              Escríbenos por WhatsApp para resolver cualquier duda sobre tu llegada, decoración para aniversarios o solicitudes personalizadas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href={`https://wa.me/${TIKKUN_CONTACT.whatsappNumber}?text=${encodeURIComponent('Hola Casa Tikkun, tengo una pregunta antes de realizar mi reserva.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20BD5A] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chatear por WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={onOpenBookingModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E311A] hover:bg-[#122210] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#B6C29A]" />
              <span>Reservar Cabaña</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
