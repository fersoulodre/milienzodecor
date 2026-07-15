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
          <p className="text-sm text-gray-400 mb-4">
            No vendemos cuadros... Vendemos arte.
          </p>
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
                  src="/icons/email.png" 
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
          </ul>
        </div>

      </div>
    </footer>
  );
}