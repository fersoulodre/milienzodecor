'use client';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { getConfig } from '@/lib/productos';
import { useState } from 'react';
import { generateGiftCardCode, validateGiftCardCode, crearPedido } from '@/app/actions'; // NUEVO: importamos crearPedido
import { useRouter } from 'next/navigation'; // NUEVO: para redirigir

export default function CarritoPage() {
  const { items, giftCards, removeFromCart, removeGiftCard, clearCart, total } = useCart();
  const router = useRouter(); // NUEVO
  const config = getConfig();
  
  // NUEVO: Estados para los datos del cliente
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const [giftCodeInput, setGiftCodeInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [giftCardImage, setGiftCardImage] = useState<string | null>(null);
  const [applyingCode, setApplyingCode] = useState(false);
  const [procesando, setProcesando] = useState(false); // NUEVO

  const totalConDescuento = Math.max(0, total - discount);

  const aplicarGiftCard = async () => {
    if (!giftCodeInput) return;
    setApplyingCode(true);
    const resultado = await validateGiftCardCode(giftCodeInput);
    
    if (resultado.valid) {
      setDiscount(resultado.monto);
      setGiftCardImage(resultado.imagen);
      alert(`¡Gift Card canjeada! Se descuentan Bs. ${resultado.monto.toLocaleString()}`);
    } else {
      alert('Código inválido o ya utilizado.');
    }
    setApplyingCode(false);
  };

  // NUEVO: Función para finalizar la compra y redirigir
    const finalizarCompra = async () => {
    if (!email || !nombre) {
      alert('Por favor, ingresa tu nombre y correo electrónico para continuar.');
      return;
    }

    setProcesando(true);

    // 1. Generar códigos de gift cards si hay
    let codigosGenerados = [];
    if (giftCards.length > 0) {
      for (const gc of giftCards) {
        const resultado = await generateGiftCardCode(gc.monto, gc.imagen);
        codigosGenerados.push(resultado.code);
      }
    }

    // 2. Crear el pedido en la base de datos
    const respuesta = await crearPedido({
      email,
      nombre,
      telefono,
      total: totalConDescuento,
      metodo_pago: 'qr_banco',
      detalles: { items, giftCards: codigosGenerados, discount }
    });

    if (respuesta.success && respuesta.pedidoId) {
      // === LÍNEA NUEVA: Guardamos el correo en la memoria del navegador ===
      sessionStorage.setItem('email_compra', email);
      
      // Limpiamos el carrito y redirigimos
      clearCart();
      router.push(`/subir-comprobante?pedido=${respuesta.pedidoId}`);
    } else {
      alert('Hubo un error al procesar tu pedido. Intenta de nuevo.');
      setProcesando(false);
    }
  };

  if (items.length === 0 && giftCards.length === 0) {
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
        <h1 className="text-3xl font-bold mb-4">Tu Carrito</h1>

        {/* NUEVO: Formulario de datos del cliente */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="font-bold text-lg mb-3">Datos para tu pedido</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre completo *"
              className="border border-gray-300 rounded p-2 text-sm w-full"
              required
            />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico *"
              className="border border-gray-300 rounded p-2 text-sm w-full"
              required
            />
            <input 
              type="tel" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Tu número de WhatsApp (opcional)"
              className="border border-gray-300 rounded p-2 text-sm w-full md:col-span-2"
            />
          </div>
        </div>

        {/* Items del carrito (CUADROS) */}
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
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-100 text-red-600 px-2 py-1 rounded cursor-pointer hover:bg-red-200 font-bold text-xs"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {/* Total, QR y Gift Cards */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">Total a pagar:</span>
            <span className="text-xl font-bold text-green-700">Bs. {totalConDescuento.toLocaleString()}</span>
          </div>

          {/* Gift Cards y QR en 2 columnas */}
          <div className="grid md:grid-cols-2 gap-4 border-t pt-3 mb-3">
            <div>
              <h2 className="font-bold text-base mb-2">🎁 Tus Gift Cards</h2>
              {giftCards.map((gc, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-25 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <Image src={gc.imagen} alt="Gift Card" fill className="object-cover" />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 text-center leading-tight w-40">Envíale esta imagen a tu beneficiario.</p>
                    </div>
                    <p className="font-bold text-sm">Bs. {gc.monto.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => removeGiftCard(gc.id)}
                    className="bg-red-100 text-red-600 px-2 py-1 rounded cursor-pointer hover:bg-red-200 text-xs font-bold"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              {giftCards.length === 0 && <p className="text-gray-400 text-xs">Sin Gift Cards</p>}
            </div>

            <div className="flex flex-col items-center">
              <h2 className="font-bold text-base mb-2 w-full text-left">1. Realiza tu pago</h2>
              <div className="relative w-60 h-60 bg-gray-100 rounded-lg overflow-hidden mb-2">
                <Image src={config.qrPago} alt="QR de pago" fill className="object-contain" />
              </div>
              <p className="text-xs text-gray-600 text-center">
                Escanea el QR con tu app bancaria por el monto exacto.
              </p>
            </div>
          </div>

          {/* Canjear Gift Card */}
          <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-bold text-base mb-2">¿Tienes una Gift Card para canjear?</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={giftCodeInput} 
                onChange={(e) => setGiftCodeInput(e.target.value.toUpperCase())}
                placeholder="Ingresa tu código (ej: ML-8X92)"
                className="flex-1 border border-gray-300 rounded p-2 uppercase text-sm"
              />
              <button 
                onClick={aplicarGiftCard}
                disabled={applyingCode}
                className="bg-gray-800 text-white px-3 py-2 rounded cursor-pointer hover:bg-gray-700 disabled:bg-gray-400 text-sm"
              >
                {applyingCode ? 'Verificando...' : 'Aplicar'}
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 font-semibold mt-2 text-sm">✓ Gift Card aplicada: -Bs. {discount.toLocaleString()}</p>
            )}
          </div>

          {/* NUEVO: Botón de Finalizar Compra */}
          <button
            onClick={finalizarCompra}
            disabled={procesando}
            className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-4 disabled:bg-gray-400"
          >
            {procesando ? (
              'Procesando...'
            ) : (
              <>
                <span>2. Ya pagué - Ir a subir comprobante</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            Al finalizar, serás redirigido para adjuntar tu captura de pantalla de forma segura.
          </p>
        </div>
      </div>
    </div>
  );
}