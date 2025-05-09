import axios from 'axios';

/** Instancia global de Axios */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api', // .env.local
  timeout: 10_000,
});

/* ---- Interceptores opcionales ---- */
// Agregar token, logs, manejar errores globales…
api.interceptors.request.use((config) => {
  // Ejemplo: config.headers.Authorization = `Bearer ${token}`;
  return config;
});
