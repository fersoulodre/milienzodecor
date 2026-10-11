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

        {/* Columna 3: Contacto y Redes */}
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
            
            {/* Dirección Física */}
            <li>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Edificio Torrente XII - Dpto. 8D - Av. Victor Zapana #37, Bajo Següencoma, La Paz - Bolivia</span>
              </div>
            </li>
          </ul>

          {/* Íconos de Redes Sociales (EN COLOR) */}
          <div className="mt-6 flex justify-center md:justify-start gap-5">
            {/* Facebook (Azul oficial) */}
            <a 
              href="https://facebook.com/https://www.facebook.com/milienzodecor.shop" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#1877F2] hover:text-[#166fe5] transition-colors transform hover:scale-110"
              aria-label="Facebook"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>

            {/* Instagram (Rosa/Rojo oficial) */}
            <a 
              href="https://instagram.com/milienzodecor.shop" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E1306C] hover:text-[#C13584] transition-colors transform hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}