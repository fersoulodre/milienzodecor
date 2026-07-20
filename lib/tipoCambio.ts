// lib/tipoCambio.ts

export async function getTipoCambioBolivia(): Promise<number> {
  try {
    // Intentar obtener de API externa (USD a BOB)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    // Si la API funciona, usa el valor real (usualmente ~6.96)
    // Pero en Bolivia hay tipo de cambio paralelo, así que ajustamos
    const tipoOficial = data.rates.BOB || 6.96;
    
    // Ajuste para reflejar el tipo de cambio real en Bolivia (paralelo)
    // Puedes ajustar este multiplicador según el mercado actual
    const ajusteMercado = 1.0; // Cambia esto si el paralelo es diferente
    
    return tipoOficial * ajusteMercado;
  } catch (error) {
    console.error('Error al obtener tipo de cambio:', error);
    return 6.96; // Valor por defecto si falla la API
  }
}

// Valor actual aproximado (actualiza manualmente si es necesario)
export const TIPO_CAMBIO_ACTUAL = 6.96;