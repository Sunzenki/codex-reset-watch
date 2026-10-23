# CRW 内容、数据与 SEO 维护规则

> 更新日期：2026-10-22
> 本文是内容事件、历史记录、多语言和 SEO 修改的操作规则。开始任务前先读[主维护手册](../PROJECT-MAINTENANCE-GUIDE.md)。
> 会变化的当前事件以 `public/data/current.json`、`public/data/history.json` 和实际代码为准，不以本文示例为准。修改摘要、验证和发布阶段记入[变更记录](../CHANGELOG.md)；文档更新不代表已经部署。

资讯列表与文章另按 [编辑与发布规则](guides-editorial-policy.md) 执行选题、文风、SEO 和更正，Markdown 操作见 [文章维护](guides.md)。文章涉及重置事实时仍同步本文定义的权威数据，不把文章替代事件记录。系列总目录日历与文章头部可明确使用 PT 系列日期；资讯列表统一显示本站实际发布日期，详见文章维护的日期规则，不改变首页/历史时间换算。资讯发布日期按英文 UTC、简中 Asia/Shanghai、繁中 Asia/Taipei 显示；详情及日历中的系列标签以“美西时间 / 美西時間 / Pacific Time”说明时区。三语正文、来源范围和内链同步维护，不能以译文日期覆盖事件日期。

## 1. 内容原则与证据分层

CRW 是非官方、人工整理的信息站。正式记录应尽量指向公开原帖，不根据网友转述直接更新，也不为了填满页面而补写无法验证的数据。

每次更新先区分三层信息：

1. **公开可验证事实**：原帖文字、URL、准确发帖时间、作者明确说明的范围和后续纠正。
2. **实际观察**：站长或用户账号界面出现额度重置、窗口变化等现象，只能证明对应账号发生了变化。
3. **编辑判断**：时区解释、记录锚点、事件状态和“可能正在分批落地”等推断。

页面措辞必须匹配证据范围：

- 单一账号证据写“已有单个账号观察到”，不能扩大成“所有用户已经完成”。
- 多个观察但没有全量确认时，可以写“部分用户已观察到”。
- “已经开始落地”不等于“已经全部落地”。
- 用户截图属于实际观察，不得冒充来源作者的公开原话。
- 倒计时归零只表示预告时间已到，不证明额度已经重置。
- 完成确认帖的发布时间是公开确认时间；除非原帖另有说明，不得写成后台精确完成时间。

## 2. 来源核验与时间换算

更新前记录：

1. X 原帖完整 URL。
2. 原文原句；引用不能自行改写。
3. X 的准确发帖时间。
4. 原文时区、相对日期、模糊程度和适用范围。
5. 作者是否有后续纠正、回复或删除。

时间统一以 UTC ISO 8601 写入 JSON，例如：

```json
"resetAt": "2026-08-23T22:00:00.000Z"
```

换算要求：

- 根据原帖发帖地和发帖时间判断 `today`、`tomorrow`，不能直接套用北京时间日期。
- 区分 PST（UTC−8）与 PDT（UTC−7）。作者在夏令时期间仍写 PST 时，保留按字面换算的主结果，并说明若其泛指太平洋时间可能相差一小时。
- `around`、`or so`、`next hour` 等只能标记为近似值，不能包装成精确承诺。
- 相对表达可选取合理的档案锚点，但必须在备注说明计算方式和非精确性质。
- 已完成式消息通常使用确认帖发布时间作为历史记录的 `targetAt`，并明确它不是后台执行时刻。

## 3. 当前事件数据模型

权威文件：`public/data/current.json`。

核心字段：

| 字段 | 说明 |
| --- | --- |
| `kind` | 事件形态 |
| `status` | 证据或进度状态 |
| `resetAt` | UTC 目标时间；没有可信统一时间时为 `null` |
| `sourceTimezone` | 原文时区或时间来源说明 |
| `deadlineEstimated` | 可选；为 `true` 时倒计时指向编辑换算的预计截止时间，须配合 `status: "estimated"`，并在备注说明换算假设；归零不确认完成 |
| `originalTimeText` | 原文中的时间措辞 |
| `scope` | 原帖明确适用范围 |
| `announcement` | 来源、原文、翻译、URL、发帖时间；无事件时可为 `null` |
| `updatedAt` | 本站人工更新时间，UTC ISO 8601 |
| `note` | 歧义、纠正、推断和证据边界 |

代码还可能使用 `previousAnnouncement`、`timingSource`、`dateConfirmed`、`confirmationBasis`、`observationBasis` 等补充字段。修改前先查看当前 JSON、`src/main.tsx` 和 `scripts/postbuild-seo.mjs`，不要仅按旧示例删掉现有字段。

允许的 `kind`：

