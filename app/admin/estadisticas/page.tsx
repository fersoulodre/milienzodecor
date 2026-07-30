import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Mapeo de carpetas a nombres amigables
const nombresEstilos: Record<string, string> = {
  abstractos_forte: 'Abstractos Forte',
  abstractos_minimalista: 'Abstractos Minimalistas',
  juvenil: 'Juveniles',
  figuras_humanas: 'Figuras Humanas',
  paisajes: 'Paisajes'
};

export default async function EstadisticasPage() {
  const { data: inventario, error } = await supabase
    .from('inventario')
    .select('id, stock');

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <p className="text-red-600">Error al cargar las estadísticas.</p>
      </div>
    );
  }

  let totalCuadros = 0;
  let totalAgotados = 0;
  let totalUnidades = 0;
  
  const porCategoria: Record<string, { total: number; agotados: number; unidades: number }> = {};

  // Calcular totales
  inventario.forEach((item: any) => {
    totalCuadros++;
    if (item.stock === 0) totalAgotados++;
    totalUnidades += item.stock;

    const categoriaRaw = item.id.split('-')[0];
    const categoriaNombre = nombresEstilos[categoriaRaw] || categoriaRaw;

    if (!porCategoria[categoriaNombre]) {
      porCategoria[categoriaNombre] = { total: 0, agotados: 0, unidades: 0 };
    }
    porCategoria[categoriaNombre].total++;
    if (item.stock === 0) porCategoria[categoriaNombre].agotados++;
    porCategoria[categoriaNombre].unidades += item.stock;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/pedidos" className="text-gray-600 hover:text-black mb-6 inline-block">
          ← Volver a Pedidos
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Estadísticas de Inventario</h1>

        {/* Tarjetas de Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <p className="text-gray-500 text-sm mb-1">Total de Cuadros</p>
            <p className="text-4xl font-bold text-gray-800">{totalCuadros}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <p className="text-gray-500 text-sm mb-1">Unidades en Tienda</p>
            <p className="text-4xl font-bold text-green-600">{totalUnidades}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <p className="text-gray-500 text-sm mb-1">Cuadros Agotados</p>
            <p className="text-4xl font-bold text-red-600">{totalAgotados}</p>
          </div>
        </div>

        {/* Tabla por Categoría */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">Desglose por Categoría</h2>
        <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Categoría</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Total Cuadros</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Unidades</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Agotados</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(porCategoria).map(([nombre, datos]) => (
                <tr key={nombre} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{nombre}</td>
                  <td className="p-4 text-center text-gray-600">{datos.total}</td>
                  <td className="p-4 text-center text-green-600 font-semibold">{datos.unidades}</td>
                  <td className="p-4 text-center text-red-600 font-semibold">{datos.agotados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}