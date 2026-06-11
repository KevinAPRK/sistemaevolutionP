import React, { useState } from 'react';
import { Stethoscope, Award, Sparkles, ShieldCheck, Clock3, ArrowRight } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ChatbotPanel from '../components/ChatbotPanel';

const trustPoints = [
  { icon: ShieldCheck, title: 'Tratamientos seguros', description: 'Protocolos clínicos claros y atención personalizada en cada etapa.' },
  { icon: Clock3, title: 'Atención oportuna', description: 'Agenda ágil para que el paciente reciba orientación sin demoras.' },
  { icon: Sparkles, title: 'Resultados estéticos', description: 'Soluciones enfocadas en función, armonía y una sonrisa natural.' },
];

const specialties = [
  {
    name: 'Ortodoncia',
    description: 'Corrige la posición de tus dientes y mejora la armonía de tu sonrisa. En Evolution Dental Center evaluamos tu caso para ofrecerte un tratamiento cómodo, seguro y personalizado, ayudándote a lograr una sonrisa más estética y funcional.',
  },
  {
    name: 'Implantología',
    description: 'Recupera piezas dentales perdidas con soluciones firmes, estéticas y duraderas. Los implantes dentales permiten mejorar tu masticación, seguridad al hablar y apariencia natural de tu sonrisa.',
  },
  {
    name: 'Endodoncia',
    description: 'Salvamos dientes afectados por caries profundas, infecciones o dolor intenso. Este tratamiento permite conservar tu pieza dental natural, eliminar molestias y evitar extracciones innecesarias.',
  },
  {
    name: 'Odontopediatría',
    description: 'Cuidamos la salud bucal de los más pequeños con atención cercana, paciente y preventiva. Nuestro objetivo es que los niños pierdan el miedo al dentista y aprendan hábitos saludables desde temprana edad.',
  },
];

function PageWrapper({ children, handleWhatsAppDirect }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const config = {};
  return (
    <div>
      <Nav handleWhatsAppDirect={handleWhatsAppDirect} isScrolled={isScrolled} setIsChatOpen={setIsChatOpen} isChatOpen={isChatOpen} />
      {children}
      <ChatbotPanel config={config} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      <Footer config={{}} />
    </div>
  );
}

function Especialidades({ servicios }) {
  const handleWhatsAppDirect = () => {
    const phone = '51969826870';
    const message = encodeURIComponent('Hola Evolution Dental Center, mi consulta es:');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <PageWrapper handleWhatsAppDirect={handleWhatsAppDirect}>
      <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-24 w-80 h-80 rounded-full bg-[#dbac43]/10 blur-3xl" />
          <div className="absolute top-40 right-0 w-96 h-96 rounded-full bg-[#414242]/5 blur-3xl" />
        </div>

        <section className="px-6 max-w-7xl mx-auto mb-16 relative">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-stretch">
            <div className="bg-white/90 backdrop-blur rounded-[3rem] shadow-xl border border-white p-8 md:p-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-[#dbac43] bg-[#dbac43]/10 rounded-full uppercase tracking-widest mb-5">
                <Award size={14} /> Excelencia Odontológica
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[#414242] leading-[0.95]">
                Nuestras <span className="text-[#dbac43]">Especialidades</span>
              </h2>
              <p className="text-[#414242]/70 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
                Tratamientos diseñados para combinar estética, precisión y confianza. Cada especialidad está pensada para acompañar al paciente con una experiencia clara y moderna.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {['Ortodoncia', 'Implantología', 'Endodoncia', 'Odontopediatría'].map((item) => (
                  <span key={item} className="px-4 py-2 rounded-full bg-[#414242]/5 text-[#414242] text-xs font-black uppercase tracking-widest border border-[#414242]/10">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="/" className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#414242] text-white font-black uppercase tracking-widest text-[11px] shadow-lg hover:bg-black transition-colors">
                  Conocer la clínica <ArrowRight size={16} />
                </a>
                <p className="text-xs font-bold uppercase tracking-widest text-[#414242]/50">
                  Atención especializada con identidad visual Evolution Dental Center.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {trustPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="bg-white/90 backdrop-blur rounded-[2.25rem] shadow-lg border border-white p-6 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#dbac43]/10 text-[#dbac43] flex items-center justify-center shrink-0">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-[#414242] text-lg">{point.title}</h3>
                      <p className="text-sm text-[#414242]/65 leading-relaxed mt-1">{point.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {specialties.map((specialty, index) => (
              <article key={specialty.name} className="group bg-white rounded-[2.75rem] shadow-sm border border-[#c9c8c6]/25 p-8 md:p-9 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#dbac43] via-[#f0d58a] to-[#414242]/20" />
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div className="bg-[#dbac43]/10 text-[#dbac43] w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-[#dbac43]/10">
                    <Stethoscope size={30} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#414242]/30 pt-2">
                    0{index + 1}
                  </span>
                </div>

                <h4 className="font-black text-2xl mb-4 text-[#414242] tracking-tight">{specialty.name}</h4>
                <p className="text-[#414242]/65 text-sm leading-relaxed font-medium flex-1">{specialty.description}</p>

              </article>
            ))}
          </div>

          <div className="mt-10 bg-[#414242] rounded-[3rem] p-8 md:p-10 text-white shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[#dbac43] text-xs font-black uppercase tracking-[0.35em] mb-3">Cita guiada</p>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight">Agenda una orientación según tu especialidad</h3>
            </div>
            <button type="button" onClick={handleWhatsAppDirect} className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#dbac43] text-[#414242] font-black uppercase tracking-widest text-[11px] shadow-lg hover:brightness-105 transition-all">
              Escribir por WhatsApp <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

// ESTA LÍNEA ES LA QUE FALTABA Y ARREGLA EL ERROR
export default Especialidades;