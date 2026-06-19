import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronRight, X } from 'lucide-react';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ChatbotPanel from '../components/ChatbotPanel';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

function PageWrapper({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase.from('configuracion').select('*').eq('id', 1).limit(1);
      if (!error && data?.[0]) setConfig(data[0]);
    };

    fetchConfig();
  }, []);

  const handleWhatsAppDirect = () => window.open(`https://wa.me/${config?.telefono || ''}`, '_blank');
  return (
    <div>
      <Nav handleWhatsAppDirect={handleWhatsAppDirect} isScrolled={isScrolled} setIsChatOpen={setIsChatOpen} isChatOpen={isChatOpen} />
      {children}
      <ChatbotPanel config={config} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      <Footer config={config || {}} />
    </div>
  );
}

function Blog() {
  const [articulos, setArticulos] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase.from('blog').select('*').order('fecha', { ascending: false });
      if (error) {
        console.error('Error loading blog:', error);
        return;
      }
      setArticulos(data || []);
    };

    fetchBlog();
  }, []);

  return (
    <PageWrapper>
      <div className="pt-28 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <section className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#414242] mb-2">Novedades</h1>
          <p className="text-[#414242]/70">Salud Bucal y Prevención — artículos y noticias del equipo.</p>
        </div>
        <BookOpen className="text-[#dbac43]/30 hidden md:block" size={60} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articulos?.filter(Boolean).length > 0 ? articulos.map((art, index) => (
          <div key={index} onClick={() => setSelectedArticle(art)} className="bg-white rounded-[3rem] shadow-sm border border-[#c9c8c6]/30 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full">
            {art?.imagen_url && <img src={art.imagen_url} className="w-full h-56 object-cover" alt="" />}
            <div className="p-6 md:p-10 flex flex-col flex-1">
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
      
      {/* MODAL DE ARTÍCULO (EN LA MISMA PÁGINA) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#414242]/90 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}></div>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col">
            <button className="absolute top-4 right-4 md:top-8 md:right-8 z-20 bg-white/90 p-2.5 md:p-3 rounded-full shadow-lg text-[#414242]" onClick={() => setSelectedArticle(null)}><X size={22} /></button>
            <div className="overflow-y-auto">
              {selectedArticle?.imagen_url && <img src={selectedArticle.imagen_url} className="w-full h-56 md:h-80 object-cover" alt="" />}
              <div className="p-6 sm:p-8 md:p-20">
                <p className="text-xs font-black text-[#dbac43] uppercase tracking-widest mb-4">{selectedArticle?.fecha ? new Date(selectedArticle.fecha).toLocaleDateString() : ''}</p>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-6 leading-tight md:leading-none text-[#414242]">{selectedArticle?.titulo || ''}</h2>
                <p className="text-base md:text-xl font-medium text-[#414242]/60 mb-8 md:mb-10 italic border-l-4 border-[#dbac43] pl-4">{selectedArticle?.resumen || ''}</p>
                <div className="space-y-6 md:space-y-8 text-[#414242]/80 text-base md:text-lg leading-relaxed font-medium">
                  {selectedArticle?.contenido ? selectedArticle.contenido.split('\n').map((parrafo, i) => <p key={i}>{parrafo}</p>) : <p>Cargando información...</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageWrapper>
  );
}

export default Blog;
