import { NextResponse } from 'next/server';
import { Resend } from 'resend'; // Asumo que usas Resend. Si usas Nodemailer, avísame.

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, nombre, codigo, monto, fechaExpiracion } = await request.json();

    await resend.emails.send({
      from: 'Mi Lienzo Decor <soporte@milienzodecor.com>',
      to: [email],
      subject: `🎁 ¡Tu Gift Card de Bs. ${monto} está lista!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a3010;">¡Hola ${nombre}!</h1>
          <p>Tu pago ha sido verificado exitosamente. Aquí tienes los detalles de tu Gift Card:</p>
          
          <div style="background-color: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">Tu código de canje es:</p>
            <h2 style="margin: 10px 0; color: #4a3010; font-size: 32px; letter-spacing: 2px;">${codigo}</h2>
            <p style="margin: 0; color: #92400e; font-size: 14px;">Válido hasta: ${new Date(fechaExpiracion).toLocaleDateString('es-ES')}</p>
          </div>

          <p>Para usarla, simplemente agrega productos a tu carrito en <a href="https://milienzodecor.com">milienzodecor.com</a> e ingresa este código al finalizar la compra.</p>
          <p>¡Gracias por elegirnos!</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando correo de Gift Card:', error);
    return NextResponse.json({ success: false, error: 'Error al enviar correo' });
  }
}