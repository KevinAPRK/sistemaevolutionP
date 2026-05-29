import React from 'react';
import { MapPin } from 'lucide-react';

export default function Footer({ config }) {
  return (
    <footer className="bg-[#414242] pt-20 pb-10 text-[#c9c8c6] border-t-8 border-[#dbac43]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-16">
        <div className="space-y-6">
          <img src="/logo.png" alt="Evolution Dental Center" className="h-16 w-auto object-contain" />
          <p className="font-medium max-w-sm leading-relaxed text-sm pt-2">Transformamos vidas a través de sonrisas saludables y estéticas en Piura.</p>
        </div>
        <div className="space-y-6">
          <h5 className="font-black text-white uppercase tracking-widest text-xs">Menú</h5>
          <ul className="space-y-3 font-medium text-sm">
            <li><a href="/nosotros" className="hover:text-[#dbac43] transition-colors">Nosotros</a></li>
            <li><a href="/especialidades" className="hover:text-[#dbac43] transition-colors">Especialidades</a></li>
            <li><a href="/casos-de-exito" className="hover:text-[#dbac43] transition-colors">Casos</a></li>
            <li><a href="/blog" className="hover:text-[#dbac43] transition-colors">Blog</a></li>
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
  );
}
