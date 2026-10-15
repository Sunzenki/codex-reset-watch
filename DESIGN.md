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

History: heading, calendar and selected-date details, archive records. Green means global reset, apricot means banked reset; irregular watercolor day marks retain readable numbers, focus and selected outlines. Color never replaces evidence/outcome labels. Preserve full detail text, timestamps and source links.

Navigation currently exposes Reset updates / History, 重置动态 / 历史记录, 重置動態 / 歷史記錄. Approved final navigation adds 资讯指南 / 資訊指南 once the section exists. It covers OpenAI/Codex news, updates, incidents and tutorials; it is not a personal blog. No dead placeholder entry. Homepage reminder controls remain available.

## Visual system and responsive behavior

Shared final overrides live in [src/forest.css](src/forest.css), after the existing journal styles. Cream paper, berry headings, dark readable body text, fine neutral dividers. Headings use the default system sans-serif stack (PingFang SC, Microsoft YaHei, Noto Sans CJK SC, system-ui, sans-serif), without rounded-font overrides. Original-post blockquotes use Arial / Helvetica Neue sans-serif at weight 600 with italic and local font-synthesis: style to override the global synthesis prohibition; author, translation and timestamp remain upright. Body uses the existing system stack. No custom font files are loaded. Keep open surfaces instead of nested cards.

At desktop widths the homepage has three columns; below 900px the source follows the story; below 600px the date becomes horizontal and all content stacks. Mobile header retains the full logo and accessible menu. Navigation is protected by an opaque cream surface; decoration never intercepts pointer events. Calendar stacks below 760px. Verify long English and both Chinese locales, keyboard controls, menu Escape, month controls and record links.

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

Timezone labels consistently use UTC notation (UTC, UTC+8), never mixed GMT notation. The explicitly requested PST (UTC−8) summary conversion remains unchanged.

Favicon and touch/notification icons use the coral reset arrow and apricot terminal mark from public/images/forest-icon.png. Run python scripts/generate-brand-assets.py to regenerate PNG/ICO sizes without rewriting social artwork. Public HTML uses versioned ICO/PNG and Apple-touch links.


## Social sharing artwork

Approved 2026-10-16: public/og.png uses the forest watercolor window, cream paper, coral/apricot logo and berry text. Preserve the approved composition and native dimensions; metadata must match the file. All three locales share this Chinese-description artwork with localized alt text. No event dates, live status or countdown numbers are embedded. The favicon generator must not overwrite this asset.
