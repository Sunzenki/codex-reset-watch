# CRW 构建、预览、部署与排障手册

> 本文适用于本地构建、UI 验收、Git、Cloudflare Pages、缓存、广告和统计排查。开始任务先读根目录 [AGENTS.md](../AGENTS.md) 和 [PROJECT-MAINTENANCE-GUIDE.md](../PROJECT-MAINTENANCE-GUIDE.md)；视觉规则以 [DESIGN.md](../DESIGN.md) 为准，变更和发布状态见 [CHANGELOG.md](../CHANGELOG.md)。
>
> 最近核对：2026-10-15，依据本地源码、构建入口和路由配置。具体改动的发布状态集中在根目录变更日志；文档更新时间不代表生产部署时间。

## 1. 当前构建与部署配置

| 项目 | 当前配置 |
| --- | --- |
| Node | `>=22.13.0` |
| 包管理器 | pnpm |
| 构建命令 | `pnpm build`；Cloudflare 当前配置可使用等价的 `npm run build` |
| 输出目录 | `dist` |
| Cloudflare Pages 项目 | `codex-reset-watch` |
| 生产分支 | `main` |
| 仓库根目录 | 留空，即仓库根目录 |
| GitHub 仓库 | `Sunzenki/codex-reset-watch` |
| D1 绑定 | `PUSH_DB` → `crw-push` |

构建链路：

```text
修改数据、翻译、页面或 Functions，并同步受影响文档
        ↓
本地验证和生产构建
        ↓
用户检查 UI 预览（UI 变更时）
        ↓
精确暂存、commit、push main
        ↓
Cloudflare Pages 自动构建
        ↓
核对生产部署 SHA 与线上权威信号
```

`dist` 是生成物，不提交 Git。`functions/` 中匹配 `public/_routes.json` 的 `/api/push/*`、`/api/admin/*` API 由 Pages Functions 一并部署。纯文档修改按第 3 节检查，无需重复完整应用构建或 UI 预览。

## 2. 常用命令

```powershell
cd D:\CodeXFolder\WarpNav\codex-reset-time

pnpm install
pnpm dev
pnpm build
pnpm preview

pnpm docs:check
pnpm test:push
pnpm test:push-state
pnpm exec wrangler pages functions build
pnpm exec wrangler pages dev dist

pnpm exec wrangler pages deployment list --project-name codex-reset-watch
```

完整构建按顺序执行：

1. `scripts/validate-data.mjs`
2. `tsc -b`
3. `vite build`
4. `scripts/postbuild-seo.mjs`

构建失败时先修复日期、状态值、重复 ID、缺失字段、SEO 不一致或 TypeScript 错误，不得带着失败结果推送。

## 3. 本地预览边界

`pnpm dev` 和 `pnpm preview` 只提供 Vite 前端与静态文件，不运行本项目的 Pages Functions API。`/api/push/config` 失败不能据此判断浏览器不支持推送，也不能通过重复点击“重试连接”补出本地后端。需要同时验证前端、Functions 和本地 D1 时，先构建，再运行：

```powershell
pnpm exec wrangler pages dev dist
```

本地集成环境的绑定与配置按 [push-operations.md](push-operations.md) 准备。真实 Secret 只放在对应环境的 Secret 管理或被 Git 忽略的本地配置中，不写入手册、日志、截图、命令示例或仓库。

提醒控件先读取当前 origin 已有的 Service Worker 订阅：存在订阅时显示关闭提醒，不依赖新订阅所需的配置接口先成功。浏览器缺少必要 API 才属于“不支持”；配置加载失败属于服务不可用。本地 `http://127.0.0.1:4173`、其他本地端口与 `https://crw.warpnav.com` 是不同 origin，本地页面不能读取正式站订阅。正式站已订阅、本地没有订阅可以同时成立；需要查看或管理正式站状态时使用正式站入口。

按改动范围选择验证：

