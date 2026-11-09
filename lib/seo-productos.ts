// lib/seo-productos.ts

const plantillasPorEstilo: Record<string, string[]> = {
  "Abstractos Minimalistas": [
    "obra de arte abstracto minimalista impresa en lienzo canvas texturizado. Sus tonos neutros y líneas depuradas aportan elegancia y calma a cualquier ambiente moderno.",
    "pieza de arte contemporáneo con estilo minimalista, impresa en canvas de alta calidad. Ideal para decorar salas u oficinas en Bolivia con un toque de sofisticación.",
    "cuadro de diseño minimalista y acabado premium. Su estética limpia y colores suaves lo convierten en el complemento perfecto para interiores modernos."
  ],
  "Abstractos Forte": [
    "pieza de arte abstracto con carácter fuerte y colores vibrantes, impresa en lienzo canvas premium. Perfecta para ser el punto focal de tu sala o espacio de trabajo.",
    "obra de arte contemporáneo con texturas marcadas y tonos intensos. Aporta energía, personalidad y un acabado de galería real a tus paredes.",
    "cuadro abstracto de alto impacto visual, impreso en canvas texturizado. Diseñado para transformar espacios neutros en ambientes llenos de carácter y estilo."
  ],
  "Juveniles": [
    "cuadro moderno y vibrante, ideal para habitaciones juveniles o espacios creativos. Impreso en lienzo canvas de alta resolución, aporta energía y color.",
    "obra de arte juvenil con diseños dinámicos y frescos. Perfecta para personalizar dormitorios, estudios o cualquier rincón que necesite un toque de alegría.",
    "pieza decorativa de estilo joven y actual, impresa en canvas premium. Aporta personalidad y un ambiente relajado a cualquier pared de tu hogar."
  ],
  "Figuras Humanas": [
    "representación artística con estilo contemporáneo y detallado. Impresa en lienzo canvas texturizado, es la pieza perfecta para añadir sofisticación y cultura.",
    "obra de arte figurativa con un enfoque moderno y elegante. Ideal para decorar espacios que buscan transmitir sensibilidad, arte y buen gusto.",
    "cuadro que explora la figura humana con trazos contemporáneos. Impreso en canvas de alta calidad, aporta un toque intelectual y artístico a tu decoración."
  ],
  "Paisajes": [
    "obra que captura la esencia de la naturaleza con un toque artístico moderno. Impresa en lienzo canvas premium, ideal para llevar serenidad y amplitud a tu sala.",
    "cuadro de paisaje con estilo contemporáneo y colores envolventes. Perfecto para crear un ambiente de relajación y conexión con el arte en tu hogar u oficina.",
    "pieza artística inspirada en entornos naturales, impresa en canvas texturizado. Aporta frescura, profundidad y un toque de elegancia natural a tus espacios."
  ]
};

export function generarDescripcionSEO(estilo: string, id: string): string {
  // 1. Obtener las plantillas del estilo (o usar una genérica si el estilo no existe)
  const plantillas = plantillasPorEstilo[estilo] || [
    "cuadro decorativo de alta calidad impreso en lienzo canvas premium con bastidor de MDF indeformable y barniz protector UV.",
    "obra de arte contemporáneo impresa en canvas texturizado, ideal para elevar la decoración de cualquier espacio en Bolivia."
  ];

  // 2. Usar el código (id) para elegir una plantilla de forma única y consistente
  // Esto asegura que el cuadro M84 siempre tenga el texto 1, y el F101 siempre tenga el texto 2, etc.
  const ultimoCaracter = id.charCodeAt(id.length - 1);
  const plantillaElegida = plantillas[ultimoCaracter % plantillas.length];

  // 3. Armar el texto final
  return `El ${id} es una ${plantillaElegida} Disponible en Mi Lienzo Decor con envío seguro a todo Bolivia. Código de obra: ${id}.`;
}