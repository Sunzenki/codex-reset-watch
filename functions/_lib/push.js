const allowedLocales = new Set(['en', 'zh-CN', 'zh-TW']);
const allowedPushHosts = new Set(['fcm.googleapis.com', 'updates.push.services.mozilla.com']);

export function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'cache-control': 'no-store' } });
}

export function requireSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

export async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function validateSubscription(value) {
  const endpoint = value?.endpoint;
  const p256dh = value?.keys?.p256dh;
  const auth = value?.keys?.auth;
  if (typeof endpoint !== 'string' || typeof p256dh !== 'string' || typeof auth !== 'string') throw new Error('invalid subscription');
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || !allowedPushHosts.has(url.hostname)) throw new Error('unsupported push service');
  if (!/^[A-Za-z0-9_-]{80,120}$/.test(p256dh) || !/^[A-Za-z0-9_-]{16,40}$/.test(auth)) throw new Error('invalid subscription keys');
  return { endpoint, p256dh, auth };
}

export function validateLocale(locale) {
  return allowedLocales.has(locale) ? locale : 'en';
}

export function validateMessage(value) {
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(value?.eventId ?? '')) throw new Error('invalid event id');
  const messages = {};
  for (const locale of allowedLocales) {
    const item = value?.messages?.[locale];
    if (!item || typeof item.title !== 'string' || typeof item.body !== 'string' || typeof item.path !== 'string') throw new Error('missing locale message');
    if (!item.title.trim() || item.title.length > 80 || !item.body.trim() || item.body.length > 180) throw new Error('invalid message length');
    if (!new RegExp(`^/${locale}/(?:history/)?$`).test(item.path)) throw new Error('invalid message path');
    messages[locale] = { title: item.title.trim(), body: item.body.trim(), path: item.path };
  }
  return { eventId: value.eventId, messages };
}

export async function validAdmin(request, token) {
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!supplied || !token) return false;
  return (await sha256(supplied)) === (await sha256(token));
}
