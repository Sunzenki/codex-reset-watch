import { type HistoryMeta } from './history-meta';
import { journalCopy } from './journal-copy';
import friendLinkData from './friend-links.json';
import { inspectPushState, withPushRegistration } from './push-state';
import { ResetCalendar } from './ResetCalendar';
import { IconContext, iconDefaults, BookOpen, ArrowClockwise, ArrowUp, ArrowUpRight, ArrowRight, Bell, BellSlash, CheckCircle, CaretDown, Clock, ClockCounterClockwise, Globe, Info, Link, Timer, List, Newspaper, Quotes, X } from './icons';
import { GuideArticlePage, GuideNotFound, GuidesPage, GuideEditorialPage } from './GuidesPage';
import { findArticle, guideCopy, guideLanguagePath, guidesPath, editorialPath, listState, type GuideArticle } from './guides';
import { guideListTitle, parseListPath } from './guide-routing.mjs';
import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  currentCopy, historyCopy, localeConfig, localeOptions, localizedSourceTimezone, ui,
  type Locale,
} from './i18n';
import './styles.css';
import './calendar.css';
import './journal.css';
import './journal-history.css';
import './forest.css';
import './guides.css';

type Status = 'monitoring' | 'estimated' | 'confirmed' | 'reached' | 'superseded';
type Outcome = 'unverified' | 'as_announced' | 'revised' | 'cancelled';
type Announcement = { source: string; text: string; translation?: string; url: string; postedAt: string };
type CurrentReset = {
  confirmationBasis?: 'owner_observed'; observationBasis?: 'owner_account' | 'user_report'; kind?: 'reset' | 'banked_reset' | 'rollout_observed' | 'reset_confirmed'; status: Status; headline?: string; resetAt: string | null; sourceTimezone: string | null;
  originalTimeText: string | null; scope?: string; announcement: Announcement | null;
  deadlineEstimated?: boolean; dateConfirmed?: boolean; timingSource?: Announcement; updatedAt: string; note?: string;
};
type HistoryRecord = HistoryMeta & {
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
  const remaining = candidate && supportedLocales.has(candidate) ? parts.slice(1) : parts;
  const section = remaining.length === 0 ? 'current'
    : remaining.length === 1 && remaining[0] === 'history' ? 'history'
    : parseListPath(window.location.pathname, locale) ? 'guides'
    : remaining[0] === 'guides' && remaining[1] === 'editorial' && remaining.length === 2 ? 'editorial'
    : remaining[0] === 'guides' && remaining.length === 2 ? 'article' : 'notFound';
  return { locale, isHistory: section === 'history', section, slug: remaining[1] ?? '' } as const;
}

function pagePath(locale: Locale, isHistory: boolean) {
  if (locale === 'en') return isHistory ? '/history/' : '/';
  return `/${locale}/${isHistory ? 'history/' : ''}`;
}

function dateTime(value: string | null, locale: Locale, withSeconds = false) {
  if (!value) return '—';
  const config = localeConfig[locale];
  return new Intl.DateTimeFormat(config.intl, {
    year: 'numeric', month: locale === 'en' ? 'short' : 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: withSeconds ? '2-digit' : undefined,
    hour12: false, timeZone: config.timeZone, timeZoneName: 'short',
  }).format(new Date(value)).replace(/GMT/g, 'UTC');
}

function postPublishedTime(value: string, locale: Locale) {
  const config = localeConfig[locale];
  const formatted = new Intl.DateTimeFormat(config.intl, {
    year: 'numeric', month: locale === 'en' ? 'short' : 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: config.timeZone,
  }).format(new Date(value)).replace(/GMT/g, 'UTC');
  return locale === 'en' ? formatted + ' (UTC)' : formatted + ' UTC+8';
}

function pstPostTime(value: string) {
  const shifted = new Date(new Date(value).getTime() - 8 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16).replace('T', ' ') + ' PST（UTC−8）';
}

