import React, { useEffect, useState } from 'react';
import { Stethoscope, ChevronRight, Award, ShieldCheck, Heart, Users, Clock3, Sparkles, ArrowRight } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ChatbotPanel from '../components/ChatbotPanel';
import { supabase } from '../lib/supabaseClient';

const trustStats = [
  
];

const whyChoose = [
  {
    title: 'Atención personalizada',
    description: 'Evaluamos cada caso de manera individual para recomendar el tratamiento más adecuado.',
  },
  {
    title: 'Profesionales capacitados',
    description: 'Contamos con un equipo preparado para brindar una atención segura y confiable.',
  },
  {
    title: 'Ambiente cómodo y moderno',
    description: 'Buscamos que cada visita sea tranquila, agradable y sin temor.',
  },
  {
    title: 'Tratamientos integrales',
    description: 'Ofrecemos soluciones para niños, jóvenes y adultos en un solo lugar.',
  },
];

const commitment = 'Nos comprometemos a acompañarte en todo el proceso de tu tratamiento, explicándote cada paso con claridad y brindándote una atención honesta, cercana y profesional.';

function PageWrapper({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const config = {};
  const handleWhatsAppDirect = () => {
    const phone = '51969826870';
    const message = encodeURIComponent('Hola Evolution Dental Center, mi consulta es:');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };
  return (
    <div>
      <Nav handleWhatsAppDirect={handleWhatsAppDirect} isScrolled={isScrolled} setIsChatOpen={setIsChatOpen} isChatOpen={isChatOpen} />
      {children}
      <ChatbotPanel config={config} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      <Footer config={{}} />
    </div>
  );
}

function NosotrosContent() {
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    const fetchMedicos = async () => {
      const { data, error } = await supabase.from('medicos').select('*').order('created_at', { ascending: true });
      if (error) {
        console.error('Error loading medicos:', error);
        return;
      }
      setMedicos(data || []);
    };

    fetchMedicos();
  }, []);

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <section className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-[#dbac43] bg-[#dbac43]/10 rounded-full uppercase tracking-widest mb-5">
          <Award size={14} /> Nuestra Clínica
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#414242]">
          Conoce <span className="text-[#dbac43]">Evolution Dental Center</span>
        </h2>
        
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-[#c9c8c6]/25">
          <h3 className="text-2xl font-black text-[#dbac43] mb-4">Quiénes Somos</h3>
          <p className="text-[#414242]/70 leading-relaxed text-[15px] md:text-base">
            En Evolution Dental Center trabajamos para transformar sonrisas con una atención cercana, profesional y personalizada. Nuestro compromiso es brindar tratamientos odontológicos de calidad, utilizando tecnología moderna y un equipo preparado para cuidar la salud bucal de cada paciente en Piura.
          </p>
        </div>
        <div className="bg-[#414242] p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl text-white border border-white/10">
          <h3 className="text-2xl font-black mb-4">Tecnología de Punta</h3>
          <p className="opacity-90 leading-relaxed text-[15px] md:text-base">
            Contamos con equipos modernos que nos permiten realizar diagnósticos más precisos y tratamientos más seguros. Esto nos ayuda a ofrecer una atención eficiente, cómoda y adaptada a las necesidades de cada paciente.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-[#c9c8c6]/25">
          <div className="flex items-center gap-3 mb-5 text-[#dbac43] font-black uppercase tracking-widest text-xs"><Heart size={16} /> Nuestra Misión</div>
          <p className="text-[#414242]/70 leading-relaxed text-[15px] md:text-base">Brindar atención odontológica integral, segura y de calidad, ayudando a nuestros pacientes a recuperar su salud bucal, mejorar su sonrisa y sentirse más seguros en cada etapa del tratamiento.</p>
        </div>
        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-[#c9c8c6]/25">
          <div className="flex items-center gap-3 mb-5 text-[#dbac43] font-black uppercase tracking-widest text-xs"><Sparkles size={16} /> Nuestra Visión</div>
          <p className="text-[#414242]/70 leading-relaxed text-[15px] md:text-base">Ser una clínica dental reconocida en Piura por nuestra calidad humana, innovación, confianza y compromiso con la salud oral de nuestros pacientes.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 mt-2">
        {trustStats.map((item) => (
          <div key={item.label} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-[#c9c8c6]/25 text-center">
            <div className="text-3xl md:text-4xl font-black text-[#414242]">{item.value}</div>
            <div className="mt-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-[#dbac43]">{item.label}</div>
          </div>
        ))}
      </section>

      <section className="bg-[#414242] text-white rounded-[3rem] p-10 md:p-12 shadow-2xl border border-white/10 mb-8">
        <div className="flex items-center gap-3 mb-5 text-[#dbac43] font-black uppercase tracking-widest text-xs"><ShieldCheck size={16} /> Nuestro Compromiso</div>
        <p className="text-white/85 leading-relaxed max-w-4xl text-[15px] md:text-base">{commitment}</p>
      </section>

      <section className="mb-10">
        <div className="mb-6">
          <h3 className="text-4xl font-black tracking-tighter text-[#414242]">¿Por qué elegirnos?</h3>
          <p className="mt-3 text-[#414242]/65 max-w-3xl leading-relaxed">Ofrecemos una experiencia confiable, cómoda y completa para niños, jóvenes y adultos.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {whyChoose.map((item, index) => (
            <div key={item.title} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#c9c8c6]/25 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#dbac43]/10 text-[#dbac43] flex items-center justify-center shrink-0 font-black">0{index + 1}</div>
              <div>
                <h4 className="font-black text-[#414242] text-xl mb-2">{item.title}</h4>
                <p className="text-[#414242]/65 leading-relaxed text-[15px]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-0 mt-4 border-t border-[#c9c8c6]/30" id="staff">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-[#414242]">Nuestro Staff Médico</h3>
          <div className="w-20 h-1.5 bg-[#dbac43] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicos.length > 0 ? medicos.map((m) => (
            <div key={m.id} className="relative rounded-[3rem] overflow-hidden group cursor-pointer aspect-[4/5] shadow-lg hover:shadow-2xl transition-shadow duration-500 bg-[#414242]">
              {m.imagen_url ? (
                <img src={m.imagen_url} alt={m.nombre} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#414242] text-[#dbac43]"><Stethoscope size={72} /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#414242] via-[#414242]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h4 className="font-black text-2xl md:text-3xl text-white leading-tight mb-2 drop-shadow-md">{m.nombre}</h4>
                <p className="text-[#dbac43] font-black uppercase tracking-widest text-xs drop-shadow-md">{m.especialidad}</p>
                <div className="mt-6 text-[#dbac43] font-black text-xs uppercase tracking-widest flex items-center gap-2">Ver perfil <ChevronRight size={16} /></div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center text-[#c9c8c6] font-bold uppercase tracking-widest text-xs py-10">
              Cargando el equipo de especialistas...
            </div>
          )}
        </div>
      </section>

      <section className="mt-12 bg-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-[#c9c8c6]/25 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-[#dbac43] text-xs font-black uppercase tracking-[0.35em] mb-3">Atención directa</p>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#414242]">¿Quieres agendar una cita con nosotros?</h3>
          <p className="mt-3 text-[#414242]/65 max-w-2xl leading-relaxed">Escríbenos por WhatsApp y te orientamos con el tratamiento más adecuado para ti o tu familia.</p>
        </div>
        <button type="button" onClick={() => window.open('https://wa.me/51969826870?text=' + encodeURIComponent('Hola Evolution Dental Center, mi consulta es:'), '_blank')} className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#dbac43] text-[#414242] font-black uppercase tracking-widest text-[11px] shadow-lg hover:brightness-105 transition-all">
          Escribir por WhatsApp <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}

export default function Nosotros() {
  return (
    <PageWrapper>
      <NosotrosContent />
    </PageWrapper>
  );
}