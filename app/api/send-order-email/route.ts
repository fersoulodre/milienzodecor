import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const MONTO_RESERVA = 80;

export async function POST(request: Request) {
  try {
    const { nombre, email, telefono, metodo_pago, total, items, giftCards, pedidoId } = await request.json();

    // ==========================================
    // 1. CORREO PARA EL CLIENTE
    // ==========================================
    
        // Construir lista de productos CON IMÁGENES
    let productosLista = '';
    
    if (items && items.length > 0) {
      productosLista = items.map((item: any) => {
        // Asegurar URL completa de la imagen
        let imgUrl = item.imagen || '';
        if (imgUrl.startsWith('/')) {
          imgUrl = `https://milienzodecor.com${imgUrl}`;
        }
        
        return `
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6;">
            <img src="${imgUrl}" alt="${item.titulo}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;" />
            <div style="flex: 1;">
              <p style="margin: 0; font-weight: 600; color: #1f2937; font-size: 14px;">${item.titulo}</p>
              <p style="margin: 5px 0 0 0; color: #4a3010; font-weight: 800; font-size: 16px;">Bs. ${(item.precio || 0).toLocaleString()}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    // Construir lista de Gift Cards
    let giftCardsLista = '';
    if (giftCards && giftCards.length > 0) {
      giftCardsLista = giftCards.map((gc: any) => 
        `<div style="margin-bottom: 8px; padding: 10px; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px;">
          <p style="margin: 0; color: #92400e; font-weight: 600;">🎁 Gift Card de Bs. ${gc.monto.toLocaleString()}</p>
          <p style="margin: 3px 0 0 0; font-size: 12px; color: #6b7280;">Código se enviará al aprobar el pago</p>
        </div>`
      ).join('');
    }

    // Combinar listas
    let listaFinal = '';
    if (productosLista && giftCardsLista) {
      listaFinal = `${productosLista}<div style="margin-top: 20px; padding-top: 15px; border-top: 2px dashed #e5e7eb;"><p style="font-weight: bold; margin-bottom: 10px; color: #4a3010;">🎁 Gift Cards incluidas:</p>${giftCardsLista}</div>`;
    } else if (giftCardsLista) {
      listaFinal = `<p style="font-weight: bold; margin-bottom: 10px; color: #4a3010;"> Gift Cards compradas:</p>${giftCardsLista}`;
    } else if (productosLista) {
      listaFinal = productosLista;
    } else {
      listaFinal = '<li style="color: #9ca3af;">No hay productos</li>';
    }

    const htmlCliente = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4a3010; font-size: 24px; margin: 0;">¡Gracias por tu compra, ${nombre}!</h1>
          <p style="color: #6b7280; font-size: 16px; margin-top: 10px;">Hemos recibido tu pedido <strong>#${pedidoId}</strong> correctamente.</p>
        </div>
        <div style="background-color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h3 style="color: #4a3010; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; margin-top: 0;">📦 Resumen de tu pedido:</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">${listaFinal}</ul>
          <div style="margin-top: 25px; text-align: right; border-top: 2px solid #4a3010; padding-top: 15px;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Total del pedido:</p>
            <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: 800; color: #4a3010;">Bs. ${total.toLocaleString()}</p>
          </div>
        </div>
        <p style="text-align: center; font-size: 15px; color: #4b5563; margin-top: 25px;">En breve revisaremos tu comprobante. Si tu pedido incluye Gift Cards, te enviaremos los códigos en un correo separado al aprobarlo.</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Mi Lienzo Decor <soporte@milienzodecor.com>',
      to: [email],
      subject: `✅ Hemos recibido tu pedido #${pedidoId} - Mi Lienzo Decor`,
      html: htmlCliente,
    });

    // ==========================================
    // 2. CORREO PARA EL ADMINISTRADOR (TÚ)
    // ==========================================
    const metodoPagoTexto = metodo_pago === 'transferencia_banco' ? 'Pago Total por QR' : metodo_pago === 'reserva_contra_entrega' ? '⚠️ RESERVA + CONTRA ENTREGA' : 'Binance Pay';
    const productosTextoAdmin = items && items.length > 0 ? items.map((item: any) => `- ${item.titulo} (Código: ${item.id}) | Bs. ${(item.precio || 0).toLocaleString()}`).join('\n') : 'Ninguno';
    const giftCardsTextoAdmin = giftCards && giftCards.length > 0 ? giftCards.map((gc: any) => `- 🎁 Gift Card de Bs. ${gc.monto.toLocaleString()}`).join('\n') : 'Ninguna';
    const saldoPendiente = metodo_pago === 'reserva_contra_entrega' ? total - MONTO_RESERVA : 0;

    const htmlAdmin = `
      <h2 style="color: #1f2937;">🎨 Nuevo Pago Reportado - Mi Lienzo Decor</h2>
      <p><strong>ID del Pedido:</strong> ${pedidoId || 'Pendiente'}</p>
      <p><strong>Cliente:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
      <p><strong>Método de Pago:</strong> ${metodoPagoTexto}</p>
      <p><strong>Total del Pedido:</strong> Bs. ${total.toLocaleString()}</p>
      ${metodo_pago === 'reserva_contra_entrega' ? `<div style="background-color: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; border-radius: 8px; margin: 15px 0;"><p style="margin: 0; font-weight: bold;">⚠️ IMPORTANTE: SALDO PENDIENTE</p><p style="margin: 5px 0 0 0;">El cliente solo pagó la reserva de <strong>Bs. ${MONTO_RESERVA}</strong>. Debes cobrar el saldo restante de <strong>Bs. ${saldoPendiente.toLocaleString()}</strong> en efectivo al entregar.</p></div>` : ''}
      <h3 style="color: #1f2937; margin-top: 20px;">🖼️ Productos:</h3>
      <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px;">${productosTextoAdmin}</pre>
      <h3 style="color: #1f2937; margin-top: 20px;">🎁 Gift Cards:</h3>
      <pre style="background: #fffbeb; color: #92400e; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px; border: 1px solid #fcd34d;">${giftCardsTextoAdmin}</pre>
      <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">El cliente ha sido redirigido para subir su comprobante. Verifica el pago en tu panel de admin.</p>
    `;

    await resend.emails.send({
      from: 'Mi Lienzo Decor <soporte@milienzodecor.com>',
      to: ['soporte@milienzodecor.com'],
      subject: `🔔 Nuevo Pago Reportado - Pedido #${pedidoId || 'Sin ID'}`,
      html: htmlAdmin,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error en la ruta de correo:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}