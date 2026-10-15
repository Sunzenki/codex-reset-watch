# CRW 2026-09-08 至 2026-09-09 项目纪要与历史背景

> 本文从旧版 `PROJECT-MAINTENANCE-GUIDE.md` 迁移而来，仅供追溯决策和排障背景，不是当前操作指令。
> 当前规则以根目录主手册和 `docs/` 下三份专题文档为准；当前事件、依赖、部署状态和代码结构必须重新核验。
> 文档入口更新（2026-10-15）：[AGENTS.md](../../AGENTS.md)、[维护手册](../../PROJECT-MAINTENANCE-GUIDE.md)、[设计规范](../../DESIGN.md)、[变更日志](../../CHANGELOG.md)。以下保留历史语境，不作为现行操作步骤。

## 1. 2026-09-08 内容更新

- 核对并整理 Tibo 关于 Astra 每日 `banked reset` 的帖子；明确它是到账后可由用户选择点击的一次储备重置机会，不是系统按时强制重置。
- 修正手机端过长标题和范围文案，避免 H1 被裁切；删除首页范围说明中重复的非官方提示。
- 核对当天两条新帖子，并结合单个账号实际观察，把当时当前事件更新为直接额度重置已落地。
- 页面当时使用“已确认于 GMT+8 10:00 左右落地”和完整日期，范围为所有付费订阅，同时保留 PST/PDT 歧义和单账号证据边界。
- 归档 2026-09-04 Astra 储备重置记录；当时历史总数为 13 条。
- 曾为该消息编写简体中文和英文 X 推文建议，但站点没有自动发帖。

这些事件状态后来已经变化，不能作为当前页面事实。

## 2. 通知方案与费用决策

- Cloudflare Pages 继续托管网站，动态部分使用 Pages Functions 和 D1，不自建服务器。
- 采用免注册 Push Subscription：浏览器产生 endpoint 与密钥，D1 保存投递信息，VAPID 证明消息来自本站。
- 通知由站长手动触发，不跟随 GitHub 或 Cloudflare 部署自动发送。
- 方案以免费额度内的小流量娱乐站为目标，代码限制最多 1000 个有效订阅；未来费用与限额仍需查看当时官方说明。
- 曾形成中文实施计划 `浏览器重置提醒功能实施计划.md`；后续以实际代码和现行手册为准。

## 3. 前台与管理后台建设

当日前台增加了浏览器提醒板块、开启/关闭按钮和导航入口：

- 首页“动态通知”滚动到 `#push-reminder`。
- 历史页同一入口跳转到对应语言首页的该锚点。
- 页面滚动时导航置顶，采用半透明玻璃效果。
- 本地曾验证关闭测试标签页后仍能收到 Windows 通知，点击通知可重新打开目标页面。

管理后台确定使用 `/crwmaster/`，不使用 `/admin` 作为正式入口。实现包括：

- 账号密码登录与 4 小时 HttpOnly 会话。
- 同源校验和 15 分钟 5 次失败限制。
- 有效、停用、累计订阅统计与语言分布。
- 三语言消息编辑、预览和近期投递状态。
- 一次发送按订阅 locale 选择消息；语言标签不是单语言发送开关。
- 凭据和 VAPID 密钥只放在 Cloudflare Secrets。

## 4. Web Push 兼容故障经过

初版使用 `web-push@3.6.7`，Cloudflare Workers 生产环境出现：

```text
[unenv] crypto.createECDH is not implemented yet!
```

后来改用 `@block65/webcrypto-web-push@2.0.0` 和标准 Web Crypto，解决 Node `createECDH` 不兼容。

第二轮测试曾出现两条 598。排查发现旧代码可能在推送服务已经接受后，因为取消响应正文流失败而覆盖真实 HTTP 状态。之后将发送请求、HTTP 状态和流清理分离，并增加失败阶段诊断；`content-length` 交由 Workers 根据 TypedArray 处理。

失败投递曾通过精确 SQL 恢复为 pending，再在用户明确授权后执行真实重试。最终当日生产测试返回 delivered 2、failed 0、pending 0，Chrome 和 Firefox 都显示 Windows 通知。

Brave 当时订阅失败的原因不是站点通知权限，而是浏览器全局 Google Push 服务未开启。启用并重启后订阅成功。

Windows 命令行访问 Cloudflare API 还曾遇到 TLS handshake / `fetch failed`，最终改用浏览器中的 D1 控制台完成精确状态修复。该本机连接问题不能证明线上故障。

