# Calendar design QA

Source: C:/Users/sunze/.codex/generated_images/01a093b1-6c44-78f0-ab6f-2b9545442f7a/exec-850f67d2-3df8-4603-ab32-c4b6c048b3e1.png
Implementation: C:/Users/sunze/AppData/Local/Temp/crw-calendar-desktop.png
Mobile: C:/Users/sunze/AppData/Local/Temp/crw-calendar-mobile.png
Page tools reference: C:/Users/sunze/AppData/Local/Temp/codex-clipboard-367f02f9-c14d-43fa-9a97-1904a887d741.png
Page tools implementation: C:/Users/sunze/AppData/Local/Temp/crw-page-tools-bilibili-style.png
Page tools mobile: C:/Users/sunze/AppData/Local/Temp/crw-page-tools-mobile.png
Route: http://127.0.0.1:4173/zh-CN/history/

## Evidence and comparison
Source and desktop capture: 1488 x 1058 pixels, desktop CSS viewport 1488 x 1058. Compared together in one image input. Browser capture shows existing site content width of 1160px; source mock uses a wider canvas. Existing header, background, logo and archive timeline retained intentionally. Initial compositor capture after resizing was incomplete and discarded; next complete capture used. Mobile CSS viewport 375 x 812; no horizontal overflow (document width 360 with scrollbar).
State: September 2026, September 12 selected, September 13 today. Full comparison covers calendar split, heading, detail and legend. Text and controls readable in this full capture, so no additional focused crop required.

## Findings
No actionable P0/P1/P2 findings in final comparison.
- Typography: existing rounded system font stack retained; calendar detail headings and controls follow site scale. More compact than standalone mock, intentional integration with current site width.
- Layout: left month / right summary, thin divider, open background and timeline below match chosen direction. Mobile stacks detail below calendar.
- Colors: existing cream, mint and lavender tokens retained. Dashed observation circle is an intentional evidence distinction from public confirmation.
- Assets: existing original brand logo retained, no new illustration assets needed. Native calendar UI uses CSS.
- Content: actual data replaces mock copy. Current update links to home; archive events link to existing timeline anchors. Latest current event is deduplicated by source URL and does not inflate archive count. Account observation, rollout and unverified announcements are explicitly separated.

## Verification
- Production build including TypeScript, data validation and all six SEO entries passed.
- Date selection: September 4 shows unverified banked-reset details.
- Previous month and return-to-current-month controls passed.
- English confirmation 08:09 UTC; simplified/traditional confirmation 16:09 UTC+8.
- English August 29 marker verified (Chinese archive displays August 30).
- 375px simplified and English layouts visually inspected without horizontal overflow; traditional content checked.
- Browser console error log empty in tested English route.
- The right-side tool group appears after 600px and follows the Bilibili reference structure: separate icon-over-label buttons with a small viewport-edge inset. CRW intentionally keeps its cream and lavender tokens and only includes Refresh and Top.
- Bilibili live comparison confirmed the source behavior rather than inferring it from the screenshot: at a 1215px viewport the source group opacity is `1`; at 900px its `translucent` wrapper opacity is `0.5` while the buttons remain interactive.
- CRW now measures the actual horizontal relationship between the fixed tool group and the `main` content box. When the tool group enters the content area (with a 12px comfort margin), it adds `over-content` and fades to `0.5`; a hover or keyboard focus inside the group restores opacity to `1`.
- Refresh completed a real page navigation and retained the browsing position; Top returned to scroll position 0. Both controls have localized accessible labels.
- At the tested constrained desktop state, the group overlapped the content edge by 58px and correctly rendered at `0.5`; at 1700px it had a 184px clear gap and rendered at `1`.
- The tool group was checked at 375px without horizontal overflow; its idle opacity was `0.5`, keyboard focus restored `1`, and the compact buttons remained inside the viewport.
- The same tool group is mounted at the app shell level, so it is available on both the current-update homepage and the history page. The homepage was scrolled past the 600px threshold: both localized controls appeared, overlap fading was active, and Back to top returned the page to scroll position 0.
- Temporary viewport override reset. Local preview left running, Chinese tab retained.

## Maintenance
Evidence map in src/ResetCalendar.tsx is explicit; new unclassified archives default to unverified. Classify newly archived confirmed/observed/banked/rollout records when adding them. Raw data and existing timeline content are unchanged.

## Comparison history
The first back-to-top version was rejected because its container-relative placement made it appear attached to a content card, and its lone text arrow looked unfinished. A second edge-tab pass fixed the placement but still did not match the requested Bilibili-style tool group. The next pass used two discrete 56 x 58 controls with Phosphor ArrowClockwise and ArrowUp icons, visible labels, a 22px desktop edge inset, and a compact 50 x 52 mobile variant. The final responsive pass reproduced Bilibili's measured `1` / `0.5` opacity behavior using geometry-based overlap detection, with hover and focus recovery. The supplied Bilibili screenshot and CRW capture were viewed together; component proportions and hierarchy match while colors intentionally follow CRW. Residual gap: no separate screen-reader session or browser-engine matrix tested.

final result: passed
