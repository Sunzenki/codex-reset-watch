import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { guideLocales, guideCategories, guidesPath, pageSize } from '../src/guide-routing.mjs';
import { articleDate } from '../src/guide-series.mjs';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const locales = guideLocales;
export const categories = guideCategories;
export { pageSize };
export const guidePath = guidesPath;
export const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function filesIn(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory()
    ? filesIn(join(directory, entry.name))
    : entry.name.endsWith('.md') ? [join(directory, entry.name)] : []);
}

function validUrl(url) {
  return typeof url === 'string' && (/^https:\/\//.test(url) || /^\/(?!\/)/.test(url) || /^#[\w-]+$/.test(url));
}
function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return month >= 1 && month <= 12 && day >= 1 && day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}
const isIsoTime = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) && isCalendarDate(value.slice(0, 10)) && !Number.isNaN(Date.parse(value));

export function compileArticle(source, name = 'article.md') {
  const { data, content } = matter(source);
  const fail = (message) => { throw new Error(`${name}: ${message}`); };
  for (const key of ['id', 'slug', 'title', 'summary', 'locale', 'category', 'publishedAt', 'status']) {
    if (typeof data[key] !== 'string' || !data[key].trim()) fail(`缺少字符串字段 ${key}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.id)) fail('slug / id 只能使用小写字母、数字和连字符');
  if (['page', 'category', 'editorial'].includes(data.slug)) fail('slug 与栏目保留路径冲突');
  if (!locales.includes(data.locale) || !categories.includes(data.category)) fail('语言或分类无效');
  if (!['published', 'preview', 'draft'].includes(data.status)) fail('status 必须为 published / preview / draft');
  for (const key of ['publishedAt', 'updatedAt']) {
    if (data[key] !== undefined && !isIsoTime(data[key])) fail(`${key} 必须是带时区的 ISO 字符串，请用引号包裹`);
  }
  if (data.updatedAt && Date.parse(data.updatedAt) < Date.parse(data.publishedAt)) fail('更新时间不能早于发布时间');
  if (data.status === 'published' && [data.publishedAt, data.updatedAt].some((value) => value && Date.parse(value) > Date.now())) fail('正式文章不能使用未来发布日期或更新时间');
  if (data.pinned !== undefined && typeof data.pinned !== 'boolean') fail('pinned 必须为布尔值');
  if (data.pinOrder !== undefined && (!Number.isInteger(data.pinOrder) || data.pinOrder < 0)) fail('pinOrder 必须是非负整数');
  if (data.featuredOrder !== undefined && (!Number.isInteger(data.featuredOrder) || data.featuredOrder < 1)) fail('featuredOrder 必须是正整数');
  if (data.series !== undefined && (typeof data.series !== 'object' || !data.series || !/^[a-z0-9-]+$/.test(data.series.id ?? '') || !isCalendarDate(data.series.startDate) || data.series.days !== 28 || data.series.timeZone !== 'America/Los_Angeles' || !isIsoTime(data.series.checkedAt))) fail('series 目录需要有效 id、startDate、28 天、America/Los_Angeles 与带时区的 checkedAt');
  if (data.seriesId !== undefined && (typeof data.seriesId !== 'string' || !/^[a-z0-9-]+$/.test(data.seriesId) || !Number.isInteger(data.seriesDay) || data.seriesDay < 1 || data.seriesDay > 28 || !Array.isArray(data.seriesKinds) || !data.seriesKinds.length || new Set(data.seriesKinds).size !== data.seriesKinds.length || data.seriesKinds.some((kind) => !['feature', 'reset', 'banked', 'broadcast'].includes(kind)) || !isIsoTime(data.announcedAt))) fail('系列日文章需要 seriesId、1–28 的 seriesDay、seriesKinds 与带时区的 announcedAt');
  if ((data.seriesDay !== undefined || data.seriesKinds !== undefined || data.announcedAt !== undefined) && !data.seriesId) fail('系列日字段需要 seriesId');
  if (data.series && data.seriesId) fail('系列目录和日文章不能同时设置');
  for (const key of ['cover', 'bannerCover']) if (data[key] !== undefined && (typeof data[key] !== 'string' || !/^\/images\/[a-zA-Z0-9/_-]+\.(png|webp|jpg|jpeg)$/.test(data[key]) || !existsSync(join(ROOT, 'public', data[key])))) fail(`${key} 必须是 public/images 中实际存在的图片`);
  if (data.bannerCover && !data.cover) fail('bannerCover 需要配套的 cover 手机封面');
  if (data.coverAlt !== undefined && (typeof data.coverAlt !== 'string' || !data.coverAlt.trim())) fail('coverAlt 必须是非空替代文本');
  for (const key of ['coverWidth', 'coverHeight']) if (data[key] !== undefined && (!Number.isInteger(data[key]) || data[key] < 1)) fail(`${key} 必须是正整数`);
  const sources = data.sources ?? [];
  if (!Array.isArray(sources) || sources.some((source) => !source?.label || !validUrl(source.url) || source.url.startsWith('#'))) fail('sources 必须有可读名称和有效 https 或站内 URL');
  if (data.status === 'published' && sources.length === 0) fail('正式文章必须至少保留一项来源');
  const corrections = data.corrections ?? [];
  if (!Array.isArray(corrections) || corrections.some((item) => typeof item?.text !== 'string' || !item.text || (!isCalendarDate(item.date) && !isIsoTime(item.date)))) fail('corrections 必须包含有效 date / text');

  const toc = [];
  let headingIndex = 0;
  const parser = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, text }) {
        if (depth === 1) fail('正文从二级标题开始，页面主标题来自 front matter');
        const id = `section-${++headingIndex}`;
        if (depth === 2) toc.push({ id, text: text.replace(/[*_`]/g, '') });
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      html() { fail('正文不接受原始 HTML，请使用 Markdown'); },
    },
    walkTokens(token) {
      if (token.type === 'link' && !validUrl(token.href)) fail(`不允许的链接 ${token.href}`);
      if (token.type === 'image' && (!/^\/images\/[a-zA-Z0-9/_-]+\.(png|webp|jpg|jpeg)$/.test(token.href) || !existsSync(join(ROOT, 'public', token.href)))) fail('正文图片必须是 public/images 中的本地资源');
    },
  });
  const html = parser.parse(content, { async: false });
  if (!content.trim() || toc.length === 0) fail('正文至少需要一个二级标题');
  return {
    id: data.id, slug: data.slug, title: data.title, summary: data.summary,
    locale: data.locale, category: data.category, publishedAt: data.publishedAt,
    ...(data.updatedAt ? { updatedAt: data.updatedAt } : {}),
    status: data.status, pinned: data.pinned ?? false, pinOrder: data.pinOrder ?? 100,
    ...(data.featuredOrder ? { featuredOrder: data.featuredOrder } : {}),
    ...(data.cover ? { cover: data.cover } : {}), ...(data.bannerCover ? { bannerCover: data.bannerCover } : {}), sources, corrections, toc, html,
    ...(data.coverAlt ? { coverAlt: data.coverAlt } : {}), ...(data.coverWidth ? { coverWidth: data.coverWidth } : {}), ...(data.coverHeight ? { coverHeight: data.coverHeight } : {}),
    ...(data.series ? { series: data.series } : {}),
    ...(data.seriesId ? { seriesId: data.seriesId, seriesDay: data.seriesDay, seriesKinds: data.seriesKinds, announcedAt: data.announcedAt } : {}),
  };
}

