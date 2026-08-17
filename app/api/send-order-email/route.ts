import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nombre, email, telefono, metodo_pago, total, items, pedidoId } = await request.json();

    // Formatear la lista de productos para que se vea ordenada en el correo
    const productosTexto = items.map((item: any) => 
      `- ${item.titulo} (Código: ${item.id}) | Bs. ${(item.precio || 0).toLocaleString()}`
    ).join('\n');

    const htmlContent = `
      <h2 style="color: #1f2937;">🎨 Nuevo Pago Reportado - Mi Lienzo Decor</h2>
      <p><strong>ID del Pedido:</strong> ${pedidoId || 'Pendiente'}</p>
      <p><strong>Cliente:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
      <p><strong>Método de Pago:</strong> ${metodo_pago === 'transferencia_banco' ? 'Transferencia por QR' : 'Binance Pay'}</p>
      <p><strong>Total Reportado:</strong> Bs. ${total.toLocaleString()}</p>
      
      <h3 style="color: #1f2937; margin-top: 20px;">🖼️ Productos en el pedido:</h3>
      <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px;">${productosTexto}</pre>
      
      <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
        El cliente ha sido redirigido para subir su comprobante. Por favor, verifica el pago en tu cuenta bancaria o Binance.
      </p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Mi Lienzo Decor <onboarding@resend.dev>', // Remitente permitido en el plan gratuito
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