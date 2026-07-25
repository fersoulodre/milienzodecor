import { getAllProductos } from '@/lib/productos';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const todosProductos = getAllProductos().filter(p => p.destacado === true);
  
  // Agrupar por estilo
  const estilosOrdenados = ['Abstractos Minimalistas', 'Abstractos Forte', 'Figuras Humanas'];
  const estilos = estilosOrdenados.filter(e => todosProductos.some(p => p.estilo === e));

  return (
    <main className="max-w-7xl mx-auto px-4 py-0">
      
      {/* NUEVA SECCIÓN: Hero con Slogan y Barra de Entrega */}
      <section className="text-center py-12 mb-0 bg-gray-50 rounded-2xl border border-gray-100">
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Transforma tu mundo con piezas únicas, exclusivas y hechas para inspirar.
        </p>
        
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
            className="mb-8 p-8 rounded-2xl"
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