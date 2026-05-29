import React from 'react';

function Nosotros() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl font-black text-slate-900 mb-8">Nuestra Clínica</h2>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
          <h3 className="text-2xl font-black text-blue-600 mb-4">Quiénes Somos</h3>
          <p className="text-slate-600 leading-relaxed">
            En Evolution Dental Center, nos dedicamos a transformar sonrisas en Piura...
          </p>
        </div>
        <div className="bg-blue-600 p-10 rounded-[3rem] shadow-xl text-white">
          <h3 className="text-2xl font-black mb-4">Tecnología de Punta</h3>
          <p className="opacity-90 leading-relaxed">
            Contamos con los equipos más modernos para diagnósticos precisos...
          </p>
        </div>
      </div>
      
      {/* Aquí podrías mover la sección de Staff que ya teníamos en la Landing */}
    </div>
  );
}

export default Nosotros;