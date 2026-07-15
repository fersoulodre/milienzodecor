import { CartProvider } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'Mi Lienzo Decor',
  description: 'No vendemos cuadros... Vendemos arte',
  icons: {
    icon: '/favicon2.png', // Cambia a '.png' si tu archivo es PNG
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          
          <div className="text-center py-2" style={{ backgroundColor: '#efe4cf' }}>
            <h3 className="text-lg md:text-4xl font-light text-gray-500 italic px-4">
              No vendemos cuadros... Vendemos arte
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