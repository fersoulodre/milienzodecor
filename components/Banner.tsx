'use client';
import { useState, useEffect } from 'react';

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // ⏱️ CONTROL DE TIEMPO: Cambia este valor (en milisegundos)
  // 4000 = 4 segundos, 6000 = 6 segundos, etc.
  const TIEMPO_POR_IMAGEN = 4000; 

  const slides = [
    { img: '/images/portada.webp' },
    { img: '/images/portada2.webp' },
    { img: '/images/portada3.webp' },
    { img: '/images/portada4.webp' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, TIEMPO_POR_IMAGEN);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full overflow-hidden aspect-[1920/831]">
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div 
            className="absolute inset-0 w-full h-full" 
            style={{ 
              backgroundImage: `url('${slide.img}')`, 
              backgroundSize: '100% 90%', 
              backgroundPosition: 'center top', 
              backgroundRepeat: 'no-repeat' 
            }} 
          />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            {slide.title && <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{slide.title}</h2>}
            {slide.text && <p className="text-white text-lg md:text-xl drop-shadow-md">{slide.text}</p>}
          </div>
        </div>
      ))}

      {/* Sello de Garantía de 5 Años */}
      <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 z-20">
        <div className="bg-[#fac932] text-[#734d12] rounded-full w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center shadow-2xl border-4 border-white transform -rotate-6 hover:rotate-0 transition-transform duration-300">
          <span className="text-2xl md:text-3xl font-black leading-none">5</span>
          <span className="text-[9px] md:text-[10px] font-bold uppercase leading-tight text-center tracking-wide">Años de<br/>Garantía</span>
        </div>
      </div>
    </section>
  );
}