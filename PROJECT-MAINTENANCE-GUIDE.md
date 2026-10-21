# Codex Reset Watch 项目说明与维护手册

> 最近核对：2026-10-15（按本地源码与文档核对，不代表生产部署日期）
> 项目简称：CRW
> 线上地址：<https://crw.warpnav.com/>
> GitHub：<https://github.com/Sunzenki/codex-reset-watch>
> 协作从 [AGENTS.md](AGENTS.md) 开始；本手册说明当前架构与操作。工作区未发布改动和发布证据见 [CHANGELOG.md](CHANGELOG.md)。

本手册描述仓库当前维护方式，可能包含尚未发布的实现。各项发布阶段集中记录在变更日志；生产版本必须按第 8 节核对，不能由文档更新时间推定。

## 1. 项目定位与不可违反的原则

Codex Reset Watch 是一个轻松、非官方、人工整理的 Codex rate-limit reset 信息站。它展示公开预告的预计重置时间、倒计时、规则变更的落地观察、原始来源、时区换算和可核对的历史记录，并允许访客订阅由站长手动发送的浏览器通知。

### 1.1 产品原则

- 项目名称为 **Codex Reset Watch**，简称 **CRW**，正式域名为 `crw.warpnav.com`。
- 所有权与页脚归属为 WarpNav，主站链接为 <https://warpnav.com/>。
- 项目是娱乐性质的独立站，不包装成 OpenAI 官方产品，也不使用 OpenAI 官方 Logo。
- 重置消息重点核对 Tibo（`@thsottiaux`）的 X 原帖；资讯采编另主动查阅 OpenAI 官方文档、更新日志、状态事件及 `@OpenAI`、`@OpenAIDevs`、`@ChatGPT` 原帖与高相关回复，按 [资讯编辑与发布规则](docs/guides-editorial-policy.md) 取舍与核验。
- 信息由站长提供或在 Codex 采编任务中主动检索；未建立定时监控、X 抓取服务或邮件提醒。不能将一次检索或文章授权说成持续后台值守。
- 网站不会根据历史间隔自动预测下一次重置，也不会自动修改公开数据。
- 站长可提供原帖，Codex 也可主动核验线索并按对应规则维护源码；资讯常规采编和发布已有持续授权，不自动发送通知。
- 预告时间到达只代表倒计时归零，不证明额度已经重置。
- 公开事实、账号实际观察和编辑推断必须明确区分；不能把单点观察扩大成全量结论。
- 宁可暂时没有记录，也不补写无法验证的数据。

### 1.2 非目标

- 不提供 Codex 账号、套餐或剩余额度查询。
- 不保证预告时间精确，也不代表 OpenAI 的服务承诺。
- 不自动抓取、全文复制或转发 X 内容。
- 不提供访客账号、用户画像、邮件名单、付费功能或自动营销。
- D1 与管理登录只服务于浏览器推送；静态内容和历史记录仍以仓库 JSON 为准。
- 部署网站不会自动发送通知；真实通知只能由站长明确确认后发送。

## 2. 技术架构与正式 URL

| 项目 | 当前实现 |
| --- | --- |
| 前端 | React 19 + TypeScript |
| 构建 | Vite 8，Node `>=22.13.0` |
| 内容数据 | 重置事实为 `public/data/*.json`；资讯文章为 `content/guides/{locale}/*.md` |
| 动态接口 | Cloudflare Pages Functions |
| 推送数据 | Cloudflare D1：`crw-push`，绑定 `PUSH_DB` |
| 浏览器推送 | Web Push + VAPID + Service Worker |
| 管理后台 | `/crwmaster/`，4 小时签名会话 |
| 多语言 | 三套独立 HTML 入口，共享 React 组件和翻译数据 |
| SEO 输出 | 构建脚本生成静态快照、JSON-LD、sitemap、robots、llms.txt |
| 广告与统计 | Google AdSense、Matomo Site ID 13 |
| 托管 | GitHub `main` → Cloudflare Pages → `dist` |

公开 URL：

