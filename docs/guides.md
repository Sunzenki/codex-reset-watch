# 资讯指南：内容与维护

2026-10-22 首次正式发布及三语线上验收已完成；提交、部署及核验依据见 [变更日志](../CHANGELOG.md)。当前源码有 22 个选题、66 份三语 published 稿件，含本轮新增 Day 17；源码状态与生产发布阶段分别记录，部署使用 pnpm build。

选题、来源核验、Google SEO、E-E-A-T、写作文风、发布授权与更正统一执行 [资讯编辑与发布规则](guides-editorial-policy.md)。本文维护文章文件、字段和构建操作；技术验收与搜索验证范围见规则第 9 节，页面检查通过不等同于已收录。

## 页面与来源

栏目延续森林手账，采用顶部满宽精选轮播、彩色分类标签、日期索引列表与独立文章页。普通详情页桌面使用左侧目录，手机使用可展开目录；系列总目录使用满宽日历，先展示表格，再展示解释文案。设计依据见 [选定参考](design-references/guides-selected.png) 和 [设计规范](../DESIGN.md)。

| 语言 | 列表 | 文章 |
| --- | --- | --- |
| English | `/guides/` | `/guides/{slug}/` |
| 简体中文 | `/zh-CN/guides/` | `/zh-CN/guides/{slug}/` |
| 繁體中文 | `/zh-TW/guides/` | `/zh-TW/guides/{slug}/` |

文章源文件在 `content/guides/{locale}/*.md`。不同语言用同一个 `id` 关联，`slug` 可不同；同语言不允许重复 id 或路径。 当前稿件三语全文齐备；后续新稿和实质修订默认同步三语的标题、摘要、正文、来源名称、ALT 及同语言内链，保留事实字段、源链接与证据程度。译文未完成时不得生成仅换标题的占位文章。栏目 UI 三语齐备，文章按实际翻译发布。切换语言时，没有译文则到目标语言列表并显示提示，不生成空文章或伪造译文。

列表分页使用 `{列表}/page/2/` 等独立静态地址；彩色分类使用 `{列表}/category/{分类}/`，其分页追加 `page/2/`。旧本地试做的列表 `?category=...&page=...` 不再改变清单，列表内容以路径为准。文章链接仍可带 category/page 查询参数保存返回位置，canonical 保持不含参数的文章地址。`{列表}/editorial/` 是三语公开编辑与更正说明，文章署名及列表/文章底部可进入。

首页和历史事实仍分别以 `public/data/current.json`、`public/data/history.json` 为准。文章用于新闻、产品更新、故障信息和教程，不替代重置记录，不自动抓取来源或发送通知。

## 文章格式

YAML front matter 支持以下写法；文章源文件使用等价的 JSON 对象头，正文均为 Markdown。

```yaml
---
id: understanding-reset-times
slug: understanding-reset-times
title: 如何读懂 Codex 的额度与重置时间
summary: 核对来源、范围与时间依据，再判断一条重置消息意味着什么。
locale: zh-CN
category: tutorials
publishedAt: "2026-10-21T02:00:00Z"
status: draft
pinned: false
pinOrder: 1
featuredOrder: 1
cover: /images/guides-tibo-28-day-plan.webp
bannerCover: /images/guides-tibo-28-day-plan-banner.webp
coverAlt: Codex 28 天计划示意日历
coverWidth: 1983
coverHeight: 793
sources:
  - label: 本站历史记录
    url: /zh-CN/history/
---

开篇说明。

## 第一个章节

正文内容。
```

必填：`id`、`slug`、`title`、`summary`、`locale`、`category`、`publishedAt`、`status`。id 和 slug 使用小写字母、数字、连字符；slug 不得使用保留的 `page`、`category`、`editorial`。时间为带时区、含秒的 ISO 字符串，YAML 中加引号；日历日必须真实存在，拒绝 2 月 31 日、非闰年 2 月 29 日及 24:00 这种滚动写法。可选 `updatedAt` 仅在实质修订时填写，不能早于发布时间。`published` 文章的发布/更新日期不得在未来；预览示例可保留演示日期，不能据此转为正式稿。

