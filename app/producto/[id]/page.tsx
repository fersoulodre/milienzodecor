'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { getAllProductos, getConfig } from '@/lib/productos';
import { useCart } from '@/components/CartContext';

const PRECIO_POR_M2_IMPRESION = 300; 

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const config = getConfig();

  const producto = getAllProductos().find(p => p.id === params.id);

  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [viewMode, setViewMode] = useState<'original' | 'mockup'>('original');
  const [marcoSeleccionado, setMarcoSeleccionado] = useState('sin-marco');
  
  // Cambiamos 'null' por '' para que TypeScript no se queje
  const opcionesMarco = [
    { id: 'sin-marco', nombre: 'Sin marco', precioMetroLineal: 0, imagen: '' },
    { id: 'bastidor', nombre: 'Marco bastidor', precioMetroLineal: 40, imagen: '/images/marcos/marco-bastidor.jpg' },
    { id: 'madera', nombre: 'Marco color madera', precioMetroLineal: 55, imagen: '/images/marcos/marco-color-madera1.jpg' },
    { id: 'negro', nombre: 'Marco color negro', precioMetroLineal: 50, imagen: '/images/marcos/marco-color-negro1.jpg' }
  ];

  useEffect(() => {
    if (!producto) return;
    const wMeters = Number(width) / 100;
    const hMeters = Number(height) / 100;
    const area = wMeters * hMeters;
    const perimeter = 2 * (wMeters + hMeters);
    
    const marco = opcionesMarco.find(m => m.id === marcoSeleccionado);
    const precioMarco = marco ? marco.precioMetroLineal : 0;
    
    const calculated = (area * PRECIO_POR_M2_IMPRESION) + (perimeter * precioMarco);
    setFinalPrice(Math.round(calculated));
  }, [width, height, producto, marcoSeleccionado]);

  const mockupUrl = producto ? producto.imagen.replace(/(\.[^.]+)$/, '-mockup$1') : '';

  if (!producto) return <div className="p-8">Producto no encontrado</div>;

  const handleAddToCart = () => {
    const marco = opcionesMarco.find(m => m.id === marcoSeleccionado);
    addToCart({ 
      ...producto, 
      precio: finalPrice, 
      dimensiones: `${width}x${height}cm`,
      marco: marco?.nombre || 'Sin marco'
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="mb-3 cursor-pointer text-gray-600 hover:text-black">
          ← Volver
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="relative aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden mb-2 border border-gray-200">
              <Image 
                src={viewMode === 'mockup' ? mockupUrl : producto.imagen} 
                alt={producto.titulo} 
                fill 
                className="object-cover" 
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setViewMode('original')}
                className={`relative w-24 h-16 cursor-pointer rounded overflow-hidden border-2 ${viewMode === 'original' ? 'border-black' : 'border-gray-300'}`}
              >
                <Image src={producto.imagen} alt="Original" fill className="object-cover" />
              </button>
              <button 
                onClick={() => setViewMode('mockup')}
                className={`relative w-24 h-16 cursor-pointer rounded overflow-hidden border-2 ${viewMode === 'mockup' ? 'border-black' : 'border-gray-300'}`}
              >
                <Image src={mockupUrl} alt="Ambiente" fill className="object-cover" />
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm text-gray-500 uppercase">{producto.estilo}</span>
            <h1 className="text-4xl font-bold mt-2">{producto.titulo}</h1>
            
            <div className="mt-2 grid grid-cols-2 gap-1">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Ancho (cm)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" value={width} onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Ingresa tu medida" className="w-full border border-gray-300 rounded p-2 placeholder-red-400" />
                  <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 7v10M16 7v10M8 17h8" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Alto (cm)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" value={height} onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Ingresa tu medida" className="w-full border border-gray-300 rounded p-2 placeholder-red-400" />
                  <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16M12 4l-3 3M12 4l3 3M12 20l-3-3M12 20l3-3" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-3">Referencias de proporciones:</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="relative bg-gray-100 rounded overflow-hidden border border-gray-200">
                    <Image src="/images/ref-marcos/106x160.jpg" alt="106 x 160" width={200} height={132} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">106 x 160</p>
                </div>
                <div className="text-center">
                  <div className="relative bg-gray-100 rounded overflow-hidden border border-gray-200">
                    <Image src="/images/ref-marcos/180x120.jpg" alt="180 x 120" width={200} height={132} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">180 x 120</p>
                </div>
                <div className="text-center">
                  <div className="relative bg-gray-100 rounded overflow-hidden border border-gray-200">
                    <Image src="/images/ref-marcos/70x70.jpg" alt="70 x 70" width={200} height={132} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">70 x 70</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de Marco</label>
              
              <button
                onClick={() => setMarcoSeleccionado('sin-marco')}
                className={`w-full mb-4 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-semibold transition-all ${
                  marcoSeleccionado === 'sin-marco' 
                    ? 'border-black bg-gray-100 text-black' 
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {marcoSeleccionado === 'sin-marco' && (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Sin marco
              </button>

              <div className="grid grid-cols-3 gap-4">
                {opcionesMarco.filter(m => m.id !== 'sin-marco').map(marco => (
                  <button
                    key={marco.id}
                    onClick={() => setMarcoSeleccionado(marco.id)}
                    className={`cursor-pointer relative rounded-lg overflow-hidden border-2 transition-all ${
                      marcoSeleccionado === marco.id ? 'border-black ring-2 ring-black' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="relative h-24 bg-gray-100">
                      {/* Usamos 'as string' porque el filtro ya garantiza que no es 'sin-marco' */}
                      <Image src={marco.imagen as string} alt={marco.nombre} fill className="object-cover" />
                    </div>
                    <div className="p-2 text-center">
                      <p className="text-sm font-semibold">{marco.nombre}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-3xl font-bold">Bs. {finalPrice.toLocaleString()}</p>
            </div>

            <button onClick={handleAddToCart} className="mt-3 w-full cursor-pointer bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800">
              {added ? '✓ Agregado' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}