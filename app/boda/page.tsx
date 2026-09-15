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
      {/* Sección 1: Título */}f
      <section className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-sm tracking-[0.4em] text-gray-500 uppercase mb-3">Estás invitado a</p>
        <h1 className="text-5xl md:text-7xl font-light text-gray-900 italic">
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
        <h2 className="text-4xl md:text-6xl font-light text-gray-900 tracking-wide">
          Irene <span className="text-3xl md:text-5xl italic text-gray-500 mx-4">&</span> Fernando
        </h2>
        <div className="w-16 h-[1px] bg-gray-400 mt-6"></div>
      </section>

      {/* Sección 4: Texto poético */}
      <section className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic font-light">
          "Cruzamos 37 años de vida para volver al punto donde todo empezó:
          <br />
          <span className="text-gray-900">enamorados, pero esta vez, para no soltarnos jamás."</span>
        </p>
      </section>

      {/* Sección 5: Foto tomados de la mano */}
      <section className="flex justify-center px-4 pb-12">
        <div className="relative w-full max-w-md">
          <div className="aspect-square overflow-hidden rounded-full shadow-2xl border-4 border-white">
            <img
              src="/images/boda/foto-mano.jpg"
              alt="Irene y Fernando tomados de la mano"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sección 6: Fecha, hora y lugar */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.3em] text-gray-500 uppercase mb-8">Nos casamos</p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Fecha */}
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Fecha</p>
              <p className="text-2xl font-light text-gray-900">20 de Septiembre</p>
              <p className="text-xl font-light text-gray-900">2026</p>
            </div>

            {/* Hora */}
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Hora</p>
              <p className="text-2xl font-light text-gray-900">17:00</p>
              <p className="text-sm text-gray-500">5:00 PM</p>
            </div>

            {/* Lugar */}
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Lugar</p>
              <p className="text-lg font-light text-gray-900">Edificio Faith</p>
              <p className="text-sm text-gray-600">Piso 8</p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-8">
            <p className="text-sm text-gray-600 mb-2">Dirección</p>
            <p className="text-base text-gray-800">
              Calle 23 de Calacoto, esquina Ballivián
            </p>
            <p className="text-sm text-gray-500 mt-2">La Paz, Bolivia</p>
          </div>

          {/* Botón para ver en Google Maps */}
          <div className="mt-10">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Edificio+Faith+Calacoto+La+Paz+Bolivia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-gray-900 text-gray-900 rounded-full text-sm tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-colors duration-300"
            >
              Ver en el mapa
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f1eb] py-8 text-center">
        <p className="text-sm text-gray-500 italic">
          Con amor, Irene & Fernando
        </p>
        <p className="text-xs text-gray-400 mt-2">20.09.2026</p>
      </footer>
    </div>
  );
}