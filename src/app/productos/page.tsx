'use client';

export default function Productos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6ffd9] to-white py-14">
      <div className="mx-auto w-full max-w-6xl px-4">

        {/* Card */}
        <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-gray-200 backdrop-blur">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-semibold text-gray-800">Inventario</h1>
            <button className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700">
              Nuevo producto
            </button>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-gray-700">
                <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Unidad</th>
                  <th>Stock</th>
                  <th>Mín.</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-500">
                {/* Ejemplo fila normal */}
                <tr className="[&>td]:px-3 [&>td]:py-2">
                  <td>Café en grano Premium</td>
                  <td>Granos</td>
                  <td>g</td>
                  <td>2500</td>
                  <td>500</td>
                  <td className="whitespace-nowrap text-center space-x-3">
                    <button className="text-emerald-600 hover:underline">Editar</button>
                    <button className="text-red-600 hover:underline">Borrar</button>
                  </td>
                </tr>

                {/* Ejemplo fila alerta */}
                <tr className="bg-red-50 [&>td]:px-3 [&>td]:py-2">
                  <td>Té Verde</td>
                  <td>Infusiones</td>
                  <td>g</td>
                  <td>180</td>
                  <td>200</td>
                  <td className="whitespace-nowrap text-center space-x-3">
                    <button className="text-emerald-600 hover:underline">Editar</button>
                    <button className="text-red-600 hover:underline">Borrar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
