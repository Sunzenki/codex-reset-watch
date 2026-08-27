# Codex Reset Watch 项目说明与维护手册

> 最后整理：2026-08-28
> 项目简称：CRW
> 线上地址：<https://crw.warpnav.com/>
> GitHub：<https://github.com/Sunzenki/codex-reset-watch>
> 本文件是后续人工更新与 Codex 接手维护时的首要参考文档。

## 1. 项目概览

Codex Reset Watch 是一个轻松、非官方、人工整理的 Codex rate-limit reset 信息站。它展示当前公开预告的预计重置时间、倒计时、额度规则变更的落地观察、原始来源和时区换算，并保存可核对的历史记录。

### 已确定的产品原则

- 项目名称：**Codex Reset Watch**，简称 **CRW**。
- 正式域名：`crw.warpnav.com`。
- 所有权与页脚归属：WarpNav，主站链接为 <https://warpnav.com/>。
- 项目是娱乐性质的小型独立站，不包装成 OpenAI 官方产品。
- 信息来源目前主要是 Tibo（`@thsottiaux`）在 X 上的公开发言。
- 信息发现完全依靠站长日常浏览 X；不使用 X API、不爬取 X、不建立自动监控或邮件提醒。
- 网站不会自动修改公开数据。站长发现新消息后，将原帖交给 Codex 或手动修改源码。
- 预告时间到达只代表倒计时归零，不自动证明额度已经重置。
- 官方预告、站长/用户实际观察和编辑推断是三种不同证据，页面必须明确区分。
- 宁可暂时没有记录，也不为填满页面而补写无法验证的数据。

### 非目标

- 不提供 Codex 账号、套餐或剩余额度查询。
- 不保证预告时间精确，也不代表 OpenAI 的服务承诺。
- 不根据历史间隔自动预测下一次重置。
- 不自动抓取、转发或全文复制 X 内容。
- 不做登录、数据库、后台管理系统或付费功能。

## 2. 技术栈与部署架构

| 项目 | 当前实现 |
| --- | --- |
| 前端 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| 数据 | `public/data/*.json` 静态 JSON |
| 样式 | 单一 `src/styles.css`，无 CSS 框架 |
| 多语言 | 三套独立静态入口，共享 React 组件与翻译数据 |
| SEO 输出 | 构建后脚本生成静态快照、JSON-LD、sitemap、robots、llms.txt |
| 广告 | Google AdSense 全站加载脚本 + 根目录 `ads.txt` |
| 统计 | Matomo JavaScript 跟踪代码，站点 ID `13` |
| 代码托管 | GitHub 公共仓库 `Sunzenki/codex-reset-watch` |
| 网站托管 | Cloudflare Pages |
| 生产分支 | `main` |
| Cloudflare 构建命令 | `npm run build` |
| Cloudflare 输出目录 | `dist` |
| Cloudflare 根目录 | 留空，即仓库根目录 |
| Node 版本 | `>=22.13.0` |

构建链路如下：

```text
修改 JSON / 翻译 / 页面
        ↓
Git commit + push main
        ↓
Cloudflare Pages 自动拉取 GitHub
        ↓
npm run build
        ↓
数据校验 → TypeScript → Vite → SEO 后处理
        ↓
dist/ 发布到 crw.warpnav.com
```

`dist` 是构建时生成的产物，不需要提交到 GitHub。Cloudflare 会执行构建命令后得到该目录。

## 3. 页面与 URL 结构

默认首页是英文版。根地址通过 `public/_redirects` 以 301 跳转到 `/en/`。

| 语言 | 当前预告 | 历史记录 | 时间显示 |
| --- | --- | --- | --- |
| English | `/en/` | `/en/history/` | UTC |
| 简体中文 | `/zh-CN/` | `/zh-CN/history/` | Asia/Shanghai（UTC+8） |
| 繁體中文 | `/zh-TW/` | `/zh-TW/history/` | Asia/Taipei（UTC+8） |

旧地址 `/history` 和 `/history/` 会跳转到 `/en/history/`。

这里的“每种语言一套独立页面”是指每种语言有独立 URL、HTML 入口、canonical、hreflang 和静态 SEO 内容；运行时仍共享 `src/main.tsx` 和 `src/styles.css`，避免维护三套重复组件。

## 4. 关键目录与文件

