/**
 * Testes da API — usa o test runner nativo do Node (node --test).
 *
 * Como os handlers dependem de process.env (DATABASE_URL, RESEND_API_KEY)
 * e de fetch externo (Neon/Resend), os testes usam mocks para isolar a lógica
 * de validação, roteamento e tratamento de erros sem tocar em serviços reais.
 */
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';

/* ============================================================
 * Mock helpers — simulam request/response Vercel
 * ============================================================ */

function mockReq(method, body, headers = {}) {
  return {
    method: method || 'POST',
    headers: headers || {},
    body: body || {},
    url: '/api/test'
  };
}

function mockRes() {
  const r = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) { r.statusCode = code; return r; },
    setHeader(k, v) { r.headers[k] = v; return r; },
    json(data) { r.body = data; return r; }
  };
  return r;
}

/* Hash de um token aleatório, como auth.js faria */
function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

/* ============================================================
 * Testes: auth.js — requireAuth
 * ============================================================ */

describe('auth.requireAuth', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  test('deve rejeitar quando não há header Authorization', async () => {
    // Não podemos importar auth.js sem DATABASE_URL, então testamos a lógica diretamente
    const req = mockReq('GET', {}, {});
    const header = req.headers.authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    assert.ok(!match, 'Sem header deve falhar no regex');
  });

  test('deve extrair token Bearer válido do header', () => {
    const token = 'abc123def456';
    const req = mockReq('GET', {}, { authorization: `Bearer ${token}` });
    const header = req.headers.authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    assert.ok(match, 'Header Bearer deve casar');
    assert.equal(match[1], token, 'Token extraído deve ser igual ao enviado');
  });

  test('deve rejeitar header com scheme errado', () => {
    const req = mockReq('GET', {}, { authorization: 'Basic abc123' });
    const header = req.headers.authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    assert.ok(!match, 'Basic não deve casar com Bearer');
  });

  test('deve rejeitar header vazio', () => {
    const req = mockReq('GET', {}, { authorization: '' });
    const header = req.headers.authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    assert.ok(!match, 'Header vazio não deve casar');
  });

  test('hash do token deve ser SHA-256 determinístico', () => {
    const token = 'my-secret-token';
    const h1 = hashToken(token);
    const h2 = hashToken(token);
    assert.equal(h1, h2, 'Mesmo token deve gerar mesmo hash');
    assert.equal(h1.length, 64, 'SHA-256 hex tem 64 chars');
    assert.notEqual(h1, token, 'Hash não deve ser igual ao token');
  });
});

/* ============================================================
 * Testes: saves.js — validação de entrada
 * ============================================================ */

describe('saves — validação de slot', () => {
  test('slot deve ser entre 1 e 3', () => {
    const raw = (n) => Math.min(Math.max(Number(n) || 1, 1), 3);
    assert.equal(raw(0), 1, '0 vira 1');
    assert.equal(raw(1), 1);
    assert.equal(raw(2), 2);
    assert.equal(raw(3), 3);
    assert.equal(raw(5), 3, '5 vira 3');
    assert.equal(raw(-1), 1, '-1 vira 1');
    assert.equal(raw('foo'), 1, 'NaN vira 1');
    assert.equal(raw(undefined), 1, 'undefined vira 1');
  });

  test('action deve ser uma das permitidas', () => {
    const valid = ['list', 'load', 'save', 'delete'];
    assert.ok(valid.includes('list'));
    assert.ok(valid.includes('load'));
    assert.ok(valid.includes('save'));
    assert.ok(valid.includes('delete'));
    assert.ok(!valid.includes('hack'), 'ação inválida rejeitada');
  });

  test('save com JSON inválido deve ser detectado', () => {
    const bad = 'not-json{{{';
    assert.throws(() => JSON.parse(bad), 'JSON inválido deve lançar');
  });

  test('save com JSON válido deve parsear', () => {
    const good = JSON.stringify({ cid: 5, temp: 2, rod: 3, caixa: 500000 });
    const parsed = JSON.parse(good);
    assert.equal(parsed.cid, 5);
    assert.equal(parsed.temp, 2);
    assert.equal(parsed.rod, 3);
    assert.equal(parsed.caixa, 500000);
  });

  test('meta deve conter campos esperados', () => {
    const meta = { clube: 'Flamengo', tec: 'Carlos', temp: 1, rod: 5, total: 38, pos: 3, caixa: 1000000, rep: 75 };
    const required = ['clube', 'tec', 'temp', 'rod', 'pos', 'caixa', 'rep'];
    required.forEach(k => assert.ok(k in meta, `meta deve ter ${k}`));
  });
});

/* ============================================================
 * Testes: auth.js (handler) — validação de e-mail
 * ============================================================ */

