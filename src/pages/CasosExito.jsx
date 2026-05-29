import React, { useState } from 'react';
import { ZoomIn, ImageIcon } from 'lucide-react';

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

function CasosExito({ casos }) {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <PageWrapper>
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-black text-[#414242] mb-4">Casos de Éxito</h1>
        <p className="text-[#414242]/70">Transformaciones reales gestionadas por nuestro equipo. Mira resultados antes y después.</p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {casos?.filter(Boolean).length > 0 ? casos.map((caso, index) => (
          <div key={index} className="bg-white p-6 rounded-[3.5rem] shadow-xl border border-[#c9c8c6]/30 hover:shadow-[#dbac43]/10 transition-all">
            <p className="text-center font-black text-[#dbac43] uppercase tracking-[0.2em] text-sm mb-6 bg-[#dbac43]/10 py-3 rounded-2xl">{caso?.titulo || 'Caso Clínico'}</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative group cursor-pointer overflow-hidden rounded-[2rem]" onClick={() => setSelectedImg(caso?.antes)}>
                <img src={caso?.antes} alt="Antes" className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-[#414242] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">ANTES</div>
                <div className="absolute inset-0 bg-[#dbac43]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><ZoomIn className="text-white" size={32} /></div>
              </div>
              <div className="relative group cursor-pointer overflow-hidden rounded-[2rem]" onClick={() => setSelectedImg(caso?.despues)}>
                <img src={caso?.despues} alt="Despues" className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-[#dbac43] text-[#414242] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">DESPUÉS</div>
                <div className="absolute inset-0 bg-[#dbac43]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><ZoomIn className="text-white" size={32} /></div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-2 py-20 text-center bg-white rounded-[3rem] border border-dashed border-[#c9c8c6]">
            <ImageIcon className="mx-auto text-[#c9c8c6] mb-4" size={48} />
            <p className="text-[#c9c8c6] font-bold uppercase tracking-widest text-sm">No hay casos publicados todavía.</p>
          </div>
        )}
      </section>

      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-[2rem] shadow-2xl border-4 border-white/20" alt="Caso ampliado" />
        </div>
      )}
      </div>
    </PageWrapper>
  );
}

export default CasosExito;
