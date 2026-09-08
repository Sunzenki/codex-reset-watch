import { adminConfigured, validAdminSession } from '../../_lib/admin.js';
import { json } from '../../_lib/push.js';

export async function onRequestGet({ request, env }) {
  return json({ configured: adminConfigured(env), authenticated: await validAdminSession(request, env) });
}