| 分类值 | 简中标签 | 颜色 |
| --- | --- | --- |
| `news` | 新闻动态 | 玫瑰 |
| `updates` | 产品更新 | 浅蓝 |
| `incidents` | 故障信息 | 杏色 |
| `tutorials` | 使用指南 | 鼠尾草绿 |

- `pinned: true` 使文章优先排列；多个置顶按 `pinOrder` 从小到大，同优先级再按本站 `publishedAt` 倒序。非置顶文章统一按 `publishedAt` 倒序，系列文章也遵循此规则；发布时间相同的批次再按显示日期、同系列日号倒序及 slug 稳定排列，不用 `updatedAt` 制造“新文章”。取消置顶只需改为 false。
- `featuredOrder` 为独立精选设置，正整数从小到大，最多取前三篇；不填写则不进入精选。精选只在“全部”的第一页展示，满宽单篇轮播，每 7 秒切换；鼠标停留、键盘焦点在内、页面隐藏或用户暂停时停止，手动切换后保持暂停。系统减少动态效果时不自动轮播。文章不足三篇时按实际数量展示，只有一篇时隐藏切换控件。
- `cover` 可选，只接受实际存在的 `public/images/` 图片；不强制每篇配图。三张精选封面是与文章对应的主题示意（28 天日历、12h 缓存复用、272k → 500k），网页使用 WebP；记录见 [封面与提示词](design-references/tibo-banner-prompts.md)。`coverAlt` 为准确替代文本，`coverWidth` / `coverHeight` 为正整数真实尺寸；用 contain 保留数字、箭头和图意，不裁切信息；可选 `bannerCover` 指向同主题的桌面专用横向图片，同样必须是本地真实资源，并配套 `cover`。宽于 700px 时 picture 选择约 6.5:1 的桌面稿，图片区限制在 120–190px，配紧凑标题摘要；手机继续使用 `cover` 原始比例。横幅服务于列表阅读，不能通过无限增高封面挤掉首屏文章。文章社交分享暂沿用站点共用森林 OG 图及品牌替代文本，标题、摘要和 URL 独立生成。Article JSON-LD 当前省略可选 image，不能从 cover 或品牌 OG 自动推定文章内容图片。
- `sources` 为名称与 https / 站内 URL 数组，正式文章至少保留一项来源。`corrections` 可选，为 `date`、`text` 对象数组，在正文下方展示。
- 正文支持二、三级标题、段落、引用、列表、表格、代码块和本地图片。主标题来自 front matter；正文不接受原始 HTML、危险 URL 或远程图片。目录由二级标题自动生成。

## 正式、预览与草稿

| status | `pnpm build` | `pnpm build:preview` / `pnpm dev` |
| --- | --- | --- |
| `published` | 包含 | 包含 |
| `preview` | 排除正文与清单 | 包含，显示本地预览提示 |
| `draft` | 排除正文与清单 | 排除正文与清单 |

旧八个版式示例已从内容源移除，旧地址本地预览返回 404。当前源码有 22 个选题：Tibo 目录与 Day 1–17，以及模型退役迁移、CLI 0.163.0 更新、10 月 21 日故障记录、用量面板四篇实用稿。英文、简中、繁中各 22 篇，共 66 个 `published` 文件；每页 8 篇，实际为 8 / 8 / 6，第一页同时覆盖四种分类。Tibo 底稿见 [系列核验](tibo-28-days-source-review.md)，实用稿来源、范围与译文处理见 [采编记录](guides-practical-source-review.md)。精选顺序仍为目录、Day 16 缓存、Day 7 上下文。

