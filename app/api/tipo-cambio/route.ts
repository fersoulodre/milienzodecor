import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=bob', {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    const tasa = data.tether?.bob || 8.50;
    
    return NextResponse.json({ tasa });
  } catch (error) {
    return NextResponse.json({ tasa: 8.50 });
  }
}