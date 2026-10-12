'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart(); 
  
  const totalItems = items ? items.length : 0;

  return (
    <>
      {/* Header principal */}
      <header className="sticky top-0 z-50 text-white py-3 md:py-4" style={{ backgroundColor: '#734d12' }}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          
          {/* Logo responsive */}
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Mi Lienzo Decor"
              width={333}
              height={98}
              className="object-contain w-40 md:w-[333px] h-auto"
            />
          </Link>

          {/* Lado derecho: Menú Escritorio O (Ícono Carrito + Hamburguesa en Móvil) */}
          <div className="flex items-center gap-4">
            
            {/* 1. Menú para Escritorio (oculto en móvil) */}
            <nav className="hidden md:flex gap-6 items-center">
              <Link href="/" className="hover:text-gray-300 transition-colors">Inicio</Link>
              <Link href="/gift-cards" className="hover:text-gray-300 transition-colors">Gift Cards</Link>
              
              {/* Ícono de Carrito Escritorio con badge */}
              <Link href="/carrito" className="hover:text-gray-300 transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </nav>

            {/* 2. Versión Móvil: Ícono de Carrito + Botón Hamburguesa */}
            <div className="md:hidden flex items-center gap-5">
              
              {/* Ícono de Carrito con badge */}
              <Link href="/carrito" className="relative text-white hover:text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-[#734d12]">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Botón Hamburguesa */}
              <button
                className="relative z-50 flex flex-col justify-between w-8 h-6 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Abrir menú"
              >
                <span className={`block w-full h-1 rounded shadow-sm transition-all !bg-white ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`block w-full h-1 rounded shadow-sm transition-all !bg-white ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-full h-1 rounded shadow-sm transition-all !bg-white ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </button>
            </div>

          </div>
        </div>

        {/* Menú Desplegable para Móvil */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full shadow-lg border-t border-white/10" style={{ backgroundColor: '#7a6d4f' }}>
            <nav className="flex flex-col p-4 space-y-4 text-center text-lg">
              <Link href="/" className="hover:text-gray-300 transition-colors py-2" onClick={() => setIsOpen(false)}>Inicio</Link>
              <Link href="/gift-cards" className="hover:text-gray-300 transition-colors py-2" onClick={() => setIsOpen(false)}>Gift Cards</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}