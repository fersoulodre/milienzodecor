'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Producto = {
  id: string;
  titulo: string;
  precio?: number;
  estilo: string;
  imagen: string;
  dimensiones?: string;
  marco?: string;
  disponible?: boolean;
  cartId?: string;
};

type GiftCard = {
  id: string;
  monto: number;
  imagen: string;
  fechaExpiracion?: string; // Nueva propiedad
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

  useEffect(() => {
    const savedItems = localStorage.getItem('cart_items');
    const savedGiftCards = localStorage.getItem('cart_giftcards');
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedGiftCards) setGiftCards(JSON.parse(savedGiftCards));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('cart_giftcards', JSON.stringify(giftCards));
  }, [giftCards]);

  const addToCart = (producto: Producto) => {
    const nuevoItem = { ...producto, cartId: crypto.randomUUID() };
    setItems([...items, nuevoItem]);
  };

  const removeFromCart = (cartId: string) => {
    setItems(items.filter(item => item.cartId !== cartId));
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
    localStorage.removeItem('cart_items');
    localStorage.removeItem('cart_giftcards');
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