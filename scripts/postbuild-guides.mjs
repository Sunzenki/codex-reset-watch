import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ROOT, escapeHtml as e, locales } from './guides-content.mjs';
import { guideCategories, guidesPath, editorialPath, listPath, selectList } from '../src/guide-routing.mjs';
import { guideMetadata, ORIGIN } from './guides-seo.mjs';
import { footerSnapshot } from './footer-snapshot.mjs';

const DIST = join(ROOT, 'dist');
const manifest = JSON.parse(readFileSync(join(ROOT, 'src/generated/guides.json'), 'utf8'));
const { previewMode, articles } = manifest;
const copy = JSON.parse(readFileSync(join(ROOT, 'src/guides-copy.json'), 'utf8'));
const home = (locale) => locale === 'en' ? '/' : `/${locale}/`;
const templates = Object.fromEntries(locales.map((locale) => [locale, readFileSync(join(DIST, locale === 'en' ? 'index.html' : `${locale}/index.html`), 'utf8')]));
const sitemap = [];

function writePage(options, body) {
  const { locale, path, article, editorial } = options;
  const meta = guideMetadata({ ...options, articles, previewMode }, copy);
  let html = templates[locale];
  const footer = footerSnapshot(locale);
  const fallbackImage = `${ORIGIN}/og.png?v=forest-20261016`;
  html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${e(meta.title)}</title>`)
    .replace(/(<html\b[^>]*)(>)/, `$1 data-section="${article || editorial ? 'article' : 'guides'}"$2`)
    .replace(/(<meta name="description" content=")[^"]*/, (_, prefix) => prefix + e(meta.description))
    .replace(/(<meta name="robots" content=")[^"]*/, (_, prefix) => prefix + meta.robots)
    .replace(/(<link rel="canonical" href=")[^"]*/, (_, prefix) => prefix + e(meta.url))
    .replace(/\s*<link rel="alternate"[^>]*>/g, '')
    .replace(/\s*<meta property="og:locale:alternate"[^>]*>/g, '')
    .replace(/\s*<meta name="keywords"[^>]*>/g, '')
    .replace(/<script>window\.__CRW_BOOTSTRAP__=[\s\S]*?<\/script>/g, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  for (const property of ['og:title', 'twitter:title']) html = html.replace(new RegExp(`(<meta (?:property|name)="${property}" content=")[^"]*`), (_, prefix) => prefix + e(meta.title));
  for (const property of ['og:description', 'twitter:description']) html = html.replace(new RegExp(`(<meta (?:property|name)="${property}" content=")[^"]*`), (_, prefix) => prefix + e(meta.description));
  for (const property of ['og:image', 'twitter:image']) html = html.replace(new RegExp(`(<meta (?:property|name)="${property}" content=")[^"]*`), (_, prefix) => prefix + e(fallbackImage));
  html = html.replace(/(<meta property="og:url" content=")[^"]*/, (_, prefix) => prefix + e(meta.url))
    .replace(/(<meta property="og:type" content=")[^"]*/, (_, prefix) => prefix + (article ? 'article' : 'website'));
  const alternates = meta.alternates.map(([code, destination]) => `<link rel="alternate" hreflang="${code}" href="${ORIGIN}${destination}" />`);
  if (meta.keywords.length) alternates.push(`<meta name="keywords" content="${e(meta.keywords.join(', '))}" />`);
  const defaultPath = meta.alternates.find(([code]) => code === 'en')?.[1] ?? meta.alternates[0]?.[1];
  if (defaultPath) alternates.push(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}${defaultPath}" />`);
  const ogLocales = { en: 'en_US', 'zh-CN': 'zh_CN', 'zh-TW': 'zh_TW' };
  for (const [code] of meta.alternates.filter(([code]) => code !== locale)) alternates.push(`<meta property="og:locale:alternate" content="${ogLocales[code]}" />`);
  html = html.replace('</head>', `${alternates.join('\n')}\n<script type="application/ld+json">${JSON.stringify(meta.data).replace(/</g, '\\u003c')}</script>\n</head>`);
  const nav = `<header class="site-header"><a class="wordmark" href="${home(locale)}"><img src="/images/forest-logo.png" alt="Codex Reset Watch" width="202" height="50" /></a><nav aria-label="Primary navigation"><a href="${home(locale)}">${locale === 'en' ? 'Reset updates' : locale === 'zh-TW' ? '重置動態' : '重置动态'}</a><a href="${home(locale)}history/">${locale === 'en' ? 'History' : locale === 'zh-TW' ? '歷史記錄' : '历史记录'}</a><a class="active" aria-current="page" href="${guidesPath(locale)}">${e(copy[locale].title)}</a></nav></header>`;
  html = html.replace(/<body>[\s\S]*?<\/body>/, () => `<body><div id="root"><a class="skip-link" href="#content">${locale === 'en' ? 'Skip to content' : locale === 'zh-TW' ? '跳到主要內容' : '跳到主要内容'}</a>${nav}${body}${footer}</div></body>`);
  mkdirSync(join(DIST, path), { recursive: true });
  writeFileSync(join(DIST, path, 'index.html'), html);
  if (meta.indexable) {
    const modified = article ? article.updatedAt ?? article.publishedAt
      : editorial ? null : selectList(articles, locale, options.category).filtered.map((item) => item.updatedAt ?? item.publishedAt).sort((a, b) => Date.parse(a) - Date.parse(b)).at(-1);
    sitemap.push({ ...meta, modified });
  }
  return html;
}

