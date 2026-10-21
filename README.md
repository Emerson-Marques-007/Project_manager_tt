# Projeto Manager

Simulador de carreira de treinador de futebol (estilo Brasfoot) em HTML, CSS e JavaScript, com API serverless na Vercel e banco Postgres no Neon.

## Como as partes se encaixam

```text
Navegador (index.html + js/*)
   ├── /api/auth     login por código de 6 dígitos (e-mail via Resend), logout
   ├── /api/saves    3 slots de carreira por usuário (listar, carregar, salvar, apagar)
   ├── /api/catalog  ligas, clubes, competições, estádios e dirigentes (Neon)
   ├── /api/world    jogadores paginados (Neon)
   └── Apps Script   ⚠ ainda fornece o "mundo" do motor (jogadores/clubes da planilha) via { acao: 'mundo' }
```

> **Dependência pendente:** `PMUI.carregar()` (js/pm-ui.js) ainda chama o Google Apps Script configurado em `js/config.js` para carregar os dados-base do motor. Enquanto isso não for migrado para o Neon, o Apps Script precisa continuar publicado.

## Estrutura

```text
index.html            telas (login, menu, slots, nova carreira, jogo)
css/style.css         estilos
js/config.js          URL do Apps Script e rota do catálogo
js/app.js             login, slots, catálogo, criação de carreira, salvamento
js/pm-motor.js        motor do mundo: mercado, contratos, janelas, IA dos clubes
js/pm-ui.js           telas de mercado, negociação, contratos e ofertas
js/match.js           calendário, tática, partida, elenco, ingressos
js/eventos.js         eventos de diretoria e de bilheteria
api/                  funções serverless (auth, saves, catalog, world, health) e api/_lib
db/                   schema.sql e migrações 001–005
scripts/              seed-soccerwiki.mjs
test/                 testes dos handlers (node --test)
```

## Configuração

1. Instale o Node.js 20 ou superior e rode `npm install`.
2. Crie um banco no Neon e copie `.env.example` para `.env`, preenchendo:
   - `DATABASE_URL` (string de conexão do Neon);
   - `RESEND_API_KEY` e `MAIL_FROM` (envio do código de login).
   Configure as mesmas variáveis no projeto da Vercel.
3. No SQL Editor do Neon, execute **nesta ordem**: `db/schema.sql`, `db/migration-001-source-payload.sql`, `db/migration-002-gameplay-relations.sql`, `db/migration-003-auth.sql`, `db/migration-004-career-slots.sql`, `db/migration-005-auth-rate-limit.sql`.
4. Importe o catálogo: `npm run seed:soccerwiki -- caminho/arquivo.json` (importa ligas e clubes).
5. Rode localmente com `npm run dev` (Vercel CLI) e abra o endereço exibido.

O formato esperado para dados de elenco, contratos, temporadas, competições e finanças está em `db/gameplay-data.example.json` (as tabelas já existem, mas o jogo ainda não as consome).

## API

| Rota | Método | Descrição |
| --- | --- | --- |
| `/api/health` | GET | Verifica a conexão com o Neon. |
| `/api/auth` | POST | `{action:"send", email}` envia o código; `{action:"verify", email, code}` devolve `{token}`; `{action:"logout"}` (com Bearer) encerra a sessão. |
| `/api/saves` | POST | `{action:"list"|"load"|"save"|"delete", slot:1..3, json, meta}`. Exige `Authorization: Bearer <token>`. |
| `/api/catalog` | GET | Catálogo completo ou `?entity=leagues|clubs|competitions|stadiums|managers`. |
| `/api/world` | GET | `?search=Silva&limit=100&offset=0` (limite máx. 500). |

Todas as rotas, exceto `health` e `auth`, exigem token. Erros inesperados devolvem `500` com mensagem genérica (o detalhe fica só no log da Vercel).

### Segurança do login

- Código de 6 dígitos, válido por 10 minutos, no máximo 5 tentativas por código.
- Limites de envio: 1 código por minuto e 5 por hora por e-mail, e 10 por hora por IP (guardado só como hash).
- Sessão de 30 dias; o botão "Sair" invalida a sessão também no servidor.
- Códigos, sessões e registros vencidos são removidos automaticamente.

### Saves

Cada usuário tem até 3 carreiras, identificadas pela coluna `slot` (índice único por usuário e slot). O save guarda o JSON completo do jogo em `careers.state`; o clube é ligado ao catálogo pelo `dbid` presente em `state.cl[cid]`.

## Testes

```bash
npm test
```

Os testes importam os handlers reais e usam um banco em memória (`setDb`) e um mock da Resend, sem tocar em serviços externos.

## Observações

- A imagem do menu inicial fica em `assets/estadio.jpg`; para trocá-la, substitua o arquivo mantendo o nome.
- O logo e alguns escudos são carregados de URLs externas (Google Drive e fontes do catálogo).
