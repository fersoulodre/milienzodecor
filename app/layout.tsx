import './globals.css';
import { CartProvider } from '@/components/CartContext';
import LayoutContent from '@/components/LayoutContent';
import WhatsAppButton from '@/components/WhatsAppButton'; // <-- 1. Importamos el botón

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Mi Lienzo Decor | Cuadros y Arte en Bolivia',
    template: '%s - Mi Lienzo Decor',
  },
  description: 'Tienda online de cuadros modernos, arte abstracto y lienzos personalizados en Bolivia. Envío a todo el país. Compra cuadros para sala, dormitorio y oficina.',
  icons: {
    icon: '/favicon2.png',
  },
keywords: [
  'cuadros Bolivia',
  'arte Bolivia',
  'cuadros modernos',
  'lienzos personalizados',
  'decoración hogar',
  'arte abstracto',
  'diseño de interiores Bolivia',
  'diseñador de interiores Bolivia',
  'decoración de interiores',
  'asesoría en decoración',
  'cuadros para sala',
  'cuadros para oficina',
  'gift cards arte'
],
  authors: [{ name: 'Mi Lienzo Decor' }],
  creator: 'Mi Lienzo Decor',
  publisher: 'Mi Lienzo Decor',
  metadataBase: new URL('https://milienzodecor.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_BO',
    url: 'https://milienzodecor.com',
    title: 'Mi Lienzo Decor | Cuadros y Arte en Bolivia',
    description: 'Tienda online de cuadros modernos y arte personalizado en Bolivia. Envío a todo el país.',
    siteName: 'Mi Lienzo Decor',
    images: [
  {
    url: 'https://milienzodecor.com/images/og-image.jpg',
    width: 1200,
    height: 630,
    alt: 'Mi Lienzo Decor - Cuadros y Arte en Bolivia',
  },
],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi Lienzo Decor | Cuadros y Arte en Bolivia',
    description: 'Tienda online de cuadros modernos y arte personalizado en Bolivia.',
    images: ['https://milienzodecor.com/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'color-scheme': 'light',
    'google-site-verification': 'FpPaOpxRamThC6skFZFkySkz_K-HUyQi8Piy_3wlUJk',
    'fb:app_id': '2993740184313700', // <--- AQUÍ ESTÁ TU APP ID DE FACEBOOK
  },
};
  verification: {
    google: 'FpPaOpxRamThC6skFZFkySkz_K-HUyQi8Piy_3wlUJk',
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
          
          {/* 2. Agregamos el botón aquí, justo antes de cerrar el CartProvider */}
          <WhatsAppButton />
          
        </CartProvider>
      </body>
    </html>
  );
}

