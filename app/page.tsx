import { getAllProductos } from '@/lib/productos';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const todosProductos = getAllProductos().filter(p => p.destacado === true);
  
  const estilosOrdenados = ['Abstractos Minimalistas', 'Abstractos Forte', 'Figuras Humanas', 'Arte Pop']; // Asegúrate de que tu nueva categoría esté aquí
  const estilos = estilosOrdenados.filter(e => todosProductos.some(p => p.estilo === e));

  return (
    <main className="max-w-7xl mx-auto px-4 py-5">
      
      {/* Hero con Slogan y Barra de Entrega */}
      <section className="text-center py-12 mb-8 bg-gray-50 rounded-2xl border border-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          No vendemos cuadros... <span className="text-[#734d12]">Vendemos arte.</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Transforma tus espacios con piezas únicas, exclusivas y hechas para inspirar.
        </p>
        
        <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-full font-semibold shadow-sm mx-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <span>Envíos a todo Bolivia en <strong>3 a 5 días hábiles</strong></span>
        </div>
      </section>

      {/* Secciones de Productos por Estilo */}
      {estilos.map((estilo, index) => {
        const cuadrosEstilo = todosProductos.filter(p => p.estilo === estilo);
        const bgColor = index % 2 === 0 ? '#ffffff' : '#f6f7f7';
        
        return (
          <section 
            key={estilo} 
            // CAMBIO AQUÍ: p-4 en móvil, p-8 en escritorio. gap-3 en móvil, gap-6 en escritorio.
            className="mb-8 p-4 md:p-8 rounded-2xl"
            style={{ backgroundColor: bgColor }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-800 text-center md:text-left">
              {estilo}
            </h2>
            <p className="text-gray-500 mb-4 md:mb-6 text-center md:text-left text-sm md:text-base">
              Haz click en la pintura para elegir el tamaño.
            </p>
            
            {/* CAMBIO AQUÍ: gap-3 en móvil para que las imágenes sean más grandes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {cuadrosEstilo.map(producto => (
                <ProductCard key={producto.id} product={producto} />
              ))}
            </div>
            
            <div className="text-center md:text-left mt-6 md:mt-8">
              <Link 
                href={`/categoria/${estilo.toLowerCase().replace(/\s+/g, '-')}`} 
                className="inline-block border-2 border-gray-800 text-gray-800 px-6 py-2 md:px-8 md:py-3 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300 text-sm md:text-base"
              >
                Ver más →
              </Link>
            </div>
          </section>
        );
      })}
    </main>
  );
}