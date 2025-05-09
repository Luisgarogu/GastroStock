"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { StockService } from "../lib/stock";          // ← servicio
import { StockMove } from "../types/stockMove";       // ← tipo
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportesPage() {
  /* filtros */
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [tipo, setTipo] = useState("");

  /* consulta react-query */
  const { data: movs = [], isPending } = useQuery<StockMove[]>({
    queryKey: ["movs", from?.toISOString(), to?.toISOString(), tipo],
    queryFn: () =>
      StockService.list({
        from: from?.toISOString(),
        to: to?.toISOString(),
        tipo: tipo || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  /* exportar PDF */
  const exportPdf = () => {
    if (!movs.length) return;
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Producto", "Tipo", "Cantidad", "Fecha"]],
      body: movs.map((m) => [
        m.id,
        m.producto_id,
        m.tipo,
        m.cantidad,
        m.fecha.slice(0, 10),
      ]),
    });
    doc.save("reporte-stock.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6ffd9] to-white py-14">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-gray-200 backdrop-blur space-y-8">
          {/* filtros */}
          <div className="flex flex-wrap items-end gap-4">
            <h1 className="flex-1 text-3xl font-semibold text-gray-800">
              Reporte de stock
            </h1>

            <div>
              <label className="block text-sm text-gray-600">Desde</label>
              <DatePicker
                selected={from}
                onChange={setFrom}
                dateFormat="yyyy-MM-dd"
                className="input"
                placeholderText="YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Hasta</label>
              <DatePicker
                selected={to}
                onChange={setTo}
                dateFormat="yyyy-MM-dd"
                className="input"
                placeholderText="YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="input text-gray-400"
              >
                <option value="">Todos</option>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>

            <button
              onClick={exportPdf}
              disabled={!movs.length}
              className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-50"
            >
              Exportar PDF
            </button>
          </div>

          {/* tabla */}
          <div className="overflow-x-auto">
            {isPending ? (
              <p className="p-6 text-center">Cargando…</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-gray-900">
                  <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {movs.map((m) => (
                    <tr key={m.id} className="[&>td]:px-3 [&>td]:py-2">
                      <td>{m.id}</td>
                      <td>{m.producto_id}</td>
                      <td>{m.tipo}</td>
                      <td>{m.cantidad}</td>
                      <td>{m.fecha.slice(0, 10)}</td>
                    </tr>
                  ))}
                  {!movs.length && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-500">
                        Sin datos para los filtros seleccionados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Tailwind helper:
.input { @apply w-full rounded border border-gray-300 px-3 py-2 bg-white/80; }
*/
