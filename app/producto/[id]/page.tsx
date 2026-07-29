import { getAllProductos } from '@/lib/productos';
import ProductDetailClient from '@/components/ProductDetailClient';

export const dynamic = 'force-dynamic';

// Este es un Componente de Servidor (NO tiene 'use client')
// Aquí es donde SÍ podemos usar await tranquilamente
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Esperamos a que Supabase nos dé los productos con su stock real
  const productos = await getAllProductos();
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
          <a href="/" className="text-blue-600 hover:underline font-medium">← Volver al inicio</a>
        </div>
      </div>
    );
  }

  // Le pasamos el producto ya cargado al componente interactivo
  return <ProductDetailClient producto={producto} />;
}