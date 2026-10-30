'use client';
import { useState } from 'react';
import { generarGiftCardPromocional } from '@/app/actions';
import Link from 'next/link';

export default function AdminGiftCards() {
  const [monto, setMonto] = useState(50);
  const [generando, setGenerando] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState<{ code: string; fechaExpiracion: string; monto: number } | null>(null);
  const [mensaje, setMensaje] = useState('');

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

  const copiarCodigo = () => {
    if (codigoGenerado) {
      navigator.clipboard.writeText(codigoGenerado.code);
      alert('Código copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/pedidos" className="text-gray-600 hover:text-black mb-4 inline-block">
            ← Volver a Pedidos
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Gift Cards</h1>
          <p className="text-gray-600 mt-2">Genera Gift Cards promocionales para regalar a tus clientes</p>
        </div>

        {/* Sección para generar Gift Card promocional */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">🎁 Generar Gift Card Promocional</h2>
          <p className="text-sm text-gray-600 mb-4">
            Las Gift Cards promocionales tienen <strong>30 días de validez</strong> desde la fecha de generación.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona el monto:
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[50, 100, 200, 500].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonto(m)}
                  className={`p-4 rounded-lg border-2 font-semibold transition-all cursor-pointer ${
                    monto === m
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  Bs. {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerar}
            disabled={generando}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {generando ? 'Generando...' : `Generar Gift Card de Bs. ${monto}`}
          </button>

          {mensaje && (
            <div className={`mt-4 p-4 rounded-lg ${mensaje.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {mensaje}
            </div>
          )}

          {/* Mostrar código generado */}
          {codigoGenerado && (
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-yellow-900 mb-3">🎉 Gift Card Generada</h3>
              
              <div className="bg-white p-4 rounded-lg border border-yellow-200 mb-4">
                <p className="text-sm text-gray-600 mb-1">Código:</p>
                <p className="text-3xl font-mono font-black text-yellow-900 tracking-widest text-center">
                  {codigoGenerado.code}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Monto:</p>
                  <p className="font-bold text-lg">Bs. {codigoGenerado.monto}</p>
                </div>
                <div>
                  <p className="text-gray-600">Vence el:</p>
                  <p className="font-bold text-lg">
                    {new Date(codigoGenerado.fechaExpiracion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={copiarCodigo}
                className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors cursor-pointer"
              >
                📋 Copiar Código
              </button>

              <p className="text-xs text-yellow-700 mt-3 text-center">
                Envía este código al cliente por WhatsApp o email
              </p>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">📋 Instrucciones de uso:</h3>
          <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
            <li>Selecciona el monto de la Gift Card que quieres regalar</li>
            <li>Haz clic en "Generar Gift Card"</li>
            <li>Copia el código generado</li>
            <li>Envíalo al cliente por WhatsApp o email</li>
            <li>El cliente podrá canjearlo en la tienda dentro de los próximos 30 días</li>
          </ol>
        </div>
      </div>
    </div>
  );
}