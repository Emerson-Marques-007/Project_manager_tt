import { db } from './_lib/db.js';
import { requireAuth } from './_lib/auth.js';
import { sendError } from './_lib/http.js';
import { lerPagina } from './_lib/paginacao.js';

/**
 * Catálogo paginado.
 *   GET /api/catalog?entity=leagues&comClubes=1&limit=500
 *   GET /api/catalog?entity=clubs&leagueId=14&limit=100&offset=0&search=fla
 *   GET /api/catalog?entity=competitions|stadiums|managers&limit=&offset=&search=
 * Resposta: { ok, <entity>: [...], total, limit, offset }
 * Sem "entity" devolve as ligas (compatibilidade).
 */
const entities = {
  leagues: {
    list: (sql, p) => sql`
      SELECT id, name AS nome, country AS pais, season AS temporada,
        logo_url AS logo, official_site AS site, source,
        (SELECT COUNT(*)::int FROM clubs c WHERE c.league_id = leagues.id) AS quantidade
      FROM leagues
      WHERE (${p.search} = '' OR name ILIKE ${p.like})
        AND (${p.comClubes} = false OR EXISTS (SELECT 1 FROM clubs c WHERE c.league_id = leagues.id))
      ORDER BY country NULLS LAST, name, id
      LIMIT ${p.limit} OFFSET ${p.offset}
    `,
    count: (sql, p) => sql`
      SELECT COUNT(*)::int AS total FROM leagues
      WHERE (${p.search} = '' OR name ILIKE ${p.like})
        AND (${p.comClubes} = false OR EXISTS (SELECT 1 FROM clubs c WHERE c.league_id = leagues.id))
    `
  },
  clubs: {
    list: (sql, p) => sql`
      SELECT id, league_id AS "ligaId", name AS nome, country AS pais, season AS temporada,
        crest_url AS escudo, transfer_budget AS "orcamentoTransferencias",
        wage_budget AS "orcamentoSalarial", squad_value AS "valorElenco",
        debt AS divida, reputation AS "reputacao", board_objective AS meta,
        financial_profile AS "perfilFinanceiro", source
      FROM clubs
      WHERE (${p.leagueId} = '' OR league_id = ${p.leagueId})
        AND (${p.search} = '' OR name ILIKE ${p.like})
      ORDER BY name, id
      LIMIT ${p.limit} OFFSET ${p.offset}
    `,
    count: (sql, p) => sql`
      SELECT COUNT(*)::int AS total FROM clubs
      WHERE (${p.leagueId} = '' OR league_id = ${p.leagueId})
        AND (${p.search} = '' OR name ILIKE ${p.like})
    `
  },
  competitions: {
    list: (sql, p) => sql`
      SELECT id, name, competition_type AS type, country, logo_url AS logo
      FROM competitions
      WHERE (${p.search} = '' OR name ILIKE ${p.like})
      ORDER BY name, id
      LIMIT ${p.limit} OFFSET ${p.offset}
    `,
    count: (sql, p) => sql`
      SELECT COUNT(*)::int AS total FROM competitions
      WHERE (${p.search} = '' OR name ILIKE ${p.like})
    `
  },
  stadiums: {
    list: (sql, p) => sql`
      SELECT id, club_id AS "clubId", name, capacity, city, country, image_url AS logo
      FROM stadiums
      WHERE (${p.search} = '' OR name ILIKE ${p.like})
      ORDER BY name, id
      LIMIT ${p.limit} OFFSET ${p.offset}
    `,
    count: (sql, p) => sql`
      SELECT COUNT(*)::int AS total FROM stadiums
      WHERE (${p.search} = '' OR name ILIKE ${p.like})
    `
  },
  managers: {
    list: (sql, p) => sql`
      SELECT id, first_name AS "firstName", last_name AS "lastName", image_url AS image
      FROM managers
      WHERE (${p.search} = '' OR (COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')) ILIKE ${p.like})
      ORDER BY last_name NULLS LAST, first_name, id
      LIMIT ${p.limit} OFFSET ${p.offset}
    `,
    count: (sql, p) => sql`
      SELECT COUNT(*)::int AS total FROM managers
      WHERE (${p.search} = '' OR (COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')) ILIKE ${p.like})
    `
  }
};

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ erro: 'Método não permitido.' });
  }

  let auth;
  try { auth = await requireAuth(request); } catch { return response.status(500).json({ ok: false, erro: 'Erro ao validar sessão.' }); }
  if (!auth.ok) return response.status(auth.status).json({ ok: false, erro: auth.error });

  try {
    const pagina = lerPagina(request.url);
    const entity = pagina.params.get('entity') || 'leagues';
    const definicao = Object.hasOwn(entities, entity) ? entities[entity] : null;
    if (!definicao) return response.status(400).json({ ok: false, erro: 'Entidade inválida.' });

    const p = {
      ...pagina,
      leagueId: (pagina.params.get('leagueId') || '').trim().slice(0, 40),
      comClubes: ['1', 'true'].includes(pagina.params.get('comClubes'))
    };
    const sql = db();
    const [rows, contagem] = await Promise.all([definicao.list(sql, p), definicao.count(sql, p)]);

    return response.status(200).json({
      ok: true,
      [entity]: rows,
      total: contagem[0]?.total ?? rows.length,
      limit: p.limit,
      offset: p.offset
    });
  } catch (error) {
    return sendError(response, error);
  }
}
