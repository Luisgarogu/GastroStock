import { api } from "./api";
import { Provider } from "../types/provider";

export const ProvidersService = {
  list:    (): Promise<Provider[]>            => api.get("/providers").then(r => r.data),
  create:  (p: Omit<Provider, "id">)         => api.post<Provider>("/providers", p).then(r => r.data),
  update:  (id: number, p: Partial<Provider>) => api.put<Provider>(`/providers/${id}`, p).then(r => r.data),
  remove:  (id: number)                      => api.delete(`/providers/${id}`),
};
