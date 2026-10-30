'use client';
import { useState, useRef } from 'react';
import { generarGiftCardPromocional } from '@/app/actions';
import Link from 'next/link';
import { toPng } from 'html-to-image';

export default function AdminGiftCards() {
  const [monto, setMonto] = useState(50);
  const [generando, setGenerando] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState<{ code: string; fechaExpiracion: string; monto: number } | null>(null);
  const [mensaje, setMensaje] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerar = async () => {
    setGenerando(true);
    setMensaje('');
    setCodigoGenerado(null);

    const formData = new FormData();
    formData.append('monto', monto.toString());

    const resultado = await generarGiftCardPromocional(formData);

    if (resultado.success && resultado.code) {
      setCodigoGenerado({
        code: resultado.code,
        fechaExpiracion: resultado.fechaExpiracion || '',
        monto
      });
      setMensaje('✅ Gift Card promocional generada exitosamente');
    } else {
      setMensaje(`❌ Error: ${resultado.error || 'No se pudo generar'}`);
    }
    setGenerando(false);
  };

  const descargarImagen = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `GiftCard-${codigoGenerado?.code}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al descargar:', err);
      alert('No se pudo descargar la imagen');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/pedidos" className="text-gray-600 hover:text-black mb-4 inline-block">← Volver a Pedidos</Link>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Gift Cards</h1>
          <p className="text-gray-600 mt-2">Genera y descarga Gift Cards promocionales listas para enviar.</p>
        </div>

        {/* Generador */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">🎁 Generar Nueva Gift Card</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona el monto:</label>
            <div className="grid grid-cols-4 gap-3">
              {[50, 100, 200, 500].map((m) => (
                <button key={m} onClick={() => setMonto(m)} className={`p-4 rounded-lg border-2 font-semibold transition-all cursor-pointer ${monto === m ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                  Bs. {m}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerar} disabled={generando} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:bg-gray-400">
            {generando ? 'Generando...' : `Generar Gift Card de Bs. ${monto}`}
          </button>
          {mensaje && <div className={`mt-4 p-4 rounded-lg ${mensaje.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{mensaje}</div>}
        </div>

        {/* Tarjeta Visual y Botón de Descarga */}
        {codigoGenerado && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">🖼️ Tu Gift Card está lista</h2>
            
            {/* Diseño de la Tarjeta (Esto es lo que se descarga) */}
            <div className="flex justify-center mb-6">
              <div ref={cardRef} className="w-[600px] h-[340px] bg-gradient-to-br from-[#4a3010] to-[#8b5a2b] rounded-2xl p-8 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden border border-yellow-600/30">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
                
                {/* Header */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h3 className="text-2xl font-bold tracking-wider text-yellow-100">MI LIENZO</h3>
                    <p className="text-xs tracking-[0.3em] text-yellow-200/80">D E C O R</p>
                  </div>
                  <span className="bg-yellow-500/20 border border-yellow-400/50 px-4 py-1 rounded-full text-sm font-semibold text-yellow-100 backdrop-blur-sm">GIFT CARD</span>
                </div>

                {/* Monto */}
                <div className="z-10 text-center my-2">
                  <p className="text-yellow-200/80 text-sm uppercase tracking-widest mb-1">Valor de regalo</p>
                  <p className="text-5xl font-bold text-white drop-shadow-lg">Bs. {codigoGenerado.monto}</p>
                </div>

                {/* Footer con Código y Fecha */}
                <div className="flex justify-between items-end z-10 bg-black/30 p-5 rounded-xl backdrop-blur-md border border-white/10">
                  <div>
                    <p className="text-yellow-200/70 text-[10px] uppercase tracking-widest mb-1">Código de canje</p>
                    <p className="text-2xl font-mono font-black tracking-widest text-yellow-50">{codigoGenerado.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-200/70 text-[10px] uppercase tracking-widest mb-1">Válido hasta</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(codigoGenerado.fechaExpiracion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4">
              <button onClick={descargarImagen} className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors cursor-pointer flex items-center justify-center gap-2">
                📥 Descargar Imagen (PNG)
              </button>
              <button onClick={() => { navigator.clipboard.writeText(codigoGenerado!.code); alert('Código copiado'); }} className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors cursor-pointer">
                📋 Copiar solo el código
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">Descarga la imagen y envíala directamente por WhatsApp o correo.</p>
          </div>
        )}
      </div>
    </div>
  );
}