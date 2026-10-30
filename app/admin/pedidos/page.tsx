import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { actualizarTipoCambio, manejarEstadoPedido } from '@/app/actions';
import Link from 'next/link';
// Inicializa Supabase con variables de entorno del servidor
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// En Next.js 15, searchParams es una Promesa, la definimos así para evitar errores
type Props = {
  searchParams: Promise<{
    saved?: string;
    tab?: string; // <-- Agregamos esta línea
  }>;
};

export default async function AdminPedidos({ searchParams }: Props) {
  // 1. Esperamos a que se resuelva la promesa de searchParams
  const resolvedSearchParams = await searchParams;

  // 2. Obtener pedidos pendientes de verificación
         const tab = resolvedSearchParams.tab || 'pendientes';
   let query = supabaseAdmin.from('pedidos').select('*').order('id', { ascending: false });

   if (tab === 'pendientes') {
     query = query.in('estado', ['pendiente_pago', 'pendiente_verificacion']);
   } else if (tab === 'aprobados') {
     query = query.in('estado', ['pagado', 'aprobado', 'enviado', 'completado']);
   }

   const { data: pedidos, error } = await query;

  // 3. Obtener el tipo de cambio actual
  const { data: tipoCambioData } = await supabaseAdmin
    .from('tipo_cambio')
    .select('tasa')
    .eq('id', 1)
    .single();
  
  const valorActual = tipoCambioData?.tasa || 10.73;

  if (error) return <div className="p-8 text-red-600">Error al cargar pedidos: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Administración - Comprobantes</h1>

                  {/* Pestañas de navegación */}
          <div className="flex gap-6 mb-8 border-b border-gray-200">
            <Link href="/admin/pedidos?tab=pendientes" className={`pb-3 px-1 text-sm font-semibold transition-colors ${tab === 'pendientes' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}>
              Pendientes de pago
            </Link>
            <Link href="/admin/pedidos?tab=aprobados" className={`pb-3 px-1 text-sm font-semibold transition-colors ${tab === 'aprobados' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}>
              Aprobados
            </Link>
            <Link href="/admin/pedidos?tab=todos" className={`pb-3 px-1 text-sm font-semibold transition-colors ${tab === 'todos' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}>
              Ver todos
            </Link>
          </div>
        
        {pedidos.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            No hay comprobantes pendientes de verificación.
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido: any) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800">Pedido #{pedido.id}</h3>
                  <p className="text-sm text-gray-600">Fecha: {new Date(pedido.fecha_creacion).toLocaleString()}</p>
                </div>
                
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-semibold">Email:</span> {pedido.email}</p>
                    <p className="text-sm"><span className="font-semibold">Nombre:</span> {pedido.nombre || 'No especificado'}</p>
                    <p className="text-sm"><span className="font-semibold">Método de pago:</span> <span className="uppercase font-bold text-blue-600">{pedido.metodo_pago}</span></p>
                    <p className="text-2xl font-bold text-green-600 mt-4">Total: Bs. {pedido.total}</p>
                  </div>

                  <div className="border-l pl-0 md:pl-6 border-gray-200">
  {/* Mostrar detalle de lo comprado */}
  {pedido.detalles?.items && pedido.detalles.items.length > 0 && (
    <>
      <p className="font-semibold mb-2">Productos:</p>
      <ul className="text-sm text-gray-700 space-y-1 mb-4">
        {pedido.detalles.items.map((item: any, idx: number) => (
          <li key={idx} className="flex justify-between">
            <span>{item.titulo || item.nombre} {item.dimensiones && `(${item.dimensiones})`}</span>
            <span className="font-bold">Bs. {(item.precio || 0).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </>
  )}

  {/* Mostrar códigos de Gift Card si existen */}
  {pedido.detalles?.giftCards && pedido.detalles.giftCards.length > 0 && (
    <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg mb-4 text-center">
      <p className="text-xs text-yellow-800 font-bold uppercase tracking-wider mb-2">🎁 Código(s) de Gift Card</p>
      {pedido.detalles.giftCards.map((codigo: string, idx: number) => (
        <p key={idx} className="text-2xl font-mono font-black text-yellow-900 tracking-widest">{codigo}</p>
      ))}
      <p className="text-xs text-yellow-700 mt-2">Copia y envía este código al cliente.</p>
    </div>
  )}

  {/* Comprobante de pago */}
  <p className="font-semibold mb-2">Comprobante de pago:</p>
  {pedido.comprobante_url ? (
    pedido.comprobante_url.endsWith('.pdf') ? (
      <a href={pedido.comprobante_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mb-2 text-sm">
        📄 Ver PDF del comprobante
      </a>
    ) : (
      <img 
        src={pedido.comprobante_url} 
        alt="Comprobante de pago" 
        className="max-h-64 rounded border border-gray-300 shadow-sm"
      />
    )
  ) : (
    <p className="text-red-500 text-sm">Sin comprobante adjunto</p>
  )}
</div>
                </div>

                {(pedido.estado === 'pendiente_pago' || pedido.estado === 'pendiente_verificacion') ? (
  <div className="flex gap-3 mt-4">
    <form action={manejarEstadoPedido}>
      <input type="hidden" name="id" value={pedido.id} />
      <input type="hidden" name="estado" value="pagado" />
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 cursor-pointer">
        ✅ Aprobar Pago
      </button>
    </form>
    <form action={manejarEstadoPedido}>
      <input type="hidden" name="id" value={pedido.id} />
      <input type="hidden" name="estado" value="rechazado" />
      <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 cursor-pointer">
        ❌ Rechazar
      </button>
    </form>
  </div>
) : (
  <div className="mt-4 flex items-center gap-2">
    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm">
      ✅ Pago verificado - Estado: {pedido.estado}
    </span>
  </div>
)}
              </div>
            ))}
          </div>
        )}

        {/* Mensaje de éxito: usa la variable resuelta (resolvedSearchParams) */}
        {resolvedSearchParams?.saved === 'true' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2 mt-8">
            <span>✅</span>
            <span>¡Tipo de cambio actualizado correctamente! El carrito ya usa el nuevo valor.</span>
          </div>
        )}

        {/* Control de Tipo de Cambio */}
        <div className="bg-white p-6 rounded-lg shadow mt-8 border border-gray-200">
          <h2 className="font-bold mb-4 text-lg text-gray-800">💱 Actualizar Tipo de Cambio USDT</h2>
          
          <form action={async (formData) => {
            'use server';
            const tasaStr = formData.get('tasa') as string;
            if (!tasaStr) return;
            
            const tasa = parseFloat(tasaStr);
            await actualizarTipoCambio(tasa);
            
            redirect('/admin/pedidos?saved=true');
          }} className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nueva tasa (Bs por USDT)</label>
              <input 
                name="tasa" 
                type="number" 
                step="0.01" 
                defaultValue={valorActual.toString()}
                className="border border-gray-300 p-2 rounded w-32 text-sm" 
                required
              />
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 text-sm font-semibold">
              Guardar Cambio
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-3">
            Valor actual en base de datos: <strong>Bs. {valorActual}</strong>. Modifícalo y guarda.
          </p>
        </div>

      </div>
    </div>
  );
}