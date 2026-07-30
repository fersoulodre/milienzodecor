'use client';
import { useState } from 'react';
import { verificarStockPublico } from '@/app/actions';

export default function StockVerifierModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<{ success: boolean; message?: string; stock?: number; id?: string } | null>(null);
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
      <button
        onClick={() => { setIsOpen(true); setResultado(null); setCodigo(''); }}
        className="fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-all flex items-center gap-2 font-semibold group"
        title="Verificar stock en tiempo real"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline">Verificar Stock</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-2">🔍 Verificar stock real</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa el código de la obra para comprobar cuántas unidades quedan. <br/>
              <span className="text-xs text-gray-400">Ejemplo: <span className="font-mono bg-gray-100 px-1 rounded">abstractos_minimalista-m67</span></span>
            </p>
            
            <form onSubmit={handleVerificar} className="flex flex-col gap-3">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Escribe el código aquí..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none uppercase"
                autoFocus
              />
              <button
                type="submit"
                disabled={cargando || !codigo.trim()}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {cargando ? 'Consultando...' : 'Verificar ahora'}
              </button>
            </form>

            {resultado && (
              <div className={`mt-4 p-4 rounded-lg text-sm font-medium border ${
                resultado.success 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                {resultado.success ? (
                  <p className="flex items-start gap-2">
                    <span className="text-lg">✅</span>
                    <span>
                      La obra <strong>{resultado.id}</strong> tiene actualmente <strong>{resultado.stock} unidades</strong> disponibles en nuestra bodega.
                    </span>
                  </p>
                ) : (
                  <p className="flex items-start gap-2">
                    <span className="text-lg">❌</span>
                    <span>{resultado.message}</span>
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