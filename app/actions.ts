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

export async function actualizarTipoCambio(nuevaTasa: number) {
 
  
  const { error } = await supabase
    .from('tipo_cambio')
    .update({ tasa: nuevaTasa })
    .eq('id', 1); // Asume que la fila que creaste tiene id 1

  if (error) return { success: false };
  return { success: true };
}