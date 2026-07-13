'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type Producto = {
  id: string;
  titulo: string;
  precio?: number;
  estilo: string;
  imagen: string;
  dimensiones?: string;
  marco?: string;
};

type GiftCard = {
  id: string;
  monto: number;
  imagen: string;
};

type CartContextType = {
  items: Producto[];
  giftCards: GiftCard[];
  addToCart: (producto: Producto) => void;
    removeFromCart: (id: string) => void;
  removeGiftCard: (id: string) => void;
  addGiftCard: (giftCard: GiftCard) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Producto[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);

  const addToCart = (producto: Producto) => {
    setItems([...items, producto]);
  };

  const removeFromCart = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

    const removeGiftCard = (id: string) => {
    setGiftCards(giftCards.filter(gc => gc.id !== id));
  };

  const addGiftCard = (giftCard: GiftCard) => {
    setGiftCards([...giftCards, giftCard]);
  };

  const clearCart = () => {
    setItems([]);
    setGiftCards([]);
  };

  const total = items.reduce((sum, item) => sum + (item.precio ?? 0), 0) +
              giftCards.reduce((sum, gc) => sum + gc.monto, 0);

  return (
        <CartContext.Provider value={{ items, giftCards, addToCart, removeFromCart, removeGiftCard, addGiftCard, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}