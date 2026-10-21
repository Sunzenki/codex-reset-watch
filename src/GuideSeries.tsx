import { ArrowLeft, ArrowRight, ArrowUpRight } from './icons';
import { articlesFor, guideCopy, guidesPath, type GuideArticle } from './guides';
import { seriesCalendar } from './guide-series.mjs';
import type { Locale } from './i18n';

export function GuideSeriesGrid({ article, locale }: { article: GuideArticle; locale: Locale }) {
  const series = article.series!;
  const copy = guideCopy[locale];
  const entries = seriesCalendar(series, articlesFor(locale), locale);
  const covered = entries.filter((entry) => entry.article);
  const features = covered.filter((entry) => entry.article?.seriesKinds?.includes('feature')).length;
  const resets = covered.filter((entry) => entry.article?.seriesKinds?.some((kind) => kind === 'reset' || kind === 'banked')).length;
  const format = (value: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...options, timeZone: series.timeZone }).format(new Date(value));
  return <section className="guide-series" aria-label={copy.seriesCalendar}>
    <div className="series-stats"><div><span>{copy.seriesCovered}</span><strong>{covered.length}<small> / {series.days}</small></strong></div><div><span>{copy.seriesFeatures}</span><strong>{features}<small> {copy.seriesDays}</small></strong></div><div><span>{copy.seriesResets}</span><strong>{resets}<small> {copy.seriesDays}</small></strong></div><div className="series-checked"><span>{copy.seriesChecked}</span><time dateTime={series.checkedAt}>{format(series.checkedAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })} {copy.pacificTime}</time></div></div>
    <p className="series-time-note">{copy.seriesTimeNote}</p>
    <div className="series-legend" aria-label={copy.seriesLegend}><span className="legend-feature">{copy.seriesKind.feature}</span><span className="legend-reset">{copy.seriesKind.reset}</span><span className="legend-mixed">{copy.seriesMixed}</span><span className="legend-banked">{copy.seriesKind.banked}</span><span className="legend-pending">{copy.seriesUnconfirmed}</span></div>
    <ol className="series-calendar">{entries.map(({ day, date, article: daily, pending }) => {
      const kind = daily?.seriesKinds ?? [];
      const content = <><div className="series-day-heading"><strong>DAY {day}</strong><time dateTime={date}>{format(`${date}T12:00:00Z`, { month: 'numeric', day: 'numeric' })}</time></div><div className="series-kinds">{daily ? kind.map((value) => <span key={value} className={`series-kind kind-${value}`}>{copy.seriesKind[value]}</span>) : <span className="series-kind kind-pending">{pending ? copy.seriesPending : copy.seriesUpcoming}</span>}</div>{daily ? <><h3>{daily.title.replace(/^(?:Tibo['’]s )?Day \d+\s*[｜|]\s*/, '')}</h3><p>{daily.summary}</p><span className="series-open">{copy.readArticle}<ArrowUpRight size={14} /></span></> : <p className="series-awaiting">{pending ? copy.seriesAwaitingVerification : copy.seriesAwaiting}</p>}</>;
      return <li key={day} className={`series-cell${daily ? ' has-article' : ''}${kind.map((value) => ` has-${value}`).join('')}`}>{daily ? <a href={guidesPath(locale, daily.slug)}>{content}</a> : <div>{content}</div>}</li>;
    })}</ol>
  </section>;
}

export function GuideSeriesNavigation({ article, locale }: { article: GuideArticle; locale: Locale }) {
  const all = articlesFor(locale);
  const index = all.find((item) => item.series?.id === article.seriesId);
  if (!index) return null;
  const previous = all.find((item) => item.seriesId === article.seriesId && item.seriesDay === article.seriesDay! - 1);
  const next = all.find((item) => item.seriesId === article.seriesId && item.seriesDay === article.seriesDay! + 1);
  const copy = guideCopy[locale];
  return <nav className="series-navigation" aria-label={copy.seriesNavigation}><a className="series-index-link" href={guidesPath(locale, index.slug)}><span>{index.title}</span><strong>DAY {article.seriesDay} / {index.series!.days}</strong></a><div>{previous && <a href={guidesPath(locale, previous.slug)}><ArrowLeft size={15} />DAY {previous.seriesDay}</a>}{next && <a href={guidesPath(locale, next.slug)}>DAY {next.seriesDay}<ArrowRight size={15} /></a>}</div></nav>;
}
