import { getAllProductos } from '@/lib/productos';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const todosProductos = getAllProductos().filter(p => p.destacado === true);
  
  // Agrupar por estilo
  const estilosOrdenados = ['Abstractos Minimalistas', 'Abstractos Forte', 'Figuras Humanas', 'Paisajes'];
  const estilos = estilosOrdenados.filter(e => todosProductos.some(p => p.estilo === e));

  return (
    <main className="max-w-7xl mx-auto px-4 py-0">
      
      {/* NUEVA SECCIÓN: Hero con Slogan y Barra de Entrega */}
      <section className="text-center py-12 mb-0 bg-gray-50 rounded-2xl border border-gray-100">
        
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
          Transforma tu mundo con piezas únicas, exclusivas y hechas para inspirar.
        </p>
        
        {/* NUEVO TEXTO RESALTADO */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#fac932]/20 border border-[#fac932] text-[#734d12] px-5 py-2 rounded-full font-bold text-sm shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            Nuestra colección la aumentamos día a día
          </span>
        </div>
        
        {/* Barra de Tiempo de Entrega */}
        <div className="inline-flex items-center gap-1 bg-[#000000] border border-green-200 text-[#fac932] px-6 py-3 rounded-full font-semibold shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#fff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <span>Entregas de <strong>3 a 5 días hábiles</strong></span>
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