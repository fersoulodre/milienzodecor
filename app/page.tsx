import { getAllProductos } from '@/lib/productos';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// 1. Agrega 'async' aquí
export default async function Home() {
  // 2. Agrega 'await' y paréntesis para esperar los datos antes de filtrar
  const todosProductos = (await getAllProductos()).filter(p => p.destacado === true);
  
  // Agrupar por estilo
  const estilosOrdenados = ['Abstractos Minimalistas', 'Abstractos Forte', 'Juveniles', 'Figuras Humanas', 'Paisajes'];
  const estilos = estilosOrdenados.filter(e => todosProductos.some(p => p.estilo === e));

  return (
    <main className="max-w-7xl mx-auto px-4 py-0">
      
      {/* SECCIÓN HERO CON IMAGEN DESLIZABLE EN MÓVIL */}
<section 
  className="relative text-center py-36 md:py-52 mb-8 rounded-2xl overflow-hidden"
>
  {/* Imagen deslizable en móvil */}
  <div className="md:hidden absolute inset-0 overflow-x-auto scrollbar-hide">
    <div 
      className="h-full w-[200%]"
      style={{
        backgroundImage: "url('/images/portada.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  </div>

  {/* Imagen estática en desktop */}
  <div 
    className="hidden md:block absolute inset-0"
    style={{
      backgroundImage: "url('/images/portada.webp')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  />

  {/* Texto del hero */}
  <div className="relative z-10 px-4 translate-y-60">
    <h2 className="text-3xl md:text-5xl font-bold text-white mb-15 drop-shadow-lg">
      Transforma tu mundo con estilo
    </h2>
  </div>
</section>

      {/* Barra de beneficios */}
      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">

          {/* 1. Entrega */}
          <div className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-6 border">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fac932]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#fac932]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Entrega</h3>
              <p className="text-gray-500">De 3 a 5 días hábiles.</p>
            </div>
          </div>

          {/* 2. Colección */}
          <div className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-6 border">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fac932]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#fac932]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4-4a2 2 0 012.828 0L16 17m-2-2l1.586-1.586a2 2 0 012.828 0L20 15" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Colección en expansión</h3>
              <p className="text-gray-500">Incorporamos nuevas obras constantemente.</p>
            </div>
          </div>

          {/* 3. Unidades Limitadas */}
          <div className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-6 border">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fac932]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#fac932]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Edición Limitada</h3>
              <p className="text-gray-500">Solo 4 unidades por pintura.</p>
            </div>
          </div>

        </div>
      </section>
      
      {/* Secciones de Productos por Estilo */}
      {estilos.map((estilo, index) => {
        const cuadrosEstilo = todosProductos.filter(p => p.estilo === estilo);
        const bgColor = index % 2 === 0 ? '#ffffff' : '#f6f7f7';
        
        return (
          <section 
            key={estilo} 
            className="mb-8 px-0 md:px-8 py-8 rounded-2xl"
            style={{ backgroundColor: bgColor }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">{estilo}</h2>
            <p className="text-gray-500 mb-6">Haz click en una pintura para elegir el tamaño y verlo en un espacio virtual.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {cuadrosEstilo.map(producto => (
                <ProductCard key={producto.id} product={producto} />
              ))}
            </div>
            <Link 
              href={`/categoria/${estilo.toLowerCase().replace(/\s+/g, '-')}`} 
              className="inline-block mt-8 border-2 border-gray-800 text-gray-800 px-8 py-3 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              Ver más →
            </Link>
          </section>
        );
      })}
    </main>
  );
}