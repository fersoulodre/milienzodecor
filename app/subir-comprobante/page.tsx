'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getConfig } from '@/lib/productos';

// 1. Inicializar cliente de Supabase (esto SÍ va afuera)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2. El componente empieza aquí
function FormularioComprobante() {
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get('pedido');
  
  // 3. AQUÍ es donde debe ir getConfig()
  const config = getConfig();

  // 4. Estado del email con la memoria del navegador
  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('email_compra') || '';
    }
    return '';
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pedidoId || !email || !archivo) {
      setMensaje('❌ Completa todos los campos.');
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      // 1. Verificar que el pedido y el email coincidan
      const { data: pedido, error: errorPedido } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', pedidoId)
        .eq('email', email)
        .single();

      if (errorPedido || !pedido) {
        setMensaje('❌ No encontramos un pedido con ese número y correo.');
        setCargando(false);
        return;
      }

      if (pedido.estado !== 'pendiente_pago') {
        setMensaje('⚠️ Este pedido ya fue procesado.');
        setCargando(false);
        return;
      }

      // 2. Subir archivo a Supabase Storage
      const fileExt = archivo.name.split('.').pop();
      const fileName = `${pedidoId}_${Date.now()}.${fileExt}`;
      
      const { error: errorUpload } = await supabase.storage
        .from('comprobantes')
        .upload(fileName, archivo);

      if (errorUpload) {
        setMensaje(' Error al subir la imagen.');
        setCargando(false);
        return;
      }

      // 3. Obtener URL pública de la imagen
      const { data: urlData } = supabase.storage
        .from('comprobantes')
        .getPublicUrl(fileName);

      // 4. Actualizar el pedido en la base de datos
      const { error: errorUpdate } = await supabase
        .from('pedidos')
        .update({ 
          comprobante_url: urlData.publicUrl,
          estado: 'pendiente_verificacion' 
        })
        .eq('id', pedidoId);

      if (errorUpdate) {
        setMensaje('❌ Error al guardar los datos.');
        setCargando(false);
        return;
      }

      setMensaje('✅ ¡Comprobante enviado con éxito! Revisaremos tu pago pronto.');
    } catch (error) {
      setMensaje('❌ Ocurrió un error inesperado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Subir Comprobante</h2>
        <p className="text-center text-gray-500 mb-6">Pedido #{pedidoId}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico de la compra</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo (Imagen o PDF)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:bg-gray-400"
          >
            {cargando ? 'Enviando...' : 'Enviar Comprobante'}
          </button>
        </form>

                {mensaje && (
          <div className={`mt-4 p-4 rounded-lg text-sm text-center ${mensaje.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="mb-3 font-semibold">{mensaje}</p>
            
            {mensaje.includes('✅') && (
              <a
                href={`https://wa.me/${config.whatsapp}?text=Hola, ya subí mi comprobante para el pedido #${pedidoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Avisar por WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubirComprobantePage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Cargando...</div>}>
      <FormularioComprobante />
    </Suspense>
  );
}