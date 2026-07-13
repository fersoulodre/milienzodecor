import productosData from '@/data/productos-auto.json';
import configData from '@/data/config.json';

export function getAllProductos() {
  return productosData.cuadros;
}

export function getProductosPorEstilo(estilo: string) {
  return productosData.cuadros.filter(p => p.estilo === estilo);
}

export function getConfig() {
  return configData;
}