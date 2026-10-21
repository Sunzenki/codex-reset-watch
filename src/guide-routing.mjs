export const guideCategories = ['news', 'updates', 'incidents', 'tutorials'];
export const guideLocales = ['en', 'zh-CN', 'zh-TW'];
export const pageSize = 8;
export const guidesPath = (locale, slug = '') => `${locale === 'en' ? '' : `/${locale}`}/guides/${slug ? `${slug}/` : ''}`;
export const editorialPath = (locale) => guidesPath(locale, 'editorial');
export function guideListTitle(copy, category = 'all', page = 1) {
  const [title, brand] = copy.siteTitle.split(/[｜|]/).map((part) => part.trim());
  const subject = category === 'all' ? title : copy.categories[category];
  const separator = copy.siteTitle.includes('｜') ? '｜' : ' | ';
  return `${subject}${page > 1 ? ` · ${copy.pageTitle.replace('{page}', String(page))}` : ''}${separator}${brand}`;
}
export function listPath(locale, category = 'all', page = 1) {
  return guidesPath(locale) + (category === 'all' ? '' : `category/${category}/`) + (page > 1 ? `page/${page}/` : '');
}
export function parseListPath(pathname, locale) {
  const base = guidesPath(locale);
  if (pathname === base || pathname === base.slice(0, -1)) return { category: 'all', page: 1 };
  if (!pathname.startsWith(base)) return null;
  const match = pathname.slice(base.length).match(/^(?:category\/(news|updates|incidents|tutorials)\/)?(?:page\/([2-9]|[1-9][0-9]+)\/)?$/);
  return match ? { category: match[1] ?? 'all', page: Number(match[2] ?? 1) } : null;
}
export function selectList(articles, locale, category = 'all', page = 1) {
  const all = articles.filter((article) => article.locale === locale);
  const filtered = category === 'all' ? all : all.filter((article) => article.category === category);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const valid = (category === 'all' || guideCategories.includes(category)) && Number.isSafeInteger(page) && page >= 1 && page <= totalPages;
  return { category, page, totalPages, all, filtered, visible: valid ? filtered.slice((page - 1) * pageSize, page * pageSize) : [], valid };
}
