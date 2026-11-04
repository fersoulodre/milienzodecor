import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://milienzodecor.com';

  // 1. Páginas estáticas principales (las que siempre existen)
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/carrito`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gift-cards`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/categoria/abstractos-minimalistas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/categoria/abstractos-forte`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/categoria/juveniles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/categoria/figuras-humanas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/categoria/paisajes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  // 2. Páginas dinámicas de productos (TODOS tus cuadros)
  // NOTA: Asumo que tu tabla 'inventario' tiene una columna llamada 'slug' 
  // (que contiene valores como 'juvenil-J82' o 'abstractos_minimalista-M57').
  // Si tu columna se llama 'codigo' o 'id', cambia la palabra 'slug' abajo.
  const { data: productos } = await supabase
    .from('inventario')
    .select('slug') 
    .not('slug', 'is', null); // Solo trae los que tengan un slug válido

  const productPages: MetadataRoute.Sitemap = productos?.map((producto) => ({
    url: `${baseUrl}/producto/${producto.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) || [];

  // 3. Unir páginas estáticas + productos y devolver el mapa
  return [...staticPages, ...productPages];
}