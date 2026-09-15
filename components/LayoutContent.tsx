'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StockVerifierModal from '@/components/StockVerifierModal';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Detecta si es la página de la boda (con o sin slash al final)
  const isBoda = pathname?.startsWith('/boda') || false;

  return (
    <>
      {!isBoda && <Navbar />}
      
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

      {!isBoda && <Footer />}
      
      {/* El botón de stock solo se oculta en la boda */}
      {!isBoda && <StockVerifierModal />}
    </>
  );
}