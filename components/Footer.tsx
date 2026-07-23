import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Columna 1: Marca y Copyright */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Mi Lienzo Decor</h3>
          
          <p className="text-xs text-gray-500">
            © {currentYear} Mi Lienzo Decor. Todos los derechos reservados.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[#94845f] transition-colors">Inicio</Link></li>
            <li><Link href="/gift-cards" className="hover:text-[#94845f] transition-colors">Gift Cards</Link></li>
            <li><Link href="/terminos" className="hover:text-[#94845f] transition-colors">Términos y Condiciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-[#94845f] transition-colors">Política de Privacidad</Link></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a 
                href="mailto:soporte@milienzodecor.com" 
                className="flex items-center justify-center md:justify-start gap-2 hover:text-[#94845f] transition-colors group"
              >
                <Image 
                  src="/icons/email3.png" 
                  alt="Email" 
                  width={20} 
                  height={20} 
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <span>soporte@milienzodecor.com</span>
              </a>
            </li>
            <li>
              <a 
                href="https://wa.me/59173041926" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 hover:text-[#94845f] transition-colors group"
              >
                <Image 
                  src="/icons/whatsapp.png" 
                  alt="WhatsApp" 
                  width={20} 
                  height={20} 
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <span>+591 73041926</span>
              </a>
            </li>
            
            {/* NUEVO: Dirección Física */}
            <li>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {/* ⚠️ CAMBIA ESTE TEXTO POR TU DIRECCIÓN REAL */}
                <span>Edificio Torrente XII - dpto. 8D - Av. Victor Zapana #37, La Paz - Bolivia</span>
              </div>
            </li>

          </ul>
        </div>

      </div>
    </footer>
  );
}