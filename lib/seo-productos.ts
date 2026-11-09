// lib/seo-productos.ts

const descripcionesPorEstilo: Record<string, string> = {
  "Abstractos Minimalistas": "obra de arte abstracto minimalista impresa en lienzo canvas texturizado de alta calidad. Sus tonos neutros y líneas depuradas la hacen ideal para decorar salas modernas, dormitorios u oficinas en Bolivia, aportando elegancia y calma.",
  "Abstractos Forte": "pieza de arte abstracto con carácter fuerte y colores vibrantes, impresa en lienzo canvas premium. Perfecta para ser el punto focal de tu sala o espacio de trabajo, ofreciendo un acabado de galería real.",
  "Juveniles": "cuadro moderno y vibrante, ideal para habitaciones juveniles o espacios creativos. Impreso en lienzo canvas de alta resolución, aporta energía, color y personalidad a cualquier pared de tu hogar.",
  "Figuras Humanas": "representación artística con estilo contemporáneo y detallado. Impresa en lienzo canvas texturizado, es la pieza perfecta para añadir sofisticación, cultura y un toque artístico a tu decoración.",
  "Paisajes": "obra que captura la esencia de la naturaleza con un toque artístico moderno. Impresa en lienzo canvas premium con protección UV, ideal para llevar un toque de serenidad y amplitud a tu sala u oficina."
};

export function generarDescripcionSEO(estilo: string, id: string): string {
  const textoBase = descripcionesPorEstilo[estilo] || "cuadro decorativo de alta calidad impreso en lienzo canvas premium con bastidor de MDF indeformable y barniz protector UV.";
  
  return `El cuadro ${id} es una ${textoBase} Disponible en Mi Lienzo Decor con envío seguro a todo Bolivia. Elige tus medidas y acabado preferido en nuestra tienda online.`;
}