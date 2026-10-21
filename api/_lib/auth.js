import { createHash } from 'node:crypto';
import { db } from './db.js';

/**
 * Extrai e valida o token Bearer do header Authorization.
 * Retorna { ok, user } ou { ok: false, error }.
 */
export async function requireAuth(request) {
  const header = request.headers?.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return { ok: false, status: 401, error: 'Token não fornecido.' };

  const token = match[1].trim();
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const sql = db();

  const rows = await sql`
    SELECT s.user_id, u.email, u.id
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenHash}
      AND s.expires_at > now()
    LIMIT 1
  `;

  if (!rows[0]) return { ok: false, status: 401, error: 'Sessão inválida ou expirada.' };

  return { ok: true, user: { id: rows[0].user_id, email: rows[0].email, dbId: rows[0].id } };
}
