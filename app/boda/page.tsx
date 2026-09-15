export const metadata = {
  title: 'Irene & Fernando | 20.09.2026',
  description: 'Nos casamos. 20 de Septiembre de 2026.',
  openGraph: {
    title: 'Irene & Fernando',
    description: '20 de Septiembre de 2026',
    images: ['/images/boda/foto-blanco.jpg'],
    siteName: '',
  },
};

export default function BodaPage() {
  return (
    <div className="min-h-screen bg-[#737766] font-serif text-white flex flex-col">
      
      {/* ==========================================
          SECCIÓN SUPERIOR: Diseñada para caber 
          en una sola pantalla sin hacer scroll 
          ========================================== */}
      <section className="flex flex-col items-center justify-center flex-grow px-4 py-6 md:py-10">
        
        {/* 1. Título */}
        <p className="text-xs tracking-[0.3em] text-gray-300 uppercase mb-2">Estás invitado a</p>
        <h1 className="text-4xl md:text-6xl font-light text-white italic mb-4">
          Nuestra Boda
        </h1>

        {/* 2. Foto pintura al óleo (Tamaño optimizado para móvil) */}
        <div className="relative w-full max-w-[280px] md:max-w-sm mb-4">
          <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl border border-white/10">
            <img
              src="/images/boda/foto-blanco.jpg"
              alt="Irene y Fernando"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3. Nombres */}
        <h2 className="text-3xl md:text-5xl font-light text-white tracking-wide mb-3">
          Irene <span className="text-2xl md:text-4xl italic text-gray-300 mx-2">&</span> Fernando
        </h2>
        <div className="w-12 h-[1px] bg-gray-400 mb-4"></div>

        {/* 4. Texto poético */}
        <p className="text-sm md:text-base text-gray-200 leading-relaxed italic font-light text-center max-w-md px-2">
          "Cruzamos 37 años de vida para volver al punto donde todo empezó:
          <br />
          <span className="text-white">enamorados, pero esta vez, para no soltarnos jamás."</span>
        </p>

      </section>

      {/* ==========================================
          SECCIÓN INFERIOR: Detalles (aquí sí se hace scroll)
          ========================================== */}
      <section className="bg-[#6c6f5e] py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Foto tomados de la mano */}
          <div className="flex justify-center mb-10">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <div className="aspect-square overflow-hidden rounded-full shadow-2xl border-4 border-white/20">
                <img
                  src="/images/boda/foto-mano.jpg"
                  alt="Irene y Fernando tomados de la mano"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <p className="text-xs tracking-[0.3em] text-gray-300 uppercase mb-8">Nos casamos</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Fecha */}
            <div className="flex flex-col items-center">
              <svg className="w-7 h-7 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs tracking-widest text-gray-300 uppercase mb-1">Fecha</p>
              <p className="text-xl font-light text-white">20 de Septiembre</p>
              <p className="text-lg font-light text-white">2026</p>
            </div>

            {/* Hora */}
            <div className="flex flex-col items-center">
              <svg className="w-7 h-7 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs tracking-widest text-gray-300 uppercase mb-1">Hora</p>
              <p className="text-xl font-light text-white">17:00</p>
              <p className="text-sm text-gray-300">5:00 PM</p>
            </div>

            {/* Lugar */}
            <div className="flex flex-col items-center">
              <svg className="w-7 h-7 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xs tracking-widest text-gray-300 uppercase mb-1">Lugar</p>
              <p className="text-lg font-light text-white">Torre Faith</p>
              <p className="text-sm text-gray-300">Piso 8, Calacoto</p>
            </div>
          </div>

          <div className="border-t border-gray-500 pt-6 mb-8">
            <p className="text-sm text-gray-300 mb-1">Dirección exacta</p>
            <p className="text-base text-white">
              Calle 23 de Calacoto, esquina Ballivián
            </p>
            <p className="text-sm text-gray-300 mt-1">La Paz, Bolivia</p>
          </div>

          {/* Botón para abrir en Google Maps */}
          <div className="mt-4">
            <a
              href="https://www.google.com/maps/place/Torre+Faith/@-16.5393431,-68.0788277,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-white text-white rounded-full text-sm tracking-wider uppercase hover:bg-white hover:text-[#1a3c2a] transition-colors duration-300"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a3c2a] py-6 text-center border-t border-white/10">
        <p className="text-sm text-gray-300 italic">
          Con amor, Irene & Fernando
        </p>
        <p className="text-xs text-gray-400 mt-2">20.09.2026</p>
      </footer>
    </div>
  );
}