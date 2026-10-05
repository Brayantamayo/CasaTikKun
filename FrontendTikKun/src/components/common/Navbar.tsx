// Gestiona la navegación adaptable, el acceso a reservas y el menú móvil.
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, MessageCircle, Calendar
} from 'lucide-react';
import { TikkunLogo, TikkunEmblem } from './TikkunLogo';
import { TIKKUN_CONTACT } from '../../data/tikkunData';

interface NavbarProps {
  onOpenBookingModal: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenGuestGuide?: (tab?: 'especificaciones' | 'cortesia' | 'reglas') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBookingModal,
  activeSection,
  onNavigate
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'comodidades', label: 'Comodidades' },
    { id: 'conocenos', label: 'Nosotros' },
    { id: 'catalogo', label: 'Cabañas' },
    { id: 'galeria', label: 'Galería' },
    { id: 'resenas', label: 'Opiniones' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'faq', label: 'Preguntas' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
      
      {/* Navegación que cambia de disposición al desplazarse:
        - Mantiene fielmente el color Verde Salvia insignia de Casa Tikkun (#B6C29A) tanto arriba como al bajar.
        - Arriba: Encabezado amplio tradicional a todo lo ancho con logo completo y accesos directos.
        - Al empezar a bajar (scroll > 40px): Se reorganiza en una cápsula flotante compacta, 
          con el emblema circular, enlaces en cápsulas segmentadas y botón destacado de Reservar.
      */}
      <div 
        className={`pointer-events-auto transition-all duration-300 ease-out ${
          isScrolled 
            ? 'px-3 sm:px-6 pt-2.5 pb-1' 
            : 'px-0 pt-0 pb-0'
        }`}
      >
        <div 
          className={`transition-all duration-300 ease-out ${
            isScrolled
              ? 'max-w-5xl mx-auto rounded-full bg-tikkun-brand-sage/95 backdrop-blur-md border border-[#A4B188] shadow-[0_10px_30px_rgba(30,49,26,0.18)] px-4 sm:px-6 py-1.5'
              : 'w-full bg-tikkun-brand-sage/95 backdrop-blur-md border-b border-[#A2AF84]/80 shadow-2xs px-4 sm:px-6 lg:px-8 py-2'
          }`}
        >
          <div 
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? 'h-11 sm:h-12' : 'h-14 sm:h-16'
            }`}
          >
            
            {/* Logotipo o emblema de la marca. */}
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('inicio');
              }}
              className="flex items-center gap-2.5 focus:outline-hidden shrink-0 transition-transform active:scale-95"
              aria-label="Ir al inicio de Casa Tikkun"
            >
              {isScrolled ? (
                /* Emblema circular y nombre de la marca al desplazarse. */
                <div className="flex items-center gap-2.5 animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-full bg-tikkun-brand-cream flex items-center justify-center p-1 shadow-xs border border-[#A2AF84]/50">
                    <TikkunEmblem size={22} color="#1E311A" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-tikkun-brand-deep text-sm tracking-wide leading-none">
                      Casa Tikkun
                    </span>
                    <span className="text-[9px] font-semibold tracking-wider text-[#2D4428] uppercase leading-none mt-0.5 hidden sm:inline">
                      Santa Elena
                    </span>
                  </div>
                </div>
              ) : (
                /* Logotipo completo al inicio de la página. */
                <TikkunLogo 
                  variant="on-sage" 
                  size="sm"
                  className="transform scale-95 sm:scale-100 origin-left"
                />
              )}
            </a>

            {/* Navegación de escritorio. */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navItems.map((item) => {
                const isSelected = activeSection === item.id;
                
                if (isScrolled) {
                  /* Enlaces compactos al desplazarse. */
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.id)}
                      className={`relative px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-tikkun-brand-deep text-tikkun-brand-cream shadow-xs font-bold'
                          : 'text-tikkun-brand-deep/85 hover:text-tikkun-brand-deep hover:bg-[#A8B68C]'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                }

                /* Estilo de enlaces en la parte superior. */
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className={`relative px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'text-[#0E1E0B] font-bold'
                        : 'text-tikkun-brand-deep/85 hover:text-[#0E1E0B]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && (
                      <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-tikkun-brand-deep rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Acciones de contacto y reserva. */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Contacto directo por WhatsApp en escritorio. */}
              <a
                href={`https://wa.me/${TIKKUN_CONTACT.whatsappNumber}?text=${encodeURIComponent('Hola Casa Tikkun, quisiera consultar información sobre disponibilidad.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-tikkun-brand-deep transition-all ${
                  isScrolled
                    ? 'hover:bg-[#A8B68C] border border-[#A2AF84]/50'
                    : 'hover:bg-[#A8B68C]'
                }`}
                aria-label="Contactar por WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-tikkun-brand-deep" />
                <span className="font-semibold">WhatsApp</span>
              </a>

              {/* Acceso directo a la reserva. */}
              <button
                type="button"
                onClick={onOpenBookingModal}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-bold text-white bg-tikkun-brand-deep hover:bg-[#2C4623] rounded-full transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 ${
                  isScrolled ? 'shadow-sm ring-1 ring-tikkun-brand-deep/20' : ''
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-tikkun-brand-sage" />
                <span>Reservar</span>
              </button>

              {/* Control del menú móvil. */}
              <div className="flex lg:hidden items-center ml-1">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 rounded-full text-tikkun-brand-deep bg-[#A8B68C]/50 hover:bg-[#A8B68C] transition-all cursor-pointer"
                  aria-label="Alternar menú de navegación"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.2]" /> : <Menu className="w-5 h-5 stroke-[2.2]" />}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Menú de navegación móvil. */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden px-4 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-tikkun-brand-cream border border-[#D6DFC7] rounded-3xl shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2EBD8]">
              <div className="flex items-center gap-2">
                <TikkunEmblem size={24} color="#1E311A" />
                <span className="font-serif font-bold text-tikkun-brand-deep text-sm">Casa Tikkun</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const isSelected = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-tikkun-brand-deep text-white shadow-xs'
                        : 'text-tikkun-brand-deep hover:bg-[#E3ECD5] bg-white border border-[#E2EBD8]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-tikkun-brand-deep hover:bg-[#2C4623] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <Calendar className="w-4 h-4 text-tikkun-brand-sage" />
              <span>Consultar Disponibilidad</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
