import { readFileSync } from 'node:fs';

const friendLinks = JSON.parse(readFileSync(new URL('../src/friend-links.json', import.meta.url), 'utf8'));
const footerCopy = JSON.parse(readFileSync(new URL('../src/footer-copy.json', import.meta.url), 'utf8'));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function footerSnapshot(locale, showFriends = false) {
  const copy = footerCopy[locale];
  const visibleLinks = showFriends ? friendLinks : [];
  const links = visibleLinks.map(({ name, url, rel, badge }) => {
    const content = badge ? `<img class="friend-link-badge" src="${escapeHtml(badge.src)}" alt="${escapeHtml(badge.alt)}" width="${escapeHtml(badge.width)}" height="${escapeHtml(badge.height)}"${badge.displayWidth ? ` style="width:${escapeHtml(badge.displayWidth)}px"` : ''}>` : `<span>${escapeHtml(name)}</span>`;
    return `<li><a href="${escapeHtml(url)}" target="_blank" rel="${escapeHtml(rel ?? 'noreferrer')}">${content}</a></li>`;
  }).join('');
  const friends = visibleLinks.length ? `<nav class="friend-links" aria-label="${escapeHtml(copy.friends)}"><span class="friend-links-label" aria-hidden="true">${escapeHtml(copy.friends)}</span><ul>${links}</ul></nav>` : '';
  return `<footer class="site-footer${visibleLinks.length ? ' site-footer--with-friends' : ''}">${friends}<div class="footer-meta"><p>${escapeHtml(copy.footer)}</p><p class="footer-links"><a href="https://github.com/Sunzenki/codex-reset-watch" target="_blank" rel="noreferrer">GitHub</a><a href="https://warpnav.com/" target="_blank" rel="noreferrer">${escapeHtml(copy.warpnav)}</a></p></div></footer>`;
}
