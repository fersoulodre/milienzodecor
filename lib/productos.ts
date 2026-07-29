import productosData from '@/data/productos-auto.json';
import configData from '@/data/config.json';
import { supabase } from '@/lib/supabase'; // Usamos tu cliente ya configurado

export interface Producto {
  id: string;
  titulo: string;
  estilo: string;
  imagen: string;
  stock: number;
  destacado?: boolean;
}

export async function getAllProductos(): Promise<Producto[]> {
  const productosBase = productosData.cuadros as Producto[];

  // 1. Obtener el inventario real desde Supabase
  const { data: inventario, error } = await supabase
    .from('inventario')
    .select('id, stock');

  if (error) {
    console.error('❌ Error al leer inventario de Supabase:', error);
  }

  // 2. Fusionar: si existe en Supabase, usa ese stock. Si no, usa 4 por defecto.
  return productosBase.map(p => {
    const itemInventario = inventario?.find(i => i.id === p.id);
    return {
      ...p,
      stock: itemInventario ? itemInventario.stock : 4
    };
  });
}

export function getConfig() {
  return configData;
}