import { api } from './api';

/** Respuesta cruda que viene del backend IA */
export interface SuggestResponse {
  suggestion: string;            // ← texto Markdown del plato
}

/** POST /ai/suggest-meal */
export const SuggestService = {
  get: (ingredients: string[]) =>
    api
      .post<SuggestResponse>('/ai/suggest-meal', { ingredients })
      .then(r => r.data),
};
