const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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
  
  // 1. Leer archivos y obtener su fecha de modificación real
  return fs.readdirSync(rutaCompleta)
    .filter(file => !file.includes('mockup') && /\.(webp|jpg|png|jpeg)$/i.test(file))
    .map(file => {
      const stats = fs.statSync(path.join(rutaCompleta, file));
      const id = file.replace(/\.(webp|jpg|png|jpeg)$/i, '');
      return {
        id: `${rutaCarpeta}-${id}`,
        titulo: formatearTitulo(file),
        estilo: estiloNombre,
        imagen: `/images/${rutaCarpeta}/${file}`,
        stock: 4,
        fechaCreacion: stats.mtimeMs // Guardamos la fecha real del archivo
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

let productosAnteriores = [];
if (fs.existsSync(DATA_FILE)) {
  const dataAnterior = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  productosAnteriores = dataAnterior.cuadros || [];
}

const productosFinales = todos.map(producto => {
  const anterior = productosAnteriores.find(p => p.id === producto.id);
  if (anterior) {
    producto.destacado = anterior.destacado !== undefined ? anterior.destacado : false;
    // Mantener la fecha original si ya existía, para no alterarla al regenerar
    producto.fechaCreacion = anterior.fechaCreacion || producto.fechaCreacion;
  } else {
    producto.destacado = false;
  }
  return producto;
});

// 2. ORDENAR TODO EL ARRAY POR FECHA (del más antiguo al más nuevo)
productosFinales.sort((a, b) => a.fechaCreacion - b.fechaCreacion);

// Eliminamos la propiedad fechaCreacion del JSON final para no ensuciar los datos (es solo para ordenar)
const productosLimpios = productosFinales.map(({ fechaCreacion, ...rest }) => rest);

fs.writeFileSync(
  DATA_FILE,
  JSON.stringify({ cuadros: productosLimpios }, null, 2)
);
console.log('✓ Productos generados y ORDENADOS POR FECHA:', productosLimpios.length);

// ==========================================
// FUNCIÓN DE ALEATORIEDAD (Solo para productos NUEVOS)
// ==========================================
function generarStockAleatorio() {
  const random = Math.random();
  if (random < 0.80) return 4;
  if (random < 0.95) return 3;
  if (random < 0.99) return 2;
  return 1;
}

// ==========================================
// SINCRONIZAR CON SUPABASE
// ==========================================
async function sincronizarInventario() {
  const { data: inventarioActual, error: errorFetch } = await supabase
    .from('inventario')
    .select('id');

  if (errorFetch) {
    console.error('❌ Error al leer inventario actual:', errorFetch.message);
    return;
  }

  const idsExistentes = inventarioActual ? inventarioActual.map(i => i.id) : [];
  const productosNuevos = productosLimpios
    .filter(p => !idsExistentes.includes(p.id))
    .map(p => ({ id: p.id, stock: generarStockAleatorio() }));

  if (productosNuevos.length > 0) {
    const { error: errorInsert } = await supabase.from('inventario').insert(productosNuevos);
    if (errorInsert) {
      console.error('❌ Error al agregar nuevos productos:', errorInsert.message);
    } else {
      console.log(`✓ ${productosNuevos.length} nuevos productos agregados al inventario.`);
    }
  } else {
    console.log('✓ No hay productos nuevos. El inventario existente NO fue modificado.');
  }
}

sincronizarInventario();