import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (f) => readFileSync(resolve(raiz, f), 'utf8');
const manifest = JSON.parse(ler('manifest.webmanifest'));

/** largura e altura de um PNG lidas do cabeçalho (IHDR). */
function dimensoesPng(arquivo) {
  const b = readFileSync(resolve(raiz, arquivo));
  assert.equal(b.subarray(1, 4).toString(), 'PNG', arquivo + ' não é PNG');
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

describe('manifest', () => {
  test('tem os campos exigidos para instalação', () => {
    for (const campo of ['name', 'short_name', 'start_url', 'display', 'icons', 'theme_color', 'background_color']) {
      assert.ok(manifest[campo], 'falta ' + campo);
    }
    assert.equal(manifest.display, 'standalone');
    assert.ok(manifest.short_name.length <= 12, 'short_name deve ter até 12 caracteres');
  });

  test('ícones existem, têm o tamanho declarado, e há 192, 512 e maskable', () => {
    for (const ic of manifest.icons.filter((i) => i.type === 'image/png')) {
      assert.ok(existsSync(resolve(raiz, ic.src)), ic.src + ' não existe');
      const [w, h] = ic.sizes.split('x').map(Number);
      assert.deepEqual(dimensoesPng(ic.src), [w, h], ic.src);
    }
    const tem = (tam, uso) => manifest.icons.some((i) => i.sizes === tam && i.purpose === uso);
    assert.ok(tem('192x192', 'any') && tem('512x512', 'any') && tem('512x512', 'maskable'));
  });

  test('index.html liga o manifest e usa ícone PNG da Apple', () => {
    const html = ler('index.html');
    assert.match(html, /<link rel="manifest" href="manifest\.webmanifest">/);
    assert.match(html, /rel="apple-touch-icon" href="assets\/icons\/apple-touch-icon\.png"/);
    assert.ok(existsSync(resolve(raiz, 'assets/icons/apple-touch-icon.png')));
  });

  test('app.js registra o service worker', () => {
    assert.match(ler('js/app.js'), /serviceWorker\.register\('sw\.js'\)/);
  });

  test('vercel.json serve sw.js sem cache e o manifest com o tipo certo', () => {
    const v = JSON.parse(ler('vercel.json'));
    const h = (src) => Object.fromEntries(v.headers.find((x) => x.source === src).headers.map((k) => [k.key, k.value]));
    assert.equal(h('/sw.js')['Cache-Control'], 'no-cache');
    assert.equal(h('/manifest.webmanifest')['Content-Type'], 'application/manifest+json');
  });
});

describe('service worker (ambiente simulado)', () => {
  const ORIGEM = 'https://app.test';
  const handlers = {};
  const lojas = new Map(); // nome do cache -> Map(caminho -> Response)
  let online = true;
  let buscas = 0;

  const caminho = (k) => new URL(typeof k === 'string' ? k : k.url, ORIGEM + '/').pathname;
  const fakeCache = (nome) => {
    if (!lojas.has(nome)) lojas.set(nome, new Map());
    const m = lojas.get(nome);
    return {
      async add(url) { const r = await globalThis.fetch(new Request(new URL(url, ORIGEM + '/'))); m.set(caminho(url), r); },
      async put(req, res) { m.set(caminho(req), res); },
      async match(req) { return m.get(caminho(req)); }
    };
  };

  globalThis.self = {
    location: { origin: ORIGEM },
    addEventListener: (tipo, fn) => { handlers[tipo] = fn; },
    skipWaiting: async () => {},
    clients: { claim: async () => {} }
  };
  globalThis.caches = {
    open: async (n) => fakeCache(n),
    keys: async () => [...lojas.keys()],
    delete: async (n) => lojas.delete(n)
  };
  globalThis.fetch = async (req) => {
    buscas++;
    if (!online) throw new Error('sem rede');
    const r = new Response('conteudo de ' + caminho(req), { status: 200 });
    Object.defineProperty(r, 'type', { value: 'basic' });
    return r;
  };
  const evento = (req) => {
    const e = { request: req, resposta: null, respondWith(p) { e.resposta = p; }, waitUntil(p) { e.espera = p; } };
    return e;
  };
  const pedido = (url, opts = {}) => new Request(url, opts);

  test('lista de arquivos do shell existe no disco', async () => {
    const fonte = ler('sw.js');
    const lista = [...fonte.match(/const SHELL = \[([\s\S]*?)\];/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    assert.ok(lista.length > 8);
    for (const f of lista) {
      if (f === './') continue;
      assert.ok(existsSync(resolve(raiz, f)), 'shell referencia arquivo inexistente: ' + f);
    }
  });

  test('instalação pré-carrega o shell; ativação remove caches antigos (só os pm-)', async () => {
    await import('../sw.js');
    lojas.set('pm-v0', new Map());
    lojas.set('outro-app', new Map());
    const inst = evento(); await handlers.install(inst); await inst.espera;
    assert.ok(lojas.get('pm-v1').has('/index.html'));
    assert.ok(lojas.get('pm-v1').has('/js/app.js'));
    const ativ = evento(); await handlers.activate(ativ); await ativ.espera;
    assert.ok(!lojas.has('pm-v0'), 'cache antigo deveria ser apagado');
    assert.ok(lojas.has('outro-app'), 'não pode apagar cache de outro app');
    assert.ok(lojas.has('pm-v1'));
  });

  test('não intercepta /api/*, POST nem outros domínios', () => {
    for (const req of [
      pedido(ORIGEM + '/api/saves'),
      pedido(ORIGEM + '/api/catalog?entity=leagues'),
      pedido(ORIGEM + '/js/app.js', { method: 'POST', body: 'x' }),
      pedido('https://fonts.googleapis.com/css2?family=Inter')
    ]) {
      const e = evento(req); handlers.fetch(e);
      assert.equal(e.resposta, null, 'não deveria responder: ' + req.url);
    }
  });

  test('online: devolve a versão da rede e atualiza o cache', async () => {
    online = true;
    const e = evento(pedido(ORIGEM + '/js/match.js')); handlers.fetch(e);
    const r = await e.resposta;
    assert.equal(await r.text(), 'conteudo de /js/match.js');
    assert.ok(lojas.get('pm-v1').has('/js/match.js'));
  });

  test('offline: serve do cache e, em navegação desconhecida, devolve o index.html', async () => {
    online = false;
    const e1 = evento(pedido(ORIGEM + '/css/style.css')); handlers.fetch(e1);
    assert.equal(await (await e1.resposta).text(), 'conteudo de /css/style.css');

    const nav = pedido(ORIGEM + '/partida/123');
    Object.defineProperty(nav, 'mode', { value: 'navigate' });
    const e2 = evento(nav); handlers.fetch(e2);
    assert.equal(await (await e2.resposta).text(), 'conteudo de /index.html');
  });

  test('offline e sem cache: falha de rede em vez de quebrar', async () => {
    online = false;
    const e = evento(pedido(ORIGEM + '/arquivo-que-nunca-existiu.js')); handlers.fetch(e);
    const r = await e.resposta;
    assert.equal(r.type, 'error');
  });
});
