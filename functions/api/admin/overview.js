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
  const events = await env.PUSH_DB.prepare(`SELECT e.event_id, e.created_at,
    SUM(CASE WHEN d.status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
    SUM(CASE WHEN d.status = 'failed' THEN 1 ELSE 0 END) AS failed,
    SUM(CASE WHEN d.status IN ('pending', 'sending') THEN 1 ELSE 0 END) AS pending
    FROM push_events e LEFT JOIN push_deliveries d ON d.event_id = e.event_id
    GROUP BY e.event_id, e.created_at ORDER BY e.created_at DESC LIMIT 8`).all();
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
      delivered: Number(event.delivered ?? 0), failed: Number(event.failed ?? 0), pending: Number(event.pending ?? 0),
    })),
  });
}