export function compileGuides({ includePreview = false, directory = join(ROOT, 'content/guides') } = {}) {
  const articles = filesIn(directory).sort().map((file) => compileArticle(readFileSync(file, 'utf8'), file));
  return createManifest(articles, includePreview);
}

export function createManifest(articles, includePreview = false) {
  const paths = new Set();
  const identities = new Set();
  for (const article of articles) {
    const path = guidePath(article.locale, article.slug);
    const identity = `${article.locale}/${article.id}`;
    if (paths.has(path) || identities.has(identity)) throw new Error(`重复的文章路径或语言关联：${path}`);
    paths.add(path); identities.add(identity);
  }
  const visible = articles.filter((article) => article.status === 'published' || (includePreview && article.status === 'preview'));
  const seriesDays = new Set();
  const seriesIndexes = new Set();
  for (const article of articles) {
    const key = `${article.locale}/${article.series?.id ?? article.seriesId}`;
    if (article.series) {
      if (seriesIndexes.has(key)) throw new Error(`重复的系列目录：${key}`);
      seriesIndexes.add(key);
    }
    if (article.seriesId) {
      const dayKey = `${key}/${article.seriesDay}`;
      if (seriesDays.has(dayKey)) throw new Error(`重复的系列日文章：${dayKey}`);
      seriesDays.add(dayKey);
    }
  }
  for (const article of visible.filter((item) => item.seriesId)) {
    if (!visible.some((item) => item.locale === article.locale && item.series?.id === article.seriesId)) throw new Error(`系列日文章缺少同语言、同构建可见的目录：${article.slug}`);
  }
  visible.sort((a, b) => Number(b.pinned) - Number(a.pinned) || (a.pinned && b.pinned ? a.pinOrder - b.pinOrder : 0) || Date.parse(articleDate(b, visible).date) - Date.parse(articleDate(a, visible).date) || (a.seriesId && a.seriesId === b.seriesId ? b.seriesDay - a.seriesDay : 0) || a.slug.localeCompare(b.slug));
  return { previewMode: includePreview, articles: visible };
}
