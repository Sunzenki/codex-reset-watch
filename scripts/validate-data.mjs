import { readFileSync } from 'node:fs';

const current = JSON.parse(readFileSync(new URL('../public/data/current.json', import.meta.url), 'utf8'));
const history = JSON.parse(readFileSync(new URL('../public/data/history.json', import.meta.url), 'utf8'));
const allowedStatus = new Set(['monitoring', 'estimated', 'confirmed', 'reached', 'superseded']);
const allowedOutcome = new Set(['unverified', 'as_announced', 'revised', 'cancelled']);

function validDate(value, field, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new Error(`${field} 必须是有效的 ISO 8601 时间`);
}
function validAnnouncement(value, field, nullable = false) {
  if (nullable && value === null) return;
  if (!value || typeof value.source !== 'string' || typeof value.text !== 'string' || typeof value.url !== 'string') throw new Error(`${field} 缺少 source、text 或 url`);
  validDate(value.postedAt, `${field}.postedAt`);
}

if (!allowedStatus.has(current.status)) throw new Error('current.status 值无效');
validDate(current.resetAt, 'current.resetAt', true);
validDate(current.updatedAt, 'current.updatedAt');
validAnnouncement(current.announcement, 'current.announcement', true);

if (!Array.isArray(history)) throw new Error('history.json 必须是数组');
const ids = new Set();
for (const [index, record] of history.entries()) {
  const base = `history[${index}]`;
  if (!record.id || ids.has(record.id)) throw new Error(`${base}.id 缺失或重复`);
  ids.add(record.id);
  if (!['estimated', 'confirmed'].includes(record.precision)) throw new Error(`${base}.precision 值无效`);
  if (!allowedOutcome.has(record.outcome)) throw new Error(`${base}.outcome 值无效`);
  validDate(record.targetAt, `${base}.targetAt`);
  validDate(record.recordedAt, `${base}.recordedAt`);
  validAnnouncement(record.announcement, `${base}.announcement`);
}

console.log(`数据校验通过：当前状态 + ${history.length} 条历史记录`);
