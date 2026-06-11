import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function Nav({ handleWhatsAppDirect, isScrolled, setIsChatOpen, isChatOpen }) {
  return (
    <header className={`fixed top-0 w-full z-[80] transition-all duration-500 ${
      // AQUÍ ESTÁ EL CAMBIO DE COLOR:
      // Si isScrolled es true -> fondo negro (bg-black)
      // Si isScrolled es false -> fondo gris (bg-[#414242])
      isScrolled ? 'bg-black shadow-2xl py-2' : 'bg-[#414242] border-b border-[#c9c8c6]/10 py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        <Link to="/" className="flex items-center" aria-label="Volver a inicio">
          <img 
            src="/logo.png" 
            alt="Evolution Dental Center" 
            className={`w-auto object-contain transition-all duration-500 ${
              isScrolled ? 'h-9 md:h-10' : 'h-12 md:h-14' 
            }`} 
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-bold text-sm text-white">
          <Link to="/nosotros" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-2">Nosotros</Link>
          <Link to="/especialidades" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-2">Especialidades</Link>
          <Link to="/casos-de-exito" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-2">Casos de Éxito</Link>
          <Link to="/blog" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-2">Blog</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleWhatsAppDirect} 
            className="flex items-center gap-2 bg-[#dbac43] text-[#414242] px-5 py-2 rounded-full font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-[#dbac43]/20"
          >
            <Phone size={14} /> WhatsApp
          </button>
        </div>

      </div>
    </header>
  );
}