本批首次发布字段为 `2026-10-21T20:51:53Z`（北京时间 10 月 22 日 04:51:53），属于本次上线批次时间；部署完成时刻另记日志。该字段替换预览阶段的整理时间，不倒填成事件日期。系列文章的列表日期及详情主日期按日历的 PT 日期显示，标为“系列日期”；目录标“计划起始”。时区标签使用“美西时间 / 美西時間 / Pacific Time”，保留 America/Los_Angeles 的日期规则。例如 Day 16 显示 2026-10-20，而原帖 UTC 是 2026-10-21。`publishedAt` 保留本站实际稿件/首次公开时间，不能用事件日倒填。预览稿不输出 Article 的 datePublished/dateModified；正式发布后才输出真实值，并在来源区域显示本站发布日期。新普通文章仍显示真实发布日期。

## 系列总目录与日文章

目录 front matter 的 `series` 对象：`id`（系列关联）、`startDate`（YYYY-MM-DD）、`days: 28`、`timeZone: America/Los_Angeles`、`checkedAt`（本轮资料实际核对时间）。这组字段只随目录文章进入清单，正式构建会连同预览目录排除。

日文章设置 `seriesId`、`seriesDay`（1–28）、`seriesKinds`（`feature` / `reset` / `banked` / `broadcast`，可多选）和 `announcedAt`（主要来源带时区时间；来源最后编辑时间须在正文说明）。`publishedAt` 仍是本站稿件日期，不用事件日倒填。日历日期统一由目录 startDate 与 seriesDay 派生，不从 UTC 原帖日期直接截取；列表置顶优先，其余按本站发布时间倒序，显示的系列日期与排序依据各自保留含义。

每日文章三语标题统一以 `Tibo's Day {日号}` 开头，例如 `Tibo's Day 16｜API 可选 12 小时缓存…`；日号不补零。列表、详情、精选、相关阅读及元数据直接使用这一标题。总目录保留独立目录名称；日历格已有 DAY 日号，因此其正文标题仍省去重复的系列前缀。

编译器校验同语言唯一目录、唯一日号，以及当前构建内日文章的目录关系。`src/guide-series.mjs` 按日期逐格生成 28 天，跨 11 月夏令时结束不移位；`GuideSeriesGrid` 从当前可见日文章派生链接、标签和统计，不另维护一份卡片事实。未到日期或已到但未核实日期只有无链接占位。目录页标题/摘要后先是统计与日历，随后解释、来源与更正；日文章在正文前提供返回总目录和相邻已存在日文章的入口。

“已整理”按已有独立文章计数；功能按 feature 天数，重置相关按 reset 或 banked 天数去重，可重叠。banked 明确显示储备预告，broadcast 单列，不把未核验直播内容计为功能。当前源码目录为 17/28 已整理、11 个功能日、8 个重置相关日，其中第 3 天仍为储备预告，第 17 天为重置预告，统计不等于完成次数。

预览构建的资讯页统一 `noindex,follow`，不进入 sitemap；草稿和示例不会进入正式构建的文章 JSON、HTML 或客户端包。没有正式文章时，正式构建显示整理中状态，列表页 noindex。

不要将 `build:preview` 的 dist 用于正式部署。正式发布前核对真实来源、时间和译文，将实际文章改为 `published` 后重新运行 `pnpm build`。用户已授予常规资讯文章的持续发布授权，具体范围与首次上线准备见编辑与发布规则，不再逐篇重复询问。

## 构建与验证

```powershell
pnpm test:guides
pnpm build
pnpm check:guides-seo
pnpm build:preview
pnpm preview --host 127.0.0.1 --port 4173 --strictPort
pnpm check:guides-seo --base=http://127.0.0.1:4173
pnpm docs:check
git diff --check
```

`scripts/prepare-guides.mjs` 校验 Markdown 并生成忽略的 `src/generated/guides.json`；不要手动编辑生成清单。正式构建和预览构建都先准备清单。`pnpm dev` 启动前生成预览内容，修改 Markdown 后需要重新运行。

