import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://milienzodecor.com';

  // 1. Páginas estáticas
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

  // 2. Páginas dinámicas: TODOS tus 152 cuadros
  const { data: productos, error } = await supabase
    .from('inventario')
    .select('id')
    .not('id', 'is', null);

  console.log('🔍 Sitemap - Productos encontrados:', productos?.length, '| Error:', error);

  const productPages: MetadataRoute.Sitemap = productos?.map((producto) => ({
    url: `${baseUrl}/producto/${producto.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) || [];

  return [...staticPages, ...productPages];
}