function pacificPostTime(value: string) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: 'America/Los_Angeles', timeZoneName: 'short',
  }).format(new Date(value)).replace(/GMT/g, 'UTC');
}

function localDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(value)).replace(/GMT/g, 'UTC');
}

function headlineTime(value: string, locale: Locale) {
  const config = localeConfig[locale];
  return new Intl.DateTimeFormat(config.intl, {
    month: locale === 'en' ? 'short' : 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: config.timeZone, timeZoneName: locale === 'en' ? 'short' : undefined,
  }).format(new Date(value)).replace(/GMT/g, 'UTC');
}

function confirmationHeadlineTime(value: string, locale: Locale, isLandingTime = false) {
  const config = localeConfig[locale];
  const formatted = new Intl.DateTimeFormat(config.intl, {
    year: 'numeric', month: locale === 'en' ? 'short' : 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: config.timeZone,
  }).format(new Date(value)).replace(/GMT/g, 'UTC');
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
  const { locale, isHistory, section, slug } = routeInfo();
  const copy = ui[locale];
  const article = section === 'article' ? findArticle(locale, slug) : undefined;
  const missing = section === 'notFound' || (section === 'article' && !article) || (section === 'guides' && !listState(locale).valid);
  useEffect(() => {
    document.documentElement.lang = localeConfig[locale].htmlLang;
    document.documentElement.dataset.section = section === 'editorial' ? 'article' : section;
    const guideRoute = section === 'guides' ? listState(locale) : undefined;
    document.title = missing ? guideCopy[locale].notFound : section === 'editorial' ? `${guideCopy[locale].editorialTitle} | Codex Reset Watch` : guideRoute ? guideListTitle(guideCopy[locale], guideRoute.category, guideRoute.page)
      : section === 'article' ? article ? `${article.title} | Codex Reset Watch` : guideCopy[locale].notFound
      : isHistory ? copy.titleHistory : copy.titleCurrent;
    if (missing) {
      document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex,nofollow');
      document.querySelectorAll('link[rel="canonical"],link[rel="alternate"],script[type="application/ld+json"]').forEach((node) => node.remove());
    }
  }, [copy, isHistory, locale, section, article, missing]);
  useEffect(() => {
    if (section !== 'current' || window.location.hash !== '#push-reminder') return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('push-reminder')?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [section]);

  return <>
    <a className="skip-link" href="#content">{copy.skip}</a>
    <Header locale={locale} active={section === 'current' ? 'current' : isHistory ? 'history' : 'guides'} article={article} />
    {missing ? <GuideNotFound locale={locale} /> : section === 'editorial' ? <GuideEditorialPage locale={locale} /> : section === 'guides' ? <GuidesPage locale={locale} /> : section === 'article' ? <GuideArticlePage locale={locale} slug={slug} /> : isHistory ? <HistoryPage locale={locale} /> : <CurrentPage locale={locale} />}
    <PageTools locale={locale} />
    <Footer locale={locale} showFriends={section === 'current' && !missing} />
  </>;
}

function Header({ locale, active, article }: { locale: Locale; active: 'current' | 'history' | 'guides'; article?: GuideArticle }) {
  const copy = ui[locale];
  const selected = localeOptions.find((item) => item.code === locale)!;
  const isHistory = active === 'history';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const languageRef = useRef<HTMLDetailsElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      if (headerRef.current?.contains(event.target as Node)) return;
      setMobileNavOpen(false);
      languageRef.current?.removeAttribute('open');
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      const wasOpen = mobileNavOpen;
      setMobileNavOpen(false);
      languageRef.current?.removeAttribute('open');
      if (wasOpen) menuButtonRef.current?.focus();
    }
    document.addEventListener('pointerdown', closeMenus);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeMenus);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileNavOpen]);

  function toggleMobileNav() {
    languageRef.current?.removeAttribute('open');
    setMobileNavOpen((open) => !open);
  }

  return <header className="site-header" ref={headerRef}>
    <a className="wordmark" href={pagePath(locale, false)} aria-label="Codex Reset Watch">
      <img src="/images/forest-logo.png" alt="Codex Reset Watch" width="202" height="50" />
    </a>
    <div className="header-actions">
      <nav id="primary-navigation" className={mobileNavOpen ? 'mobile-nav-open' : ''} aria-label="Primary navigation">
        <a onClick={() => setMobileNavOpen(false)} className={active === 'current' ? 'active' : ''} href={pagePath(locale, false)} aria-current={active === 'current' ? 'page' : undefined}><Newspaper size={16} />{copy.navCurrent}</a>
        <a onClick={() => setMobileNavOpen(false)} className={active === 'history' ? 'active' : ''} href={pagePath(locale, true)} aria-current={active === 'history' ? 'page' : undefined}><ClockCounterClockwise size={16} />{copy.navHistory}</a>
        <a onClick={() => setMobileNavOpen(false)} className={active === 'guides' ? 'active' : ''} href={guidesPath(locale)} aria-current={active === 'guides' ? 'page' : undefined}><BookOpen size={17} />{guideCopy[locale].title}</a>
      </nav>
      <details className="language-menu" ref={languageRef} onToggle={(event) => {
        if (event.currentTarget.open) setMobileNavOpen(false);
      }}>
        <summary aria-label={`${copy.language}: ${selected.label}`}><Globe size={19} aria-hidden="true" /><b className="language-full">{selected.label}</b><b className="language-short">{selected.shortLabel}</b><CaretDown size={13} aria-hidden="true" /></summary>
        <ul>
          {localeOptions.map((option) => <li key={option.code}>
            <a href={active === 'guides' ? window.location.pathname.endsWith('/editorial/') ? editorialPath(option.code) : guideLanguagePath(option.code, article) : pagePath(option.code, isHistory)} lang={localeConfig[option.code].htmlLang} aria-current={option.code === locale ? 'page' : undefined}>
              <span>{option.label}</span>{option.code === locale && <CheckCircle size={16} aria-hidden="true" />}
            </a>
          </li>)}
        </ul>
      </details>
      <button
        className="mobile-menu-toggle"
        type="button"
        ref={menuButtonRef}
        aria-expanded={mobileNavOpen}
        aria-controls="primary-navigation"
        aria-label={mobileNavOpen ? copy.navMenuClose : copy.navMenu}
        onClick={toggleMobileNav}
      >
        {mobileNavOpen ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
        <span>{copy.navMenu}</span>
      </button>
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
  const isOwnerObserved = data.confirmationBasis === 'owner_observed';
  const isResetConfirmed = data.kind === 'reset_confirmed';
  const isBankedReset = data.kind === 'banked_reset';
  const isBankedLoading = isBankedReset && data.status === 'monitoring' && Boolean(data.announcement);
  const isBankedReported = isBankedReset && data.observationBasis === 'user_report';
  const isBankedObserved = isBankedReset && (data.observationBasis === 'owner_account' || isBankedReported);
  const isUntimedHint = data.kind === 'reset' && data.status === 'monitoring' && !data.resetAt && Boolean(data.announcement);
  const isLatestUpdate = isRolloutObserved || isResetConfirmed;
  const isReached = effectiveStatus === 'reached' && !isLatestUpdate;
  const tone = isLatestUpdate || isBankedLoading ? 'positive' : effectiveStatus === 'estimated' ? 'warning' : effectiveStatus === 'confirmed' ? 'positive' : effectiveStatus === 'reached' ? 'reached' : 'neutral';

  const journal = journalCopy[locale];
  const displayAt = isOwnerObserved ? data.updatedAt : data.resetAt ?? data.announcement?.postedAt ?? data.updatedAt;
  const headline = isResetConfirmed ? content.headline : data.deadlineEstimated ? isReached ? copy.deadlineReached : content.headline : data.dateConfirmed && !isReached ? content.headline : isBankedReset ? isReached ? copy.bankedReachedHeadline : content.headline : isLatestUpdate || isUntimedHint ? content.headline : resetHeadline(effectiveStatus, data.resetAt, locale);
  const titleParts = headline.match(/^((?:Tibo['’]s )?Day\s+\d+(?:\/\d+)?|第\s*\d+\s*天)\s*[|｜]?\s*(.+)$/);
  const statusLabel = data.deadlineEstimated ? isReached ? copy.deadlineReached : copy.deadlineStatus : isResetConfirmed ? isOwnerObserved ? copy.ownerResetTitle : copy.resetConfirmedStatus : isRolloutObserved ? copy.rolloutStatus : isBankedObserved ? (isBankedReported ? copy.bankedReportedStatus : copy.bankedObservedStatus) : isBankedLoading ? copy.bankedLoadingStatus : isUntimedHint ? copy.untimedStatus : data.dateConfirmed && !isReached ? copy.dateConfirmedStatus : copy.status[effectiveStatus];
  const body = isResetConfirmed ? isOwnerObserved ? copy.ownerResetBody : journal.confirmation : isRolloutObserved ? copy.rolloutTimingBody : isBankedObserved ? isBankedReported ? copy.bankedReportedBody : copy.bankedObservedBody : isReached ? copy.reachedBody : isUntimedHint ? copy.untimedHintBody : isBankedLoading ? copy.bankedPendingBody : copy.waitingBody;

  return <main id="content" className="journal-page">
    <section className="journal-entry" aria-labelledby="latest-title">
      <JournalDate value={displayAt} locale={locale} />
      <div className="journal-story">
        <div className={`status-chip ${tone}`}>{isLatestUpdate || isBankedObserved ? <CheckCircle size={17} weight="fill" aria-hidden="true" /> : <Clock size={17} aria-hidden="true" />}{statusLabel}</div>
        <h1 id="latest-title">{titleParts ? <><span className={titleParts[1].startsWith('Tibo') ? undefined : 'journal-title-prefix'}>{titleParts[1]}</span>{' '}<span>{titleParts[2]}</span></> : headline}</h1>
        <p className="journal-scope">{content.scope}</p>
        {!isResetConfirmed && !isReached && remaining && data.resetAt ? <div className="journal-countdown">
          <p className="target-time">{data.deadlineEstimated ? copy.deadlineLabel : copy.countdown} · {postPublishedTime(data.resetAt, locale)}</p>
          {locale === 'en' && <p className="viewer-time">{copy.localTime}: <strong>{localDateTime(data.resetAt)}</strong></p>}
          <div className="countdown" role="timer" aria-label={data.deadlineEstimated ? copy.deadlineLabel : copy.countdown}><Time value={remaining.days} label={copy.units.days} /><i>:</i><Time value={remaining.hours} label={copy.units.hours} /><i>:</i><Time value={remaining.minutes} label={copy.units.minutes} /><i>:</i><Time value={remaining.seconds} label={copy.units.seconds} /></div>
          {progress !== null && <div className="journal-progress" aria-hidden="true"><span style={{width: `${progress}%`}} /></div>}
        </div> : !isResetConfirmed ? <p className="journal-state-note"><Info size={17} aria-hidden="true" />{body}</p> : null}
        <div className="journal-actions"><PushReminder locale={locale} compact /></div>
      </div>
      <aside className="journal-source" aria-label={copy.evidenceTitle}>
        {data.announcement ? <>
          <div className="journal-source-note">
            <Quotes size={29} weight="fill" aria-hidden="true" />
            <p className="journal-author">{data.announcement.source.replace(' / X post', '').replace(' / X reply', '')}{content.sourceExcerpt && <> · {copy.sourceExcerptLabel}</>}</p>
            <blockquote lang="en">{content.sourceExcerpt || data.announcement.text}</blockquote>
            {locale !== 'en' && (content.sourceTranslation || data.announcement.translation) && <p className="journal-translation" lang={content.sourceTranslation ? localeConfig[locale].htmlLang : 'zh-CN'}>{content.sourceTranslation || data.announcement.translation}</p>}
            <a className="journal-text-link journal-quote-link" href={data.announcement.url} target="_blank" rel="noreferrer">{journal.source}<ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>

        </> : <div className="journal-empty-source"><Quotes size={28} aria-hidden="true" /><p>{copy.noEvidence}</p></div>}
      </aside>

      <div className="journal-metadata">
        <Fact label={copy.factOriginal} value={data.originalTimeText ?? '—'} />
        <Fact label={copy.confirmationPostTime} value={data.announcement ? pstPostTime(data.announcement.postedAt) : '—'} />
        <Fact label={copy.factUpdated} value={postPublishedTime(data.updatedAt, locale)} />
      </div>
    </section>
    <section className="journal-event-context" id="event-context" aria-labelledby="event-context-title">
      <h2 id="event-context-title">{copy.evidenceTitle}</h2>
      <div className="evidence-sheet">
        {data.announcement && <p className="evidence-byline"><strong>{data.announcement.source.replace(" / X post", " · X").replace(" / X reply", " · X")}</strong></p>}
        <p className="evidence-context">{content.context}</p>
        <div className="evidence-note">{(content.note.split(/(?<=[。！？])|(?<=[.!?])\s+/).filter(Boolean)).map((sentence, index) => <p key={index}>{index === 0 ? <mark>{sentence.trim()}</mark> : sentence.trim()}</p>)}</div>
        <p className="evidence-original"><strong>{copy.factOriginal}: </strong>{data.originalTimeText ?? '—'} · {localizedSourceTimezone(data.sourceTimezone, locale)}</p>
        <div className="evidence-footer">
          {data.announcement && <time dateTime={data.announcement.postedAt}>{copy.postedAt} {postPublishedTime(data.announcement.postedAt, locale)}</time>}
          {data.announcement && <div className="journal-source-links"><a href={data.announcement.url} target="_blank" rel="noreferrer">{copy.viewPost}<ArrowUpRight size={15} aria-hidden="true" /></a>{data.timingSource && <a href={data.timingSource.url} target="_blank" rel="noreferrer">{copy.viewTimingPost}<ArrowUpRight size={15} aria-hidden="true" /></a>}</div>}
        </div>
      </div>
    </section>
    <RecentResets locale={locale} currentUrl={data.announcement?.url} />
    <section className="journal-notices" id="source-notes" aria-labelledby="method-title">
      <h2 id="method-title">{copy.methodTitle}</h2>
      <div className="notice-grid">
        <article className="notice-paper notice-source"><Link size={40} aria-hidden="true" /><h3>{copy.methodSourceTitle}</h3><p>{copy.methodSourceBody}</p></article>
        <article className="notice-paper notice-time"><Clock size={40} aria-hidden="true" /><h3>{copy.methodTimeTitle}</h3><p>{copy.methodTimeBody}</p></article>
        <article className="notice-paper notice-countdown"><Timer size={40} aria-hidden="true" /><h3>{copy.methodCountdownTitle}</h3><p>{copy.methodCountdownBody}<strong>{copy.methodCountdownWarning}</strong></p></article>
      </div>
      <p className="data-links"><span>{copy.machineData}</span><a href="/data/current.json">{copy.currentData}</a><a href="/data/history.json">{copy.historyData}</a></p>
    </section>
  </main>;
}



function JournalDate({value,locale}: {value:string;locale:Locale}) {
  const zone = localeConfig[locale].timeZone;
  const part=(options:Intl.DateTimeFormatOptions, lang='en-US')=>new Intl.DateTimeFormat(lang,{...options,timeZone:zone}).format(new Date(value)).replace(/GMT/g, 'UTC');
  return <div className="journal-date"><small>{part({year:'numeric'})}</small><strong>{part({day:'2-digit'})}</strong><span>{part({month:'short'}).toUpperCase()}</span><span className="journal-weekday">{part({weekday:'long'},localeConfig[locale].intl)}</span></div>;
}

function RecentResets({locale,currentUrl}: {locale:Locale;currentUrl?:string}) {
  const j=journalCopy[locale],copy=ui[locale];
  const [records,setRecords]=useState<HistoryRecord[]>(()=>window.__CRW_BOOTSTRAP__?.history??[]);
  useEffect(()=>{let live=true;fetch('/data/history.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{if(live)setRecords(d);}).catch(()=>{});return()=>{live=false;};},[]);
  const recent=[...records].filter(r=>r.announcement.url!==currentUrl&&r.eventType!=='rule_change').sort((a,b)=>Date.parse(b.targetAt)-Date.parse(a.targetAt)).slice(0,3);
  return <section className="journal-recent" aria-labelledby="recent-title"><div className="journal-recent-heading"><h2 id="recent-title">{j.recent}</h2></div><div className="journal-recent-list">{recent.length?recent.map(r=>{
    const day=r.id.match(/day(\d+)/)?.[1];
    const completed = r.timeBasis === 'confirmation' || (r.eventType === 'reset' && r.timeBasis === 'observation' && r.outcome === 'as_announced');
    return <a key={r.id} className={`journal-recent-row ${r.resetType}`} href={pagePath(locale,true)+'#'+r.id}><time dateTime={r.targetAt}>{new Intl.DateTimeFormat(localeConfig[locale].intl,{month:'2-digit',day:'2-digit',timeZone:localeConfig[locale].timeZone}).format(new Date(r.targetAt))}</time><span className="journal-row-marker" aria-hidden="true" /><strong>{day?j.day(day)+' ':''}{r.resetType==='banked'?j.banked:j.global}</strong><span className="journal-result">{completed?j.completed:r.eventType==='announcement'?j.announced:copy.outcome[r.outcome]}</span><ArrowRight size={16} aria-hidden="true" /></a>;
  }):<p>{j.noRecent}</p>}<a className="journal-text-link journal-all-history" href={pagePath(locale,true)}>{j.all}<ArrowRight size={18} aria-hidden="true" /></a></div></section>;
}

type StoredPush = { endpoint: string; token: string };
type PushState = 'loading' | 'unsupported' | 'off' | 'on' | 'denied' | 'busy' | 'unavailable' | 'error';
const pushStorageKey = 'crw-push-subscription-v1';

function applicationServerKey(value: string) {
  const padded = `${value}${'='.repeat((4 - value.length % 4) % 4)}`.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function PushReminder({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const copy = ui[locale];
  const [state, setState] = useState<PushState>('loading');
  const [publicKey, setPublicKey] = useState('');

  async function readState() {
    return inspectPushState({
      supported: 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window,
      permission: 'Notification' in window ? Notification.permission : 'default',
      getSubscription: async () => {
        const registration = await navigator.serviceWorker.getRegistration('/push-sw.js');
        return await registration?.pushManager.getSubscription() ?? null;
      },
      loadPublicKey: async () => {
        const response = await fetch('/api/push/config');
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('config unavailable');
        const config = await response.json() as { publicKey?: unknown };
        return config.publicKey;
      },
    });
  }

  useEffect(() => {
    let active = true;
    void readState().then((result) => {
      if (!active) return;
      setPublicKey(result.publicKey ?? '');
      setState(result.state);
    });
    return () => { active = false; };
  }, []);

  async function retry() {
    setState('loading');
    const result = await readState();
    setPublicKey(result.publicKey ?? '');
    setState(result.state);
  }

  async function enable() {
    setState('busy');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'off');
        return;
      }
      const registration = await navigator.serviceWorker.register('/push-sw.js');
      await withPushRegistration({
        getSubscription: () => registration.pushManager.getSubscription(),
        createSubscription: () => registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: applicationServerKey(publicKey) }),
        registerSubscription: async (subscription) => {
          const response = await fetch('/api/push/subscribe', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ subscription: subscription.toJSON(), locale }),
          });
          if (!response.ok) throw new Error('subscribe failed');
          const result = await response.json() as { token: string };
          if (typeof result.token !== 'string' || !result.token) throw new Error('subscribe response invalid');
          localStorage.setItem(pushStorageKey, JSON.stringify({ endpoint: subscription.endpoint, token: result.token } satisfies StoredPush));
        },
      });
      setState('on');
    } catch {
      setState('error');
    }
  }

  async function disable() {
    setState('busy');
    try {
      const registration = await navigator.serviceWorker.getRegistration('/push-sw.js');
      const subscription = await registration?.pushManager.getSubscription();
      const stored = JSON.parse(localStorage.getItem(pushStorageKey) ?? 'null') as StoredPush | null;
      if (stored) {
        const response = await fetch('/api/push/unsubscribe', {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(stored),
        });
        if (!response.ok) throw new Error('unsubscribe failed');
      }
      await subscription?.unsubscribe();
      localStorage.removeItem(pushStorageKey);
      await retry();
    } catch {
      setState('error');
    }
  }

  const isLocalPreview = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  const localUnavailable = isLocalPreview && state === 'unavailable';
  const canRetry = !localUnavailable && (state === 'unavailable' || state === 'error');
  const message = state === 'on' ? copy.pushEnabled : state === 'denied' ? copy.pushDenied : state === 'unsupported' ? copy.pushUnsupported : state === 'unavailable' ? isLocalPreview ? copy.pushLocalPreview : copy.pushUnavailable : state === 'error' ? copy.pushError : copy.pushBody;
  const buttonLabel = localUnavailable ? copy.pushPreviewUnavailable : state === 'busy' || state === 'loading' ? copy.pushWorking : state === 'on' ? copy.pushDisable : canRetry ? copy.pushRetry : compact ? journalCopy[locale].enable : copy.pushEnable;
  const action = state === 'on' ? disable : canRetry ? retry : enable;
  const disabled = localUnavailable || state === 'loading' || state === 'busy' || state === 'unsupported' || state === 'denied';
  const ReminderIcon = state === 'on' ? BellSlash : canRetry ? ArrowClockwise : state === 'loading' || state === 'busy' ? Clock : Bell;
  if (compact) return <div className="journal-reminder" id="push-reminder" data-push-state={state}><button className="journal-primary" type="button" onClick={action} disabled={disabled} aria-describedby="reminder-status"><ReminderIcon size={19} aria-hidden="true" />{buttonLabel}</button><p id="reminder-status" role="status">{state === 'off' ? journalCopy[locale].reminderHint : message}</p>{isLocalPreview && (state === 'unavailable' || state === 'unsupported') && <a className="journal-reminder-live" href={`https://crw.warpnav.com${pagePath(locale, false)}#push-reminder`} target="_blank" rel="noreferrer">{copy.pushManageLive}<ArrowUpRight size={14} aria-hidden="true" /></a>}</div>;
  return <section className="push-reminder" id="push-reminder" aria-labelledby="push-reminder-title">
    <div className="push-icon" aria-hidden="true">
      <Bell size={26} />
    </div>
    <div><p className="section-label">{copy.pushLabel}</p><h2 id="push-reminder-title">{copy.pushTitle}</h2><p role="status">{message}</p></div>
    <button type="button" onClick={action} disabled={disabled}>
      <ReminderIcon size={18} />{buttonLabel}
    </button>
  </section>;
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

    <ResetCalendar records={records} locale={locale} />
    {records.length === 0 ? <section className="history-empty">
      <span aria-hidden="true">{copy.emptyNumber}</span><div><h2>{copy.emptyTitle}</h2><p>{copy.emptyBody}</p><a href={pagePath(locale, false)}>{copy.back}<ArrowRight size={18} /></a></div>
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
      <a href={record.announcement.url} target="_blank" rel="noreferrer">{copy.viewPost}<ArrowUpRight size={16} /></a>
    </div>
  </article>;
}

function PageTools({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const [overContent, setOverContent] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const labels: Record<Locale, { group: string; refresh: string; top: string; topShort: string }> = {
    en: { group: 'Page tools', refresh: 'Refresh', top: 'Back to top', topShort: 'Top' },
    'zh-CN': { group: '页面工具', refresh: '刷新', top: '返回顶部', topShort: '顶部' },
    'zh-TW': { group: '頁面工具', refresh: '重新整理', top: '返回頂部', topShort: '頂部' },
  };

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const tools = toolsRef.current;
    const content = document.querySelector('main');
    if (!tools || !content) return;

    const updateOverlap = () => {
      const toolsRect = tools.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      setOverContent(toolsRect.left < contentRect.right + 12);
    };

    updateOverlap();
    window.addEventListener('resize', updateOverlap);
    const observer = new ResizeObserver(updateOverlap);
    observer.observe(content);
    observer.observe(tools);
    return () => {
      window.removeEventListener('resize', updateOverlap);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return <div ref={toolsRef} className={`page-tools ${visible ? 'visible' : ''} ${overContent ? 'over-content' : ''}`} role="group" aria-label={labels[locale].group} aria-hidden={!visible}>
    <button type="button" onClick={() => window.location.reload()} aria-label={labels[locale].refresh} title={labels[locale].refresh} tabIndex={visible ? 0 : -1}>
      <ArrowClockwise size={21} aria-hidden="true" />
      <span>{labels[locale].refresh}</span>
    </button>
    <button type="button" onClick={scrollToTop} aria-label={labels[locale].top} title={labels[locale].top} tabIndex={visible ? 0 : -1}>
      <ArrowUp size={21} aria-hidden="true" />
      <span>{labels[locale].topShort}</span>
    </button>
  </div>;
}

function Footer({ locale, showFriends }: { locale: Locale; showFriends: boolean }) {
  const copy = ui[locale];
  const friendLinks: readonly { name: string; url: string; rel?: string; badge?: { src: string; alt: string; width: number; height: number; displayWidth?: number } }[] = friendLinkData;
  const friendsLabel = journalCopy[locale].friends;
  const hasFriends = showFriends && friendLinks.length > 0;
  return <footer className={`site-footer${hasFriends ? ' site-footer--with-friends' : ''}`}>
    {hasFriends && <nav className="friend-links" aria-label={friendsLabel}>
      <span className="friend-links-label" aria-hidden="true">{friendsLabel}</span>
      <ul>{friendLinks.map(({ name, url, rel, badge }) => <li key={url}>
        <a href={url} target="_blank" rel={rel ?? 'noreferrer'}>{badge ? <img className="friend-link-badge" src={badge.src} alt={badge.alt} width={badge.width} height={badge.height} style={badge.displayWidth ? { width: badge.displayWidth } : undefined} /> : <><span>{name}</span><ArrowUpRight size={12} /></>}</a>
      </li>)}</ul>
    </nav>}
    <div className="footer-meta"><p>{copy.footer}</p><p className="footer-links"><a href="https://github.com/Sunzenki/codex-reset-watch" target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={14} /></a><a href="https://warpnav.com/" target="_blank" rel="noreferrer">{copy.warpnav}<ArrowUpRight size={14} /></a></p></div>
  </footer>;
}

function Time({ value, label }: { value: number; label: string }) { return <span><strong>{String(value).padStart(2, '0')}</strong><small>{label}</small></span>; }
function Fact({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

createRoot(document.getElementById('root')!).render(<StrictMode><IconContext.Provider value={iconDefaults}><App /></IconContext.Provider></StrictMode>);
