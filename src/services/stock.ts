import { api } from './api';

export interface StockMove {
  id: number;
  producto_id: number;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  fecha: string;
}

export const StockService = {
  list: async (params?: { from?: string; to?: string; tipo?: string }) => {
    const { data } = await api.get<StockMove[]>('/stock', { params });
    return data;
  },

  create: async (body: Omit<StockMove, 'id' | 'fecha'>) => {
    const { data } = await api.post<StockMove>('/stock', body);
    return data;
  },

  remove: async (id: number) => {
    await api.delete(`/stock/${id}`);
  },
};
