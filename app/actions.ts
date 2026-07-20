'use server';

import { supabase } from '@/lib/supabase';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'gift-cards-db.json');

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
  detalles: any;// Aquí guardaremos un resumen de lo que compró
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
        // Puedes agregar un campo 'detalles' a la tabla más adelante si quieres guardar el JSON del carrito
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, pedidoId: data.id };
  } catch (error) {
    console.error('Error al crear pedido:', error);
    return { success: false, error: 'No se pudo crear el pedido' };
  }
}

import { revalidatePath } from 'next/cache'; // Asegúrate de que esta línea esté arriba en el archivo

export async function actualizarTipoCambio(nuevaTasa: number) {
  try {
    // Actualizar directamente la fila con id = 1
    const { error } = await supabase
      .from('tipo_cambio')
      .update({ tasa: nuevaTasa })
      .eq('id', 1);

    if (error) {
      console.error('Error al actualizar tipo de cambio:', error);
      return { success: false, error: error.message };
    }

    // Forzar que la caché se actualice
    revalidatePath('/api/tipo-cambio');
    revalidatePath('/carrito');
    
    return { success: true };
  } catch (err) {
    console.error('Excepción en actualizarTipoCambio:', err);
    return { success: false, error: 'Error inesperado' };
  }
}
import { redirect } from 'next/navigation'; // Asegúrate de que esta importación esté arriba en el archivo

export async function manejarEstadoPedido(formData: FormData) {
  const id = formData.get('id') as string;
  const nuevoEstado = formData.get('estado') as string;
  
  await supabase
    .from('pedidos')
    .update({ estado: nuevoEstado })
    .eq('id', id);
    
  redirect('/admin/pedidos');
}