// Calendar days are date-only Pacific labels. UTC arithmetic keeps the Nov 1 DST change from shifting cells.
export function seriesDate(series, day = 1) {
  const date = new Date(`${series.startDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + day - 1);
  return date.toISOString().slice(0, 10);
}
export function articleDate(article, articles) {
  const series = article.series ?? articles.find((item) => item.locale === article.locale && item.series?.id === article.seriesId)?.series;
  return series ? { date: seriesDate(series, article.seriesDay ?? 1), timeZone: series.timeZone, kind: article.series ? 'start' : 'series' }
    : { date: article.publishedAt, timeZone: article.locale === 'en' ? 'UTC' : article.locale === 'zh-TW' ? 'Asia/Taipei' : 'Asia/Shanghai', kind: 'published' };
}
export function seriesCalendar(series, articles, locale) {
  const days = articles.filter((article) => article.locale === locale && article.seriesId === series.id);
  const checkedDate = new Intl.DateTimeFormat('en-CA', { timeZone: series.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(series.checkedAt));
  return Array.from({ length: series.days }, (_, index) => {
    const dateKey = seriesDate(series, index + 1);
    return { day: index + 1, date: dateKey, article: days.find((article) => article.seriesDay === index + 1), pending: dateKey <= checkedDate };
  });
}
