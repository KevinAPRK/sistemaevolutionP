import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ChatbotPanel from '../components/ChatbotPanel';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft } from 'lucide-react';

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

export default function BlogPost() {
  const { id } = useParams();
  const [articulo, setArticulo] = useState(null);

  useEffect(() => {
    const fetchArticulo = async () => {
      if (!id) return;
      const { data, error } = await supabase.from('blog').select('*').eq('id', id).single();
      if (error) {
        console.error('Error cargando artículo:', error);
        return;
      }
      setArticulo(data);
    };
    fetchArticulo();
  }, [id]);

  return (
    <PageWrapper>
      <div className="pt-28 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[#414242] hover:text-[#dbac43]"><ChevronLeft size={18}/> Volver al Blog</Link>
        </div>

        {!articulo ? (
          <div className="py-20 text-center text-[#414242] font-medium">Cargando artículo...</div>
        ) : (
          <article className="bg-white rounded-[2rem] shadow-lg border border-[#c9c8c6]/30 overflow-hidden">
            {articulo.imagen_url && <img src={articulo.imagen_url} alt={articulo.titulo} className="w-full h-56 sm:h-72 md:h-96 object-cover" />}
            <div className="p-6 sm:p-8 md:p-16">
              <p className="text-xs font-black text-[#dbac43] uppercase tracking-widest mb-4">{articulo.fecha ? new Date(articulo.fecha).toLocaleDateString() : ''}</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 text-[#414242]">{articulo.titulo}</h1>
              <p className="text-base md:text-lg font-medium text-[#414242]/70 mb-8 italic border-l-4 border-[#dbac43] pl-4">{articulo.resumen}</p>
              <div className="text-[#414242]/80 text-base md:text-lg leading-relaxed space-y-6">
                {articulo.contenido ? articulo.contenido.split('\n').map((p, i) => <p key={i}>{p}</p>) : <p>No hay contenido disponible.</p>}
              </div>
            </div>
          </article>
        )}
      </div>
    </PageWrapper>
  );
}
