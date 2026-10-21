# Tibo 系列 banner：主题与生成提示词

使用内置 imagegen，2026-10-21。三图为主题示意，不是产品截图或实测记录。原始生成图保留，网页以 WebP 使用；全部文字、数字和 28 格已目视核对。

| 文章 | 项目资产 | 内容与 ALT |
| --- | --- | --- |
| 28 天总目录 | [28 天计划封面](../../public/images/guides-tibo-28-day-plan.webp) | 7 × 4 示意日历，区分功能和重置，不表示完成状态 |
| Day 16 | [缓存封面](../../public/images/guides-tibo-prompt-cache.webp) | 12h API 提示缓存，共享前缀复用，不承诺免费或永久缓存 |
| Day 7 | [上下文封面](../../public/images/guides-tibo-500k-context.webp) | 272k → 500k 默认上下文，保留模型与产品范围，不表示额度加量 |

桌面使用单独重排的 6.5:1 横向稿（1950 × 300），图片区在 120–190px 内，contain 保留全部信息；700px 及以下继续使用上表原图并按原始比例显示。picture 在两个构图之间选择，避免通过增加横幅高度解决宽屏留白。coverAlt 与原图真实宽高继续随文章输出，标题/摘要为可选择的 HTML 文本。

## 桌面紧凑稿

本轮通过内置 imagegen 分别编辑三张原图，重新安排为单行信息构图。生成文件保留在默认 generated_images；项目新增独立 banner 文件，原图继续供手机使用。生成结果的纸面上下留白按中心安全区裁去，统一转为 1950 × 300 WebP，未拉伸图文；三张合计 110,482 bytes，约 108 KiB。已目视检查 28 格、12h/API 共享前缀与 272k→500k/模型范围。

| 文章 | 桌面资源 | 大小 |
| --- | --- | --- |
| 总目录 | [plan banner](../../public/images/guides-tibo-28-day-plan-banner.webp) | 34,396 bytes |
| Day 16 | [cache banner](../../public/images/guides-tibo-prompt-cache-banner.webp) | 36,392 bytes |
| Day 7 | [context banner](../../public/images/guides-tibo-500k-context-banner.webp) | 39,694 bytes |

以下为三次实际编辑提示词，输入分别为上表同主题的原图。

### plan desktop

```text
Use case: infographic-diagram. Edit target: the attached existing forest-journal cover. Preserve warm ivory #fff8ee paper texture, berry brown #754652 typography, restrained sage/pale-blue/apricot watercolor detail and the same factual topic. Recompose it as a VERY THIN PANORAMIC WEB BANNER, target aspect ratio 6.5:1 (2600 x 400). All meaningful text and illustrations must fit ONE LOW HORIZONTAL STRIP across the middle of the canvas, using the full horizontal width. If a taller canvas is returned, keep ALL essential content inside the central 30% of canvas height; leave the top and bottom plain ivory so the website can safely crop them. No labels or drawings above or below that safe horizontal strip. Sparse leaf accents only at the far left and far right ends of that strip, not in corners of a tall canvas. Do not simply shrink/letterbox the previous composition. Redesign typography and arrangement to use the panoramic strip. No scenery, no official logos, no frames or mock browser chrome. At left, exact medium-large text 'CODEX' and '28-DAY PLAN' horizontally adjacent or a tightly spaced two-line lockup that is less than 130 pixels tall. At right, a compact neat 7-column by 4-row schematic calendar, exactly 28 equal cells, using blue/apricot/lavender, without dates, numbers, completion marks or percentages. Make the calendar very wide with short cells so it fits the low strip. Do not add the old bottom legend. Text only 'CODEX' and '28-DAY PLAN'. The result should look like a calm editorial masthead, not a large poster.
```

### cache desktop

```text
Use case: infographic-diagram. Edit target: the attached existing forest-journal cover. Preserve warm ivory #fff8ee paper texture, berry brown #754652 typography, restrained sage/pale-blue/apricot watercolor detail and the same factual topic. Recompose it as a VERY THIN PANORAMIC WEB BANNER, target aspect ratio 6.5:1 (2600 x 400). All meaningful text and illustrations must fit ONE LOW HORIZONTAL STRIP across the middle of the canvas, using the full horizontal width. If a taller canvas is returned, keep ALL essential content inside the central 30% of canvas height; leave the top and bottom plain ivory so the website can safely crop them. No labels or drawings above or below that safe horizontal strip. Sparse leaf accents only at the far left and far right ends of that strip, not in corners of a tall canvas. Do not simply shrink/letterbox the previous composition. Redesign typography and arrangement to use the panoramic strip. No scenery, no official logos, no frames or mock browser chrome. Use a single horizontal line of related elements: at left exact big text '12h', next to it exact small text 'API' above 'PROMPT CACHING'; at right one small cream input note with a sage shared-prefix stripe, an arrow, a small sage cache tray, an arrow branching to three tiny request notes arranged HORIZONTALLY side-by-side, all with identical sage upper strips and different lower strips. The whole diagram must be short and wide, not vertically stacked. Remove the old bottom footer. Text only '12h', 'API', 'PROMPT CACHING'. No infinity symbol, no free or forever claim.
```