```text
codex-reset-time/
├─ index.html                     # 根地址跳转到英文版
├─ en/                            # 英文首页与历史页入口
├─ zh-CN/                         # 简体中文入口
├─ zh-TW/                         # 繁体中文入口
├─ src/
│  ├─ main.tsx                    # 页面组件、倒计时、数据读取、路由判断
│  ├─ i18n.ts                     # 三语言 UI 与每条事件的本地化说明
│  └─ styles.css                  # 当前实际 UI 设计规范与响应式样式
├─ public/
│  ├─ data/current.json           # 当前重置预告
│  ├─ data/history.json           # 历史记录
│  ├─ logo.svg                    # 横向 Logo
│  ├─ brand-mark.svg              # 小尺寸 CRW 标志
│  ├─ favicon.* / icon-*.png      # 浏览器与 PWA 图标
│  ├─ og.png                      # 1200×630 社交分享图
│  ├─ _redirects                  # Cloudflare Pages 重定向
│  ├─ _headers                    # 缓存策略
│  └─ site.webmanifest            # PWA/设备图标信息
├─ ads.txt                        # AdSense 授权文件；构建后复制到 dist/ads.txt
├─ scripts/
│  ├─ validate-data.mjs           # 构建前 JSON 数据校验
│  ├─ postbuild-seo.mjs           # 构建后 SEO/GEO 与静态内容生成
│  └─ generate-brand-assets.py    # 品牌资源生成脚本
├─ social/wechat-xiaolvshu/       # 公众号“小绿书”推广图
├─ vite.config.ts                 # 七个 HTML 构建入口
├─ package.json                   # 依赖与脚本
└─ PROJECT-MAINTENANCE-GUIDE.md   # 本手册
```

注意：`design-system/codex-reset-watch/MASTER.md` 是项目早期自动生成的深色、墨绿色设计提案，已经被否决，与当前上线 UI 冲突。**后续不要按照该文件恢复深色风格**。现行视觉规范以本手册和 `src/styles.css` 为准。

## 5. 数据模型

### 5.1 当前预告：`public/data/current.json`

主要字段：

| 字段 | 说明 |
| --- | --- |
| `kind` | 当前信息类型：普通重置事件、额度规则落地观察或已完成重置确认 |
| `status` | 当前状态，见下方状态表 |
| `resetAt` | 目标时间，ISO 8601 UTC；无有效预告时为 `null` |
| `sourceTimezone` | 原文时区说明，保留原作者的写法 |
| `originalTimeText` | 原文中的时间短语 |
| `scope` | 原帖适用范围，例如 Codex、付费用户等 |
| `announcement` | 来源名称、原文、翻译、URL、发帖时间 |
| `updatedAt` | 本站最后一次人工更新时间，ISO 8601 UTC |
| `note` | 歧义、纠正或重要编辑说明 |

允许的 `kind`：

| 值 | 使用场景 |
| --- | --- |
| `reset` | 有明确或近似目标时间的普通重置预告 |
| `rollout_observed` | 官方宣布规则变更，且已有实际账号观察到开始落地，但没有统一精确时刻 |
| `reset_confirmed` | 原帖使用完成式措辞，明确确认重置已经发生，但没有另行给出执行时刻 |

`kind` 与 `status` 不可混为一谈。`kind` 描述事件形态，`status` 描述证据/进度。`rollout_observed` 可以使用 `status: "confirmed"`，同时让 `resetAt: null`，因为“已观察到开始落地”不等于“已知所有账号的统一重置时刻”。`reset_confirmed` 同样允许 `status: "confirmed"`、`resetAt: null`：页面展示完成态，不显示倒计时，并将确认帖发布时间与后台实际执行时刻明确区分。不要为了显示倒计时而虚构 `resetAt`。

允许的 `status`：

| 值 | 使用场景 |
| --- | --- |
| `monitoring` | 当前没有有效时间，正在等待新消息 |
| `estimated` | 原帖包含 `around`、`next hour` 等近似表达 |
| `confirmed` | 原帖明确给出具体时间，或已经确认发生 |
| `reached` | 预告时间已经到达，但不等于确认发生 |
| `superseded` | 旧预告已被后续消息修正或替代 |

当前运行时页面标题不会直接使用 JSON 里的 `headline` 字段，而是由 `src/main.tsx` 根据 `kind`、`status`、`resetAt` 和当前语言动态生成。无 JavaScript 静态快照的标题则由 `scripts/postbuild-seo.mjs` 生成。因此更新事件时，必须同步核对 `public/data/current.json`、`src/i18n.ts` 与 `scripts/postbuild-seo.mjs`，不能只修改其中一处。

### 5.2 历史记录：`public/data/history.json`

每条记录需要：

| 字段 | 说明 |
| --- | --- |
| `id` | 全局唯一，建议 `reset-YYYY-MM-DD-short-label` |
| `targetAt` | 换算后的目标时间或确认帖时间，ISO 8601 UTC |
| `precision` | `estimated` 或 `confirmed` |
| `originalTimezone` | 原帖时区或相对时间说明 |
| `originalTimeText` | 原始时间措辞 |
| `announcement` | 原文、翻译、URL、发帖时间 |
| `outcome` | 后续结果状态 |
| `note` | 计算方式、适用范围、是否有确认帖 |
| `recordedAt` | 加入本站档案的时间 |

允许的 `outcome`：

- `unverified`：没有找到独立的落地确认。
- `as_announced`：没有发现后续修正，或原帖本身就是完成确认。
- `revised`：时间后来被修改。
- `cancelled`：预告后来被取消。

