import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, CaretDown, CaretLeft, CaretRight, Info, PushPin, UserCircle } from './icons';
import { localeConfig, type Locale } from './i18n';
import { articlesFor, articleLink, findArticle, guideCategories, guideCopy, guideManifest, guidesPath, editorialPath, listLink, listState, type GuideArticle, type GuideCategory } from './guides';
import type { ListRoute } from './guide-routing.mjs';
import { GuideCarousel } from './GuideCarousel';
import { GuideSeriesGrid, GuideSeriesNavigation } from './GuideSeries';
import { articleDate } from './guide-series.mjs';

function stamp(value: string, locale: Locale, format: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(localeConfig[locale].intl, { ...format, timeZone: localeConfig[locale].timeZone }).format(new Date(value));
}
function displayedDate(article: GuideArticle, locale: Locale, format: Intl.DateTimeFormatOptions) {
  const value = articleDate(article, guideManifest.articles);
  return new Intl.DateTimeFormat(localeConfig[locale].intl, { ...format, timeZone: value.timeZone }).format(new Date(value.date.length === 10 ? `${value.date}T12:00:00Z` : value.date));
}
function Category({ category, locale }: { category: GuideCategory; locale: Locale }) {
  return <span className={`guide-category category-${category}`}>{guideCopy[locale].categories[category]}</span>;
}
function Pinned({ locale }: { locale: Locale }) {
  return <span className="guide-pinned"><PushPin size={12} weight="fill" />{guideCopy[locale].pinned}</span>;
}
export function GuidePreviewNote({ locale }: { locale: Locale }) {
  return guideManifest.previewMode ? <p className="guide-preview-note"><Info size={15} /><span>{guideCopy[locale].preview}</span></p> : null;
}

export function GuidesPage({ locale, route }: { locale: Locale; route?: ListRoute }) {
  const copy = guideCopy[locale];
  const state = listState(locale, route);
  const landing = state.category === 'all' ? undefined : copy.categoryPages[state.category as GuideCategory];
  const featured = state.all.filter((article) => article.featuredOrder).sort((a, b) => a.featuredOrder! - b.featuredOrder!).slice(0, 3);
  const showFeatured = state.category === 'all' && state.page === 1 && featured.length > 0;
  let previousMonth = '';
  return <main id="content" className="guides-page">
    <header className="guides-intro"><h1>{landing?.heading ?? copy.heading}</h1><p>{landing?.description ?? copy.description}</p></header>
    {state.untranslated && <p className="guide-language-notice" role="status"><Info size={18} /><span>{copy.untranslated}</span></p>}
    {showFeatured && <GuideCarousel articles={featured} locale={locale} />}
    <nav className="guide-filters" aria-label={copy.title}>
      {(['all', ...guideCategories] as const).map((category) => <a href={listLink(locale, category) + '#guide-list'} className={`guide-filter category-${category}${state.category === category ? ' is-selected' : ''}`} aria-current={state.category === category ? 'true' : undefined} key={category}>{category === 'all' ? copy.all : copy.categories[category]}</a>)}
    </nav>
    <section id="guide-list" className="guide-index" aria-label={copy.articles}>
      {state.visible.map((article) => {
        const date = articleDate(article, guideManifest.articles);
        const monthKey = displayedDate(article, locale, { year: 'numeric', month: 'numeric' });
        const monthChanged = monthKey !== previousMonth;
        previousMonth = monthKey;
        return <div key={article.slug}>{monthChanged && <h2 className="guide-month">{displayedDate(article, locale, { year: 'numeric', month: 'long' })}</h2>}
          <article className="guide-index-row"><time className="guide-date" dateTime={date.date}><strong>{displayedDate(article, locale, { day: 'numeric' }).replace(/[^0-9]/g, '')}</strong><span>{displayedDate(article, locale, { month: locale === 'en' ? 'short' : 'numeric' })}</span></time>
            <div className="guide-row-meta"><div className="guide-badges"><Category category={article.category} locale={locale} />{article.pinned && <Pinned locale={locale} />}</div><time dateTime={date.date}>{displayedDate(article, locale, { year: 'numeric', month: '2-digit', day: '2-digit' })}{date.kind !== 'published' && <span> · {copy.pacificTime}</span>}</time></div>
            <div className="guide-row-story"><h3><a href={articleLink(article, state.category, state.page)}>{article.title}</a></h3><p>{article.summary}</p></div>
            <a className="guide-row-open" href={articleLink(article, state.category, state.page)} aria-label={article.title}><ArrowRight size={19} /></a>
          </article>
        </div>;
      })}
      {state.visible.length === 0 && <div className="guide-empty"><h2>{state.all.length ? copy.empty : copy.noArticles}</h2><p>{state.all.length ? copy.emptyBody : copy.noArticlesBody}</p>{state.category !== 'all' && <a href={guidesPath(locale)}>{copy.viewAll}<ArrowRight size={18} /></a>}</div>}
    </section>
    {state.totalPages > 1 && <nav className="guide-pagination" aria-label={copy.pagination}>
      {state.page > 1 ? <a href={listLink(locale, state.category, state.page - 1) + '#guide-list'} aria-label={copy.previous}><CaretLeft size={18} /></a> : <span aria-disabled="true"><CaretLeft size={18} /></span>}
      {Array.from({ length: state.totalPages }, (_, index) => index + 1).map((page) => <a key={page} href={listLink(locale, state.category, page) + '#guide-list'} aria-current={page === state.page ? 'page' : undefined} aria-label={`${copy.pagination} ${page}`}>{page}</a>)}
      {state.page < state.totalPages ? <a href={listLink(locale, state.category, state.page + 1) + '#guide-list'} aria-label={copy.next}><CaretRight size={18} /></a> : <span aria-disabled="true"><CaretRight size={18} /></span>}
    </nav>}
    <GuidePreviewNote locale={locale} />
    <p className="guide-editorial-link"><a href={editorialPath(locale)}>{copy.editorialTitle}</a></p>
  </main>;
}

