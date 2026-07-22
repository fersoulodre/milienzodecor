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

  // 1. Cargar desde localStorage cuando el componente se monta
  useEffect(() => {
    const savedItems = localStorage.getItem('cart_items');
    const savedGiftCards = localStorage.getItem('cart_giftcards');
    
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedGiftCards) setGiftCards(JSON.parse(savedGiftCards));
  }, []);

  // 2. Guardar en localStorage cada vez que cambian los productos
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  // 3. Guardar en localStorage cada vez que cambian las Gift Cards
  useEffect(() => {
    localStorage.setItem('cart_giftcards', JSON.stringify(giftCards));
  }, [giftCards]);

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
    // 4. Borrar también del localStorage
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