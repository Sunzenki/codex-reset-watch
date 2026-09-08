import { expiredSessionCookieHeader, requireAdmin } from '../../_lib/admin.js';

export async function onRequestPost({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  return Response.json({ ok: true }, { headers: { 'cache-control': 'no-store', 'set-cookie': expiredSessionCookieHeader(request) } });
}
