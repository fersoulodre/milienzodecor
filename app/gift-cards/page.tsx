'use client';
import Image from 'next/image';
import { getConfig } from '@/lib/productos';
import { useCart } from '@/components/CartContext';
import { useState } from 'react';

export default function GiftCardsPage() {
  const { addGiftCard } = useCart();
  const [added, setAdded] = useState<string | null>(null);
  const config = getConfig();

  const handleAddGiftCard = (monto: number, id: string, imagen: string) => {
  addGiftCard({ id: `${id}-${Date.now()}`, monto, imagen });
  setAdded(id);
  setTimeout(() => setAdded(null), 2000);
};

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Gift Cards</h1>
        <p className="text-gray-600 mb-8">Regala arte. Elige el monto perfecto.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {config.giftCards.map(gc => (
            <div key={gc.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-video">
  <Image src={gc.imagen} alt={`Gift Card Bs. ${gc.monto}`} fill className="object-cover" />
</div>
              <div className="p-6">
                <button
                  onClick={() => handleAddGiftCard(gc.monto, gc.id, gc.imagen)}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {added === gc.id ? '✓ Agregado' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="font-bold text-lg mb-3">¿Cómo funciona?</h2>
          <ol className="space-y-2 text-gray-600">
            <li>1. Agrega una Gift Card al carrito</li>
            <li>2. Realiza el pago por QR</li>
            <li>3. Recibirás el código de la Gift Card por WhatsApp</li>
            <li>4. El destinatario puede usarlo para comprar cualquier cuadro</li>
          </ol>
        </div>
      </div>
    </div>
  );
}