import { CartProvider } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // <-- AGREGA ESTA LÍNEA
import './globals.css';

// ... (metadata se mantiene igual)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 flex flex-col min-h-screen"> {/* <-- Agrega 'flex flex-col min-h-screen' aquí */}
        <CartProvider>
          <Navbar />
          
          <div className="text-center py-2" style={{ backgroundColor: '#efe4cf' }}>
            <h3 className="text-lg md:text-4xl font-light text-gray-500 italic px-4">
              No vendemos cuadros... Vendemos arte
            </h3>
          </div>

          <main className="flex-grow"> {/* <-- Envuelve children en un main con flex-grow */}
            {children}
          </main>

          <Footer /> {/* <-- AGREGA EL FOOTER AQUÍ */}
        </CartProvider>
      </body>
    </html>
  );
}