每条历史记录还必须在 `src/i18n.ts` 的 `historyCopy` 下，使用相同 `id` 添加英文、简体中文、繁体中文的 `context` 与 `note`。

## 6. 新预告的标准更新流程

### 第一步：核对来源

保存以下事实：

1. X 原帖完整 URL。
2. 原文原句，不自行改写引文。
3. X 的准确发帖时间。
4. 原帖给出的时区、相对日期和适用范围。
5. 是否存在作者的后续纠正或回复。

不要只根据网友转述更新。网友讨论可以作为发现线索，但正式记录应尽量指向公开原帖。

#### 证据分层与页面措辞

每次更新前先把信息分成三层：

1. **公开可验证事实**：原帖文字、URL、发帖时间、明确说明的套餐范围。
2. **实际观察**：站长或用户账号界面出现了新重置、5 小时窗口等现象。这能证明该账号发生了变化，但不能单独证明全量账号同步完成。
3. **编辑判断**：观察现象与原帖宣布的变更相吻合、可能正在分批落地等推断。

页面应使用与证据范围相匹配的措辞：

- 只有一个账号证据时，写“一个账号已观察到”或“站长账号已观察到”。
- 有多个实际观察但没有全量确认时，写“部分用户的 Plus 账号已观察到”。
- 没有官方全量确认时，不写“所有 Plus 账号已经重置”或确定的全量完成时间。
- “部分用户”不等于“全量用户”；“已经开始落地”不等于“已经全部落地”。
- 用户提供的账号截图属于实际观察证据，应在编辑说明中保持范围限定，不冒充 Tibo 的公开原话。

2026-08-25 的 Plus 5 小时限制更新是标准范例：Tibo 的公开原帖确认将恢复规则，但没有给出统一落地时刻；随后部分用户账号观察到新重置和 5 小时窗口。因此当前事件使用 `kind: "rollout_observed"`、`status: "confirmed"`、`resetAt: null`，标题使用“已开始落地”，而不是伪造倒计时或宣称全量完成。

2026-08-28 的完成确认是另一种范例：Tibo 使用完成式措辞，并明确覆盖所有 ChatGPT Work 与 Codex 用户。此时使用 `kind: "reset_confirmed"`、`status: "confirmed"`、`resetAt: null`；首页 H1 以较小的时间行写“2026 年 8 月 28 日 00:35 确认”，主体写“新一轮 Codex 重置已落地”。X 发帖时间只能称为公开确认时间，除非原帖另行说明，否则不能写成后台重置精确完成时间。

### 第二步：判断时间

统一把内部时间保存成 UTC ISO 8601，例如：

```json
"resetAt": "2026-08-23T22:00:00.000Z"
```

换算规则：

- 先以原帖发帖时间确定 `today`、`tomorrow` 对应的日期，不能直接使用北京时间日期。
- 区分 PST（UTC−8）与 PDT（UTC−7）。
- 如果作者在夏令时期间仍写 PST，应保留“按原文 PST 字面换算”的主结果，并在说明中指出“若作者泛指太平洋时间，可能早一小时”。
- `around`、`or so`、`next hour` 只能标记为 `estimated`，不要伪装成精确承诺。
- 对“未来一小时左右”这类相对表达，可以用发帖时间加一小时作为档案目标点，但必须在备注中说明这是记录锚点而非精确落地时间。
- 已完成式消息（如 `has landed`、`have reset`）通常使用确认帖发布时间作为 `targetAt`。

本项目首次真实预告曾出现以下歧义，后续可作为范例：

- 原文：`Reset will land around 14pm PST tomorrow. (Meant 2pm obviously.)`
- `14pm` 被作者纠正为 `2pm`。
- 按 PST 字面换算为 UTC 22:00、北京时间次日 06:00。
- 但美国西海岸 8 月实际使用 PDT；若 PST 只是泛称，则可能对应北京时间 05:00。
- 因为原文使用 `around`，页面应写“左右”，状态为 `estimated`。

### 第三步：更新当前 JSON

编辑 `public/data/current.json`：

1. 先判断并更新 `kind` 与 `status`。
2. 有可信目标时间时写入 UTC `resetAt`；规则落地观察或完成确认没有独立执行时间时写 `null`。
3. 保留 `originalTimeText` 和 `sourceTimezone`。
4. 填写 `announcement` 原文、翻译、URL、`postedAt`。
5. 将 `updatedAt` 改为当前人工更新时间。
6. 在 `note` 中写清所有歧义或纠正。

### 第四步：更新三语言说明

编辑 `src/i18n.ts` 的 `currentCopy`：

- `scope`：适用范围。
- `context`：换算过程与结论。
- `note`：纠正、模糊程度与风险说明。

三种语言都要更新。英文使用 UTC；简体中文显示北京时间；繁体中文显示台北时间。

如果 `kind` 为 `rollout_observed`，还要同步核对三语言的：

