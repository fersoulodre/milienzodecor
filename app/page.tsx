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
    <main className="max-w-7xl mx-auto px-4 py-5">
      {estilos.map((estilo, index) => {
        const cuadrosEstilo = todosProductos.filter(p => p.estilo === estilo);
        // Usamos estilo en línea para garantizar el color (blanco o gris suave)
        const bgColor = index % 2 === 0 ? '#ffffff' : '#f6f7f7';
        
        return (
          <section 
            key={estilo} 
            className="mb-4 p-8 rounded-lg"
            style={{ backgroundColor: bgColor }}
          >
            <h2 className="text-4xl font-bold mb-8">{estilo}</h2>
            <p className="text-gray-500 mb-6">Haz click en la pintura para elegir el tamaño.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {cuadrosEstilo.map(producto => (
                <ProductCard key={producto.id} product={producto} />
              ))}
            </div>
            <Link 
              href={`/categoria/${estilo.toLowerCase().replace(/\s+/g, '-')}`} 
              className="inline-block mt-8 border-2 border-black text-black px-8 py-3 font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Ver más →
            </Link>
          </section>
        );
      })}
    </main>
  );
}