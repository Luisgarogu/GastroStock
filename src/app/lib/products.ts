import { api } from "./api";
import { Product } from "../types/product";

export const ProductsService = {
  list: (): Promise<Product[]> =>
    api.get("/products").then((r) => r.data),

  get: (id: number): Promise<Product> =>
    api.get(`/products/${id}`).then((r) => r.data),

  create: (p: Omit<Product, "id">) =>
    api.post<Product>("/products", p).then((r) => r.data),

  update: (id: number, p: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, p).then((r) => r.data),

  remove: (id: number) => api.delete(`/products/${id}`),
};
