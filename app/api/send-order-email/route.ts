import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nombre, email, telefono, metodo_pago, total, items, giftCards, pedidoId } = await request.json();

    // 1. Formatear productos para el cliente
    const productosLista = items && items.length > 0 
      ? items.map((item: any) => `<li style="margin-bottom: 8px;">🖼️ ${item.titulo} <span style="color: #6b7280;">- Bs. ${(item.precio || 0).toLocaleString()}</span></li>`).join('')
      : '<li>No hay productos</li>';

    // 2. Formatear Gift Cards
    const giftCardsLista = giftCards && giftCards.length > 0
      ? giftCards.map((gc: any) => `<li style="margin-bottom: 8px; color: #92400e;">🎁 Gift Card de Bs. ${gc.monto.toLocaleString()} <span style="font-size: 12px; color: #6b7280;">(Código se enviará al aprobar el pago)</span></li>`).join('')
      : '';

    // 3. Diseño del correo para el CLIENTE
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; background-color: #f9fafb; border-radius: 12px;">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4a3010; font-size: 24px; margin: 0;">¡Gracias por tu compra, ${nombre}!</h1>
          <p style="color: #6b7280; font-size: 16px; margin-top: 10px;">Hemos recibido tu pedido <strong>#${pedidoId}</strong> correctamente.</p>
        </div>

        <div style="background-color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h3 style="color: #4a3010; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; margin-top: 0;">📦 Resumen de tu pedido:</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${productosLista}
            ${giftCardsLista ? `<li style="margin-top: 15px; border-top: 1px dashed #e5e7eb; padding-top: 15px; font-weight: bold;">${giftCardsLista}</li>` : ''}
          </ul>
          
          <div style="margin-top: 25px; text-align: right; border-top: 2px solid #4a3010; padding-top: 15px;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Total a pagar:</p>
            <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: 800; color: #4a3010;">Bs. ${total.toLocaleString()}</p>
          </div>
        </div>

        <div style="margin-top: 25px; text-align: center;">
          <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
            En breve revisaremos tu comprobante de pago y te confirmaremos la aprobación. 
            <br/>
            <strong>Si tu pedido incluye Gift Cards, te enviaremos los códigos en un correo separado</strong> una vez verificado el pago.
          </p>
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            ¿Tienes dudas? Responde a este correo o escríbenos por WhatsApp.
          </p>
        </div>

      </div>
    `;

    // 4. Enviar el correo AL CLIENTE (usando la variable 'email')
    const { data, error } = await resend.emails.send({
      from: 'Mi Lienzo Decor <soporte@milienzodecor.com>',
      to: [email], // <--- AQUÍ ESTABA EL ERROR: antes estaba hardcodeado a 'soporte@...'
      subject: `✅ Confirmación de Pedido #${pedidoId} - Mi Lienzo Decor`,
      html: htmlContent,
    });

    if (error) {
      console.error('❌ Error al enviar correo al cliente:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    console.log('✅ Correo de confirmación enviado a:', email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error interno en la ruta de correo:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}