| 改动范围 | 必要验证 |
| --- | --- |
| 仅文档、文档入口或检查脚本 | `pnpm docs:check`、`git diff --check`；核对说明与所引用源码，不重复 UI 预览或完整应用构建 |
| 内容数据或静态 SEO | `pnpm build`，检查受影响数据和六个页面的静态输出 |
| UI、样式或交互 | `pnpm build`，再完成下列受影响页面与响应式检查，记录在 `design-qa.md` |
| 提醒状态判断、订阅或退订前端 | `pnpm test:push-state`、`pnpm build`；必要时用本地 Functions 环境核对接口与状态，不为测试发送真实通知 |
| 推送服务或 Functions | `pnpm test:push`、`pnpm exec wrangler pages functions build`，并完成 [push-operations.md](push-operations.md) 对应专项检查 |

UI 修改后按项目既有约定先提供本地生产预览供用户检查，再在已有发布授权范围内提交和推送。网站部署和真实通知发送是两个独立动作：部署成功不等于通知已发送，验证页面也不需要创建发送任务。

UI 变更至少检查受影响的以下项目：

- 英文 `/`、`/history/`；简体 `/zh-CN/`、`/zh-CN/history/`；繁体 `/zh-TW/`、`/zh-TW/history/`。
- 旧 `/en/` 与 `/en/history/` 分别 301 到 `/` 与 `/history/`；它们不是当前构建入口。
- 1440、1024、768、430 和 375 CSS px。
- 标题、卡片、导航、历史日历、原帖链接、时间和译文。
- 键盘焦点、跳到主要内容链接和 `prefers-reduced-motion`。

响应式检查不能只看是否有横向滚动：

- 首页采用日期栏、当前动态、原帖便签的手账排版；标题可以按设计自然分行，不要求恢复旧版单行 Hero。
- 不得使用 `white-space: nowrap` 强行挤压或截断标题；手机布局应按可用宽度正常断行。
- `overflow-wrap: anywhere` 只是极端长文本兜底，不能替代正常断行。
- 倒计时数字卡应聚拢并保持序列感，不能用 `space-between` 拉满整行。
- 原帖便签是辅助信息，较长原文不能遮挡操作、时间或正文。
- 首页与最近记录的竖线应沿同一日期栏边界对齐，手机布局按 `DESIGN.md` 重排。
- 只修目标元素，不因单个字号问题全局缩小文字。

需要精确诊断时，在浏览器查看 `getComputedStyle`，并通过字符 `Range.getBoundingClientRect()` 或等效方式测量实际换行边界，不只凭截图猜测。

## 4. UI 与品牌当前约束

当前本地设计方向是“重置手账”：奶油纸张、深色正文、细分割线、日期栏、奶油原帖便签和森林水彩边饰；减少大面积圆角卡片与厚阴影。首页没有单独的“重置手账”横栏，历史页保留栏目标题。不要恢复 `design-system/codex-reset-watch/MASTER.md` 中已经否决的深色墨绿色方案，也不要使用 OpenAI 官方 Logo 或制造官方产品感。

视觉约定以 [DESIGN.md](../DESIGN.md) 为唯一规范入口。首页相关实现在 `src/journal.css`，历史页补充样式在 `src/journal-history.css`；`src/styles.css` 和 `src/calendar.css` 仍包含基础与兼容样式，不能仅凭旧文件恢复已被覆盖的视觉规则。字体使用本地系统字体栈，日期数字使用系统衬线字体，不依赖 Google Fonts。品牌资源位于：

- `public/images/forest-logo.png`、`forest-frame.webp`、`forest-note.webp`（同目录）
- `public/brand-mark.svg`
- `public/favicon.ico`、兼容 SVG 与 PNG 图标；六个公开入口使用带版本参数的 ICO/PNG/Apple-touch 链接
- `public/og.png`（1730×909）

