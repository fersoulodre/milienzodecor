import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { actualizarTipoCambio } from '@/app/actions';
import { revalidatePath } from 'next/cache';

// Inicializa Supabase con variables de entorno del servidor
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Definimos el tipo de searchParams de forma limpia para evitar errores de TypeScript
type Props = {
  searchParams?: { saved?: string };
};

export default async function AdminPedidos({ searchParams }: Props) {
  
  // 1. Obtener pedidos pendientes de verificación
  const { data: pedidos, error } = await supabaseAdmin
    .from('pedidos')
    .select('*')
    .eq('estado', 'pendiente_verificacion')
    .order('fecha_creacion', { ascending: false });

  // 2. Obtener el tipo de cambio actual
  const { data: tipoCambioData } = await supabaseAdmin
    .from('tipo_cambio')
    .select('tasa')
    .eq('id', 1)
    .single();
  
  const valorActual = tipoCambioData?.tasa || 10.73;

  if (error) return <div className="p-8 text-red-600">Error al cargar pedidos: {error.message}</div>;

  // 3. Función para aprobar/rechazar (Server Action)
  async function cambiarEstado(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const nuevoEstado = formData.get('estado');
    
    await supabaseAdmin
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', id);
      
    redirect('/admin/pedidos');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Administración - Comprobantes</h1>
        
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
                  {/* Información del cliente */}
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-semibold">Email:</span> {pedido.email}</p>
                    <p className="text-sm"><span className="font-semibold">Nombre:</span> {pedido.nombre || 'No especificado'}</p>
                    <p className="text-sm"><span className="font-semibold">Método de pago:</span> <span className="uppercase font-bold text-blue-600">{pedido.metodo_pago}</span></p>
                    <p className="text-2xl font-bold text-green-600 mt-4">Total: Bs. {pedido.total}</p>
                  </div>

                  {/* Comprobante */}
                  <div className="border-l pl-0 md:pl-6 border-gray-200">
                    <p className="font-semibold mb-2">Comprobante de pago:</p>
                    {pedido.comprobante_url ? (
                      pedido.comprobante_url.endsWith('.pdf') ? (
                        <a href={pedido.comprobante_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mb-2">
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

                {/* Botones de acción */}
                <div className="bg-gray-50 px-6 py-4 flex gap-4 border-t border-gray-200">
                  <form action={cambiarEstado}>
                    <input type="hidden" name="id" value={pedido.id} />
                    <input type="hidden" name="estado" value="pagado" />
                    <button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition duration-200"
                    >
                      ✅ Aprobar Pago
                    </button>
                  </form>

                  <form action={cambiarEstado}>
                    <input type="hidden" name="id" value={pedido.id} />
                    <input type="hidden" name="estado" value="rechazado" />
                    <button 
                      type="submit" 
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition duration-200"
                    >
                      ❌ Rechazar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje de éxito (solo aparece si viene de guardar el tipo de cambio) */}
        {searchParams?.saved === 'true' && (
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
            
            // Redirige a la misma página con el parámetro ?saved=true para mostrar el mensaje
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