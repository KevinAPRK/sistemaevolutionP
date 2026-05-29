import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { Lock, Mail, AlertCircle, ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // MODOS ORIGINALES
  const [viewMode, setViewMode] = useState('login'); 
  
  const navigate = useNavigate();

  // Detectar si el usuario viene desde el correo de recuperación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setViewMode('update');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // INICIAR SESIÓN
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    } else {
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  // SOLICITAR RECUPERACIÓN DE CONTRASEÑA
  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    });
    
    if (error) {
      console.error("Error detallado de Supabase:", error.message);
      setError(`Error: ${error.message}`); 
    } else {
      setSuccessMsg('Enlace enviado. Revisa tu bandeja de entrada o la carpeta de Spam.');
    }

    setIsLoading(false);
  };

  // ACTUALIZAR A LA NUEVA CONTRASEÑA
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      setError('No se pudo actualizar la contraseña. Asegúrate de usar al menos 6 caracteres.');
    } else {
      setSuccessMsg('¡Contraseña actualizada con éxito! Redirigiendo...');
      setTimeout(() => setViewMode('login'), 3000); 
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans text-[#414242] overflow-x-hidden bg-[#fafafa]">
      
      {/* PARTE ROJA (COLUMNA IZQUIERDA): FONDO DARK GRAY CORPORATIVO CON LOGO GIGANTE */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#414242] items-center justify-center p-12 relative shadow-2xl z-10">
        {/* LOGO AMPLIADO */}
        <div className="max-w-lg w-full p-4 transition-all">
          <img 
            src="/logo.png" 
            alt="Evolution Dental Center" 
            className="w-full h-auto object-contain animate-in fade-in zoom-in-95 duration-700" 
          />
        </div>
      </div>

      {/* PARTE VERDE (COLUMNA DERECHA): FONDO GRIS CLARO CON TARJETA BLANCA FLOTANTE */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#fafafa]">
        
        {/* BOTÓN "VOLVER A LA WEB" EN LA ESQUINA SUPERIOR DERECHA */}
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 right-6 lg:top-8 lg:right-10 z-50 flex items-center gap-2 text-[#414242]/60 hover:text-black transition-colors font-black text-[10px] sm:text-xs uppercase tracking-widest bg-white border border-[#c9c8c6]/30 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={16} /> Volver a la web
        </button>

        {/* TARJETA FLOTANTE DEL LOGIN */}
        <div className="w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl border border-[#c9c8c6]/30 p-10 md:p-12 animate-in fade-in slide-in-from-bottom-10 duration-500 relative mt-12 lg:mt-0">
          
          {/* Logo responsivo para celulares (se oculta en PC) */}
          <img 
            src="/logo.png" 
            alt="Evolution Dental Center" 
            className="block lg:hidden w-32 h-auto object-contain mx-auto mb-6" 
          />

          {/* TEXTOS TOTALMENTE CENTRADOS */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight text-[#414242]">
              {viewMode === 'login' && 'Iniciar Sesión'}
              {viewMode === 'reset' && 'Recuperar Acceso'}
              {viewMode === 'update' && 'Nueva Contraseña'}
            </h2>
            <p className="text-[#414242]/60 mt-2 text-xs font-bold uppercase tracking-wider">
              {viewMode === 'login' && 'Panel de control institucional'}
              {viewMode === 'reset' && 'Ingresa tu correo para el enlace'}
              {viewMode === 'update' && 'Escribe tu nueva clave de acceso'}
            </p>
          </div>

          {/* ALERTAS DE ESTADO CENTRADAS */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex flex-col items-center justify-center text-center gap-2 text-xs font-bold animate-in fade-in duration-300">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
          )}
          
          {successMsg && (
            <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex flex-col items-center justify-center text-center gap-2 text-xs font-bold animate-in fade-in duration-300">
              <CheckCircle2 size={24} />
              <p>{successMsg}</p>
            </div>
          )}

          {/* MODO FORMULARIO: LOGIN */}
          {viewMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-[10px] font-black text-[#414242]/60 uppercase tracking-widest block">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#414242]/40" size={20}/>
                  <input 
                    type="email" 
                    required 
                    placeholder="admin@evolutiondental.com" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#414242] outline-none bg-[#fafafa] font-medium text-sm text-center transition-all shadow-sm" 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2 text-center">
                <label className="text-[10px] font-black text-[#414242]/60 uppercase tracking-widest block">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#414242]/40" size={20}/>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#414242] outline-none bg-[#fafafa] font-medium text-sm text-center transition-all shadow-sm" 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => {
                  setViewMode('reset');
                  setError(null);
                  setSuccessMsg(null);
                }} 
                className="text-xs font-black text-[#414242]/60 hover:text-black transition-colors block w-full text-center uppercase tracking-widest pt-2"
              >
                ¿Olvidaste tu contraseña?
              </button>
              
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-[#414242] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-70 flex justify-center mt-4"
              >
                {isLoading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
              </button>
            </form>
          )}

          {/* MODO FORMULARIO: SOLICITAR ENLACE */}
          {viewMode === 'reset' && (
            <form onSubmit={handlePasswordResetRequest} className="space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-[10px] font-black text-[#414242]/60 uppercase tracking-widest block">Correo de Administración</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#414242]/40" size={20}/>
                  <input 
                    type="email" 
                    required 
                    placeholder="Ingresa tu correo" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#414242] outline-none bg-[#fafafa] font-medium text-sm text-center transition-all shadow-sm" 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => {
                  setViewMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }} 
                className="text-xs font-black text-[#c9c8c6] hover:text-[#414242] transition-colors block w-full text-center uppercase tracking-widest pt-2"
              >
                Volver al inicio de sesión
              </button>
              
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-[#414242] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-70 flex justify-center"
              >
                {isLoading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
              </button>
            </form>
          )}

          {/* MODO FORMULARIO: ACTUALIZAR CLAVE */}
          {viewMode === 'update' && (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-[10px] font-black text-[#414242]/60 uppercase tracking-widest block">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#414242]/40" size={20}/>
                  <input 
                    type="password" 
                    required 
                    placeholder="Mínimo 6 caracteres" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-[#c9c8c6]/50 focus:ring-2 focus:ring-[#414242] outline-none bg-[#fafafa] font-medium text-sm text-center transition-all shadow-sm" 
                    onChange={(e) => setNewPassword(e.target.value)} 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-[#414242] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-4"
              >
                <Save size={16}/> {isLoading ? 'ACTUALIZANDO...' : 'GUARDAR CLAVE'}
              </button>
            </form>
          )}

        </div>

        {/* Derechos de autor centrado abajo del formulario */}
        <div className="mt-8 text-center text-[10px] font-black text-[#c9c8c6] uppercase tracking-[0.2em]">
          Evolution Dental Center © 2026
        </div>

      </div>

    </div>
  );
}

export default Login;