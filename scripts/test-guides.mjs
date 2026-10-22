import test from 'node:test';
import assert from 'node:assert/strict';
import { compileArticle, compileGuides, createManifest, guidePath } from './guides-content.mjs';
import { readFileSync } from 'node:fs';
import { listPath, parseListPath, selectList } from '../src/guide-routing.mjs';
import { guideMetadata } from './guides-seo.mjs';
import { seriesCalendar, articleDate } from '../src/guide-series.mjs';

const metadata = { id: 'test-guide', slug: 'test-guide', title: '测试文章', summary: '测试摘要', locale: 'zh-CN', category: 'tutorials', publishedAt: '2026-10-20T02:00:00Z', status: 'published', sources: [{ label: '历史记录', url: '/zh-CN/history/' }] };
const source = (changes = {}, body = '## 时间依据\n\n正文与 **重点**。') => `---\n${JSON.stringify({ ...metadata, ...changes })}\n---\n\n${body}`;

test('Markdown 编译保留正文、列表、表格与可跳转目录', () => {
  const result = compileArticle(source({}, '## 时间依据\n\n正文与 **重点**。\n\n1. 第一项\n2. 第二项\n\n| 项目 | 值 |\n| --- | --- |\n| 时间 | 未知 |'));
  assert.deepEqual(result.toc, [{ id: 'section-1', text: '时间依据' }]);
  assert.match(result.html, /id="section-1"/);
  assert.match(result.html, /<strong>重点<\/strong>/);
  assert.match(result.html, /<table>/);
  assert.match(result.html, /<ol>/);
});
test('正式构建排除示例和草稿，预览也不携带草稿正文', () => {
  const published = compileArticle(source());
  const preview = compileArticle(source({ id: 'preview', slug: 'preview', status: 'preview' }, '## 示例\n\nPREVIEW_ONLY'));
  const draft = compileArticle(source({ id: 'draft', slug: 'draft', status: 'draft' }, '## 草稿\n\nDRAFT_SECRET'));
  assert.deepEqual(createManifest([published, preview, draft]).articles.map((item) => item.id), ['test-guide']);
  assert.doesNotMatch(JSON.stringify(createManifest([published, preview, draft], true)), /DRAFT_SECRET/);
  assert.match(JSON.stringify(createManifest([published, preview, draft], true)), /PREVIEW_ONLY/);
});
test('置顶优先于日期，多个置顶按 pinOrder 排列，普通文章按日期倒序', () => {
  const item = (id, publishedAt, extra = {}) => compileArticle(source({ id, slug: id, publishedAt, ...extra }));
  const results = createManifest([
    item('latest', '2026-10-21T00:00:00Z'),
    item('old-pinned', '2026-10-01T00:00:00Z', { pinned: true, pinOrder: 1 }),
    item('another-pinned', '2026-10-20T00:00:00Z', { pinned: true, pinOrder: 2 }),
    item('older', '2026-10-19T00:00:00Z'),
  ]).articles;
  assert.deepEqual(results.map((item) => item.id), ['old-pinned', 'another-pinned', 'latest', 'older']);
});
test('新发布的系列文章优先于较早资讯，同批按系列日排列，旧文更新不顶到前面', () => {
  const item = (id, publishedAt, extra = {}) => compileArticle(source({ id, slug: id, publishedAt, category: 'updates', ...extra }));
  const plan = item('series-index', '2026-10-01T00:00:00Z', {
    pinned: true, series: { id: 'release-order', startDate: '2026-10-05', days: 28, timeZone: 'America/Los_Angeles', checkedAt: '2026-10-21T12:00:00Z' },
  });
  const daily = (day, publishedAt) => item(`day-${day}`, publishedAt, {
    seriesId: 'release-order', seriesDay: day, seriesKinds: ['reset'], announcedAt: '2026-10-21T00:00:00Z',
  });
  const latest = daily(17, '2026-10-21T12:00:00Z');
  const results = createManifest([
    item('earlier-news', '2026-10-21T03:00:00Z', { category: 'news' }),
    daily(15, '2026-10-20T12:00:00Z'),
    item('older-updated', '2026-10-18T00:00:00Z', { category: 'news', updatedAt: '2026-10-21T15:00:00Z' }),
    latest, plan, daily(16, '2026-10-20T12:00:00Z'),
  ]).articles;
  assert.equal(articleDate(latest, results).date, '2026-10-21');
  assert.deepEqual(selectList(results, 'zh-CN').visible.map((article) => article.id), ['series-index', 'day-17', 'earlier-news', 'day-16', 'day-15', 'older-updated']);
  assert.deepEqual(selectList(results, 'zh-CN', 'updates').visible.map((article) => article.id), ['series-index', 'day-17', 'day-16', 'day-15']);
});
test('拒绝重复路径和同语言的重复文章关联', () => {
  const item = compileArticle(source());
  assert.throws(() => createManifest([item, item]), /重复/);
  assert.throws(() => createManifest([item, { ...item, slug: 'different' }]), /重复/);
});
test('拒绝正文 HTML 和危险链接', () => {
  assert.throws(() => compileArticle(source({}, '## 内容\n\n<script>alert(1)</script>')), /原始 HTML/);
  assert.throws(() => compileArticle(source({}, '## 内容\n\n[打开](javascript:alert)')), /不允许的链接/);
  assert.throws(() => compileArticle(source({}, '## 内容\n\n[打开](//example.com)')), /不允许的链接/);
});
test('正式文章必须有来源，校验日期、分类和本地图片', () => {
  assert.throws(() => compileArticle(source({ sources: [] })), /至少保留/);
  assert.throws(() => compileArticle(source({ publishedAt: '2026-10-20' })), /带时区/);
  assert.throws(() => compileArticle(source({ updatedAt: '2026-10-19T00:00:00Z' })), /早于/);
  assert.throws(() => compileArticle(source({ category: 'unknown' })), /分类/);
  assert.throws(() => compileArticle(source({ cover: '/images/missing-file.png' })), /实际存在/);
});

