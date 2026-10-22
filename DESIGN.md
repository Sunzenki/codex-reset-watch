# CRW Forest Journal — current design contract

Reviewed: 2026-10-16. This describes local implementation, not a production release. Release evidence belongs in [CHANGELOG.md](CHANGELOG.md).

Current visual iteration is paused at the user-approved local baseline on 2026-10-16; this is not deployment authorization. Earlier homepage references show the initial composition; later refinements below take precedence. See the [phase handoff](docs/history/2026年10月15日至16日-改版成果与下一阶段推进报告.md).

## Approved references

- [Homepage](docs/design-references/home-approved.png): date rail, current message, source note, three recent records. No decorative slogans or event timeline.
- [History](docs/design-references/history-approved.png): forest watercolor, paper calendar and selected-day details. The oversized logo showcase in the concept is not a site header.
- Coral reset arrow #F47780, apricot terminal `>_` #ED963E, berry wordmark #754652, cream #FFF9EF. On 2026-10-16 the user rejected the large coral reminder button; use pale apricot #F8E6D2, berry text, #DFBFA9 border, and #F1D7BA hover instead.

## Structure and content

CRW is unofficial and manually curated. JSON remains authoritative. Public confirmation time is not execution time; countdown zero never confirms completion. Keep all three language routes, sources, static SEO and real reminder state.

Homepage: compact brand/navigation; left date, central current event, right original-post note; publication/update metadata; latest three earlier records sorted by targetAt, excluding the current source and rule changes; always-visible three-note methodology section. Event-specific source context remains above recent records. No event timeline or marginal handwritten slogans. The title-to-action region holds the countdown for timed announcements, pending confirmation after expiry, or completion information. Never render a fictitious timer for completed/untimed events. Metadata uses explicitly labelled route timezones except the homepage publication summary, which uses fixed PST (UTC−8).

The original-post note may show a labelled, verbatim excerpt relevant to the reset when the full post includes unrelated content. Keep its translation equally scoped, the complete source in JSON, and the original-post link visible.

History: heading, calendar and selected-date details, archive records. Green means global reset, apricot means banked reset; irregular watercolor day marks retain readable numbers, focus and selected outlines. Color never replaces evidence/outcome labels. Preserve full detail text, timestamps and source links.

Local navigation exposes Reset updates / History / News & guides, 重置动态 / 历史记录 / 资讯指南, 重置動態 / 歷史記錄 / 資訊指南. The guide section covers OpenAI/Codex news, updates, incidents and tutorials; it is not a personal blog. Release evidence remains in CHANGELOG. Homepage reminder controls remain available.

## Visual system and responsive behavior

Shared final overrides live in [src/forest.css](src/forest.css), after the existing journal styles. Cream paper, berry headings, dark readable body text, fine neutral dividers. Headings use the default system sans-serif stack (PingFang SC, Microsoft YaHei, Noto Sans CJK SC, system-ui, sans-serif), without rounded-font overrides. Original-post blockquotes use Arial / Helvetica Neue sans-serif at weight 600 with italic and local font-synthesis: style to override the global synthesis prohibition; author, translation and timestamp remain upright. Body uses the existing system stack. No custom font files are loaded. Keep open surfaces instead of nested cards.

At desktop widths the homepage has three columns; below 900px the source follows the story; below 600px the date becomes horizontal and all content stacks. Mobile header retains the full logo and accessible menu. Navigation is protected by an opaque cream surface; decoration never intercepts pointer events. Calendar stacks below 760px. Verify long English and both Chinese locales, keyboard controls, menu Escape, month controls and record links.

## News and guides — local implementation, 2026-10-21

Selected [date-index reference](docs/design-references/guides-selected.png): retain the chosen second concept and date-index list below. The latest user direction replaces the former lead/two-supporting layout with a full-width, single-article banner carousel (three featured articles initially); remove the right supporting modules. Reuse watercolor covers with readable cream caption areas, dots and previous/next controls. Rotate every seven seconds, pause on hover/focus, manual changes or hidden page, and provide pause/play. Respect reduced motion by keeping manual navigation without automatic rotation. Filters and the dated list follow the carousel.

