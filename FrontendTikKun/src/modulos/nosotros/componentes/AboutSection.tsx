// Sección que cuenta la historia y propuesta de Casa Tikkun.
import React from 'react';
import { Heart, Sparkles, ShieldCheck, Trees } from 'lucide-react';
import { Reveal } from '@/modulos/Home/Reveal';

export const AboutSection: React.FC = () => {
  return (
    <section id="conocenos" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      
      {/* Imagen panorámica del bosque y las montañas de Santa Elena. */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Images/Conocenos.png"
          alt="Paisajes y espacios de Casa Tikkun"
          className="w-full h-full object-cover object-center"
        />
        {/* Capa oscura para mantener el contraste y la calidez del fondo. */}
        <div className="absolute inset-0 bg-[#0E1A0C]/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0E1A0C]/90 via-transparent to-[#0E1A0C]/80" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Panel translúcido con la historia y los atributos del alojamiento. */}
        <Reveal direction="up">
          <div className="relative rounded-3xl p-5 sm:p-7 lg:p-8 bg-white/12 backdrop-blur-2xl border border-white/20 shadow-[0_16px_45px_rgba(0,0,0,0.4)] ring-1 ring-white/15 overflow-hidden">
            
            {/* Brillos ambientales interiores. */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#B8CFA0]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Columna izquierda: historia y significado. */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Rótulo translúcido de identidad. */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] font-medium uppercase tracking-wider text-white shadow-2xs">
                  <Heart className="w-3 h-3 text-[#E68A7E] fill-[#E68A7E]" />
                  <span>Glamping en Santa Elena · Antioquia</span>
                </div>

                {/* Título principal. */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight leading-snug text-balance">
                  Somos <span className="italic font-normal text-[#B8CFA0] drop-shadow-[0_2px_10px_rgba(184,207,160,0.4)]">Tikkun</span>, un refugio de montaña para compartir y reconectar
                </h2>

                {/* Relato de la marca. */}
                <div className="space-y-2.5 text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                  <p>
                    A solo <strong className="text-white font-semibold">35 minutos de Medellín</strong>, en las montañas de <strong className="text-[#D3E5BF] font-semibold">Santa Elena</strong>, te esperan cuatro cabañas totalmente dotadas para disfrutar una escapada especial.
                  </p>
                  <p>
                    El clima fresco de montaña hace de cada cabaña un refugio acogedor para compartir con tus personas favoritas. Somos <strong className="text-white font-semibold">pet friendly</strong>, estamos en una zona segura y vigilada, y aquí puedes bajar el ritmo al sonido de la naturaleza. Ven a vivir un momento inolvidable.
                  </p>
                </div>

                {/* Tres atributos principales de la experiencia. */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  
                  <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-2xs flex flex-col justify-between transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-white/20 text-[#B8CFA0] flex items-center justify-center mb-1.5">
                      <Heart className="w-3.5 h-3.5 fill-[#B8CFA0]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">Cuatro cabañas</h4>
                      <p className="text-[10.5px] text-white/80 mt-0.5 leading-snug">
                        Totalmente dotadas para una estadía cómoda.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-2xs flex flex-col justify-between transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-white/20 text-[#B8CFA0] flex items-center justify-center mb-1.5">
                      <Trees className="w-3.5 h-3.5 text-[#B8CFA0]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">Naturaleza viva</h4>
                      <p className="text-[10.5px] text-white/80 mt-0.5 leading-snug">
                        Respira aire puro y disfruta el sonido del entorno.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-2xs flex flex-col justify-between transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-white/20 text-[#E5A069] flex items-center justify-center mb-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#F4BE9B]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">Descanso tranquilo</h4>
                      <p className="text-[10.5px] text-white/80 mt-0.5 leading-snug">
                        Zona segura y vigilada para que disfrutes con calma.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Columna derecha: fotografía de la cabaña. */}
              <div className="lg:col-span-6 h-full flex flex-col justify-center">
                
                {/* Fotografía principal de la cabaña iluminada. */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/25 group h-full min-h-72.5 sm:min-h-82.5">
                  <img
                    src="/Images/Conocenos.png"
                    alt="Collage de Casa Tikkun: cabañas, terrazas y paisajes de Santa Elena"
                    className="w-full h-full min-h-72.5 sm:min-h-82.5 object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />
                  
                  {/* Ubicación sobre la fotografía. */}
                  <div className="absolute top-3.5 right-3.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-medium text-white shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#ECCB85]" />
                    <span>Santa Elena, Antioquia</span>
                  </div>

                  {/* Frase que resume la filosofía del alojamiento. */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[9.5px] uppercase tracking-widest text-[#B8CFA0] font-bold block mb-0.5">
                      Una pausa en Santa Elena
                    </span>
                    <p className="font-serif italic text-xs sm:text-sm text-white/95 leading-snug">
                      &ldquo;Ven a compartir con quienes quieres y déjate llevar por el sonido de la naturaleza.&rdquo;
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </Reveal>

      </div>
    </section>
  );
};