| 语言 | 当前页面 | 历史页面 | 主要时间 |
| --- | --- | --- | --- |
| English | `/` | `/history/` | UTC |
| 简体中文 | `/zh-CN/` | `/zh-CN/history/` | Asia/Shanghai |
| 繁體中文 | `/zh-TW/` | `/zh-TW/history/` | Asia/Taipei |

根地址 `/` 直接承载英文首页，英文历史页为 `/history/`；旧 `/en/` 与 `/en/history/` 分别 301 到 `/` 与 `/history/`。中文语言拥有独立 URL、HTML、canonical、hreflang 和静态 SEO 内容，运行时与英文页面共享组件。

资讯栏目入口：英文 `/guides/`、简中 `/zh-CN/guides/`、繁中 `/zh-TW/guides/`，文章为其下 `{slug}/`。文章维护、置顶/精选轮播、系列目录与预览隔离见 [资讯指南维护](docs/guides.md)。旧版式示例已移除，当前有 21 个选题的英/简/繁全文，共 63 个 published 文件；本次正式发布使用 pnpm build，提交、部署与线上核验阶段见变更日志。

`/crwmaster/` 不是公开导航项并使用 `noindex,nofollow,noarchive`，但隐藏路径不是安全边界；真正保护来自 Secrets、签名会话、同源校验和登录限速。

## 3. 任务路由：本次还要读什么

先阅读 `AGENTS.md`、本文件和 `CHANGELOG.md` 的“未发布”部分，再按实际修改范围继续读取：

| 任务 | 必读文档 |
| --- | --- |
| 新预告、状态、历史、三语言或 SEO | [`docs/content-and-data.md`](docs/content-and-data.md) |
| 资讯文章、置顶、精选、多语言文章或 Markdown | [`docs/guides.md`](docs/guides.md) |
| 资讯选题、来源、文风、质量标准与文章发布 | [`docs/guides-editorial-policy.md`](docs/guides-editorial-policy.md) |
| 浏览器订阅、后台、D1、Service Worker 或真实通知 | [`docs/push-operations.md`](docs/push-operations.md) |
| UI、样式、交互或图片 | [`DESIGN.md`](DESIGN.md)、[`docs/deployment-troubleshooting.md`](docs/deployment-troubleshooting.md) |
| 构建、预览、Git、Cloudflare、缓存、广告或统计 | [`docs/deployment-troubleshooting.md`](docs/deployment-troubleshooting.md) |
| 文档治理与发布记录 | 本手册第 10 节、[`CHANGELOG.md`](CHANGELOG.md) |
| 追溯 2026-09-08 至 09 的决策和事故 | [`docs/history/2026-09-08-to-09-project-log.md`](docs/history/2026-09-08-to-09-project-log.md) |

历史档案只供背景参考，不是当前操作指令。当前事件、依赖、部署和在线状态必须从实际代码、Git、Cloudflare 或线上页面重新核验。

跨领域任务只读取受影响的专题文档。例如更新事件并部署需要内容文档和部署文档；仅排查登录失败无需通读内容规则。

## 4. 关键目录与权威数据源

```text
codex-reset-time/
├─ index.html / en/ / zh-CN/ / zh-TW/   # 根页和六个公开入口
├─ crwmaster/                             # 管理后台 HTML 入口
├─ src/
│  ├─ main.tsx                            # 页面、倒计时、路由与数据读取
│  ├─ ResetCalendar.tsx                   # 历史重置日历
│  ├─ i18n.ts / journal-copy.ts           # 事件三语言文案与手账通用标签
│  ├─ history-meta.ts                     # 历史分类、时间依据与标签
│  ├─ push-state.ts                       # 提醒状态识别与登记失败回滚
│  ├─ icons.ts / icons.css                # 前台与后台共用 Phosphor 图标入口与默认样式
│  ├─ seo-metadata.json                   # 六页 SEO 统一数据源
│  ├─ styles.css / calendar.css           # 基础与日历样式
│  ├─ journal.css / journal-history.css   # 手账首页与历史覆盖样式
│  └─ admin.tsx / admin.css               # 管理后台
├─ public/
│  ├─ data/current.json                   # 当前事件事实
│  ├─ data/history.json                   # 历史事实
│  ├─ data/push-message.json              # 后台默认三语言通知草稿
│  ├─ push-sw.js                          # 通知接收与点击
│  ├─ _routes.json / _headers / _redirects
│  └─ images/ / logo.svg / og.png / icons # 手账装饰与品牌资源
├─ functions/                             # Pages Functions 与共享认证/推送代码
├─ migrations/                            # D1 migrations
├─ scripts/                               # 数据校验、SEO 后处理和推送测试
├─ AGENTS.md / README.md                  # 执行入口与项目简介
├─ DESIGN.md / CHANGELOG.md               # 视觉规范与变更/发布记录
├─ PROJECT-MAINTENANCE-GUIDE.md            # 本手册
├─ design-qa.md                           # 最近一次本地视觉验收，非上线证明
├─ docs/                                  # 当前专题规则与历史档案
├─ social/                                # 推广素材
├─ ads.txt                                # AdSense 权威文件
├─ vite.config.ts / wrangler.jsonc
└─ package.json
```