The four fixed category pages are topic archives with localized, topic-specific H1s and a concise visible introduction. Main list H1 names Codex; page metadata describes the wider OpenAI scope. Reuse the existing intro typography and normal wrapping.

Category filters and labels retain readable text and distinct sage (guides), pale blue (updates), rose (news) and apricot (incidents) backgrounds; selected filters add a visible outline. Rose pin labels describe editorial pinning, independent of selection for the feature area. A narrow date gutter, month headings, plain article rows and fine separators replace a card grid. New article controls use the existing Phosphor entry.

List and article pages inherit the shared desktop header and main container width: up to 1240px with 48px side margins, aligned with the homepage, history and footer. Articles use a continuous 760px maximum text column, 18px/1.9 desktop and 17px/1.9 phone body. Desktop metadata and sticky TOC sit to the left; at 700px and below metadata moves under the title and the TOC becomes a native details control. Source links, corrections, related reading and back-to-list follow the body. Existing paper highlight texture and forest artwork are reused; phone artwork is faint and scoped to this section. No custom fonts or new dark theme. Unpublished preview drafts are explicitly marked and omitted from the formal build; see [guide maintenance](docs/guides.md).

Guide bylines link to the localized public editorial/corrections page. Both list and article pages have a quiet supporting-text link to that page below their content. The editorial page reuses the cream surface and 760px reading column; it explains the organizational byline, Codex's editorial role, sources and corrections, without adding a new primary navigation item.

The Tibo 28-day directory is a wide article exception: title/deck and metadata, then statistics and the clickable calendar before explanatory prose and sources. Seven columns on wide desktop, four on medium screens, two on phones; use cream paper with pale blue feature, apricot reset and lavender banked/stream labels. Pending/future cells remain text, without dead article links. Use visibly blue feature cells, orange reset cells, and purple banked announcements, with strong text badges and an inline legend. Mixed days carry a two-colour top stripe and both text labels. Grey pending cells stay distinct. Counts derive from real linked daily drafts; distinguish coverage from confirmed delivery. Daily articles retain the normal reading column and add a quiet directory/adjacent-day navigation row. List and article headings show the calendar’s Pacific series date, labeled Series date (or Plan starts for the index). Actual web publication dates stay separate and are shown when formally published. Lists contain eight articles per page. Banner artwork is topic-specific (28-cell plan, 12h cache reuse, 272k to 500k), with readable ALT and intrinsic dimensions; use contain rather than clipping the information. Desktop banners use a separate 6.5:1 composition in a 120–190px image area, with a compact cream caption below; keep the first article visible in an ordinary desktop viewport. At 700px and below, picture falls back to the original cover at its natural aspect ratio. Use bannerCover for the optional desktop source and cover for the phone/fallback image. Never solve wide-screen fitting by allowing poster-height artwork to displace the article list. Prompts and assets are recorded in [banner artwork](docs/design-references/tibo-banner-prompts.md).

Guide topics have full English, Simplified Chinese and Traditional Chinese versions, linked by article id. Localize titles, summaries, body text, source labels and ALT; internal article links remain within the selected locale. The series time-zone label reads 美西时间 / 美西時間 / Pacific Time. Preserve original event dates and the compact banner layout across translations.

