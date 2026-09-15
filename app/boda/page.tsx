export const metadata = {
  title: 'Boda de Irene & Fernando',
  description: 'Estás invitado a nuestra boda. 20 de Septiembre de 2026.',
  openGraph: {
    title: 'Boda de Irene & Fernando',
    description: 'Estás invitado a nuestra boda. 20 de Septiembre de 2026.',
    images: ['/images/boda/foto-blanco.jpg'],
  },
};

export default function BodaPage() {
  return (
    <div className="min-h-screen bg-[#737766] font-serif">
      {/* Sección 1: Título */}
      <section className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-sm tracking-[0.4em] text-gray-300 uppercase mb-3">Estás invitado a</p>
        <h1 className="text-5xl md:text-7xl font-light text-white italic">
          Nuestra Boda
        </h1>
        <div className="w-24 h-[1px] bg-gray-400 mt-6"></div>
      </section>

      {/* Sección 2: Foto pintura al óleo */}
      <section className="flex justify-center px-4 pb-12">
        <div className="relative w-full max-w-md">
          <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-2xl">
            <img
              src="/images/boda/foto-blanco.jpg"
              alt="Irene y Fernando"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sección 3: Nombres */}
      <section className="flex flex-col items-center py-12 px-4">
        <h2 className="text-4xl md:text-6xl font-light text-white tracking-wide">
          Irene <span className="text-3xl md:text-5xl italic text-gray-300 mx-4">&</span> Fernando
        </h2>
        <div className="w-16 h-[1px] bg-gray-400 mt-6"></div>
      </section>

      {/* Sección 4: Texto poético */}
      <section className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed italic font-light">
          "Cruzamos 37 años de vida para volver al punto donde todo empezó:
          <br />
          <span className="text-white">enamorados, pero esta vez, para no soltarnos jamás."</span>
        </p>
      </section>

      {/* Sección 5: Foto tomados de la mano */}
      <section className="flex justify-center px-4 pb-12">
        <div className="relative w-full max-w-md">
          <div className="aspect-square overflow-hidden rounded-full shadow-2xl border-4 border-white/20">
            <img
              src="/images/boda/foto-mano.jpg"
              alt="Irene y Fernando tomados de la mano"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sección 6: Fecha, hora y lugar */}
      <section className="bg-[#6a6d5c] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.3em] text-gray-300 uppercase mb-8">Nos casamos</p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Fecha */}
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs tracking-widest text-gray-300 uppercase mb-2">Fecha</p>
              <p className="text-2xl font-light text-white">20 de Septiembre</p>
              <p className="text-xl font-light text-white">2026</p>
            </div>

            {/* Hora */}
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs tracking-widest text-gray-300 uppercase mb-2">Hora</p>
              <p className="text-2xl font-light text-white">17:00</p>
              <p className="text-sm text-gray-300">5:00 PM</p>
            </div>

            {/* Lugar */}
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xs tracking-widest text-gray-300 uppercase mb-2">Lugar</p>
              <p className="text-lg font-light text-white">Edificio Faith</p>
              <p className="text-sm text-gray-300">Piso 8</p>
            </div>
          </div>

          <div className="border-t border-gray-500 pt-8">
            <p className="text-sm text-gray-300 mb-2">Dirección</p>
            <p className="text-base text-white">
              Calle 23 de Calacoto, esquina Ballivián
            </p>
            <p className="text-sm text-gray-300 mt-2">La Paz, Bolivia</p>
          </div>

          {/* Botón para ver en Google Maps */}
                    {/* Mapa Interactivo Incrustado */}
                    {/* Botón para abrir directamente en la App de Google Maps */}
          <div className="mt-10">
            <a
              href="https://www.google.com/maps/place/Torre+Faith/@-16.5393431,-68.0788277,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-white text-white rounded-full text-sm tracking-wider uppercase hover:bg-white hover:text-[#1a3c2a] transition-colors duration-300"
            >
              Abrir en Google Maps
            </a>
          </div>

          {/* Botón para abrir directamente en la App de Google Maps */}
          <div className="mt-6">
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
      <footer className="bg-[#1a3c2a] py-8 text-center">
        <p className="text-sm text-gray-300 italic">
          Con amor, Irene & Fernando
        </p>
        <p className="text-xs text-gray-400 mt-2">20.09.2026</p>
      </footer>
    </div>
  );
}