权威来源顺序：

- 当前与历史事实：`public/data/current.json`、`public/data/history.json`。
- 三语言事件文案：`src/i18n.ts`；通用手账标签在 `src/journal-copy.ts`，历史标签在 `src/history-meta.ts`。
- 通用 SEO 标题与描述：`src/seo-metadata.json`，并由六个 HTML 入口保持一致。
- 视觉约定：`DESIGN.md`；实际渲染需同时核对 `journal.css`、`journal-history.css` 与基础样式。
- 构建和依赖：`package.json`、`vite.config.ts`。
- Cloudflare 与 D1：`wrangler.jsonc` 和控制台当前状态。
- 生产版本：Git 提交、Cloudflare 部署 SHA 和线上实际资源共同确认。

`design-system/codex-reset-watch/MASTER.md` 是被否决的早期深色方案，不能作为现行视觉规范。

## 5. 内容更新标准流程

以下是当前/历史重置事件的入口流程；字段和措辞细节见内容专题文档。资讯文章按 [编辑与发布规则](docs/guides-editorial-policy.md) 执行，涉及重置事实时再同步本节数据流程。

1. **核对来源**：打开原帖，记录 URL、原文、准确发帖时间、时区、范围和后续纠正。
2. **划分证据**：区分公开事实、账号观察和编辑判断，明确证据覆盖范围。
3. **处理时间**：以原帖语境确定相对日期，区分 PST/PDT，保留 `around` 等不确定性。
4. **更新数据**：修改 `current.json`；需要归档时同步 `history.json`。
5. **同步语言与 SEO**：更新 `i18n.ts`；只有通用搜索定位变化时才修改 `seo-metadata.json` 与六个 HTML 入口。
6. **验证构建与页面**：运行 `pnpm build`，检查三语言当前页、历史页、日历和受影响的机器可读输出。
7. **预览、提交和部署**：UI 变化先让用户检查本地生产预览；获得同意后精确暂存、提交、推送并核对生产部署。
8. **同步说明和记录**：受影响字段、操作流程和设计规则同步到唯一对应文档；在 `CHANGELOG.md` 合并记录此次完整改动及准确发布阶段。

核心语义边界：

- `kind` 描述事件形态，`status` 描述证据或进度。
- 没有可信统一时间时 `resetAt` 必须为 `null`，不能为了倒计时虚构时间。
- 确认帖时间只能称为公开确认时间，除非来源明确给出后台执行时刻。
- 历史记录不能因倒计时归零自动标为 `as_announced`。
- 每条历史记录必须有对应三语言 `historyCopy`，并检查日历日期和详情锚点。
- 历史 `eventType`、`resetType`、`timeBasis` 分别表达事件形态、全局/储备类型和时间依据；日历颜色不能代替完成证据。

阶段交接与下一步顺序见 [2026-10-15 至 16 改版阶段报告](docs/history/2026年10月15日至16日-改版成果与下一阶段推进报告.md)。该报告是阶段快照，现行规则仍以本手册与 DESIGN.md 为准。

## 6. UI 与品牌边界

当前本地视觉为“重置手账”：奶油纸张、森林水彩边饰、莓棕标题、日期栏和原帖便签。完整约定只维护在 [DESIGN.md](DESIGN.md)，本节保留产品边界；上线状态见变更日志。

