import { readFile } from 'node:fs/promises';

const token = process.env.CRW_PUSH_ADMIN_TOKEN;
const endpoint = process.env.CRW_PUSH_ENDPOINT || 'https://crw.warpnav.com/api/push/send';
if (!token) throw new Error('CRW_PUSH_ADMIN_TOKEN is required');
const message = JSON.parse(await readFile(new URL('../public/data/push-message.json', import.meta.url), 'utf8'));

for (let attempt = 1; attempt <= 1100; attempt++) {
  const response = await fetch(endpoint, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(message) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || `Push endpoint returned ${response.status}`);
  process.stdout.write(`\r已送达 ${result.delivered}，失败 ${result.failed}，待发送 ${result.pending}   `);
  if (result.done) { process.stdout.write('\n'); process.exit(0); }
}
throw new Error('Stopped after 1100 attempts');