| 值 | 使用场景 |
| --- | --- |
| `reset` | 普通重置预告；可以有明确或近似目标时间，也可以尚未给出时间 |
| `rollout_observed` | 规则变更已有实际账号观察到开始落地，但没有统一精确时刻 |
| `reset_confirmed` | 原帖明确确认重置已经发生，但没有另行给出执行时刻 |
| `banked_reset` | 到账后由用户自行选择使用的一次储备重置机会 |

允许的 `status`：

| 值 | 使用场景 |
| --- | --- |
| `monitoring` | 当前没有可信统一时间；可能没有预告，也可能已有未定时预告 |
| `estimated` | 原帖包含近似或相对表达 |
| `confirmed` | 原帖给出具体时间，或已经确认发生 |
| `reached` | 预告时间已经到达，但未确认发生 |
| `superseded` | 旧预告已被后续消息修正或替代 |

`kind` 描述事件形态，`status` 描述证据或进度，二者不能混用。`rollout_observed` 和 `reset_confirmed` 都可以使用 `status: "confirmed"` 与 `resetAt: null`；不要为了显示倒计时虚构时间。

站长实测重置落地时使用 `reset_confirmed` 与 `confirmationBasis: "owner_observed"`；首页日期栏显示本站实测记录时间 `updatedAt`，公开原帖时间单独保留。页面标题可简写“额度重置已落地”，实测依据在来源说明交代；历史采用 `timeBasis: "observation"`，不把未知执行时刻填成预告截止时间。

切换下一轮预告时保留上一轮历史。最近记录中，`eventType: "reset"`、`timeBasis: "observation"`、`outcome: "as_announced"` 的实测落地记录显示“已完成”，具体依据仍由详情说明。预计截止时间及实测落地的静态标题从本轮原帖读取 Day 日号，与运行时标题保持一致。

运行时 H1 由 `src/main.tsx` 的状态分支和 `src/i18n.ts` 的当前事件文案共同决定，无 JavaScript 静态快照由 `scripts/postbuild-seo.mjs` 生成。JSON 中的 `headline` 不能被视为唯一标题来源。

## 4. 历史记录数据模型

权威文件：`public/data/history.json`。每条记录需要：

| 字段 | 说明 |
| --- | --- |
| `id` | 全局唯一，建议 `reset-YYYY-MM-DD-short-label` |
| `targetAt` | 换算后的目标时间或确认帖时间，UTC ISO 8601 |
| `eventType` | 记录的事件形态：`reset`、`banked`、`announcement` 或 `rule_change` |
| `resetType` | 关联的重置类型：`reset`（全局重置）或 `banked`（储备重置） |
| `timeBasis` | `targetAt` 的时间依据：`confirmation`、`announcement`、`estimated`、`scheduled` 或 `observation` |
| `precision` | `estimated` 或 `confirmed` |
| `originalTimezone` | 原帖时区或相对时间说明 |
| `originalTimeText` | 原始时间措辞 |
| `announcement` | 原文、翻译、URL、发帖时间 |
| `outcome` | 后续结果 |
| `note` | 计算方法、适用范围和确认依据 |
| `recordedAt` | 加入本站档案的时间 |

三个分类字段的枚举由 `src/history-meta.ts` 定义，并由 `scripts/validate-data.mjs` 校验。不要再按日期或 ID 维护另一份日历分类名单。

| `eventType` | 含义 |
| --- | --- |
| `reset` | 全局额度重置记录；完成依据仍需看原帖、观察范围和 `outcome` |
| `banked` | 储备重置的发放或可用情况记录，不等于用户已经使用这次机会 |
| `announcement` | 预告记录；`resetType` 决定它预告的是哪种重置 |
| `rule_change` | 额度规则变更；保留在历史列表，不加入重置日历 |

| `timeBasis` | `targetAt` 所指时间 |
| --- | --- |
| `confirmation` | 完成确认帖发布时间，不默认等于执行时刻 |
| `announcement` | 原帖发布时间，不默认等于到账时刻 |
| `estimated` | 按原帖模糊措辞推算的近似时间 |
| `scheduled` | 原帖指定的预告时间，仍不证明实际按时完成 |
| `observation` | 账号或规则变化的观察记录时间 |

`precision` 只描述记录时间的精度；`confirmed` 不能把“确认帖发布时间明确”变成“后台执行时刻明确”。`eventType`、`resetType`、`timeBasis`、`precision` 和 `outcome` 各有用途，不能互相替代。

允许的 `outcome`：

- `unverified`：没有找到独立落地确认。
- `as_announced`：没有发现后续修正，或原帖本身就是完成确认。
- `revised`：时间后来被修改。
- `cancelled`：预告后来被取消。

每个历史 `id` 必须在 `src/i18n.ts` 的 `historyCopy` 中有英文、简体中文和繁体中文的 `context` 与 `note`。历史列表顶部保留时间精度和结果标签，不为简化视觉而改写来源或结果。

