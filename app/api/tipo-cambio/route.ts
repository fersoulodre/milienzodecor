import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase'; // ️ Ajusta esta ruta a donde tengas tu cliente de supabase

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase.from('tipo_cambio').select('tasa').single();
  
  return NextResponse.json({ tasa: data?.tasa || 10.73 });
}