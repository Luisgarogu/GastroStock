import { api } from "./api";
import { User } from "../types/user";

export const UsersService = {
  list:    (): Promise<User[]>            => api.get("/users").then(r => r.data),
  get:     (id: number): Promise<User>    => api.get(`/users/${id}`).then(r => r.data),
  create:  (u: Omit<User, "id">)          => api.post<User>("/users", u).then(r => r.data),
  update:  (id: number, u: Partial<User>) => api.put<User>(`/users/${id}`, u).then(r => r.data),
  remove:  (id: number)                   => api.delete(`/users/${id}`),
};
