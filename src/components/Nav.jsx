import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';

export default function Nav({ handleWhatsAppDirect, isScrolled, setIsChatOpen, isChatOpen }) {
  const [internalScrolled, setInternalScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const effectiveScrolled = isScrolled || internalScrolled;

  useEffect(() => {
    const handleScroll = () => setInternalScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [effectiveScrolled]);

  return (
    <header className={`fixed top-0 w-full z-[80] transition-all duration-500 ${
      // AQUÍ ESTÁ EL CAMBIO DE COLOR:
      // Si isScrolled es true -> fondo negro (bg-black)
      // Si isScrolled es false -> fondo gris (bg-[#414242])
      effectiveScrolled ? 'bg-black shadow-2xl py-2' : 'bg-[#414242] border-b border-[#c9c8c6]/10 py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        
        <Link to="/" className="flex items-center" aria-label="Volver a inicio">
          <img 
            src="/logo.png" 
            alt="Evolution Dental Center" 
            className={`w-auto object-contain transition-all duration-500 ${
              effectiveScrolled ? 'h-9 md:h-10' : 'h-12 md:h-14' 
            }`} 
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-bold text-sm text-white">
          <Link to="/nosotros" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-2">Nosotros</Link>
          <Link to="/especialidades" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-2">Especialidades</Link>
          <Link to="/casos-de-exito" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-2">Casos de Éxito</Link>
          <Link to="/blog" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-2">Blog</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={handleWhatsAppDirect} 
            className="hidden sm:flex items-center gap-2 bg-[#dbac43] text-[#414242] px-5 py-2 rounded-full font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-[#dbac43]/20"
          >
            <Phone size={14} /> WhatsApp
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-xl text-white hover:bg-white/10 transition-colors"
            aria-label="Abrir menú móvil"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="bg-black/25 border border-white/10 rounded-2xl p-3 space-y-1 text-white">
            <Link to="/nosotros" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl font-bold text-sm hover:bg-white/10">Nosotros</Link>
            <Link to="/especialidades" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl font-bold text-sm hover:bg-white/10">Especialidades</Link>
            <Link to="/casos-de-exito" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl font-bold text-sm hover:bg-white/10">Casos de Éxito</Link>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl font-bold text-sm hover:bg-white/10">Blog</Link>
            <button
              onClick={() => {
                handleWhatsAppDirect();
                setIsMobileMenuOpen(false);
              }}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-[#dbac43] text-[#414242] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              <Phone size={14} /> WhatsApp
            </button>
          </div>
        </div>
      )}
    </header>
  );
}