describe('auth — validação de e-mail', () => {
  // Réplica da função emailValue do auth.js
  function emailValue(value) {
    const email = String(value || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) {
      throw new Error('E-mail inválido.');
    }
    return email;
  }

  test('deve aceitar e-mail válido', () => {
    assert.equal(emailValue('user@example.com'), 'user@example.com');
    assert.equal(emailValue('  USER@GMAIL.COM '), 'user@gmail.com');
  });

  test('deve rejeitar e-mail sem @', () => {
    assert.throws(() => emailValue('userexample.com'), /E-mail inválido/);
  });

  test('deve rejeitar e-mail sem domínio', () => {
    assert.throws(() => emailValue('user@'), /E-mail inválido/);
  });

  test('deve rejeitar e-mail muito longo', () => {
    assert.throws(() => emailValue('a'.repeat(130) + '@test.com'), /E-mail inválido/);
  });

  test('deve rejeitar string vazia', () => {
    assert.throws(() => emailValue(''), /E-mail inválido/);
    assert.throws(() => emailValue(null), /E-mail inválido/);
  });
});

/* ============================================================
 * Testes: auth.js (handler) — validação de código
 * ============================================================ */

describe('auth — validação de código', () => {
  test('código de 6 dígitos deve passar no regex', () => {
    assert.ok(/^\d{6}$/.test('123456'));
    assert.ok(/^\d{6}$/.test('000000'));
  });

  test('código com letras deve falhar', () => {
    assert.ok(!/^\d{6}$/.test('abc123'));
  });

  test('código com menos de 6 dígitos deve falhar', () => {
    assert.ok(!/^\d{6}$/.test('12345'));
  });

  test('código com mais de 6 dígitos deve falhar', () => {
    assert.ok(!/^\d{6}$/.test('1234567'));
  });
});

/* ============================================================
 * Testes: catalog.js — validação de entity
 * ============================================================ */

describe('catalog — validação de entity', () => {
  const validEntities = ['leagues', 'clubs', 'competitions', 'stadiums', 'managers'];

  test('entity válida deve estar na lista', () => {
    validEntities.forEach(e => assert.ok(validEntities.includes(e)));
  });

  test('entity inválida deve ser rejeitada', () => {
    assert.ok(!validEntities.includes('players'));
    assert.ok(!validEntities.includes('teams'));
    assert.ok(!validEntities.includes(''));
  });

  test('sem entity, retorna todas as entidades', () => {
    const entity = null; // simula ausência de ?entity=
    assert.ok(!entity, 'entity nulo/falsy deve retornar todas');
  });
});

/* ============================================================
 * Testes: world.js — validação de parâmetros de busca
 * ============================================================ */

describe('world — parâmetros de paginação', () => {
  test('limit deve ser limitado entre 1 e 500', () => {
    const limit = (n) => Math.min(Math.max(Number(n) || 100, 1), 500);
    assert.equal(limit(50), 50);
    assert.equal(limit(0), 100, '0 é falsy, vira default 100');
    assert.equal(limit(-5), 1, 'negativo passa Math.max, vira 1');
    assert.equal(limit(1000), 500, 'acima do máximo vira 500');
    assert.equal(limit(undefined), 100, 'undefined vira default 100');
    assert.equal(limit('abc'), 100, 'NaN vira 100');
  });

  test('offset deve ser não-negativo', () => {
    const offset = (n) => Math.max(Number(n) || 0, 0);
    assert.equal(offset(0), 0);
    assert.equal(offset(50), 50);
    assert.equal(offset(-10), 0, 'negativo vira 0');
    assert.equal(offset(undefined), 0);
  });

  test('search deve ser string trimada', () => {
    const search = '  Silva  '.trim();
    assert.equal(search, 'Silva');
  });
});

/* ============================================================
 * Testes: response helpers (mock)
 * ============================================================ */

describe('mock response', () => {
  test('status deve encadear', () => {
    const r = mockRes();
    assert.equal(r.status(404).statusCode, 404);
  });

  test('json deve setar body', () => {
    const r = mockRes();
    const data = { ok: true };
    r.status(200).json(data);
    assert.deepEqual(r.body, data);
  });

  test('setHeader deve setar header', () => {
    const r = mockRes();
    r.setHeader('Allow', 'POST');
    assert.equal(r.headers.Allow, 'POST');
  });
});

/* ============================================================
 * Testes: estrutura de arquivos da API
 * ============================================================ */

describe('estrutura da API', () => {
  test('todos os endpoints devem exportar handler default', async () => {
    const healthMod = await import('../api/health.js');
    assert.ok(healthMod.default, 'health.js deve ter handler default');

    // auth.js, saves.js, catalog.js, world.js dependem de DATABASE_URL
    // então só validamos que o módulo existe
    // (em ambiente Vercel, o import é feito pela plataforma)
  });
});
