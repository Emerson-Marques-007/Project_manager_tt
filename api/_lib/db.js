import { neon } from '@neondatabase/serverless';

let sql;
let override;

/** Permite trocar o cliente do banco (usado apenas nos testes). */
export function setDb(fn) {
  override = fn || undefined;
}

export function db() {
  if (override) return override;

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não configurada.');
  }

  sql ||= neon(process.env.DATABASE_URL);
  return sql;
}
