/* Service worker do Projeto Manager.
 * - Pré-carrega o "shell" do app para abrir e ser instalável mesmo sem rede.
 * - Estratégia "rede primeiro, cache como reserva": quem está online sempre recebe a versão nova
 *   do código; offline, o shell abre do cache. O jogo em si exige internet (login, saves e catálogo).
 * - Nunca intercepta /api/* (tokens e saves) nem requisições de outros domínios.
 * Para forçar atualização do cache, aumente VERSAO.
 */
const VERSAO = 'pm-v1';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/config.js',
  'js/eventos.js',
  'js/pm-motor.js',
  'js/pm-ui.js',
  'js/match.js',
  'js/app.js',
  'assets/favicon.svg',
  'assets/estadio.jpg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/icons/apple-touch-icon.png'
];
const TEMPO_REDE_MS = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSAO);
    // um arquivo faltando não pode impedir a instalação
    await Promise.allSettled(SHELL.map((url) => cache.add(url)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const nomes = await caches.keys();
    await Promise.all(nomes.filter((n) => n.startsWith('pm-') && n !== VERSAO).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

function redeComTempo(request) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('tempo esgotado')), TEMPO_REDE_MS);
    fetch(request).then((r) => { clearTimeout(timer); resolve(r); }, (e) => { clearTimeout(timer); reject(e); });
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // fontes, imagens externas etc.: navegador cuida
  if (url.pathname.startsWith('/api/')) return;    // API: nunca em cache

  event.respondWith((async () => {
    const cache = await caches.open(VERSAO);
    try {
      const resposta = await redeComTempo(request);
      if (resposta.ok && resposta.type === 'basic') cache.put(request, resposta.clone());
      return resposta;
    } catch {
      const guardada = await cache.match(request, { ignoreSearch: true });
      if (guardada) return guardada;
      if (request.mode === 'navigate') {
        const index = await cache.match('index.html');
        if (index) return index;
      }
      return Response.error();
    }
  })());
});
