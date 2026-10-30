'use server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function generateGiftCardCode(monto: number, imagen: string) {
  const code = 'ML-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Calcular fecha de expiración: hoy + 30 días
  const hoy = new Date();
  const fechaExpiracion = new Date(hoy);
  fechaExpiracion.setDate(hoy.getDate() + 30);
  const fechaStr = fechaExpiracion.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('gift_cards')
    .insert([{ code, monto, imagen, used: false, fecha_expiracion: fechaStr }])
    .select()
    .single();
    
  if (error) {
    console.error('Error al generar Gift Card:', error);
    return { code: '', imagen: '', fechaExpiracion: '' };
  }
  return { code: data.code, imagen: data.imagen, fechaExpiracion: data.fecha_expiracion };
}

export async function validateGiftCardCode(code: string) {
  const { data: card, error } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .single();
    
  if (error || !card) {
    return { valid: false, mensaje: 'Código inválido o ya utilizado.' };
  }

  // Verificar si la tarjeta está expirada
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaExpiracion = new Date(card.fecha_expiracion);
  
  if (fechaExpiracion < hoy) {
    return { valid: false, mensaje: 'Tarjeta expirada.' };
  }

  await supabase
    .from('gift_cards')
    .update({ used: true })
    .eq('id', card.id);
    
  return { valid: true, monto: card.monto, imagen: card.imagen, fechaExpiracion: card.fecha_expiracion };
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
    console.log('📦 Intentando crear pedido con datos:', datos);
    
    const { data, error } = await supabase
      .from('pedidos')
      .insert({
        email: datos.email,
        nombre: datos.nombre,
        telefono: datos.telefono,
        total: datos.total,
        metodo_pago: datos.metodo_pago,
        estado: 'pendiente_pago',
        detalles: datos.detalles // Esto requiere que la columna exista en Supabase
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase al crear pedido:', error);
      throw error;
    }

    console.log('✅ Pedido creado exitosamente:', data);

    const itemsComprados = datos.detalles?.items || [];
    if (itemsComprados.length > 0) {
      const idsProductos = [...new Set(itemsComprados.map((item: any) => item.id))];
      const { data: inventarioActual, error: errorInventario } = await supabase
        .from('inventario')
        .select('id, stock')
        .in('id', idsProductos);

      if (!errorInventario && inventarioActual) {
        const actualizaciones = inventarioActual.map(itemInv => {
          const cantidadComprada = itemsComprados.filter((i: any) => i.id === itemInv.id).length;
          return {
            id: itemInv.id,
            stock: Math.max(0, itemInv.stock - cantidadComprada)
          };
        });
        await supabase.from('inventario').upsert(actualizaciones);
      }
    }

    return { success: true, pedidoId: data.id };
  } catch (error) {
    console.error(' Error completo al crear pedido:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'No se pudo crear el pedido' 
    };
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

// ✅ FUNCIÓN ACTUALIZADA: Ahora genera y guarda el código de la Gift Card al aprobar
export async function manejarEstadoPedido(formData: FormData) {
  const id = formData.get('id') as string;
  const nuevoEstado = formData.get('estado') as string;
  
  // 1. Obtener el pedido actual para ver sus detalles
  const { data: pedido } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single();

  let detallesActualizados = pedido?.detalles || {};

  // 2. Si se aprueba el pago y el pedido contiene una Gift Card, generamos el código
  if ((nuevoEstado === 'pagado' || nuevoEstado === 'aprobado' || nuevoEstado === 'verificado') && pedido?.detalles?.items) {
    const gcItem = pedido.detalles.items.find((item: any) => item.tipo === 'giftcard' || (item.nombre && item.nombre.toLowerCase().includes('gift card')));
    
    // Si es una gift card y aún no tiene código generado
    if (gcItem && !detallesActualizados.giftCardCode) {
      const monto = gcItem.monto || gcItem.precio || 100;
      const imagen = gcItem.imagen || '/images/giftcard-default.jpg';
      
      // Llamamos a la función que ya tienes para generar el código
      const { code } = await generateGiftCardCode(monto, imagen);
      
      if (code) {
        detallesActualizados.giftCardCode = code;
      }
    }
  }

  // 3. Actualizar el estado y guardar los detalles (con el nuevo código si aplica)
  await supabase
    .from('pedidos')
    .update({ 
      estado: nuevoEstado,
      detalles: detallesActualizados
    })
    .eq('id', id);
    
  redirect('/admin/pedidos');
}

export async function verificarStockPublico(codigoCorto: string) {
  try {
    const codigoLimpio = codigoCorto.trim().toUpperCase();
    if (!codigoLimpio) {
      return { success: false, message: 'Por favor ingresa un código.', resultados: [] };
    }
    const { data, error } = await supabase
      .from('inventario')
      .select('id, stock')
      .filter('id', 'like', `%-${codigoLimpio}`);

    if (error) {
      return { success: false, message: 'Error al consultar la base de datos.', resultados: [] };
    }
    if (!data || data.length === 0) {
      return { success: false, message: `No encontramos ningún cuadro con el código "${codigoLimpio}".`, resultados: [] };
    }
    return {
      success: true,
      message: `Encontramos ${data.length} obra con el código "${codigoLimpio}":`,
      resultados: data
    };
  } catch (error) {
    return { success: false, message: 'Error inesperado. Intenta de nuevo.', resultados: [] };
  }
}