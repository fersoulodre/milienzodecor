'use client';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { getConfig } from '@/lib/productos';
import { useState } from 'react';
import { generateGiftCardCode, validateGiftCardCode } from '@/app/actions';


export default function CarritoPage() {
  const { items, giftCards, removeFromCart, removeGiftCard, clearCart, total } = useCart();
  const config = getConfig();
    const [giftCodeInput, setGiftCodeInput] = useState('');
const [discount, setDiscount] = useState(0);
const [giftCardImage, setGiftCardImage] = useState<string | null>(null);
const [applyingCode, setApplyingCode] = useState(false);

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
    const generarPedidoWhatsApp = async () => {
    let mensaje = `¡Hola! Quiero realizar el siguiente pedido:\n\n`;
    let codigosGenerados = [];

    if (items.length > 0) {
      mensaje += `🖼️ *CUADROS:*\n`;
      items.forEach(item => {
        mensaje += `• ${item.titulo} (${item.estilo}) - ${item.dimensiones} - Marco: ${item.marco} - Bs. ${item.precio.toLocaleString()}\n`;
      });
      mensaje += `\n`;
    }

    if (giftCards.length > 0) {
  mensaje += `🎁 *GIFT CARDS COMPRADAS:*\n`;
  for (const gc of giftCards) {
    const resultado = await generateGiftCardCode(gc.monto, gc.imagen);
    const codigo = resultado.code;
    codigosGenerados.push(codigo);
    mensaje += `• Gift Card Bs. ${gc.monto.toLocaleString()} - Código: ${codigo}\n`;
  }
  mensaje += `\n`;
}

    if (discount > 0) {
      mensaje += `🎟️ *GIFT CARD CANJEADA:*\n`;
      mensaje += `• Código: ${giftCodeInput} - Descuento: Bs. ${discount.toLocaleString()}\n\n`;
    }

    mensaje += `💰 *Total a pagar: Bs. ${totalConDescuento.toLocaleString()}*\n\n`;
    mensaje += `✅ Ya realicé la transferencia al QR. Adjunto comprobante en esta conversación.`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${config.whatsapp}?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
    clearCart();
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

        {/* Items del carrito */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
             <div className="flex gap-3 items-center">
  <div className="flex flex-col items-center">
    <div className="relative w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
      <Image src={gc.imagen} alt="Gift Card" fill className="object-cover" />
    </div>
    <p className="text-[10px] text-gray-500 mt-1 text-center leading-tight">Envíale esta imagen a tu beneficiario.</p>
  </div>
  <p className="font-bold text-sm">Bs. {gc.monto.toLocaleString()}</p>
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
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold">Bs. {totalConDescuento.toLocaleString()}</span>
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
              <h2 className="font-bold text-base mb-2 w-full text-left">Realiza tu pago</h2>
              <div className="relative w-60 h-60 bg-gray-100 rounded-lg overflow-hidden mb-2">
                <Image src={config.qrPago} alt="QR de pago" fill className="object-contain" />
              </div>
              <p className="text-xs text-gray-600 text-center">
                Escanea el QR con tu app bancaria
              </p>
            </div>
          </div>

          {/* Canjear Gift Card */}
          <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-bold text-base mb-2">¿Tienes una Gift Card?</h3>
            
            <div className="mb-3 text-xs text-gray-600">
              <p className="mb-1"><strong>Si USAS una Gift Card:</strong> Ingresa el código y haz clic en "Aplicar".</p>
              <p className="border-t pt-2 mt-2"><strong>Si COMPRAS una Gift Card:</strong> Ignora este campo, paga y envía el WhatsApp.</p>
            </div>

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

          {/* Botón WhatsApp */}
          <button
            onClick={generarPedidoWhatsApp}
            className="w-full cursor-pointer bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Ya pagué, enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}