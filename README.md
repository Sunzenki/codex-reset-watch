# Codex Reset Watch

`crw.warpnav.com` 的静态信息站：展示下一次经过人工核对的 Codex rate-limit reset 预告，并保存历史记录。项目不监控 X、不调用 X API，也不会自动修改公开数据。

网站提供 English、简体中文和繁體中文三套静态页面。访问 `/` 默认进入 `/en/`；语言页面分别位于 `/en/`、`/zh-CN/` 和 `/zh-TW/`，每种语言都有对应的 `/history/` 页面。

## 内容更新

### 当前预告

编辑 `public/data/current.json`：

- `status`：`monitoring`、`estimated`、`confirmed`、`reached` 或 `superseded`。
- `resetAt`：ISO 8601 时间，推荐保存为 UTC，例如 `2026-08-24T22:00:00Z`；没有有效预告时填 `null`。
- `sourceTimezone` / `originalTimeText`：保留原帖时区及时间原文。
- `announcement`：原文、原帖链接和发帖时间。
- `updatedAt`：本站人工更新时间。

页面标题不读取 JSON 中的固定中文标题，而是根据 `resetAt` 和状态自动生成：英文使用 UTC，简体中文使用 `Asia/Shanghai`，繁體中文使用 `Asia/Taipei`。事件相关的三语言说明维护在 `src/i18n.ts` 的 `currentCopy` 中。

倒计时归零后，前端只显示“预告时间已到”，不会自动声称重置已经发生。

### 历史记录

完成一次记录后，将事实信息追加到 `public/data/history.json`。每条记录包含唯一 `id`、目标时间 `targetAt`、精度、原始时区、原帖、结果和备注。然后在 `src/i18n.ts` 的 `historyCopy` 中使用同一个 `id` 添加三语言说明。

`outcome` 支持 `unverified`、`as_announced`、`revised`、`cancelled`。不要为填满历史页而补写无法验证的数据。

## 本地运行与构建

```bash
pnpm install
pnpm dev
pnpm build
```

`pnpm build` 会先校验两个 JSON 文件。Cloudflare Pages 构建命令为 `pnpm build`，输出目录为 `dist`。项目包含 `public/_redirects`，根地址默认进入英文版，旧 `/history` 地址会跳转到 `/en/history/`。