function ArticleToc({ article, locale, active }: { article: GuideArticle; locale: Locale; active: string }) {
  return <nav className="article-toc" aria-label={guideCopy[locale].toc}><strong>{guideCopy[locale].toc}</strong>{article.toc.map((heading) => <a href={`#${heading.id}`} key={heading.id} aria-current={active === heading.id ? 'location' : undefined} onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}>{heading.text}</a>)}<a href="#article-sources">{guideCopy[locale].sources}</a>{articlesFor(locale).length > 1 && <a href="#article-related">{guideCopy[locale].related}</a>}</nav>;
}

export function GuideArticlePage({ locale, slug }: { locale: Locale; slug: string }) {
  const article = findArticle(locale, slug);
  const copy = guideCopy[locale];
  const [active, setActive] = useState(article?.toc[0]?.id ?? '');
  useEffect(() => {
    if (!article) return;
    const observer = new IntersectionObserver((entries) => {
      const heading = entries.find((entry) => entry.isIntersecting);
      if (heading) setActive(heading.target.id);
    }, { rootMargin: '-110px 0px -65% 0px' });
    article.toc.forEach(({ id }) => { const heading = document.getElementById(id); if (heading) observer.observe(heading); });
    return () => observer.disconnect();
  }, [article]);
  if (!article) return <GuideNotFound locale={locale} />;
  const back = listState(locale);
  const related = articlesFor(locale).filter((item) => item.id !== article.id).sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category)).slice(0, 2);
  const published = <p className="article-date">{article.status === 'preview' ? copy.prepared : copy.published} <time dateTime={article.publishedAt}>{stamp(article.publishedAt, locale, { year: 'numeric', month: '2-digit', day: '2-digit' })}</time><span>{locale === 'en' ? 'UTC' : 'UTC+8'}</span></p>;
  const date = articleDate(article, guideManifest.articles);
  const primaryDate = date.kind === 'published' ? published : <p className="article-date">{date.kind === 'start' ? copy.seriesStart : copy.seriesDate} <time dateTime={date.date}>{displayedDate(article, locale, { year: 'numeric', month: '2-digit', day: '2-digit' })}</time><span>{copy.pacificTime}</span></p>;
  const updated = article.updatedAt && <p className="article-date">{copy.updated} <time dateTime={article.updatedAt}>{stamp(article.updatedAt, locale, { year: 'numeric', month: '2-digit', day: '2-digit' })}</time><span>{locale === 'en' ? 'UTC' : 'UTC+8'}</span></p>;
  const byline = <p className="article-byline"><UserCircle size={17} /><a href={editorialPath(locale) + '#editorial-team'}>{copy.author}</a></p>;
  return <main id="content" className="guide-article-page">
    <nav className="article-breadcrumb" aria-label={locale === 'en' ? 'Breadcrumb' : '面包屑'}><a href={locale === 'en' ? '/' : `/${locale}/`}>{copy.home}</a><span>/</span><a href={listLink(locale, back.category, back.page)}>{copy.title}</a><span>/</span><a href={listLink(locale, article.category) + '#guide-list'}>{copy.categories[article.category]}</a></nav>
    <div className={`article-layout${article.series ? ' article-layout--series' : ''}`}>
      <aside className="article-sidebar"><Category category={article.category} locale={locale} />{primaryDate}{updated}{byline}<ArticleToc article={article} locale={locale} active={active} /></aside>
      <article className="guide-article">
        <header className="article-heading"><div className="article-mobile-meta"><Category category={article.category} locale={locale} /></div><h1>{article.title}</h1><p className="article-deck">{article.summary}</p><div className="article-mobile-meta">{primaryDate}{updated}{byline}</div></header>
        {article.seriesId && <GuideSeriesNavigation article={article} locale={locale} />}
        <details className="article-mobile-toc"><summary><span>{copy.toc}</span><span><span className="toc-expand">{copy.expand}</span><span className="toc-collapse">{copy.collapse}</span><CaretDown size={14} /></span></summary><ArticleToc article={article} locale={locale} active={active} /></details>
        {article.series && <GuideSeriesGrid article={article} locale={locale} />}
        <div className="article-prose" dangerouslySetInnerHTML={{ __html: article.html }} />
        <section id="article-sources" className="article-sources"><h2>{copy.sources}</h2>{article.status === 'published' && date.kind !== 'published' && published}<h3>{copy.sourceLabel}</h3><ul>{article.sources.map((source) => <li key={source.url}><a href={source.url} {...(source.url.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}>{source.label}<ArrowUpRight size={15} /></a></li>)}</ul>{article.corrections.length > 0 && <><h3>{copy.corrections}</h3><ul>{article.corrections.map((correction) => <li key={correction.date}><time dateTime={correction.date}>{stamp(correction.date, locale, { year: 'numeric', month: '2-digit', day: '2-digit' })}</time> — {correction.text}</li>)}</ul></>}</section>
        {related.length > 0 && <section id="article-related" className="article-related"><h2>{copy.related}</h2>{related.map((item) => <a href={guidesPath(locale, item.slug)} key={item.slug}><span>{item.title}</span><ArrowRight size={18} /></a>)}</section>}
        <a className="article-back" href={listLink(locale, back.category, back.page) + '#guide-list'}><ArrowLeft size={18} />{copy.back}</a>
        <GuidePreviewNote locale={locale} />
        <p className="guide-editorial-link"><a href={editorialPath(locale)}>{copy.editorialTitle}</a></p>
      </article>
    </div>
  </main>;
}

