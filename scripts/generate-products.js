const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
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
        stock: 4
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

// Leer el JSON anterior para preservar el campo "destacado"
let productosAnteriores = [];
if (fs.existsSync(DATA_FILE)) {
  const dataAnterior = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  productosAnteriores = dataAnterior.cuadros || [];
}

// Fusionar: si el producto ya existía, mantener su "destacado"
const productosFinales = todos.map(producto => {
  const anterior = productosAnteriores.find(p => p.id === producto.id);
  if (anterior && anterior.destacado !== undefined) {
    producto.destacado = anterior.destacado;
  } else {
    producto.destacado = false;
  }
  return producto;
});

fs.writeFileSync(
  DATA_FILE,
  JSON.stringify({ cuadros: productosFinales }, null, 2)
);
console.log('✓ Productos generados en JSON:', productosFinales.length);

// ==========================================
// FUNCIÓN DE ALEATORIEDAD (80% con 4, 15% con 3, 4% con 2, 1% con 1)
// ==========================================
function generarStockAleatorio() {
  const random = Math.random();
  if (random < 0.80) return 4;
  if (random < 0.95) return 3;
  if (random < 0.99) return 2;
  return 1;
}

// ==========================================
// SINCRONIZAR CON SUPABASE (sobrescribe TODO el inventario)
// ==========================================
async function sincronizarInventario() {
  const inventarioParaSubir = productosFinales.map(p => ({
    id: p.id,
    stock: generarStockAleatorio()
  }));

  const { error } = await supabase
    .from('inventario')
    .upsert(inventarioParaSubir, { onConflict: 'id' });

  if (error) {
    console.error('❌ Error al sincronizar inventario:', error.message);
  } else {
    console.log('✓ Inventario actualizado con stock aleatorio (' + inventarioParaSubir.length + ' productos)');
  }
}

sincronizarInventario();