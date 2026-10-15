# CRW 浏览器推送与管理后台操作规则

> 更新日期：2026-10-15
> 本文适用于订阅、管理后台、D1、Service Worker 和真实通知发送。开始任务前先读[主维护手册](../PROJECT-MAINTENANCE-GUIDE.md)。
> 任何真实推送都是外部消息发送，每一次都需要用户对该次发送的明确授权；代码部署、状态修复或只读查询都不构成发送授权。验证与发布阶段记入[变更记录](../CHANGELOG.md)，文档修订日期不是上线时间。

## 1. 架构与范围

```text
访客点击开启提醒
        ↓
浏览器 PushManager 生成 endpoint、p256dh、auth
        ↓
Pages Function 校验并写入 D1 subscriptions
        ↓
站长登录 /crwmaster/ 编辑三语言消息并确认发送
        ↓
Pages Function 使用 VAPID + Web Crypto 生成 aes128gcm 报文
        ↓
FCM / Mozilla Push Service
        ↓
Service Worker 显示系统通知
```

推送只用于站长人工确认后的低频通知：

- 网站内容更新或 Cloudflare 部署不会自动广播。
- 用户无需注册账号；订阅以浏览器生成的 Push Subscription 为单位。
- D1 只保存投递所需信息、订阅语言、状态和发送记录，不保存普通访客画像。
- 浏览器 Push Service 本身不按条向本站收费，Pages Functions 与 D1 仍受 Cloudflare 当时套餐限制；费用与限额必须实时核对。
- 全新 endpoint 登记前检查有效订阅数，达到 1000 时返回 503；已有 endpoint 走更新路径，具体限额行为以 `functions/api/push/subscribe.js` 为准。

## 2. 订阅识别与前台行为

- 服务端保存 `endpoint`、`p256dh`、`auth`、语言、状态和时间；`endpoint_hash` 是数据库主键。
- 退订令牌明文只保存在该浏览器的 `localStorage`，D1 只保存哈希。
- 同一用户在不同浏览器、配置文件或设备上会形成多条独立订阅，这是正常现象。
- `locale` 取订阅时页面语言：`en`、`zh-CN` 或 `zh-TW`；它不代表国籍或操作系统语言。
- 后台语言分布只统计 `active = 1` 的订阅。
- `public/push-sw.js` 负责页面关闭后的消息接收；点击通知时优先复用同源窗口并打开消息指定路径。
- 推送服务返回 201/202 只表示服务接受，不保证用户一定看到。系统勿扰、浏览器后台设置和厂商策略都可能影响最终展示。

### 2.1 前台状态与按钮

`src/push-state.ts` 的 `inspectPushState` 先判断浏览器 API，再读取当前 origin 的已有订阅；没有订阅且权限未被拒绝时，才请求公开配置。`src/main.tsx` 根据结果设置按钮：

| 状态 | 含义与按钮行为 |
| --- | --- |
| `unsupported` | 真正缺少 Service Worker、PushManager 或 Notification API；按钮禁用 |
| `on` | 当前浏览器存在订阅；直接显示关闭操作，不为读取状态请求配置 |
| `denied` | 没有订阅且通知权限为 `denied`；提示到浏览器网站权限中调整 |
| `off` | 没有订阅、未被拒绝且取得非空公钥；可以点击开启 |
| `unavailable` | 配置接口失败、不是预期 JSON 或公钥不是非空字符串；提供“重试连接”，不能误报浏览器不支持 |
| `error` | 订阅读取或设置操作失败；提供重试，重新检查当前订阅与配置 |
| `loading` / `busy` | 页面读取或操作进行中；暂时禁用按钮，避免并发操作 |

已有订阅优先于配置读取，配置服务不可用不能让已开启的浏览器退回“未开启”。`on` 是本地浏览器订阅状态，不是一次真实投递成功证明，也不能代替后台 D1 状态核验。重试只重新读取状态和必要配置，不主动请求通知权限或发送通知。

### 2.2 开启、关闭与 origin 边界

