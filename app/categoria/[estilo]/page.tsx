import Link from 'next/link';
import { getProductosPorEstilo } from '@/lib/productos';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function CategoriaPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ estilo: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { estilo } = await params;
  const { page = '1' } = await searchParams;
  
  const paginaActual = parseInt(page as string) || 1;
  const productosPorPagina = 16;
  
  // Convertir el slug de vuelta al nombre del estilo
  const estiloNombre = estilo
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Obtener TODOS los productos de esta categoría
  const cuadrosCategoria = getProductosPorEstilo(estiloNombre);
  
  // Calcular paginación
  const totalPaginas = Math.ceil(cuadrosCategoria.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPagina = cuadrosCategoria.slice(indiceInicio, indiceFin);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/" className="text-gray-600 hover:text-black mb-6 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="text-4xl font-bold mb-8">{estiloNombre}</h1>
        <p className="text-gray-600 mb-8">
          Explora toda nuestra colección de {estiloNombre.toLowerCase()}. 
          Haz click en cualquier pintura para personalizar el tamaño.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productosPagina.map(producto => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>

        {productosPagina.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No hay productos disponibles en esta categoría.
          </p>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {/* Flecha anterior */}
            {paginaActual > 1 && (
              <Link 
                href={`/categoria/${estilo}?page=${paginaActual - 1}`}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                ← Anterior
              </Link>
            )}

            {/* Números de página */}
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
              <Link
                key={num}
                href={`/categoria/${estilo}?page=${num}`}
                className={`px-4 py-2 border rounded ${
                  paginaActual === num
                    ? 'bg-black text-white border-black'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {num}
              </Link>
            ))}

            {/* Flecha siguiente */}
            {paginaActual < totalPaginas && (
              <Link 
                href={`/categoria/${estilo}?page=${paginaActual + 1}`}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}