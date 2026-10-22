/**
 * Teste de fumaça do front-end: carrega o index.html e os scripts reais num navegador simulado (jsdom)
 * e percorre "Nova carreira" contra uma API simulada que segue o contrato real de /api/catalog.
 * O Apps Script (PMUI.carregar, "mundo" do motor) fica de fora e é substituído por um stub.
 */
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chamadas = [];
const erros = [];
let w, d;

const clubes = [
  { id: '290', ligaId: '14', nome: 'Corinthians', pais: 'Brasil', escudo: '', reputacao: '50' },
  { id: '294', ligaId: '14', nome: 'CR Flamengo', pais: 'Brasil', escudo: '', reputacao: '50' },
  { id: '300', ligaId: '14', nome: 'Palmeiras', pais: 'Brasil', escudo: '', reputacao: '50' }
];
const resp = (corpo, status = 200) => ({ ok: status < 400, status, json: async () => corpo });
const fakeFetch = async (url) => {
  const u = String(url);
  chamadas.push(u);
  if (u.startsWith('/api/saves')) return resp({ ok: true, slots: [null, null, null] });
  if (u.includes('entity=leagues')) {
    return resp({ ok: true, leagues: [{ id: '14', nome: 'Brasileirão Série A', pais: 'Brasil', temporada: null, logo: '', quantidade: 3 }], total: 1, limit: 500, offset: 0 });
  }
  if (u.includes('entity=clubs') && u.includes('leagueId=14')) {
    return resp({ ok: true, clubs: clubes, total: 3, limit: 100, offset: 0 });
  }
  return resp({ ok: false, erro: 'rota inesperada ' + u }, 404);
};
const esperar = async (cond, ms = 4000) => {
  const ini = Date.now();
  while (!cond()) {
    if (Date.now() - ini > ms) return false;
    await new Promise((r) => setTimeout(r, 25));
  }
  return true;
};

describe('front-end: nova carreira com catálogo paginado', () => {
  before(async () => {
    const vc = new VirtualConsole();
    vc.on('jsdomError', (e) => {
      if (!/Could not load|Not implemented|net::|ENOTFOUND|EAI_AGAIN/i.test(String(e.message))) erros.push(e.message);
    });
    const html = readFileSync(resolve(raiz, 'index.html'), 'utf8').replace(/<script[^>]*><\/script>/g, '');
    const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc });
    w = dom.window; d = w.document;
    w.localStorage.setItem('pm_tok', 'tok');
    w.localStorage.setItem('pm_mail', 'a@b.com');
    w.fetch = fakeFetch;
    w.scrollTo = () => {};
    for (const f of ['js/config.js', 'js/eventos.js', 'js/pm-motor.js', 'js/pm-ui.js', 'js/match.js', 'js/app.js']) {
      try { w.eval(readFileSync(resolve(raiz, f), 'utf8')); } catch (e) { erros.push(f + ': ' + e.message); }
    }
    w.PMUI.carregar = () => Promise.resolve();
  });
  after(() => w && w.close());

  test('entra logado, lista os slots e mostra a tela inicial', async () => {
    assert.ok(await esperar(() => d.getElementById('t-inicio').className.includes('on')));
    assert.ok(chamadas.some((c) => c.startsWith('/api/saves')));
  });

  test('"Novo jogo" pede só ligas com clubes, em uma página', async () => {
    d.getElementById('i-novo').click();
    assert.ok(await esperar(() => chamadas.includes('/api/catalog?entity=leagues&comClubes=1&limit=500')), chamadas.join(' | '));
    assert.ok(await esperar(() => /3 clubes/.test(d.getElementById('ligas').textContent)));
    assert.ok(!/null|undefined/.test(d.getElementById('ligas').textContent));
  });

  test('busca os clubes da liga com limit/offset e lista todos', async () => {
    assert.ok(await esperar(() => chamadas.includes('/api/catalog?entity=clubs&leagueId=14&limit=100&offset=0')), chamadas.join(' | '));
    assert.ok(await esperar(() => d.getElementById('clubes').children.length === 3));
    assert.ok(!/null|undefined|Temporada/.test(d.getElementById('subtitulo-liga').textContent));
  });

  test('cards de clube são acessíveis e o Enter seleciona o clube', async () => {
    const cards = [...d.getElementById('clubes').children];
    assert.ok(cards.every((c) => c.getAttribute('role') === 'button' && c.getAttribute('tabindex') === '0'));
    cards[1].dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    assert.ok(await esperar(() => !d.getElementById('b-ini').disabled && /CR Flamengo/.test(d.getElementById('det').textContent)));
  });

  test('reabrir a mesma liga usa o cache (não repete a chamada)', async () => {
    d.getElementById('b-voltaligas').click();
    d.querySelector('[data-liga="14"]').click();
    assert.ok(await esperar(() => d.getElementById('clubes').children.length === 3));
    assert.equal(chamadas.filter((c) => c.includes('entity=clubs')).length, 1);
  });

  test('nenhum erro de script durante o fluxo', () => {
    assert.deepEqual(erros, []);
  });
});
