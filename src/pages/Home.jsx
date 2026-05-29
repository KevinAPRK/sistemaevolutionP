import React, { useState } from 'react';
import { 
  ShieldCheck, Award, Stethoscope, ChevronRight, Star, ZoomIn, 
  ImageIcon, BookOpen, Send, Activity, Monitor, UserCheck, Heart, TrendingUp
} from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

function PageWrapper({ children, config }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleWhatsAppDirect = () => window.open('https://wa.me/' + (config?.telefono || ''), '_blank');
  return (
    <div>
      <Nav handleWhatsAppDirect={handleWhatsAppDirect} isScrolled={isScrolled} setIsChatOpen={setIsChatOpen} isChatOpen={isChatOpen} />
      {children}
      <Footer config={config} />
    </div>
  );
}

function Home({ servicios, articulos, casos, config }) {
  const [selectedImg, setSelectedImg] = useState(null);

  const testimonios = [
    { id: 1, nombre: 'María Fernanda L.', texto: 'Excelente atención, los doctores son muy amables.', rating: 5 },
    { id: 2, nombre: 'Carlos Ruiz', texto: 'Me hice un diseño de sonrisa y quedó increíble.', rating: 5 },
    { id: 3, nombre: 'Ana López', texto: 'Instalaciones modernas y de primera calidad.', rating: 5 }
  ];

  return (
    <>
      {/* HERO SECTION ORIGINAL */}
      <header className="relative pt-40 pb-24 px-6 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 rounded-bl-[10rem] -z-10 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-black text-blue-700 bg-blue-100/50 rounded-full tracking-widest uppercase shadow-sm">
              <ShieldCheck size={14}/> Clínica Odontológica Especializada
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-slate-900">
              Tu sonrisa, <br/><span className="text-blue-600">nuestra historia.</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
              Tecnología de última generación, experiencia clínica y bioseguridad en cada tratamiento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button onClick={() => window.open(`https://wa.me/${config.telefono}`, '_blank')} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all">LLÁMANOS</button>
              <a href="#reserva" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all shadow-blue-200 text-center block">AGENDA TU CITA</a>
            </div>
          </div>
          <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative z-10">
            <h3 className="text-2xl font-black text-slate-800 mb-2">¡Solicita tu evaluación!</h3>
            <p className="text-slate-500 font-medium text-sm mb-8">Un especialista te contactará en breve.</p>
            <div className="space-y-5">
              <input type="text" placeholder="Nombre completo" className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 outline-none transition-all font-medium" />
              <input type="tel" placeholder="Número de Teléfono" className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 outline-none transition-all font-medium" />
              <textarea rows="3" placeholder="¿En qué podemos ayudarte?" className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 outline-none transition-all font-medium resize-none"></textarea>
              <button onClick={() => window.open(`https://wa.me/${config.telefono}`, '_blank')} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all">SOLICITAR CITA</button>
            </div>
          </div>
        </div>
      </header>

      {/* NOSOTROS ORIGINAL */}
      <section id="nosotros" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative bg-blue-600 rounded-[3.5rem] p-12 text-white shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-center">
            <ShieldCheck size={200} className="absolute -right-10 -bottom-10 opacity-10" />
            <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight relative z-10 leading-none">Especialistas<br/>en tu Salud<br/>Bucal</h3>
            <p className="text-xl font-medium text-blue-100 relative z-10 max-w-sm">Cuidamos de ti con la tecnología más avanzada.</p>
          </div>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-blue-700 bg-blue-50 rounded-full uppercase"><Award size={14}/> Clínica Evolution</div>
            <h4 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tighter">Implementamos tecnología de diagnóstico avanzada</h4>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">Contamos con equipos de vanguardia que nos permiten brindar tratamientos precisos, rápidos y seguros para ti y tu familia en la ciudad de Piura.</p>
          </div>
        </div>
      </section>

      {/* SERVICIOS ORIGINAL */}
      <section id="servicios" className="py-24 px-6 max-w-7xl mx-auto bg-white rounded-[4rem] shadow-sm border border-slate-100">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Nuestros Servicios</h3>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-10">
          {(servicios?.filter(Boolean).length > 0 ? servicios : ['Estética Dental', 'Periodoncia', 'Implantes', 'Ortodoncia']).map((s, index) => {
            const isReal = typeof s === 'object';
            return (
              <div key={index} className="bg-slate-50 p-10 rounded-[3rem] hover:bg-white hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-blue-50 flex flex-col h-full">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-8 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all"><Stethoscope size={32} /></div>
                <h4 className="font-black text-2xl mb-4 text-slate-800">{isReal ? s.nombre : s}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium flex-1">{isReal ? s.descripcion : 'Tratamiento especializado con tecnología avanzada.'}</p>
                <div className="mt-8 text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">VER MÁS <ChevronRight size={16} /></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GALERÍA ORIGINAL */}
      <section id="galeria" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Casos Clínicos de Éxito</h3>
          <p className="text-blue-600 font-bold mt-2 tracking-widest uppercase text-xs">Transformaciones reales gestionadas desde el panel</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {casos?.filter(Boolean).length > 0 ? casos.map((caso, index) => (
            <div key={index} className="bg-white p-6 rounded-[3.5rem] shadow-xl border border-slate-100">
              <p className="text-center font-black text-blue-600 uppercase tracking-[0.2em] text-sm mb-6 bg-blue-50/50 py-3 rounded-2xl">{caso.titulo}</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="relative group cursor-pointer overflow-hidden rounded-[2rem]" onClick={() => setSelectedImg(caso.antes)}>
                  <img src={caso.antes} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg">ANTES</div>
                </div>
                <div className="relative group cursor-pointer overflow-hidden rounded-[2rem]" onClick={() => setSelectedImg(caso.despues)}>
                  <img src={caso.despues} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg">DESPUÉS</div>
                </div>
              </div>
            </div>
          )) : <p className="col-span-2 text-center text-slate-400">No hay casos publicados.</p>}
        </div>
      </section>

      {/* BLOG ORIGINAL */}
      <section id="blog" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="flex justify-between items-end mb-16 px-4">
          <div><h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Novedades</h3><p className="text-slate-400 font-bold mt-1 uppercase text-xs">Salud Bucal y Prevención</p></div>
          <BookOpen className="text-blue-100 hidden md:block" size={60} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articulos?.filter(Boolean).length > 0 ? articulos.map((art, index) => (
            <div key={index} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full">
              {art.imagen_url && <img src={art.imagen_url} className="w-full h-56 object-cover" />}
              <div className="p-10 flex flex-col flex-1">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">{new Date(art.fecha).toLocaleDateString()}</p>
                <h4 className="font-black text-2xl mb-4 text-slate-800 leading-tight">{art.titulo}</h4>
                <p className="text-slate-500 text-sm line-clamp-3 mb-8">{art.resumen}</p>
                <div className="flex items-center text-blue-600 font-black text-xs uppercase tracking-widest gap-2">LEER MÁS <ChevronRight size={18} /></div>
              </div>
            </div>
          )) : <p className="col-span-3 text-center text-slate-400">Pronto nuevas noticias.</p>}
        </div>
      </section>

      {/* RESERVA ORIGINAL */}
      <section id="reserva" className="py-24 px-6 bg-slate-100">
        <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-slate-50 relative overflow-hidden mb-16">
          <h3 className="text-4xl font-black text-center mb-12 uppercase tracking-tighter">Reserva tu cita hoy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <input type="text" placeholder="Nombre completo" className="w-full p-6 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 font-medium" />
            <input type="tel" placeholder="Celular" className="w-full p-6 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 font-medium" />
            <textarea placeholder="¿Interesado en algún tratamiento?" rows="4" className="w-full p-6 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 font-medium md:col-span-2"></textarea>
            <button onClick={() => window.open(`https://wa.me/${config.telefono}`, '_blank')} className="w-full md:col-span-2 bg-blue-600 text-white py-6 rounded-2xl font-black shadow-2xl hover:bg-blue-700 flex justify-center items-center gap-3">ENVIAR POR WHATSAPP <Send size={20}/></button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-center"><h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4 text-blue-600">Evolution Dental Center</h2><p className="text-slate-500 font-medium italic">"Los mejores dentistas especialistas en salud y estética bucal en Piura."</p></div>
      </section>

      {/* LIGHTBOX */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-[2rem] shadow-2xl border-4 border-white/20 animate-in zoom-in-90 duration-300" />
        </div>
      )}
    </>
  );
    </>
}

export default Home;