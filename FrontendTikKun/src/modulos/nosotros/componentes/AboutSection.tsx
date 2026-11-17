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
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
        {/* Capa oscura para mantener el contraste y la calidez del fondo. */}
        <div className="absolute inset-0 bg-[#0E1A0C]/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0E1A0C]/90 via-transparent to-[#0E1A0C]/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal direction="up">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-6 lg:col-span-5">
              <h2 className="max-w-xl text-3xl font-serif font-bold leading-[1.12] tracking-tight text-white text-balance sm:text-4xl lg:text-5xl">
                Somos <span className="font-normal italic text-[#B8CFA0]">TikKun</span>
              </h2>

              <div className="max-w-xl space-y-4 text-sm leading-relaxed text-white/85 sm:text-base">
                <p>
                  A solo <strong className="font-semibold text-white">35 minutos de Medellín</strong>, en las montañas de <strong className="font-semibold text-[#D3E5BF]">Santa Elena</strong>, te esperan cuatro cabañas totalmente dotadas para disfrutar una escapada especial.
                </p>
                <p>
                  El clima fresco de montaña hace de cada cabaña un refugio acogedor para compartir con tus personas favoritas. Somos <strong className="font-semibold text-white">pet friendly</strong>, estamos en una zona segura y vigilada, y aquí puedes bajar el ritmo al sonido de la naturaleza. Ven a vivir un momento inolvidable.
                </p>
              </div>

              <div className="grid gap-4 border-t border-white/25 pt-5 sm:grid-cols-3">
                <div className="flex items-start gap-2.5">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 fill-[#B8CFA0] text-[#B8CFA0]" />
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px]">Cabañas</h3>
                    <p className="mt-1 text-[11px] leading-snug text-white/70">Totalmente dotadas para una estadía cómoda.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Trees className="mt-0.5 h-4 w-4 shrink-0 text-[#B8CFA0]" />
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px]">Naturaleza viva</h3>
                    <p className="mt-1 text-[11px] leading-snug text-white/70">Respira aire puro y disfruta el sonido del entorno.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#F4BE9B]" />
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px]">Descanso tranquilo</h3>
                    <p className="mt-1 text-[11px] leading-snug text-white/70">Zona segura y vigilada para que disfrutes con calma.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-7">
              <div className="group relative min-h-80 overflow-hidden rounded-[1.5rem_1.5rem_1.5rem_7rem] sm:min-h-[27rem] lg:min-h-[34rem]">
                <img
                  src="/Images/Conocenos.png"
                  alt="Collage de Casa Tikkun: cabañas, terrazas y paisajes de Santa Elena"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-y-0 -left-[4%] h-full w-[108%] object-cover transition-transform duration-700 group-hover:translate-x-[3%] group-hover:scale-[1.02] motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                <div className="absolute left-5 top-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white drop-shadow sm:left-7 sm:top-7">
                  <Sparkles className="h-3.5 w-3.5 text-[#ECCB85]" />
                  <span>Santa Elena, Antioquia</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white sm:bottom-8 sm:left-8 sm:right-8">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8CFA0]">
                    Una pausa en Santa Elena
                  </span>
                  <p className="max-w-lg font-serif text-lg italic leading-snug text-white sm:text-xl">
                    &ldquo;Ven a compartir con quienes quieres y déjate llevar por el sonido de la naturaleza.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