test('日期校验拒绝不存在的日历日与时间滚动，保留合法闰日和时区', () => {
  for (const publishedAt of ['2026-02-31T02:00:00Z', '2026-02-29T02:00:00Z', '2026-04-31T02:00:00+08:00', '2026-10-21T24:00:00Z']) {
    assert.throws(() => compileArticle(source({ publishedAt })), /带时区/);
  }
  for (const publishedAt of ['2024-02-29T02:00:00.123Z', '2026-10-20T02:00:00+08:00']) assert.equal(compileArticle(source({ publishedAt })).publishedAt, publishedAt);
  assert.throws(() => compileArticle(source({ series: { ...series, startDate: '2026-02-31' } })), /startDate/);
  assert.throws(() => compileArticle(source({ corrections: [{ date: '2026-02-31', text: 'Invalid date' }] })), /corrections/);
});
test('三语文章按 id 关联，URL 保留站点既有语言前缀', () => {
  const item = compileArticle(source());
  const translated = compileArticle(source({ locale: 'en' }));
  assert.equal(createManifest([item, translated]).articles.length, 2);
  assert.equal(guidePath('en', 'test-guide'), '/guides/test-guide/');
  assert.equal(guidePath('zh-TW'), '/zh-TW/guides/');
});
test('当前待发布内容默认不进入正式清单，预览清单均有真实目录锚点', () => {
  const production = compileGuides();
  assert.ok(production.articles.every((article) => article.status === 'published'));
  for (const article of compileGuides({ includePreview: true }).articles) {
    assert.notEqual(article.status, 'draft');
    for (const heading of article.toc) assert.ok(article.html.includes(`id="${heading.id}"`));
  }
});

