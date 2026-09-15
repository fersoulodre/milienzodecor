import { CartProvider } from '@/components/CartContext';
import LayoutContent from '@/components/LayoutContent';
import './globals.css';

export const metadata = {
  title: 'Mi Lienzo Decor | Arte y Cuadros en Bolivia',
  description: 'Transforma tus espacios con arte único. Venta de cuadros modernos, lienzos personalizados y Gift Cards en Bolivia con envío a todo el país.',
  icons: {
    icon: '/favicon2.png',
  },
  other: {
    'color-scheme': 'light', // <--- ESTA LÍNEA BLOQUEA EL MODO OSCURO
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <CartProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </CartProvider>
      </body>
    </html>
  );
}