import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ChevronDown, MessageCircle } from 'lucide-react';

export default function Nav({ handleWhatsAppDirect, isScrolled, setIsChatOpen, isChatOpen }) {
  return (
    <nav className={`fixed top-0 w-full z-[80] transition-all duration-500 ${
      isScrolled ? 'bg-black shadow-2xl py-4' : 'bg-[#414242] border-b border-[#c9c8c6]/10 py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <img src="/logo.png" alt="Evolution Dental Center" className={`w-auto object-contain transition-all duration-500 ${isScrolled ? 'h-12 md:h-14' : 'h-16 md:h-22'}`} />
        </div>

        <div className="hidden lg:flex items-center gap-8 font-bold text-sm text-white">
          <Link to="/nosotros" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-4">Nosotros</Link>
          <Link to="/especialidades" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-4">Especialidades</Link>
          <Link to="/casos-de-exito" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-4">Casos de Éxito</Link>
          <Link to="/blog" className="text-white hover:text-[#dbac43] transition-colors duration-300 py-4">Blog</Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleWhatsAppDirect} className="flex items-center gap-2 bg-[#dbac43] text-[#414242] px-6 py-2.5 rounded-full font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-[#dbac43]/20"><Phone size={16} /> WhatsApp</button>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-[#dbac43] text-[#414242] p-3 rounded-3xl shadow-2xl hover:scale-110 transition-transform"><MessageCircle size={20} /></button>
        </div>
      </div>
    </nav>
  );
}
