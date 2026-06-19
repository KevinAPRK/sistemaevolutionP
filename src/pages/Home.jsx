import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Award, Stethoscope, ChevronRight, Star, ZoomIn, 
  ImageIcon, BookOpen, Send, Activity, Monitor, UserCheck, Heart, TrendingUp
} from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ChatbotPanel from '../components/ChatbotPanel';
import { supabase } from '../lib/supabaseClient';
import { X } from 'lucide-react';

function PageWrapper({ children, config }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pageConfig, setPageConfig] = useState(config || null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase.from('configuracion').select('*').eq('id', 1).limit(1);
      if (!error && data?.[0]) setPageConfig(data[0]);
    };

    if (!pageConfig) fetchConfig();
  }, []);

  const handleWhatsAppDirect = () => window.open(`https://wa.me/${pageConfig?.telefono || config?.telefono || ''}`, '_blank');
  return (
    <div>
      <Nav handleWhatsAppDirect={handleWhatsAppDirect} isScrolled={isScrolled} setIsChatOpen={setIsChatOpen} isChatOpen={isChatOpen} />
      {children}
      <ChatbotPanel config={pageConfig || config} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      <Footer config={pageConfig || config} />
    </div>
  );
}

function Home({ servicios, articulos, casos, config }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', servicio: '' });
  const [isSending, setIsSending] = useState(false);
  const [medicos, setMedicos] = useState([]);
  const [casosClinicos, setCasosClinicos] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
  const [articulosBlog, setArticulosBlog] = useState([]);
  const phone = config?.telefono || '51969826870';
  const serviciosBase = servicios?.filter(Boolean).length > 0 ? servicios : ['Estética Dental', 'Periodoncia', 'Implantes', 'Ortodoncia'];
  const serviciosCarousel = [...serviciosBase, ...serviciosBase];
  const medicosCarousel = [...medicos, ...medicos];
  const testimoniosCarousel = [...testimonios, ...testimonios];
  const casosData = casosClinicos?.filter(Boolean).length > 0 ? casosClinicos.filter(Boolean) : (casos?.filter(Boolean) || []);
  const featuredCase = casosData[0] || null;
  const miniCases = casosData.slice(1, 3);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const payload = {
      nombre: formData.nombre,
      telefono: formData.telefono,
      mensaje: formData.servicio,
    };

    const { error } = await supabase.from('consultas').insert([payload]);
    if (error) {
      console.error('Error guardando consulta en Home:', error);
      alert('No se pudo guardar la consulta en la base de datos.');
      setIsSending(false);
      return;
    }

    const whatsappMessage = `Hola Evolution Dental, deseo agendar una cita.%0A%0ANombre del paciente: ${formData.nombre}%0AServicio interesado: ${formData.servicio}`;
    window.open(`https://wa.me/${phone}?text=${whatsappMessage}`, '_blank');
    setFormData({ nombre: '', telefono: '', servicio: '' });
    setIsSending(false);
  };

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

    const fetchCasosYTestimonios = async () => {
      const [{ data: casosData, error: casosError }, { data: testimoniosData, error: testimoniosError }] = await Promise.all([
        supabase.from('casos-clinicos').select('*').order('created_at', { ascending: false }),
        supabase.from('testimonios').select('*').order('created_at', { ascending: false })
      ]);

      if (casosError) {
        console.error('Error loading casos-clinicos:', casosError);
      } else {
        setCasosClinicos(casosData || []);
      }

      if (testimoniosError) {
        console.error('Error loading testimonios:', testimoniosError);
      } else {
        setTestimonios((testimoniosData || []).filter((t) => t.aprobado !== false));
      }
    };

    const fetchBlog = async () => {
      const { data, error } = await supabase.from('blog').select('*').order('fecha', { ascending: false });
      if (error) {
        console.error('Error loading blog:', error);
        return;
      }
      setArticulosBlog(data || []);
    };

    fetchCasosYTestimonios();
    fetchBlog();
  }, []);

  return (
    <PageWrapper config={config}>
      {/* HERO SECTION ORIGINAL */}
      <header className="relative pt-28 md:pt-40 pb-16 md:pb-24 px-4 sm:px-6 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#dbac43]/5 rounded-bl-[10rem] -z-10 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-black text-[#dbac43] bg-[#dbac43]/10 rounded-full tracking-widest uppercase shadow-sm">
              <ShieldCheck size={14}/> Clínica Odontológica Especializada
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-slate-900">
              Tu sonrisa, <br/><span className="text-[#dbac43]">nuestra historia.</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
              Tecnología de última generación, experiencia clínica y bioseguridad en cada tratamiento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button onClick={() => window.open(`https://wa.me/${phone}`, '_blank')} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all">LLÁMANOS</button>
              <a href="#reserva" className="w-full sm:w-auto bg-[#dbac43] text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-[#dbac43] transition-all shadow-[#dbac43]/20 text-center block">AGENDA TU CITA</a>
            </div>
          </div>
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2.25rem] md:rounded-[3rem] shadow-2xl border border-slate-100 relative z-10">
            <h3 className="text-2xl font-black text-slate-800 mb-2">¡Solicita tu evaluación!</h3>
            <p className="text-slate-500 font-medium text-sm mb-8">Un especialista te contactará en breve.</p>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <input type="text" placeholder="Nombre completo" required className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 outline-none transition-all font-medium" onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} value={formData.nombre} />
              <input type="tel" placeholder="Número de Teléfono" required className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 outline-none transition-all font-medium" onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} value={formData.telefono} />
              <textarea rows="3" placeholder="Servicio interesado, por ejemplo: ortodoncia, implantes, limpieza dental" required className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 outline-none transition-all font-medium resize-none" onChange={(e) => setFormData({ ...formData, servicio: e.target.value })} value={formData.servicio}></textarea>
              <button type="submit" className="w-full bg-[#dbac43] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-[#dbac43] transition-all">SOLICITAR CITA</button>
            </form>
          </div>
        </div>
      </header>

      {/* NOSOTROS ORIGINAL */}
      <section id="nosotros" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative bg-[#dbac43] rounded-[2.25rem] md:rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden min-h-[320px] md:min-h-[400px] flex flex-col justify-center">
            <ShieldCheck size={200} className="absolute -right-10 -bottom-10 opacity-10" />
            <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight relative z-10 leading-none">Especialistas<br/>en tu Salud<br/>Bucal</h3>
            <p className="text-xl font-medium text-[#c9c8c6] relative z-10 max-w-sm">Cuidamos de ti con la tecnología más avanzada.</p>
          </div>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-[#dbac43] bg-[#dbac43]/5 rounded-full uppercase"><Award size={14}/> Clínica Evolution</div>
            <h4 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tighter">Implementamos tecnología de diagnóstico avanzada</h4>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">Contamos con equipos de vanguardia que nos permiten brindar tratamientos precisos, rápidos y seguros para ti y tu familia en la ciudad de Piura.</p>
          </div>
        </div>
      </section>

      {/* SERVICIOS ORIGINAL */}
      <section id="servicios" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto bg-white rounded-[2.25rem] md:rounded-[4rem] shadow-sm border border-slate-100">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Nuestros Servicios</h3>
          <div className="w-20 h-1.5 bg-[#dbac43] mx-auto mt-6 rounded-full"></div>
        </div>
        <div className="overflow-hidden px-4 md:px-10">
          <div className="carousel-track carousel-track-services flex w-max gap-8 py-2">
          {serviciosCarousel.map((s, index) => {
            const isReal = typeof s === 'object';
            return (
              <div key={`${index}-${isReal ? s.nombre : s}`} className="bg-slate-50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] hover:bg-white hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-[#dbac43]/10 flex flex-col h-full w-[280px] sm:w-[320px] shrink-0">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-[#dbac43] mb-8 shadow-sm group-hover:bg-[#dbac43] group-hover:text-white transition-all"><Stethoscope size={32} /></div>
                <h4 className="font-black text-2xl mb-4 text-slate-800">{isReal ? s.nombre : s}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium flex-1">{isReal ? s.descripcion : 'Tratamiento especializado con tecnología avanzada.'}</p>
                <div className="mt-8 text-[#dbac43] font-black text-xs uppercase tracking-widest flex items-center gap-2">VER MÁS <ChevronRight size={16} /></div>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* STAFF EN CARRUSEL */}
      <section id="staff" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Nuestro Staff Médico</h3>
          <p className="text-[#dbac43] font-bold mt-2 tracking-widest uppercase text-xs">Doctores y especialistas de Evolution Dental</p>
          <div className="w-20 h-1.5 bg-[#dbac43] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="overflow-hidden pb-4 -mx-6 px-6">
          <div className="carousel-track carousel-track-staff flex w-max gap-6 py-2">
            {medicosCarousel.length > 0 ? medicosCarousel.map((m, index) => (
              <article key={`${m.id || index}-${index}`} className="shrink-0 w-[290px] sm:w-[340px] rounded-[3rem] overflow-hidden bg-[#414242] shadow-xl relative group">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {m.imagen_url ? (
                    <img src={m.imagen_url} alt={m.nombre} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#414242] text-[#dbac43]"><Stethoscope size={72} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#414242] via-[#414242]/40 to-transparent"></div>
                </div>
                <div className="p-8 absolute bottom-0 left-0 w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#dbac43]/10 text-[#dbac43] text-[10px] font-black uppercase tracking-widest mb-4">Staff</div>
                  <h4 className="font-black text-2xl text-white leading-tight mb-2">{m.nombre}</h4>
                  <p className="text-[#dbac43] font-black uppercase tracking-widest text-xs">{m.especialidad}</p>
                </div>
              </article>
            )) : (
              <div className="w-full py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                Cargando el equipo de especialistas...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CASOS CLINICOS DE EXITO */}
      <section id="galeria" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Casos Clínicos de Éxito</h3>
          <p className="text-slate-600 max-w-4xl mx-auto mt-4 leading-relaxed">
            Conoce algunas transformaciones reales realizadas por nuestro equipo. Cada sonrisa refleja un tratamiento personalizado, seguro y enfocado en mejorar la estética, función y confianza de nuestros pacientes.
          </p>
        </div>

        {featuredCase ? (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
              <article className="xl:col-span-2 bg-white p-6 md:p-8 rounded-[3rem] shadow-xl border border-slate-100">
                <div className="flex items-center justify-between mb-6 gap-4">
                  <h4 className="font-black text-2xl md:text-3xl text-slate-900 tracking-tight">{featuredCase.titulo || 'Caso destacado'}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-[#dbac43]/10 text-[#dbac43] px-3 py-1.5 rounded-full">Caso Destacado</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative group cursor-pointer overflow-hidden rounded-[2rem]" onClick={() => setSelectedImg(featuredCase.antes)}>
                    <img src={featuredCase.antes} alt="Antes" className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">ANTES</div>
                    <div className="absolute inset-0 bg-[#dbac43]/0 group-hover:bg-[#dbac43]/20 transition-colors flex items-center justify-center"><ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={30} /></div>
                  </div>
                  <div className="relative group cursor-pointer overflow-hidden rounded-[2rem]" onClick={() => setSelectedImg(featuredCase.despues)}>
                    <img src={featuredCase.despues} alt="Despues" className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-[#dbac43] text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">DESPUÉS</div>
                    <div className="absolute inset-0 bg-[#dbac43]/0 group-hover:bg-[#dbac43]/20 transition-colors flex items-center justify-center"><ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={30} /></div>
                  </div>
                </div>
              </article>

              <div className="space-y-4">
                {miniCases.map((caso, index) => (
                  <article key={`${caso.id || index}-${caso.titulo || 'mini-caso'}`} className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
                    <h5 className="font-black text-slate-900 text-sm uppercase tracking-wide mb-3">{caso.titulo || `Caso ${index + 2}`}</h5>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="relative overflow-hidden rounded-xl cursor-pointer" onClick={() => setSelectedImg(caso.antes)}>
                        <img src={caso.antes} alt="Antes" className="w-full h-20 object-cover" />
                        <span className="absolute top-1.5 left-1.5 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Antes</span>
                      </div>
                      <div className="relative overflow-hidden rounded-xl cursor-pointer" onClick={() => setSelectedImg(caso.despues)}>
                        <img src={caso.despues} alt="Despues" className="w-full h-20 object-cover" />
                        <span className="absolute top-1.5 left-1.5 bg-[#dbac43] text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Después</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">Resultado visible en estética y funcionalidad, con tratamiento adaptado al paciente.</p>
                  </article>
                ))}

                {miniCases.length === 0 && (
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-dashed border-slate-200 text-center text-slate-400 text-sm font-medium">
                    Pronto agregaremos más casos clínicos.
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => {
                  const mensaje = encodeURIComponent('Hola Evolution Dental Center, quiero una evaluación.');
                  window.open(`https://wa.me/${phone}?text=${mensaje}`, '_blank');
                }}
                className="bg-[#dbac43] text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:brightness-105 transition-all"
              >
                Quiero una evaluación
              </button>
            </div>
          </>
        ) : (
          <div className="py-16 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <ImageIcon className="mx-auto text-slate-300 mb-4" size={42} />
            <p className="text-slate-400 font-semibold">No hay casos publicados por el momento.</p>
          </div>
        )}
      </section>

      {/* COMENTARIOS DE PACIENTES */}
      <section id="comentarios" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Comentarios de Pacientes</h3>
          <p className="text-[#dbac43] font-bold mt-2 tracking-widest uppercase text-xs">Opiniones publicadas desde la base de datos</p>
          <div className="w-20 h-1.5 bg-[#dbac43] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="overflow-hidden relative">
          <div className="carousel-track carousel-track-testimonials flex w-max gap-8 py-2">
            {testimoniosCarousel.length > 0 ? (
              testimoniosCarousel.map((t, index) => (
                <div key={`${t.id}-${index}`} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-[#c9c8c6]/30 flex flex-col justify-between w-[320px] sm:w-[360px] shrink-0">
                  <div>
                    <div className="flex gap-1 mb-6 text-[#dbac43]">
                      {[...Array(Math.max(0, Math.min(5, parseInt(t.estrellas) || 5)))].map((_, i) => (
                        <Star key={i} fill="currentColor" size={18} />
                      ))}
                    </div>
                    <p className="text-[#414242]/80 font-medium leading-relaxed mb-8 italic">"{t.comentario}"</p>
                  </div>
                  <h4 className="font-black text-[#414242] uppercase text-xs tracking-wider border-t border-[#c9c8c6]/20 pt-4">👤 {t.nombre}</h4>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-slate-400 font-medium py-10">Déjanos tu opinión para aparecer aquí.</div>
            )}
          </div>
        </div>
      </section>

      {/* BLOG ORIGINAL */}
      <section id="blog" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="flex justify-between items-end mb-16 px-4">
          <div><h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Novedades</h3><p className="text-slate-400 font-bold mt-1 uppercase text-xs">Salud Bucal y Prevención</p></div>
          <BookOpen className="text-[#dbac43]/30 hidden md:block" size={60} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articulosBlog?.filter(Boolean).length > 0 ? articulosBlog.map((art, index) => (
            <div key={`${index}-${art.titulo || 'blog'}`} onClick={() => setSelectedArticle(art)} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full">
              {art.imagen_url && <img src={art.imagen_url} className="w-full h-56 object-cover" />}
              <div className="p-10 flex flex-col flex-1">
                <p className="text-[10px] font-black text-[#dbac43] uppercase tracking-widest mb-3">{art.fecha ? new Date(art.fecha).toLocaleDateString() : 'Novedad'}</p>
                <h4 className="font-black text-2xl mb-4 text-slate-800 leading-tight">{art.titulo}</h4>
                <p className="text-slate-500 text-sm line-clamp-3 mb-8">{art.resumen}</p>
                <div className="flex items-center text-[#dbac43] font-black text-xs uppercase tracking-widest gap-2">LEER MÁS <ChevronRight size={18} /></div>
              </div>
            </div>
          )) : <p className="col-span-3 text-center text-slate-400">Pronto nuevas noticias.</p>}
        </div>
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

      {/* RESERVA ORIGINAL */}
      <section id="reserva" className="py-16 md:py-24 px-4 sm:px-6 bg-slate-100">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-20 rounded-[2.25rem] md:rounded-[4rem] shadow-2xl border border-slate-50 relative overflow-hidden mb-12 md:mb-16">
          <h3 className="text-3xl md:text-4xl font-black text-center mb-8 md:mb-12 uppercase tracking-tighter">Reserva tu cita hoy</h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <input type="text" placeholder="Nombre completo" required className="w-full p-6 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#dbac43] font-medium" onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} value={formData.nombre} />
            <input type="tel" placeholder="Celular" required className="w-full p-6 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#dbac43] font-medium" onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} value={formData.telefono} />
            <textarea placeholder="Servicio interesado, por ejemplo: ortodoncia, implantes, limpieza dental" rows="4" required className="w-full p-6 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#dbac43] font-medium md:col-span-2 resize-none" onChange={(e) => setFormData({ ...formData, servicio: e.target.value })} value={formData.servicio}></textarea>
            <button type="submit" className="w-full md:col-span-2 bg-[#dbac43] text-white py-6 rounded-2xl font-black shadow-2xl hover:bg-[#dbac43] flex justify-center items-center gap-3">ENVIAR POR WHATSAPP <Send size={20}/></button>
          </form>
        </div>
        <div className="max-w-4xl mx-auto text-center"><h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4 text-[#dbac43]">Evolution Dental Center</h2><p className="text-slate-500 font-medium italic">"Los mejores dentistas especialistas en salud y estética bucal en Piura."</p></div>
      </section>

      {/* LIGHTBOX */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-[2rem] shadow-2xl border-4 border-white/20 animate-in zoom-in-90 duration-300" />
        </div>
      )}
    </PageWrapper>
  );
}

export default Home;