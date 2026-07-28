import productosData from '@/data/productos-auto.json';
import configData from '@/data/config.json';

export interface Producto {
  id: string;
  titulo: string;
  estilo: string;
  imagen: string;
  stock: number;
  destacado?: boolean;
  disponible?: boolean; // Mantenemos por si hay algún producto antiguo
}

export function getAllProductos(): Producto[] {
  return productosData.cuadros as Producto[];
}

export function getProductosPorEstilo(estilo: string): Producto[] {
  return productosData.cuadros.filter(p => p.estilo === estilo) as Producto[];
}

export function getConfig() {
  return configData;
}