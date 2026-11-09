import { getAllProductos } from '@/lib/productos';
import ProductDetailClient from '@/components/ProductDetailClient';
import { generarDescripcionSEO } from '@/lib/seo-productos';

export const dynamic = 'force-dynamic';

// Este es un Componente de Servidor (NO tiene 'use client')
// Aquí es donde SÍ podemos usar await tranquilamente
// METADATA para SEO (Google leerá esto)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productos = await getAllProductos();
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return {
      title: 'Producto no encontrado | Mi Lienzo Decor',
      description: 'El cuadro que buscas no está disponible en nuestra tienda.'
    };
  }

  const descripcionSEO = generarDescripcionSEO(producto.estilo, producto.id);

  return {
    title: `Cuadro ${producto.id} | Mi Lienzo Decor Bolivia`,
    description: descripcionSEO,
    alternates: {
      canonical: `https://milienzodecor.com/producto/${producto.id}`,
    },
  };
}

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
  const descripcionSEO = generarDescripcionSEO(producto.estilo, producto.id);

return <ProductDetailClient producto={producto} descripcionSEO={descripcionSEO} />;
}