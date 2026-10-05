// Presenta las comodidades y servicios destacados del alojamiento.
import React from 'react';
import comodidadesBg from '../../assets/images/comodidades_sunset_view_1790795592886.jpg';
import { Reveal } from '../common/Reveal';

export const Differentiators: React.FC = () => {
  const amenities = [
    {
      id: 'wifi',
      title: 'Wifi gratuito',
      description: 'Conexión a internet satelital Starlink de alta velocidad con cobertura total para disfrutar o trabajar rodeado de naturaleza.',
      icon: (
        <svg className="w-12 h-12 text-[#E58A55]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Portátil con señal de Wi-Fi. */}
          <rect x="9" y="12" width="30" height="20" rx="3" />
          <path d="M5 36h38" />
          <path d="M19 24a7 7 0 0 1 10 0" />
          <path d="M22 27a3 3 0 0 1 4 0" />
          <circle cx="24" cy="29" r="0.75" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'cocina',
      title: 'Cocina totalmente equipada',
      description: 'Nevera, estufa campestre, cafetera de goteo, vajilla rústica y todos los implementos necesarios para cocinar a tu ritmo.',
      icon: (
        <svg className="w-12 h-12 text-[#E58A55]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Olla y utensilios de cocina. */}
          <path d="M10 20h28v14a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V20z" />
          <path d="M6 20h36" />
          <path d="M20 14h8" />
          <path d="M24 10v4" />
          <path d="M18 26v4" strokeWidth="1.5" />
          <path d="M24 26v4" strokeWidth="1.5" />
          <path d="M30 26v4" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 'banos',
      title: 'Baños privados',
      description: 'Ducha de agua caliente constante con vista al bosque, toallas de algodón afelpadas, batas suaves y amenidades orgánicas.',
      icon: (
        <svg className="w-12 h-12 text-[#E58A55]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Lavadora con puerta circular. */}
          <rect x="10" y="8" width="28" height="32" rx="4" />
          <circle cx="24" cy="24" r="8" />
          <circle cx="24" cy="24" r="5" strokeDasharray="3 3" />
          <circle cx="16" cy="14" r="1.5" fill="currentColor" />
          <circle cx="21" cy="14" r="1.5" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'parqueadero',
      title: 'Aparcamiento gratuito',
      description: 'Estacionamiento privado dentro del predio, seguro y con acceso pavimentado apto para cualquier tipo de automóvil.',
      icon: (
        <svg className="w-12 h-12 text-[#E58A55]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Señal de estacionamiento. */}
          <rect x="9" y="8" width="30" height="32" rx="3" />
          <rect x="12" y="11" width="24" height="26" rx="2" strokeWidth="1" opacity="0.4" />
          <path d="M21 32V16h6a5 5 0 0 1 0 10h-6" strokeWidth="2.2" />
        </svg>
      )
    },
    {
      id: 'fogata',
      title: 'fogata',
      description: 'Fogatero al aire libre en cada cabaña con provisión de leña seca de roble, masmelos y vino caliente para disfrutar bajo las estrellas.',
      icon: (
        <svg className="w-12 h-12 text-[#E58A55]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Fogata al aire libre. */}
          <path d="M12 36l24-6" />
          <path d="M12 30l24 6" />
          <path d="M24 10c-3 5-6 9-6 15a6 6 0 0 0 12 0c0-6-3-10-6-15z" strokeWidth="2" />
          <path d="M24 20c-1.5 2.5-3 4.5-3 7.5a3 3 0 0 0 6 0c0-3-1.5-5-3-7.5z" fill="#E58A55" fillOpacity="0.35" />
        </svg>
      )
    },
    {
      id: 'restaurante',
      title: 'Restaurante y bar',
      description: 'Desayunos campesinos típicos incluidos, servicio de cenas románticas del chef a la luz de las velas y cava de vinos seleccionados.',
      icon: (
        <svg className="w-12 h-12 text-[#E58A55]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Copa de cóctel. */}
          <path d="M12 12h24l-10 14v10h8" />
          <path d="M18 36h12" />
          <path d="M22 26v10" />
          <path d="M14 16h20" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="34" cy="10" r="2" />
          <path d="M34 12l-3 4" />
        </svg>
      )
    }
  ];

  return (
    <section
      id="comodidades"
      className="relative min-h-[95vh] py-24 sm:py-32 flex items-center justify-center border-y border-tikkun-brand-deep bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${comodidadesBg})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        clipPath: 'inset(0)',
      }}
    >
      {/* Fondo fijo de paralaje, limitado al área de esta sección. */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${comodidadesBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Capa oscura translúcida que conserva visible la fotografía. */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-black/60" />
      </div>

      {/* Contenido de la sección. */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Encabezado de comodidades. */}
        <Reveal>
          <div className="max-w-4xl text-left mb-14 sm:mb-16">
            <div className="text-xs sm:text-sm font-bold tracking-[0.35em] uppercase text-[#DFA568] mb-3">
              C O M O D I D A D E S
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-tight mb-4 flex items-center gap-3">
              <span role="img" aria-label="casa campestre" className="text-3xl sm:text-4xl shrink-0">
                🏡
              </span>
              <span>Relájate, reconéctate y recarga energías</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed font-light max-w-4xl">
              Respira el aire puro de la montaña mientras te relajas en nuestro hermoso jardín o disfruta de una caminata panorámica por los alrededores. Ya sea que disfrutes de tu café matutino al amanecer o contemples las estrellas bajo el cielo estrellado, Casa Tikkun es tu refugio perfecto.
            </p>
          </div>
        </Reveal>

        {/* Cuadrícula de comodidades con entrada escalonada. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {amenities.map((item, idx) => (
            <Reveal key={item.id} delayMs={idx * 90} direction="up">
              <div
                className="group relative bg-white/[0.07] backdrop-blur-md p-7 sm:p-9 rounded-2xl border border-white/20 hover:border-[#E58A55] hover:bg-white/[0.12] transition-all duration-300 shadow-2xl flex flex-col justify-between h-full"
              >
                {/* Icono de la comodidad. */}
                <div>
                  <div className="mb-6 transform group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>

                  {/* Nombre de la comodidad. */}
                  <h3 className="text-xl sm:text-2xl font-serif font-medium text-white tracking-wide mb-3 group-hover:text-[#F3C49F] transition-colors">
                    {item.title}
                  </h3>

                  {/* Descripción de la comodidad. */}
                  <p className="text-sm text-stone-200/80 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {/* Detalle visual de la tarjeta. */}
                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-300/60">
                  <span className="uppercase tracking-widest text-[11px] font-semibold text-[#DFA568]">
                    Casa Tikkun
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E58A55]" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
};
