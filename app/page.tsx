import { getAllProductos } from '@/lib/productos';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Banner from '@/components/Banner';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Obtenemos TODOS los productos
  const todosLosProductos = await getAllProductos();
  
  // 2. Filtramos los destacados para las secciones por estilo
  const productosDestacados = todosLosProductos.filter(p => p.destacado === true);
  
  // 3. OBTENEMOS LOS ÚLTIMOS 8: Invertidos para que el recién agregado aparezca primero
  const ultimosCuadros = todosLosProductos.slice(-8).reverse();

  // Agrupar por estilo
  const estilosOrdenados = ['Abstractos Minimalistas', 'Abstractos Forte', 'Juveniles', 'Figuras Humanas', 'Paisajes'];
  const estilos = estilosOrdenados.filter(e => productosDestacados.some(p => p.estilo === e));

  return (
    <>
      
         <Banner />

      {/* ========================================== */}
      {/* 2. CONTENIDO PRINCIPAL (CENTRADO)          */}
      {/* ========================================== */}
      
        <main id="contenido" className="max-w-7xl mx-auto px-4 py-0 w-full">
        
        {/* Barra de beneficios compacta */}
        <section className="mb-6 mt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* 1. Entrega */}
            <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#fac932]/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fac932]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Entrega</h3>
                <p className="text-gray-500 text-sm">De 3 a 5 días hábiles.</p>
              </div>
            </div>

            {/* 2. Colección */}
            <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#fac932]/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fac932]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4-4a2 2 0 012.828 0L16 17m-2-2l1.586-1.586a2 2 0 012.828 0L20 15" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Colección en expansión</h3>
                <p className="text-gray-500 text-sm">Incorporamos nuevas obras constantemente.</p>
              </div>
            </div>

            {/* 3. Unidades Limitadas */}
            <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#fac932]/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fac932]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Edición Limitada</h3>
                <p className="text-gray-500 text-sm">Solo 4 unidades por pintura.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Barra de Calidad Premium Compacta */}
        <section className="py-4 bg-gray-50 border-y border-gray-200 mb-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg">🖼️</span>
              <span className="font-bold">Impreso en lienzo texturizado de alta gama</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">☀️</span>
              <span className="font-bold">Barniz protector anti-rayos UV</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🪵</span>
              <span className="font-bold">Bastidor en MDF indeformable</span>
            </div>
          </div>
        </section>

        {/* 2. ÚLTIMOS CUADROS INGRESADOS */}
        <section className="mb-10 px-0 md:px-8 pt-4 pb-1 rounded-2xl bg-gray-50 border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">Últimos cuadros ingresados</h2>
          <p className="text-gray-500 mb-6">Las obras más recientes que han llegado a nuestra colección.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ultimosCuadros.map(producto => (
              <ProductCard key={producto.id} product={producto} />
            ))}
          </div>

          <Link 
            href="/tienda" 
            className="inline-block mt-8 border-2 border-gray-800 text-gray-800 px-8 py-3 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300"
          >
            Ver todos los cuadros → (Todas las categorías)
          </Link>
        </section>
        
        {/* Secciones de Productos por Estilo */}
        {estilos.map((estilo, index) => {
          const cuadrosEstilo = productosDestacados.filter(p => p.estilo === estilo);
          const bgColor = index % 2 === 0 ? '#ffffff' : '#f6f7f7';
          
          if (cuadrosEstilo.length === 0) return null;

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
    </>
  );
}