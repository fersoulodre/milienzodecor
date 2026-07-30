'use client';
import { useState } from 'react';
import { verificarStockPublico } from '@/app/actions';

export default function StockVerifierModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [cargando, setCargando] = useState(false);

  const handleVerificar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    setCargando(true);
    setResultado(null);
    
    const respuesta = await verificarStockPublico(codigo);
    setResultado(respuesta);
    setCargando(false);
  };

  return (
    <>
      {/* Botón Flotante */}
      {/* Botón Flotante */}
<button
  onClick={() => { setIsOpen(true); setResultado(null); setCodigo(''); }}
  className="fixed bottom-6 right-6 z-40 bg-black text-white rounded-full shadow-2xl hover:bg-gray-800 transition-all flex items-center gap-2 font-semibold group cursor-pointer px-3 py-2 sm:px-4 sm:py-4 text-xs sm:text-base"
  title="Verificar stock en tiempo real"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Verificar Stock</span>
</button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
          >
            {/* Botón cerrar */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 hover:text-black transition-colors"
              style={{ color: '#6b7280' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>
              🔍 Verificar stock real
            </h3>
            <p className="text-sm mb-4" style={{ color: '#374151' }}>
              Ingresa el código de la obra para comprobar cuántas unidades quedan. <br/>
              <span className="text-xs" style={{ color: '#6b7280' }}>
                Ejemplo: <span className="font-mono px-1 rounded" style={{ backgroundColor: '#f3f4f6', color: '#1f2937' }}>M51</span>
              </span>
            </p>
            
            <form onSubmit={handleVerificar} className="flex flex-col gap-3">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Escribe el código (ej: M51)..."
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-black focus:outline-none uppercase"
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#d1d5db', 
                  color: '#000000' 
                }}
                autoFocus
              />
              <button
                type="submit"
                disabled={cargando || !codigo.trim()}
                className="w-full py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                style={{ backgroundColor: '#000000', color: '#ffffff' }}
              >
                {cargando ? 'Consultando...' : 'Verificar ahora'}
              </button>
            </form>

            {resultado && (
              <div className="mt-4 p-4 rounded-lg text-sm font-medium border-2" style={{
                backgroundColor: resultado.success ? '#f0fdf4' : '#fef2f2',
                borderColor: resultado.success ? '#86efac' : '#fca5a5',
                color: resultado.success ? '#166534' : '#991b1b'
              }}>
                {resultado.success ? (
                  <div>
                    <p className="mb-3 font-semibold" style={{ color: '#166534' }}>{resultado.message}</p>
                    <div className="space-y-2">
                      {resultado.resultados.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center p-2 rounded border" style={{
                          backgroundColor: '#ffffff',
                          borderColor: '#86efac'
                        }}>
                          <span className="font-mono text-xs truncate mr-2" style={{ color: '#374151' }}>
                            {item.id}
                          </span>
                          <span className="font-bold" style={{ color: '#15803d' }}>
                            {item.stock === 0 ? 'Agotado' : `${item.stock} disponibles`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="flex items-start gap-2">
                    <span className="text-lg">❌</span>
                    <span style={{ color: '#991b1b' }}>{resultado.message}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}