import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  currentCopy, historyCopy, localeConfig, localeOptions, localizedSourceTimezone, ui,
  type Locale,
} from './i18n';
import './styles.css';

type Status = 'monitoring' | 'estimated' | 'confirmed' | 'reached' | 'superseded';
type Outcome = 'unverified' | 'as_announced' | 'revised' | 'cancelled';
type Announcement = { source: string; text: string; translation?: string; url: string; postedAt: string };
type CurrentReset = {
  kind?: 'reset' | 'banked_reset' | 'rollout_observed' | 'reset_confirmed'; status: Status; headline?: string; resetAt: string | null; sourceTimezone: string | null;
  originalTimeText: string | null; scope?: string; announcement: Announcement | null;
  updatedAt: string; note?: string;
};
type HistoryRecord = {
  id: string; targetAt: string; precision: 'estimated' | 'confirmed'; originalTimezone: string;
  originalTimeText: string; announcement: Announcement; outcome: Outcome; note: string; recordedAt: string;
};

declare global {
  interface Window {
    __CRW_BOOTSTRAP__?: { current: CurrentReset; history: HistoryRecord[] };
  }
}

const supportedLocales = new Set<Locale>(['en', 'zh-CN', 'zh-TW']);

function routeInfo() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const candidate = parts[0] as Locale | undefined;
  const locale = candidate && supportedLocales.has(candidate) ? candidate : 'en';
  return { locale, isHistory: parts[1] === 'history' };
}

function pagePath(locale: Locale, isHistory: boolean) {
  return `/${locale}/${isHistory ? 'history/' : ''}`;
}

function dateTime(value: string | null, locale: Locale, withSeconds = false) {
  if (!value) return '—';
  const config = localeConfig[locale];
  return new Intl.DateTimeFormat(config.intl, {
    year: 'numeric', month: locale === 'en' ? 'short' : 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: withSeconds ? '2-digit' : undefined,
    hour12: false, timeZone: config.timeZone, timeZoneName: 'short',
  }).format(new Date(value));
}

function localDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(value));
}

function headlineTime(value: string, locale: Locale) {
  const config = localeConfig[locale];
  return new Intl.DateTimeFormat(config.intl, {
    month: locale === 'en' ? 'short' : 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: config.timeZone, timeZoneName: locale === 'en' ? 'short' : undefined,
  }).format(new Date(value));
}

function confirmationHeadlineTime(value: string, locale: Locale, isLandingTime = false) {
  const config = localeConfig[locale];
  const formatted = new Intl.DateTimeFormat(config.intl, {
    year: 'numeric', month: locale === 'en' ? 'short' : 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: config.timeZone,
  }).format(new Date(value));
  if (locale === 'en') return `${formatted} UTC · ${isLandingTime ? 'landed' : 'confirmed'}`;
  if (locale === 'zh-TW') return `${formatted} · ${isLandingTime ? '落地' : '確認'}`;
  return `${formatted} · ${isLandingTime ? '落地' : '确认'}`;
}

function resetHeadline(status: Status, resetAt: string | null, locale: Locale) {
  const copy = ui[locale];
  if (!resetAt || status === 'monitoring') return copy.headline.monitoring;
  if (status === 'reached') return copy.headline.reached;
  if (status === 'superseded') return copy.headline.superseded;
  const time = headlineTime(resetAt, locale);
  if (locale === 'en') return `${copy.headline[status]} ${time}`;
  if (locale === 'zh-CN') return status === 'estimated' ? `预计 ${time} 左右重置` : `预计于 ${time} 重置`;
  return status === 'estimated' ? `預計 ${time} 左右重置` : `預計於 ${time} 重置`;
}

function App() {
  const { locale, isHistory } = routeInfo();
  const copy = ui[locale];
  useEffect(() => {
    document.documentElement.lang = localeConfig[locale].htmlLang;
    document.title = isHistory ? copy.titleHistory : copy.titleCurrent;
  }, [copy, isHistory, locale]);

  return <>
    <a className="skip-link" href="#content">{copy.skip}</a>
    <Header locale={locale} active={isHistory ? 'history' : 'current'} />
    {isHistory ? <HistoryPage locale={locale} /> : <CurrentPage locale={locale} />}
    <Footer locale={locale} />
  </>;
}

