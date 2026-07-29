import productosData from '@/data/productos-auto.json';
import configData from '@/data/config.json';
import { supabase } from '@/lib/supabase';

export interface Producto {
  id: string;
  titulo: string;
  estilo: string;
  imagen: string;
  stock: number;
  destacado?: boolean;
}

// 1. Obtener todos los productos con su stock real de Supabase
export async function getAllProductos(): Promise<Producto[]> {
  const productosBase = productosData.cuadros as Producto[];

  const { data: inventario, error } = await supabase
    .from('inventario')
    .select('id, stock');

  if (error) {
    console.error('❌ Error al leer inventario de Supabase:', error);
  }

  return productosBase.map(p => {
    const itemInventario = inventario?.find(i => i.id === p.id);
    return {
      ...p,
      stock: itemInventario ? itemInventario.stock : 4
    };
  });
}

// 2. Obtener productos por estilo (también asíncrono para tener el stock actualizado)
export async function getProductosPorEstilo(estilo: string): Promise<Producto[]> {
  const todos = await getAllProductos();
  return todos.filter(p => p.estilo === estilo);
}

// 3. Configuración general
export function getConfig() {
  return configData;
}