- 首页 H1：保持短句，例如“Plus 5 小时限制已开始落地”。
- 观察提示：根据证据使用“一个账号”或“部分用户”，不要擅自扩大或缩小范围。
- 上下文与警示：明确没有公开信息证明所有 Plus 账号同时完成变更。
- `scripts/postbuild-seo.mjs` 的 `rolloutHeadline`：必须与运行时 H1 含义一致。

如果 `kind` 为 `reset_confirmed`，还要同步核对三语言的完成态状态标签、短 H1、确认范围与确认依据，以及 `scripts/postbuild-seo.mjs` 的 `confirmedResetHeadline`。页面不得显示零值倒计时，也不得把发帖时间误写成后台统一执行时刻。

### 第五步：本地验证

```powershell
cd D:\CodeXFolder\WarpNav\codex-reset-time
pnpm build
```

构建会依次执行：

1. `scripts/validate-data.mjs`
2. `tsc -b`
3. `vite build`
4. `scripts/postbuild-seo.mjs`

构建失败时不要推送。先根据报错检查日期、状态值、重复 ID 或缺失字段。

### 第六步：本地预览

开发模式：

```powershell
pnpm dev
```

生产构建预览：

```powershell
pnpm preview
```

至少检查：

- `/en/`
- `/zh-CN/`
- `/zh-TW/`
- 三种语言的 `/history/`
- 桌面和手机宽度，至少覆盖 1440、1024、768、430、375 CSS px。
- 标题是否溢出、被裁切或出现难看的提前断行。
- 四个倒计时卡片的间距是否紧凑、冒号是否容易识别。
- 原帖链接、时间与翻译是否一致。

响应式文字检查不能只看“有没有横向滚动”。还要检查每一行实际使用的宽度：

- H1 在桌面端应尽量保持一行，但不能使用 `white-space: nowrap` 强制挤出容器。
- `.hero-panel h1` 的桌面 `text-wrap: balance` 只用于视觉均衡；在 `max-width: 720px` 下必须覆盖为 `text-wrap: wrap`，让手机端自然填满当前行再换行。
- 保留 `overflow-wrap: anywhere` 作为极端长文本的防溢出兜底，但它不能替代正常断行策略。
- 430px 宽度下，简体标题“Plus 5 小时限制已开始落地”应先尽量填满第一行，而不是在“限制”中间附近提前换行并留下大片右侧空白。
- 推文原文引用使用 `.evidence blockquote` 的 `clamp(15px, 1.45vw, 18px)` 和较宽松行高；不要恢复成抢占页面层级的大字号。
- 用户只指出某些元素字号有问题时，只调整这些元素，不要把 scope、提示卡片、正文等所有字号一起缩小。

若需要精确诊断换行，不能只凭截图猜测。应在浏览器中查看 `getComputedStyle(h1).textWrap`，并用字符 `Range.getBoundingClientRect()` 或等效方法检查每行文字的实际左右边界。

### 第七步：提交与部署

```powershell
git add public/data/current.json src/i18n.ts
git commit -m "Update Codex reset estimate"
git push origin main
```

推送 `main` 后 Cloudflare Pages 应自动构建。进入 Cloudflare 的“部署”页面，确认最新提交显示绿色成功状态。

## 7. 将当前预告归档为历史记录

当事件结束并且已有足够信息时：

1. 在 `history.json` 追加一条唯一记录。
2. 根据证据设置 `precision` 和 `outcome`。
3. 如果有后续修正或落地确认，优先记录后续事实并说明前后关系。
4. 在 `historyCopy` 中为相同 ID 添加三语言说明。
5. 如果已经没有下一条有效预告，将 `current.json` 改为：
   - `status: "monitoring"`
   - `resetAt: null`
   - `announcement: null`
6. 构建并检查历史页面排序、年份分组和结构化数据。

不要因为倒计时已经归零就直接使用 `as_announced`。只有没有后续反证或存在明确确认时，才选择相应结果。

如果结果依据是站长/用户账号的实际观察，而不是作者后续公开确认，可以归档为 `as_announced`，但 `note` 必须明确写“站长实际观察到”“未找到公开确认帖”等证据边界，页面不得把它改写成官方确认。2026-08-24 的记录 `reset-2026-08-24-around-2pm-pst` 即按此方式归档。

## 8. 多语言维护规则

多语言入口不是运行时自动翻译。新增或修改文案时需要同步维护：

- 六个 HTML 入口中的 title、description、OG 和 Twitter 文案（仅在通用页面定位改变时修改）。
- `src/i18n.ts` 中的通用 UI 文案。
- `currentCopy` 中的当前事件文案。
- `historyCopy` 中对应历史 ID 的事件文案。
- `scripts/postbuild-seo.mjs` 中静态快照使用的文案（如果页面的通用定位改变）。

语言与时区约定：