function Header({ locale, active }: { locale: Locale; active: 'current' | 'history' }) {
  const copy = ui[locale];
  const selected = localeOptions.find((item) => item.code === locale)!;
  const isHistory = active === 'history';
  return <header className="site-header">
    <a className="wordmark" href={pagePath(locale, false)} aria-label="Codex Reset Watch">
      <picture>
        <source media="(max-width: 520px)" srcSet="/brand-mark.svg" />
        <img src="/logo.svg" alt="Codex Reset Watch" width="202" height="50" />
      </picture>
    </a>
    <div className="header-actions">
      <nav aria-label="Primary navigation">
        <a className={active === 'current' ? 'active' : ''} href={pagePath(locale, false)} aria-current={active === 'current' ? 'page' : undefined}>{copy.navCurrent}</a>
        <a className={active === 'history' ? 'active' : ''} href={pagePath(locale, true)} aria-current={active === 'history' ? 'page' : undefined}>{copy.navHistory}</a>
      </nav>
      <details className="language-menu">
        <summary aria-label={`${copy.language}: ${selected.label}`}><span aria-hidden="true">◎</span><b className="language-full">{selected.label}</b><b className="language-short">{selected.shortLabel}</b><i aria-hidden="true">⌄</i></summary>
        <ul>
          {localeOptions.map((option) => <li key={option.code}>
            <a href={pagePath(option.code, isHistory)} lang={localeConfig[option.code].htmlLang} aria-current={option.code === locale ? 'page' : undefined}>
              <span>{option.label}</span>{option.code === locale && <i aria-hidden="true">✓</i>}
            </a>
          </li>)}
        </ul>
      </details>
    </div>
  </header>;
}