Use the same readable time-zone label in the directory's sources-checked statistic. Daily article titles begin with `Tibo's Day {n}` in all three locales. Calendar card titles omit this repeated series prefix for both Chinese and English separators, since the cell already labels the day. The phone TOC summary switches its localized Expand/Collapse text with the native details state; CSS must hide the inactive label from both visual and accessibility output.

## Assets and icons

- [forest-logo.png](public/images/forest-logo.png): original generated transparent horizontal lockup, coral reset ring, orange terminal and berry two-line wordmark.
- [forest-frame.webp](public/images/forest-frame.webp): original generated transparent watercolor foliage and narrow right window; center blank, no text/UI.
- [forest-note.webp](public/images/forest-note.webp): original generated blank cream torn paper with apricot tape. Source text stays selectable HTML.
- Existing journal paper supplies subtle calendar pigment texture. Legacy logo/handwriting assets remain on disk but the public header and homepage no longer use them.

Generated with built-in ImageGen from the approved homepage reference. Prompts request separate transparent assets, matching palette, no UI or added text (except exact logo wordmark). WebP compression preserves alpha. Local generated originals are not build dependencies.

Use existing [Phosphor icons](src/icons.ts): regular 18px default, 14–16px inline, 20–21px navigation; filled completion marks permitted. Decorative icons aria-hidden; icon-only controls need localized names and practical 44px hit areas. No new icon library.

## QA and publication

See [design-qa.md](design-qa.md) for actual checks and limits. Run build and documentation checks, inspect all six routes and mobile/desktop layouts. Local static preview has no push backend; unavailable/retry does not mean browser unsupported. Never test by sending notifications or changing real subscriptions. User reviews preview before commit/push; publishing and notifications require their own authorization.

## Methodology notice section

The approved three-note design uses sage, butter yellow and apricot blank paper assets with tape/pin decoration, Phosphor Link/Clock/Timer icons, selectable localized sans-serif text and an emphasized countdown warning. Desktop uses three columns; below 760px notes stack. Recent records remain three. Public JSON links remain below the notes; no accordion hides the principles.

Section headings for methodology and event evidence match Recent records: 26px desktop / 24px phone, weight 700, berry, system sans-serif. Event evidence uses a heading above one full-width deckled warm-white paper sheet, a softly blended paper texture and reduced embedded shadow (65% decorative-layer opacity), no clip or tape, plain berry attribution, context, a pale apricot watercolor highlight on the first caveat sentence, original time wording and source links. All text stays selectable HTML; default system sans-serif is unchanged. The hero already quotes the original post; do not duplicate a large quote here.

Hero refinement: retain the date/story/quote layout, shorten date paper, move the original-post link into the quote, and remove duplicated hero publication text. One paper summary holds original wording, publication and site update; values use 15px desktop / 14px phone. Publication in this summary is explicitly fixed PST (UTC−8), a display conversion, not evidence of the author’s location or the original timestamp zone. JSON retains UTC provenance; other localized timestamps retain their existing zone labels.

General homepage/history timestamps use UTC notation (UTC, UTC+8), never mixed GMT notation. The explicitly requested PST (UTC−8) summary conversion remains unchanged. Guide list month groups, date rails and inline dates use the actual site publication timestamp in the route timezone (English UTC, Chinese UTC+8). Pacific PT series dates remain in article details and the series calendar, separate from publication dates.

Favicon and touch/notification icons use the coral reset arrow and apricot terminal mark from public/images/forest-icon.png. Run python scripts/generate-brand-assets.py to regenerate PNG/ICO sizes without rewriting social artwork. Public HTML uses versioned ICO/PNG and Apple-touch links.


## Social sharing artwork

Approved 2026-10-16: public/og.png uses the forest watercolor window, cream paper, coral/apricot logo and berry text. Preserve the approved composition and native dimensions; metadata must match the file. All three locales share this Chinese-description artwork with localized alt text. No event dates, live status or countdown numbers are embedded. The favicon generator must not overwrite this asset.

## Footer friend links

The selected text-only direction places friend links above the copyright row on the same cream surface. Keep the localized label and site names at supporting-text level: 13px desktop, 12px phone, weight 400, muted text, no oversized heading, permanent underline, cards or decorative images. Use 12px Phosphor external-link arrows, hover underlines, visible keyboard focus and 44px link hit height. Links wrap naturally; long names must not overflow. GitHub and WarpNav main-site attribution remain in the bottom row.

Curated names and destinations live in [src/friend-links.json](src/friend-links.json); an empty list hides the section. Never publish preview examples as actual partners. Editing and validation details are in [content-and-data.md](docs/content-and-data.md#9-友情链接).

The static HTML snapshot includes the footer inside the same React root, with real visible friend-link anchors. Both static output and runtime labels use [src/footer-copy.json](src/footer-copy.json). Keep the existing typography/layout; React replaces the snapshot without leaving a duplicate footer.

Directory-required official badges are an exception to the text-only links. DeepLaunch uses the user-supplied official light SVG at its original URL, with intrinsic 200×54 dimensions and CSS display width 120px / proportional height. Do not recolor, redraw, fade or crop the badge, or duplicate the text link alongside it. Other friend links retain the compact text treatment and the badge anchor retains a 44px hit height. Include the same linked image and alternative text in static HTML and React output.
