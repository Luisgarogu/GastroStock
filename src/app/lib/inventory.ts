import { api } from "./api";
import { Inventory } from "../types/inventory";

export const InventoryService = {
  list: (): Promise<Inventory[]> =>
    api.get("/inventory").then((r) => r.data),

  /** crea fila vacía si aún no existe para un producto */
  createIfMissing: async (producto_id: number) => {
    try {
      await api.post("/inventory", { producto_id, cantidad_actual: 0 });
    } catch (_) {
      /* si ya existe → 409, lo ignoramos */
    }
  },

  updateQuantity: (producto_id: number, cantidad_actual: number) =>
    api.put(`/inventory/${producto_id}`, { cantidad_actual }).then((r) => r.data),
};
