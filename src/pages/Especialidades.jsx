import React, { useState } from 'react';
import { Stethoscope, Award, ChevronRight } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

function PageWrapper({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleWhatsAppDirect = () => window.open('https://wa.me/' + (''), '_blank');
  return (
    <div>
      <Nav handleWhatsAppDirect={handleWhatsAppDirect} isScrolled={isScrolled} setIsChatOpen={setIsChatOpen} isChatOpen={isChatOpen} />
      {children}
      <Footer config={{}} />
    </div>
  );
}

function Especialidades({ servicios }) {
  return (
    <PageWrapper>
      <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <section className="px-6 max-w-7xl mx-auto mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-[#dbac43] bg-[#dbac43]/10 rounded-full uppercase tracking-widest mb-4">
          <Award size={14}/> Excelencia Odontológica
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
          Nuestras <span className="text-[#dbac43]">Especialidades</span>
        </h2>
        <p className="text-slate-500 text-lg mt-4 max-w-3xl mx-auto">
          Descubre todos los tratamientos especializados que ofrecemos en la Clínica Evolution Dental Center en Piura.
        </p>
      </section>

      <section className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {servicios?.filter(Boolean).map((s, index) => (
          <div key={index} className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all flex flex-col h-full">
            <div className="bg-[#dbac43] w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg">
              <Stethoscope size={32} />
            </div>
            <h4 className="font-black text-2xl mb-4 text-slate-800">{s.nombre}</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-medium flex-1">{s.descripcion}</p>
            <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between text-[#dbac43]">
               <span className="text-[10px] font-black uppercase tracking-widest">Información detallada</span>
               <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </section>
      </div>
    </PageWrapper>
  );
}

// ESTA LÍNEA ES LA QUE FALTABA Y ARREGLA EL ERROR
export default Especialidades;