- 权限请求仅由用户点击开启触发。用户关闭权限弹窗得到 `default` 时回到可重试的 `off`，只有真正返回 `denied` 才提示权限被阻止。
- `withPushRegistration` 复用已有订阅或新建订阅，再向 `/api/push/subscribe` 登记。成功响应须含有效退订令牌，随后写入当前 origin 的 `localStorage`。
- 后端登记失败时，仅对本次新建的浏览器订阅尝试 `unsubscribe()` 回滚，不取消此前已经存在的订阅；仍向调用方报告原始登记错误，回滚错误不得覆盖它。
- 关闭提醒时，有本地退订凭证则先调用 `/api/push/unsubscribe`；非 2xx 必须报错，不假装取消成功。然后取消浏览器订阅、清理本地凭证，并重新检查状态、读取必要公钥，以支持再次开启。
- localhost、127.0.0.1、不同端口与正式 HTTPS 域名属于不同 origin，权限、Service Worker、订阅和本地存储分别隔离。不能由本地预览的状态推断正式站订阅状态。
- 普通 Vite 静态预览不提供 `/api/push/*`。配置路径可能返回 HTML，即使 HTTP 为 200 也不是有效推送配置；localhost、127.0.0.1、[::1] 在 unavailable 状态下显示禁用的“本地预览暂不可用”按钮及正式站管理链接，不能写“Chrome 不支持”。正式站 unavailable 和读取错误 error 仍提供重试；本地接口配置正常或已有订阅时保持正常状态，不按主机名一律禁用。完整本地接口环境见第 7 节。

允许的推送服务域名：

- `fcm.googleapis.com`：Chrome 与 Brave。
- `updates.push.services.mozilla.com`：Firefox。

域名白名单用于避免 Worker 成为任意 URL 请求器。Brave 即使站点通知权限已允许，也可能需要在 `brave://settings/privacy` 开启“使用 Google 服务进行推送消息”并完全重启浏览器。

## 3. 管理后台与安全边界

管理入口固定为 `/crwmaster/`，并使用 `noindex,nofollow,noarchive`。路径不出现在公开导航、sitemap 或普通页面中，但路径隐藏不是安全边界。

后台当前提供：

- 有效、停用和累计订阅总数。
- English、简体中文和繁體中文的有效订阅分布。
- 三语言标题、正文和点击路径编辑及通知预览。
- 最近事件的服务已接受、订阅失效、发送失败和待发送数量，以及按响应码汇总的原因。

认证与保护：

- 用户名和密码来自 Cloudflare Secrets。
- 登录会话为 4 小时 HMAC 签名 Cookie，使用 `HttpOnly`、`SameSite=Strict`，HTTPS 下使用 `Secure`。
- 写操作执行同源校验。
- 每个客户端哈希在 15 分钟内最多允许 5 次失败登录。
- 可选 CLI 发送使用 Bearer Token；普通后台使用签名会话。

生产配置保存在 Cloudflare Pages 的配置/Secrets 中；以下仅列配置名和用途。私钥、后台凭据、会话密钥与 Token 的实际值禁止写入 Git、普通文档或截图：

| Secret | 用途 |
| --- | --- |
| `VAPID_PUBLIC_KEY` | 前端创建订阅所用应用服务器公钥，经公开配置接口返回，不是私钥 |
| `VAPID_PRIVATE_KEY` | 服务端签名和加密推送 |
| `PUSH_ADMIN_USERNAME` | 后台账号 |
| `PUSH_ADMIN_PASSWORD` | 后台密码 |
| `PUSH_ADMIN_SESSION_SECRET` | 登录会话 HMAC 密钥 |
| `PUSH_ADMIN_TOKEN` | 可选 CLI 发送 Bearer Token |

`VAPID_SUBJECT` 是非敏感变量，保存在 `wrangler.jsonc`。不要随意轮换 VAPID 密钥；公钥变化可能使既有订阅必须重新订阅。

修改后台密码时，在 Cloudflare Pages 的变量和机密中更新 `PUSH_ADMIN_PASSWORD`，重新部署后退出旧会话并验证新密码。不要把密码传入命令行日志或提交记录。

## 4. API 与数据库

Functions 路由由 `public/_routes.json` 限定为 `/api/push/*` 和 `/api/admin/*`。

| 接口 | 作用 |
| --- | --- |
| `GET /api/push/config` | 返回公开 VAPID 配置 |
| `POST /api/push/subscribe` | 校验并保存/更新订阅，成功返回 201 与退订令牌 |
| `POST /api/push/unsubscribe` | 使用 endpoint 与退订令牌停用匹配订阅；返回 `ok` 表示是否更新了记录 |
| `POST /api/push/send` | 创建事件并逐次处理 pending 投递；需要后台会话或可选 CLI Token，返回 `done` 和投递汇总 |
| `POST /api/admin/login` | 校验账号密码并建立会话 |
| `POST /api/admin/logout` | 注销会话 |
| `GET /api/admin/session` | 检查会话 |
| `GET /api/admin/overview` | 返回订阅统计、最近事件及相同口径的投递汇总/原因 |

