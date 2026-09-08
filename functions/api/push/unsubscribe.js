import { json, requireSameOrigin, sha256 } from '../../_lib/push.js';

export async function onRequestPost({ request, env }) {
  if (!requireSameOrigin(request)) return json({ error: 'Origin not allowed' }, 403);
  try {
    const { endpoint, token } = await request.json();
    if (typeof endpoint !== 'string' || typeof token !== 'string') throw new Error('Invalid request');
    const endpointHash = await sha256(endpoint);
    const tokenHash = await sha256(token);
    const result = await env.PUSH_DB.prepare('UPDATE subscriptions SET active = 0, updated_at = ? WHERE endpoint_hash = ? AND unsubscribe_token_hash = ?')
      .bind(new Date().toISOString(), endpointHash, tokenHash).run();
    return json({ ok: Number(result.meta?.changes ?? 0) > 0 });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Invalid request' }, 400);
  }
}
