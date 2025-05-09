"use client";

import { useState, FormEvent } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ProductsService } from "../lib/products";
import { InventoryService } from "../lib/inventory";
import { Product } from "../types/product";
import { Inventory } from "../types/inventory";

interface Draft extends Partial<Product> {
  cantidad_actual: number;
}

export default function ProductosPage() {
  const qc = useQueryClient();

  /* ───── consultas ───── */
  const {
    data: productos = [],
    isPending,
    error,
  } = useQuery<Product[]>({
    queryKey: ["productos"],
    queryFn: ProductsService.list,
  });

  const { data: inventario = [] } = useQuery<Inventory[]>({
    queryKey: ["inventario"],
    queryFn: InventoryService.list,
  });

  /* ───── manejo de carga / error ───── */
  if (isPending) {
    return (
      <p className="p-8 text-center text-gray-600">Cargando inventario…</p>
    );
  }
  if (error) {
    return (
      <p className="p-8 text-center text-red-600">
        Error al cargar inventario
      </p>
    );
  }

  /* ───── mapa producto_id → cantidad_actual ───── */
  const stockMap = Object.fromEntries(
    inventario.map((i) => [i.producto_id, i.cantidad_actual])
  );

  /* ───── mutaciones ───── */
  const saveMut = useMutation({
    mutationFn: async (body: Draft) => {
      let prod: Product;
      if (body.id) {
        prod = await ProductsService.update(body.id, body);
      } else {
        prod = await ProductsService.create(body as Omit<Product, "id">);
        await InventoryService.createIfMissing(prod.id);
      }
      await InventoryService.updateQuantity(
        prod.id,
        body.cantidad_actual ?? 0
      );
      return prod;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productos"] });
      qc.invalidateQueries({ queryKey: ["inventario"] });
      setDraft(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => ProductsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productos"] });
      qc.invalidateQueries({ queryKey: ["inventario"] });
    },
  });

  /* ───── estado draft ───── */
  const [draft, setDraft] = useState<Draft | null>(null);
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (draft) saveMut.mutate(draft);
  };

  /* ───── UI principal ───── */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6ffd9] to-white py-14">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-gray-200 backdrop-blur">
          {/* header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-semibold text-gray-800">Inventario</h1>
            <button
              onClick={() =>
                setDraft({
                  nombre: "",
                  categoria: "",
                  unidad_medida: "",
                  stock_minimo: 0,
                  cantidad_actual: 0,
                })
              }
              className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700"
            >
              Nuevo producto
            </button>
          </div>

          {/* tabla */}
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
                {productos.map((p) => {
                  const cantidad = stockMap[p.id] ?? 0;
                  const low = cantidad <= p.stock_minimo;
                  return (
                    <tr
                      key={p.id}
                      className={
                        (low ? "bg-red-50 " : "") +
                        "[&>td]:px-3 [&>td]:py-2"
                      }
                    >
                      <td>{p.nombre}</td>
                      <td>{p.categoria ?? "-"}</td>
                      <td>{p.unidad_medida ?? "-"}</td>
                      <td>{cantidad}</td>
                      <td>{p.stock_minimo}</td>
                      <td className="whitespace-nowrap text-center space-x-3">
                        <button
                          onClick={() =>
                            setDraft({ ...p, cantidad_actual: cantidad })
                          }
                          className="text-emerald-600 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteMut.mutate(p.id)}
                          className="text-red-600 hover:underline"
                        >
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

      {/* modal de creación/edición */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-md space-y-4 rounded bg-white p-6 shadow text-gray-600"
          >
            <h2 className="text-lg font-semibold text-gray-500">
              {draft.id ? "Editar" : "Nuevo"} producto
            </h2>

            <input
              className="input"
              placeholder="Nombre"
              value={draft.nombre ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, nombre: e.target.value })
              }
              required
            />

            <input
              className="input"
              placeholder="Categoría"
              value={draft.categoria ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, categoria: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Unidad (g, u, L…)"
              value={draft.unidad_medida ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, unidad_medida: e.target.value })
              }
            />

            <div className="flex gap-2">
              <input
                type="number"
                className="input flex-1"
                placeholder="Stock mínimo"
                value={draft.stock_minimo ?? 0}
                onChange={(e) =>
                  setDraft({ ...draft, stock_minimo: +e.target.value })
                }
                min={0}
                required
              />
              <input
                type="number"
                className="input flex-1"
                placeholder="Cantidad actual"
                value={draft.cantidad_actual ?? 0}
                onChange={(e) =>
                  setDraft({ ...draft, cantidad_actual: +e.target.value })
                }
                min={0}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setDraft(null)}>
                Cancelar
              </button>
              <button className="rounded bg-emerald-600 px-4 py-1 text-white">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

