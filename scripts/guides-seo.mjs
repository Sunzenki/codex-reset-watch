import { editorialPath, guidesPath, guideListTitle, listPath, selectList, pageSize } from '../src/guide-routing.mjs';

export const ORIGIN = 'https://crw.warpnav.com';
export function guideMetadata({ locale, path, articles, previewMode, article, category = 'all', page = 1, editorial = false }, copy) {
  const c = copy[locale];
  const state = selectList(articles, locale, category, page);
  const title = article ? `${article.title} | Codex Reset Watch` : editorial ? `${c.editorialTitle} | Codex Reset Watch` : guideListTitle(c, category, page);
  const landing = c.categoryPages[category];
  const listDescription = landing?.description ?? c.seoDescription;
  const description = article?.summary ?? (editorial ? c.editorialIntro : page > 1 ? c.pageDescription.replace('{page}', String(page)).replace('{description}', listDescription) : listDescription);
  const keywords = article || editorial ? [] : landing?.keywords ?? c.seoKeywords;
  const url = ORIGIN + path;
  const indexable = !previewMode && (editorial || Boolean(article) || (state.filtered.length > 0 && state.valid));
  const alternates = article ? articles.filter((item) => item.id === article.id).map((item) => [item.locale, guidesPath(item.locale, item.slug)])
    : editorial ? Object.keys(copy).map((code) => [code, editorialPath(code)])
    : page === 1 ? Object.keys(copy).filter((code) => selectList(articles, code, category).filtered.length > 0).map((code) => [code, listPath(code, category)]) : [];
  const author = { '@type': 'Organization', name: c.author, url: ORIGIN + editorialPath(locale) + '#editorial-team' };
  const publisher = { '@type': 'Organization', name: 'WarpNav', url: 'https://warpnav.com/' };
  const data = article ? {
    '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description, url,
    mainEntityOfPage: url, inLanguage: locale,
    ...(article.status === 'published' ? { datePublished: article.publishedAt, dateModified: article.updatedAt ?? article.publishedAt } : {}), author, publisher,
    citation: article.sources.map((source) => source.url.startsWith('/') ? ORIGIN + source.url : source.url),
  } : editorial ? {
    '@context': 'https://schema.org', '@type': 'AboutPage', name: title, description, url, inLanguage: locale,
    mainEntity: author, publisher,
  } : {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url, inLanguage: locale,
    mainEntity: { '@type': 'ItemList', numberOfItems: state.visible.length, itemListElement: state.visible.map((item, index) => ({
      '@type': 'ListItem', position: (page - 1) * pageSize + index + 1, name: item.title, url: ORIGIN + guidesPath(locale, item.slug),
    })) },
  };
  return { title, description, keywords, url, alternates, indexable, robots: indexable ? 'index,follow,max-image-preview:large' : 'noindex,follow', data };
}
