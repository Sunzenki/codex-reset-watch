import { summarizeDeliveries } from '../../_lib/delivery-summary.js';
import { requireAdmin } from '../../_lib/admin.js';
import { json } from '../../_lib/push.js';

export async function onRequestGet({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const subscriptions = await env.PUSH_DB.prepare(`SELECT
    SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) AS active,
    SUM(CASE WHEN active = 0 THEN 1 ELSE 0 END) AS inactive,
    SUM(CASE WHEN active = 1 AND locale = 'en' THEN 1 ELSE 0 END) AS locale_en,
    SUM(CASE WHEN active = 1 AND locale = 'zh-CN' THEN 1 ELSE 0 END) AS locale_zh_cn,
    SUM(CASE WHEN active = 1 AND locale = 'zh-TW' THEN 1 ELSE 0 END) AS locale_zh_tw,
    COUNT(*) AS total FROM subscriptions`).first();
  const events = await env.PUSH_DB.prepare('SELECT event_id, created_at FROM push_events ORDER BY created_at DESC LIMIT 8').all();
  const deliveries = await env.PUSH_DB.prepare(`SELECT event_id, status, response_status, COUNT(*) AS total
    FROM push_deliveries WHERE event_id IN (SELECT event_id FROM push_events ORDER BY created_at DESC LIMIT 8)
    GROUP BY event_id, status, response_status`).all();
  return json({
    subscriptions: {
      active: Number(subscriptions?.active ?? 0),
      inactive: Number(subscriptions?.inactive ?? 0),
      total: Number(subscriptions?.total ?? 0),
      byLocale: {
        en: Number(subscriptions?.locale_en ?? 0),
        'zh-CN': Number(subscriptions?.locale_zh_cn ?? 0),
        'zh-TW': Number(subscriptions?.locale_zh_tw ?? 0),
      },
    },
    events: (events.results ?? []).map((event) => ({ ...event,
      ...summarizeDeliveries((deliveries.results ?? []).filter((row) => row.event_id === event.event_id)),
    })),
  });
}