D1 数据库名为 `crw-push`，绑定名为 `PUSH_DB`。新环境按顺序执行：

1. `migrations/0001_push.sql`
2. `migrations/0002_admin.sql`

| 表 | 作用 |
| --- | --- |
| `subscriptions` | 订阅、语言、退订凭证哈希与 active 状态 |
| `push_events` | 事件 ID、完整三语言消息快照与创建时间 |
| `push_deliveries` | 每个事件与订阅的 pending/sending/delivered/failed 状态 |
| `admin_login_attempts` | 登录失败窗口和次数 |

`push_deliveries.status` 的存储枚举仍为 `pending`、`sending`、`delivered`、`failed`，没有新增 `expired` 状态。`functions/_lib/delivery-summary.js` 按保存的 `response_status` 将 failed 中的 404/410 汇总为展示字段 `expired`，其他 failed 才计入“发送失败”；pending 与 sending 一起计入待发送。`/api/push/send` 和 `/api/admin/overview` 共用该汇总规则，原因项包含 `category`、`code`、`count`、`message`。历史记录不必为了改变展示而迁移状态。

不得打印、复制到普通文档或长期落盘的敏感订阅字段包括 endpoint、`p256dh`、`auth`、退订明文令牌和任何生产密钥。

## 5. 日常人工发送流程

发送前提：网站内容已经更新，构建通过，生产部署已确认 Active，且用户明确授权本次真实发送。

1. 登录 `/crwmaster/`，刷新订阅统计与语言分布。
2. 使用新的事件 ID，推荐 `YYYY-MM-DD-short-label`。
3. 分别检查 English、简体中文和繁體中文的标题、正文与点击路径。
4. 检查消息与已经上线的页面事实一致。
5. 确认有效订阅数量和预览后，只点击一次“确认并发送”。
6. 核对服务已接受、订阅失效、发送失败、待发送及原因；待发送包含 sending，不能仅凭某次 `done` 值认定所有状态已稳定。
7. 至少抽查一个真实浏览器的通知展示和点击路径。

语言标签只是编辑和预览切换器，不是单语言发送选择器。一次发送会提交三个版本，服务端按照每条订阅保存的 `locale` 选择消息。

事件 ID 是幂等键：第一次提交会保存完整三语言快照并建立投递任务；重复使用同一 ID 不会创建新事件，也不会重发已经完成或失败的投递。修正文案后需要新消息时必须使用新 ID。

`public/data/push-message.json` 是后台默认三语言草稿。更新它不等于发送通知。

## 6. 失败判断与安全重试

| 状态 | 含义 |
| --- | --- |
| `201/202` | 推送服务已接受，记录为 delivered |
| `404/410` | 订阅失效，投递失败并将订阅设为 inactive |
| `401/403` | 推送服务拒绝认证或授权，检查 VAPID 配置 |
| `413` | 通知报文过大 |
| `429` | 推送服务限流，先核验再决定重试 |
| `598` | Worker 内部 `TypeError` 诊断码 |
| `599` | 其他 Worker 内部异常诊断码 |

后台发送结果与最近记录按已保存的响应码区分“服务已接受”“订阅失效”“发送失败”“待发送”。404/410 单列为订阅失效，无需重试，后续新事件跳过已停用订阅。598/599 标为内部诊断码，不冒充 HTTP 响应；其他 5xx 提示服务端错误，空值/0 表示没有可用响应码。原因按错误码汇总显示，未保存的具体异常阶段需查 Worker 日志，不推测是哪个用户清理了浏览器或取消了权限。

遇到发送失败时：

1. 先读取具体阶段和状态。
2. 确认客户端是否其实已经收到，避免重复通知。
3. 核对准确事件 ID 和目标投递。
4. 排除 404/410 等失效订阅；只有确认未收到且确需重试时，才把准确事件中指定目标的其他 failed 投递恢复为 pending。
5. 恢复状态不会自动发送；再次执行真实发送仍需用户明确授权。