### context desktop

```text
Use case: infographic-diagram. Edit target: the attached existing forest-journal cover. Preserve warm ivory #fff8ee paper texture, berry brown #754652 typography, restrained sage/pale-blue/apricot watercolor detail and the same factual topic. Recompose it as a VERY THIN PANORAMIC WEB BANNER, target aspect ratio 6.5:1 (2600 x 400). All meaningful text and illustrations must fit ONE LOW HORIZONTAL STRIP across the middle of the canvas, using the full horizontal width. If a taller canvas is returned, keep ALL essential content inside the central 30% of canvas height; leave the top and bottom plain ivory so the website can safely crop them. No labels or drawings above or below that safe horizontal strip. Sparse leaf accents only at the far left and far right ends of that strip, not in corners of a tall canvas. Do not simply shrink/letterbox the previous composition. Redesign typography and arrangement to use the panoramic strip. No scenery, no official logos, no frames or mock browser chrome. Arrange everything on ONE horizontal row: a compact left label block with exact text 'GPT-6.1 SOL' and 'CODEX & WORK'; next the exact very clear large text '272k' then a right arrow then '500k'; at right a small pair of low document trays, first blue and narrow, second sage and wider, with a few note sheets. The model label MUST stay inside the same central low strip, not at the top of the canvas. Remove the old bottom footer and the default-context subtitle; no extra lines outside the strip. Text only 'GPT-6.1 SOL', 'CODEX & WORK', '272k', '500k'. No usage-quota, price, percentage, or max-context claims.
```

## 原始构图（手机）

## plan

```text
Use case: infographic-diagram. Create a finished VERY WIDE horizontal editorial article cover, aspect ratio 3.5:1, intended 2520 by 720. Subject: Tibo's Codex 28-day update plan, a visual schedule of feature updates and limit resets. Warm ivory paper background #fff8ee, restrained forest-journal aesthetic, berry brown typography #754652, sage, pale blue, apricot, lavender accents. Clean accurate information graphic, editorial print quality, crisp type. At left, the exact large English heading 'CODEX' and beneath it '28-DAY PLAN'. At right, a neat schematic 7-column by 4-row calendar, all 28 cells small equally sized without dates or numbers inside. Include only two small category labels below the calendar: 'FEATURES' and 'RESETS'. Cells alternate gentle blue/apricot/lavender neutrals to suggest categories; no completion check marks, no progress percentage, no assertion that all days delivered. Use tiny sparse watercolor leaf strokes at extreme outside corners only; most of frame communicates calendar structure. All text and graphics within safe central 85% rectangle, generous margins. Wide composition across full frame. No official logos, no human portrait, no screenshot, no fake product interface, no coffee, no books, no landscape scenery, no photoreal props, no other text.
```

## cache

```text
Use case: infographic-diagram. Finished VERY WIDE editorial article cover, aspect ratio 3.5:1, intended 2520 by 720. Topic: OpenAI API 12-hour prompt caching, reuse of an identical instruction/context prefix. Warm ivory paper #fff8ee, berry brown #754652 type, soft sage, pale blue, apricot accents, forest-journal editorial style with crisp modern typography and very subtle watercolor paper texture. Huge clear exact text '12h' on left, exact heading 'PROMPT CACHING' beneath. On right a simple conceptual diagram: one stack of three cream note sheets flows via thin clear arrows to a rounded cache tray, then branches to three small repeated request sheets with the SAME colored top strip and different lower strips. The shared top strip visually means a reused prefix, lower strips new requests. Tiny label 'API' above tray and tiny label 'REUSE CONTEXT' beneath requests. Do NOT show infinity symbols, free pricing, guaranteed savings or Codex forever-cache claims. Diagram must depict a concept, not a real product UI. Central safe 85% margin for all meaningful elements. Sparse sage leaf flecks at extreme corners only. No official logos, no humanoids, no scenery, no coffee, no laptop screenshots, no extra numbers, no other text.
```

## context

```text
Use case: infographic-diagram. Finished VERY WIDE editorial article cover, aspect ratio 3.5:1, intended 2520 by 720. Subject: GPT-6.1 Sol default context window expands from 272k to 500k in Codex & Work. Warm ivory paper #fff8ee, berry brown typography #754652, pale blue and sage with restrained apricot accents, forest-journal editorial look, crisp legible type and subtle paper grain. Top left exact small heading 'GPT-6.1 SOL'. Across center exact BIG text '272k' then clear right arrow then exact BIG text '500k'. Below it exact smaller label 'DEFAULT CONTEXT'. Add two simple low schematic containers corresponding to values: first shorter with a few document sheets, second visibly wider with more document sheets, representing a larger context window; do not make a precise quantitative chart. Exact small footer label 'CODEX & WORK'. All text and graphics comfortably within central 85% safe area. Tiny sparse watercolor leaves at outside corners only. No 80% claim, no usage/quota increase claim, no price, no infinity, no official logo, no product screenshot, no scenic background, no coffee, no other text.
```
