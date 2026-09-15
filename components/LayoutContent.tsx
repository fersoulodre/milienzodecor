'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBoda = pathname === '/boda';

  return (
    <>
      {/* Ocultar Navbar si es la página de la boda */}
      {!isBoda && <Navbar />}
      
      {/* Ocultar Slogan si es la página de la boda */}
      {!isBoda && (
        <div className="flex items-center justify-center py-3 md:py-3" style={{ backgroundColor: '#eadbc3' }}>
          <h3 className="text-lg md:text-4xl font-light text-gray-700 italic px-4 text-center">
            No son simples cuadros... llenamos tus espacios con arte
          </h3>
        </div>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {/* Ocultar Footer si es la página de la boda */}
      {!isBoda && <Footer />}
    </>
  );
}