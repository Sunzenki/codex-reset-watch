import { json } from '../../_lib/push.js';

export function onRequestGet({ env }) {
  if (!env.VAPID_PUBLIC_KEY) return json({ error: 'Push is not configured' }, 503);
  return json({ publicKey: env.VAPID_PUBLIC_KEY });
}
