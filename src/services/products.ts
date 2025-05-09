import { api } from './api';

export interface Product {
  id: number;
  nombre: string;
  categoria: string | null;
  unidad_medida: string | null;
  stock_minimo: number;
  cantidad_actual: number;
  fecha_actualizacion: string;
}

/* ---- CRUD ---- */
export const ProductsService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/products');
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  create: async (p: Omit<Product, 'id' | 'fecha_actualizacion'>) => {
    const { data } = await api.post<Product>('/products', p);
    return data;
  },

  update: async (id: number, p: Partial<Product>) => {
    const { data } = await api.put<Product>(`/products/${id}`, p);
    return data;
  },

  remove: async (id: number) => {
    await api.delete(`/products/${id}`);
  },
};
