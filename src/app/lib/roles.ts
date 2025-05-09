import { api } from "./api";
import { Role } from "../types/role";

export const RolesService = {
  list: (): Promise<Role[]>  => api.get("/roles").then(r => r.data),
};
