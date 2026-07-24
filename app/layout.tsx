import { CartProvider } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'Mi Lienzo Decor | Arte y Cuadros en Bolivia',
  description: 'Transforma tus espacios con arte único. Venta de cuadros modernos, lienzos personalizados y Gift Cards en Bolivia con envío a todo el país.',
  icons: {
    icon: '/favicon2.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          
          {/* Slogan Global centrado vertical y horizontalmente */}
          <div className="flex items-center justify-center py-3 md:py-3" style={{ backgroundColor: '#eadbc3' }}>
            <h3 className="text-lg md:text-4xl font-light text-gray-700 italic px-4 text-center">
              No vendemos cuadros... llenamos tus espacios con arte
            </h3>
          </div>

          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}