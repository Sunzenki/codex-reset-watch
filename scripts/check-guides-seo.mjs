import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, escapeHtml } from './guides-content.mjs';
import { guideCategories, guideLocales, guidesPath, editorialPath, listPath, selectList } from '../src/guide-routing.mjs';
import { articleDate } from '../src/guide-series.mjs';
import { guideMetadata } from './guides-seo.mjs';

const origin = 'https://crw.warpnav.com';
const dist = join(ROOT, 'dist');
const { articles, previewMode } = JSON.parse(readFileSync(join(ROOT, 'src/generated/guides.json'), 'utf8'));
const copy = JSON.parse(readFileSync(join(ROOT, 'src/guides-copy.json'), 'utf8'));
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const base = process.argv.find((value) => value.startsWith('--base='))?.slice(7);
const pages = [];
for (const locale of guideLocales) {
  for (const category of ['all', ...guideCategories]) {
    const count = selectList(articles, locale, category).totalPages;
    for (let page = 1; page <= count; page++) pages.push({ locale, category, page, path: listPath(locale, category, page) });
  }
  pages.push({ locale, editorial: true, path: editorialPath(locale) });
}
for (const article of articles) pages.push({ locale: article.locale, article, path: guidesPath(article.locale, article.slug) });

for (const route of pages) {
  const { path, locale, article, editorial } = route;
  const html = readFileSync(join(dist, path, 'index.html'), 'utf8');
  const label = (message) => `${path}: ${message}`;
  const meta = guideMetadata({ ...route, articles, previewMode }, copy);
  assert.ok(html.includes(`<title>${escapeHtml(meta.title)}</title>`), label('页面标题与实际分类、页码对应'));
  assert.ok(html.includes(`name="description" content="${escapeHtml(meta.description)}"`), label('独立页面描述'));
  for (const field of ['og:description', 'twitter:description']) assert.ok(html.includes(`${field}" content="${escapeHtml(meta.description)}"`), label(`${field} 同步描述`));
  if (meta.keywords.length) assert.ok(html.includes(`name="keywords" content="${escapeHtml(meta.keywords.join(', '))}"`), label('主题关键词字段'));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, label('一个主标题'));
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonicals.length, 1, label('一个 canonical'));
  assert.equal(canonicals[0][1], origin + path, label('self-canonical'));
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data.url, origin + path, label('结构化数据 URL'));
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)[1];
  const state = selectList(articles, locale, route.category, route.page);
  const shouldIndex = !previewMode && (Boolean(article) || editorial || (state.valid && state.filtered.length > 0));
  assert.equal(robots.startsWith('index,'), Boolean(shouldIndex), label('索引策略'));
  assert.equal(sitemap.includes(`<loc>${origin + path}</loc>`), Boolean(shouldIndex), label('sitemap 隔离'));
  assert.ok(html.includes(escapeHtml(copy[locale].editorialTitle)), label('可访问编辑说明'));
  if (article) {
    assert.equal(data['@type'], 'Article', label('文章类型'));
    assert.equal(data.headline, article.title, label('标题'));
    assert.equal(data.description, article.summary, label('摘要'));
    assert.equal(data.datePublished, article.status === 'published' ? article.publishedAt : undefined, label('正式发布日期与预览隔离'));
    assert.equal(data.dateModified, article.status === 'published' ? article.updatedAt ?? article.publishedAt : undefined, label('正式修订日期与预览隔离'));
    assert.equal(data.author.name, copy[locale].author, label('真实组织署名'));
    assert.equal(data.author.url, origin + editorialPath(locale) + '#editorial-team', label('作者信息入口'));
    assert.equal('image' in data, false, label('不以品牌图冒充文章图片'));
    assert.ok(html.includes(article.html), label('完整静态正文'));
    if (article.series) {
      assert.ok(html.indexOf('class="guide-series"') < html.indexOf('class="article-prose"'), label('系列表格先于解释正文'));
      assert.equal((html.match(/class="series-cell\b/g) ?? []).length, article.series.days, label('完整日历格数'));
      assert.ok(html.includes(`${escapeHtml(copy[locale].pacificTime)}</time>`), label('目录核对时间使用可读时区标签'));
      assert.doesNotMatch(html.replace(/&#(?:x27|39);/g, "'"), /<h3>(?:Tibo['’]s )?Day \d+\s*[｜|]/, label('日历标题不重复 Day 系列前缀'));
      for (const daily of articles.filter((item) => item.locale === locale && item.seriesId === article.series.id)) assert.ok(html.includes(`href="${guidesPath(locale, daily.slug)}"`), label('已存在日文章可抓取'));
    }
    assert.ok(html.includes(escapeHtml(copy[locale].author)), label('可见署名'));
    const visibleDate = articleDate(article, articles);
    assert.ok(html.toLowerCase().includes(`datetime="${visibleDate.date.toLowerCase()}"`), label('可见系列/文章日期'));
    if (article.status === 'published') assert.ok(html.toLowerCase().includes(`datetime="${article.publishedAt.toLowerCase()}"`), label('真实公开日期可见'));
    if (article.updatedAt) assert.ok(html.toLowerCase().includes(`datetime="${article.updatedAt.toLowerCase()}"`), label('可见更新时间'));
    for (const source of article.sources) assert.ok(html.includes(`href="${escapeHtml(source.url)}"`), label('可抓取来源链接'));
    const alternates = [...html.matchAll(/hreflang="(en|zh-CN|zh-TW)"/g)].map((match) => match[1]).sort();
    assert.deepEqual(alternates, articles.filter((item) => item.id === article.id).map((item) => item.locale).sort(), label('仅真实译文'));
  } else if (editorial) {
    assert.equal(data['@type'], 'AboutPage', label('编辑说明类型'));
    assert.ok(html.includes(escapeHtml(copy[locale].editorialTeam)), label('公开采编身份'));
    assert.ok(html.includes('id="editorial-team"'), label('署名链接锚点'));
  } else {
    assert.equal(data['@type'], 'CollectionPage', label('列表类型'));
    const landing = copy[locale].categoryPages[route.category];
    assert.ok(html.includes(`<h1>${escapeHtml(landing?.heading ?? copy[locale].heading)}</h1>`), label('主题明确的主标题'));
    assert.equal(data.description, meta.description, label('列表结构化描述对应页面'));
    for (const [code, alternate] of meta.alternates) assert.ok(html.includes(`hreflang="${code}" href="${origin + alternate}"`), label('真实栏目译文关联'));
    const rows = [...html.matchAll(/<article class="guide-index-row">([\s\S]*?)<\/article>/g)];
    assert.equal(rows.length, state.visible.length, label('静态与运行时分页数量一致'));
    assert.deepEqual(data.mainEntity.itemListElement.map((item) => item.url), state.visible.map((item) => origin + guidesPath(locale, item.slug)), label('当前页结构化清单'));
    const publicationZone = locale === 'en' ? 'UTC' : locale === 'zh-TW' ? 'Asia/Taipei' : 'Asia/Shanghai';
    const publicationDate = (value, options) => new Intl.DateTimeFormat(locale, { ...options, timeZone: publicationZone }).format(new Date(value));
    const expectedMonths = [];
    state.visible.forEach((item, index) => {
      // React uses &#x27; for apostrophes; the head template uses equivalent &#39;.
      assert.ok(rows[index][1].replaceAll('&#x27;', '&#39;').includes(escapeHtml(item.title)), label('当前页文章顺序'));
      const rowTimes = [...rows[index][1].matchAll(/<time[^>]*dateTime="([^"]+)"[^>]*>([\s\S]*?)<\/time>/gi)];
      assert.deepEqual(rowTimes.map((time) => time[1]), [item.publishedAt, item.publishedAt], label('列表两处日期均使用真实发布日期'));
      const day = publicationDate(item.publishedAt, { day: 'numeric' }).replace(/[^0-9]/g, '');
      const month = publicationDate(item.publishedAt, { month: locale === 'en' ? 'short' : 'numeric' });
      assert.equal(rowTimes[0][2], `<strong>${day}</strong><span>${month}</span>`, label('日期栏按页面语言时区换算'));
      assert.equal(rowTimes[1][2], publicationDate(item.publishedAt, { year: 'numeric', month: '2-digit', day: '2-digit' }), label('行内发布日期按页面语言时区显示'));
      const heading = publicationDate(item.publishedAt, { year: 'numeric', month: 'long' });
      if (expectedMonths.at(-1) !== heading) expectedMonths.push(heading);
    });
    assert.deepEqual([...html.matchAll(/<h2 class="guide-month">([^<]+)<\/h2>/g)].map((match) => match[1]), expectedMonths, label('月份分组使用真实发布日期'));
    if (state.totalPages > 1) assert.ok(html.includes('class="guide-pagination"'), label('静态分页链接'));
  }
  const references = [...html.matchAll(/(?:href|src)="([/#](?!\/)[^"]*)"/g)].map((match) => match[1]);
  for (const match of html.matchAll(/srcSet="([^"]+)"/gi)) references.push(...match[1].split(',').map((item) => item.trim().split(/\s+/)[0]));
  for (const reference of references) {
    const target = new URL(reference.replaceAll('&amp;', '&'), origin + path);
    if (target.origin !== origin) continue;
    const assetPath = decodeURIComponent(target.pathname);
    const destination = assetPath.endsWith('/') ? join(dist, assetPath, 'index.html') : join(dist, assetPath);
    assert.ok(existsSync(destination), label(`本地目标存在 ${assetPath}`));
    if (target.hash && destination.endsWith('.html')) {
      const fragment = escapeHtml(decodeURIComponent(target.hash.slice(1)));
      const targetHtml = assetPath === path ? html : readFileSync(destination, 'utf8');
      assert.ok(targetHtml.includes(`id="${fragment}"`), label(`目标锚点存在 ${reference}`));
    }
  }
  if (base) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, label('HTTP 200'));
    assert.ok((await response.text()).includes(`<link rel="canonical" href="${origin + path}"`), label('HTTP 静态 SEO'));
  }
}
if (base) {
  const removedSamples = ['understanding-reset-times', 'reporting-an-issue', 'reading-product-updates', 'keeping-corrections', 'finding-original-sources', 'announcement-confirmation-observation'].map((slug) => `/zh-CN/guides/${slug}/`);
  for (const path of ['/zh-CN/guides/missing-article/', '/zh-CN/guides/page/999/', '/guides/category/unknown/', ...removedSamples, '/guides/understanding-reset-times/', '/zh-TW/guides/understanding-reset-times/']) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 404, `${path}: HTTP 404`);
    const html = await response.text();
    assert.match(html, /noindex,nofollow/);
    assert.doesNotMatch(html, /rel="canonical"|"@type":"Article"/);
  }
}
console.log(`资讯 SEO 检查通过：${pages.length} 页；${previewMode ? '预览全部 noindex' : '正式模式，样例/草稿排除'}；${base ? 'HTTP 200/404 已检查' : '静态输出已检查'}。`);
