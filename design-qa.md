# CRW Forest Journal QA — 2026-10-16

final result: passed

Scope: local homepage/history implementation and the user's softer reminder-button correction. No production deployment or real subscription/notification testing.

## Evidence and comparison

Approved visual targets: [homepage](docs/design-references/home-approved.png), [history](docs/design-references/history-approved.png). Compared the homepage target and rendered screenshot together; inspected history and phone captures separately. Source art is 1479×1064; measured desktop CSS viewport 1535×1104, phone 374×844. The in-app capture includes extra backing canvas and scaling, so comparison uses the visible page content rather than claiming pixel-identical full-canvas alignment.

Local screenshots in experiments/: forest-home-final.png, forest-history-final.png, forest-home-mobile.png, forest-mobile-*.png, forest-countdown.png, forest-countdown-mobile.png. They are local evidence, not production assets. Countdown screenshots use a local-only fixture and are not real announcements.

## Checks and fixes

- Six routes at desktop and phone widths: no horizontal page overflow, no broken image elements; homepage shows exactly three earlier records. DOM width checks use actual innerWidth, not the requested viewport setting (the browser applies a scale factor).
- Mobile menu opens and Escape closes it; desktop history navigation works. Calendar previous month changes October to September; return-to-current restores October. No reminder action was invoked.
- Current completed event has no timer. Local fixture verifies future timer appears between title and actions, fits phone width, expired time becomes pending confirmation with no timer, and no-date state waits without prediction.
- Fixture only replaces JSON/initial bootstrap: existing editorial translations still refer to the current event. This is a layout/state test, not evidence that future event copy updates automatically. Editors must continue synchronizing JSON and i18n as documented.
- Removed duplicate history journal heading and obsolete marginal slogans. Corrected banked legend to apricot and removed legacy purple from countdown tiles.
- Reminder fill changed from strong coral to pale apricot at user request; berry text retained. Real local preview correctly reports unavailable backend and offers the production management link.

## Required fidelity surfaces

- Typography: user subsequently requested system sans-serif (黑体) headings and italic sans-serif original-post quotes; applied without font downloads. Dates retain serif numerals. Author, translation and timestamps remain upright. Verified computed styles and all six routes at 374px and 1535px without horizontal overflow; latest capture experiments/forest-sans-home.png. Build, docs check and diff check passed.
- Layout: date/story/source columns and full-width recent rows match the selected organization; phone stacks naturally. Header protects navigation from decoration.
- Color: cream/berry/coral/orange identity; reminder uses the newly approved softer direction. Global/banked distinction remains green/apricot.
- Images: independent transparent logo, forest frame and blank note, not a rasterized webpage. Generated frame differs in branch placement from concept, while preserving open reading space.
- Copy: real event, source and time provenance retained; original-post metadata now follows the route timezone. No invented future event, dead news link or timeline module.

## Intentional differences and follow-up

News/guides navigation deferred until the section exists, as agreed. Existing full archive remains below the calendar. Preview reminder shows service state rather than the mock's subscription CTA. Recent rows retain existing concise title/status schema. Fine paper edges and calligraphy remain illustrative approximations; functional controls and text are HTML. No P0/P1/P2 issue remains in the checked scope; broader browser/device compatibility is not claimed.

No commit, push, production verification or notification send performed. User visual review remains the next step.

## 2026-10-16 — Always-visible methodology notes

- Source: C:/Users/sunze/.codex/generated_images/01a14069-8f02-78d1-bfbc-bf8ac199d71f/exec-92eedf6e-d63c-42d9-9c2c-30087cfb9215.png (1672x941).
- Implementation: experiments/notice-desktop.png and experiments/notice-mobile.png. Desktop CSS viewport 1135x1231; mobile 374x844. In-app captures include backing-canvas scaling; compare the content region, not blank canvas. Source and implementation were opened together; desktop note region and mobile stack inspected separately.
- Typography: existing system sans-serif preserved, no font downloads; HTML headings and localized body copy remain selectable, warning bold.
- Layout: three aligned desktop notes, single-column phone stack. Exactly three recent records in all three locales; event context moved above records, all source links preserved. Notes and JSON links are always visible without accordion interaction.
- Colors/images: generated transparent sage, yellow and apricot paper assets with tape/pin, roughly 289 KB combined. Sage paper is darker and grainier than the mock (P3 polish); no text clipping observed. Existing forest border and footer retained intentionally.
- Copy: localized principles simplified without changing evidence rules. Countdown zero explicitly does not confirm completion.
- Checks: production build, 24 records and six-page SEO validation passed. All three homepage locales at desktop and 374px had three records, three notes, no horizontal overflow. Keyboard focus reaches JSON links. Browser error log empty. No notification or subscription action taken.
- Findings: no actionable P0/P1/P2 in this scoped section. Paper tone/edge details differ slightly from generated concept; no exact pixel-match claim. The mock's one sample recent row is intentionally replaced by the user-required three.
- final result: passed
- Local preview only; no commit, push or deployment.

## Evidence panel and heading refinement

2026-10-16: methodology, recent-record and evidence headings now share 26px/700 desktop and 24px/700 phone styles. Event evidence uses source attribution, context, a pale yellow time-caveat callout and publication/source links in a cream panel, following the user-provided layout hierarchy. No duplicate large quote was added because the hero already contains it. Screenshot: experiments/evidence-update.png. All three homepage languages checked at desktop and 374px: no horizontal overflow; computed heading sizes match. Production build and data/SEO validation passed. Local preview only. Final result: passed.

## Final plain-paper refinement (2026-10-16)

User selected removal of the paperclip. Removed the decorative image and its responsive CSS. The paper texture/shadow now renders at 65% opacity on a separate background layer; text remains fully opaque. Local browser verified zero clip elements, three recent records, no horizontal overflow. Screenshot: experiments/evidence-plain-final.png. Build, data/SEO, docs check and diff check passed. No deployment. Final result: passed.

## Hero summary and UTC notation (2026-10-16)

Implemented approved three-column hero refinement: shorter date strip, original-post link inside quotation, no duplicate confirmed-time line, one paper summary with three facts. Values are 15px desktop / 14px mobile, deliberately smaller than concept per user request. Fixed PST conversion verified as 2026-10-14 22:28 PST（UTC−8）; underlying source remains UTC. Display labels normalize GMT to UTC, preserving offsets. Six routes checked without GMT text or horizontal overflow; three home locales also checked at 374px. Screenshot: experiments/hero-summary-final.png. Build/data/SEO and docs checks passed. Countdown logic unchanged; no notifications, commit or deployment. Final result: passed.


## 2026-10-16 发布前审计复核

本轮复核范围：三语言首页与历史页，桌面 1270px / 手机 374px；无横向溢出、图片元素破图或重复 h1。最近记录保持三条。日历切月、回到本月、储备事件选择及手机菜单/Escape 通过。本地不可用按钮已明确禁用，正式站逻辑不由该预览结果推断。当前完成状态截图：本地忽略目录 `experiments/audit-mobile-home.png`。倒计时及后台样例沿用前轮记录，未在本轮全量重验。详细缺口与发布限制见 [审计报告](docs/history/2026年10月16日-改版发布前审计报告.md)。
