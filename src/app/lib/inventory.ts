import { api } from "./api";
import { Inventory } from "../types/inventory";

export const InventoryService = {
  list: (): Promise<Inventory[]> =>
    api.get("/inventory").then((r) => r.data),

  /* ① ahora devolvemos la fila creada */
  createIfMissing: async (producto_id: number): Promise<Inventory> => {
    const { data } = await api.post("/inventory", {
      producto_id,
      cantidad_actual: 0,
    });
    return data;                    // ← fila con id real
  },

  updateQuantity: (id: number, cantidad_actual: number) =>
    api.put(`/inventory/${id}`, { cantidad_actual }).then((r) => r.data),
};