必须保持：

- 不恢复大面积深黑或墨绿色开发者仪表盘风格。
- 不使用 OpenAI 官方 Logo，不制造官方产品感。
- 首页标题可按设计分行，手机端自然换行；不得用强制不换行制造截断。
- 倒计时卡保持紧凑和明确的时间序列感。
- 手机导航保留完整品牌标志和可关闭的展开菜单。
- 历史页同时检查记录列表与重置日历。
- 首页下方展示排除当前事件的最近三条记录；全局与储备分别使用绿/杏色不规则标记，预告不覆盖已知重置类型。
- 原帖发布时间与本站更新时间分别标明；首页摘要的 `原帖发布` 固定换算为 PST（UTC−8），不是作者所在地时区的证据；其他日期按路由显示 UTC / UTC+8，统一使用 UTC 标记，不得改成执行时间。
- 保留键盘焦点、跳到主要内容链接和 `prefers-reduced-motion`。
- 用户只指出局部问题时，只调整受影响元素，不做无依据的全局缩放。

具体 CSS、响应式测量和浏览器检查见部署专题文档。

## 7. 安全、授权与外部操作边界

- 新建或修改网站内容不等于授权发送浏览器通知。
- 任何真实通知都属于外部消息发送，必须获得用户对该次发送的明确授权。
- 通知事件 ID 是幂等键；新消息使用新 ID，失败重试只恢复准确事件的失败投递。
- 不通过重复点击猜测重试结果；先看失败阶段并确认客户端是否已经收到。
- 不打印、提交或写入普通文档的内容包括后台密码、VAPID 私钥、会话密钥、Bearer Token、Cookie、订阅 endpoint、`p256dh`、`auth` 和本地环境文件。
- 不随意轮换 VAPID 密钥；现有订阅可能因此失效。
- 不绕过登录、同源校验、验证码或平台权限。
- 推送、公开社交发布、删除数据、修改线上配置等高影响操作只在明确授权范围内执行。
- 修复 D1 状态必须使用准确条件，不执行无条件批量更新。

## 8. 构建、预览、提交与上线

开始任务先检查实际代码和 `git status --short --branch`。已有未提交修改属于用户；保留并避开无关内容。

基础命令：

```powershell
cd D:\CodeXFolder\WarpNav\codex-reset-time
pnpm docs:check
pnpm build
pnpm preview
```

纯文档只需文档检查和差异检查；修改文档检查器再运行 `pnpm test:docs`，无需重复 UI 预览或完整应用构建。

提醒状态/订阅前端改动运行 `pnpm test:push-state` 和构建。服务端推送协议或 Functions 改动按专题运行：

```powershell
pnpm test:push
pnpm exec wrangler pages functions build
```

提交规则：

- 构建失败不推送。
- UI 修改先启动本地生产预览，用户明确同意后才能提交和推送。
- 常规资讯文章的持续发布授权及首次上线前提见 [编辑与发布规则](docs/guides-editorial-policy.md)；不把 UI 审批流程扩展成逐篇文章审批，也不借文章更新夹带未批准的栏目结构或无关改动。
- 提交前对本次文件运行 `git diff --check` 并查看实际 diff。
- 使用精确路径 `git add`，禁止 `git add .`。
- 不提交 `dist` 或无关用户修改。
- 推送 `main` 后检查 Cloudflare 最新生产部署 SHA 和状态。

GitHub 推送成功不等于上线已经独立验证。除非用户明确要求暂不检查，最后还要核对线上页面、目标 JSON、当前哈希化资源和受影响的 SEO/广告/统计输出。

网站部署和通知发送是两个独立阶段。即使生产部署成功，没有新的明确授权也必须停在发送之前。

`pnpm dev` / `pnpm preview` 不运行 Pages Functions。配置接口返回 HTML、加载失败或本地没有后端不等于浏览器不支持；前台先检查当前 origin 的已有订阅。本地与正式站订阅彼此独立，完整接口环境和具体状态见推送专题。

## 9. 完成定义与通用验收

