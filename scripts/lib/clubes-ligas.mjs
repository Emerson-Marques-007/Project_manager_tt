/**
 * Leitura do CSV exportado da aba de clubes da planilha (ID do clube, liga, país).
 * Sem dependências: usado pelo script de vínculo e pelos testes.
 */

/** Interpreta CSV (aspas, "" escapado, CRLF, BOM). Detecta o separador na 1ª linha. */
export function parseCsv(texto) {
  const text = String(texto || '').replace(/^\uFEFF/, '');
  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  const delim = detectDelimiter(firstLine);
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delim) { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      rows.push(row); row = [];
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
}

function detectDelimiter(line) {
  const counts = { ',': 0, ';': 0, '\t': 0 };
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (!quoted && ch in counts) counts[ch]++;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]/g, '');

const ALIASES = {
  clubeId: ['id', 'idclube', 'clubeid', 'clubid', 'idclub', 'clube', 'club'],
  ligaId: ['liga', 'idliga', 'ligaid', 'leagueid', 'idleague', 'league'],
  pais: ['pais', 'country']
};

/** Colunas da aba de clubes quando o CSV vem sem cabeçalho (mesma ordem do motor: CI.ID, CI.LIGA ... CI.PAIS). */
const POSICAO = { clubeId: 0, ligaId: 1, pais: 26 };

function idTexto(v) {
  const n = Number(String(v ?? '').trim().replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? String(Math.trunc(n)) : null;
}

/**
 * Converte o texto do CSV em vínculos { clubeId, ligaId, pais }.
 * Lança erro claro se não achar as colunas de clube e liga.
 */
export function lerVinculos(texto) {
  const rows = parseCsv(texto);
  if (!rows.length) throw new Error('O arquivo CSV está vazio.');

  let idx;
  let dados;
  let modo;
  if (/^\s*\d+([.,]\d+)?\s*$/.test(rows[0][0])) {
    idx = POSICAO; dados = rows; modo = 'posicional (sem cabeçalho)';
  } else {
    const cab = rows[0].map(norm);
    const acha = (chaves) => cab.findIndex((h) => chaves.includes(h));
    idx = { clubeId: acha(ALIASES.clubeId), ligaId: acha(ALIASES.ligaId), pais: acha(ALIASES.pais) };
    if (idx.clubeId < 0 || idx.ligaId < 0) {
      throw new Error(
        'Não encontrei as colunas de clube e de liga. Cabeçalhos lidos: ' + rows[0].join(' | ') +
        '. Use cabeçalhos como "ID" e "LIGA" (e, opcionalmente, "PAIS").'
      );
    }
    dados = rows.slice(1); modo = 'por cabeçalho';
  }

  const vinculos = [];
  const mapa = new Map();
  let ignoradas = 0;
  for (const r of dados) {
    const clubeId = idTexto(r[idx.clubeId]);
    const ligaId = idTexto(r[idx.ligaId]);
    if (!clubeId || !ligaId) { ignoradas++; continue; }
    const pais = idx.pais >= 0 && idx.pais < r.length ? String(r[idx.pais]).trim() : '';
    mapa.set(clubeId, { clubeId, ligaId, pais }); // último valor vence se o clube repetir
  }
  mapa.forEach((v) => vinculos.push(v));
  return { vinculos, ignoradas, modo };
}
