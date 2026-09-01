'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import { Producto } from '@/lib/productos';

const PRECIO_POR_M2_IMPRESION = 355; 
const AREA_MINIMA_M2 = 0.09; // Área mínima en metros cuadrados (ej: 30x30cm = 0.09m²)
export default function ProductDetailClient({ producto }: { producto: Producto }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [viewMode, setViewMode] = useState<'original' | 'mockup'>('original');
  const [marcoSeleccionado, setMarcoSeleccionado] = useState('bastidor');  
  const [showMinWarningModal, setShowMinWarningModal] = useState(false);

  const opcionesMarco = [
    { id: 'sin-marco', nombre: 'Sin marco', precioMetroLineal: 0, imagen: '' },
    { id: 'bastidor', nombre: 'Marco bastidor', precioMetroLineal: 100, imagen: '/images/marcos/marco-bastidor.jpg' },
    //{ id: 'madera', nombre: 'Marco color madera', precioMetroLineal: 150, imagen: '/images/marcos/marco-color-madera1.jpg' },
    //{ id: 'negro', nombre: 'Marco color negro', precioMetroLineal: 150, imagen: '/images/marcos/marco-color-negro1.jpg' }
  ];

  useEffect(() => {
    const wMeters = Number(width) / 100;
    const hMeters = Number(height) / 100;
    const area = wMeters * hMeters;
    const perimeter = 2 * (wMeters + hMeters);
    
    const marco = opcionesMarco.find(m => m.id === marcoSeleccionado);
    const precioMarco = marco ? marco.precioMetroLineal : 0;
    
    const calculated = (area * PRECIO_POR_M2_IMPRESION) + (perimeter * precioMarco);
    setFinalPrice(Math.round(calculated / 0.87));
  }, [width, height, marcoSeleccionado]);

  const mockupUrl = producto.imagen.replace(/(\.[^.]+)$/, '-mockup$1');

  const handleAddToCart = () => {
    const w = Number(width);
    const h = Number(height);

    const wMeters = w / 100;
const hMeters = h / 100;
const areaM2 = wMeters * hMeters;

if (width === '' || height === '' || areaM2 < AREA_MINIMA_M2) {
  setShowMinWarningModal(true);
  return;
}

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

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="relative aspect-[3/2] bg-white rounded-lg overflow-hidden mb-2 border border-gray-200">
              <Image 
                src={viewMode === 'mockup' ? mockupUrl : producto.imagen} 
                alt={producto.titulo} 
                fill 
                className="object-contain" 
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setViewMode('original')}
                className={`relative w-24 h-16 cursor-pointer rounded overflow-hidden border-2 ${viewMode === 'original' ? 'border-black' : 'border-gray-300'}`}
              >
                <Image src={producto.imagen} alt="Original" fill className="object-contain" />
              </button>
              
              {mockupUrl !== producto.imagen && (
                <button 
                  onClick={() => setViewMode('mockup')}
                  className={`relative w-24 h-16 cursor-pointer rounded overflow-hidden border-2 ${viewMode === 'mockup' ? 'border-black' : 'border-gray-300'}`}
                >
                  <Image 
                    src={mockupUrl} 
                    alt="Ambiente" 
                    fill 
                    className="object-contain" 
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </button>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart} 
              disabled={producto.stock === 0}
              className={`mt-20 w-full cursor-pointer py-4 rounded-lg font-semibold transition-colors ${
                producto.stock === 0 ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {added ? '✓ Agregado' : (producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito')}
            </button>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm text-gray-500 uppercase">{producto.estilo}</span>
            <h1 className="text-4xl font-bold mt-2">{producto.titulo}</h1>
            
           {producto.stock === 1 && (
  <p className="text-red-600 font-semibold mt-2 flex items-center gap-2 text-sm md:text-base">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    ¡Apúrate! Solo queda 1 unidad de esta obra.
  </p>
)}

            {producto.stock === 0 && (
              <p className="text-gray-500 font-semibold mt-2">Esta obra ya ha sido vendida.</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-2 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ancho (cm)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  disabled={producto.stock === 0}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alto (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  disabled={producto.stock === 0}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
            </div>

            <p className="text-sm text-blue-600 mb-2 font-medium text-center">
              Ingresa medidas para calcular el precio
            </p>

            {(width !== '' && height !== '' && !isNaN(Number(width)) && !isNaN(Number(height)) && ((Number(width) / 100) * (Number(height) / 100)) < AREA_MINIMA_M2) && (
  <p className="text-xs text-red-500 mb-2 font-semibold text-center">
    ⚠️ El área mínima requerida es de {AREA_MINIMA_M2} m²
  </p>
)}

            <div className="mt-1">
              <p className="text-sm text-gray-600 mb-3">Referencias de proporciones:</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="relative bg-white rounded overflow-hidden border border-gray-200">
                    <Image src="/images/ref-marcos/106x160.jpg" alt="106 x 160" width={200} height={132} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">106 x 160</p>
                </div>
                <div className="text-center">
                  <div className="relative bg-white rounded overflow-hidden border border-gray-200">
                    <Image src="/images/ref-marcos/180x120.jpg" alt="180 x 120" width={200} height={132} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">180 x 120</p>
                </div>
                <div className="text-center">
                  <div className="relative bg-white rounded overflow-hidden border border-gray-200">
                    <Image src="/images/ref-marcos/70x70.jpg" alt="70 x 70" width={200} height={132} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">70 x 70</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Elige con o sin marco <span className="font-normal text-gray-500"></span>
              </label>
              
              <button
                onClick={() => setMarcoSeleccionado('sin-marco')}
                disabled={producto.stock === 0}
                className={`w-full mb-4 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-semibold transition-all disabled:opacity-50 ${
                  marcoSeleccionado === 'sin-marco' ? 'border-black bg-white text-black' : 'border-gray-300 text-gray-600 hover:border-gray-400'
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
                    disabled={producto.stock === 0}
                    className={`cursor-pointer relative rounded-lg overflow-hidden border-2 transition-all disabled:opacity-50 ${
                      marcoSeleccionado === marco.id ? 'border-black ring-2 ring-black' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="relative h-24 bg-white">
                      <Image src={marco.imagen as string} alt={marco.nombre} fill className="object-contain" />
                    </div>
                    <div className="p-2 text-center">
                      <p className="text-sm font-semibold">{marco.nombre}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 flex-wrap">
              {width !== '' && height !== '' && !isNaN(Number(width)) && !isNaN(Number(height)) && ((Number(width) / 100) * (Number(height) / 100)) >= AREA_MINIMA_M2 ? (
                <>
                  <p className="text-3xl font-bold">Bs. {finalPrice.toLocaleString()}</p>
                  <span className="text-xs text-gray-500">El precio incluye impuestos de ley.</span>
                </>
              ) : (
                <p className="text-lg text-gray-400 font-medium"></p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE ADVERTENCIA */}
      {showMinWarningModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Medida mínima no alcanzada
            </h3>
            <p className="text-center text-gray-700 font-medium mb-6 text-base">
  El área mínima permitida para los cuadros es de <strong>{AREA_MINIMA_M2} m²</strong>.
  Por favor, aumenta las dimensiones e inténtalo de nuevo.
</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Dimensiones ingresadas:</p>
              <div className="flex justify-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">Ancho</p>
                  <p className="font-bold text-red-600">{width || 0} cm</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Alto</p>
                  <p className="font-bold text-red-600">{height || 0} cm</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowMinWarningModal(false)}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Entendido, ajustar medidas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}