任务完成必须包含已授权修改、相应验证和清晰记录。只有计划、payload、commit 或 GitHub 推送不一定代表上线完成。

通用检查：

- [ ] 修改内容与任务范围一致，没有碰到用户无关变更。
- [ ] 受影响手册/设计说明和 `CHANGELOG.md` 已同步；`pnpm docs:check` 通过。
- [ ] 事实、观察和推断的表达与证据一致。
- [ ] 受影响的语言、数据、页面和依赖字段已同步。
- [ ] 应用变更的 `pnpm build` 及受影响专项检查通过；纯文档不重复应用测试。
- [ ] UI 改动已在要求宽度和交互状态下预览，并获得用户上线同意。
- [ ] 提交只包含精确文件，没有 `dist`、凭据或本地配置。
- [ ] 若已推送，Cloudflare 生产 SHA 与本次提交一致且线上权威信号已核对。
- [ ] 若用户要求暂不查生产，明确记录尚未验证上线，而不声称完整上线。
- [ ] 若涉及真实通知，三语言、事件 ID、订阅数和点击路径已检查，且本次发送有明确授权。

专项验收分别见：

- 内容、历史、三语言、SEO：`docs/content-and-data.md`
- 浏览器推送与后台：`docs/push-operations.md`
- 页面、部署、缓存、广告与统计：`docs/deployment-troubleshooting.md`

## 10. 文档维护规则

- `AGENTS.md` 保存简短执行规则与任务路由；README 保存项目介绍、命令和链接；本手册保存架构、产品边界与操作摘要。
- 本手册只保存当前有效规则，不追加逐日工作纪要。视觉细节集中在 `DESIGN.md`，专题文档分别维护内容数据、资讯采编、文章实现、推送与部署细节。
- 专题文档保存可执行细节；同一规则只保留一个权威位置，其他地方使用链接或一句摘要。
- 会随时间变化的事件、订阅数、部署状态和依赖版本不写成永久事实；任务开始时实时核验。
- 已解决事故的完整过程进入 `docs/history/`，现行文档只保留事故揭示出的当前约束。
- 旧历史档案不得覆盖当前代码和专题规则。
- 重大架构或安全边界变化时，先更新对应专题文档，再更新本手册的摘要和路由。
- 一次完整改动在根目录 `CHANGELOG.md` 记一条，多轮微调合并；记录原因、改动、验证、发布阶段、提交/部署依据和遗留问题。代码、说明和日志随同一次改动提交。
- 新改动进入“未发布”；提交、部署、线上验证分别更新，真实通知另记。`design-qa.md` 的 passed 只说明其列出的本地视觉检查通过。
- 主手册、现行专题、设计规则和必要历史均纳入 Git 管理；凭据、环境文件、生成物继续忽略。移除忽略规则不等于已经暂存或提交。
- `pnpm docs:check` 校验必需文档、仓库内 Markdown 文件链接和 Git 忽略规则，不联网校验外链，不判断说明是否仍符合代码；后者由维护者按任务核对。
- 历史计划明确标记“历史”，不因其包含步骤就重复执行；无法从 Git 或部署证据核实的旧记录写“未核验”。

文档索引：

- [`AGENTS.md`](AGENTS.md)
- [`DESIGN.md`](DESIGN.md)
- [`CHANGELOG.md`](CHANGELOG.md)
- [`design-qa.md`](design-qa.md)（最近一次本地视觉验收）
- [`docs/content-and-data.md`](docs/content-and-data.md)
- [`docs/guides-editorial-policy.md`](docs/guides-editorial-policy.md)
- [`docs/guides.md`](docs/guides.md)
- [`docs/push-operations.md`](docs/push-operations.md)
- [`docs/deployment-troubleshooting.md`](docs/deployment-troubleshooting.md)
- [`docs/history/2026-09-08-to-09-project-log.md`](docs/history/2026-09-08-to-09-project-log.md)
- [`docs/maintenance-guide-refactor-plan.md`](docs/maintenance-guide-refactor-plan.md)（2026-09-20 历史方案）
- [`浏览器重置提醒功能实施计划.md`](浏览器重置提醒功能实施计划.md)（推送初版历史方案）
