import { json, randomToken, requireSameOrigin, sha256, validateLocale, validateSubscription } from '../../_lib/push.js';

export async function onRequestPost({ request, env }) {
  if (!requireSameOrigin(request)) return json({ error: 'Origin not allowed' }, 403);
  if (Number(request.headers.get('content-length') ?? 0) > 8192) return json({ error: 'Request too large' }, 413);
  try {
    const body = await request.json();
    const subscription = validateSubscription(body.subscription);
    const locale = validateLocale(body.locale);
    const endpointHash = await sha256(subscription.endpoint);
    const existing = await env.PUSH_DB.prepare('SELECT active FROM subscriptions WHERE endpoint_hash = ?').bind(endpointHash).first();
    if (!existing) {
      const count = await env.PUSH_DB.prepare('SELECT COUNT(*) AS total FROM subscriptions WHERE active = 1').first();
      if (Number(count?.total ?? 0) >= 1000) return json({ error: 'Subscription limit reached' }, 503);
    }
    const token = randomToken();
    const tokenHash = await sha256(token);
    const now = new Date().toISOString();
    await env.PUSH_DB.prepare(`INSERT INTO subscriptions
      (endpoint_hash, endpoint, p256dh, auth, locale, unsubscribe_token_hash, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
      ON CONFLICT(endpoint_hash) DO UPDATE SET endpoint=excluded.endpoint, p256dh=excluded.p256dh,
      auth=excluded.auth, locale=excluded.locale, unsubscribe_token_hash=excluded.unsubscribe_token_hash,
      active=1, updated_at=excluded.updated_at`).bind(endpointHash, subscription.endpoint, subscription.p256dh, subscription.auth, locale, tokenHash, now, now).run();
    return json({ ok: true, token }, 201);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Invalid request' }, 400);
  }
}
