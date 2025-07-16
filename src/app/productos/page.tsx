'use client';

import { useState, FormEvent } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ProductsService }   from '../lib/products';
import { InventoryService }  from '../lib/inventory';
import { StockService }      from '../lib/stock';
import { SuggestService }    from '../../services/suggest';
import { Product }           from '../types/product';
import { useRouter }         from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* -------------------------------------------------------------------- */
/*  Tipos                                                                */
/* -------------------------------------------------------------------- */
interface Draft extends Partial<Product> {
  cantidad_actual: number;
}

interface Suggestion {
  title : string;
  steps : string[];
  notes?: string;
}

/* -------------------------------------------------------------------- */
/*  Utils – parsear la respuesta Markdown que llega de la IA             */
/* -------------------------------------------------------------------- */
const parseMarkdown = (md: string): Suggestion => {
  const lines = md.split('\n').map(l => l.trim()).filter(Boolean);

  /* título = primer texto entre ** **  ó  1er encabezado ### */
  const title =
    (md.match(/\*\*(.+?)\*\*/) ?? md.match(/#+\s*(.+)/))?.[1]?.trim() ||
    'Propuesta';

  /* pasos = líneas que empiecen con “n.” */
  const steps = lines
    .filter(l => /^\d+\./.test(l))
    .map(l => l.replace(/^\d+\.\s*/, ''));

  return { title, steps };
};

/* ==================================================================== */
export default function ProductosPage() {
  const qc      = useQueryClient();
  const router  = useRouter();

  /* ----------------------- datos (React-Query) ----------------------- */
  const { data: productos = [], isLoading: prodLoading } = useQuery({
    queryKey : ['productos'],
    queryFn  : ProductsService.list,
  });

  const { data: inventario = [], isLoading: invLoading } = useQuery({
    queryKey : ['inventario'],
    queryFn  : InventoryService.list,
  });

  /* ------------------------------ state ------------------------------ */
  const [draft, setDraft]         = useState<Draft | null>(null);
  const [aiOpen, setAiOpen]       = useState(false);
  const [aiData, setAiData]       = useState<Suggestion | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  /* -------------------------- mutaciones ----------------------------- */
  const saveMut = useMutation({
    mutationFn: async (body: Draft) => {
      const prod = body.id
        ? await ProductsService.update(body.id, body)
        : await ProductsService.create(body as Omit<Product, 'id'>);

      let inv = inventario.find(i => i.producto_id === prod.id);
      if (!inv) inv = await InventoryService.createIfMissing(prod.id);

      const prev = inv.cantidad_actual;
      const next = body.cantidad_actual ?? prev;
      const diff = next - prev;

      if (diff !== 0) {
        await StockService.create({
          producto_id : prod.id,
          tipo        : diff > 0 ? 'entrada' : 'salida',
          cantidad    : Math.abs(diff),
          usuario_id  : null,
          proveedor_id: null,
        });
      }
      await InventoryService.updateQuantity(inv.id, next);
      return prod;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productos'] });
      qc.invalidateQueries({ queryKey: ['inventario'] });
      qc.invalidateQueries({ queryKey: ['movs'] });
      setDraft(null);
      toast.success('Guardado');
    },
    onError: (e: any) => toast.error(e.message ?? 'Error'),
  });

  const deleteMut = useMutation({
    mutationFn : (id: number) => ProductsService.remove(id),
    onSuccess  : () => {
      qc.invalidateQueries({ queryKey: ['productos'] });
      qc.invalidateQueries({ queryKey: ['inventario'] });
      toast.success('Producto eliminado');
    },
    onError    : (e: any) => toast.error(e.message ?? 'Error'),
  });

  /* ------------------------- helpers ------------------------------- */
  if (prodLoading || invLoading) {
    return <p className="p-8 text-center text-gray-600">Cargando…</p>;
  }

  const stockMap = Object.fromEntries(
    inventario.map(i => [i.producto_id, i.cantidad_actual]),
  );

  /* ---------------- IA – sugerir plato con stock DISPONIBLE --------- */
  const handleSuggest = async () => {
    setAiLoading(true);
    setAiOpen(true);

    try {
      /* 👇  AHORA TOMAMOS SOLO LOS INGREDIENTES QUE TENGAN stock > mín. */
      const availableIng = productos
        .filter(p => (stockMap[p.id] ?? 0) >  p.stock_minimo)   // suficiente
        .map(p => p.nombre);

      if (!availableIng.length) {
        toast.info('No hay ingredientes suficientes para sugerir un plato.');
        setAiOpen(false);
        return;
      }

      const { suggestion } = await SuggestService.get(availableIng);

      setAiData(parseMarkdown(suggestion));
    } catch (err: any) {
      toast.error(err.message ?? 'Error IA');
      setAiData(null);
    } finally {
      setAiLoading(false);
    }
  };

  /* ------------------------------- UI -------------------------------- */
  return (
    <>
      {/* ==================== Encabezado ==================== */}
      <div className="min-h-screen bg-gradient-to-b from-[#c6ffd9] to-white py-14">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-gray-200 backdrop-blur">

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-semibold text-gray-800">Inventario</h1>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    setDraft({
                      nombre: '', categoria: '',
                      unidad_medida: '', stock_minimo: 0, cantidad_actual: 0,
                    })
                  }
                  className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700"
                >
                  Nuevo producto
                </button>

                <button
                  onClick={() => router.push('/reportes')}
                  className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700"
                >
                  Reportes
                </button>

                <button
                  onClick={handleSuggest}
                  disabled={aiLoading}
                  className="rounded-full bg-lime-500 px-6 py-2 text-sm font-medium text-white shadow hover:bg-lime-600 disabled:opacity-50"
                >
                  {aiLoading ? 'Consultando…' : 'Sugerir plato con stock disponible'}
                </button>
              </div>
            </div>

            {/* ==================== Tabla ==================== */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-gray-700">
                  <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                    <th>Nombre</th><th>Categoría</th><th>Unidad</th>
                    <th>Stock</th><th>Mín.</th><th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-500">
                  {productos.map((p) => {
                    const qty = stockMap[p.id] ?? 0;
                    const low = qty <= p.stock_minimo;
                    return (
                      <tr key={p.id}
                        className={(low ? 'bg-red-200 ' : '') + '[&>td]:px-3 [&>td]:py-2'}>
                        <td>{p.nombre}</td>
                        <td>{p.categoria ?? '-'}</td>
                        <td>{p.unidad_medida ?? '-'}</td>
                        <td>{qty}</td>
                        <td>{p.stock_minimo}</td>
                        <td className="whitespace-nowrap text-center space-x-3">
                          <button
                            onClick={() => setDraft({ ...p, cantidad_actual: qty })}
                            className="text-emerald-600 hover:underline">
                            Editar
                          </button>
                          <button
                            onClick={() => deleteMut.mutate(p.id)}
                            className="text-red-600 hover:underline">
                            Borrar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ==================== Modal CRUD ==================== */}
        {draft && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <form
              onSubmit={(e: FormEvent) => { e.preventDefault(); saveMut.mutate(draft); }}
              className="w-full max-w-md space-y-4 rounded bg-white p-6 shadow text-gray-600"
            >
              <h2 className="text-lg font-semibold text-gray-500">
                {draft.id ? 'Editar' : 'Nuevo'} producto
              </h2>

              {([
                ['Nombre', 'nombre'],
                ['Categoría', 'categoria'],
                ['Unidad de medida', 'unidad_medida'],
              ] as const).map(([label, key]) => (
                <div key={key}>
                  <label className="block mb-1 text-sm ">{label}</label>
                  <input
                    className="input"
                    value={(draft as any)[key] ?? ''}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                    required={key === 'nombre'}
                  />
                </div>
              ))}

              <div className="flex gap-4 text-gray-800">
                {([
                  ['Stock mínimo', 'stock_minimo'],
                  ['Cantidad actual', 'cantidad_actual'],
                ] as const).map(([label, key]) => (
                  <div key={key} className="flex-1">
                    <label className="block mb-1 text-sm">{label}</label>
                    <input
                      type="number"
                      className="input"
                      value={(draft as any)[key] ?? 0}
                      onChange={(e) => setDraft({ ...draft, [key]: +e.target.value })}
                      min={0}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDraft(null)}>Cancelar</button>
                <button
                  type="submit"
                  disabled={saveMut.isPending}
                  className="rounded bg-emerald-600 px-4 py-1 text-white disabled:opacity-50">
                  {saveMut.isPending ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== Modal IA ==================== */}
        {aiOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl space-y-4 text-gray-800">
              {aiLoading && <p className="text-center">Generando sugerencia…</p>}

              {!aiLoading && aiData && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {aiData.title}
                  </h2>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    {aiData.steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                  {aiData.notes && (
                    <p className="text-sm text-gray-600">{aiData.notes}</p>
                  )}
                </>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => { setAiOpen(false); setAiData(null); }}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </>
  );
}
