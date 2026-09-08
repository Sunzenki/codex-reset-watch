import { readFileSync } from 'node:fs';

const current = JSON.parse(readFileSync(new URL('../public/data/current.json', import.meta.url), 'utf8'));
const history = JSON.parse(readFileSync(new URL('../public/data/history.json', import.meta.url), 'utf8'));
const seoMetadata = JSON.parse(readFileSync(new URL('../src/seo-metadata.json', import.meta.url), 'utf8'));
const allowedStatus = new Set(['monitoring', 'estimated', 'confirmed', 'reached', 'superseded']);
const allowedCurrentKind = new Set(['reset', 'banked_reset', 'rollout_observed', 'reset_confirmed']);
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
if (current.kind && !allowedCurrentKind.has(current.kind)) throw new Error('current.kind 值无效');
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

const seoRoutes = [
  ['en', 'home', '../en/index.html'],
  ['en', 'history', '../en/history/index.html'],
  ['zh-CN', 'home', '../zh-CN/index.html'],
  ['zh-CN', 'history', '../zh-CN/history/index.html'],
  ['zh-TW', 'home', '../zh-TW/index.html'],
  ['zh-TW', 'history', '../zh-TW/history/index.html'],
];

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function extractSingle(html, pattern, field, route) {
  const matches = [...html.matchAll(pattern)];
  if (matches.length !== 1) throw new Error(`${route} 必须且只能包含一个 ${field}`);
  return decodeHtml(matches[0][1]);
}

const descriptions = new Set();
for (const [locale, kind, relativePath] of seoRoutes) {
  const route = `${locale}/${kind}`;
  const expected = seoMetadata[locale]?.[kind];
  if (!expected) throw new Error(`seo-metadata.json 缺少 ${route}`);
  const titleLength = [...expected.title].length;
  const descriptionLength = [...expected.description].length;
  if (titleLength < 20 || titleLength > 65) throw new Error(`${route} title 应为 20–65 个 Unicode 字符，当前 ${titleLength}`);
  if (descriptionLength < 150 || descriptionLength > 160) throw new Error(`${route} description 应为 150–160 个 Unicode 字符，当前 ${descriptionLength}`);
  if (descriptions.has(expected.description)) throw new Error(`${route} description 与其他页面重复`);
  descriptions.add(expected.description);

  const html = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  if (/<meta\s+name=["']keywords["']/i.test(html)) throw new Error(`${route} 不应添加已废弃的 meta keywords`);
  const actual = {
    title: extractSingle(html, /<title>([^<]*)<\/title>/gi, 'title', route),
    description: extractSingle(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']\s*\/?>/gi, 'meta description', route),
    ogTitle: extractSingle(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']\s*\/?>/gi, 'og:title', route),
    ogDescription: extractSingle(html, /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']\s*\/?>/gi, 'og:description', route),
    twitterTitle: extractSingle(html, /<meta\s+name=["']twitter:title["']\s+content=["']([^"']*)["']\s*\/?>/gi, 'twitter:title', route),
    twitterDescription: extractSingle(html, /<meta\s+name=["']twitter:description["']\s+content=["']([^"']*)["']\s*\/?>/gi, 'twitter:description', route),
  };
  for (const field of ['title', 'ogTitle', 'twitterTitle']) {
    if (actual[field] !== expected.title) throw new Error(`${route} ${field} 与 seo-metadata.json 不一致`);
  }
  for (const field of ['description', 'ogDescription', 'twitterDescription']) {
    if (actual[field] !== expected.description) throw new Error(`${route} ${field} 与 seo-metadata.json 不一致`);
  }
  if (html.indexOf('<title>') > html.indexOf('<meta name="description"')) throw new Error(`${route} title 应位于 description 之前`);
}

console.log(`数据校验通过：当前状态 + ${history.length} 条历史记录`);
console.log('SEO 校验通过：6 个页面的标题、描述、OG、Twitter 与统一数据源一致，描述均为 150–160 个 Unicode 字符');
