import { useEffect, useState } from 'react';
import { ArrowRight, CaretLeft, CaretRight, Pause, Play, PushPin } from './icons';
import { articleLink, guideCopy, type GuideArticle } from './guides';
import type { Locale } from './i18n';

export function GuideCarousel({ articles, locale }: { articles: GuideArticle[]; locale: Locale }) {
  const copy = guideCopy[locale];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(motion.matches);
    const syncVisibility = () => setVisible(!document.hidden);
    syncMotion(); syncVisibility();
    motion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => { motion.removeEventListener('change', syncMotion); document.removeEventListener('visibilitychange', syncVisibility); };
  }, []);
  useEffect(() => {
    if (articles.length < 2 || paused || hovered || focused || reducedMotion || !visible) return;
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % articles.length), 7000);
    return () => window.clearInterval(timer);
  }, [articles.length, current, paused, hovered, focused, reducedMotion, visible]);
  const select = (index: number) => { setCurrent((index + articles.length) % articles.length); setPaused(true); };
  return <section className="guide-carousel" aria-roledescription={copy.carousel} aria-labelledby="guide-featured-heading" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <h2 id="guide-featured-heading">{copy.featured}</h2>
    <div className="guide-carousel-window">{articles.map((article, index) => <div className="guide-slide" role="group" aria-roledescription={copy.slide} aria-label={`${index + 1} / ${articles.length}`} hidden={current !== index} aria-hidden={current !== index} inert={current !== index} key={article.id}>
      <a className="guide-banner" href={articleLink(article)}>
        {article.cover && <picture className="guide-banner-art">
          {article.bannerCover && <source media="(min-width: 701px)" srcSet={article.bannerCover} />}
          <img src={article.cover} alt={article.coverAlt ?? ''} width={article.coverWidth ?? 1240} height={article.coverHeight ?? 330} fetchPriority={index === 0 ? 'high' : 'auto'} />
        </picture>}
        <div className="guide-banner-copy"><div className="guide-badges"><span className={`guide-category category-${article.category}`}>{copy.categories[article.category]}</span>{article.pinned && <span className="guide-pinned"><PushPin size={12} weight="fill" />{copy.pinned}</span>}</div><h3>{article.title}</h3><p>{article.summary}</p><span className="guide-banner-read">{copy.readArticle}<ArrowRight size={18} /></span></div>
      </a>
    </div>)}</div>
    {articles.length > 1 && <div className="guide-carousel-controls">
      <div className="guide-carousel-dots" aria-label={copy.selectArticle}>{articles.map((article, index) => <button type="button" aria-label={`${copy.selectArticle} ${index + 1}: ${article.title}`} aria-current={index === current ? 'true' : undefined} onClick={() => select(index)} key={article.id}><span /></button>)}</div>
      <span className="guide-carousel-count">{current + 1} / {articles.length}</span>
      <button type="button" onClick={() => select(current - 1)} aria-label={copy.previousArticle}><CaretLeft size={19} /></button>
      <button type="button" onClick={() => select(current + 1)} aria-label={copy.nextArticle}><CaretRight size={19} /></button>
      {!reducedMotion && <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? copy.playCarousel : copy.pauseCarousel}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>}
    </div>}
  </section>;
}
