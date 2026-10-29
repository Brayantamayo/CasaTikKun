// Sección de inicio que destaca las ventajas del alojamiento.
import React from 'react';
import { Reveal } from '@/modulos/Home/Reveal';

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
      id: 'pet-friendly',
      title: 'Pet friendly',
      description: 'Tu compañero de cuatro patas también es bienvenido en Casa Tikkun. Escríbenos antes de reservar para conocer las condiciones de estadía.',
      icon: (
        <svg className="w-12 h-12 text-[#E58A55]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Huella para indicar que las mascotas también son bienvenidas. */}
          <ellipse cx="24" cy="29" rx="10" ry="8" />
          <ellipse cx="11" cy="19" rx="3.5" ry="5" transform="rotate(-25 11 19)" />
          <ellipse cx="20" cy="13" rx="3.5" ry="5" transform="rotate(-8 20 13)" />
          <ellipse cx="29" cy="13" rx="3.5" ry="5" transform="rotate(8 29 13)" />
          <ellipse cx="37" cy="19" rx="3.5" ry="5" transform="rotate(25 37 19)" />
        </svg>
      )
    }  ];

  return (
    <section
      id="comodidades"
      className="relative py-20 sm:py-24 lg:py-28 border-y border-tikkun-brand-deep bg-cover bg-center bg-no-repeat"
      style={{
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        clipPath: 'inset(0)',
      }}
    >
      {/* Fondo de montaña con una capa oscura para dar contraste al contenido. */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/Images/COmodidades.jpg" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#11190F]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#10180F]/70 via-[#10180F]/35 to-[#10180F]/75" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E9C49F] backdrop-blur-md sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E58A55]" />
              La experiencia Tikkun
            </span>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Conoce a <span className="italic text-[#D2DDB8]">Tikkun</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
              Pequeños detalles, grandes momentos. Todo lo que necesitas para disfrutar la montaña a tu manera.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {amenities.map((item, idx) => (
            <Reveal key={item.id} delayMs={idx * 70} direction="up">
              <article className="group relative h-full min-h-52 overflow-hidden rounded-2xl border border-white/20 bg-[#172116]/55 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#D89A68]/80 hover:bg-[#202B1E]/75 sm:min-h-56 sm:p-6">
                <span aria-hidden="true" className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#D99A68]/0 blur-3xl transition-colors duration-500 group-hover:bg-[#D99A68]/20" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E5B58D]/25 bg-[#E5B58D]/10 transition-colors duration-300 group-hover:bg-[#E5B58D]/20">
                      <span className="scale-[0.78]">{item.icon}</span>
                    </div>
                    <span className="font-serif text-sm italic text-white/35">0{idx + 1}</span>
                  </div>
                  <div className="mt-7">
                    <h3 className="font-serif text-xl font-medium tracking-wide text-white transition-colors group-hover:text-[#F0C8A8] sm:text-2xl">{item.title}</h3>
                    <p className="mt-2.5 max-w-md text-xs leading-6 text-white/70 sm:text-sm sm:leading-7">{item.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E7B58A]/80">
                    <span className="h-px w-6 bg-[#E7B58A]/60 transition-all group-hover:w-10" />
                    Casa Tikkun
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
