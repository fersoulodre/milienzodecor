import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // ← Fíjate que aquí dice { supabase }

export async function GET() {
  
  const { data } = await supabase
  .from('tipo_cambio')
  .select('tasa')
  .eq('id', 1) // ← ¡Esto es lo que faltaba!
  .single();
  
  return NextResponse.json({ tasa: data?.tasa || 10.73 });
}