test('Tibo 系列与四篇实用稿的三语版本保留事实、来源及同语言内链', () => {
  const articles = compileGuides({ includePreview: true }).articles;
  const practicalIds = ['gpt-5-5-codex-retirement-checklist', 'codex-cli-0-163-practical-changes', 'openai-2026-10-21-service-degradation', 'codex-usage-dashboard-and-shared-limits'];
  const originals = articles.filter((article) => article.locale === 'zh-CN' && (article.series?.id === 'tibo-28-days' || article.seriesId === 'tibo-28-days' || practicalIds.includes(article.id)));
  assert.ok(originals.length >= 21);
  for (const original of originals) {
    const versions = articles.filter((article) => article.id === original.id);
    assert.deepEqual(versions.map((article) => article.locale).sort(), ['en', 'zh-CN', 'zh-TW']);
    for (const article of versions) {
      for (const key of ['category', 'publishedAt', 'updatedAt', 'status', 'series', 'seriesId', 'seriesDay', 'seriesKinds', 'announcedAt']) assert.deepEqual(article[key], original[key], `${article.id}/${article.locale}/${key}`);
      const externalSources = (value) => value.sources.filter((source) => source.url.startsWith('https://')).map((source) => source.url);
      assert.deepEqual(externalSources(article), externalSources(original), article.id);
      assert.equal(article.toc.length, original.toc.length, `${article.id}: translated sections`);
      assert.doesNotMatch(article.html, /\uFFFD/);
      if (article.locale !== 'zh-CN') assert.doesNotMatch(article.html, /href="\/zh-CN\//);
      if (article.locale === 'en') assert.doesNotMatch(article.html, /[\u4e00-\u9fff]/);
    }
  }
  for (const locale of ['en', 'zh-CN', 'zh-TW']) {
    const first = selectList(articles, locale, 'all', 1);
    assert.equal(first.visible.length, 8);
    assert.ok(practicalIds.every((id) => first.visible.some((article) => article.id === id)));
    assert.deepEqual([...new Set(first.visible.map((article) => article.category))].sort(), ['incidents', 'news', 'tutorials', 'updates']);
  }
});

test('静态分页和分类 URL 区分有效路径、未知分类及越界页', () => {
  const articles = Array.from({ length: 10 }, (_, i) => ({ ...metadata, slug: `article-${i}`, category: i < 9 ? 'tutorials' : 'news' }));
  assert.equal(listPath('zh-CN', 'all', 2), '/zh-CN/guides/page/2/');
  assert.equal(listPath('en', 'tutorials', 2), '/guides/category/tutorials/page/2/');
  assert.deepEqual(parseListPath('/zh-CN/guides/category/tutorials/page/2/', 'zh-CN'), { category: 'tutorials', page: 2 });
  for (const path of ['/guides/page/1/', '/guides/page/02/', '/guides/page/0/', '/guides/category/unknown/', '/guides/page/2/extra/']) assert.equal(parseListPath(path, 'en'), null);
  assert.equal(selectList(articles, 'zh-CN', 'all', 1).visible.length, 8);
  assert.deepEqual(selectList(articles, 'zh-CN', 'all', 2).visible.map((item) => item.slug), ['article-8', 'article-9']);
  assert.equal(selectList(articles, 'zh-CN', 'all', 3).valid, false);
});

test('三语列表标题标明分类和页码，静态与客户端共用标题规则', () => {
  const copy = JSON.parse(readFileSync(new URL('../src/guides-copy.json', import.meta.url), 'utf8'));
  for (const locale of ['en', 'zh-CN', 'zh-TW']) {
    const articles = Array.from({ length: 9 }, (_, i) => ({ ...metadata, locale, id: `guide-${i}`, slug: `guide-${i}` }));
    const meta = (category = 'all', page = 1) => guideMetadata({ locale, articles, previewMode: true, category, page, path: listPath(locale, category, page) }, copy);
    assert.equal(meta().title, copy[locale].siteTitle);
    assert.ok(meta('all', 2).title.includes(copy[locale].pageTitle.replace('{page}', '2')));
    assert.ok(meta('tutorials').title.includes(copy[locale].categories.tutorials));
    assert.equal(new Set([meta().title, meta('all', 2).title, meta('tutorials').title]).size, 3);
    assert.equal(meta('tutorials').indexable, false);
  }
});

test('正式列表与分类 self-canonical 可索引，预览和空页隔离，清单只列当前页', () => {
  const copy = JSON.parse(readFileSync(new URL('../src/guides-copy.json', import.meta.url), 'utf8'));
  const articles = Array.from({ length: 9 }, (_, i) => ({ ...metadata, id: `guide-${i}`, slug: `guide-${i}` }));
  const options = { locale: 'zh-CN', path: listPath('zh-CN', 'all', 2), articles, previewMode: false, page: 2 };
  const page = guideMetadata(options, copy);
  assert.equal(page.url, 'https://crw.warpnav.com/zh-CN/guides/page/2/');
  assert.equal(page.indexable, true);
  assert.equal(page.data.mainEntity.itemListElement.length, 1);
  assert.equal(page.data.mainEntity.itemListElement[0].position, 9);
  assert.deepEqual(page.alternates, []);
  const category = guideMetadata({ ...options, path: listPath('zh-CN', 'tutorials', 2), category: 'tutorials' }, copy);
  assert.equal(category.indexable, true);
  assert.equal(category.url, 'https://crw.warpnav.com/zh-CN/guides/category/tutorials/page/2/');
  assert.equal(guideMetadata({ ...options, category: 'incidents' }, copy).indexable, false);
  assert.equal(guideMetadata({ ...options, previewMode: true }, copy).indexable, false);
  assert.equal(guideMetadata({ ...options, articles: [] }, copy).indexable, false);
});

test('分类主题、描述、关键词与真实译文对应，独立归档和预览使用不同索引状态', () => {
  const copy = JSON.parse(readFileSync(new URL('../src/guides-copy.json', import.meta.url), 'utf8'));
  const articles = [{ ...metadata }, { ...metadata, locale: 'en' }];
  for (const locale of ['en', 'zh-CN', 'zh-TW']) {
    const categoryCopy = Object.values(copy[locale].categoryPages);
    assert.equal(new Set(categoryCopy.map((item) => item.title)).size, 4);
    assert.equal(new Set(categoryCopy.map((item) => item.description)).size, 4);
    assert.ok(categoryCopy.every((item) => item.keywords.length >= 3 && item.heading.includes('Codex')));
  }
  const options = { locale: 'zh-CN', category: 'tutorials', page: 1, path: listPath('zh-CN', 'tutorials'), articles, previewMode: false };
  const meta = guideMetadata(options, copy);
  assert.equal(meta.description, copy['zh-CN'].categoryPages.tutorials.description);
  assert.deepEqual(meta.keywords, copy['zh-CN'].categoryPages.tutorials.keywords);
  assert.deepEqual(meta.alternates, [['zh-CN', '/zh-CN/guides/category/tutorials/'], ['en', '/guides/category/tutorials/']]);
  assert.equal(meta.indexable, true);
  assert.equal(guideMetadata({ ...options, previewMode: true }, copy).indexable, false);
  assert.equal(guideMetadata({ ...options, articles: [] }, copy).indexable, false);
  assert.equal(guideMetadata({ ...options, page: 2 }, copy).indexable, false);
});

test('文章作者指向可核查说明，日期与来源保留，不以品牌 OG 冒充文章配图', () => {
  const copy = JSON.parse(readFileSync(new URL('../src/guides-copy.json', import.meta.url), 'utf8'));
  const article = compileArticle(source({ updatedAt: '2026-10-20T03:00:00Z', cover: '/images/guides-tibo-28-day-plan.webp' }));
  const other = { ...article, locale: 'en' };
  const meta = guideMetadata({ locale: 'zh-CN', path: guidePath('zh-CN', article.slug), articles: [article, other], article, previewMode: false }, copy);
  assert.equal(meta.data.author.name, copy['zh-CN'].author);
  assert.equal(meta.data.author.url, 'https://crw.warpnav.com/zh-CN/guides/editorial/#editorial-team');
  assert.equal(meta.data.dateModified, article.updatedAt);
  assert.equal(meta.data.datePublished, article.publishedAt);
  assert.equal('image' in meta.data, false);
  assert.deepEqual(meta.alternates.map(([locale]) => locale), ['zh-CN', 'en']);
  assert.deepEqual(meta.data.citation, ['https://crw.warpnav.com/zh-CN/history/']);
});

test('正式内容拒绝未来日期和栏目保留路径，预览示例可保留演示日期', () => {
  const future = new Date(Date.now() + 86400000).toISOString();
  assert.throws(() => compileArticle(source({ publishedAt: future })), /未来/);
  assert.throws(() => compileArticle(source({ updatedAt: future })), /未来/);
  assert.equal(compileArticle(source({ publishedAt: future, status: 'preview' })).status, 'preview');
  for (const slug of ['page', 'category', 'editorial']) assert.throws(() => compileArticle(source({ slug })), /保留路径/);
});

const series = { id: 'tibo-28-days', startDate: '2026-10-05', days: 28, timeZone: 'America/Los_Angeles', checkedAt: '2026-10-21T13:20:00Z' };
test('28 天日历跨夏令时仍保留连续日期，未来和待核对日期没有文章链接', () => {
  const article = compileArticle(source({ seriesId: series.id, seriesDay: 16, seriesKinds: ['feature'], announcedAt: '2026-10-21T01:10:00Z' }));
  const calendar = seriesCalendar(series, [article], 'zh-CN');
  assert.equal(calendar.length, 28);
  assert.equal(calendar[0].date, '2026-10-05');
  assert.equal(calendar[27].date, '2026-11-01');
  assert.equal(new Set(calendar.map((item) => item.date)).size, 28);
  assert.equal(calendar[15].article, article);
  assert.equal(calendar[16].pending, true);
  assert.equal(calendar[17].pending, false);
  assert.equal(calendar[17].article, undefined);
  assert.ok(seriesCalendar(series, [article], 'en').every((item) => !item.article));
});
test('系列关系拒绝重复日、孤立日文章和不完整字段，正式构建隔离预览目录', () => {
  const index = compileArticle(source({ id: 'index', slug: 'index', status: 'preview', series }));
  const daily = compileArticle(source({ status: 'preview', seriesId: series.id, seriesDay: 1, seriesKinds: ['feature', 'reset'], announcedAt: '2026-10-05T17:20:29Z' }));
  assert.equal(createManifest([index, daily], true).articles.length, 2);
  assert.equal(createManifest([index, daily]).articles.length, 0);
  assert.throws(() => createManifest([daily], true), /缺少/);
  assert.throws(() => createManifest([index, daily, { ...daily, id: 'another', slug: 'another' }], true), /重复的系列日/);
  assert.throws(() => createManifest([index, { ...daily, status: 'published' }]), /缺少/);
  assert.throws(() => compileArticle(source({ seriesId: series.id })), /系列日文章/);
  assert.throws(() => compileArticle(source({ seriesDay: 29 })), /需要 seriesId/);
  assert.throws(() => compileArticle(source({ series: { ...series, checkedAt: '2026-10-21' } })), /带时区/);
  assert.deepEqual(createManifest([index, daily, { ...daily, id: 'day-two', slug: 'day-two', seriesDay: 2 }], true).articles.filter((item) => item.seriesId).map((item) => item.seriesDay), [2, 1]);
});

test('系列显示日按日历归档，原帖跨 UTC 日期和本站发布日期不改变系列日', () => {
  const index = compileArticle(source({ id: 'series-index', slug: 'series-index', series, status: 'preview' }));
  const daily = compileArticle(source({ publishedAt: '2026-10-21T13:20:00Z', status: 'preview', seriesId: series.id, seriesDay: 16, seriesKinds: ['feature'], announcedAt: '2026-10-21T01:10:02Z' }));
  assert.deepEqual(articleDate(daily, [index, daily]), { date: '2026-10-20', timeZone: 'America/Los_Angeles', kind: 'series' });
  assert.equal(articleDate(index, [index]).date, '2026-10-05');
  const copy = JSON.parse(readFileSync(new URL('../src/guides-copy.json', import.meta.url), 'utf8'));
  const options = { locale: 'zh-CN', path: guidePath('zh-CN', daily.slug), articles: [index, daily], article: daily, previewMode: true };
  assert.equal('datePublished' in guideMetadata(options, copy).data, false);
  const published = { ...daily, status: 'published' };
  assert.equal(guideMetadata({ ...options, article: published, previewMode: false }, copy).data.datePublished, daily.publishedAt);
});
