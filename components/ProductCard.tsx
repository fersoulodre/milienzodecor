import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  titulo: string;
  precio?: number;
  estilo: string;
  imagen: string;
  disponible?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/producto/${product.id}`} className="block group">
      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
        <Image
          src={product.imagen}
          alt={product.titulo}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.disponible && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">VENDIDO</span>
          </div>
        )}
      </div>
      <div className="mt-1">
        <h3 className="font-semibold text-lg text-center">{product.titulo}</h3>
        
      </div>
    </Link>
  );
}