import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const file = process.argv[2];

if (!file) {
  throw new Error('Informe o arquivo JSON: npm run seed:soccerwiki -- caminho/arquivo.json');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurada.');
}

const sql = neon(process.env.DATABASE_URL);
const data = JSON.parse(await readFile(file, 'utf8'));

const BATCH_SIZE = 1000;

/** Envia a lista em lotes para não estourar o limite de tamanho da requisição do Neon. */
async function inBatches(items, run) {
  const list = Array.isArray(items) ? items : [];
  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    await run(JSON.stringify(list.slice(i, i + BATCH_SIZE)));
  }
  return list.length;
}

async function seedLeagues() {
  const total = await inBatches(data.LeagueData, (payload) => sql`
    INSERT INTO leagues (id, name, logo_url, source, source_payload)
    SELECT item->>'ID', COALESCE(NULLIF(item->>'Name', ''), 'Liga sem nome'), NULLIF(item->>'ImageURL', ''), 'soccerwiki', item
    FROM jsonb_array_elements(${payload}::jsonb) AS item
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      logo_url = EXCLUDED.logo_url,
      source_payload = EXCLUDED.source_payload
  `);
  console.log(`Leagues: ${total} registros`);
}

async function seedClubs() {
  const total = await inBatches(data.ClubData, (payload) => sql`
    INSERT INTO clubs (id, name, crest_url, source, source_payload)
    SELECT item->>'ID', COALESCE(NULLIF(item->>'Name', ''), 'Clube sem nome'), NULLIF(item->>'ImageURL', ''), 'soccerwiki', item
    FROM jsonb_array_elements(${payload}::jsonb) AS item
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      crest_url = EXCLUDED.crest_url,
      source_payload = EXCLUDED.source_payload
  `);
  console.log(`Clubs: ${total} registros`);
}

async function seedPlayers() {
  const total = await inBatches(data.PlayerData, (payload) => sql`
    INSERT INTO players (id, first_name, last_name, image_url, source, source_payload)
    SELECT item->>'ID', COALESCE(NULLIF(item->>'Forename', ''), 'Jogador'), NULLIF(item->>'Surname', ''), NULLIF(item->>'ImageURL', ''), 'soccerwiki', item
    FROM jsonb_array_elements(${payload}::jsonb) AS item
    ON CONFLICT (id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      image_url = EXCLUDED.image_url,
      source_payload = EXCLUDED.source_payload
  `);
  console.log(`Players: ${total} registros`);
}

async function seedManagers() {
  const total = await inBatches(data.ManagerData, (payload) => sql`
    INSERT INTO managers (id, first_name, last_name, image_url, source, source_payload)
    SELECT item->>'ID', COALESCE(NULLIF(item->>'Forename', ''), 'Dirigente'), NULLIF(item->>'Surname', ''), NULLIF(item->>'ImageURL', ''), 'soccerwiki', item
    FROM jsonb_array_elements(${payload}::jsonb) AS item
    ON CONFLICT (id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      image_url = EXCLUDED.image_url,
      source_payload = EXCLUDED.source_payload
  `);
  console.log(`Managers: ${total} registros`);
}

async function seedCompetitions() {
  const total = await inBatches(data.CupData, (payload) => sql`
    INSERT INTO competitions (id, name, competition_type, logo_url, source, source_payload)
    SELECT item->>'ID', COALESCE(NULLIF(item->>'Name', ''), 'Taça sem nome'), 'cup', NULLIF(item->>'ImageURL', ''), 'soccerwiki', item
    FROM jsonb_array_elements(${payload}::jsonb) AS item
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      logo_url = EXCLUDED.logo_url,
      source_payload = EXCLUDED.source_payload
  `);
  console.log(`Competitions: ${total} registros`);
}

async function seedStadiums() {
  const total = await inBatches(data.StadiumData, (payload) => sql`
    INSERT INTO stadiums (id, name, source_payload)
    SELECT item->>'ID', COALESCE(NULLIF(item->>'Name', ''), 'Estádio sem nome'), item
    FROM jsonb_array_elements(${payload}::jsonb) AS item
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      source_payload = EXCLUDED.source_payload
  `);
  console.log(`Stadiums: ${total} registros`);
}

await seedLeagues();
await seedClubs();
await seedPlayers();
await seedManagers();
await seedCompetitions();
await seedStadiums();

console.log('Carga inicial do SoccerWiki concluída. Próximo passo: vincular clubes às ligas (npm run link:clubes-ligas -- clubes.csv).');