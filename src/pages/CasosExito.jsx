import React, { useEffect, useState } from 'react';
import {
  ImageIcon,
  Star,
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Smile,
  Sparkles,
  ShieldCheck,
  Gem,
  BadgeCheck,
} from 'lucide-react';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ChatbotPanel from '../components/ChatbotPanel';
import { supabase } from '../lib/supabaseClient';

const FALLBACK_WHATSAPP = '51912345678';

const cleanPhone = (phone = '') => String(phone).replace(/\D/g, '');

const getResultado = (caso) => {
  const titulo = (caso?.titulo || '').toLowerCase();

  if (caso?.descripcion) return caso.descripcion;
  if (caso?.resultado) return caso.resultado;

  if (titulo.includes('ortodoncia')) {
    return 'Alineación más armónica y mejor función dental.';
  }

  if (titulo.includes('blanqueamiento')) {
    return 'Dientes visiblemente más blancos, limpios y luminosos.';
  }

  if (titulo.includes('rehabilitación') || titulo.includes('rehabilitacion')) {
    return 'Recuperación de estética, función y confianza al sonreír.';
  }

  if (titulo.includes('carilla')) {
    return 'Sonrisa natural, armónica y de alta estética.';
  }

  return 'Tratamiento personalizado enfocado en mejorar estética, función y confianza.';
};

const getCaseIcon = (caso) => {
  const titulo = (caso?.titulo || '').toLowerCase();

  if (titulo.includes('ortodoncia')) return Smile;
  if (titulo.includes('blanqueamiento')) return Sparkles;
  if (titulo.includes('rehabilitación') || titulo.includes('rehabilitacion')) {
    return ShieldCheck;
  }
  if (titulo.includes('carilla')) return Gem;

  return BadgeCheck;
};

function PageWrapper({ children, config = {} }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleWhatsAppDirect = () => {
    const telefono = cleanPhone(config?.telefono || FALLBACK_WHATSAPP);
    const mensaje = encodeURIComponent(
      'Hola, quiero agendar una evaluación dental. Vi sus casos clínicos en la web.'
    );

    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  };

  return (
    <div>
      <Nav
        handleWhatsAppDirect={handleWhatsAppDirect}
        isScrolled={isScrolled}
        setIsChatOpen={setIsChatOpen}
        isChatOpen={isChatOpen}
      />

      {children}

      <ChatbotPanel
        config={config}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
      />

      <Footer config={config} />
    </div>
  );
}

