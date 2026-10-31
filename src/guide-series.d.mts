import type { GuideArticle } from './guides';
export function seriesDate(series: NonNullable<GuideArticle['series']>, day?: number): string;
export function articleDate(article: GuideArticle, articles: GuideArticle[]): { date: string; timeZone: string; kind: 'start' | 'series' | 'published' };
export function seriesCalendar(series: NonNullable<GuideArticle['series']>, articles: GuideArticle[], locale: string): { day: number; date: string; article?: GuideArticle; announcement?: { day: number; kind: 'banked'; sourceDay: number }; sourceArticle?: GuideArticle; pending: boolean }[];
