'use server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Cliente Admin con permisos totales (ignora RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function generateGiftCardCode(monto: number, imagen: string, diasValidez: number = 180) {
  const code = 'ML-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const hoy = new Date();
  const fechaExpiracion = new Date(hoy);
  fechaExpiracion.setDate(hoy.getDate() + diasValidez);
  const fechaStr = fechaExpiracion.toISOString().split('T')[0];

   const tipo = diasValidez <= 60 ? 'promocional' : 'comprada';
  
  const { data, error } = await supabaseAdmin 
    .from('gift_cards')
    .insert([{ code, monto, imagen, used: false, fecha_expiracion: fechaStr, tipo }])
    .select()
    .single();
    
  if (error) {
    console.error('Error al generar Gift Card:', error);
    return { code: '', imagen: '', fechaExpiracion: '' };
  }
  return { code: data.code, imagen: data.imagen, fechaExpiracion: data.fecha_expiracion };
}

export async function validateGiftCardCode(code: string) {
  const { data: card, error } = await supabaseAdmin
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
  hoy.setHours(23, 59, 59, 999); // Fin del día actual
  const fechaExpiracion = new Date(card.fecha_expiracion);
  fechaExpiracion.setHours(23, 59, 59, 999); // Fin del día de expiración
  
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

export async function manejarEstadoPedido(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const nuevoEstado = formData.get('estado') as string;
  
  console.log('🔍 [DEBUG] Iniciando cambio de estado. ID:', id, 'Nuevo estado:', nuevoEstado);

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single();

  console.log('🔍 [DEBUG] Pedido encontrado:', pedido?.email, 'Estado actual:', pedido?.estado);

  let detallesActualizados = pedido?.detalles || {};

  if (nuevoEstado === 'pagado' || nuevoEstado === 'aprobado' || nuevoEstado === 'verificado') {
    const codigosGiftCards = detallesActualizados.giftCards || [];
    const items = detallesActualizados.items || [];
    const estadoAnterior = pedido?.estado;

    console.log('🔍 [DEBUG] Códigos GC:', codigosGiftCards, '| Items:', items.length, '| Estado anterior:', estadoAnterior);

    if (estadoAnterior === 'pendiente_pago' || estadoAnterior === 'pendiente_verificacion') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        // ==========================================
        // CONSTRUCCIÓN DEL CORREO UNIFICADO
        // ==========================================
        
        // 1. Sección de Gift Cards (si las hay)
        let seccionGiftCards = '';
        if (codigosGiftCards.length > 0) {
          const { data: gcData } = await supabase
            .from('gift_cards')
            .select('fecha_expiracion, monto')
            .in('code', codigosGiftCards)
            .limit(1)
            .single();

          const fechaExp = gcData?.fecha_expiracion || new Date(Date.now() + 180*24*60*60*1000).toISOString().split('T')[0];
          const montoGC = gcData?.monto || pedido.total;
          const fechaFormateada = new Date(fechaExp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

          seccionGiftCards = `
            <div style="background: linear-gradient(135deg, #4a3010 0%, #8b5a2b 100%); border-radius: 16px; padding: 32px; color: #ffffff; text-align: center; border: 1px solid rgba(255, 215, 0, 0.3); margin-top: 20px;">
              <div style="margin-bottom: 20px;">
                <img src="https://milienzodecor.com/logo.png" alt="Mi Lienzo Decor" style="max-width: 150px;" />
                <div style="display: inline-block; background-color: rgba(255, 215, 0, 0.2); border: 1px solid rgba(255, 215, 0, 0.5); padding: 4px 16px; border-radius: 999px; font-size: 12px; font-weight: bold; color: #fef3c7; margin-top: 10px;">GIFT CARD</div>
              </div>
              <div style="margin: 30px 0;">
                <p style="margin: 0; color: #fef3c7; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Valor de regalo</p>
                <h2 style="margin: 10px 0; color: #ffffff; font-size: 48px; font-weight: 800;">Bs. ${montoGC}</h2>
              </div>
              <div style="background-color: rgba(0, 0, 0, 0.3); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="margin: 0 0 8px 0; color: #fef3c7; font-size: 10px; text-transform: uppercase;">Código de canje</p>
                <p style="margin: 0 0 16px 0; color: #ffffff; font-size: 28px; font-family: monospace; font-weight: 900; letter-spacing: 3px;">${codigosGiftCards.join(', ')}</p>
                <p style="margin: 0 0 4px 0; color: #fef3c7; font-size: 10px; text-transform: uppercase;">Válido hasta</p>
                <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600;">${fechaFormateada}</p>
              </div>
            </div>
          `;
        }

        // 2. Sección de Productos/Cuadros (si los hay)
        let seccionProductos = '';
        if (items.length > 0) {
          const productosLista = items.map((item: any) => 
            `<li style="margin-bottom: 8px;">🖼️ ${item.titulo} <span style="color: #6b7280;">- Bs. ${(item.precio || 0).toLocaleString()}</span></li>`
          ).join('');
          
          seccionProductos = `
            <div style="background-color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb; margin-top: 20px;">
              <h3 style="color: #4a3010; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; margin-top: 0;">📦 Productos en tu pedido:</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">${productosLista}</ul>
            </div>
          `;
        }

        // 3. Determinar el asunto según el contenido
        let asunto = `✅ Pago aprobado - Pedido #${id}`;
        if (codigosGiftCards.length > 0 && items.length > 0) {
          asunto = `🎁 Tu Gift Card + Confirmación de Pedido #${id}`;
        } else if (codigosGiftCards.length > 0) {
          asunto = `🎁 ¡Tu Gift Card de Bs. ${pedido.total} está lista!`;
        }

        // 4. Enviar el correo unificado
        await resend.emails.send({
          from: 'Mi Lienzo Decor <soporte@milienzodecor.com>',
          to: [pedido.email],
          subject: asunto,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4a3010; font-size: 24px; margin: 0;">¡Hola ${pedido.nombre}!</h1>
                <p style="color: #6b7280; font-size: 16px; margin-top: 10px;">Tu pago ha sido verificado exitosamente.</p>
              </div>
              
              ${seccionGiftCards}
              ${seccionProductos}
              
              <div style="margin-top: 25px; text-align: right; border-top: 2px solid #4a3010; padding-top: 15px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Total pagado:</p>
                <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: 800; color: #4a3010;">Bs. ${pedido.total.toLocaleString()}</p>
              </div>
              
              <p style="text-align: center; font-size: 15px; color: #4b5563; margin-top: 25px;">
                ${codigosGiftCards.length > 0 ? 'Para usar tu Gift Card, ingresa el código al finalizar la compra en <a href="https://milienzodecor.com" style="color: #8b5a2b; font-weight: bold;">milienzodecor.com</a>' : 'Pronto te contactaremos para coordinar la entrega de tu obra.'}
                <br/><br/>
                ¿Tienes dudas? Responde a este correo o escríbenos por WhatsApp.
              </p>
            </div>
          `,
        });
        console.log('✅ [DEBUG] Correo enviado exitosamente.');
      } catch (err) {
        console.error('❌ [DEBUG] Error al enviar correo:', err);
      }
    }
  }

  await supabase
    .from('pedidos')
    .update({ 
      estado: nuevoEstado,
      detalles: detallesActualizados
    })
    .eq('id', id);
    
  redirect('/admin/pedidos');
}

export async function generarGiftCardPromocional(formData: FormData) {
  const monto = parseInt(formData.get('monto') as string);
  
  if (!monto || monto <= 0) {
    return { success: false, error: 'Monto inválido' };
  }

  // Usar imagen por defecto según el monto
  const imagen = `/images/gift-cards/gc-${monto}.jpg`;
  
  // Generar con 30 días de validez
  const { code, fechaExpiracion } = await generateGiftCardCode(monto, imagen, 30);
  
  if (!code) {
    return { success: false, error: 'No se pudo generar el código' };
  }

  return { 
    success: true, 
    code, 
    fechaExpiracion,
    mensaje: `Gift Card promocional de Bs. ${monto} generada exitosamente`
  };
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