import webpush from 'web-push';
import { requireAdmin } from '../../_lib/admin.js';
import { json, validateMessage } from '../../_lib/push.js';

export async function onRequestPost({ request, env }) {
  const denied = await requireAdmin(request, env, true);
  if (denied) return denied;
  try {
    const payload = validateMessage(await request.json());
    const now = new Date().toISOString();
    const created = await env.PUSH_DB.prepare('INSERT INTO push_events (event_id, payload_json, created_at) VALUES (?, ?, ?) ON CONFLICT(event_id) DO NOTHING')
      .bind(payload.eventId, JSON.stringify(payload), now).run();
    if (Number(created.meta?.changes ?? 0) > 0) {
      await env.PUSH_DB.prepare(`INSERT INTO push_deliveries (event_id, endpoint_hash, status, updated_at)
        SELECT ?, endpoint_hash, 'pending', ? FROM subscriptions WHERE active = 1`).bind(payload.eventId, now).run();
    }

    const delivery = await env.PUSH_DB.prepare(`SELECT d.endpoint_hash, s.endpoint, s.p256dh, s.auth, s.locale
      FROM push_deliveries d JOIN subscriptions s ON s.endpoint_hash = d.endpoint_hash
      WHERE d.event_id = ? AND d.status = 'pending' ORDER BY s.created_at LIMIT 1`).bind(payload.eventId).first();
    if (!delivery) {
      const summary = await deliverySummary(env.PUSH_DB, payload.eventId);
      return json({ done: true, ...summary });
    }

    await env.PUSH_DB.prepare("UPDATE push_deliveries SET status = 'sending', updated_at = ? WHERE event_id = ? AND endpoint_hash = ? AND status = 'pending'")
      .bind(now, payload.eventId, delivery.endpoint_hash).run();
    const event = await env.PUSH_DB.prepare('SELECT payload_json FROM push_events WHERE event_id = ?').bind(payload.eventId).first();
    const saved = JSON.parse(event.payload_json);
    const localized = saved.messages[delivery.locale] ?? saved.messages.en;
    const requestDetails = webpush.generateRequestDetails({ endpoint: delivery.endpoint, keys: { p256dh: delivery.p256dh, auth: delivery.auth } },
      JSON.stringify({ ...localized, eventId: payload.eventId }), {
        vapidDetails: { subject: env.VAPID_SUBJECT || 'https://crw.warpnav.com', publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY },
        TTL: 300, topic: payload.eventId.slice(0, 32), contentEncoding: 'aes128gcm',
      });
    let status = 0;
    try {
      const response = await fetch(requestDetails.endpoint, { method: 'POST', headers: requestDetails.headers, body: new Uint8Array(requestDetails.body), redirect: 'error', signal: AbortSignal.timeout(10000) });
      status = response.status;
      await response.body?.cancel();
    } catch {
      status = 599;
    }
    const accepted = status === 201 || status === 202;
    await env.PUSH_DB.prepare('UPDATE push_deliveries SET status = ?, response_status = ?, updated_at = ? WHERE event_id = ? AND endpoint_hash = ?')
      .bind(accepted ? 'delivered' : 'failed', status, new Date().toISOString(), payload.eventId, delivery.endpoint_hash).run();
    if (status === 404 || status === 410) {
      await env.PUSH_DB.prepare('UPDATE subscriptions SET active = 0, updated_at = ? WHERE endpoint_hash = ?').bind(new Date().toISOString(), delivery.endpoint_hash).run();
    }
    const summary = await deliverySummary(env.PUSH_DB, payload.eventId);
    return json({ done: summary.pending === 0, lastStatus: status, ...summary });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Send failed' }, 400);
  }
}

async function deliverySummary(db, eventId) {
  const rows = await db.prepare('SELECT status, COUNT(*) AS total FROM push_deliveries WHERE event_id = ? GROUP BY status').bind(eventId).all();
  const counts = Object.fromEntries((rows.results ?? []).map((row) => [row.status, Number(row.total)]));
  return { pending: Number(counts.pending ?? 0), delivered: Number(counts.delivered ?? 0), failed: Number(counts.failed ?? 0) };
}
