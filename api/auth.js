import { createHash, randomBytes, randomInt } from 'node:crypto';
import { db } from './_lib/db.js';
import { HttpError, sendError } from './_lib/http.js';

const codeLifetimeMs = 10 * 60 * 1000;
const sessionLifetimeMs = 30 * 24 * 60 * 60 * 1000;

// Limites de abuso
const MIN_SECONDS_BETWEEN_CODES = 60;
const MAX_CODES_PER_EMAIL_HOUR = 5;
const MAX_CODES_PER_IP_HOUR = 10;
const MAX_ATTEMPTS_PER_CODE = 5;

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

function emailValue(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) {
    throw new HttpError(400, 'E-mail inválido.');
  }
  return email;
}

function clientIp(request) {
  const forwarded = String(request.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || request.socket?.remoteAddress || 'desconhecido';
}

async function sendCode(email, code) {
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) {
    throw new Error('RESEND_API_KEY e MAIL_FROM precisam ser configuradas.');
  }

  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to: [email],
      subject: 'Seu acesso ao Projeto Manager',
      text: `Seu código de acesso é ${code}. Ele expira em 10 minutos.`
    })
  });

  if (!result.ok) throw new HttpError(502, 'Não foi possível enviar o código de acesso.');
}

/** Remove códigos, sessões e registros de IP vencidos (limpeza oportunista). */
async function cleanup(sql) {
  await sql`DELETE FROM auth_codes WHERE expires_at < now() - interval '1 day'`;
  await sql`DELETE FROM sessions WHERE expires_at < now()`;
  await sql`DELETE FROM auth_requests WHERE created_at < now() - interval '1 day'`;
}

async function handleSend(sql, request, body) {
  const email = emailValue(body.email);
  const ipHash = hash(clientIp(request));

  const ipCount = await sql`
    SELECT COUNT(*)::int AS n FROM auth_requests
    WHERE ip_hash = ${ipHash} AND created_at > now() - interval '1 hour'
  `;
  if (ipCount[0].n >= MAX_CODES_PER_IP_HOUR) {
    throw new HttpError(429, 'Muitas tentativas. Aguarde um pouco e tente novamente.');
  }

  const users = await sql`
    INSERT INTO users (email) VALUES (${email})
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING id, email
  `;
  const user = users[0];

  const recent = await sql`
    SELECT COUNT(*)::int AS n,
           COALESCE(MAX(EXTRACT(EPOCH FROM (now() - created_at))), 999999) AS segundos
    FROM auth_codes
    WHERE user_id = ${user.id} AND created_at > now() - interval '1 hour'
  `;
  if (Number(recent[0].segundos) < MIN_SECONDS_BETWEEN_CODES) {
    throw new HttpError(429, 'Aguarde 1 minuto antes de pedir outro código.');
  }
  if (recent[0].n >= MAX_CODES_PER_EMAIL_HOUR) {
    throw new HttpError(429, 'Limite de códigos por hora atingido. Tente mais tarde.');
  }

  const code = String(randomInt(0, 1000000)).padStart(6, '0');
  await sql`INSERT INTO auth_requests (ip_hash) VALUES (${ipHash})`;
  await sql`
    INSERT INTO auth_codes (user_id, code_hash, expires_at)
    VALUES (${user.id}, ${hash(code)}, ${new Date(Date.now() + codeLifetimeMs).toISOString()})
  `;
  await sendCode(email, code);
  await cleanup(sql);
  return { ok: true };
}

async function handleVerify(sql, body) {
  const email = emailValue(body.email);
  const code = String(body.code || '').trim();
  if (!/^\d{6}$/.test(code)) throw new HttpError(400, 'Código inválido.');

  // verify nunca cria usuário: só existe quem já pediu um código.
  const users = await sql`SELECT id, email FROM users WHERE email = ${email} LIMIT 1`;
  const user = users[0];
  if (!user) throw new HttpError(400, 'Código expirado ou inexistente.');

  const rows = await sql`
    SELECT id FROM auth_codes
    WHERE user_id = ${user.id} AND used_at IS NULL
      AND expires_at > now() AND attempts < ${MAX_ATTEMPTS_PER_CODE}
    ORDER BY created_at DESC LIMIT 1
  `;
  if (!rows[0]) throw new HttpError(400, 'Código expirado ou inexistente.');

  const match = await sql`
    UPDATE auth_codes SET used_at = now()
    WHERE id = ${rows[0].id} AND code_hash = ${hash(code)}
    RETURNING id
  `;
  if (!match[0]) {
    await sql`UPDATE auth_codes SET attempts = attempts + 1 WHERE id = ${rows[0].id}`;
    throw new HttpError(400, 'Código incorreto.');
  }

  const token = randomBytes(32).toString('hex');
  await sql`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (${user.id}, ${hash(token)}, ${new Date(Date.now() + sessionLifetimeMs).toISOString()})
  `;
  return { ok: true, token, email: user.email };
}

async function handleLogout(sql, request) {
  const match = String(request.headers?.authorization || '').match(/^Bearer\s+(.+)$/i);
  if (match) {
    await sql`DELETE FROM sessions WHERE token_hash = ${hash(match[1].trim())}`;
  }
  return { ok: true };
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, erro: 'Método não permitido.' });
  }

  try {
    const body = request.body || {};
    const sql = db();
    const action = String(body.action || '');

    if (action === 'send') return response.status(200).json(await handleSend(sql, request, body));
    if (action === 'verify') return response.status(200).json(await handleVerify(sql, body));
    if (action === 'logout') return response.status(200).json(await handleLogout(sql, request));

    throw new HttpError(400, 'Ação de autenticação inválida.');
  } catch (error) {
    return sendError(response, error);
  }
}
