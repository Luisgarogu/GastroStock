// app/(dashboard)/proveedores/page.tsx
'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ShoppingCart,
  X as Close,
  Save,
} from 'lucide-react';

/* ---------- tipos y mocks ------------------------------------------------ */
type Supplier = {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
};

type PriceRow = { sku: string; producto: string; precio: number };

const SUPPLIERS: Supplier[] = [
  {
    id: 1,
    nombre: 'Distribuciones El Cafetal',
    contacto: 'Marta López',
    telefono: '320-123-4567',
    email: 'ventas@cafetal.com',
  },
  {
    id: 2,
    nombre: 'Frutas y Verduras S.A.',
    contacto: 'Pedro Gómez',
    telefono: '310-555-9876',
    email: 'pedrog@fruver.com',
  },
  {
    id: 3,
    nombre: 'Cárnicos Gourmet',
    contacto: 'Ana María Ríos',
    telefono: '315-888-9999',
    email: 'amrios@carnicos.co',
  },
];

const fakePrices = (id: number): PriceRow[] =>
  Array.from({ length: 5 }, (_, i) => ({
    sku: `SKU-${id}${i + 1}`,
    producto: `Producto ${i + 1}`,
    precio: +(Math.random() * 80 + 20).toFixed(2),
  }));

/* ---------- componente ---------------------------------------------------- */
export default function ProveedoresPage() {
  /* tabla de proveedores */
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);

  /* drawer de precios */
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [prices, setPrices] = useState<PriceRow[]>([]);

  /* formulario “Añadir precio” */
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSku, setNewSku] = useState('');
  const [newProd, setNewProd] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const openDrawer = (s: Supplier) => {
    setActiveSupplier(s);
    setPrices(fakePrices(s.id));
    setShowDrawer(true);
    setShowAddForm(false);
    setNewSku('');
    setNewProd('');
    setNewPrice('');
  };

  const closeDrawer = () => setShowDrawer(false);

  /* añadir precio localmente */
  const addPrice = () => {
    if (!newSku || !newProd || !newPrice) return;
    setPrices((p) => [
      ...p,
      { sku: newSku, producto: newProd, precio: +newPrice },
    ]);
    setShowAddForm(false);
    setNewSku('');
    setNewProd('');
    setNewPrice('');
  };

  /* eliminar proveedor (demo local) */
  const deleteSupplier = (id: number) =>
    setSuppliers((prev) => prev.filter((s) => s.id !== id));

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#c6ffd9] to-white py-14">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="space-y-8 rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-gray-200 backdrop-blur">
          {/* encabezado */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold text-gray-800">
              Proveedores
            </h1>
            <button className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700">
              <Plus size={18} />
              Añadir
            </button>
          </div>

          {/* tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-gray-900">
                <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium text-gray-800">
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {suppliers.map((s) => (
                  <tr key={s.id} className="[&>td]:px-3 [&>td]:py-2 text-gray-800">
                    <td>{s.id}</td>
                    <td>{s.nombre}</td>
                    <td>{s.contacto}</td>
                    <td>{s.telefono}</td>
                    <td>{s.email}</td>
                    <td>
                      <div className="flex justify-center gap-3 text-gray-600">
                        <button
                          title="Ver precios"
                          onClick={() => openDrawer(s)}
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button title="Editar">
                          <Pencil size={18} />
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => deleteSupplier(s.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!suppliers.length && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-4 text-center text-gray-500"
                    >
                      (sin proveedores)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* drawer de precios */}
      {showDrawer && activeSupplier && (
        <div className="fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* panel */}
          <aside className="flex w-full max-w-md flex-col bg-white shadow-2xl ring-1 ring-gray-200">
            <header className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Precios – {activeSupplier.nombre}
              </h2>
              <button
                onClick={closeDrawer}
                className="rounded-full p-1 text-gray-600 hover:bg-gray-100"
              >
                <Close size={20} />
              </button>
            </header>

            {/* cuerpo */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* tabla de precios */}
              <table className="w-full text-sm ">
                <thead className="bg-emerald-50 text-gray-900">
                  <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium ">
                    <th>SKU</th>
                    <th>Producto</th>
                    <th className="text-right">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {prices.map((p) => (
                    <tr key={p.sku} className="[&>td]:px-3 [&>td]:py-2">
                      <td>{p.sku}</td>
                      <td>{p.producto}</td>
                      <td className="text-right">
                        ${p.precio.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {!prices.length && (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-4 text-center text-gray-500"
                      >
                        (sin precios)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* botón añadir precio */}
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-emerald-600 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  <Plus size={16} />
                  Añadir precio
                </button>
              )}

              {/* formulario add */}
              {showAddForm && (
                <div className="mt-6 space-y-4 rounded-lg border border-gray-200 p-4  text-gray-800">
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      placeholder="SKU"
                      className="input"
                    />
                    <input
                      value={newProd}
                      onChange={(e) => setNewProd(e.target.value)}
                      placeholder="Producto"
                      className="input col-span-2"
                    />
                    <input
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Precio"
                      type="number"
                      className="input"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={addPrice}
                      className="flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      <Save size={16} /> Guardar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}


