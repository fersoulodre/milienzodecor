const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Cargar variables de entorno (NUEVO)
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const DATA_FILE = path.join(process.cwd(), 'data', 'productos-auto.json');

function formatearTitulo(nombreArchivo) {
  const limpio = nombreArchivo.replace(/\.(webp|jpg|png|jpeg)$/i, '').replace(/-mockup$/i, '');
  return limpio
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function leerCarpeta(rutaCarpeta, estiloNombre) {
  const rutaCompleta = path.join(IMAGES_DIR, rutaCarpeta);
  if (!fs.existsSync(rutaCompleta)) {
    console.log('⚠ Carpeta no encontrada:', rutaCarpeta);
    return [];
  }
  return fs.readdirSync(rutaCompleta)
    .filter(file => !file.includes('mockup'))
    .map(archivo => {
      const id = archivo.replace(/\.(webp|jpg|png|jpeg)$/i, '');
      return {
        id: `${rutaCarpeta}-${id}`,
        titulo: formatearTitulo(archivo),
        estilo: estiloNombre,
        imagen: `/images/${rutaCarpeta}/${archivo}`,
        stock: 4 // CAMBIO: Antes era "disponible: true", ahora es "stock: 4"
      };
    });
}

const estilos = [
  { nombre: 'Abstractos Forte', carpeta: 'abstractos_forte' },
  { nombre: 'Abstractos Minimalistas', carpeta: 'abstractos_minimalista' },
  { nombre: 'Juveniles', carpeta: 'juvenil' },
  { nombre: 'Figuras Humanas', carpeta: 'figuras_humanas' },
  { nombre: 'Paisajes', carpeta: 'paisajes' }
];

let todos = [];
estilos.forEach(estilo => {
  const productos = leerCarpeta(estilo.carpeta, estilo.nombre);
  todos = [...todos, ...productos];
});

// Leer el JSON anterior para preservar el campo "destacado" (TU LÓGICA ORIGINAL INTACTA)
let productosAnteriores = [];
if (fs.existsSync(DATA_FILE)) {
  const dataAnterior = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  productosAnteriores = dataAnterior.cuadros || [];
}

// Fusionar: si el producto ya existía, mantener su "destacado" (TU LÓGICA ORIGINAL INTACTA)
const productosFinales = todos.map(producto => {
  const anterior = productosAnteriores.find(p => p.id === producto.id);
  if (anterior && anterior.destacado !== undefined) {
    producto.destacado = anterior.destacado;
  } else {
    producto.destacado = false; // Por defecto, nuevos productos no son destacados
  }
  return producto;
});

fs.writeFileSync(
  DATA_FILE,
  JSON.stringify({ cuadros: productosFinales }, null, 2)
);
console.log('✓ Productos generados en JSON:', productosFinales.length);

// ==========================================
// NUEVO: Sincronizar inventario con Supabase
// ==========================================
async function sincronizarInventario() {
  const inventarioParaSubir = productosFinales.map(p => ({
    id: p.id,
    stock: 4 // Stock inicial por defecto para nuevos productos
  }));

  const { error } = await supabase
    .from('inventario')
    .upsert(inventarioParaSubir, { onConflict: 'id' });

  if (error) {
    console.error('❌ Error al sincronizar inventario:', error.message);
  } else {
    console.log('✓ Inventario sincronizado con Supabase (' + inventarioParaSubir.length + ' productos)');
  }
}

// Ejecutar la sincronización
sincronizarInventario();