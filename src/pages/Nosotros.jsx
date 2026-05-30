import React, { useEffect, useState } from 'react';
import { Stethoscope, ChevronRight } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ChatbotPanel from '../components/ChatbotPanel';
import { supabase } from '../lib/supabaseClient';

function PageWrapper({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const config = {};
  const handleWhatsAppDirect = () => window.open('https://wa.me/' + (''), '_blank');
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
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl font-black text-slate-900 mb-8">Nuestra Clínica</h2>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
          <h3 className="text-2xl font-black text-[#dbac43] mb-4">Quiénes Somos</h3>
          <p className="text-[#414242]/70 leading-relaxed">En Evolution Dental Center, nos dedicamos a transformar sonrisas en Piura...</p>
        </div>
        <div className="bg-[#414242] p-10 rounded-[3rem] shadow-xl text-white">
          <h3 className="text-2xl font-black mb-4">Tecnología de Punta</h3>
          <p className="opacity-90 leading-relaxed">Contamos con los equipos más modernos para diagnósticos precisos...</p>
        </div>
      </div>

      <section id="staff" className="py-24 px-0 mt-8 border-t border-[#c9c8c6]/30">
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