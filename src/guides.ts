import data from './generated/guides.json';
import copy from './guides-copy.json';
import type { Locale } from './i18n';
import { guideCategories, guidesPath, listPath, parseListPath, selectList, editorialPath, type ListRoute } from './guide-routing.mjs';

export { guideCategories, guidesPath, editorialPath };
export type GuideCategory = typeof guideCategories[number];
export type GuideArticle = {
  id: string; slug: string; title: string; summary: string; locale: Locale;
  category: GuideCategory; publishedAt: string; updatedAt?: string;
  status: 'published' | 'preview'; pinned: boolean; pinOrder: number;
  featuredOrder?: number; cover?: string; bannerCover?: string; coverAlt?: string; coverWidth?: number; coverHeight?: number; html: string;
  sources: { label: string; url: string }[];
  corrections: { date: string; text: string }[];
  toc: { id: string; text: string }[];
  series?: { id: string; startDate: string; days: number; timeZone: string; checkedAt: string };
  seriesId?: string; seriesDay?: number; seriesKinds?: ('feature' | 'reset' | 'banked' | 'broadcast')[]; announcedAt?: string;
};
export const guideManifest = data as { previewMode: boolean; articles: GuideArticle[] };
export const guideCopy = copy;
export const articlesFor = (locale: Locale) => guideManifest.articles.filter((article) => article.locale === locale);
export const findArticle = (locale: Locale, slug?: string) => articlesFor(locale).find((article) => article.slug === slug);

export function guideLanguagePath(locale: Locale, article?: GuideArticle) {
  if (!article) return guidesPath(locale);
  const translated = articlesFor(locale).find((item) => item.id === article.id);
  return translated ? guidesPath(locale, translated.slug) : `${guidesPath(locale)}?untranslated=1`;
}

export function listState(locale: Locale, route?: ListRoute) {
  const search = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const pathRoute = route ?? (typeof window === 'undefined' ? null : parseListPath(window.location.pathname, locale));
  // Article parameters only preserve the return destination; list content uses its static path.
  const category = pathRoute?.category ?? (guideCategories.find((value) => value === search.get('category')) ?? 'all');
  const requested = Number(search.get('page') ?? 1);
  const page = pathRoute?.page ?? (Number.isSafeInteger(requested) && requested > 0 ? requested : 1);
  const state = selectList(guideManifest.articles, locale, category, page);
  const safeState = !pathRoute && !state.valid ? selectList(guideManifest.articles, locale, category, Math.min(state.totalPages, Math.max(1, page))) : state;
  return { ...safeState, untranslated: search.has('untranslated') };
}

export function listLink(locale: Locale, category = 'all', page = 1) {
  return listPath(locale, category, page);
}

export function articleLink(article: GuideArticle, category = 'all', page = 1) {
  const params = new URLSearchParams();
  if (category !== 'all' && guideCategories.includes(category as GuideCategory)) params.set('category', category);
  if (page > 1) params.set('page', String(page));
  return guidesPath(article.locale, article.slug) + (params.size ? `?${params}` : '');
}
