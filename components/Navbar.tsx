'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 text-white py-3 md:py-4" style={{ backgroundColor: '#94845f' }}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo responsive */}
        <Link href="/">
          <Image 
            src="/images/logo.jpg" 
            alt="Mi Lienzo Decor" 
            width={333} 
            height={98} 
            className="object-contain w-40 md:w-[333px] h-auto"
          />
        </Link>

        {/* Menú para Escritorio (oculto en móvil) */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-gray-300 transition-colors">Inicio</Link>
          <Link href="/gift-cards" className="hover:text-gray-300 transition-colors">Gift Cards</Link>
          <Link href="/carrito" className="hover:text-gray-300 transition-colors">Carrito</Link>
        </nav>

        {/* Botón Hamburguesa para Móvil */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Menú Desplegable para Móvil */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full shadow-lg border-t border-white/10" style={{ backgroundColor: '#7a6d4f' }}>
          <nav className="flex flex-col p-4 space-y-4 text-center text-lg">
            <Link href="/" className="hover:text-gray-300 transition-colors py-2" onClick={() => setIsOpen(false)}>Inicio</Link>
            <Link href="/gift-cards" className="hover:text-gray-300 transition-colors py-2" onClick={() => setIsOpen(false)}>Gift Cards</Link>
            <Link href="/carrito" className="hover:text-gray-300 transition-colors py-2" onClick={() => setIsOpen(false)}>Carrito</Link>
          </nav>
        </div>
      )}
    </header>
  );
}