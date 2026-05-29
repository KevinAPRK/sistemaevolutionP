import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { 
  MessageCircle, Phone, Activity, Smile, ShieldCheck, Zap, 
  ChevronRight, Stethoscope, Send, X, Users, BookOpen,
  MapPin, Clock, Target, Eye, Camera, ZoomIn, Award, ChevronDown,
  Monitor, Heart, TrendingUp, UserCheck, Star, ImageIcon, CheckCircle2,
  ExternalLink
} from 'lucide-react';

const iconMap = { Smile, Activity, Zap, ShieldCheck, Stethoscope };

function App() {
  const [servicios, setServicios] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [casos, setCasos] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
  const [medicos, setMedicos] = useState([]); 
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatResponse, setChatResponse] = useState(null);
  
  const [formData, setFormData] = useState({ nombre: '', telefono: '', mensaje: '' });
  const [isSending, setIsSending] = useState(false);

  // Estado para controlar el cambio de color del Navbar al hacer Scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // Estados del Módulo de Testimonios
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewToast, setShowReviewToast] = useState(false);
  const [isSendingReview, setIsSendingReview] = useState(false);
  const [newReview, setNewReview] = useState({ nombre: '', comentario: '', estrellas: 5 });

  const [config, setConfig] = useState({
    telefono: '51969826870',
    email: 'evolutiondentalcenter@gmail.com',
    direccion: 'Calle - Los Brillantes, Urb. Miraflores Mz N Lt. 12, Castilla, Piura',
    horario_semana: '9:00 a.m. - 8:00 p.m.',
    horario_sabado: '9:00 a.m. - 8:00 p.m.',
    mensaje_bot: '¡Hola! Bienvenidos a Evolution Dental. ¿En qué podemos ayudarte hoy?'
  });

  const fetchTestimonios = async () => {
    try {
      const { data } = await supabase.from('testimonios').select('*').eq('aprobado', true).order('created_at', { ascending: false });
      if (data) setTestimonios(data);
    } catch (err) { console.error("Error cargando testimonios:", err); }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const fetchData = async () => {
      try {
        const { data: sData } = await supabase.from('servicios').select('*');
        if (sData) setServicios(sData);

        const { data: bData } = await supabase.from('blog').select('*').order('fecha', { ascending: false });
        if (bData) setArticulos(bData);

        const { data: cData } = await supabase.from('casos-clinicos').select('*').order('created_at', { ascending: false });
        if (cData) setCasos(cData);

        const { data: mData } = await supabase.from('medicos').select('*').order('created_at', { ascending: true });
        if (mData) setMedicos(mData);

        const { data: configData } = await supabase.from('configuracion').select('*').eq('id', 1).single();
        if (configData) setConfig(configData);

        await fetchTestimonios();
      } catch (err) { console.error("Error sincronizando datos:", err); }
    };
    
    fetchData();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppDirect = () => {
    const phone = config?.telefono || '51969826870';
    window.open(`https://wa.me/${phone}?text=Hola Evolution Dental, solicito información.`, '_blank');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const { error } = await supabase.from('consultas').insert([formData]);
    if (!error) {
      const phone = config?.telefono || '51969826870';
      window.open(`https://wa.me/${phone}?text=Hola, mi nombre es ${formData.nombre}. Consulta: ${formData.mensaje}`, '_blank');
      setFormData({ nombre: '', telefono: '', mensaje: '' });
    }
    setIsSending(false);
  };

  const handleSendReview = async (e) => {
    e.preventDefault();
    setIsSendingReview(true);
    try {
      const { error } = await supabase.from('testimonios').insert([newReview]);
      if (!error) {
        setShowReviewForm(false);
        setNewReview({ nombre: '', comentario: '', estrellas: 5 });
        setShowReviewToast(true);
        setTimeout(() => setShowReviewToast(false), 4000);
      }
    } catch (err) { console.error(err); }
    setIsSendingReview(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#414242] selection:bg-[#dbac43]/20 selection:text-[#414242] overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-[80] transition-all duration-500 ${
        isScrolled ? 'bg-black shadow-2xl py-4' : 'bg-[#414242] border-b border-[#c9c8c6]/10 py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo Principal Limpio */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src="/logo.png" alt="Evolution Dental Center" className={`w-auto object-contain transition-all duration-500 ${
              isScrolled ? 'h-12 md:h-14' : 'h-16 md:h-22'
            }`} />
          </div>

          {/* Menú de Enlaces con Hover Dorado forzado */}
            <div className="hidden lg:flex items-center gap-8 font-bold text-sm text-white">
              <Link to="/nosotros" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-4">Nosotros</Link>
              <Link to="/especialidades" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-4">Especialidades</Link>
              <Link to="/casos-de-exito" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-4">Casos de Éxito</Link>
              <Link to="/blog" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-4">Blog</Link>
            </div>

          <div className="flex items-center gap-4">
            <button onClick={handleWhatsAppDirect} className="flex items-center gap-2 bg-[#dbac43] text-[#414242] px-6 py-2.5 rounded-full font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-[#dbac43]/20"><Phone size={16} /> WhatsApp</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#dbac43]/5 rounded-bl-[10rem] -z-10 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-black text-[#dbac43] bg-[#dbac43]/10 rounded-full tracking-widest uppercase shadow-sm"><ShieldCheck size={14}/> Clínica Odontológica VIP</div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-[#414242]">Tu sonrisa, <br/><span className="text-[#dbac43]">nuestra historia.</span></h2>
            <p className="text-[#414242]/70 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">Tecnología de última generación, experiencia clínica y bioseguridad en cada tratamiento en la ciudad de Piura.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button onClick={handleWhatsAppDirect} className="w-full sm:w-auto bg-[#414242] text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-opacity-90 transition-all">LLÁMANOS</button>
              <a href="#reserva" className="w-full sm:w-auto bg-[#dbac43] text-[#414242] px-8 py-4 rounded-2xl font-black shadow-xl hover:brightness-105 transition-all shadow-[#dbac43]/30 text-center block">AGENDA TU CITA</a>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl border border-[#c9c8c6]/30 relative z-10">
            <h3 className="text-2xl font-black text-[#414242] mb-2">¡Solicita tu evaluación!</h3>
            <p className="text-[#414242]/70 font-medium text-sm mb-8">Un especialista de Evolution Dental Center te contactará en breve.</p>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <input type="text" placeholder="Nombre completo" required className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#dbac43] outline-none transition-all font-medium" onChange={(e)=>setFormData({...formData, nombre: e.target.value})} value={formData.nombre} />
              <input type="tel" placeholder="Número de Teléfono" required className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#dbac43] outline-none transition-all font-medium" onChange={(e)=>setFormData({...formData, telefono: e.target.value})} value={formData.telefono} />
              <textarea rows="3" required placeholder="¿En qué podemos ayudarte?" className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#dbac43] outline-none transition-all font-medium resize-none" onChange={(e)=>setFormData({...formData, mensaje: e.target.value})} value={formData.mensaje}></textarea>
              <button type="submit" disabled={isSending} className="w-full bg-[#dbac43] text-[#414242] py-5 rounded-2xl font-black shadow-xl hover:brightness-105 transition-all active:scale-95">{isSending ? 'PROCESANDO...' : 'SOLICITAR CITA'}</button>
            </form>
          </div>
        </div>
      </header>

      {/* SECCIÓN NOSOTROS */}
      <section id="nosotros" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative bg-[#414242] rounded-[3.5rem] p-12 text-white shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-center border-b-8 border-[#dbac43]">
            <ShieldCheck size={200} className="absolute -right-10 -bottom-10 opacity-5" />
            <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight relative z-10 leading-none">Especialistas<br/>en tu Salud<br/>Bucal</h3>
            <p className="text-xl font-medium text-[#c9c8c6] relative z-10 max-w-sm">Cuidamos de ti con la tecnología más avanzada.</p>
          </div>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-[#dbac43] bg-[#dbac43]/10 rounded-full uppercase"><Award size={14}/> Clínica Evolution</div>
            <h4 className="text-3xl md:text-4xl font-black text-[#414242] leading-tight tracking-tighter">Implementamos tecnología de diagnóstico avanzada</h4>
            <p className="text-[#414242]/70 text-lg leading-relaxed font-medium">Contamos con equipos de vanguardia que nos permiten brindar tratamientos precisos, rápidos y seguros para ti y tu familia.</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN DINÁMICA: STAFF MÉDICO */}
      <section id="staff" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#c9c8c6]/30">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-[#414242]">Nuestro Staff Médico</h3>
          <div className="w-20 h-1.5 bg-[#dbac43] mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-10">
          {medicos.length > 0 ? medicos.map((m) => (
            <div key={m.id} className="relative rounded-[3rem] overflow-hidden group cursor-pointer aspect-[4/5] shadow-lg hover:shadow-2xl transition-shadow duration-500">
              <img src={m.imagen_url} alt={m.nombre} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#414242] via-[#414242]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h4 className="font-black text-2xl md:text-3xl text-white leading-tight mb-2 drop-shadow-md">{m.nombre}</h4>
                <p className="text-[#dbac43] font-black uppercase tracking-widest text-xs drop-shadow-md">{m.especialidad}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center text-[#c9c8c6] font-bold uppercase tracking-widest text-xs py-10">
              Cargando el equipo de especialistas...
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN SERVICIOS */}
      <section id="servicios" className="py-24 px-6 max-w-7xl mx-auto bg-white rounded-[4rem] shadow-sm border border-[#c9c8c6]/30">
        <div className="text-center mb-16"><h3 className="text-4xl font-black uppercase tracking-tighter text-[#414242]">Nuestros Servicios</h3><div className="w-20 h-1.5 bg-[#dbac43] mx-auto mt-6 rounded-full"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-10">
          {(servicios?.filter(Boolean).length > 0 ? servicios : ['Estética Dental', 'Periodoncia', 'Implantes', 'Ortodoncia', 'Endodoncia']).map((s, index) => {
            const isReal = typeof s === 'object';
            const Icon = (isReal && s.icono && iconMap[s.icono]) ? iconMap[s.icono] : Stethoscope;
            return (
              <div key={index} className="bg-[#fafafa] p-10 rounded-[3rem] hover:bg-white hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-[#dbac43]/30 flex flex-col h-full cursor-pointer">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-[#dbac43] mb-8 shadow-sm group-hover:bg-[#dbac43] group-hover:text-white transition-all"><Icon size={32} /></div>
                <h4 className="font-black text-2xl mb-4 text-[#414242]">{isReal ? s.nombre : s}</h4>
                <p className="text-[#414242]/70 text-sm leading-relaxed font-medium flex-1">{isReal ? s.descripcion : 'Tratamiento especializado con tecnología avanzada.'}</p>
                <div className="mt-8 text-[#dbac43] font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">VER MÁS <ChevronRight size={16} /></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECCIÓN TESTIMONIOS */}
      <section id="testimonios" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#c9c8c6]/30">
        <div className="text-center mb-16"><h3 className="text-4xl font-black uppercase tracking-tighter text-[#414242]">Pacientes Felices</h3><div className="w-20 h-1.5 bg-[#dbac43] mx-auto mt-6 rounded-full"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.length > 0 ? testimonios.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-[#c9c8c6]/30 flex flex-col justify-between">
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
          )) : (
            <div className="col-span-3 text-center text-[#c9c8c6] font-medium py-10">Déjanos tu opinión para figurar en nuestra comunidad dental.</div>
          )}
        </div>
        <div className="text-center mt-16">
          <button onClick={() => setShowReviewForm(true)} className="bg-[#414242] text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-[#dbac43] hover:text-[#414242] transition-all uppercase text-xs tracking-widest">DEJAR UN COMENTARIO</button>
        </div>
      </section>

      {/* MODAL FORMULARIO DE CALIFICACIÓN */}
      {showReviewForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#414242]/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
            <button className="absolute top-6 right-6 bg-[#c9c8c6]/20 p-2 rounded-full hover:bg-[#c9c8c6]/40 transition-colors" onClick={() => setShowReviewForm(false)}><X size={20} className="text-[#414242]"/></button>
            <h3 className="text-2xl font-black text-[#414242] mb-2">Evalúa tu Experiencia</h3>
            <p className="text-[#414242]/60 font-medium text-xs mb-8">Tu opinión ayuda a mantener la excelencia de nuestro equipo.</p>
            <form onSubmit={handleSendReview} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-[#414242]/50 uppercase tracking-wider mb-2 block">Nombre completo</label>
                <input type="text" required placeholder="Ej: María Fernanda L." className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#dbac43] outline-none font-medium text-sm" value={newReview.nombre} onChange={(e)=>setNewReview({...newReview, nombre: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-[#414242]/50 uppercase tracking-wider mb-2 block">Calificación</label>
                <select className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#dbac43] outline-none font-bold text-sm text-[#414242] cursor-pointer" value={newReview.estrellas} onChange={(e)=>setNewReview({...newReview, estrellas: parseInt(e.target.value)})}>
                  <option value="5">⭐⭐⭐⭐⭐ Excelente atención</option>
                  <option value="4">⭐⭐⭐⭐ Muy buena experiencia</option>
                  <option value="3">⭐⭐⭐ Buena / Regular</option>
                  <option value="2">⭐⭐ Deficiente</option>
                  <option value="1">⭐ Mala experiencia</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-[#414242]/50 uppercase tracking-wider mb-2 block">Tu Testimonio</label>
                <textarea required rows="4" placeholder="Cuéntanos sobre la atención de tus doctores..." className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#dbac43] outline-none font-medium text-sm resize-none" value={newReview.comentario} onChange={(e)=>setNewReview({...newReview, comentario: e.target.value})}></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={isSendingReview} className="flex-1 bg-[#dbac43] text-[#414242] py-4 rounded-2xl font-black shadow-xl hover:brightness-105 active:scale-95 transition-all text-xs tracking-widest uppercase">{isSendingReview ? 'PROCESANDO...' : 'ENVIAR OPINIÓN'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {showReviewToast && (
        <div className="fixed bottom-10 left-10 z-[150] bg-white border border-[#c9c8c6]/30 p-6 rounded-[2rem] shadow-2xl flex items-start gap-4 max-w-md animate-in slide-in-from-left-10 duration-500">
          <div className="bg-[#dbac43]/20 p-2.5 rounded-xl text-[#dbac43]"><CheckCircle2 size={24}/></div>
          <div>
            <h5 className="font-black text-[#414242] text-sm">¡Comentario Guardado!</h5>
            <p className="text-[#414242]/60 font-medium text-xs mt-1 leading-relaxed">Tu reseña ha sido enviada con éxito. Se publicará en el portal en cuanto la administración la verifique de forma reglamentaria.</p>
          </div>
        </div>
      )}

      {/* SECCIÓN CASOS CLÍNICOS */}
      <section id="galeria" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#c9c8c6]/30">
        <div className="text-center mb-16"><h3 className="text-4xl font-black uppercase tracking-tighter text-[#414242]">Casos Clínicos de Éxito</h3><p className="text-[#dbac43] font-bold mt-2 tracking-widest uppercase text-xs">Transformaciones reales gestionadas desde el panel</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                  <img src={caso?.despues} alt="Después" className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
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
        </div>
      </section>

      {/* SECCIÓN BLOG */}
      <section id="blog" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#c9c8c6]/30">
        <div className="flex justify-between items-end mb-16 px-4">
          <div><h3 className="text-4xl font-black uppercase tracking-tighter text-[#414242]">Novedades</h3><p className="text-[#414242]/50 font-bold mt-1 uppercase text-xs">Salud Bucal y Prevención</p></div>
          <BookOpen className="text-[#dbac43]/30 hidden md:block" size={60} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articulos?.filter(Boolean).length > 0 ? articulos.map((art, index) => (
            <div key={index} onClick={() => setSelectedArticle(art)} className="bg-white rounded-[3rem] shadow-sm border border-[#c9c8c6]/30 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full">
              {art?.imagen_url && (<div className="overflow-hidden"><img src={art.imagen_url} alt="Blog" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700" /></div>)}
              <div className="p-10 flex flex-col flex-1">
                <p className="text-[10px] font-black text-[#dbac43] uppercase tracking-widest mb-3">{art?.fecha ? new Date(art.fecha).toLocaleDateString() : 'Novedad'}</p>
                <h4 className="font-black text-2xl mb-4 text-[#414242] leading-tight group-hover:text-[#dbac43] transition-colors">{art?.titulo || 'Blog'}</h4>
                <p className="text-[#414242]/70 text-sm line-clamp-3 mb-8 font-medium leading-relaxed flex-1">{art?.resumen || 'Haz clic para leer el artículo completo...'}</p>
                <div className="flex items-center text-[#dbac43] font-black text-xs uppercase tracking-widest gap-2">LEER MÁS <ChevronRight size={18} /></div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center text-[#414242] py-10 font-medium">No hay artículos publicados por el momento.</div>
          )}
        </div>
      </section>

      {/* MODAL DE BLOG */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#414242]/90 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}></div>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col">
            <button className="absolute top-8 right-8 z-20 bg-white/90 p-3 rounded-full shadow-lg text-[#414242]" onClick={() => setSelectedArticle(null)}><X size={24} /></button>
            <div className="overflow-y-auto">
              {selectedArticle?.imagen_url && <img src={selectedArticle.imagen_url} className="w-full h-80 object-cover" alt="" />}
              <div className="p-12 md:p-20">
                <p className="text-xs font-black text-[#dbac43] uppercase tracking-widest mb-4">{selectedArticle?.fecha ? new Date(selectedArticle.fecha).toLocaleDateString() : ''}</p>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-none text-[#414242]">{selectedArticle?.titulo || ''}</h2>
                <p className="text-xl font-medium text-[#414242]/60 mb-10 italic border-l-4 border-[#dbac43] pl-4">{selectedArticle?.resumen || ''}</p>
                <div className="space-y-8 text-[#414242]/80 text-lg leading-relaxed font-medium">
                  {selectedArticle?.contenido ? selectedArticle.contenido.split('\n').map((parrafo, i) => <p key={i}>{parrafo}</p>) : <p>Cargando información...</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAPA CORPORATIVO */}
      <section id="ubicacion" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#c9c8c6]/30">
        <div className="bg-white rounded-[4rem] shadow-xl border border-[#c9c8c6]/20 p-8 md:p-12 grid lg:grid-cols-2 gap-12 items-center hover:shadow-2xl transition-shadow duration-500">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-black text-[#dbac43] bg-[#dbac43]/10 rounded-full tracking-widest uppercase shadow-sm">
              <MapPin size={14}/> Visítanos en Piura
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-[#414242] tracking-tighter">
              Encuentra tu camino hacia la <span className="text-[#dbac43]">sonrisa ideal.</span>
            </h3>
            <p className="text-[#414242]/70 text-lg leading-relaxed font-medium mb-8">
              Nuestras instalaciones están ubicadas en una zona céntrica y segura. Te esperamos en: <br/>
              <span className="block mt-4 p-4 bg-[#fafafa] rounded-2xl border border-[#c9c8c6]/30 font-bold text-[#414242]">
                {config?.direccion || 'Calle Los Brillantes, Urb. Miraflores Mz N Lt. 12, Castilla'}
              </span>
            </p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Evolution Clínica Dental Piura')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-[#414242] text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-opacity-90 transition-all uppercase text-xs tracking-widest active:scale-95">
              CÓMO LLEGAR CON GOOGLE MAPS <ExternalLink size={16}/>
            </a>
          </div>
          <div className="order-1 lg:order-2 rounded-[3rem] overflow-hidden shadow-inner border-4 border-[#c9c8c6]/20 h-[350px] md:h-[450px] relative bg-[#fafafa]">
            <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent('Evolution Clínica Dental Piura')}&t=&z=15&ie=UTF8&iwloc=&output=embed`} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mapa de Clínica Evolution Dental Center" className="absolute inset-0 grayscale-[20%] contrast-125 hover:grayscale-0 transition-all duration-700"></iframe>
          </div>
        </div>
      </section>

      {/* RESERVA */}
      <section id="reserva" className="py-24 px-6 bg-[#dbac43]/10">
        <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-white relative overflow-hidden mb-16">
          <h3 className="text-4xl font-black text-center mb-12 uppercase tracking-tighter text-[#414242]">Reserva tu cita hoy</h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <input type="text" placeholder="Nombre completo" required className="w-full p-6 rounded-2xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 outline-none focus:ring-2 focus:ring-[#dbac43] transition-all font-medium text-[#414242]" onChange={(e)=>setFormData({...formData, nombre: e.target.value})} value={formData.nombre} />
            <input type="tel" placeholder="Celular" required className="w-full p-6 rounded-2xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 outline-none focus:ring-2 focus:ring-[#dbac43] transition-all font-medium text-[#414242]" onChange={(e)=>setFormData({...formData, telefono: e.target.value})} value={formData.telefono} />
            <textarea placeholder="¿Interesado en algún tratamiento?" rows="4" className="w-full p-6 rounded-2xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 outline-none focus:ring-2 focus:ring-[#dbac43] transition-all font-medium md:col-span-2 text-[#414242] resize-none" onChange={(e)=>setFormData({...formData, mensaje: e.target.value})} value={formData.mensaje}></textarea>
            <button type="submit" disabled={isSending} className="w-full md:col-span-2 bg-[#dbac43] text-[#414242] py-6 rounded-2xl font-black shadow-2xl hover:bg-opacity-90 transition-all flex justify-center items-center gap-3 active:scale-[0.98]">{isSending ? 'PROCESANDO...' : 'ENVIAR POR WHATSAPP'} <Send size={20}/></button>
          </form>
        </div>
      </section>

      {/* CHATBOT */}
      <div className="fixed bottom-10 right-10 z-[100]">
        {isChatOpen && (
          <div className="bg-white w-96 mb-6 rounded-[3rem] shadow-2xl border border-[#c9c8c6]/30 overflow-hidden animate-in fade-in slide-in-from-bottom-10">
            <div className="bg-[#414242] p-8 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/icononav.png" alt="Icono Evolution" className="w-7 h-7 object-contain rounded-lg bg-white/10 p-0.5" /> 
                <p className="font-black text-sm uppercase text-white">Asistente Virtual</p>
              </div>
              <button onClick={() => { setIsChatOpen(false); setChatResponse(null); }} className="hover:bg-white/10 p-2 rounded-full transition-all"><X size={24}/></button>
            </div>
            <div className="p-8 text-sm text-[#414242]/80 space-y-6">
              {!chatResponse ? (
                <>
                  <p className="bg-[#fafafa] p-6 rounded-[2rem] font-bold text-[#414242] italic border-l-4 border-[#dbac43]">{config?.mensaje_bot || '¡Hola! Bienvenidos a Evolution Dental. ¿En qué podemos ayudarte hoy?'}</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setChatResponse(`📍 Ubicación: ${config?.direccion || ''}`)} className="text-left p-4 border border-[#c9c8c6]/50 rounded-2xl text-[#dbac43] font-black text-xs uppercase tracking-widest hover:border-[#dbac43] transition-colors">📍 Ver Ubicación</button>
                    <button onClick={() => setChatResponse(`🕒 Horarios: Lun-Vie: ${config?.horario_semana || ''} | Sáb: ${config?.horario_sabado || ''}`)} className="text-left p-4 border border-[#c9c8c6]/50 rounded-2xl text-[#dbac43] font-black text-xs uppercase tracking-widest hover:border-[#dbac43] transition-colors">🕒 Ver Horarios</button>
                    <button onClick={handleWhatsAppDirect} className="text-left p-4 bg-[#dbac43] text-[#414242] rounded-2xl font-black shadow-lg text-xs uppercase tracking-widest hover:brightness-105">📞 Contacto Directo</button>
                  </div>
                </>
              ) : (
                <div className="space-y-6 animate-in fade-in"><p className="bg-[#dbac43]/10 p-6 rounded-[2rem] text-[#414242] font-black text-sm border-l-4 border-[#dbac43]">{chatResponse}</p><button onClick={() => setChatResponse(null)} className="w-full text-[10px] font-black text-[#c9c8c6] uppercase tracking-widest hover:text-[#dbac43]">← Regresar</button></div>
              )}
            </div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-[#dbac43] text-[#414242] p-6 rounded-3xl shadow-2xl hover:scale-110 transition-transform"><MessageCircle size={32} /></button>
      </div>

      {/* LIGHTBOX */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-[2rem] shadow-2xl border-4 border-white/20" alt="Caso ampliado" />
        </div>
      )}

      {/* FOOTER TOTALMENTE LIMPIO E INTEGRADO */}
      <footer className="bg-[#414242] pt-20 pb-10 text-[#c9c8c6] border-t-8 border-[#dbac43]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            
            {/* LOGO CORPORATIVO TOTALMENTE ORIGINAL SIN FILTROS NI CONTENEDORES PARCHE */}
            <img 
              src="/logo.png" 
              alt="Evolution Dental Center" 
              className="h-16 w-auto object-contain" 
            />
            
            <p className="font-medium max-w-sm leading-relaxed text-sm pt-2">Transformamos vidas a través de sonrisas saludables y estéticas en Piura.</p>
          </div>
          <div className="space-y-6">
            <h5 className="font-black text-white uppercase tracking-widest text-xs">Menú</h5>
            <ul className="space-y-3 font-medium text-sm">
              <li><a href="#nosotros" className="hover:text-[#dbac43] transition-colors">Nosotros</a></li>
              <li><a href="#servicios" className="hover:text-[#dbac43] transition-colors">Especialidades</a></li>
              <li><a href="#galeria" className="hover:text-[#dbac43] transition-colors">Casos</a></li>
              <li><a href="#blog" className="hover:text-[#dbac43] transition-colors">Blog</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-black text-white uppercase tracking-widest text-xs">Contacto</h5>
            <p className="font-medium text-sm">📞 +{config?.telefono || ''}</p>
            <p className="font-medium text-sm">✉️ {config?.email || ''}</p>
            <p className="font-medium text-sm flex items-start gap-3"><MapPin size={24} className="text-[#dbac43] shrink-0"/> {config?.direccion || ''}</p>
          </div>
        </div>
        <div className="text-center border-t border-lightGray/20 pt-8 text-[#c9c8c6]/50 text-[10px] font-black uppercase tracking-[0.2em]">Todos los derechos reservados Clinica Evolution 2026, Desarrollado por Angello Portilla</div>
      </footer>
    </div>
  );
}

export default App;