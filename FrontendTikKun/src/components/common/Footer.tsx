// Reúne la identidad de marca, los enlaces, el contacto y los accesos a cabañas.
import React from 'react';
import { MapPin, Phone, Mail, Instagram, Lock } from 'lucide-react';
import { TikkunLogo } from './TikkunLogo';
import { TIKKUN_CONTACT } from '../../data/tikkunData';
import { useAdmin } from '../../context/AdminContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBookingModal: () => void;
  onOpenAdmin?: () => void;
  onViewCabin?: (cabinId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBookingModal,
  onOpenAdmin,
  onViewCabin
}) => {
  const { getEffectiveAccommodations } = useAdmin();
  const allAccommodations = getEffectiveAccommodations();

  return (
    <footer className="bg-[#142018] text-[#DCE5D9] border-t border-[#233528] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#25392B]">
          
          {/* Información de marca. */}
          <div className="lg:col-span-4 space-y-4">
            <TikkunLogo variant="light" size="lg" />
            <p className="text-xs sm:text-sm text-[#A9BAA5] leading-relaxed max-w-sm mt-3">
              Cabañas boutique & Chalets Campestres en Santa Elena, Antioquia. 
              Un espacio consagrado al descanso consciente, aire puro de montaña y reconexión con la naturaleza.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#95A891]">
              <MapPin className="w-3.5 h-3.5 text-[#86B47F]" />
              <span>{TIKKUN_CONTACT.location}</span>
            </div>
          </div>

          {/* Enlaces de navegación. */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F2F6F0]">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('conocenos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Conócenos & Filosofía
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('catalogo')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Nuestras {allAccommodations.length} Cabañas & Chalets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('galeria')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Galería de Experiencias
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('resenas')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Opiniones & Reseñas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('ubicacion')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ubicación & Contacto
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Preguntas Frecuentes (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Accesos a las cabañas disponibles. */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F2F6F0]">
              Nuestras Cabañas
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A9BAA5]">
              {allAccommodations.map((cabin) => (
                <li key={cabin.id}>
                  <button
                    type="button"
                    onClick={() => (onViewCabin ? onViewCabin(cabin.id) : onNavigate('catalogo'))}
                    className="hover:text-white transition-colors text-left truncate max-w-full cursor-pointer"
                  >
                    {cabin.name}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  type="button"
                  onClick={onOpenBookingModal}
                  className="text-xs text-tikkun-brand-sage hover:text-white font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Consultar por WhatsApp
                </button>
              </li>
            </ul>
          </div>

          {/* Datos de contacto. */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F2F6F0]">
              Información de contacto
            </h4>
            <div className="space-y-2 text-xs text-[#A9BAA5]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#86B47F]" />
                <a href={`mailto:${TIKKUN_CONTACT.email}`} className="hover:text-white">
                  {TIKKUN_CONTACT.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#86B47F]" />
                <a href={`tel:${TIKKUN_CONTACT.phone}`} className="hover:text-white">
                  Celular: {TIKKUN_CONTACT.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#86B47F]" />
                <span>{TIKKUN_CONTACT.address}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Instagram className="w-3.5 h-3.5 text-[#86B47F]" />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  {TIKKUN_CONTACT.instagram}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenBookingModal}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-tikkun-brand-deep bg-tikkun-brand-sage hover:bg-[#C6D2AB] rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <span>Reservar por WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

        {/* Derechos de autor y acceso administrativo. */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7F937C]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Casa Tikkun - Cabañas & Chalets Campestres. Todos los derechos reservados.</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                title="Acceso administrativo secreto (o presiona Ctrl + Shift + A)"
                className="opacity-20 hover:opacity-100 text-[#A9BAA5] hover:text-tikkun-brand-sage transition-opacity cursor-pointer p-1 rounded inline-flex items-center"
                aria-label="Acceso secreto de administración"
              >
                <Lock className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>RNT Registro Nacional de Turismo Verificado</span>
            <span aria-hidden="true">·</span>
            <span>Santa Elena, Antioquia KM 6</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