- 英文页面标题和主要时间使用 UTC，另外显示访问者的本地时间。
- 简体中文使用 `Asia/Shanghai`。
- 繁体中文使用 `Asia/Taipei`。
- 原始引用保持英文，不把翻译冒充成引文。

## 9. UI 与品牌规范

### 设计定位

网站是轻松娱乐小站，不是官方控制台。最终确认的方向是：

- 清新、可爱、友好。
- 暖白纸张背景与微小点阵纹理。
- 柔和的薄荷绿、天蓝、淡紫、蜜桃和奶油黄。
- 圆角卡片、轻微错位阴影、少量代码符号装饰。
- 保留 Codex/终端联想，但不使用 OpenAI 官方 Logo，也不制造官方感。
- 明确避免大面积墨绿色、深黑色、压抑的开发者仪表盘风格。

### 当前 CSS 色彩

| 变量 | 色值 | 用途 |
| --- | --- | --- |
| `--bg` | `#fbfaf4` | 页面暖白背景 |
| `--paper` | `#fffefb` | 卡片纸面 |
| `--ink` | `#29332d` | 主要文字 |
| `--muted` | `#66736b` | 次要文字 |
| `--mint` | `#d9f6df` | 薄荷绿卡片 |
| `--peach` | `#ffd9ca` | 蜜桃卡片 |
| `--lavender` | `#e8e3ff` | 淡紫卡片 |
| `--lemon` | `#fff2b8` | 奶油黄提示 |
| `--blue` | `#dceeff` | 天蓝卡片 |
| `--focus` | `#5e4bc5` | 键盘焦点 |

字体使用圆润系统字体栈，避免依赖外部 Google Fonts：

```css
ui-rounded, "SF Pro Rounded", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif
```

### 已解决的布局问题，后续不要回退

- 顶部当前页导航统一使用“最新动态 / 最新動態 / Latest update”；历史记录为空时显示的返回链接使用对应的“返回最新动态 / Back to latest update”。正常历史页通过顶部“最新动态”返回首页。不要恢复为只适用于倒计时事件的“下次重置 / Next reset”。
- 首页主卡片上下区域宽度统一，不在倒计时区域右侧保留大片无意义空白。
- 英文桌面标题尽量单行显示；手机端允许自然换行。
- 中文标题字号应适配常见笔记本屏幕，避免难看的两行挤压。
- 四个倒计时数字卡片应聚拢并保持明显的时间序列感，不能用 `space-between` 拉满整行。
- 页脚右侧为“WarpNav 主站”链接，不显示没有实际用途的重复域名文字。
- 顶部使用正式 CRW Logo，移动端切换为紧凑品牌标志。
- 必须保留键盘焦点、跳到主要内容链接和 `prefers-reduced-motion` 支持。

### 品牌资源

- 横向 Logo：`public/logo.svg`
- 品牌标志：`public/brand-mark.svg`
- Favicon：`public/favicon.svg`、`favicon-16.png`、`favicon-32.png`
- 设备图标：`apple-touch-icon.png`、`icon-192.png`、`icon-512.png`
- OG 分享图：`public/og.png`，尺寸 1200×630

CRW 标志由紫色循环/重置箭头与粉红色终端提示符组合而成。后续可以微调配色和排版，但不要改成严肃官方徽标。

## 10. 广告、统计与第三方脚本

### Google AdSense

当前 AdSense 发布商 ID：`ca-pub-5258139514741111`。

加载脚本存在于六个语言 HTML 入口的 `<head>` 中，每个入口只允许出现一次：

- `en/index.html`、`en/history/index.html`
- `zh-CN/index.html`、`zh-CN/history/index.html`
- `zh-TW/index.html`、`zh-TW/history/index.html`

虽然最初需求用“加在页脚 footer”描述，但该代码是全站异步加载器，不是可视页脚内容。当前实现放在各入口 `<head>`，不要再在 React `<footer>`、组件副作用或构建后脚本中重复注入，否则 SPA 重渲染或多入口构建可能造成重复加载。

项目根目录的 `ads.txt` 是站长已经填写好的权威文件。不要自动改写其发布商信息。`scripts/postbuild-seo.mjs` 在每次构建结束时执行：

```js
copyFileSync(join(ROOT, 'ads.txt'), join(DIST, 'ads.txt'));
```

因此验收时必须同时确认：

- 根目录 `ads.txt` 仍存在且内容未被意外修改。
- `pnpm build` 后生成 `dist/ads.txt`。
- 线上能直接访问 `https://crw.warpnav.com/ads.txt`，返回纯文本而不是 SPA 页面或 404。

Chrome 控制台的 `Ad was removed because its network usage exceeded the limit` 属于浏览器对广告内容的干预提示。**不能仅凭这条提示断定 AdSense 加载代码、本站 React 代码或 `ads.txt` 配置错误。** 排查时依次确认加载脚本没有重复、提示来源是否为 Google 广告 iframe/`doubleclick`、广告请求是否发出、`ads.txt` 是否公开可访问，再判断是否需要处理。不要通过反复注入脚本来“修复”，这反而可能制造重复请求。