当前素材位于 `public/images/forest-*`、`evidence-*`、`notice-*`，另保留旧 `journal-*` 素材供追溯；装饰图不承担功能信息。favicon 源图为 `public/images/forest-icon.png`，运行 `python scripts/generate-brand-assets.py` 生成 PNG/ICO 及嵌入 PNG 的兼容 SVG，不覆盖 OG 分享图。替换源图后须核对全部尺寸及入口缓存版本；后台入口也使用新版 favicon。

历史页面还使用 `src/ResetCalendar.tsx` 和 `src/calendar.css`。绿色填充日期表示全局重置，杏色不规则日期标记表示储备重置；颜色不是证据或完成状态，预告不覆盖已知重置类型。详情顶部保留时间精度与结果标签。修改列表或历史布局时必须一起检查日历桌面/移动布局、选中日期、记录锚点和无记录说明。

## 5. Git 操作与用户修改保护

开始任务先看 `git status --short --branch`。已有修改属于用户，除非明确知道来源，否则保留并避开。

提交前：

```powershell
git diff --check -- <本次修改的文件>
git diff -- <本次修改的文件>
```

只用精确路径暂存：

```powershell
git add <本次修改的文件>
git commit -m "描述本次变更"
git push origin main
```

不要使用 `git add .`，不要提交 `dist`、凭据、Cookie、Token 或本地环境文件。提交后运行 `git status --short --branch`，确认没有误纳入其他修改。

Windows 沙箱中 `git push` 出现 `SEC_E_NO_CREDENTIALS`，可能只是无法访问 Windows Credential Manager，不代表用户未登录 GitHub。不要立即要求重新登录，也不要把 GitHub Token 写入项目；应使用已授权环境执行推送。

## 6. Cloudflare Pages 部署与验收

正确配置：

- 生产分支 `main`。
- 自动部署启用。
- 构建命令 `npm run build`。
- 输出目录 `dist`。
- 根目录留空。
- 构建监视路径为全部。

GitHub 推送成功只证明远端分支已更新，不等于生产部署完成。除非用户明确要求暂不检查，推送后应：

1. 查看 Cloudflare 最新生产部署 SHA 与状态。
2. 确认 SHA 对应本次提交且状态成功。
3. 检查线上 HTML 引用的新哈希资源。
4. 检查目标数据文件和受影响页面。
5. 检查 `robots.txt`、`sitemap.xml`、`llms.txt`、`ads.txt` 等相关输出。

一次权威信号链已经一致时不要无限轮询。部署 SHA、HTML 资源哈希和目标数据文件相互匹配，通常足以证明本次部署生效。

### GitHub 连接断开

Cloudflare 如果显示项目与 Git 账户断开：

1. Pages 项目 → 设置 → 构建 → Git 存储库“管理”。
2. 打开 GitHub 的 `Cloudflare Workers and Pages` 应用设置。
3. 使用 `Only select repositories` 并确认仓库已授权。
4. 返回 Cloudflare，确认断开警告消失。
5. 仍未恢复时，按 Cloudflare 官方建议重新安装 GitHub App。

恢复连接后不保证自动补构建遗漏提交。只有确认确实需要触发且用户授权推送时，才可创建空提交；不要把旧历史提交号当作当前状态。

Windows `curl`/Schannel 的 `AcquireCredentialsHandle failed`、TLS handshake failed 或 `fetch failed` 只能证明当前客户端连接失败，不能直接证明线上故障。改用浏览器、Cloudflare 部署记录或另一只读 HTTPS 客户端核验。

## 7. 缓存与旧资源排查

`public/_headers` 当前策略：

- `/assets/*`：一年强缓存并标记 immutable，文件名带哈希。
- `/data/*`：`must-revalidate`。
- 三种语言页面：`must-revalidate`。

线上仍显示旧版本时：

1. 先核对生产部署 SHA。
2. 再检查页面标题、数据文件或机器可读文件。
3. 使用临时查询参数排除浏览器/CDN 缓存。
4. 后台仍加载旧资源时强制刷新，对照本次构建的 `dist/crwmaster/index.html` 与线上 `/crwmaster/` 实际引用的 JS/CSS 哈希；构建入口名可能生成 `crwmaster-*.js`，也可能变化，不假定固定为 `admin-*.js`。
5. 没确认部署 SHA 前，不要先归因于 DNS 或浏览器缓存。

