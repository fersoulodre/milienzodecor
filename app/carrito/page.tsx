'use client';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { getConfig } from '@/lib/productos';
import { useState, useEffect } from 'react';
import { generateGiftCardCode, validateGiftCardCode, crearPedido } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function CarritoPage() {
  const { items, giftCards, removeFromCart, removeGiftCard, clearCart, total } = useCart();
  const router = useRouter();
  const config = getConfig();
  
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
   
  const MONTO_RESERVA = 50;
  const [metodoPago, setMetodoPago] = useState<'banco' | 'binance' | 'reserva'>('banco');

  const [giftCodeInput, setGiftCodeInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [giftCardImage, setGiftCardImage] = useState<string | null>(null);
  const [giftCardFecha, setGiftCardFecha] = useState<string | null>(null);
  const [applyingCode, setApplyingCode] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const totalConDescuento = Math.max(0, total - discount);
  const totalItems = items.length + giftCards.length;
  const [tipoCambio, setTipoCambio] = useState<number>(11.50);

  useEffect(() => {
    fetch('/api/tipo-cambio')
      .then(res => res.json())
      .then(data => {
        if (data.tasa) setTipoCambio(Number(data.tasa));
      })
      .catch(() => setTipoCambio(8.50));
  }, []);

  const montoUSDT = totalConDescuento / tipoCambio;
    // Función para formatear la fecha (ej: "31 Dic 2024")
 

  // Función para calcular la fecha de expiración (hoy + 30 días)
  const calcularFechaExpiracion = () => {
    const hoy = new Date();
    const fechaExp = new Date(hoy);
    fechaExp.setDate(hoy.getDate() + 30);
    return fechaExp.toISOString().split('T')[0];
  };
  // Función para formatear la fecha
  const formatearFecha = (fechaString: string) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const aplicarGiftCard = async () => {
    if (!giftCodeInput) return;
    setApplyingCode(true);
    const resultado = await validateGiftCardCode(giftCodeInput);
    
    if (resultado.valid) {
      setDiscount(resultado.monto);
      setGiftCardImage(resultado.imagen);
      setGiftCardFecha(resultado.fechaExpiracion);
      alert(`¡Gift Card canjeada! Se descuentan Bs. ${resultado.monto.toLocaleString()}`);
    } else {
      alert(resultado.mensaje || 'Código inválido o ya utilizado.');
    }
    setApplyingCode(false);
  };

  const finalizarCompra = async () => {
    if (!email || !nombre) {
      alert('Por favor, ingresa tu nombre y correo electrónico para continuar.');
      return;
    }

    setProcesando(true);

    let codigosGenerados: string[] = [];
    if (giftCards.length > 0) {
      for (const gc of giftCards) {
        const resultado = await generateGiftCardCode(gc.monto, gc.imagen);
        codigosGenerados.push(resultado.code);
      }
    }

    const respuesta = await crearPedido({
      email,
      nombre,
      telefono,
      total: totalConDescuento,
      metodo_pago: metodoPago === 'banco' ? 'transferencia_banco' : 'binance_pay',
      detalles: { items, giftCards: codigosGenerados, discount }
    });

    if (respuesta.success && respuesta.pedidoId) {
      try {
        await fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
  nombre,
  email,
  telefono,
  metodo_pago: metodoPago === 'banco' ? 'transferencia_banco' : metodoPago === 'reserva' ? 'reserva_contra_entrega' : 'binance_pay',
  total: totalConDescuento,
  items,
  giftCards,
  pedidoId: respuesta.pedidoId
})
        });
      } catch (error) {
        console.error('No se pudo enviar el correo, pero el pedido se guardó:', error);
      }

      alert('¡Pedido registrado con éxito! Se ha enviado una notificación a soporte@milienzodecor.com. Ahora serás redirigido para subir tu comprobante.');
      sessionStorage.setItem('email_compra', email);
      clearCart();
      router.push(`/subir-comprobante?pedido=${respuesta.pedidoId}`);
    } else {
      alert('Hubo un error al procesar tu pedido. Intenta de nuevo.');
      setProcesando(false);
    }
  };

  if (items.length === 0 && giftCards.length === 0 && discount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <a href="/" className="text-blue-600 hover:underline">Volver a la tienda</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-800">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <p className="text-xl font-bold text-gray-800">Total pedidos: {totalItems}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="font-bold text-lg mb-3">Datos para tu pedido</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo *" className="border border-gray-300 rounded p-2 text-sm w-full" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu correo electrónico *" className="border border-gray-300 rounded p-2 text-sm w-full" required />
            <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Tu número de WhatsApp (opcional)" className="border border-gray-300 rounded p-2 text-sm w-full md:col-span-2" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
              <div className="flex gap-3 items-center">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <Image src={item.imagen} alt={item.titulo} fill className="object-cover" />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 text-center leading-tight max-w-[128px]">{item.titulo}</p>
                </div>
                <p className="font-bold text-sm"> Bs. {(item.precio ?? 0).toLocaleString()}</p>
              </div>
              <button onClick={() => removeFromCart(item.cartId!)} className="bg-red-100 text-red-600 px-2 py-1 rounded cursor-pointer hover:bg-red-200 font-bold text-xs">Eliminar</button>
            </div>
          ))}
        </div>

        {/* Vista previa de Gift Card Canjeada con el rótulo de fecha */}
        {giftCardImage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-4">
            <div className="relative w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <Image src={giftCardImage} alt="Gift Card Canjeada" fill className="object-cover" />
              <div className="absolute bottom-0 right-0 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-tl-lg">
                Vence: {formatearFecha(giftCardFecha || '')}
              </div>
            </div>
            <div>
              <p className="font-bold text-green-800">Gift Card Canjeada</p>
              <p className="text-green-700 text-sm">Descuento aplicado: Bs. {discount.toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">Total a pagar:</span>
            <span className="text-xl font-bold text-black">Bs. {totalConDescuento.toLocaleString()}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 border-t pt-3 mb-3">
            <div>
              <h2 className="font-bold text-base mb-2"> Tus Gift Cards (Compradas)</h2>
              {giftCards.map((gc, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-25 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <Image src={gc.imagen} alt="Gift Card" fill className="object-cover" />
                        {gc.fechaExpiracion && (
                          <div className="absolute bottom-0 right-0 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-tl-lg">
                            Vence: {formatearFecha(gc.fechaExpiracion)}
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 text-center leading-tight w-40">Envíale esta imagen a tu beneficiario.</p>
                    </div>
                    <p className="font-bold text-sm">Bs. {gc.monto.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeGiftCard(gc.id)} className="bg-red-100 text-red-600 px-2 py-1 rounded cursor-pointer hover:bg-red-200 text-xs font-bold">Eliminar</button>
                </div>
              ))}
              {giftCards.length === 0 && <p className="text-gray-400 text-xs">Sin Gift Cards compradas</p>}
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <h2 className="font-bold text-base mb-2">Método de Pago</h2>

{/* Texto explicativo nuevo */}
<div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <h3 className="font-bold text-sm text-blue-800 mb-2">💳 Opciones de Pago:</h3>
  <ul className="text-xs text-gray-700 space-y-2">
    <li className="flex items-start gap-2">
      <span className="font-bold text-blue-600">1. Pago Total por QR:</span>
      <span>Pagas el 100% del valor ahora. Ideal para asegurar tu compra inmediatamente.</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="font-bold text-green-600">2. Reserva + Contra Entrega:</span>
      <span>Pagas solo <strong>Bs. {MONTO_RESERVA}</strong> ahora para agendar tu envío. El saldo restante lo pagas en efectivo al recibir el cuadro en tu puerta.</span>
    </li>
  </ul>
</div>

<div className="grid grid-cols-3 gap-3">
  <button onClick={() => setMetodoPago('banco')} className={`p-3 rounded-lg border-2 font-semibold transition-all text-sm flex items-center justify-center gap-2 cursor-pointer ${metodoPago === 'banco' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
    🏦 Pago Total QR
  </button>
  <button onClick={() => setMetodoPago('reserva')} className={`p-3 rounded-lg border-2 font-semibold transition-all text-sm flex items-center justify-center gap-2 cursor-pointer ${metodoPago === 'reserva' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
    🏠 Reserva + Entrega
  </button>
  <button onClick={() => setMetodoPago('binance')} className={`p-3 rounded-lg border-2 font-semibold transition-all text-sm flex items-center justify-center gap-2 cursor-pointer ${metodoPago === 'binance' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
    <Image src="/images/logo-binance.png" alt="Binance" width={20} height={20} className="object-contain" />
    Binance
  </button>
</div>
                <p className="mt-2 text-xs text-gray-600">Aceptamos pagos con <strong>USDT (Tether)</strong> y otras criptomonedas vía Binance.</p>
              </div>

              <div className="flex flex-col items-center">
                <h2 className="font-bold text-base mb-2 w-full text-left">1. Escanea el QR ({metodoPago === 'banco' ? 'Banco' : 'Binance'})</h2>
                <div className="relative w-60 h-60 bg-gray-100 rounded-lg overflow-hidden mb-2 border border-gray-200">
                  <Image 
  src={(metodoPago === 'banco' || metodoPago === 'reserva') ? config.qrPago : '/images/binance-qr1.jpg'} 
  alt={`QR de pago ${metodoPago === 'binance' ? 'Binance' : 'bancario'}`} 
  fill 
  className="object-contain p-2" 
/>
<p className="text-xs text-gray-600 text-center">
  {metodoPago === 'binance' ? 'Escanea el QR con tu app de Binance' : 'Escanea el QR con tu app bancaria'}
</p>

                {metodoPago === 'binance' && (
                  <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg w-full">
                    <h3 className="font-bold text-sm text-yellow-800 mb-3">💰 Instrucciones para pagar con Binance:</h3>
                    <ol className="text-xs text-gray-700 space-y-2 list-decimal list-inside mb-3">
                      <li><strong>Escanea el QR</strong> con tu app de Binance, o busca manualmente por ID.</li>
                      <li>Confirma el monto en <strong>USDT</strong> antes de pagar.</li>
                      <li>Guarda la captura de pantalla para subirla como comprobante.</li>
                    </ol>
                    <div className="p-3 bg-white rounded border border-yellow-300 mb-3">
                      <p className="text-xs text-gray-600 mb-1">ID de Binance Pay:</p>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-sm font-bold text-yellow-700">437498764</code>
                        <button type="button" onClick={() => { navigator.clipboard.writeText('437498764'); alert('ID copiado al portapapeles'); }} className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer">Copiar</button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1"><strong>Nombre:</strong> Mi Lienzo Decor</p>
                    <div className="mt-2 p-2 bg-yellow-100 rounded border border-yellow-300">
                      <p className="text-xs text-gray-700 mb-1"><strong>Monto a pagar:</strong></p>
                      <p className="text-lg font-bold text-yellow-700">{montoUSDT.toFixed(2)} USDT</p>
                      <p className="text-xs text-gray-500">(Equivalente a Bs. {totalConDescuento.toLocaleString()} al tipo de cambio actual: {tipoCambio.toFixed(2)} Bs/USDT)</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">💡 El pago es instantáneo. Una vez confirmado, te redirigiremos para subir tu comprobante.</p>
                  </div>
                )}
                {metodoPago === 'reserva' && (
  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg w-full">
    <h3 className="font-bold text-sm text-green-800 mb-3">📦 Instrucciones para Reserva + Contra Entrega:</h3>
    <ol className="text-xs text-gray-700 space-y-2 list-decimal list-inside mb-3">
      <li>Transfiere solo <strong>Bs. {MONTO_RESERVA}</strong> al QR de abajo para cubrir la reserva del envío.</li>
      <li>El saldo restante de <strong>Bs. {(totalConDescuento - MONTO_RESERVA).toLocaleString()}</strong> lo pagas en efectivo al recibir tu cuadro en la puerta de tu casa.</li>
      <li>Sube la captura de la transferencia de los {MONTO_RESERVA} Bs. en el siguiente paso.</li>
    </ol>
    <div className="p-3 bg-white rounded border border-green-300 mb-3">
      <p className="text-xs text-gray-600 mb-1">Monto a transferir ahora:</p>
      <p className="text-2xl font-bold text-green-700">Bs. {MONTO_RESERVA}</p>
    </div>
  </div>
)}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-bold text-base mb-2">¿Tienes una Gift Card para canjear?</h3>
            <div className="flex gap-2">
              <input type="text" value={giftCodeInput} onChange={(e) => setGiftCodeInput(e.target.value.toUpperCase())} placeholder="Ingresa tu código (ej: ML-8X92)" className="flex-1 border border-gray-300 rounded p-2 uppercase text-sm" />
              <button onClick={aplicarGiftCard} disabled={applyingCode} className="bg-gray-800 text-white px-3 py-2 rounded cursor-pointer hover:bg-gray-700 disabled:bg-gray-400 text-sm">
                {applyingCode ? 'Verificando...' : 'Aplicar'}
              </button>
            </div>
            {discount > 0 && <p className="text-green-600 font-semibold mt-2 text-sm">✓ Gift Card aplicada: -Bs. {discount.toLocaleString()}</p>}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl flex items-start gap-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="font-bold text-yellow-800 text-base md:text-lg">📸 Haz un print de pantalla de tu pago para enviar como comprobante</p>
              <p className="text-yellow-700 text-sm mt-1">Esta captura será necesaria en el siguiente paso para validar tu pedido.</p>
            </div>
          </div>

          <button onClick={finalizarCompra} disabled={procesando} className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-4 disabled:bg-gray-400">
            {procesando ? 'Procesando...' : (<> <span>2. Ya pagué </span> <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg> </>)}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-2">Al finalizar, serás redirigido para adjuntar tu captura de pantalla de forma segura.</p>
        </div>
      </div>
    </div>
  );
}