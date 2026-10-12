'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileCategoriasOpen, setMobileCategoriasOpen] = useState(false);
  const { items } = useCart(); 
  
  const totalItems = items ? items.length : 0;

  const categorias = [
    { nombre: 'Abstractos Minimalistas', slug: 'abstractos-minimalistas' },
    { nombre: 'Abstractos Forte', slug: 'abstractos-forte' },
    { nombre: 'Juveniles', slug: 'juveniles' },
    { nombre: 'Figuras Humanas', slug: 'figuras-humanas' },
    { nombre: 'Paisajes', slug: 'paisajes' },
  ];

  return (
    <>
      {/* Header principal */}
      <header className="sticky top-0 z-50 text-white" style={{ backgroundColor: '#734d12' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Mi Lienzo Decor"
              width={333}
              height={98}
              className="object-contain w-40 md:w-[280px] h-auto"
            />
          </Link>

          {/* Lado derecho: Menú Escritorio + Íconos */}
          <div className="flex items-center gap-4">
            
            {/* MENÚ ESCRITORIO */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:text-gray-200 transition-colors font-medium">Inicio</Link>
              
              {/* MEGA MENÚ: Tipos de Cuadros */}
              <div className="relative group">
                <button className="hover:text-gray-200 transition-colors font-medium flex items-center gap-1 cursor-pointer">
                  Tipos de Cuadros
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Panel del Mega Menú */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[600px] !bg-white !opacity-100 text-gray-800 rounded-lg shadow-2xl hidden group-hover:block z-[60]">
                  <div className="p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Nuestras Colecciones</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {categorias.map((cat) => (
                        <Link 
                          key={cat.slug}
                          href={`/categoria/${cat.slug}`}
                          className="flex items-center gap-2 text-gray-700 hover:text-[#734d12] transition-colors group/item"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-[#734d12] transition-colors"></span>
                          {cat.nombre}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <Link 
                        href="/tienda" 
                        className="text-sm font-semibold text-[#734d12] hover:underline flex items-center gap-1"
                      >
                        Ver todos los cuadros
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/gift-cards" className="hover:text-gray-200 transition-colors font-medium">Gift Cards</Link>

              {/* Ícono Carrito Escritorio (Restaurado) */}
              <Link href="/carrito" className="relative text-white hover:text-gray-300 transition-colors ml-2">
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

            {/* VERSIÓN MÓVIL: Carrito + Hamburguesa */}
            <div className="md:hidden flex items-center gap-4">
              
              {/* Ícono Carrito Móvil */}
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

              {/* Hamburguesa */}
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

        {/* MENÚ MÓVIL DESPLEGABLE */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full shadow-lg border-t border-white/10" style={{ backgroundColor: '#7a6d4f' }}>
            <nav className="flex flex-col p-4 space-y-1 text-center text-lg">
              <Link href="/" className="hover:text-gray-200 transition-colors py-3 border-b border-white/10" onClick={() => setIsOpen(false)}>Inicio</Link>
              
              <div className="border-b border-white/10">
                <button 
                  onClick={() => setMobileCategoriasOpen(!mobileCategoriasOpen)}
                  className="w-full hover:text-gray-200 transition-colors py-3 flex items-center justify-center gap-2"
                >
                  Tipos de Cuadros
                  <svg className={`w-4 h-4 transition-transform ${mobileCategoriasOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {mobileCategoriasOpen && (
                  <div className="py-2 space-y-1">
                    {categorias.map((cat) => (
                      <Link 
                        key={cat.slug}
                        href={`/categoria/${cat.slug}`}
                        className="block py-2 text-base text-gray-200 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {cat.nombre}
                      </Link>
                    ))}
                    <Link 
                      href="/tienda"
                      className="block py-2 text-base font-semibold text-[#fac932] hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Ver todos →
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/gift-cards" className="hover:text-gray-200 transition-colors py-3 border-b border-white/10" onClick={() => setIsOpen(false)}>Gift Cards</Link>
              <Link href="/carrito" className="hover:text-gray-200 transition-colors py-3 flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                Carrito
                {totalItems > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold min-w-[22px] h-5 flex items-center justify-center rounded-full px-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}