### Matomo

当前 Matomo 配置：

- 服务地址：`//mto.zmoyun.com/`
- Site ID：`13`
- 跟踪方式：标准 JavaScript 跟踪代码

本项目是 React + Vite 静态站，不使用 WordPress、Vue 插件或 Google Tag Manager，因此直接 JavaScript 代码是当前最简单、依赖最少的方案。代码同样放在六个 HTML 入口的 `<head>` 中，每个入口只出现一次。`trackPageView` 与 `enableLinkTracking` 的调用顺序保持现状；修改域名或 Site ID 时必须同步六个入口。

后续如果站点改为真正的客户端路由（不再依靠独立 HTML URL），需要重新评估是否在路由切换时手动发送 Matomo 页面浏览。目前六个 URL 均为独立页面入口，不要提前加入重复的 React 路由跟踪。

### 第三方脚本验收

构建后检查源文件与 `dist`，不要只看某一个入口：

```powershell
rg -n "ca-pub-5258139514741111|mto\.zmoyun\.com" en zh-CN zh-TW
Test-Path dist\ads.txt
```

预期：AdSense 与 Matomo 分别出现在六个入口中；`dist/ads.txt` 为 `True`。第三方脚本必须保持异步加载，避免阻塞首屏。

## 11. SEO / GEO 与机器可读内容

### 每个语言页面已有的基础配置

- 独立 `<title>` 与 meta description。
- `canonical`。
- `hreflang`：`en`、`zh-CN`、`zh-TW`、`x-default`。
- `robots`：允许索引与大图预览。
- Open Graph 标题、描述、URL、locale、图片、尺寸和替代文字。
- Twitter/X `summary_large_image` 卡片。
- favicon、Apple Touch Icon、Web App Manifest。

### 构建后自动生成

`scripts/postbuild-seo.mjs` 会根据当前 JSON 数据生成：

- 六个语言页面的无 JavaScript 静态正文快照。
- 当前页 `WebSite` + `WebPage` JSON-LD。
- 历史页 `CollectionPage` + `Dataset` JSON-LD。
- `sitemap.xml`，包含六个 URL 和多语言 alternate。
- `robots.txt`。
- 实验性的 `llms.txt`。
- `window.__CRW_BOOTSTRAP__` 首屏数据，避免加载时先出现空白状态。

线上应能访问：

- <https://crw.warpnav.com/robots.txt>
- <https://crw.warpnav.com/sitemap.xml>
- <https://crw.warpnav.com/llms.txt>
- <https://crw.warpnav.com/data/current.json>
- <https://crw.warpnav.com/data/history.json>

`llms.txt` 只是额外的机器可读说明，不代表任何 AI 搜索或回答平台一定收录或引用本站。

### SEO 更新注意事项

- 修改当前事件时，JSON-LD、静态快照和 `lastmod` 会在构建后自动更新。
- 修改通用页面定位、站名或摘要时，还要同步修改六个 HTML 文件和 `postbuild-seo.mjs`。
- 不要为了 SEO 堆砌 `Codex reset` 关键词。
- 历史数据必须有原始 URL，避免生成没有证据的结构化数据。
- 不要把“倒计时归零”描述成已确认发生。

### 静态快照与运行时文案的校验边界

生产 HTML 同时包含 SEO 静态快照、首屏 bootstrap 数据和哈希化 JavaScript 资源。不要用错误的检查目标误判部署失败：

- H1、原始引文等静态快照内容应能在 `/zh-CN/` 等原始 HTML 中找到。
- `src/i18n.ts` 的部分提示文案属于运行时 JavaScript，通常位于 `/assets/main-*.js`，不保证以可读形式出现在原始 HTML。
- 当前事实数据应直接检查 `/data/current.json`；历史事实检查 `/data/history.json`。
- CSS 规则应检查页面实际引用的 `/assets/main-*.css`，不要假设旧哈希文件仍在使用。
- 验证一次权威信号即可：部署 SHA、当前 HTML 引用的新资源哈希和目标数据文件彼此一致时，不要因原始 HTML 缺少某段运行时提示而无限轮询。

## 12. X / 社交分享卡片

页面当前配置：

```html
<meta property="og:image" content="https://crw.warpnav.com/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://crw.warpnav.com/og.png">
```

如果 X 发帖预览有标题和描述，但图片区域空白：

1. 先直接访问 `/og.png`，确认图片可打开。
2. 检查线上页面 `<head>` 的 OG/Twitter 标签。
3. X 很可能缓存了图片上线前的旧卡片。
4. 删除草稿里的旧链接和预览卡，再粘贴带临时参数的 URL，例如：

```text
https://crw.warpnav.com/en/?v=20260824
```

查询参数用于绕过 X 卡片缓存；canonical 仍指向正式页面。

## 13. Cloudflare Pages 配置与故障处理

