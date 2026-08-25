import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://crw.warpnav.com';
const current = JSON.parse(readFileSync(join(ROOT, 'public/data/current.json'), 'utf8'));
const history = JSON.parse(readFileSync(join(ROOT, 'public/data/history.json'), 'utf8'));

const locales = {
  en: {
    lang: 'en', intl: 'en-US', timeZone: 'UTC',
    homeTitle: 'Codex Reset Time & Countdown (UTC)', historyTitle: 'Codex Reset History',
    description: 'Human-curated Codex rate-limit reset estimates, countdown, source posts, time conversions, and verified history.',
    expected: 'Reset expected around', reached: 'The announced reset time has passed',
    rolloutHeadline: 'Plus 5-hour limit rollout observed; exact rollout time remains unconfirmed',
    source: 'Original public source', updated: 'Last human update', historyIntro: 'Past public reset posts and their converted times.',
  },
  'zh-CN': {
    lang: 'zh-CN', intl: 'zh-CN', timeZone: 'Asia/Shanghai',
    homeTitle: 'Codex 重置时间与倒计时', historyTitle: 'Codex 历史重置记录',
    description: '人工整理的 Codex rate-limit reset 预告、倒计时、公开原帖、时区换算与历史记录。',
    expected: '预计', reached: '预告重置时间已到', source: '公开原始来源', updated: '本站人工更新', historyIntro: '过往公开重置消息及其时间换算记录。',
    rolloutHeadline: 'Plus 5 小时限制开始落地，具体全量时间尚未确认',
  },
  'zh-TW': {
    lang: 'zh-TW', intl: 'zh-TW', timeZone: 'Asia/Taipei',
    homeTitle: 'Codex 重置時間與倒數計時', historyTitle: 'Codex 歷史重置記錄',
    description: '人工整理的 Codex rate-limit reset 預告、倒數計時、公開原帖、時區換算與歷史記錄。',
    expected: '預計', reached: '預告重置時間已到', source: '公開原始來源', updated: '本站人工更新', historyIntro: '過往公開重置消息及其時間換算記錄。',
    rolloutHeadline: 'Plus 5 小時限制開始落地，具體全量時間尚未確認',
  },
};

const routes = Object.keys(locales).flatMap((locale) => [
  { locale, kind: 'home', path: `/${locale}/`, file: join(DIST, locale, 'index.html') },
  { locale, kind: 'history', path: `/${locale}/history/`, file: join(DIST, locale, 'history/index.html') },
]);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function displayDate(value, locale) {
  const config = locales[locale];
  return new Intl.DateTimeFormat(config.intl, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: config.timeZone, timeZoneName: 'short',
  }).format(new Date(value));
}

function currentHeadline(locale) {
  const copy = locales[locale];
  if (current.kind === 'rollout_observed') return copy.rolloutHeadline;
  if (!current.resetAt) return locale === 'en' ? 'Watching for the next Codex reset' : locale === 'zh-CN' ? '正在等待下一次 Codex 重置消息' : '正在等待下一次 Codex 重置消息';
  if (Date.now() >= Date.parse(current.resetAt)) return copy.reached;
  const time = displayDate(current.resetAt, locale);
  if (locale === 'en') return `${copy.expected} ${time}`;
  return `${copy.expected} ${time} 左右重置`;
}

function snapshot(route) {
  const copy = locales[route.locale];
  const languageLinks = Object.entries(locales).map(([code, value]) => `<a href="/${code}/${route.kind === 'history' ? 'history/' : ''}" lang="${value.lang}">${code}</a>`).join(' · ');
  if (route.kind === 'home') {
    const source = current.announcement;
    return `<main id="content" class="seo-snapshot"><header><p>Codex Reset Watch</p><h1>${escapeHtml(currentHeadline(route.locale))}</h1><p>${escapeHtml(copy.description)}</p></header>${current.resetAt ? `<p><time datetime="${escapeHtml(current.resetAt)}">${escapeHtml(displayDate(current.resetAt, route.locale))}</time></p>` : ''}${source ? `<section><h2>${escapeHtml(copy.source)}</h2><blockquote cite="${escapeHtml(source.url)}" lang="en">${escapeHtml(source.text)}</blockquote><p><a href="${escapeHtml(source.url)}">Tibo (@thsottiaux) on X</a></p></section>` : ''}<p>${escapeHtml(copy.updated)}: <time datetime="${escapeHtml(current.updatedAt)}">${escapeHtml(displayDate(current.updatedAt, route.locale))}</time></p><nav aria-label="Languages">${languageLinks}</nav></main>`;
  }
  const items = history.map((record) => `<li><article id="${escapeHtml(record.id)}"><h2><time datetime="${escapeHtml(record.targetAt)}">${escapeHtml(displayDate(record.targetAt, route.locale))}</time></h2><blockquote cite="${escapeHtml(record.announcement.url)}" lang="en">${escapeHtml(record.announcement.text)}</blockquote><a href="${escapeHtml(record.announcement.url)}">Tibo (@thsottiaux) on X</a></article></li>`).join('');
  return `<main id="content" class="seo-snapshot"><header><p>Codex Reset Watch</p><h1>${escapeHtml(copy.historyTitle)}</h1><p>${escapeHtml(copy.historyIntro)}</p></header><ol>${items}</ol><nav aria-label="Languages">${languageLinks}</nav></main>`;
}

