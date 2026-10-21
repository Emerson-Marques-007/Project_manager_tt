import { requireAuth } from './_lib/auth.js';
import { db } from './_lib/db.js';

/**
 * POST /api/saves  — listar slots do usuário
 * GET  /api/saves  — alias de POST (listar)
 * POST /api/saves?action=load   — carregar um slot
 * POST /api/saves?action=save   — salvar um slot
 * POST /api/saves?action=delete — apagar um slot
 *
 * Body JSON: { action, slot (1-3), json, meta }
 * Todas as ações exigem Bearer token válido.
 */
export default async function handler(request, response) {
  if (request.method !== 'POST' && request.method !== 'GET') {
    response.setHeader('Allow', 'POST, GET');
    return response.status(405).json({ erro: 'Método não permitido.' });
  }

  let auth;
  try {
    auth = await requireAuth(request);
  } catch (error) {
    return response.status(500).json({ ok: false, erro: 'Erro ao validar sessão.' });
  }

  if (!auth.ok) {
    return response.status(auth.status).json({ ok: false, erro: auth.error });
  }

  const sql = db();
  const userId = auth.user.id;

  try {
    const body = request.body || {};
    const action = body.action || 'list';

    // --- LISTAR slots ---
    if (action === 'list' || request.method === 'GET') {
      const careers = await sql`
        SELECT id, club_id, manager_name, season, state
        FROM careers
        WHERE user_id = ${userId}
        ORDER BY created_at
      `;
      const slots = [null, null, null];
      careers.forEach((c, i) => {
        const slot = Math.min(i, 2);
        const state = c.state || {};
        slots[slot] = {
          slot: slot + 1,
          id: c.id,
          meta: {
            clube: state.clube || c.manager_name,
            tec: state.tec,
            temp: state.temp,
            rod: state.rod,
            total: state.total,
            pos: state.pos,
            caixa: state.caixa,
            rep: state.rep,
            escudo: state.escudo,
            liga: state.liga,
            ligaLogo: state.ligaLogo,
            pais: state.pais
          }
        };
      });
      return response.status(200).json({ ok: true, slots });
    }

    // --- Validação de slot ---
    const slot = Math.min(Math.max(Number(body.slot) || 1, 1), 3);

    // --- CARREGAR slot ---
    if (action === 'load') {
      const rows = await sql`
        SELECT state FROM careers
        WHERE user_id = ${userId}
        ORDER BY created_at
        OFFSET ${slot - 1} LIMIT 1
      `;
      if (!rows[0] || !rows[0].state) {
        return response.status(404).json({ ok: false, erro: 'Esse slot está vazio.' });
      }
      return response.status(200).json({ ok: true, json: JSON.stringify(rows[0].state) });
    }

    // --- SALVAR slot ---
    if (action === 'save') {
      const saveJson = String(body.json || '');
      const meta = body.meta || {};
      let state;
      try {
        state = JSON.parse(saveJson);
      } catch {
        return response.status(400).json({ ok: false, erro: 'JSON de save inválido.' });
      }

      // Guardar metadados dentro do state para listar sem desserializar
      const clubId = String(state.cid || meta.clube || '');
      const managerName = String(state.tec || meta.tec || 'Treinador');
      state._meta = meta;
      state._meta.clube = meta.clube;
      state._meta.tec = meta.tec;
      state._meta.temp = state.temp;
      state._meta.rod = state.rod;
      state._meta.total = state.cal ? state.cal.length : meta.total;
      state._meta.pos = meta.pos;
      state._meta.caixa = Math.round(state.caixa || 0);
      state._meta.rep = state.rep || meta.rep;
      state._meta.escudo = meta.escudo;
      state._meta.liga = state.ligaNome || meta.liga;
      state._meta.ligaLogo = meta.ligaLogo;
      state._meta.pais = meta.pais;

      // Buscar slot existente
      const existing = await sql`
        SELECT id FROM careers
        WHERE user_id = ${userId}
        ORDER BY created_at
        OFFSET ${slot - 1} LIMIT 1
      `;

      if (existing[0]) {
        await sql`
          UPDATE careers SET
            state = ${JSON.stringify(state)},
            manager_name = ${managerName},
            club_id = ${clubId},
            season = ${Number(state.temp) || 1},
            updated_at = now()
          WHERE id = ${existing[0].id}
        `;
      } else {
        await sql`
          INSERT INTO careers (user_id, club_id, manager_name, season, state)
          VALUES (${userId}, ${clubId}, ${managerName}, ${Number(state.temp) || 1}, ${JSON.stringify(state)})
        `;
      }

      return response.status(200).json({ ok: true });
    }

    // --- APAGAR slot ---
    if (action === 'delete') {
      const existing = await sql`
        SELECT id FROM careers
        WHERE user_id = ${userId}
        ORDER BY created_at
        OFFSET ${slot - 1} LIMIT 1
      `;
      if (!existing[0]) {
        return response.status(404).json({ ok: false, erro: 'Slot vazio.' });
      }
      await sql`DELETE FROM careers WHERE id = ${existing[0].id}`;
      return response.status(200).json({ ok: true });
    }

    return response.status(400).json({ ok: false, erro: 'Ação inválida.' });
  } catch (error) {
    return response.status(500).json({ ok: false, erro: error.message });
  }
}