export function GuideEditorialPage({ locale }: { locale: Locale }) {
  const copy = guideCopy[locale];
  return <main id="content" className="guide-article-page">
    <nav className="article-breadcrumb"><a href={guidesPath(locale)}>{copy.title}</a><span>/</span><span>{copy.editorialTitle}</span></nav>
    <article className="guide-article guide-editorial"><header className="article-heading"><h1>{copy.editorialTitle}</h1><p className="article-deck">{copy.editorialIntro}</p></header>
      <div className="article-prose"><h2 id="editorial-team">{copy.editorialTeamTitle}</h2><p>{copy.editorialTeam}</p><h2>{copy.editorialMethodTitle}</h2><p>{copy.editorialMethod}</p><h2>{copy.editorialCorrectionsTitle}</h2><p>{copy.editorialCorrections}</p><p><a href="https://github.com/Sunzenki/codex-reset-watch">{copy.editorialFeedback}</a></p></div>
      <a className="article-back" href={guidesPath(locale)}><ArrowLeft size={18} />{copy.back}</a>
    </article>
  </main>;
}

export function GuideNotFound({ locale }: { locale: Locale }) {
  const copy = guideCopy[locale];
  return <main id="content" className="guides-page"><div className="guide-empty"><h1>{copy.notFound}</h1><p>{copy.notFoundBody}</p><a href={guidesPath(locale)}><ArrowLeft size={18} />{copy.back}</a></div></main>;
}