### 正确配置

- Git 仓库：`Sunzenki/codex-reset-watch`
- 生产分支：`main`
- 自动部署：启用
- 构建命令：`npm run build`
- 构建输出：`dist`
- 根目录：留空
- 构建监视路径：全部（`*`）

### GitHub 连接断开

曾出现的实际故障：Cloudflare 顶部显示“此项目已与您的 Git 账户断开连接”，导致生产环境停留在旧提交。

处理流程：

1. Cloudflare 项目 → 设置 → 构建。
2. 在 Git 存储库一行点击“管理”。
3. 进入 GitHub 的 `Cloudflare Workers and Pages` 应用设置。
4. 选择 `Only select repositories`。
5. 确认 `Sunzenki/codex-reset-watch` 在授权列表内并保存。
6. 回到 Cloudflare 刷新，确认黄色断开警告消失。
7. 如果仍未恢复，按 Cloudflare 官方建议卸载并重新安装该 GitHub App。

恢复连接后，Cloudflare 不一定会自动补构建断开期间遗漏的提交。可以创建一个不改代码的空提交触发：

```powershell
git commit --allow-empty -m "Trigger Cloudflare Pages deployment"
git push origin main
```

2026-08-24 使用提交 `3cc1327` 成功触发重新部署；该提交没有修改代码。

### Windows GitHub 凭据说明

本机沙箱内执行 `git push` 有时会出现 `SEC_E_NO_CREDENTIALS`，这是沙箱无法访问 Windows Credential Manager，不代表用户未登录 GitHub。此时应使用已授权的系统环境执行推送，不要立即要求用户重复登录，也不要把 GitHub Token 写入项目。

Windows 的 `curl`/Schannel 偶尔也可能出现 `AcquireCredentialsHandle failed`、TLS handshake failed 等本机错误。这只说明当前校验客户端没有成功建立连接，**不能据此断定 Cloudflare 部署失败或线上站点不可用**。应改用浏览器、Cloudflare 部署记录或另一个只读 HTTPS 客户端验证；如果用户要求暂时不要检查 Cloudflare，就停止线上轮询。

## 14. 缓存策略

`public/_headers` 当前设置：

- `/assets/*`：一年强缓存并标记 immutable；Vite 文件名包含哈希。
- `/data/*`：`must-revalidate`，确保人工更新尽快生效。
- 三种语言页面：`must-revalidate`。

如果线上页面仍是旧版本：

1. 先确认 Cloudflare 部署对应的 commit SHA。
2. 再检查 `robots.txt`、`sitemap.xml` 或页面标题是否为新版本。
3. 使用带临时查询参数的 URL 排除浏览器/CDN 缓存。
4. 不要在没有确认部署 SHA 前把问题归因于 DNS 或浏览器缓存。

## 15. 上线后验收清单

每次内容或功能更新后至少检查：

- [ ] Cloudflare 最新生产部署为本次 commit，状态绿色。
- [ ] `/` 301 到 `/en/`。
- [ ] 六个正式页面均能打开。
- [ ] 三种语言切换后仍停留在当前页类型。
- [ ] 英文时间为 UTC，中文时间为 UTC+8。
- [ ] 倒计时与 `resetAt` 一致。
- [ ] 原帖 URL、引文、发帖时间正确。
- [ ] `current.json` 和 `history.json` 可直接访问。
- [ ] `robots.txt`、`sitemap.xml`、`llms.txt` 返回正常内容而非 SPA 404。
- [ ] 页面包含 canonical、hreflang、OG、Twitter 和 JSON-LD。
- [ ] `og.png` 可访问且为 1200×630。
- [ ] 桌面端标题和倒计时排列协调。
- [ ] 375px 左右手机宽度无横向滚动。
- [ ] 430px 与 375px 下 H1 使用自然换行，没有因 `text-wrap: balance` 提前断行或留下异常大片空白。
- [ ] 推文引用字号没有恢复为过大的旧值。
- [ ] 页面关于落地范围使用“一个账号”“部分用户”或“全量”时，与现有证据严格匹配。
- [ ] 历史记录 ID 与三语言 `historyCopy` 对应。
- [ ] 页面仍明确标注非官方、人工整理。
- [ ] 六个 HTML 入口各自只加载一次 AdSense 和一次 Matomo。
- [ ] `/ads.txt` 可公开访问且内容与项目根目录文件一致。

## 16. 推广素材与文案

### X 推荐文案

```text
Built a tiny unofficial site for Codex users: Codex Reset Watch ⏳

• Estimated next rate-limit reset
• Local-time countdown
• Past reset announcements
• English / 简中 / 繁中

Human-curated, just for fun.
https://crw.warpnav.com/

#Codex #OpenAI #AITools
```

标签不要堆得过多。X 优先使用 `#Codex #OpenAI #AITools`。

### 公众号“小绿书”素材

目录：`social/wechat-xiaolvshu/`