function CurrentPage({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const content = currentCopy[locale];
  const [data, setData] = useState<CurrentReset | null>(() => window.__CRW_BOOTSTRAP__?.current ?? null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    fetch('/data/current.json', { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error('load failed');
      return response.json();
    }).then(setData).catch(() => setError(true));
  }, []);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);

  const remaining = useMemo(() => {
    if (!data?.resetAt) return null;
    const total = Math.max(0, Math.floor((new Date(data.resetAt).getTime() - now) / 1000));
    return { total, days: Math.floor(total / 86400), hours: Math.floor(total % 86400 / 3600), minutes: Math.floor(total % 3600 / 60), seconds: total % 60 };
  }, [data, now]);
  const progress = useMemo(() => {
    if (!data?.resetAt || !data.announcement) return null;
    const start = new Date(data.announcement.postedAt).getTime();
    const end = new Date(data.resetAt).getTime();
    if (end <= start) return null;
    return Math.min(100, Math.max(0, (now - start) / (end - start) * 100));
  }, [data, now]);

  if (error) return <main id="content"><div className="load-error" role="alert"><strong>{copy.loadCurrentError}</strong><p>{copy.checkJson}</p></div></main>;
  if (!data) return <main id="content" className="loading" role="status">{copy.loadingCurrent}</main>;

  const effectiveStatus: Status = remaining?.total === 0 && data.resetAt ? 'reached' : data.status;
  const isRolloutObserved = data.kind === 'rollout_observed';
  const isResetConfirmed = data.kind === 'reset_confirmed';
  const isBankedReset = data.kind === 'banked_reset';
  const isUntimedHint = data.kind === 'reset' && data.status === 'monitoring' && !data.resetAt && Boolean(data.announcement);
  const isLatestUpdate = isRolloutObserved || isResetConfirmed;
  const isReached = effectiveStatus === 'reached' && !isLatestUpdate;
  const tone = isLatestUpdate ? 'positive' : effectiveStatus === 'estimated' ? 'warning' : effectiveStatus === 'confirmed' ? 'positive' : effectiveStatus === 'reached' ? 'reached' : 'neutral';

  return <main id="content">
    <section className="hero-panel">
      <div className={`status-chip ${tone}`}><i aria-hidden="true" />{isResetConfirmed ? copy.resetConfirmedStatus : isRolloutObserved ? copy.rolloutStatus : copy.status[effectiveStatus]}</div>
      <p className="section-label">{isResetConfirmed ? copy.confirmedLabel : isRolloutObserved ? copy.latestLabel : isBankedReset ? copy.bankedLabel : copy.nextLabel}</p>
      <h1>{isResetConfirmed && data.announcement ? <>
        <time className="headline-confirmed-at" dateTime={data.resetAt ?? data.announcement.postedAt}>{confirmationHeadlineTime(data.resetAt ?? data.announcement.postedAt, locale, Boolean(data.resetAt))}</time>
        <span>{content.headline}</span>
      </> : isBankedReset ? isReached ? copy.bankedReachedHeadline : content.headline : isLatestUpdate || isUntimedHint ? content.headline : resetHeadline(effectiveStatus, data.resetAt, locale)}</h1>
      <p className="scope">{content.scope}</p>

      {!isResetConfirmed && !isReached && remaining && data.resetAt ? <>
        <p className="target-time">{dateTime(data.resetAt, locale, true)} <span>{copy.targetZone}</span></p>
        {locale === 'en' && <p className="viewer-time">{copy.localTime}: <strong>{localDateTime(data.resetAt)}</strong></p>}
        <div className="countdown" role="timer" aria-label={isBankedReset ? copy.bankedCountdown : copy.countdown}>
          <Time value={remaining.days} label={copy.units.days} /><i>:</i><Time value={remaining.hours} label={copy.units.hours} /><i>:</i><Time value={remaining.minutes} label={copy.units.minutes} /><i>:</i><Time value={remaining.seconds} label={copy.units.seconds} />
        </div>
        {progress !== null && <div className="time-rail">
          <div className="rail-labels"><span>{copy.railStart}</span><span>{isBankedReset ? copy.bankedRailEnd : copy.railEnd}</span></div>
          <div className="rail-track"><i style={{ left: `${progress}%` }} /><span style={{ width: `${progress}%` }} /></div>
        </div>}
      </> : <div className="quiet-state">{isResetConfirmed ? <span className="confirmed-mark" aria-hidden="true">✓</span> : <span className="radar" aria-hidden="true" />}<div><strong>{isResetConfirmed ? copy.resetConfirmedTitle : isRolloutObserved ? copy.rolloutTimingTitle : isBankedReset && isReached ? copy.bankedReachedTitle : isReached ? copy.reachedTitle : isUntimedHint ? copy.untimedHintTitle : copy.waitingTitle}</strong><p>{isResetConfirmed ? copy.resetConfirmedBody : isRolloutObserved ? copy.rolloutTimingBody : isBankedReset && isReached ? copy.bankedReachedBody : isReached ? copy.reachedBody : isUntimedHint ? copy.untimedHintBody : copy.waitingBody}</p></div></div>}

      <div className="facts">
        <Fact label={copy.factOriginal} value={data.originalTimeText ?? '—'} />
        <Fact label={isResetConfirmed ? copy.factConfirmation : isRolloutObserved ? copy.factTiming : copy.factZone} value={localizedSourceTimezone(data.sourceTimezone, locale)} />
        <Fact label={copy.factUpdated} value={dateTime(data.updatedAt, locale, true)} />
      </div>
    </section>

    <section className="evidence" aria-labelledby="evidence-title">
      <div><p className="section-label">{copy.sourceLabel}</p><h2 id="evidence-title">{copy.evidenceTitle}</h2></div>
      {data.announcement ? <article>
        <p className="source-byline"><span>{copy.source}</span><strong>{data.announcement.source}</strong></p>
        <blockquote lang="en">“{data.announcement.text}”</blockquote>
        <p className="translation">{content.context}</p>
        <p className="editor-note">{content.note}</p>
        <div className="source-row"><span>{copy.postedAt} {dateTime(data.announcement.postedAt, locale, true)}</span><a href={data.announcement.url} target="_blank" rel="noreferrer">{copy.viewPost} <span>↗</span></a></div>
      </article> : <article className="empty-evidence"><strong>{copy.noEvidence}</strong><p>{content.note}</p></article>}
    </section>

    <section className="methodology" aria-labelledby="methodology-title">
      <div className="methodology-heading"><p className="section-label">{copy.methodLabel}</p><h2 id="methodology-title">{copy.methodTitle}</h2><p>{copy.methodIntro}</p></div>
      <div className="method-grid">
        <article><span aria-hidden="true">01</span><h3>{copy.methodSourceTitle}</h3><p>{copy.methodSourceBody}</p></article>
        <article><span aria-hidden="true">02</span><h3>{copy.methodTimeTitle}</h3><p>{copy.methodTimeBody}</p></article>
        <article><span aria-hidden="true">03</span><h3>{copy.methodCountdownTitle}</h3><p>{copy.methodCountdownBody}</p></article>
      </div>
      <p className="data-links"><strong>{copy.machineData}</strong><a href="/data/current.json">{copy.currentData}</a><a href="/data/history.json">{copy.historyData}</a></p>
    </section>

    <a className="history-cta" href={pagePath(locale, true)}><span><small>{copy.archive}</small><strong>{copy.viewHistory}</strong></span><i aria-hidden="true">→</i></a>
  </main>;
}

