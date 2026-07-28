import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  titulo: string;
  precio?: number;
  estilo: string;
  imagen: string;
  stock?: number;
  disponible?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const estaVendido = product.stock !== undefined 
    ? product.stock === 0 
    : product.disponible === false;

  const stockRestante = product.stock !== undefined ? product.stock : 99;

  return (
    <Link href={`/producto/${product.id}`} className="block group">
      
      {/* Textos de estado centrados */}
      {estaVendido ? (
        <p className="text-red-600 font-bold text-xs mb-1 uppercase tracking-wide text-center">
          Vendido
        </p>
      ) : stockRestante <= 4 && stockRestante !== 99 ? (
        <p className="text-gray-500 text-xs mb-1 text-center">
          Solo {stockRestante} disponibles
        </p>
      ) : null}

      {/* Imagen limpia */}
      <div className="relative aspect-[3/2] overflow-hidden bg-white">
        <Image
          src={product.imagen}
          alt={product.titulo}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="mt-1 md:mt-2">
        <h3 className="font-semibold text-sm md:text-lg text-center leading-tight text-gray-800">
          {product.titulo}
        </h3>
      </div>
    </Link>
  );
}