`scripts/postbuild-guides.mjs` 在现有六页 SEO 之后，于构建期渲染实际 React 列表/文章/编辑说明组件，生成对应静态 HTML，无需生产 Node SSR 服务。列表、精选、目录、署名、日期、来源和更正共用组件，避免静态模板与客户端各自维护。元数据和索引策略来自 `scripts/guides-seo.mjs`；路由及每页八篇的切分由 `src/guide-routing.mjs` 共享。

普通列表、四个固定主题分类及其有效分页使用 self-canonical；有正式文章时 index,follow 并进入 sitemap。分类有独立 H1、可见简介、标题、描述与主题关键词；空清单和所有预览页 noindex，不进入 sitemap。ItemList 只描述当前页。真实文章译文建立对应 hreflang；列表与分类仅在有对应内容的第一页关联，不把不同语言的第 2 页强行当作译文。编辑说明使用 AboutPage；文章作者链接到实际组织说明。

分类页标题标明当前分类，第二页起添加本语言页码；静态与客户端共用 `guideListTitle`，不会在加载后覆盖成栏目通用标题。这是帮助读者辨识页面的改进，并非 Google 禁止分页复用标题。SEO 检查还核对站内锚点及 picture/srcset 资源，避免目录链接或桌面专用封面遗漏。手机目录的“展开/收起”文字由原生 details 状态驱动，三语同步。

构建生成根目录 404.html，供 Cloudflare Pages 使用。`scripts/vite-preview-404.mjs` 让本地生产预览中不存在的页面返回 404 和 noindex，不再回落为首页 200。2026-10-22 已独立核验 Cloudflare 正式站的有效页面 200，以及旧示例、非法分类和越界分页 404；以后发布仍需复查受影响路径。`pnpm check:guides-seo` 核查静态内容、元数据、来源、译文、链接和 sitemap；传入本地或正式域名 --base 时增加实际 200/404 响应检查，不依赖 Google 服务或触发真实通知。

分页每页八篇；分类与页码保存到 URL，文章的返回列表链接保留原分类与页码。检查主推链接、标题链接、分类、第二页、返回列表、目录、手机菜单和译文缺失提示。多语言与响应式检查遵循 [部署与排障](deployment-troubleshooting.md)，结果见 [最近本地验收](../design-qa.md)。

## 列表与分类的主题 SEO

本轮用户要求将四个固定分类建设为可索引的主题归档，替代初版的临时筛选 noindex 策略。配置位于 src/guides-copy.json：主列表的 siteTitle、seoDescription、seoKeywords；四类的 categoryPages.heading/title/description/keywords。共享标题函数同步静态与客户端，分页标题和描述带本语言页码；OG/Twitter、CollectionPage 与页面描述一致。分类 sitemap lastmod 取本分类文章的实际变更日期。

| 页面 | 内容重点 |
| --- | --- |
| 资讯总列表 | Codex / OpenAI、额度重置、产品更新、故障排查与实用指南 |
| 新闻动态 | 模型可用性、迁移安排与使用政策 |
| 产品更新 | Codex CLI/桌面端、模型与 API 的版本、功能及适用范围 |
| 故障信息 | OpenAI Status、受影响组件、恢复进展及任务排查 |
| 使用指南 | 用量面板、共享额度、重置时间与 API 计费 |

关键词按真实主题组织，不为同义词或长尾组合生成重复落地页。按用户要求输出简洁 meta keywords 字段；[Google 明确不使用它决定索引或排名](https://developers.google.com/search/docs/crawling-indexing/special-tags)，不能把填写标签当成关键词优化完成。核心工作是准确的标题、可读描述、主题正文、内链和来源。文章仍用自身 title/summary 作为独立标题及描述；正文中的型号、范围与操作入口保持自然表达。

真实源内容不足的空分类、预览稿、非法或越界地址保持既有索引隔离/404；分类地址与查询参数不同，文章返回状态参数继续 canonical 到干净文章 URL。实际 Google 收录、标题改写和搜索摘要需要抓取及 Search Console 证据，不能以构建通过保证。
