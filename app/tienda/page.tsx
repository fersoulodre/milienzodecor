import { getAllProductos } from '@/lib/productos';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function TiendaPage() {
  // Obtenemos TODOS los productos (sin filtrar solo los destacados)
  const todosLosProductos = (await getAllProductos()).reverse();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Nuestra Colección Completa</h1>
      <p className="text-gray-500 mb-8">Explora todas las obras disponibles en nuestra tienda.</p>
      
      {/* Cuadrícula con todos los cuadros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {todosLosProductos.map(producto => (
          <ProductCard key={producto.id} product={producto} />
        ))}
      </div>
    </main>
  );
}