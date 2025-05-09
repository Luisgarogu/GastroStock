import { api } from "./api";
import { StockMove } from "../types/stockMove";

export const StockService = {
  list:    (params?: { from?: string; to?: string; tipo?: string }) =>
             api.get<StockMove[]>("/stock", { params }).then(r => r.data),
  create:  (m: Omit<StockMove, "id" | "fecha">) =>
             api.post<StockMove>("/stock", m).then(r => r.data),
  remove:  (id: number) =>
             api.delete(`/stock/${id}`),
};