精确恢复示例：

```sql
UPDATE push_deliveries
SET status = 'pending', response_status = NULL, updated_at = '<当前 ISO 时间>'
WHERE event_id = '<准确事件 ID>'
  AND endpoint_hash = '<准确目标的 endpoint_hash>'
  AND status = 'failed'
  AND (response_status IS NULL OR response_status NOT IN (404, 410));
```

禁止无条件批量 `UPDATE`，也不要通过反复点击来猜测是否重试成功。

## 7. 实现约束与回归验证

Cloudflare Workers 推送实现使用 `@block65/webcrypto-web-push` 与标准 Web Crypto 生成 RFC 8291 `aes128gcm` 报文和 VAPID 认证。不要恢复依赖 Node `crypto.createECDH` 的旧 `web-push` 实现。

发送请求、推送服务 HTTP 状态和响应流清理必须保持边界分离；响应正文流清理失败不能覆盖服务已经返回的真实状态。`content-length` 由 Workers 根据 TypedArray 处理。

检查按本次修改范围选择，跨范围时合并执行；不能用本地测试通过代替生产部署或真实通知验收：

| 修改范围 | 必要检查 |
| --- | --- |
| 前台提醒状态、按钮、配置读取、订阅登记或回滚 | `pnpm build`、`pnpm test:push-state`，以及受影响状态的本地浏览器检查 |
| 消息草稿、路径校验、加密报文、发送或投递结果汇总 | `pnpm build`、`pnpm test:push`；涉及 Functions 时另做 Functions 编译 |
| Functions、认证、D1 或 Service Worker 相关实现 | `pnpm build`、`pnpm exec wrangler pages functions build`，并补受影响的状态/协议专项检查；Service Worker 前端行为需浏览器检查 |
| 纯文档 | 核对链接、命令、字段与实际实现；不运行真实发送，也不因文档变化部署 |

完整推送实现的组合验证命令：

```powershell
pnpm build
pnpm test:push-state
pnpm test:push
pnpm exec wrangler pages functions build
```

`pnpm test:push-state` 使用 Node 内置测试运行 `scripts/test-push-state.mjs`，直接检查 `inspectPushState` 与 `withPushRegistration`：已有订阅优先、权限/能力/配置错误分类、可用公钥，以及新订阅登记失败的回滚边界。它不请求真实权限、不修改真实订阅、不发送通知。测试数量以当次输出为准，不把某次通过数量当作固定规范。

该脚本通过 `package.json` 使用 TypeScript 类型擦除和 `--test-isolation=none`，避免受限环境测试子进程的 `spawn EPERM`。优先使用项目命令，不另建一份命令定义。

`pnpm test:push` 使用模拟接收方和临时 VAPID 密钥，离线检查路径校验、草稿、加密报文、请求头及投递汇总分类，不访问真实 endpoint，也不发送通知。Functions 编译检查运行时打包兼容；它不证明 D1 绑定、生产 Secrets 或真实投递成功。

完整本地 Functions 环境：

```powershell
pnpm build
pnpm exec wrangler pages dev dist
```

本地测试所需 Secret 只能放在安全的运行环境或已被 Git 忽略的本地配置中；项目忽略 `.env*` 和 `.dev.vars*`，不得提交其实际值。真实浏览器的权限弹窗、正式站开启/关闭和实际通知发送不是离线测试的一部分，涉及实际修改时按用户授权执行。详细构建和部署流程见[部署专题](./deployment-troubleshooting.md)。

## 8. 推送任务验收清单

- [ ] 没有在输出、文档、截图或提交中暴露 Secret 或订阅密钥。
- [ ] API 仍受同源、会话或明确的 CLI Token 保护。
- [ ] 三语言消息和点击路径均已检查。
- [ ] 新事件使用新的事件 ID。
- [ ] 按改动范围执行状态测试、离线协议/汇总测试、Functions 编译和浏览器检查，并记录各自结果与未覆盖项。
- [ ] 生产部署已确认后才进入真实发送步骤。
- [ ] 本次真实发送已有明确授权。
- [ ] 若已获授权实际发送，服务已接受、订阅失效、发送失败、待发送已核对，并抽查通知展示及点击路径。
- [ ] [变更记录](../CHANGELOG.md) 明确本地、审核、提交和生产验证阶段；部署与通知发送分别记录，没有把测试通过写成已上线或已发送。
