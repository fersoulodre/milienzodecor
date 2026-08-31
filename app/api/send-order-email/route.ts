import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const MONTO_RESERVA = 50; // Monto de la reserva (cámbialo aquí si decides usar 100)

export async function POST(request: Request) {
  try {
    const { nombre, email, telefono, metodo_pago, total, items, giftCards, pedidoId } = await request.json();

    // 1. Definir texto del método de pago
    const metodoPagoTexto = metodo_pago === 'transferencia_banco' 
      ? 'Pago Total por QR' 
      : metodo_pago === 'reserva_contra_entrega' 
        ? '⚠️ RESERVA + CONTRA ENTREGA' 
        : 'Binance Pay';

    // 2. Formatear productos
    const productosTexto = items && items.length > 0 
      ? items.map((item: any) => 
          `- ${item.titulo} (Código: ${item.id}) | Bs. ${(item.precio || 0).toLocaleString()}`
        ).join('\n')
      : 'Ninguno';

    // 3. Formatear Gift Cards
    const giftCardsTexto = giftCards && giftCards.length > 0
      ? giftCards.map((gc: any) => 
          `- 🎁 Gift Card de Bs. ${gc.monto.toLocaleString()} (El código se generará al aprobar el pedido)`
        ).join('\n')
      : 'Ninguna';

    // 4. Calcular saldo pendiente si es reserva
    const saldoPendiente = metodo_pago === 'reserva_contra_entrega' ? total - MONTO_RESERVA : 0;

    const htmlContent = `
      <h2 style="color: #1f2937;">🎨 Nuevo Pago Reportado - Mi Lienzo Decor</h2>
      <p><strong>ID del Pedido:</strong> ${pedidoId || 'Pendiente'}</p>
      <p><strong>Cliente:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
      <p><strong>Método de Pago:</strong> ${metodoPagoTexto}</p>
      <p><strong>Total del Pedido:</strong> Bs. ${total.toLocaleString()}</p>
      
      ${metodo_pago === 'reserva_contra_entrega' ? `
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0; font-weight: bold; font-size: 16px;">⚠️ IMPORTANTE: SALDO PENDIENTE</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">El cliente solo pagó la reserva de <strong>Bs. ${MONTO_RESERVA}</strong>. Debes cobrar el saldo restante de <strong>Bs. ${saldoPendiente.toLocaleString()}</strong> en efectivo al momento de la entrega.</p>
        </div>
      ` : ''}
      
      <h3 style="color: #1f2937; margin-top: 20px;">🖼️ Productos en el pedido:</h3>
      <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px;">${productosTexto}</pre>

      <h3 style="color: #1f2937; margin-top: 20px;">🎁 Gift Cards en el pedido:</h3>
      <pre style="background: #fffbeb; color: #92400e; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px; border: 1px solid #fcd34d;">${giftCardsTexto}</pre>
      
      <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
        El cliente ha sido redirigido para subir su comprobante. Por favor, verifica el pago en tu cuenta bancaria o Binance.
      </p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Mi Lienzo Decor <pedidos@milienzodecor.com>',
      to: ['soporte@milienzodecor.com'],
      subject: `🔔 Nuevo Pago Reportado - Pedido ${pedidoId || 'Sin ID'}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Error al enviar correo:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error en la ruta de correo:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}