- `01-cover.png`：封面，“Codex 重置时间观察站”。
- `02-countdown.png`：倒计时、预计时间、本地倒计时与时区换算。
- `03-source-history.png`：原始消息、历史记录与多语言。

三张图片均为 1086×1448，严格 3:4。视觉与网站统一。第三张只使用抽象“公开发言”示意卡，不包含虚构账号、日期或事件。

公众号推荐标签：

```text
#Codex #OpenAI #AI工具 #程序员日常 #独立开发 #效率工具 #网站分享 #AI编程
```

## 17. 当前已确认的事实与暂时信息

### 已确认

- GitHub 仓库是公开仓库。
- Cloudflare Pages 与 GitHub 自动部署已恢复。
- GitHub `main` 是 Cloudflare Pages 的生产部署来源；具体最新提交以 `git log -1` 和 Cloudflare 当前生产部署 SHA 为准，不在手册中长期硬编码。
- 2026-08-25 相关历史提交包括：`00aaa2d`（AdSense）、`45554d9`（Matomo）、`f43aeb2`（Plus 5 小时限制落地状态）、`e8c4949`（标题与引用排版）、`1f35ab4`（手机端换行修复）。
- Google AdSense 加载脚本已写入六个 HTML 入口；根目录 `ads.txt` 会在构建后复制到 `dist/ads.txt`。
- Matomo JavaScript 跟踪已写入六个 HTML 入口，Site ID 为 `13`。
- 当前页面支持没有统一目标时间的 `rollout_observed` 和 `reset_confirmed` 类型。
- 2026-08-28 的当前事件为已完成重置确认，范围是所有 ChatGPT Work 与 Codex 用户；首页将 X 发帖时间标为“确认时间”，上一轮 Plus 5 小时限制落地记录已归入历史。
- 网站支持英文、简体中文和繁体中文。
- OG 图片和 Twitter/X 卡片标签已经配置。

GitHub 推送成功只证明远端分支状态，不等于已经独立验证生产部署；每次上线仍应检查 Cloudflare 当前部署 SHA，并核对线上页面与数据文件。

### 会随时间变化，更新前必须重新核对

- 当前下一次重置时间。
- Tibo 的公开发言是否有新回复、修正或删除。
- 历史记录的后续结果。
- Cloudflare 与 GitHub 集成状态。
- X 对链接卡片的缓存状态。
- AdSense 审核、填充和浏览器 Heavy Ad Intervention 状态。
- Matomo 服务是否正常接收访问数据。

### 编辑判断，不应伪装成事实

- 对 PST/PDT 的解释。
- 对 `around`、`next hour` 等模糊表述选取的记录锚点。
- 某条消息是否足以标记为 `confirmed` 或 `as_announced`。

这些判断必须写入备注，让读者能够理解换算依据。

## 18. 后续 Codex 接手时的操作要求

新的维护任务开始时，先阅读本文件，再查看实际代码和最新 Git 状态。不要只依赖旧对话摘要。

执行更新时：

1. 先区分用户提供的事实、网页可验证事实和编辑推断。
2. 涉及新 X 帖子时，优先打开原帖核对文本、时间和回复。
3. 先更新数据、三语言说明与 SEO 静态快照文案，再运行完整构建。
4. 不要恢复早期墨绿色/深色 UI。
5. 不要建立 X 自动监控，除非用户以后明确改变产品范围。
6. 不要自动发布未经用户确认的推断时间。
7. 不要提交 `dist`、凭据、Cookie、Token 或本地环境文件。
8. UI 修改后先启动本地生产预览，让用户检查；用户明确同意后才能提交推送。
9. 推送后检查 Cloudflare 实际部署 SHA 和线上关键文件；用户明确要求暂不检查时，以 GitHub 推送成功为终点并记录尚未验证生产部署。
10. 如果工作区已有用户未提交修改，保留并避开无关内容。使用精确路径 `git add`，不要用 `git add .`。
11. 对响应式问题优先找具体 CSS 根因。不要为了强制单行而引入截断，也不要为了修一个字号问题全局缩小文字。
12. 不要把广告 iframe 的浏览器干预警告自动归因于本站代码；先完成加载次数、请求来源和 `ads.txt` 的分层检查。

## 19. 快速维护命令

```powershell
# 进入项目
cd D:\CodeXFolder\WarpNav\codex-reset-time

# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 完整校验与生产构建
pnpm build

# 查看生产构建
pnpm preview

# 提交更新
git add <本次修改的文件>
git commit -m "Update Codex reset information"
git push origin main
```

提交前先执行 `git diff --check -- <本次修改的文件>`，提交后执行 `git status --short --branch`，确认没有误纳入用户的其他修改。

完成推送通常不等于完成上线。除非用户明确要求暂不检查，最后一步应确认 Cloudflare 最新生产部署成功，并在线检查页面、数据文件、哈希化 CSS/JS、广告统计代码和 SEO 输出。