function structuredData(route) {
  const copy = locales[route.locale];
  const url = `${ORIGIN}${route.path}`;
  const website = {
    '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: 'Codex Reset Watch', alternateName: 'CRW',
    description: 'A multilingual, human-curated tracker for publicly announced Codex rate-limit resets.',
    inLanguage: ['en', 'zh-CN', 'zh-TW'], isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: 'WarpNav', url: 'https://warpnav.com/' },
    sameAs: ['https://github.com/Sunzenki/codex-reset-watch'],
  };
  const webpage = {
    '@type': route.kind === 'history' ? 'CollectionPage' : 'WebPage', '@id': `${url}#webpage`, url,
    name: route.kind === 'history' ? copy.historyTitle : copy.homeTitle, description: copy.description,
    inLanguage: copy.lang, isPartOf: { '@id': `${ORIGIN}/#website` }, isAccessibleForFree: true,
    dateModified: route.kind === 'history' ? history.reduce((latest, item) => item.recordedAt > latest ? item.recordedAt : latest, history[0]?.recordedAt ?? current.updatedAt) : current.updatedAt,
  };
  if (route.kind === 'home' && current.announcement) {
    webpage.citation = current.announcement.url;
    webpage.mainEntity = {
      '@type': 'CreativeWork', name: current.kind === 'rollout_observed' ? 'Latest Codex rate-limit rollout update' : 'Current Codex reset estimate',
      datePublished: current.announcement.postedAt, dateModified: current.updatedAt,
      temporalCoverage: current.resetAt ?? undefined, citation: current.announcement.url,
    };
  }
  if (route.kind === 'history') {
    const dataset = {
      '@type': 'Dataset', '@id': `${ORIGIN}/data/history.json#dataset`,
      name: 'Codex Reset Watch public reset archive', description: 'Public source posts and converted target times used by the Codex Reset Watch history page.',
      url: `${ORIGIN}/data/history.json`, isAccessibleForFree: true,
      creator: { '@type': 'Organization', name: 'WarpNav', url: 'https://warpnav.com/' },
      dateModified: webpage.dateModified,
      distribution: [{ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${ORIGIN}/data/history.json` }],
    };
    webpage.mainEntity = { '@id': dataset['@id'] };
    webpage.hasPart = history.map((record) => ({
      '@type': 'CreativeWork', '@id': `${url}#${record.id}`, name: `Codex reset record ${record.targetAt}`,
      datePublished: record.announcement.postedAt, temporalCoverage: record.targetAt, sameAs: record.announcement.url,
    }));
    return { '@context': 'https://schema.org', '@graph': [website, webpage, dataset] };
  }
  return { '@context': 'https://schema.org', '@graph': [website, webpage] };
}

for (const route of routes) {
  let html = readFileSync(route.file, 'utf8');
  const jsonLd = JSON.stringify(structuredData(route)).replace(/</g, '\\u003c');
  const bootstrap = JSON.stringify({ current, history }).replace(/</g, '\\u003c');
  html = html.replace('</head>', `    <script>window.__CRW_BOOTSTRAP__=${bootstrap};</script>\n    <script type="application/ld+json">${jsonLd}</script>\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${snapshot(route)}</div>`);
  writeFileSync(route.file, html);
}

const latestHistoryUpdate = history.reduce((latest, item) => item.recordedAt > latest ? item.recordedAt : latest, current.updatedAt).slice(0, 10);
const currentUpdate = current.updatedAt.slice(0, 10);
const sitemapEntries = routes.map((route) => {
  const alternates = Object.keys(locales).map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale}" href="${ORIGIN}/${locale}/${route.kind === 'history' ? 'history/' : ''}" />`).join('\n');
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}/en/${route.kind === 'history' ? 'history/' : ''}" />`;
  return `  <url>\n    <loc>${ORIGIN}${route.path}</loc>\n    <lastmod>${route.kind === 'history' ? latestHistoryUpdate : currentUpdate}</lastmod>\n${alternates}\n${xDefault}\n  </url>`;
}).join('\n');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries}\n</urlset>\n`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
writeFileSync(join(DIST, 'llms.txt'), `# Codex Reset Watch\n\n> A multilingual, human-curated tracker for publicly announced Codex rate-limit reset estimates and outcomes. It is not affiliated with OpenAI.\n\n## Canonical pages\n- [English current reset](${ORIGIN}/en/)\n- [English reset history](${ORIGIN}/en/history/)\n- [简体中文当前重置](${ORIGIN}/zh-CN/)\n- [简体中文历史记录](${ORIGIN}/zh-CN/history/)\n- [繁體中文目前重置](${ORIGIN}/zh-TW/)\n- [繁體中文歷史記錄](${ORIGIN}/zh-TW/history/)\n\n## Machine-readable data\n- [Current status JSON](${ORIGIN}/data/current.json)\n- [History JSON](${ORIGIN}/data/history.json)\n\n## Editorial method\n- Every event links to the public post it was derived from.\n- Original quotations are preserved in English.\n- Times are stored as ISO 8601 UTC; localized pages format them for their stated time zone.\n- A countdown reaching zero does not prove that a reset occurred. Confirmed outcomes are recorded separately.\n\n## Source and ownership\n- Primary public source monitored manually: Tibo (@thsottiaux) on X.\n- Project owner: [WarpNav](https://warpnav.com/)\n- Source code: [GitHub](https://github.com/Sunzenki/codex-reset-watch)\n`);
copyFileSync(join(ROOT, 'ads.txt'), join(DIST, 'ads.txt'));

console.log('SEO postbuild complete: static snapshots, JSON-LD, sitemap, robots, llms.txt, and ads.txt');
