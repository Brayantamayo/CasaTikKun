import React from 'react';
import { Heart, Sparkles, Flame, Trees } from 'lucide-react';
import cabinImg from '../../assets/images/cabin_alpina_luxury_1790614303472.jpg';
import santaElenaMist from '../../assets/images/santa_elena_mist_1790871640380.jpg';
import { Reveal } from '../common/Reveal';

export const AboutSection: React.FC = () => {
  return (
    <section id="conocenos" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      
      {/* 
        1. BACKGROUND PANORAMIC IMAGE:
        Atmospheric view of the misty pine forest and Andean mountains of Santa Elena
      */}
      <div className="absolute inset-0 z-0">
        <img
          src={santaElenaMist}
          alt="Bosque de pinos y niebla en Santa Elena"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark green vignette for optimal text contrast and warmth */}
        <div className="absolute inset-0 bg-[#0E1A0C]/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0E1A0C]/90 via-transparent to-[#0E1A0C]/80" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 
          2. BALANCED FLOATING TRANSLUCENT FROSTED GLASS CARD:
          Proportional, elegant, and harmonious with the rest of the page
        */}
        <Reveal direction="up">
          <div className="relative rounded-3xl p-5 sm:p-7 lg:p-8 bg-white/12 backdrop-blur-2xl border border-white/20 shadow-[0_16px_45px_rgba(0,0,0,0.4)] ring-1 ring-white/15 overflow-hidden">
            
            {/* Soft inner ambient glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#B8CFA0]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Left Column: Story & Meaning */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Subtle Translucent Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] font-medium uppercase tracking-wider text-white shadow-2xs">
                  <Heart className="w-3 h-3 text-[#E68A7E] fill-[#E68A7E]" />
                  <span>Nuestra Esencia & Historia · Santa Elena</span>
                </div>

                {/* Proportional Headline */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight leading-snug text-balance">
                  Somos Casa <span className="italic font-normal text-[#B8CFA0] drop-shadow-[0_2px_10px_rgba(184,207,160,0.4)]">Tikkun</span>: Un paraíso de descanso, amor y frío a 35 minutos de Medellín
                </h2>

                {/* Warm Story Body */}
                <div className="space-y-2.5 text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                  <p>
                    La palabra <strong className="text-white font-semibold">Tikkun</strong> representa un concepto milenario de <em>reparar, sanar y restaurar</em>. 
                    Nacimos en las montañas mágicas de <strong className="text-[#D3E5BF] font-semibold">Santa Elena</strong>, donde la niebla abraza los bosques de pino y el aire frío de páramo invita a bajar las revoluciones.
                  </p>
                  <p>
                    Un santuario consagrado a <strong className="text-white font-semibold">escaparse en pareja o en familia</strong>: 
                    el calor reconfortante de una chimenea de leña, el silencio de la montaña mientras 
                    afuera cae la tarde, y despertar con el canto de las aves andinas y café recién colado.
                  </p>
                </div>

                {/* Three Emotional Friendly Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  
                  <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-2xs flex flex-col justify-between transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-white/20 text-[#B8CFA0] flex items-center justify-center mb-1.5">
                      <Heart className="w-3.5 h-3.5 fill-[#B8CFA0]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">Amor & Conexión</h4>
                      <p className="text-[10.5px] text-white/80 mt-0.5 leading-snug">
                        El frío de montaña para compartir y reconectar.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-2xs flex flex-col justify-between transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-white/20 text-[#B8CFA0] flex items-center justify-center mb-1.5">
                      <Trees className="w-3.5 h-3.5 text-[#B8CFA0]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">Niebla & Bosque</h4>
                      <p className="text-[10.5px] text-white/80 mt-0.5 leading-snug">
                        Santa Elena a 2.200 msnm: aire puro y silencio.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-2xs flex flex-col justify-between transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-white/20 text-[#E5A069] flex items-center justify-center mb-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#F4BE9B]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">Fuego & Chimenea</h4>
                      <p className="text-[10.5px] text-white/80 mt-0.5 leading-snug">
                        Calor de leña tradicional y fogatas bajo las estrellas.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column: Cabin Photo */}
              <div className="lg:col-span-6 h-full flex flex-col justify-center">
                
                {/* Main Illuminated Cabin Photo */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/25 group h-full min-h-72.5 sm:min-h-82.5">
                  <img
                    src={cabinImg}
                    alt="Cabaña alpina iluminada en medio del bosque de Santa Elena"
                    className="w-full h-full min-h-72.5 sm:min-h-82.5 object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />
                  
                  {/* Badge on top right */}
                  <div className="absolute top-3.5 right-3.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-medium text-white shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#ECCB85]" />
                    <span>Santa Elena, Antioquia</span>
                  </div>

                  {/* Philosophy Quote */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[9.5px] uppercase tracking-widest text-[#B8CFA0] font-bold block mb-0.5">
                      Filosofía Casa Tikkun
                    </span>
                    <p className="font-serif italic text-xs sm:text-sm text-white/95 leading-snug">
                      &ldquo;No venimos a la montaña a huir del mundo, sino a recordar quiénes somos sin el ruido.&rdquo;
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
