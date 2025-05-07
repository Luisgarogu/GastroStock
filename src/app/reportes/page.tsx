'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Reportes() {
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [tipo, setTipo] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6ffd9] to-white py-14">
      <div className="mx-auto w-full max-w-6xl px-4">

        {/* Card */}
        <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-gray-200 backdrop-blur space-y-8">

          {/* Cabecera filtros */}
          <div className="flex flex-wrap items-end gap-4">
            <h1 className="text-3xl font-semibold text-gray-800 flex-1">Reporte de stock</h1>

            <div>
              <label className="block text-sm text-gray-600">Desde</label>
              <DatePicker
                selected={from}
                onChange={(d) => setFrom(d)}
                dateFormat="yyyy-MM-dd"
                className="input"
                placeholderText="YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Hasta</label>
              <DatePicker
                selected={to}
                onChange={(d) => setTo(d)}
                dateFormat="yyyy-MM-dd"
                className="input"
                placeholderText="YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input">
                <option value="">Todos</option>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>

            <button className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700">
              Exportar PDF
            </button>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-gray-700">
                <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                  <th>ID</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="[&>td]:px-3 [&>td]:py-2">
                  <td>1</td><td>Café en grano</td><td>entrada</td><td>500</td><td>2025‑05‑08</td>
                </tr>
                <tr className="[&>td]:px-3 [&>td]:py-2">
                  <td>2</td><td>Té Verde</td><td>salida</td><td>100</td><td>2025‑05‑09</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

/* Tailwind helper:
.input { @apply w-full rounded border border-gray-300 px-3 py-2 bg-white/80; }
*/
