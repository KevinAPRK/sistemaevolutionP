import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function ChatbotPanel({ config, isChatOpen, setIsChatOpen }) {
  const [chatResponse, setChatResponse] = useState(null);
  const phone = config?.telefono || '51969826870';

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end">
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
                  <button onClick={() => window.open(`https://wa.me/${phone}`, '_blank')} className="text-left p-4 bg-[#dbac43] text-[#414242] rounded-2xl font-black shadow-lg text-xs uppercase tracking-widest hover:brightness-105">📞 Contacto Directo</button>
                </div>
              </>
            ) : (
              <div className="space-y-6 animate-in fade-in">
                <p className="bg-[#dbac43]/10 p-6 rounded-[2rem] text-[#414242] font-black text-sm border-l-4 border-[#dbac43]">{chatResponse}</p>
                <button onClick={() => setChatResponse(null)} className="w-full text-[10px] font-black text-[#c9c8c6] uppercase tracking-widest hover:text-[#dbac43]">← Regresar</button>
              </div>
            )}
          </div>
        </div>
      )}
      <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-[#dbac43] text-[#414242] p-6 rounded-3xl shadow-2xl hover:scale-110 transition-transform" aria-label="Abrir chat bot"><MessageCircle size={32} /></button>
    </div>
  );
}