上述测试数字只是当日结果；当前实现约束已整理到 `../push-operations.md`。

## 5. 2026-09-08 生产提交

| 提交 | 内容 |
| --- | --- |
| `6a3cc8e` | 更新 9 月 8 日全局额度重置与 9 月 4 日储备重置归档 |
| `6158a4d` | 浏览器推送通知 MVP、D1、Service Worker 与三语言消息 |
| `2dd4b06` | 受保护管理后台、`/crwmaster/`、导航与前台交互完善 |
| `36e1d6a` | 使用 Web Crypto 修复 Cloudflare Workers 加密兼容性 |
| `7176819` | 加固推送传输、响应处理与故障诊断 |
| `e049f2e` | 后台增加有效订阅语言分布 |

提交号用于历史追溯，不代表当前生产 SHA。

## 6. 2026-09-09 手机端导航

- 手机端不再将完整导航与 Logo 挤在同一行，改为保留品牌标志并使用菜单按钮。
- 展开菜单延续置顶导航的半透明玻璃视觉。
- 选择菜单项、点击外部或按 Escape 后关闭。
- 历史页“动态通知”仍跳往同语言首页 `#push-reminder`。
- 用户完成本地预览后批准上线，对应提交为 `52c68ae`。

## 7. 2026-09-09 多语言 SEO 整理

- 六个公开页面按首页和历史页区分搜索意图。
- 英文首页当时改为 `Codex Reset Time, Countdown & Alerts | Codex Reset Watch`，历史页改为 `Codex Usage Reset History | Codex Reset Watch`。
- 简体与繁体首页覆盖额度重置时间、倒计时和通知；历史页覆盖历史记录、原帖和时区换算。
- 当时六条 description 字符数依次为 157、158、151、156、152、156。
- `<title>` 移到各入口 `<head>` 前部；这是源码组织优化，不是已证实的排名因素。
- 没有添加 `meta keywords`。
- 新增 `src/seo-metadata.json` 作为运行时标题、静态快照和 JSON-LD 的统一数据源。
- `scripts/validate-data.mjs` 增加标题/描述唯一性、字符数、SEO/OG/Twitter 一致性及标签顺序校验。
- 当时完整构建和线上逐页读取均通过，对应提交 `ad05df1`。
- 那次提交没有纳入用户已有的 `README.md`、`experiments/`、`social/` 或未跟踪实施计划。

标题和字符数必须以当前 `src/seo-metadata.json` 与构建校验为准，不能照抄本节历史值。

## 8. 旧版推广文案与素材记录

当时 X 推荐文案：

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

公众号“小绿书”素材位于 `social/wechat-xiaolvshu/`：

此目录及下列图片为历史记录引用的本地未纳管素材，重新克隆仓库不保证存在；本轮文档整理不将其加入提交。

- `01-cover.png`
- `02-countdown.png`
- `03-source-history.png`

三张图片为 1086×1448（3:4）。第三张只使用抽象公开发言示意卡，不包含虚构账号、日期或事件。旧推荐标签为：

```text
#Codex #OpenAI #AI工具 #程序员日常 #独立开发 #效率工具 #网站分享 #AI编程
```

这些文案只保存历史版本；再次使用前必须根据当前功能和事件重写并由用户确认，站点不会自动发布。

## 9. 旧 Cloudflare 连接事故

Cloudflare 曾显示项目与 Git 账户断开，导致生产停留在旧提交。恢复 GitHub App 仓库授权后，Cloudflare 没有自动补建断开期间的提交；当时使用空提交 `3cc1327` 触发成功部署。

该提交号只说明历史处理方式。当前故障应先核对 Cloudflare 项目、GitHub App 授权和最新部署记录，再决定是否需要新的明确操作。

## 10. 原手册之后已发生的仓库变化

旧手册最后整理于 2026-09-09，之后 Git 历史显示：

| 提交 | 日期 | 摘要 |
| --- | --- | --- |
| `9844729` | 2026-09-12 | 本地化来源时区并缩短重置引用 |
| `6525ac7` | 2026-09-12 | 更新 9 月 12 日 Astra 重置预估 |
| `e914e76` | 2026-09-12 | 确认 9 月 12 日 Astra 重置完成 |
| `16e343f` | 2026-09-12 | 从确认卡片移除过期事件日期 |
| `0c771a0` | 2026-09-13 | 新增重置日历和页面工具 |

这解释了为什么旧手册中的“当前事件”和目录树已经失效。现行主手册不再硬编码动态事件；历史日历相关文件已加入当前目录说明。
