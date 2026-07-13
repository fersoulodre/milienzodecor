import { CartProvider } from '@/components/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';

export const metadata = {
  title: 'Mi Lienzo Decor',
  description: 'Venta de cuadros originales',
  icons: {
    icon: '/favicon.png', // Si tu archivo se llama favicon.png
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          {/* Menú Global */}
          <header className="sticky top-0 z-50 text-white py-4" style={{ backgroundColor: '#94845f' }}>
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
              <Link href="/">
                <Image 
                  src="/images/logo.jpg" 
                  alt="Mi Lienzo Decor" 
                  width={333} 
                  height={98} 
                  className="object-contain"
                />
              </Link>
              <nav className="flex gap-6">
                <Link href="/" className="hover:text-gray-300">Inicio</Link>
                <Link href="/gift-cards" className="hover:text-gray-300">Gift Cards</Link>
                <Link href="/carrito" className="hover:text-gray-300">Carrito</Link>
              </nav>
            </div>
          </header>
          
                    {/* Slogan */}
          <div className="text-center py-2" style={{ backgroundColor: '#efe4cf' }}>
            <h3 className="text-xl md:text-4xl font-light text-gray-500 italic">
            No vendemos cuadros... Vendemos arte
            </h3>
          </div>

          {children}
        </CartProvider>
      </body>
    </html>
  );
}
