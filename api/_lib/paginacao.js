export const LIMITE_PADRAO = 100;
export const LIMITE_MAXIMO = 500;

/** Lê limit, offset e search da URL, com limites seguros. */
export function lerPagina(url) {
  const params = new URL(url, 'http://localhost').searchParams;
  const limit = Math.min(Math.max(Math.trunc(Number(params.get('limit'))) || LIMITE_PADRAO, 1), LIMITE_MAXIMO);
  const offset = Math.max(Math.trunc(Number(params.get('offset'))) || 0, 0);
  const search = (params.get('search') || '').trim().slice(0, 80);
  // escapa curingas do ILIKE para a busca ser literal
  const like = '%' + search.replace(/[\\%_]/g, '\\$&') + '%';
  return { limit, offset, search, like, params };
}