日历由 `src/ResetCalendar.tsx` 按 `resetType` 展示绿色“全局重置”和紫色“储备重置”的填色标记；颜色表示类型，不表示证据等级或完成状态。预告没有独立橙色图例，储备预告仍归紫色。日期按页面语言的时区和 `targetAt` 归档，同日多种类型可以共同填色。时间依据与完成情况在当天详情和历史记录中解释。更新后需检查列表、月份切换、日期归属、类型图例和详情锚点。

历史样式涉及 `src/calendar.css`、`src/journal.css`、`src/journal-history.css`；视觉规则见 [DESIGN.md](../DESIGN.md)。不能只改旧样式文件而漏掉最终覆盖层。

## 5. 新事件更新流程

### 5.1 建立事实底稿

按第 1、2 节核对原帖、后续消息、范围和时区。不能访问原帖或无法确认关键事实时，明确记录缺口，不自行补齐。

### 5.2 更新当前 JSON

1. 判断 `kind` 与 `status`。
2. 有可信目标时间时写 UTC `resetAt`；没有统一时间时写 `null`。
3. 保留 `originalTimeText` 和 `sourceTimezone`。
4. 填写 `announcement` 原文、翻译、URL 与 `postedAt`。
5. 更新 `updatedAt`。
6. 在 `note` 中写明歧义、纠正、观察范围和编辑判断。
7. 保留当前代码仍在使用的补充字段，除非此次任务明确替换它们。

### 5.3 更新三语言内容

在 `src/i18n.ts` 中同步检查：

- 通用 `ui` 文案。
- `currentCopy` 的 `headline`、`scope`、`context`、`note` 和需要时的 `sourceTranslation`。
- 原帖较长且包含无关内容时，可用 `sourceExcerpt` 展示与重置有关的连续原文；右栏自动标明节选，`sourceTranslation` 对应节选。JSON 的 `announcement.text` 和 `translation` 保留完整原文与译文，原帖链接保持可用。
- 新增历史记录对应的 `historyCopy`。
- `localizedSourceTimezone` 等与来源时间相关的本地化映射。

`src/journal-copy.ts` 保存手账布局的通用三语言标签，`src/history-meta.ts` 保存事件类型和时间依据标签；只有这些标签确实受影响时才修改。具体事件事实仍由 JSON 与 `currentCopy` / `historyCopy` 承担。

语言与时区：

- 英文页面主要时间使用 UTC，并可显示访问者本地时间。显示标签统一用 UTC / UTC+8，不混用 GMT；这里统一的是标记，不是把中文时间改成零时区。
- 简体中文使用 `Asia/Shanghai`。
- 繁体中文使用 `Asia/Taipei`。
- 原始引用保持英文，译文必须明确是翻译。
- 繁体页面的当前原帖译文应使用繁体 `sourceTranslation`，避免直接显示共享 JSON 中的简体译文；译文语言属性要与实际文字一致。
- 首页“原帖发布”保留该来源帖的固定 PST（UTC−8）换算格式（不据此推定作者所在地，JSON 原始时间仍为 UTC）；它与中文页面采用 UTC+8 的主要时间并列展示，不改成执行时间或预计截止时间。

如果事件属于 `rollout_observed` 或 `reset_confirmed`，还需核对 `scripts/postbuild-seo.mjs` 中对应标题语义与运行时 H1 一致。完成态不得显示零值倒计时。

### 5.4 更新 SEO（仅在受影响时）

`src/seo-metadata.json` 是原有六个首页/历史页面运行时标题和构建后结构化数据的统一 SEO 数据源。新增资讯列表与文章从 `src/guides-copy.json` 和 Markdown front matter 生成元数据，见 [资讯指南维护](guides.md)。通用页面定位、标题或摘要变化时，同步更新：

- `src/seo-metadata.json`。
- 六个语言 HTML 入口中的 title、description、Open Graph 和 Twitter 文案。

仅更新事件事实时，通常由构建脚本更新静态快照、JSON-LD 和 `lastmod`，不要无理由重写通用 SEO 文案。

项目校验要求：

- 六个页面标题唯一，20–65 个 Unicode 字符。
- description 唯一，150–160 个 Unicode 解码后字符，使用 JavaScript `[...text].length` 计数。
- title、description、OG、Twitter 与统一数据源一致。
- `<title>` 位于 description 之前。
- 不添加 `meta keywords`。
- 不堆砌关键词，不把倒计时归零写成确认发生。

搜索引擎可能改写或截断摘要；150–160 是本项目校验区间，不是排名保证。

## 6. 归档当前事件

当事件结束且信息足够时：

