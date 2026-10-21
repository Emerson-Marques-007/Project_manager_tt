/**
 * Vincula clubes às ligas (clubs.league_id) a partir da aba de clubes da planilha.
 *
 * Uso:
 *   npm run link:clubes-ligas -- clubes.csv            (grava no Neon)
 *   npm run link:clubes-ligas -- clubes.csv --simular  (só mostra o resumo, sem banco)
 *
 * O arquivo do SoccerWiki não traz a liga de cada clube; essa informação está na planilha.
 * Exporte a aba de clubes em CSV (Arquivo > Fazer download > Valores separados por vírgula).
 */
import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
import { lerVinculos } from './lib/clubes-ligas.mjs';

const args = process.argv.slice(2);
const simular = args.includes('--simular');
const file = args.find((a) => !a.startsWith('--'));

if (!file) {
  throw new Error('Informe o CSV: npm run link:clubes-ligas -- clubes.csv [--simular]');
}

const { vinculos, ignoradas, modo } = lerVinculos(await readFile(file, 'utf8'));
const ligasDistintas = new Set(vinculos.map((v) => v.ligaId)).size;
console.log(`Leitura ${modo}: ${vinculos.length} clubes, ${ligasDistintas} ligas, ${ignoradas} linhas ignoradas (sem id válido).`);

if (simular) {
  console.log('Modo --simular: nada foi gravado.');
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurada.');
}
const sql = neon(process.env.DATABASE_URL);
const BATCH_SIZE = 1000;

let atualizados = 0;
for (let i = 0; i < vinculos.length; i += BATCH_SIZE) {
  const payload = JSON.stringify(vinculos.slice(i, i + BATCH_SIZE).map((v) => ({
    clube_id: v.clubeId, liga_id: v.ligaId, pais: v.pais
  })));
  const rows = await sql`
    UPDATE clubs c
    SET league_id = v.liga_id,
        country = COALESCE(NULLIF(v.pais, ''), c.country)
    FROM jsonb_to_recordset(${payload}::jsonb) AS v(clube_id text, liga_id text, pais text)
    WHERE c.id = v.clube_id
      AND EXISTS (SELECT 1 FROM leagues l WHERE l.id = v.liga_id)
    RETURNING c.id
  `;
  atualizados += rows.length;
}

// País da liga = país mais frequente entre os clubes vinculados (só onde ainda está vazio).
await sql`
  UPDATE leagues l
  SET country = s.pais
  FROM (
    SELECT league_id, MODE() WITHIN GROUP (ORDER BY country) AS pais
    FROM clubs
    WHERE league_id IS NOT NULL AND country IS NOT NULL AND country <> ''
    GROUP BY league_id
  ) s
  WHERE l.id = s.league_id AND (l.country IS NULL OR l.country = '')
`;

console.log(`Vinculados: ${atualizados} de ${vinculos.length}.`);
if (atualizados < vinculos.length) {
  console.log(`${vinculos.length - atualizados} clubes/ligas do CSV não existem no Neon (rode antes o seed do SoccerWiki).`);
}
