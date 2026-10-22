/**
 * Testes da API — importam os handlers reais (api/*.js) e trocam apenas o banco
 * por uma versão em memória (setDb) e o fetch da Resend por um mock.
 * Rodar com: npm test
 */
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import { setDb } from '../api/_lib/db.js';
import authHandler from '../api/auth.js';
import savesHandler from '../api/saves.js';
import catalogHandler from '../api/catalog.js';
import worldHandler from '../api/world.js';
import healthHandler from '../api/health.js';
import { lerPagina, LIMITE_MAXIMO, LIMITE_PADRAO } from '../api/_lib/paginacao.js';

/* ------------------------------------------------------------------ *
 * Utilidades
 * ------------------------------------------------------------------ */
const sha = (v) => createHash('sha256').update(v).digest('hex');

function req(method, body, headers = {}, url = '/api/test') {
  return { method, body: body || {}, headers, url };
}

function res() {
  const r = {
    statusCode: 200, headers: {}, body: null,
    status(c) { r.statusCode = c; return r; },
    setHeader(k, v) { r.headers[k] = v; return r; },
    json(d) { r.body = d; return r; }
  };
  return r;
}

async function call(handler, request) {
  const response = res();
  await handler(request, response);
  return response;
}

/** Banco em memória que entende só as consultas usadas pelos handlers. */
function fakeDb() {
  const t = {
    users: [], codes: [], sessions: [], reqs: [], careers: [],
    clubs: [{ id: '100' }, { id: '200' }], playersValues: null, fail: null, lastQuery: '', catalogRows: [], catalogTotal: 0, clubValues: null
  };
  let seq = 0;
  const sql = async (strings, ...v) => {
    const q = strings.join('?').replace(/\s+/g, ' ').trim();
    if (t.fail && t.fail.test(q)) throw new Error('falha interna do banco: senha=segredo');
    let m;

    // ---- sessão
    if (/FROM sessions s JOIN users u/.test(q)) {
      const s = t.sessions.find((x) => x.token_hash === v[0] && x.expires > Date.now());
      const u = s && t.users.find((x) => x.id === s.user_id);
      return u ? [{ user_id: u.id, email: u.email, id: u.id }] : [];
    }
    if (/^DELETE FROM sessions WHERE token_hash/.test(q)) {
      t.sessions = t.sessions.filter((x) => x.token_hash !== v[0]); return [];
    }
    if (/^DELETE FROM (auth_codes|sessions|auth_requests)/.test(q)) return [];
    if (/^INSERT INTO sessions/.test(q)) {
      t.sessions.push({ user_id: v[0], token_hash: v[1], expires: Date.parse(v[2]) }); return [];
    }

    // ---- usuários e códigos
    if (/^INSERT INTO users/.test(q)) {
      let u = t.users.find((x) => x.email === v[0]);
      if (!u) { u = { id: 'u' + (++seq), email: v[0] }; t.users.push(u); }
      return [u];
    }
    if (/^SELECT id, email FROM users WHERE email/.test(q)) {
      const u = t.users.find((x) => x.email === v[0]); return u ? [u] : [];
    }
    if (/AS n FROM auth_requests/.test(q)) {
      return [{ n: t.reqs.filter((r) => r.ip === v[0] && Date.now() - r.at < 3600e3).length }];
    }
    if (/^INSERT INTO auth_requests/.test(q)) { t.reqs.push({ ip: v[0], at: Date.now() }); return []; }
    if (/COALESCE\(MAX\(EXTRACT/.test(q)) {
      const list = t.codes.filter((c) => c.user_id === v[0] && Date.now() - c.at < 3600e3);
      const seg = list.length ? Math.min(...list.map((c) => (Date.now() - c.at) / 1000)) : 999999;
      return [{ n: list.length, segundos: seg }];
    }
    if (/^INSERT INTO auth_codes/.test(q)) {
      t.codes.push({ id: 'c' + (++seq), user_id: v[0], code_hash: v[1], attempts: 0, used_at: null, at: Date.now(), exp: Date.parse(v[2]) });
      return [];
    }
    if (/^SELECT id FROM auth_codes WHERE user_id/.test(q)) {
      const c = t.codes.filter((x) => x.user_id === v[0] && !x.used_at && x.exp > Date.now() && x.attempts < v[1])
        .sort((a, b) => b.at - a.at)[0];
      return c ? [{ id: c.id }] : [];
    }
    if (/^UPDATE auth_codes SET used_at/.test(q)) {
      const c = t.codes.find((x) => x.id === v[0] && x.code_hash === v[1]);
      if (!c) return [];
      c.used_at = Date.now(); return [{ id: c.id }];
    }
    if (/^UPDATE auth_codes SET attempts/.test(q)) {
      t.codes.find((x) => x.id === v[0]).attempts++; return [];
    }

    // ---- carreiras e catálogo
    if (/^SELECT id FROM clubs/.test(q)) return t.clubs.filter((c) => c.id === v[0]);
    if (/^SELECT id, slot, club_id/.test(q)) {
      return t.careers.filter((c) => c.user_id === v[0]).sort((a, b) => a.slot - b.slot);
    }
    if (/^SELECT state FROM careers/.test(q)) {
      return t.careers.filter((c) => c.user_id === v[0] && c.slot === v[1]).map((c) => ({ state: c.state }));
    }
    if ((m = /^INSERT INTO careers/.exec(q))) {
      const [user_id, slot, club_id, manager_name, season, json] = v;
      const row = { id: 'k' + (++seq), user_id, slot, club_id, manager_name, season, state: JSON.parse(json) };
      const i = t.careers.findIndex((c) => c.user_id === user_id && c.slot === slot);
      if (i >= 0) t.careers[i] = { ...row, id: t.careers[i].id }; else t.careers.push(row);
      return [];
    }
    if (/^DELETE FROM careers/.test(q)) {
      const i = t.careers.findIndex((c) => c.user_id === v[0] && c.slot === v[1]);
      if (i < 0) return [];
      return t.careers.splice(i, 1).map((c) => ({ id: c.id }));
    }
    if (/AS total FROM/.test(q)) return [{ total: t.catalogTotal }];
    if (/^SELECT id, league_id AS "ligaId"/.test(q)) { t.clubValues = v; return t.catalogRows; }
    if (/FROM leagues/.test(q)) { t.lastQuery = q; return t.catalogRows; }
    if (/FROM players/.test(q)) { t.playersValues = v; return []; }
    if (/^SELECT 1 AS ok/.test(q)) return [{ ok: 1 }];
    return [];
  };
  return { sql, t };
}

/* cria um usuário logado e devolve { token, headers } */
function login(t, email = 'tec@exemplo.com') {
  let u = t.users.find((x) => x.email === email);
  if (!u) { u = { id: 'u' + (t.users.length + 100), email }; t.users.push(u); }
  const token = 'token-' + u.id;
  t.sessions.push({ user_id: u.id, token_hash: sha(token), expires: Date.now() + 1e7 });
  return { token, headers: { authorization: 'Bearer ' + token } };
}

/** Save mínimo válido: cid é ÍNDICE; o id real do catálogo está em cl[cid].dbid. */
function saveJson({ cid = 1, dbid = '200' } = {}) {
  return JSON.stringify({
    tec: 'Carlos', cid, temp: 2, rod: 5, caixa: 1234.6, rep: 55, ligaNome: 'Brasileirão',
    cal: [[], [], []],
    cl: [{ dbid: '100', n: 'Clube A' }, { dbid, n: 'Clube B' }]
  });
}
const META = { clube: 'Clube B', tec: 'Carlos', pos: 3, escudo: 'http://x/y.png', ligaLogo: 'http://x/l.png', pais: 'Brasil' };

let fake;
let realFetch;
let realConsoleError;

beforeEach(() => {
  fake = fakeDb();
  setDb(fake.sql);
  realFetch = globalThis.fetch;
  realConsoleError = console.error;
  console.error = () => {}; // erros 500 são logados; silencia no teste
  process.env.RESEND_API_KEY = 'chave-teste';
  process.env.MAIL_FROM = 'Teste <teste@exemplo.com>';
});
afterEach(() => {
  setDb(null);
  globalThis.fetch = realFetch;
  console.error = realConsoleError;
});

/* ------------------------------------------------------------------ *
 * /api/saves
 * ------------------------------------------------------------------ */
describe('saves', () => {
  test('exige token (401)', async () => {
    const r = await call(savesHandler, req('POST', { action: 'list' }));
    assert.equal(r.statusCode, 401);
  });

  test('rejeita métodos inválidos (405)', async () => {
    const r = await call(savesHandler, req('PUT'));
    assert.equal(r.statusCode, 405);
  });

  test('lista 3 slots vazios', async () => {
    const { headers } = login(fake.t);
    const r = await call(savesHandler, req('POST', { action: 'list' }, headers));
    assert.deepEqual(r.body.slots, [null, null, null]);
  });

  test('salva usando o dbid real do clube (e não o índice) em club_id', async () => {
    const { headers } = login(fake.t);
    const r = await call(savesHandler, req('POST', { action: 'save', slot: 2, json: saveJson(), meta: META }, headers));
    assert.equal(r.statusCode, 200);
    assert.equal(fake.t.careers[0].club_id, '200');
    assert.equal(fake.t.careers[0].slot, 2);
  });

  test('lista devolve os metadados (posição, escudo, liga) do slot certo', async () => {
    const { headers } = login(fake.t);
    await call(savesHandler, req('POST', { action: 'save', slot: 2, json: saveJson(), meta: META }, headers));
    const r = await call(savesHandler, req('POST', { action: 'list' }, headers));
    assert.equal(r.body.slots[0], null);
    assert.equal(r.body.slots[1].slot, 2);
    assert.equal(r.body.slots[1].meta.pos, 3);
    assert.equal(r.body.slots[1].meta.escudo, 'http://x/y.png');
    assert.equal(r.body.slots[1].meta.liga, 'Brasileirão');
    assert.equal(r.body.slots[1].meta.caixa, 1235);
    assert.equal(r.body.slots[1].meta.total, 3);
  });

  test('rejeita save cujo clube não existe no catálogo (400)', async () => {
    const { headers } = login(fake.t);
    const r = await call(savesHandler, req('POST', { action: 'save', slot: 1, json: saveJson({ dbid: '999' }), meta: META }, headers));
    assert.equal(r.statusCode, 400);
    assert.match(r.body.erro, /catálogo/);
    assert.equal(fake.t.careers.length, 0);
  });

  test('rejeita save sem lista de clubes (400)', async () => {
    const { headers } = login(fake.t);
    const r = await call(savesHandler, req('POST', { action: 'save', slot: 1, json: JSON.stringify({ tec: 'x', cid: 0 }), meta: META }, headers));
    assert.equal(r.statusCode, 400);
  });

  test('rejeita JSON inválido (400)', async () => {
    const { headers } = login(fake.t);
    const r = await call(savesHandler, req('POST', { action: 'save', slot: 1, json: '{quebrado', meta: {} }, headers));
    assert.equal(r.statusCode, 400);
  });

  test('salvar de novo no mesmo slot atualiza em vez de duplicar', async () => {
    const { headers } = login(fake.t);
    await call(savesHandler, req('POST', { action: 'save', slot: 1, json: saveJson(), meta: META }, headers));
    await call(savesHandler, req('POST', { action: 'save', slot: 1, json: saveJson(), meta: META }, headers));
    assert.equal(fake.t.careers.length, 1);
  });

  test('REGRESSÃO: apagar o slot 1 não desloca nem sobrescreve o slot 2', async () => {
    const { headers } = login(fake.t);
    await call(savesHandler, req('POST', { action: 'save', slot: 1, json: saveJson(), meta: META }, headers));
    await call(savesHandler, req('POST', { action: 'save', slot: 2, json: saveJson({ cid: 0, dbid: '100' }), meta: { ...META, clube: 'Clube A' } }, headers));
    const del = await call(savesHandler, req('POST', { action: 'delete', slot: 1 }, headers));
    assert.equal(del.statusCode, 200);

    const lista = await call(savesHandler, req('POST', { action: 'list' }, headers));
    assert.equal(lista.body.slots[0], null);
    assert.equal(lista.body.slots[1].meta.clube, 'Clube A');

    // novo jogo no slot 1 livre não pode tocar no slot 2
    await call(savesHandler, req('POST', { action: 'save', slot: 1, json: saveJson(), meta: META }, headers));
    const load2 = await call(savesHandler, req('POST', { action: 'load', slot: 2 }, headers));
    assert.equal(JSON.parse(load2.body.json).cl[0].dbid, '100');
    assert.equal(fake.t.careers.length, 2);
  });

  test('carregar / apagar slot vazio devolve 404', async () => {
    const { headers } = login(fake.t);
    assert.equal((await call(savesHandler, req('POST', { action: 'load', slot: 3 }, headers))).statusCode, 404);
    assert.equal((await call(savesHandler, req('POST', { action: 'delete', slot: 3 }, headers))).statusCode, 404);
  });

  test('slot fora do intervalo é limitado a 1–3', async () => {
    const { headers } = login(fake.t);
    await call(savesHandler, req('POST', { action: 'save', slot: 9, json: saveJson(), meta: META }, headers));
    assert.equal(fake.t.careers[0].slot, 3);
  });

  test('saves de um usuário não aparecem para outro', async () => {
    const a = login(fake.t, 'a@exemplo.com');
    const b = login(fake.t, 'b@exemplo.com');
    await call(savesHandler, req('POST', { action: 'save', slot: 1, json: saveJson(), meta: META }, a.headers));
    const r = await call(savesHandler, req('POST', { action: 'list' }, b.headers));
    assert.deepEqual(r.body.slots, [null, null, null]);
  });

  test('erro interno devolve mensagem genérica, sem vazar detalhes', async () => {
    const { headers } = login(fake.t);
    fake.t.fail = /FROM careers/;
    const r = await call(savesHandler, req('POST', { action: 'list' }, headers));
    assert.equal(r.statusCode, 500);
    assert.equal(r.body.erro, 'Erro interno do servidor.');
    assert.ok(!JSON.stringify(r.body).includes('segredo'));
  });
});

/* ------------------------------------------------------------------ *
 * /api/auth
 * ------------------------------------------------------------------ */
describe('auth', () => {
  let emails;
  beforeEach(() => {
    emails = [];
    globalThis.fetch = async (url, opts) => {
      emails.push(JSON.parse(opts.body));
      return { ok: true };
    };
  });
  const codigoDoUltimoEmail = () => emails.at(-1).text.match(/\d{6}/)[0];
  const send = (email, headers = {}) => call(authHandler, req('POST', { action: 'send', email }, headers));
  const verify = (email, code) => call(authHandler, req('POST', { action: 'verify', email, code }));
  const passaTempo = (ms) => { fake.t.codes.forEach((c) => { c.at -= ms; }); };

  test('só aceita POST', async () => {
    assert.equal((await call(authHandler, req('GET'))).statusCode, 405);
  });

  test('e-mail inválido e ação inválida devolvem 400', async () => {
    assert.equal((await send('isso-nao-e-email')).statusCode, 400);
    assert.equal((await call(authHandler, req('POST', { action: 'xyz', email: 'a@b.com' }))).statusCode, 400);
  });

  test('fluxo completo: envia código, valida e cria sessão utilizável', async () => {
    assert.equal((await send('Tec@Exemplo.com')).statusCode, 200);
    assert.equal(emails[0].to[0], 'tec@exemplo.com');
    const r = await verify('tec@exemplo.com', codigoDoUltimoEmail());
    assert.equal(r.statusCode, 200);
    assert.ok(r.body.token);
    const lista = await call(savesHandler, req('POST', { action: 'list' }, { authorization: 'Bearer ' + r.body.token }));
    assert.equal(lista.statusCode, 200);
  });

  test('código só vale uma vez', async () => {
    await send('a@exemplo.com');
    const c = codigoDoUltimoEmail();
    assert.equal((await verify('a@exemplo.com', c)).statusCode, 200);
    assert.equal((await verify('a@exemplo.com', c)).statusCode, 400);
  });

  test('código incorreto devolve mensagem clara e é bloqueado após 5 erros', async () => {
    await send('a@exemplo.com');
    const certo = codigoDoUltimoEmail();
    const errado = certo === '000000' ? '111111' : '000000';
    const r = await verify('a@exemplo.com', errado);
    assert.equal(r.body.erro, 'Código incorreto.');
    for (let i = 0; i < 4; i++) await verify('a@exemplo.com', errado);
    const depois = await verify('a@exemplo.com', certo);
    assert.equal(depois.statusCode, 400, 'após 5 erros nem o código certo vale');
  });

  test('verify não cria usuário para e-mail desconhecido', async () => {
    const r = await verify('fantasma@exemplo.com', '123456');
    assert.equal(r.statusCode, 400);
    assert.equal(fake.t.users.length, 0);
  });

  test('rate limit: segundo pedido em menos de 1 minuto devolve 429', async () => {
    assert.equal((await send('a@exemplo.com')).statusCode, 200);
    const r = await send('a@exemplo.com');
    assert.equal(r.statusCode, 429);
    assert.equal(emails.length, 1, 'não deve enviar o segundo e-mail');
  });

  test('rate limit: no máximo 5 códigos por hora por e-mail', async () => {
    for (let i = 0; i < 5; i++) {
      assert.equal((await send('a@exemplo.com', { 'x-forwarded-for': '10.0.0.' + i })).statusCode, 200);
      passaTempo(61e3);
    }
    assert.equal((await send('a@exemplo.com', { 'x-forwarded-for': '10.0.0.99' })).statusCode, 429);
  });

  test('rate limit: no máximo 10 pedidos por hora por IP', async () => {
    const ip = { 'x-forwarded-for': '203.0.113.7' };
    for (let i = 0; i < 10; i++) assert.equal((await send(`u${i}@exemplo.com`, ip)).statusCode, 200);
    assert.equal((await send('u11@exemplo.com', ip)).statusCode, 429);
  });

  test('falha da Resend devolve 502 sem estourar', async () => {
    globalThis.fetch = async () => ({ ok: false });
    assert.equal((await send('a@exemplo.com')).statusCode, 502);
  });

  test('logout invalida a sessão no servidor', async () => {
    await send('a@exemplo.com');
    const { body } = await verify('a@exemplo.com', codigoDoUltimoEmail());
    const headers = { authorization: 'Bearer ' + body.token };
    assert.equal((await call(authHandler, req('POST', { action: 'logout' }, headers))).statusCode, 200);
    assert.equal((await call(savesHandler, req('POST', { action: 'list' }, headers))).statusCode, 401);
  });
});

/* ------------------------------------------------------------------ *
 * /api/catalog, /api/world, /api/health
 * ------------------------------------------------------------------ */
describe('catalog / world / health', () => {
  test('catalog exige login e rejeita entidade inválida', async () => {
    assert.equal((await call(catalogHandler, req('GET', {}, {}, '/api/catalog'))).statusCode, 401);
    const { headers } = login(fake.t);
    const r = await call(catalogHandler, req('GET', {}, headers, '/api/catalog?entity=segredos'));
    assert.equal(r.statusCode, 400);
  });

  test('catalog de ligas informa a quantidade de clubes de cada liga', async () => {
    const { headers } = login(fake.t);
    const r = await call(catalogHandler, req('GET', {}, headers, '/api/catalog?entity=leagues'));
    assert.equal(r.statusCode, 200);
    assert.match(fake.t.lastQuery, /AS quantidade/);
  });

  test('catalog: contrato com o front (chaves leagues/clubs, total, limit, offset)', async () => {
    const { headers } = login(fake.t);
    fake.t.catalogRows = [{ id: '14', nome: 'Brasileirão Série A', quantidade: 20 }];
    fake.t.catalogTotal = 1;
    const r = await call(catalogHandler, req('GET', {}, headers, '/api/catalog?entity=leagues&comClubes=1&limit=500'));
    assert.equal(r.body.ok, true);
    assert.equal(r.body.leagues[0].id, '14');
    assert.equal(r.body.total, 1);
    assert.equal(r.body.limit, 500);
    assert.equal(r.body.offset, 0);
  });

  test('catalog sem entity devolve as ligas', async () => {
    const { headers } = login(fake.t);
    fake.t.catalogRows = [{ id: '1' }];
    const r = await call(catalogHandler, req('GET', {}, headers, '/api/catalog'));
    assert.ok(Array.isArray(r.body.leagues));
  });

  test('catalog de clubes: filtra por liga, pagina e limita o tamanho da página', async () => {
    const { headers } = login(fake.t);
    fake.t.catalogRows = [{ id: '290', nome: 'Corinthians', ligaId: '14' }];
    fake.t.catalogTotal = 20;
    const r = await call(catalogHandler, req('GET', {}, headers, '/api/catalog?entity=clubs&leagueId=14&limit=99999&offset=-3'));
    assert.equal(r.statusCode, 200);
    assert.equal(r.body.clubs.length, 1);
    assert.equal(r.body.total, 20);
    assert.equal(r.body.limit, 500);
    assert.equal(r.body.offset, 0);
    assert.ok(fake.t.clubValues.includes('14'));
    assert.ok(fake.t.clubValues.includes(500));
  });

  test('world limita o tamanho da página a 500 e o offset a >= 0', async () => {
    const { headers } = login(fake.t);
    await call(worldHandler, req('GET', {}, headers, '/api/world?limit=99999&offset=-5'));
    const valores = fake.t.playersValues;
    assert.ok(valores.includes(500));
    assert.ok(valores.includes(0));
  });

  test('health responde ok e não vaza detalhes em caso de erro', async () => {
    assert.deepEqual((await call(healthHandler, req('GET'))).body, { ok: true });
    fake.t.fail = /SELECT 1/;
    const r = await call(healthHandler, req('GET'));
    assert.equal(r.statusCode, 500);
    assert.ok(!JSON.stringify(r.body).includes('segredo'));
  });
});

describe('paginação (utilitário)', () => {
  test('usa padrões, limita o máximo e não aceita offset negativo', () => {
    assert.equal(lerPagina('/x').limit, LIMITE_PADRAO);
    assert.equal(lerPagina('/x?limit=999999').limit, LIMITE_MAXIMO);
    assert.equal(lerPagina('/x?limit=0').limit, LIMITE_PADRAO);
    assert.equal(lerPagina('/x?limit=abc').limit, LIMITE_PADRAO);
    assert.equal(lerPagina('/x?offset=-10').offset, 0);
    assert.equal(lerPagina('/x?offset=40').offset, 40);
  });

  test('busca escapa curingas do ILIKE e limita o tamanho', () => {
    assert.equal(lerPagina('/x?search=100%25_a').like, '%100\\%\\_a%');
    assert.equal(lerPagina('/x?search=' + 'a'.repeat(200)).search.length, 80);
  });
});
