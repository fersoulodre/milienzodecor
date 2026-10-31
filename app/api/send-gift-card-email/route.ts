import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, nombre, codigo, monto, fechaExpiracion } = await request.json();

    const fechaFormateada = new Date(fechaExpiracion).toLocaleDateString('es-ES', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });

    await resend.emails.send({
      from: 'Mi Lienzo Decor <soporte@milienzodecor.com>',
      to: [email],
      subject: `🎁 ¡Tu Gift Card de Bs. ${monto} está lista!`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          
          <!-- Encabezado -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4a3010; font-size: 24px; margin: 0;">¡Hola ${nombre}!</h1>
            <p style="color: #6b7280; font-size: 16px; margin-top: 10px;">Tu pago ha sido verificado exitosamente. Aquí tienes tu regalo:</p>
          </div>

          <!-- Diseño de la Tarjeta (Imita el PNG) -->
          <div style="background: linear-gradient(135deg, #4a3010 0%, #8b5a2b 100%); border-radius: 16px; padding: 32px; color: #ffffff; text-align: center; border: 1px solid rgba(255, 215, 0, 0.3); box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
            
            <!-- Logo (Asegúrate de que esta URL sea la pública de tu logo) -->
            <div style="margin-bottom: 20px;">
              <img src="https://milienzodecor.com/logo.png" alt="Mi Lienzo Decor" style="max-width: 150px; height: auto;" />
              <div style="display: inline-block; background-color: rgba(255, 215, 0, 0.2); border: 1px solid rgba(255, 215, 0, 0.5); padding: 4px 16px; border-radius: 999px; font-size: 12px; font-weight: bold; color: #fef3c7; margin-top: 10px;">
                GIFT CARD
              </div>
            </div>

            <!-- Monto -->
            <div style="margin: 30px 0;">
              <p style="margin: 0; color: #fef3c7; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Valor de regalo</p>
              <h2 style="margin: 10px 0; color: #ffffff; font-size: 48px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Bs. ${monto}</h2>
            </div>

            <!-- Código y Fecha -->
            <div style="background-color: rgba(0, 0, 0, 0.3); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="margin: 0 0 8px 0; color: #fef3c7; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Código de canje</p>
              <p style="margin: 0 0 16px 0; color: #ffffff; font-size: 28px; font-family: 'Courier New', monospace; font-weight: 900; letter-spacing: 3px;">${codigo}</p>
              
              <p style="margin: 0 0 4px 0; color: #fef3c7; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Válido hasta</p>
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600;">${fechaFormateada}</p>
            </div>
          </div>

          <!-- Instrucciones -->
          <div style="margin-top: 30px; text-align: center; color: #4b5563; font-size: 14px; line-height: 1.6;">
            <p>Para usarla, simplemente agrega productos a tu carrito en <a href="https://milienzodecor.com" style="color: #8b5a2b; font-weight: bold; text-decoration: none;">milienzodecor.com</a> e ingresa este código al finalizar la compra.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">¿Tienes dudas? Responde a este correo y te ayudaremos con gusto.</p>
          </div>

        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando correo de Gift Card:', error);
    return NextResponse.json({ success: false, error: 'Error al enviar correo' });
  }
}