function HistoryPage({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const [records, setRecords] = useState<HistoryRecord[] | null>(() => {
    const initial = window.__CRW_BOOTSTRAP__?.history;
    return initial ? [...initial].sort((a, b) => +new Date(b.targetAt) - +new Date(a.targetAt)) : null;
  });
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch('/data/history.json', { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error('load failed');
      return response.json();
    }).then((items: HistoryRecord[]) => setRecords([...items].sort((a, b) => +new Date(b.targetAt) - +new Date(a.targetAt)))).catch(() => setError(true));
  }, []);

  if (error) return <main id="content"><div className="load-error" role="alert"><strong>{copy.loadHistoryError}</strong><p>{copy.checkJson}</p></div></main>;
  if (!records) return <main id="content" className="loading" role="status">{copy.loadingHistory}</main>;

  const years = records.reduce<Record<string, HistoryRecord[]>>((groups, record) => {
    const year = String(new Date(record.targetAt).getUTCFullYear());
    (groups[year] ??= []).push(record);
    return groups;
  }, {});

  return <main id="content" className="history-page">
    <section className="history-intro">
      <p className="section-label">{copy.historyLabel}</p>
      <h1>{copy.historyTitle}</h1>
      <p>{copy.historyIntro}</p>
      <div className="archive-stat"><strong>{String(records.length).padStart(2, '0')}</strong><span>{copy.recorded}</span></div>
    </section>

    {records.length === 0 ? <section className="history-empty">
      <span aria-hidden="true">{copy.emptyNumber}</span><div><h2>{copy.emptyTitle}</h2><p>{copy.emptyBody}</p><a href={pagePath(locale, false)}>{copy.back} →</a></div>
    </section> : <div className="timeline">
      {Object.entries(years).sort(([a], [b]) => Number(b) - Number(a)).map(([year, items]) => <section className="year-group" key={year} aria-labelledby={`year-${year}`}>
        <h2 id={`year-${year}`}>{year}</h2>
        <div>{items.map((record) => <HistoryItem key={record.id} record={record} locale={locale} />)}</div>
      </section>)}
    </div>}
  </main>;
}

function HistoryItem({ record, locale }: { record: HistoryRecord; locale: Locale }) {
  const copy = ui[locale];
  const date = new Date(record.targetAt);
  const localized = historyCopy[locale][record.id];
  const dateBlock = new Intl.DateTimeFormat(localeConfig[locale].intl, {
    month: '2-digit', day: '2-digit', timeZone: localeConfig[locale].timeZone,
  }).format(date);
  const weekday = new Intl.DateTimeFormat(localeConfig[locale].intl, {
    weekday: 'short', timeZone: localeConfig[locale].timeZone,
  }).format(date);
  return <article className="history-item" id={record.id}>
    <div className="date-block"><strong>{dateBlock}</strong><span>{weekday}</span></div>
    <div className="timeline-mark"><i /></div>
    <div className="record-card">
      <div className="record-top"><span className={`precision ${record.precision}`}>{record.precision === 'confirmed' ? copy.precise : copy.approximate}</span><span>{copy.outcome[record.outcome]}</span></div>
      <h3>{dateTime(record.targetAt, locale, true)}</h3>
      <p className="original-time">{copy.original}: {record.originalTimeText} · {localizedSourceTimezone(record.originalTimezone, locale)}</p>
      <p className="source-byline"><span>{copy.source}</span><strong>{record.announcement.source}</strong></p>
      <blockquote lang="en">“{record.announcement.text}”</blockquote>
      {localized?.context && <p>{localized.context}</p>}
      <p>{localized?.note ?? record.note}</p>
      <a href={record.announcement.url} target="_blank" rel="noreferrer">{copy.viewPost} ↗</a>
    </div>
  </article>;
}

function Footer({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  return <footer><p>{copy.footer}</p><p className="footer-links"><a href="https://github.com/Sunzenki/codex-reset-watch" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a><a href="https://warpnav.com/" target="_blank" rel="noreferrer">{copy.warpnav} <span aria-hidden="true">↗</span></a></p></footer>;
}

function Time({ value, label }: { value: number; label: string }) { return <span><strong>{String(value).padStart(2, '0')}</strong><small>{label}</small></span>; }
function Fact({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
