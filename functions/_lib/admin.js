import { json, requireSameOrigin, sha256 } from './push.js';

const encoder = new TextEncoder();
const sessionCookie = 'crw_admin_session';
const sessionSeconds = 4 * 60 * 60;

function base64url(value) {
  const bytes = typeof value === 'string' ? encoder.encode(value) : value;
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

async function sameValue(left, right) {
  if (!left || !right) return false;
  return (await sha256(left)) === (await sha256(right));
}

function cookieValue(request) {
  const cookie = request.headers.get('cookie') ?? '';
  const entry = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${sessionCookie}=`));
  return entry?.slice(sessionCookie.length + 1) ?? '';
}

export function adminConfigured(env) {
  return Boolean(env.PUSH_ADMIN_USERNAME && env.PUSH_ADMIN_PASSWORD && env.PUSH_ADMIN_SESSION_SECRET);
}

export async function createAdminSession(username, secret) {
  const payload = base64url(JSON.stringify({ username, expiresAt: Date.now() + sessionSeconds * 1000 }));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function validAdminSession(request, env) {
  if (!adminConfigured(env)) return false;
  const [payload, signature] = cookieValue(request).split('.');
  if (!payload || !signature || !(await sameValue(signature, await sign(payload, env.PUSH_ADMIN_SESSION_SECRET)))) return false;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(decodeBase64url(payload)));
    return parsed.username === env.PUSH_ADMIN_USERNAME && Number(parsed.expiresAt) > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdmin(request, env, allowBearer = false) {
  if (allowBearer) {
    const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (supplied && env.PUSH_ADMIN_TOKEN && await sameValue(supplied, env.PUSH_ADMIN_TOKEN)) return null;
  }
  if (!requireSameOrigin(request)) return json({ error: 'Invalid origin' }, 403);
  return await validAdminSession(request, env) ? null : json({ error: 'Unauthorized' }, 401);
}

export function sessionCookieHeader(value, request) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${sessionCookie}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionSeconds}${secure}`;
}

export function expiredSessionCookieHeader(request) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${sessionCookie}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export async function loginRateState(request, env) {
  const address = request.headers.get('cf-connecting-ip') || 'local-preview';
  const clientHash = await sha256(`${env.PUSH_ADMIN_SESSION_SECRET}:${address}`);
  const record = await env.PUSH_DB.prepare('SELECT window_started_at, attempts FROM admin_login_attempts WHERE client_hash = ?').bind(clientHash).first();
  const started = record?.window_started_at ? Date.parse(record.window_started_at) : 0;
  const fresh = Date.now() - started < 15 * 60 * 1000;
  return { clientHash, blocked: fresh && Number(record?.attempts ?? 0) >= 5, attempts: fresh ? Number(record?.attempts ?? 0) : 0 };
}

export async function recordLoginFailure(env, state) {
  const now = new Date().toISOString();
  if (state.attempts === 0) {
    await env.PUSH_DB.prepare(`INSERT INTO admin_login_attempts (client_hash, window_started_at, attempts)
      VALUES (?, ?, 1) ON CONFLICT(client_hash) DO UPDATE SET window_started_at = excluded.window_started_at, attempts = 1`)
      .bind(state.clientHash, now).run();
  } else {
    await env.PUSH_DB.prepare('UPDATE admin_login_attempts SET attempts = attempts + 1 WHERE client_hash = ?').bind(state.clientHash).run();
  }
}

export async function clearLoginFailures(env, clientHash) {
  await env.PUSH_DB.prepare('DELETE FROM admin_login_attempts WHERE client_hash = ?').bind(clientHash).run();
}

export async function validCredentials(username, password, env) {
  return adminConfigured(env)
    && await sameValue(username, env.PUSH_ADMIN_USERNAME)
    && await sameValue(password, env.PUSH_ADMIN_PASSWORD);
}
