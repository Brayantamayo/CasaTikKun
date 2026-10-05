import React from 'react';
import { MapPin, Navigation, Car, Bus, PhoneCall, Mail, Smartphone, Clock, ExternalLink, Compass } from 'lucide-react';
import { TIKKUN_CONTACT } from '../../data/tikkunData';

export const LocationSection: React.FC = () => {
  return (
    <section id="ubicacion" className="py-24 bg-[#FAF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-block px-3 py-1 bg-[#B6C29A] text-[#1E311A] text-xs font-bold uppercase tracking-widest rounded-md mb-2">
            Ubicación & Contacto
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1E311A] tracking-tight [text-wrap:balance]">
            Encuéntranos en Santa Elena, Antioquia
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#465E3C] leading-relaxed">
            Situado en el corazón del bosque de Santa Elena, KM 6, a solo 35 minutos de Medellín. Un paraíso de niebla, pinos y aire frío de montaña.
          </p>
        </div>

        {/* 
          Main Grid: 
          Col 1: Información de Contacto (Matching user screenshot) + Ruta Guide
          Col 2: Google Maps View (Prepared for Google Maps API)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* Left Column: Contact Card + Transportation Guide */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. INFORMACIÓN DE CONTACTO CARD (Exact layout from user screenshot) */}
            <div className="bg-[#FAF8F2] rounded-3xl p-6 sm:p-7 border-2 border-[#B6C29A] shadow-md">
              <h3 className="text-xl font-serif font-bold text-[#1E311A] mb-5 pb-3 border-b border-[#D6DFC7]">
                Información de contacto
              </h3>

              <div className="space-y-4 text-sm text-[#253A20]">
                
                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EAEFD9] text-[#1E311A] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#637C55]">
                      Correo Electrónico
                    </span>
                    <a
                      href="mailto:info@casatikkun.com"
                      className="font-semibold text-[#1E311A] hover:underline transition-colors"
                    >
                      info@casatikkun.com
                    </a>
                  </div>
                </div>

                {/* Celular / Teléfono */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EAEFD9] text-[#1E311A] flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#637C55]">
                      Celular / WhatsApp
                    </span>
                    <a
                      href="tel:+573113281789"
                      className="font-semibold text-[#1E311A] hover:underline transition-colors"
                    >
                      +57 311 328 1789
                    </a>
                    <span className="text-xs text-[#526D46] block">
                      Línea adicional: +57 312 849 5210
                    </span>
                  </div>
                </div>

                {/* Dirección / Ubicación */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EAEFD9] text-[#1E311A] flex items-center justify-center shrink-0 mt-0.5">
                    <Navigation className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#637C55]">
                      Dirección Oficial
                    </span>
                    <p className="font-semibold text-[#1E311A] text-sm">
                      Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6
                    </p>
                    <span className="text-xs text-[#526D46] block mt-0.5">
                      Santa Elena, Medellín, Antioquia (A 35 min de Medellín)
                    </span>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex items-start gap-3.5 pt-2 border-t border-[#E5ECD9]">
                  <div className="w-8 h-8 rounded-lg bg-[#EAEFD9] text-[#1E311A] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#637C55]">
                      Horarios de Estadía
                    </span>
                    <p className="text-xs text-[#344E30]">
                      Check-in: <strong>3:00 PM</strong> · Check-out: <strong>12:00 M</strong> (Self check-in disponible)
                    </p>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp Call to Action */}
              <div className="mt-6 pt-4 border-t border-[#D6DFC7]">
                <a
                  href={`https://wa.me/${TIKKUN_CONTACT.whatsappNumber}?text=${encodeURIComponent('Hola Casa Tikkun, quisiera consultar sobre la ubicación en Santa Elena y cómo llegar.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#1E311A] hover:bg-[#122210] rounded-xl transition-all shadow-md active:scale-95"
                >
                  <PhoneCall className="w-4 h-4 text-[#B6C29A]" />
                  <span>Contactar Anfitrión por Celular</span>
                </a>
              </div>
            </div>

            {/* 2. ROUTE HIGHLIGHTS */}
            <div className="bg-[#EDF2E4] rounded-3xl p-6 border-2 border-[#CCD8B8]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#1E311A] text-[#B6C29A] flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-[#1E311A] text-base">
                    Ruta en Carro o Moto
                  </h4>
                  <p className="text-[11px] text-[#556D49] font-medium">
                    Vía a Santa Elena · Solo 50 min desde Medellín
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#3A5035] leading-relaxed">
                Ruta 100% pavimentada y rodeada de bosques. Se puede subir por Buenos Aires o por Las Palmas tomando la variante hacia Santa Elena. Acceso apto para todo tipo de vehículo.
              </p>
            </div>

          </div>

          {/* Right Column: Google Maps Container (Prepared for Google Maps API) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Google Maps Container Card */}
            <div className="bg-[#FAF8F2] rounded-3xl p-3 sm:p-4 border-2 border-[#B6C29A] shadow-xl overflow-hidden relative">
              
              {/* Maps Header Bar */}
              <div className="flex items-center justify-between px-3 py-2.5 mb-2 bg-[#FAF8F2] rounded-2xl border border-[#D5DFCA]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E311A]">
                  <Compass className="w-4 h-4 text-[#5D7743]" />
                  <span>Google Maps · Casa Tikkun Glamping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-[#EDF2E4] text-[10px] font-bold text-[#2A4222] border border-[#CCD8B8]">
                    Coords: 6.2086° N, 75.4983° W
                  </span>
                  <a
                    href="https://maps.google.com/?q=carrera+25+este,+Via+Medell%C3%ADn-Via+Sta.+Elena+%2354-989+km+6,+Santa+Elena,+Medell%C3%ADn,+Antioquia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#1E311A] hover:bg-[#122210] transition-colors"
                  >
                    <span>Abrir en Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 
                Interactive Map View:
                Embeds interactive Google Maps centered on Santa Elena, Medellín.
                Ready for Google Maps Platform JS API / @vis.gl/react-google-maps if API key is plugged.
              */}
              <div className="relative w-full h-[430px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#CCD8B8] shadow-inner bg-[#DEE5D2]">
                <iframe
                  title="Ubicación de Casa Tikkun en Santa Elena en Google Maps"
                  src="https://maps.google.com/maps?q=carrera+25+este,+Via+Medell%C3%ADn-Via+Sta.+Elena+%2354-989+km+6,+Santa+Elena,+Medell%C3%ADn,+Antioquia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full object-cover"
                />

                {/* Floating Interactive Location Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-[#FAF8F2]/95 backdrop-blur-md p-4 rounded-2xl border-2 border-[#B6C29A] shadow-xl text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E311A] animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E311A]">
                      Casa Tikkun Santa Elena
                    </span>
                  </div>
                  <p className="text-xs text-[#415638] leading-snug">
                    Carrera 25 Este, Vía Medellín-Vía Sta. Elena #54-989 KM 6, Santa Elena, Medellín.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 text-[11px] font-bold">
                    <a
                      href="https://waze.com/ul?q=carrera+25+este+Via+Medellin+Via+Sta+Elena+54-989+km+6+Santa+Elena+Medellin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md bg-[#EDF2E4] text-[#1E311A] border border-[#CCD8B8] hover:bg-[#DEE6D5]"
                    >
                      Abrir con Waze
                    </a>
                    <a
                      href="https://maps.google.com/?q=carrera+25+este,+Via+Medell%C3%ADn-Via+Sta.+Elena+%2354-989+km+6,+Santa+Elena,+Medell%C3%ADn,+Antioquia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md bg-[#1E311A] text-white hover:bg-[#122210]"
                    >
                      Ruta en Maps
                    </a>
                  </div>
                </div>

              </div>

              {/* Public Transport info note */}
              <div className="mt-3 px-3 py-2 bg-[#EDF2E4] rounded-xl border border-[#CCD8B8] flex items-center justify-between text-xs text-[#3E5536]">
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-[#5D7743]" />
                  <span>Buses intermunicipales salen cada 20 min desde la <strong>Terminal del Norte de Medellín</strong>.</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