## 8. SEO 静态输出与社交卡片

线上应可访问：

- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/data/current.json`
- `/data/history.json`
- `/og.png`
- `/ads.txt`

如果 X 链接预览有标题和描述但图片为空：

1. 直接打开 `/og.png`。
2. 检查线上页面 OG/Twitter 标签。
3. 考虑 X 已缓存图片上线前的旧卡片。
4. 在草稿中删除旧预览，重新粘贴带临时查询参数的页面 URL；canonical 仍保持正式地址。

内容和 SEO 的字段规则见 `content-and-data.md`。

## 9. AdSense 与 Matomo

AdSense 加载器和 Matomo 标准 JavaScript 跟踪代码位于六个公开 HTML 入口的 `<head>`，每个入口各只能出现一次：

- `index.html`、`history/index.html`
- `zh-CN/index.html`、`zh-CN/history/index.html`
- `zh-TW/index.html`、`zh-TW/history/index.html`

不要在 React footer、组件副作用或构建后脚本中重复注入。当前站点使用独立 HTML 入口，不要提前增加 SPA 路由页面浏览跟踪。

根目录 `ads.txt` 是权威文件，构建后复制到 `dist/ads.txt`。不要自动改写发布商信息。验收：

```powershell
rg -n "adsbygoogle\.js|matomo\.js" index.html history/index.html zh-CN/index.html zh-CN/history/index.html zh-TW/index.html zh-TW/history/index.html
Test-Path dist\ads.txt
```

预期两段脚本分别出现在六个入口中，`dist/ads.txt` 存在，线上 `/ads.txt` 返回纯文本。

Chrome 的 `Ad was removed because its network usage exceeded the limit` 常来自广告 iframe。不能仅凭该警告断定 React、加载器或 `ads.txt` 错误。按顺序检查脚本是否重复、警告来源、广告请求和 `ads.txt`，不要反复注入脚本“修复”。

## 10. 通用上线验收

- [ ] Cloudflare 最新生产部署 SHA 对应本次提交且状态成功。
- [ ] `/` 直接显示英文首页，`/history/` 显示英文历史页；旧 `/en/`、`/en/history/` 与无尾斜杠的旧历史地址按 `public/_redirects` 跳转。
- [ ] 六个公开页面均可打开，语言切换保持页面类型。
- [ ] 英文主要时间为 UTC，中文为 UTC+8。
- [ ] 当前和历史 JSON 可直接访问。
- [ ] canonical、hreflang、OG、Twitter 和 JSON-LD 与本次修改一致。
- [ ] `robots.txt`、`sitemap.xml`、`llms.txt`、`ads.txt` 返回正确内容。
- [ ] `og.png` 可访问且为 1730×909。
- [ ] 桌面与移动布局无截断、异常提前换行或横向滚动。
- [ ] 历史日历的绿色/杏色类型标记、列表、详情精度/结果标签与锚点工作正常。
- [ ] 六个 HTML 入口各只加载一次 AdSense 和 Matomo。
- [ ] `/crwmaster/` 不出现在公开导航、sitemap 或普通页面。
- [ ] 若涉及推送，已完成 `push-operations.md` 的专项验收。
- [ ] 在 `CHANGELOG.md` 分别记录本地验证、提交、部署与线上验证的实际状态；若发送过通知，另记发送事件与结果，不将页面发布视为通知发送。


分享图采用用户确认的森林手绘定稿，保留原图尺寸；六个公开入口的 Open Graph / Twitter 图片 URL 使用 `?v=forest-20261016`，宽高元数据必须与图片实际尺寸一致。三语言暂共用同一张中文简介图片，替代文本仍按路由本地化。旧分享缓存是否刷新需部署后核验。
