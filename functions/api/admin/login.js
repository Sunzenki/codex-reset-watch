import { clearLoginFailures, createAdminSession, loginRateState, recordLoginFailure, sessionCookieHeader, validCredentials } from '../../_lib/admin.js';
import { json, requireSameOrigin } from '../../_lib/push.js';

export async function onRequestPost({ request, env }) {
  if (!requireSameOrigin(request)) return json({ error: 'Invalid origin' }, 403);
  if (!env.PUSH_ADMIN_USERNAME || !env.PUSH_ADMIN_PASSWORD || !env.PUSH_ADMIN_SESSION_SECRET) return json({ error: 'Admin login is not configured' }, 503);
  const state = await loginRateState(request, env);
  if (state.blocked) return json({ error: 'Too many attempts. Try again in 15 minutes.' }, 429);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!username || username.length > 80 || !password || password.length > 200) return json({ error: 'Invalid credentials' }, 401);
  if (!(await validCredentials(username, password, env))) {
    await recordLoginFailure(env, state);
    return json({ error: 'Invalid credentials' }, 401);
  }
  await clearLoginFailures(env, state.clientHash);
  const session = await createAdminSession(username, env.PUSH_ADMIN_SESSION_SECRET);
  return Response.json({ ok: true }, { headers: { 'cache-control': 'no-store', 'set-cookie': sessionCookieHeader(session, request) } });
}