// Render the actual article/list components so static content cannot drift from React.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
let listCount = 0;
try {
  const { GuidesPage, GuideArticlePage, GuideEditorialPage, GuideNotFound } = await server.ssrLoadModule('/src/GuidesPage.tsx');
  const { IconContext, iconDefaults } = await server.ssrLoadModule('/src/icons.ts');
  const render = (Component, props) => renderToStaticMarkup(createElement(IconContext.Provider, { value: iconDefaults }, createElement(Component, props)));
  for (const locale of locales) {
    for (const category of ['all', ...guideCategories]) {
      const { totalPages } = selectList(articles, locale, category);
      for (let page = 1; page <= totalPages; page++) {
        const path = listPath(locale, category, page);
        writePage({ locale, path, category, page }, render(GuidesPage, { locale, route: { category, page } }));
        listCount++;
      }
    }
    writePage({ locale, path: editorialPath(locale), editorial: true }, render(GuideEditorialPage, { locale }));
  }
  for (const article of articles) writePage({ locale: article.locale, path: guidesPath(article.locale, article.slug), article }, render(GuideArticlePage, { locale: article.locale, slug: article.slug }));
  const notFound = readFileSync(join(DIST, 'guides/index.html'), 'utf8')
    .replace(/<title>[^<]*<\/title>/, '<title>Article not found | Codex Reset Watch</title>')
    .replace(/<link rel="canonical"[^>]*>/g, '').replace(/<link rel="alternate"[^>]*>/g, '')
    .replace(/<meta name="keywords"[^>]*>/g, '')
    .replace(/<meta (?:property|name)="(?:og:[^"]+|twitter:[^"]+)"[^>]*>/g, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace(/(<meta name="robots" content=")[^"]*/, (_, prefix) => prefix + 'noindex,nofollow')
    .replace(/<main[\s\S]*?<\/main>/, () => render(GuideNotFound, { locale: 'en' }));
  writeFileSync(join(DIST, '404.html'), notFound);
} finally { await server.close(); }

const sitemapPath = join(DIST, 'sitemap.xml');
const entries = sitemap.map((route) => `<url><loc>${e(route.url)}</loc>${route.modified ? `<lastmod>${new Date(route.modified).toISOString().slice(0, 10)}</lastmod>` : ''}${route.alternates.map(([locale, path]) => `<xhtml:link rel="alternate" hreflang="${locale}" href="${ORIGIN}${path}" />`).join('')}</url>`).join('\n');
writeFileSync(sitemapPath, readFileSync(sitemapPath, 'utf8').replace('</urlset>', `${entries}\n</urlset>`));
if (!previewMode && articles.length) writeFileSync(join(DIST, 'llms.txt'), readFileSync(join(DIST, 'llms.txt'), 'utf8') + '\n## News and guides\n' + locales.filter((locale) => articles.some((article) => article.locale === locale)).map((locale) => `- [${copy[locale].title}](${ORIGIN}${guidesPath(locale)})`).join('\n') + '\n');
console.log(`资讯静态输出完成：${listCount} 个列表/筛选页 + ${articles.length} 个文章页 + 3 个编辑说明页；${previewMode ? '预览 noindex，未进入 sitemap' : '示例与草稿未进入输出'}；404.html 已生成`);
