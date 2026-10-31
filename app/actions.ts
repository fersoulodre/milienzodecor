export async function manejarEstadoPedido(formData: FormData) {
  const id = formData.get('id') as string;
  const nuevoEstado = formData.get('estado') as string;

  if (!id || !nuevoEstado) {
    return { success: false, error: 'Faltan datos' };
  }

  try {
    // 1. Obtener el pedido actual para ver si tiene Gift Cards
    const { data: pedido, error: fetchError } = await supabaseAdmin
      .from('pedidos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !pedido) {
      return { success: false, error: 'Pedido no encontrado' };
    }

    // 2. Actualizar el estado del pedido
    const { error: updateError } = await supabaseAdmin
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // 3. SI el estado es "pagado" o "aprobado" Y el pedido tiene Gift Cards, enviar el correo
    if ((nuevoEstado === 'pagado' || nuevoEstado === 'aprobado') && pedido.detalles?.giftCards?.length > 0) {
      try {
        // Calcular fecha de expiración (30 días desde hoy)
        const hoy = new Date();
        const fechaExp = new Date(hoy);
        fechaExp.setDate(hoy.getDate() + 30);

        // Enviar un correo por cada Gift Card del pedido
        for (const codigo of pedido.detalles.giftCards) {
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://milienzodecor.com'}/api/send-gift-card-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: pedido.email,
              nombre: pedido.nombre,
              codigo: codigo,
              monto: pedido.total, // O el monto específico de la GC si lo tienes separado
              fechaExpiracion: fechaExp.toISOString()
            })
          });
        }
        console.log(`✅ Correos de Gift Card enviados para el pedido ${id}`);
      } catch (emailError) {
        console.error('❌ Error enviando correo de Gift Card:', emailError);
        // No fallamos la actualización del pedido si solo falla el correo, pero lo registramos
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error en manejarEstadoPedido:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}