function BeforeAfterSlider({ before, after, title }) {
  const [position, setPosition] = useState(50);

  if (!before || !after) {
    return (
      <div className="aspect-[16/10] rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <ImageIcon className="mx-auto mb-3" size={42} />
          <p className="text-xs font-black uppercase tracking-widest">
            Imagen no disponible
          </p>
        </div>
      </div>
    );
  }

  const showAntes = position <= 50;
  const showDespues = position > 50;

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-slate-100 shadow-inner">
      <div className="relative aspect-[16/10] select-none">
        {/* Imagen base: ANTES */}
        <img
          src={before}
          alt={`${title} antes`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />

        {/* Imagen superior: DESPUÉS */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          }}
        >
          <img
            src={after}
            alt={`${title} después`}
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>

        {/* Label dinámico */}
        {showAntes && (
          <div className="absolute top-4 left-4 bg-[#414242] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20">
            Antes
          </div>
        )}

        {showDespues && (
          <div className="absolute top-4 right-4 bg-[#dbac43] text-[#414242] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20">
            Después
          </div>
        )}

        {/* Línea del comparador */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none z-20"
          style={{
            left: `${position}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dbac43] border-4 border-white shadow-xl flex items-center justify-center text-[#414242] font-black">
            ↔
          </div>
        </div>

        {/* Control invisible del slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          aria-label="Comparar antes y después"
        />
      </div>
    </div>
  );
}

function CasosExito() {
  const [casos, setCasos] = useState([]);
  const [config, setConfig] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: casosData, error: casosError } = await supabase
        .from('casos-clinicos')
        .select('*')
        .order('created_at', { ascending: false });

      if (casosError) {
        console.error('Error loading casos-clinicos:', casosError);
      } else {
        setCasos(casosData || []);
      }

      const { data: configData, error: configError } = await supabase
        .from('configuracion')
        .select('*')
        .limit(1)
        .single();

      if (!configError && configData) {
        setConfig(configData);
      }
    };

    fetchData();
  }, []);

  const handleWhatsAppEvaluation = (tratamiento = 'un tratamiento dental') => {
    const telefono = cleanPhone(config?.telefono || FALLBACK_WHATSAPP);
    const mensaje = encodeURIComponent(
      `Hola, quiero una evaluación para ${tratamiento}. Vi sus casos clínicos en la web.`
    );

    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  };

  const casosPublicados = casos?.filter(Boolean) || [];

  return (
    <PageWrapper config={config}>
      <main className="pt-32 pb-24 min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(219,172,67,0.16),transparent_32%),linear-gradient(180deg,#fffaf2_0%,#f8fafc_45%,#ffffff_100%)]">
        <div className="px-6 max-w-7xl mx-auto">
          <section className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-12 bg-[#dbac43]" />

              <div className="w-10 h-10 rounded-full bg-white shadow-md border border-[#dbac43]/30 flex items-center justify-center text-[#dbac43]">
                <Star size={18} fill="currentColor" />
              </div>

              <span className="h-px w-12 bg-[#dbac43]" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-5">
              Casos Clínicos de{' '}
              <span className="text-[#dbac43]">Éxito</span>
            </h1>

            <p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              Conoce algunas transformaciones reales realizadas por nuestro equipo.
              Cada sonrisa refleja un tratamiento personalizado, seguro y enfocado
              en mejorar la estética, función y confianza de nuestros pacientes.
            </p>
          </section>

          {casosPublicados.length > 0 ? (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
              {casosPublicados.map((caso, index) => {
                const CaseIcon = getCaseIcon(caso);

                return (
                  <article
                    key={index}
                    className="group relative overflow-hidden rounded-[2.5rem] bg-white/90 border border-[#dbac43]/15 shadow-[0_24px_70px_rgba(15,23,42,0.08)] hover:shadow-[0_28px_90px_rgba(219,172,67,0.18)] transition-all duration-500"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#dbac43]/10 rounded-bl-[6rem]" />

                    <div className="relative p-6 md:p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative shrink-0">
                          <div className="absolute inset-0 rounded-full bg-[#dbac43]/30 blur-md" />
                          <div className="relative w-14 h-14 rounded-full bg-[#fff7e6] border border-[#dbac43]/40 text-[#dbac43] flex items-center justify-center shadow-[0_10px_25px_rgba(219,172,67,0.22)]">
                            <CaseIcon size={27} strokeWidth={2.4} />
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#dbac43] mb-1">
                            Transformación real
                          </p>

                          <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.12em] text-slate-900">
                            {caso?.titulo || 'Caso Clínico'}
                          </h2>
                        </div>
                      </div>

                      <BeforeAfterSlider
                        before={caso?.antes}
                        after={caso?.despues}
                        title={caso?.titulo || 'Caso clínico'}
                      />

                      <div className="mt-6 flex items-start gap-3 text-slate-600">
                        <CheckCircle
                          size={20}
                          className="text-[#dbac43] shrink-0 mt-0.5"
                          fill="currentColor"
                        />

                        <p className="text-sm md:text-base leading-relaxed font-medium">
                          {getResultado(caso)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleWhatsAppEvaluation(
                            caso?.titulo || 'un tratamiento dental'
                          )
                        }
                        className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#dbac43] px-7 py-3.5 text-[#414242] font-black text-sm shadow-[0_12px_30px_rgba(219,172,67,0.35)] hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(219,172,67,0.45)] transition-all"
                      >
                        <MessageCircle size={20} />
                        Quiero una evaluación
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-[#c9c8c6] shadow-sm">
              <ImageIcon className="mx-auto text-[#c9c8c6] mb-4" size={48} />

              <p className="text-[#c9c8c6] font-bold uppercase tracking-widest text-sm">
                No hay casos publicados todavía.
              </p>
            </div>
          )}

          {casosPublicados.length > 0 && (
            <section className="mt-16 text-center">
              <button
                type="button"
                onClick={() => handleWhatsAppEvaluation()}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#414242] px-9 py-4 text-white font-black text-sm shadow-xl hover:bg-[#dbac43] hover:text-[#414242] transition-all"
              >
                <MessageCircle size={20} />
                Quiero una evaluación
                <ArrowRight size={18} />
              </button>
            </section>
          )}
        </div>
      </main>
    </PageWrapper>
  );
}

export default CasosExito;