import React, { useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

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

function Blog({ articulos }) {
  return (
    <PageWrapper>
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <section className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#414242] mb-2">Novedades</h1>
          <p className="text-[#414242]/70">Salud Bucal y Prevención — artículos y noticias del equipo.</p>
        </div>
        <BookOpen className="text-[#dbac43]/30 hidden md:block" size={60} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articulos?.filter(Boolean).length > 0 ? articulos.map((art, index) => (
          <div key={index} className="bg-white rounded-[3rem] shadow-sm border border-[#c9c8c6]/30 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full">
            {art?.imagen_url && <img src={art.imagen_url} className="w-full h-56 object-cover" alt="" />}
            <div className="p-10 flex flex-col flex-1">
              <p className="text-[10px] font-black text-[#dbac43] uppercase tracking-widest mb-3">{art?.fecha ? new Date(art.fecha).toLocaleDateString() : 'Novedad'}</p>
              <h4 className="font-black text-2xl mb-4 text-[#414242] leading-tight">{art?.titulo || ''}</h4>
              <p className="text-[#414242]/70 text-sm line-clamp-3 mb-8">{art?.resumen || ''}</p>
              <div className="flex items-center text-[#dbac43] font-black text-xs uppercase tracking-widest gap-2">LEER MÁS <ChevronRight size={18} /></div>
            </div>
          </div>
        )) : (
          <div className="col-span-3 text-center text-[#414242] py-10 font-medium">No hay artículos publicados por el momento.</div>
        )}
      </section>
    </div>
  );
}

export default Blog;
