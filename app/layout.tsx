import { CartProvider } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Mi Lienzo Decor',
  description: 'Venta de cuadros originales',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <CartProvider>
          <Navbar />
          
          {/* Slogan */}
          <div className="text-center py-2" style={{ backgroundColor: '#efe4cf' }}>
            <h3 className="text-lg md:text-4xl font-light text-gray-500 italic px-4">
              No vendemos cuadros... Vendemos arte
            </h3>
          </div>

          {children}
        </CartProvider>
      </body>
    </html>
  );
}