1. 向 `history.json` 添加唯一记录。
2. 根据事件与证据设置 `eventType`、`resetType`、`timeBasis`、`precision` 和 `outcome`。
3. 有修正或确认时，说明前后关系和依据。
4. 在 `historyCopy` 中补齐三语言说明。
5. 归档不自动清空首页。需要继续展示最近一次完成确认时，保留对应 `reset_confirmed` 事件；只有本次任务明确切回等待新消息时，才设置 `monitoring`、`resetAt: null`、`announcement: null` 并同步三语言文案。
6. 构建并检查排序、年份分组、日历和结构化数据。

不要仅因为倒计时归零就设置 `as_announced`。实际账号观察可以作为归档依据，但备注必须明确它不是公开确认。

## 7. 构建产物与校验边界

`scripts/postbuild-seo.mjs` 会生成：

- 六个公开页面的无 JavaScript 静态正文及页脚快照，友链以真实 `<a>` 元素写入原始 HTML。
- 当前页 `WebSite` + `WebPage` JSON-LD。
- 历史页 `CollectionPage` + `Dataset` JSON-LD。
- `sitemap.xml`、`robots.txt`、`llms.txt`。
- `window.__CRW_BOOTSTRAP__` 首屏数据。
- `dist/ads.txt`。

校验时使用正确的权威信号：

- H1、原始引文等静态内容检查页面 HTML。
- 运行时提示文案检查当前哈希化 JavaScript，而不是强求它出现在原始 HTML。
- 当前事实检查 `/data/current.json`，历史事实检查 `/data/history.json`。
- CSS 检查页面实际引用的哈希化 CSS。
- `llms.txt` 只是额外机器可读说明，不代表任何平台一定收录或引用。

## 8. 内容任务验收清单

- [ ] 原帖 URL、原文、发帖时间、范围和后续纠正已核对。
- [ ] 事实、观察和编辑判断已明确区分。
- [ ] 时区与相对日期换算有依据，模糊表达没有被精确化。
- [ ] `kind`、`status`、`resetAt` 和完成态展示一致。
- [ ] 三语言当前文案或历史文案完整对应。
- [ ] 历史 ID 唯一，三个分类字段符合枚举，日历日期、类型图例和详情可用。
- [ ] 受影响的 SEO、静态快照和结构化数据保持一致。
- [ ] `pnpm build` 通过；详细预览与上线步骤见 `deployment-troubleshooting.md`。

检查按修改范围执行：数据、文案、SEO 或相关代码改动运行构建并检查受影响页面；提醒和推送改动按[推送专题](./push-operations.md#7-实现约束与回归验证)选择专项检查。纯文档修订核对链接、字段和示例，不因修订文档运行真实推送或部署。任务结束时更新[变更记录](../CHANGELOG.md)，分别写清本地验证、用户审核、提交和生产验证状态。

## 9. 友情链接

页脚友链在 `src/friend-links.json` 维护，数组中每项使用 `name`（显示站名）和 `url`（完整 HTTPS 网址）；数组顺序即显示顺序，网址保持唯一。显示名以站长确认的写法为准，可使用明确指定的说明性名称；三语言栏目名、版权及主站标签统一在 `src/footer-copy.json` 维护，由运行时文案和静态构建共享。名单为空时不显示该栏目。

需要官方徽章的站点可配置 `badge`，包含 `src`、`alt`、`width` 和 `height`；静态 HTML 与 React 均使用该配置输出真实 `<a><img></a>`，其余站点输出文字链接。DeepLaunch 使用用户提供的 `https://deeplaunch.io/badge/badge_light.svg`、`Featured on DeepLaunch.io` 和 200×54 原始比例，以 CSS 缩至 120px 宽。保留官方资源地址与替代文本，不重绘或自造认可徽章。只检查图片可访问性和原始 HTML 不代表完成目录的提交、徽章验证或发布日期选择；这些外部表单操作需用户另行明确授权。

`scripts/postbuild-seo.mjs` 将完整静态页脚放在 `#root` 内的正文之后，保留 `href`、`target="_blank"` 和 `rel="noreferrer"`。React 启动时替换同一个根节点，不额外叠加页脚。检查友链必须解析构建后 HTML 或直接抓取线上原始 HTML，确认链接是页脚内的 `<a>`，不能只搜索 JavaScript 字符串或查看执行脚本后的 DOM。上线时用 `curl` 抓取首页能找到 `deeplaunch.io` 和 `twelve.tools`；这只验证回链可读取性，目录的徽章或审核要求另行处理。

只添加站长确认的站点，不把设计示例当作实际合作方；临时样例仅用于本地隔离预览，不进入正式名单。修改后运行 `pnpm build`、`pnpm docs:check` 和差异检查，检查六个公开路由的页脚、桌面与手机换行、键盘焦点及实际目标网址。视觉规则见 [DESIGN.md](../DESIGN.md#footer-friend-links)。
