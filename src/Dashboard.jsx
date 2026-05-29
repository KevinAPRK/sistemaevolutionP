import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, LayoutDashboard, Users, Settings, Activity, CheckCircle2, 
  ExternalLink, Save, AlertCircle, Plus, Trash2, Image as ImageIcon, 
  Upload, Clock, FileText, BookOpen, MessageSquare, Eye, X, Pencil
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pacientes');
  const [reviewSubTab, setReviewSubTab] = useState('pendientes'); 

  // --- ESTADOS DE DATOS ---
  const [consultas, setConsultas] = useState([]);
  const [testimonios, setTestimonios] = useState([]); 
  const [casos, setCasos] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [medicos, setMedicos] = useState([]); 

  // --- ESTADOS STAFF MÉDICO ---
  const [isUploadingStaff, setIsUploadingStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ nombre: '', especialidad: '', imageFile: null });
  const [staffMsg, setStaffMsg] = useState({ type: '', text: '' });
  const [editingStaffId, setEditingStaffId] = useState(null);

  // --- ESTADOS CONFIGURACIÓN ---
  const [config, setConfig] = useState({ 
    telefono: '', email: '', direccion: '', horario_semana: '', horario_sabado: '', mensaje_bot: '' 
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(null);

  // --- ESTADOS GALERÍA ---
  const [isUploadingCase, setIsUploadingCase] = useState(false);
  const [newCase, setNewCase] = useState({ titulo: '', antesFile: null, despuesFile: null });
  const [galeriaMsg, setGaleriaMsg] = useState({ type: '', text: '' });
  const [editingCaseId, setEditingCaseId] = useState(null);

  // --- ESTADOS BLOG ---
  const [isUploadingBlog, setIsUploadingBlog] = useState(false);
  const [newBlog, setNewBlog] = useState({ titulo: '', resumen: '', contenido: '', imageFile: null });
  const [blogMsg, setBlogMsg] = useState({ type: '', text: '' });
  const [editingBlogId, setEditingBlogId] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login'); 
      } else {
        setUser(session.user);
        fetchData();
      }
    };
    checkUser();
  }, [navigate]);

  const fetchData = async () => {
    const [resConsultas, resConfig, resCasos, resBlog, resTestimonios, resMedicos] = await Promise.all([
      supabase.from('consultas').select('*').order('created_at', { ascending: false }),
      supabase.from('configuracion').select('*').eq('id', 1).single(),
      supabase.from('casos-clinicos').select('*').order('created_at', { ascending: false }),
      supabase.from('blog').select('*').order('fecha', { ascending: false }),
      supabase.from('testimonios').select('*').order('created_at', { ascending: false }),
      supabase.from('medicos').select('*').order('created_at', { ascending: false })
    ]);

    if (resConsultas.data) setConsultas(resConsultas.data);
    if (resConfig.data) setConfig(resConfig.data);
    if (resCasos.data) setCasos(resCasos.data);
    if (resBlog.data) setArticulos(resBlog.data);
    if (resTestimonios.data) setTestimonios(resTestimonios.data);
    if (resMedicos.data) setMedicos(resMedicos.data);
    
    setIsLoading(false);
  };

  const fetchMedicos = async () => {
    const { data } = await supabase.from('medicos').select('*').order('created_at', { ascending: false });
    if (data) setMedicos(data);
  };

  const fetchCasos = async () => {
    const { data } = await supabase.from('casos-clinicos').select('*').order('created_at', { ascending: false });
    if (data) setCasos(data);
  };

  const fetchBlog = async () => {
    const { data } = await supabase.from('blog').select('*').order('fecha', { ascending: false });
    if (data) setArticulos(data);
  };

  const fetchTestimonios = async () => {
    const { data } = await supabase.from('testimonios').select('*').order('created_at', { ascending: false });
    if (data) setTestimonios(data);
  };

  const uploadFileToBucket = async (file, bucketName) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return publicUrl;
  };

  // ==========================================
  // LÓGICA STAFF MÉDICO (CRUD)
  // ==========================================
  const handleEditStaff = (medico) => {
    setNewStaff({ nombre: medico.nombre, especialidad: medico.especialidad, imageFile: null });
    setEditingStaffId(medico.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditStaff = () => {
    setNewStaff({ nombre: '', especialidad: '', imageFile: null });
    setEditingStaffId(null);
  };

  const handleAddOrUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editingStaffId && !newStaff.imageFile) return alert("Por favor, selecciona una foto profesional para el doctor.");
    setIsUploadingStaff(true);
    
    try {
      let imgUrl = editingStaffId ? medicos.find(m => m.id === editingStaffId).imagen_url : null;
      if (newStaff.imageFile) {
        imgUrl = await uploadFileToBucket(newStaff.imageFile, 'staff-images');
      }
      
      if (editingStaffId) {
        const { error } = await supabase.from('medicos').update({ nombre: newStaff.nombre, especialidad: newStaff.especialidad, imagen_url: imgUrl }).eq('id', editingStaffId);
        if (error) throw error;
        setStaffMsg({ type: 'success', text: 'Datos del especialista actualizados.' });
      } else {
        const { error } = await supabase.from('medicos').insert([{ nombre: newStaff.nombre, especialidad: newStaff.especialidad, imagen_url: imgUrl }]);
        if (error) throw error;
        setStaffMsg({ type: 'success', text: 'Especialista registrado con éxito.' });
      }

      handleCancelEditStaff();
      fetchMedicos();
    } catch (err) {
      setStaffMsg({ type: 'error', text: 'Error: ' + err.message });
    }
    setIsUploadingStaff(false);
    setTimeout(() => setStaffMsg({ type: '', text: '' }), 4000);
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm("¿Seguro que deseas retirar a este doctor del staff?")) return;
    await supabase.from('medicos').delete().eq('id', id);
    fetchMedicos();
  };

  // ==========================================
  // LÓGICA GALERÍA (CRUD)
  // ==========================================
  const handleEditCase = (caso) => {
    setNewCase({ titulo: caso.titulo, antesFile: null, despuesFile: null });
    setEditingCaseId(caso.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditCase = () => {
    setNewCase({ titulo: '', antesFile: null, despuesFile: null });
    setEditingCaseId(null);
  };

  const handleAddOrUpdateCase = async (e) => {
    e.preventDefault();
    if (!editingCaseId && (!newCase.antesFile || !newCase.despuesFile)) return alert("Sube ambas fotos");
    setIsUploadingCase(true);

    try {
      const currentCase = editingCaseId ? casos.find(c => c.id === editingCaseId) : null;
      let antesUrl = currentCase ? currentCase.antes : null;
      let despuesUrl = currentCase ? currentCase.despues : null;

      if (newCase.antesFile) antesUrl = await uploadFileToBucket(newCase.antesFile, 'casos-clinicos');
      if (newCase.despuesFile) despuesUrl = await uploadFileToBucket(newCase.despuesFile, 'casos-clinicos');

      if (editingCaseId) {
        const { error } = await supabase.from('casos-clinicos').update({ titulo: newCase.titulo, antes: antesUrl, despues: despuesUrl }).eq('id', editingCaseId);
        if (error) throw error;
        setGaleriaMsg({ type: 'success', text: 'Caso clínico actualizado.' });
      } else {
        const { error } = await supabase.from('casos-clinicos').insert([{ titulo: newCase.titulo, antes: antesUrl, despues: despuesUrl }]);
        if (error) throw error;
        setGaleriaMsg({ type: 'success', text: 'Caso clínico publicado con éxito.' });
      }

      handleCancelEditCase();
      fetchCasos();
    } catch (err) {
      setGaleriaMsg({ type: 'error', text: 'Error: ' + err.message });
    }
    setIsUploadingCase(false);
    setTimeout(() => setGaleriaMsg({ type: '', text: '' }), 4000);
  };

  const handleDeleteCase = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este caso?")) return;
    await supabase.from('casos-clinicos').delete().eq('id', id);
    fetchCasos();
  };

  // ==========================================
  // LÓGICA BLOG (CRUD)
  // ==========================================
  const handleEditBlog = (art) => {
    setNewBlog({ titulo: art.titulo, resumen: art.resumen, contenido: art.contenido, imageFile: null });
    setEditingBlogId(art.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditBlog = () => {
    setNewBlog({ titulo: '', resumen: '', contenido: '', imageFile: null });
    setEditingBlogId(null);
  };

  const handleAddOrUpdateBlog = async (e) => {
    e.preventDefault();
    if (!editingBlogId && !newBlog.imageFile) return alert("Sube una imagen de portada para el artículo");
    setIsUploadingBlog(true);

    try {
      const currentBlog = editingBlogId ? articulos.find(a => a.id === editingBlogId) : null;
      let imgUrl = currentBlog ? currentBlog.imagen_url : null;
      
      if (newBlog.imageFile) {
        imgUrl = await uploadFileToBucket(newBlog.imageFile, 'blog-images');
      }

      if (editingBlogId) {
        const { error } = await supabase.from('blog').update({ titulo: newBlog.titulo, resumen: newBlog.resumen, contenido: newBlog.contenido, imagen_url: imgUrl }).eq('id', editingBlogId);
        if (error) throw error;
        setBlogMsg({ type: 'success', text: 'Artículo actualizado con éxito.' });
      } else {
        const { error } = await supabase.from('blog').insert([{ titulo: newBlog.titulo, resumen: newBlog.resumen, contenido: newBlog.contenido, imagen_url: imgUrl }]);
        if (error) throw error;
        setBlogMsg({ type: 'success', text: 'Artículo publicado con éxito.' });
      }

      handleCancelEditBlog();
      fetchBlog();
    } catch (err) {
      setBlogMsg({ type: 'error', text: 'Error: ' + err.message });
    }
    setIsUploadingBlog(false);
    setTimeout(() => setBlogMsg({ type: '', text: '' }), 4000);
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este artículo?")) return;
    await supabase.from('blog').delete().eq('id', id);
    fetchBlog();
  };

  // --- LÓGICA CONFIGURACIÓN ---
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSavingConfig(true);
    const { error } = await supabase.from('configuracion').update(config).eq('id', 1);
    if (!error) {
      setConfigSuccess("¡Cambios guardados con éxito!");
      setTimeout(() => setConfigSuccess(null), 3000);
    }
    setIsSavingConfig(false);
  };

  // --- MODERACIÓN TESTIMONIOS ---
  const handleToggleApproval = async (id, currentStatus) => {
    const { error } = await supabase.from('testimonios').update({ aprobado: !currentStatus }).eq('id', id);
    if (!error) fetchTestimonios();
  };

  const handleDeleteReview = async (id) => {
    if (!confirm("¿Deseas eliminar permanentemente esta reseña?")) return;
    const { error } = await supabase.from('testimonios').delete().eq('id', id);
    if (!error) fetchTestimonios();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (isLoading) return <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-black text-[#414242] animate-pulse text-2xl">CARGANDO PANEL...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans text-[#414242]">
      
      {/* SIDEBAR: DARK GRAY PURE IDENTITY (#414242) */}
      <aside className="w-72 bg-[#414242] flex flex-col h-screen sticky top-0 hidden lg:flex shadow-xl border-r border-[#c9c8c6]/20">
        <div className="p-8 border-b border-[#c9c8c6]/10 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Evolution Dental" className="h-14 w-auto object-contain" />
          <p className="text-[10px] font-black text-[#c9c8c6] uppercase tracking-[0.2em] mt-2">ADMIN PANEL</p>
        </div>
        
        {/* Navegación Monocromática: Ítems activos se acoplan al fondo de la app */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-black text-[#c9c8c6]/50 uppercase tracking-[0.2em] mb-4 ml-2">Gestión</p>
          
          <button onClick={() => setActiveTab('pacientes')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-sm uppercase ${activeTab === 'pacientes' ? 'bg-[#fafafa] text-[#414242] shadow-lg' : 'text-white/80 hover:bg-black/20 hover:text-white'}`}><Users size={20} /> Pacientes</button>
          <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-sm uppercase ${activeTab === 'staff' ? 'bg-[#fafafa] text-[#414242] shadow-lg' : 'text-white/80 hover:bg-black/20 hover:text-white'}`}><Users size={20} /> Staff Médico</button>
          <button onClick={() => setActiveTab('testimonios')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-sm uppercase ${activeTab === 'testimonios' ? 'bg-[#fafafa] text-[#414242] shadow-lg' : 'text-white/80 hover:bg-black/20 hover:text-white'}`}><MessageSquare size={20} /> Testimonios</button>
          <button onClick={() => setActiveTab('galeria')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-sm uppercase ${activeTab === 'galeria' ? 'bg-[#fafafa] text-[#414242] shadow-lg' : 'text-white/80 hover:bg-black/20 hover:text-white'}`}><LayoutDashboard size={20} /> Galería Casos</button>
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-sm uppercase ${activeTab === 'blog' ? 'bg-[#fafafa] text-[#414242] shadow-lg' : 'text-white/80 hover:bg-black/20 hover:text-white'}`}><FileText size={20} /> Blog / Novedades</button>
          <button onClick={() => setActiveTab('configuracion')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-sm uppercase ${activeTab === 'configuracion' ? 'bg-[#fafafa] text-[#414242] shadow-lg' : 'text-white/80 hover:bg-black/20 hover:text-white'}`}><Settings size={20} /> Configuración Web</button>
        </nav>

        <div className="p-6 border-t border-[#c9c8c6]/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-black/20 text-red-400 font-black text-xs hover:bg-red-500/10 hover:text-red-50 transition-all uppercase tracking-widest"><LogOut size={18} /> Cerrar Sesión</button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {/* TAB: PACIENTES */}
        {activeTab === 'pacientes' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-4xl font-black text-[#414242] tracking-tight mb-8">Gestión de Pacientes</h2>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#c9c8c6]/30 overflow-hidden">
                <table className="w-full text-left">
                  <thead><tr className="bg-[#fafafa] border-b border-[#c9c8c6]/30">
                    <th className="p-6 font-black text-[#414242]/50 text-[10px] uppercase tracking-[0.2em]">Registro</th>
                    <th className="p-6 font-black text-[#414242]/50 text-[10px] uppercase tracking-[0.2em]">Paciente</th>
                    <th className="p-6 font-black text-[#414242]/50 text-[10px] uppercase tracking-[0.2em]">WhatsApp</th>
                    <th className="p-6 font-black text-[#414242]/50 text-[10px] uppercase tracking-[0.2em]">Mensaje</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[#c9c8c6]/20">
                    {consultas?.map((c) => (
                      <tr key={c.id} className="hover:bg-[#414242]/5 transition-colors">
                        <td className="p-6 text-xs font-bold text-[#414242]/60">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="p-6 font-black text-[#414242]">{c.nombre}</td>
                        <td className="p-6"><a href={`https://wa.me/${c.telefono}`} target="_blank" rel="noreferrer" className="text-[#414242] font-black hover:underline flex items-center gap-1">{c.telefono} <ExternalLink size={14}/></a></td>
                        <td className="p-6 text-sm text-[#414242]/80 max-w-xs">{c.mensaje}</td>
                      </tr>
                    ))}
                    {consultas.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-[#c9c8c6] font-bold">No hay pacientes registrados.</td></tr>}
                  </tbody>
                </table>
            </div>
          </div>
        )}

        {/* TAB: STAFF MÉDICO */}
        {activeTab === 'staff' && (
          <div className="animate-in fade-in duration-300 space-y-12">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black text-[#414242] tracking-tight">Staff Odontológico</h2>
                <p className="text-[#414242]/60 font-medium text-xs mt-1">Gestiona el equipo de doctores que se muestran en el portal principal.</p>
              </div>
              <div className="px-4 py-2 rounded-full text-xs font-black uppercase bg-[#414242]/10 text-[#414242] border border-[#414242]/20">{medicos.length} Especialistas</div>
            </header>

            <div className={`p-8 md:p-12 rounded-[3rem] shadow-xl border transition-colors ${editingStaffId ? 'bg-[#414242]/5 border-[#414242]/30' : 'bg-white border-[#c9c8c6]/30'}`}>
              <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                {editingStaffId ? <><Pencil className="text-[#414242]"/> Editando Datos del Especialista</> : <><Plus className="text-[#414242]"/> Registrar Nuevo Especialista</>}
              </h3>
              
              {staffMsg.text && <div className={`mb-8 p-4 rounded-2xl font-bold flex items-center gap-2 ${staffMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}><AlertCircle size={20}/> {staffMsg.text}</div>}
              
              <form onSubmit={handleAddOrUpdateStaff} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">Nombre Completo</label>
                  <input type="text" placeholder="Ej. Dra. Anelí Vegas" required className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/30 focus:ring-2 focus:ring-[#414242] outline-none font-bold text-sm shadow-sm" value={newStaff.nombre} onChange={(e)=>setNewStaff({...newStaff, nombre: e.target.value})}/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">Especialidad Clínica</label>
                  <input type="text" placeholder="Ej. Ortodoncia y Estética" required className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/30 focus:ring-2 focus:ring-[#414242] outline-none font-bold text-sm shadow-sm" value={newStaff.especialidad} onChange={(e)=>setNewStaff({...newStaff, especialidad: e.target.value})}/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">{editingStaffId ? 'Reemplazar Foto (Opcional)' : 'Fotografía Profesional'}</label>
                  <label className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 cursor-pointer hover:bg-white transition-all border border-dashed border-[#c9c8c6] shadow-sm">
                    <span className="text-xs font-bold text-[#414242]/60 truncate">{newStaff.imageFile ? newStaff.imageFile.name : (editingStaffId ? 'Mantener foto actual' : 'Seleccionar imagen')}</span>
                    <Upload size={18} className="text-[#414242]"/>
                    <input type="file" hidden accept="image/*" onChange={(e)=>setNewStaff({...newStaff, imageFile: e.target.files[0]})}/>
                  </label>
                </div>
                
                <div className="md:col-span-3 flex gap-4 mt-4">
                  {editingStaffId && (
                    <button type="button" onClick={handleCancelEditStaff} className="bg-[#c9c8c6]/40 text-[#414242] py-4 px-8 rounded-2xl font-black shadow-sm hover:bg-[#c9c8c6]/60 transition-all text-xs uppercase tracking-widest">CANCELAR</button>
                  )}
                  <button type="submit" disabled={isUploadingStaff} className="flex-1 bg-[#414242] text-white py-4 px-8 rounded-2xl font-black shadow-lg hover:bg-black transition-all text-xs uppercase tracking-widest">
                    {isUploadingStaff ? 'PROCESANDO...' : (editingStaffId ? 'ACTUALIZAR CAMBIOS' : 'PUBLICAR EN LA WEB')}
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {medicos.length === 0 ? (
                <div className="col-span-3 py-20 text-center text-[#c9c8c6] font-bold bg-white rounded-[3rem] border border-dashed border-[#c9c8c6]">No hay médicos registrados en el sistema.</div>
              ) : (
                medicos.map((m) => (
                  <div key={m.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-[#c9c8c6]/20 flex flex-col justify-between items-center text-center relative overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>handleEditStaff(m)} className="p-2 text-white bg-[#414242] hover:bg-black rounded-xl transition-all shadow-sm"><Pencil size={18}/></button>
                      <button onClick={()=>handleDeleteStaff(m.id)} className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-sm"><Trash2 size={18}/></button>
                    </div>

                    <div className="w-32 h-32 aspect-square rounded-[2rem] overflow-hidden bg-[#fafafa] border border-[#c9c8c6]/30 mb-4 mt-2">
                      <img src={m.imagen_url} className="w-full h-full object-cover" alt="Doctor" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#414242] text-lg leading-tight">{m.nombre}</h4>
                      <p className="text-xs font-bold text-[#414242]/60 uppercase tracking-wider mt-1">{m.especialidad}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: TESTIMONIOS */}
        {activeTab === 'testimonios' && (
          <div className="animate-in fade-in duration-300 space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black text-[#414242] tracking-tight">Reseñas de la Web</h2>
                <p className="text-[#414242]/60 font-medium text-xs mt-1">Modera las opiniones que los pacientes escriben en el portal público.</p>
              </div>
              <div className="bg-[#c9c8c6]/20 p-1.5 rounded-2xl flex gap-2 self-start sm:self-auto shadow-inner">
                <button onClick={() => setReviewSubTab('pendientes')} className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${reviewSubTab === 'pendientes' ? 'bg-[#414242] text-white shadow-md' : 'text-[#414242]/60 hover:text-[#414242]'}`}>Por Aprobar ({testimonios.filter(t => !t.aprobado).length})</button>
                <button onClick={() => setReviewSubTab('publicadas')} className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${reviewSubTab === 'publicadas' ? 'bg-[#414242] text-white shadow-md' : 'text-[#414242]/60 hover:text-[#414242]'}`}>Publicadas ({testimonios.filter(t => t.aprobado).length})</button>
              </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#c9c8c6]/30 overflow-hidden p-8">
              {reviewSubTab === 'pendientes' ? (
                <div className="space-y-6">
                  {testimonios.filter(t => !t.aprobado).length > 0 ? testimonios.filter(t => !t.aprobado).map((t) => (
                    <div key={t.id} className="p-6 bg-[#fafafa] rounded-3xl border border-[#c9c8c6]/20 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-3"><span className="font-black text-[#414242] text-base">{t.nombre}</span><span className="text-xs font-bold text-[#414242] bg-[#414242]/10 px-2 py-0.5 rounded-lg">⭐ {t.estrellas || 5} estrellas</span></div>
                        <p className="text-[#414242]/80 text-sm italic font-medium">"{t.comentario}"</p>
                        <p className="text-[10px] font-bold text-[#c9c8c6] uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleToggleApproval(t.id, false)} className="bg-[#414242] text-white p-3 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 shadow-md hover:bg-black transition-colors"><CheckCircle2 size={16} /> APROBAR</button>
                        <button onClick={() => handleDeleteReview(t.id)} className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-12 text-center text-[#c9c8c6] font-bold uppercase tracking-widest text-xs">Cero comentarios pendientes de aprobación. ✨</div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {testimonios.filter(t => t.aprobado).length > 0 ? testimonios.filter(t => t.aprobado).map((t) => (
                    <div key={t.id} className="p-6 bg-[#fafafa] rounded-3xl border border-[#c9c8c6]/20 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-3"><span className="font-black text-[#414242] text-base">{t.nombre}</span><span className="text-xs font-bold text-[#414242] bg-[#414242]/10 px-2 py-0.5 rounded-lg">⭐ {t.estrellas || 5} estrellas</span></div>
                        <p className="text-[#414242]/80 text-sm italic font-medium">"{t.comentario}"</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleToggleApproval(t.id, true)} className="bg-[#c9c8c6]/40 text-[#414242] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#c9c8c6]/60 transition-all flex items-center gap-1.5">👁️ Ocultar de la Web</button>
                        <button onClick={() => handleDeleteReview(t.id)} className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-12 text-center text-[#c9c8c6] font-bold uppercase tracking-widest text-xs">Aún no has publicado ninguna reseña en el portal.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: GALERÍA */}
        {activeTab === 'galeria' && (
          <div className="animate-in fade-in duration-300 space-y-12">
            <header className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-[#414242] tracking-tight">Galería de Casos</h2>
              <div className="px-4 py-2 rounded-full text-xs font-black uppercase bg-[#414242]/10 text-[#414242] border border-[#414242]/20">{casos.length} Casos</div>
            </header>

            <div className={`p-8 md:p-12 rounded-[3rem] shadow-xl border transition-colors ${editingCaseId ? 'bg-[#414242]/5 border-[#414242]/30' : 'bg-white border-[#c9c8c6]/30'}`}>
              <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                {editingCaseId ? <><Pencil className="text-[#414242]"/> Editando Caso Clínico</> : <><Plus className="text-[#414242]"/> Publicar Nuevo Caso Clínico</>}
              </h3>
              
              {galeriaMsg.text && <div className={`mb-8 p-4 rounded-2xl font-bold flex items-center gap-2 ${galeriaMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}><AlertCircle size={20}/> {galeriaMsg.text}</div>}
              
              <form onSubmit={handleAddOrUpdateCase} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">Título del Caso</label>
                  <input type="text" placeholder="Ej. Rehabilitación Oral" required className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/30 focus:ring-2 focus:ring-[#414242] outline-none font-bold shadow-sm" value={newCase.titulo} onChange={(e)=>setNewCase({...newCase, titulo: e.target.value})}/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">{editingCaseId ? 'Reemplazar ANTES (Opcional)' : 'Foto ANTES'}</label>
                  <label className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 cursor-pointer hover:bg-white transition-all border border-dashed border-[#c9c8c6] shadow-sm">
                    <span className="text-xs font-bold text-[#414242]/60 truncate">{newCase.antesFile ? newCase.antesFile.name : (editingCaseId ? 'Mantener actual' : 'Seleccionar archivo')}</span>
                    <ImageIcon size={18} className="text-[#414242]"/>
                    <input type="file" hidden accept="image/*" onChange={(e)=>setNewCase({...newCase, antesFile: e.target.files[0]})}/>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">{editingCaseId ? 'Reemplazar DESPUÉS (Opcional)' : 'Foto DESPUÉS'}</label>
                  <label className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 cursor-pointer hover:bg-white transition-all border border-dashed border-[#c9c8c6] shadow-sm">
                    <span className="text-xs font-bold text-[#414242]/60 truncate">{newCase.despuesFile ? newCase.despuesFile.name : (editingCaseId ? 'Mantener actual' : 'Seleccionar archivo')}</span>
                    <Upload size={18} className="text-[#414242]"/>
                    <input type="file" hidden accept="image/*" onChange={(e)=>setNewCase({...newCase, despuesFile: e.target.files[0]})}/>
                  </label>
                </div>

                <div className="md:col-span-3 flex gap-4 mt-4">
                  {editingCaseId && (
                    <button type="button" onClick={handleCancelEditCase} className="bg-[#c9c8c6]/40 text-[#414242] py-4 px-8 rounded-2xl font-black shadow-sm hover:bg-[#c9c8c6]/60 transition-all text-xs uppercase tracking-widest">CANCELAR</button>
                  )}
                  <button type="submit" disabled={isUploadingCase} className="flex-1 bg-[#414242] text-white p-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all uppercase tracking-widest text-xs">
                    {isUploadingCase ? 'PROCESANDO...' : (editingCaseId ? 'ACTUALIZAR CAMBIOS' : 'PUBLICAR EN LA WEB')}
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {casos.length === 0 ? (<div className="col-span-2 py-20 text-center text-[#c9c8c6] font-bold bg-white rounded-[3rem] border border-dashed border-[#c9c8c6]">No hay casos registrados aún.</div>) : (
                casos.map((caso) => (
                  <div key={caso.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-[#c9c8c6]/20 flex flex-col gap-6 relative group overflow-hidden hover:shadow-lg transition-shadow">
                    
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-[#414242] uppercase text-xs tracking-widest pl-2">{caso.titulo}</h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={()=>handleEditCase(caso)} className="p-2 text-white bg-[#414242] rounded-xl hover:bg-black transition-all shadow-sm"><Pencil size={18}/></button>
                        <button onClick={()=>handleDeleteCase(caso.id)} className="p-2 text-white bg-red-500 rounded-xl transition-all shadow-sm"><Trash2 size={18}/></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><p className="text-[10px] font-black text-[#414242] uppercase text-center">Antes</p><div className="aspect-square rounded-2xl overflow-hidden bg-[#fafafa] border border-[#c9c8c6]/30"><img src={caso.antes} className="w-full h-full object-cover" alt="Antes"/></div></div>
                      <div className="space-y-2"><p className="text-[10px] font-black text-[#414242] uppercase text-center">Después</p><div className="aspect-square rounded-2xl overflow-hidden bg-[#fafafa] border border-[#c9c8c6]/30"><img src={caso.despues} className="w-full h-full object-cover" alt="Después"/></div></div>
                    </div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#414242]"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: BLOG */}
        {activeTab === 'blog' && (
          <div className="animate-in fade-in duration-300 space-y-12">
            <header className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-[#414242] tracking-tight">Blog y Novedades</h2>
              <div className="px-4 py-2 rounded-full text-xs font-black uppercase bg-[#414242]/10 text-[#414242] border border-[#414242]/20">{articulos.length} Artículos</div>
            </header>

            <div className={`p-8 md:p-12 rounded-[3rem] shadow-xl border transition-colors ${editingBlogId ? 'bg-[#414242]/5 border-[#414242]/30' : 'bg-white border-[#c9c8c6]/30'}`}>
              <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                {editingBlogId ? <><Pencil className="text-[#414242]"/> Editando Artículo del Blog</> : <><BookOpen className="text-[#414242]"/> Redactar Nuevo Artículo</>}
              </h3>
              
              {blogMsg.text && <div className={`mb-8 p-4 rounded-2xl font-bold flex items-center gap-2 ${blogMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}><AlertCircle size={20}/> {blogMsg.text}</div>}
              
              <form onSubmit={handleAddOrUpdateBlog} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">Título del Artículo</label>
                    <input type="text" placeholder="Ej. Importancia de la Ortodoncia" required className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/30 focus:ring-2 focus:ring-[#414242] outline-none font-bold shadow-sm" value={newBlog.titulo} onChange={(e)=>setNewBlog({...newBlog, titulo: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">Resumen (Subtítulo)</label>
                    <input type="text" placeholder="Breve descripción del tema..." required className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/30 focus:ring-2 focus:ring-[#414242] outline-none font-bold text-sm shadow-sm" value={newBlog.resumen} onChange={(e)=>setNewBlog({...newBlog, resumen: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">{editingBlogId ? 'Reemplazar Portada (Opcional)' : 'Imagen de Portada'}</label>
                    <label className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 cursor-pointer hover:bg-white transition-all border border-dashed border-[#c9c8c6] shadow-sm">
                      <span className="text-xs font-bold text-[#414242]/60 truncate">{newBlog.imageFile ? newBlog.imageFile.name : (editingBlogId ? 'Mantener imagen actual' : 'Seleccionar JPG/PNG')}</span>
                      <ImageIcon size={18} className="text-[#414242]"/>
                      <input type="file" hidden accept="image/*" onChange={(e)=>setNewBlog({...newBlog, imageFile: e.target.files[0]})}/>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2 h-full">
                  <label className="text-[10px] font-black text-[#414242]/50 uppercase ml-1">Contenido Completo (Párrafos)</label>
                  <textarea required placeholder="Escribe aquí el cuerpo del artículo..." className="w-full p-4 rounded-2xl bg-[#fafafa] border-none ring-1 ring-[#c9c8c6]/30 focus:ring-2 focus:ring-[#414242] outline-none font-medium resize-none h-64 shadow-sm" value={newBlog.contenido} onChange={(e)=>setNewBlog({...newBlog, contenido: e.target.value})}></textarea>
                </div>
                
                <div className="md:col-span-2 flex gap-4 mt-2">
                  {editingBlogId && (
                    <button type="button" onClick={handleCancelEditBlog} className="bg-[#c9c8c6]/40 text-[#414242] py-4 px-8 rounded-2xl font-black shadow-sm hover:bg-[#c9c8c6]/60 transition-all text-xs uppercase tracking-widest">CANCELAR</button>
                  )}
                  <button type="submit" disabled={isUploadingBlog} className="flex-1 bg-[#414242] text-white p-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all uppercase tracking-widest text-xs">
                    {isUploadingBlog ? 'PROCESANDO...' : (editingBlogId ? 'ACTUALIZAR ARTÍCULO' : 'PUBLICAR ARTÍCULO')}
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {articulos.length === 0 ? (
                <div className="col-span-2 py-20 text-center text-[#c9c8c6] font-bold bg-white rounded-[3rem] border border-dashed border-[#c9c8c6]">No hay artículos publicados todavía.</div>
              ) : (
                articulos.map((art) => (
                  <div key={art.id} className="bg-white rounded-[2.5rem] shadow-sm border border-[#c9c8c6]/20 flex overflow-hidden group hover:shadow-lg transition-shadow relative">
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm">
                      <button onClick={()=>handleEditBlog(art)} className="p-2 text-white bg-[#414242] hover:bg-black rounded-lg transition-all shadow-sm"><Pencil size={16}/></button>
                      <button onClick={()=>handleDeleteBlog(art.id)} className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all shadow-sm"><Trash2 size={16}/></button>
                    </div>

                    <div className="w-1/3 bg-[#fafafa] relative">
                      <img src={art.imagen_url} className="w-full h-full object-cover" alt="Portada" />
                    </div>
                    <div className="w-2/3 p-6 flex flex-col justify-center">
                      <p className="text-[10px] font-black text-[#414242]/60 uppercase tracking-widest mb-2">{new Date(art.fecha).toLocaleDateString()}</p>
                      <h4 className="font-black text-[#414242] mb-1 leading-tight pr-12">{art.titulo}</h4>
                      <p className="text-xs text-[#414242]/70 line-clamp-2">{art.resumen}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: CONFIGURACIÓN */}
        {activeTab === 'configuracion' && (
          <div className="animate-in fade-in duration-300 max-w-3xl">
            <h2 className="text-4xl font-black text-[#414242] mb-8 tracking-tight">Configuración Web</h2>
            {configSuccess && <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl font-bold flex gap-2"><CheckCircle2/> {configSuccess}</div>}
            <form onSubmit={handleSaveConfig} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#c9c8c6]/30 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="text-[10px] font-black text-[#414242]/50 uppercase">WhatsApp</label><input type="text" required className="w-full p-4 rounded-xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 outline-none focus:ring-2 focus:ring-[#414242] font-bold" value={config?.telefono || ''} onChange={(e)=>setConfig({...config, telefono: e.target.value})}/></div>
                  <div><label className="text-[10px] font-black text-[#414242]/50 uppercase">Email</label><input type="email" required className="w-full p-4 rounded-xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 outline-none focus:ring-2 focus:ring-[#414242] font-bold" value={config?.email || ''} onChange={(e)=>setConfig({...config, email: e.target.value})}/></div>
                </div>
                <div><label className="text-[10px] font-black text-[#414242]/50 uppercase">Dirección</label><input type="text" required className="w-full p-4 rounded-xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 outline-none focus:ring-2 focus:ring-[#414242] font-bold" value={config?.direccion || ''} onChange={(e)=>setConfig({...config, direccion: e.target.value})}/></div>
                <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-[#c9c8c6]/20">
                  <div><label className="text-[10px] font-black text-[#414242]/50 uppercase">Horario L-V</label><input type="text" required className="w-full p-4 rounded-xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 outline-none focus:ring-2 focus:ring-[#414242] font-bold" value={config?.horario_semana || ''} onChange={(e)=>setConfig({...config, horario_semana: e.target.value})}/></div>
                  <div><label className="text-[10px] font-black text-[#414242]/50 uppercase">Horario Sábados</label><input type="text" required className="w-full p-4 rounded-xl bg-[#fafafa] ring-1 ring-[#c9c8c6]/30 outline-none focus:ring-2 focus:ring-[#414242] font-bold" value={config?.horario_sabado || ''} onChange={(e)=>setConfig({...config, horario_sabado: e.target.value})}/></div>
                </div>
                <div className="pt-2">
                  <label className="text-[10px] font-black text-[#414242] uppercase flex items-center gap-2 mb-2"><MessageSquare size={14}/> Saludo del Asistente Virtual (WhatsApp Bot)</label>
                  <textarea rows="3" required className="w-full p-4 rounded-xl bg-[#414242]/5 ring-1 ring-[#414242]/20 outline-none focus:ring-2 focus:ring-[#414242] font-medium text-sm resize-none" value={config?.mensaje_bot || ''} onChange={(e)=>setConfig({...config, mensaje_bot: e.target.value})}></textarea>
                </div>
                <button type="submit" disabled={isSavingConfig} className="w-full bg-[#414242] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all flex justify-center gap-2 disabled:opacity-70"><Save size={20}/> {isSavingConfig ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}</button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;