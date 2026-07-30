'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const DB_PATH = process.cwd() + '/data/gift-cards-db.json'; // Mantenemos tu ruta original

export async function generateGiftCardCode(monto: number, imagen: string) {
  const code = 'ML-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const { data, error } = await supabase
    .from('gift_cards')
    .insert([{ code, monto, imagen, used: false }])
    .select()
    .single();

  if (error) {
    console.error('Error al generar Gift Card:', error);
    return { code: '', imagen: '' };
  }

  return { code: data.code, imagen: data.imagen };
}

export async function validateGiftCardCode(code: string) {
  const { data: card, error } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .single();

  if (error || !card) {
    return { valid: false };
  }

  // Marcar como usada
  await supabase
    .from('gift_cards')
    .update({ used: true })
    .eq('id', card.id);

  return { valid: true, monto: card.monto, imagen: card.imagen };
}

export async function crearPedido(datos: {
  email: string;
  nombre: string;
  telefono: string;
  total: number;
  metodo_pago: string;
  detalles: any;
}) {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .insert({
        email: datos.email,
        nombre: datos.nombre,
        telefono: datos.telefono,
        total: datos.total,
        metodo_pago: datos.metodo_pago,
        estado: 'pendiente_pago',
      })
      .select()
      .single();

    if (error) throw error;

    // ==========================================
    // NUEVO: Descontar stock automáticamente
    // ==========================================
    const itemsComprados = datos.detalles?.items || [];
    
    if (itemsComprados.length > 0) {
      // 1. Obtener IDs únicos de los productos comprados
      const idsProductos = [...new Set(itemsComprados.map((item: any) => item.id))];
      
      // 2. Obtener stock actual de esos productos desde la tabla 'inventario'
      const { data: inventarioActual, error: errorInventario } = await supabase
        .from('inventario')
        .select('id, stock')
        .in('id', idsProductos);

      if (!errorInventario && inventarioActual) {
        // 3. Calcular el nuevo stock restando la cantidad comprada
        const actualizaciones = inventarioActual.map(itemInv => {
          const cantidadComprada = itemsComprados.filter((i: any) => i.id === itemInv.id).length;
          return {
            id: itemInv.id,
            stock: Math.max(0, itemInv.stock - cantidadComprada) // Nunca bajar de 0
          };
        });

        // 4. Actualizar el stock en Supabase
        await supabase
          .from('inventario')
          .upsert(actualizaciones);
      }
    }
    // ==========================================

    return { success: true, pedidoId: data.id };
  } catch (error) {
    console.error('Error al crear pedido:', error);
    return { success: false, error: 'No se pudo crear el pedido' };
  }
}

export async function actualizarTipoCambio(nuevaTasa: number) {
  try {
    const { error } = await supabase
      .from('tipo_cambio')
      .update({ tasa: nuevaTasa })
      .eq('id', 1);

    if (error) {
      console.error('Error al actualizar tipo de cambio:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/api/tipo-cambio');
    revalidatePath('/carrito');
    return { success: true };
  } catch (err) {
    console.error('Excepción en actualizarTipoCambio:', err);
    return { success: false, error: 'Error inesperado' };
  }
}

export async function manejarEstadoPedido(formData: FormData) {
  const id = formData.get('id') as string;
  const nuevoEstado = formData.get('estado') as string;

  await supabase
    .from('pedidos')
    .update({ estado: nuevoEstado })
    .eq('id', id);

  redirect('/admin/pedidos');
}

export async function verificarStockPublico(id: string) {
  try {
    const { data, error } = await supabase
      .from('inventario')
      .select('stock')
      .eq('id', id.trim().toLowerCase())
      .single();

    if (error || !data) {
      return { success: false, message: 'Código no encontrado. Verifica que esté bien escrito (ej: paisajes-p01).' };
    }

    return { success: true, stock: data.stock, id: id.trim() };
  } catch (error) {
    return { success: false, message: 'Error al consultar el stock. Intenta de nuevo.' };
  }
}