import { api } from './api';

export interface Provider {
  id: number;
  nombre: string;
  contacto: string | null;
  telefono: string | null;
}

export const ProvidersService = {
  all: async (): Promise<Provider[]> => (await api.get('/providers')).data,
  create: async (p: Omit<Provider, 'id'>) => (await api.post('/providers', p)).data,
  update: async (id: number, p: Partial<Provider>) => (await api.put(`/providers/${id}`, p)).data,
  remove: async (id: number) => api.delete(`/providers/${id}`),
};
