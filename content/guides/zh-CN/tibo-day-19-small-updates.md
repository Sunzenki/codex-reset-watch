---
{
  "id": "tibo-day-19",
  "slug": "tibo-day-19-small-updates",
  "title": "Tibo's Day 19｜dot 通话更快，切换推理强度保留缓存，CLI 更新",
  "summary": "Day 19 改善了 dot 通话连接速度，Codex / Work 对话中切换推理强度不再使缓存失效。作者还补充了 CLI 更新，相关改动可与 0.164.0 正式说明核对。",
  "locale": "zh-CN",
  "category": "updates",
  "publishedAt": "2026-10-25T04:07:41.776Z",
  "status": "published",
  "seriesId": "tibo-28-days",
  "seriesDay": 19,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-23T23:12:31.000Z",
  "sources": [
    {
      "label": "Tibo：Day 19 更新",
      "url": "https://x.com/thsottiaux/status/2113770573994299544"
    },
    {
      "label": "Tibo：CLI 更新详情",
      "url": "https://x.com/thsottiaux/status/2113770862860222611"
    },
    {
      "label": "OpenAI：Codex CLI 0.164.0 发布说明",
      "url": "https://github.com/openai/codex/releases/tag/rust-v0.164.0"
    }
  ]
}
---

Day 19 是三项日常使用改进：dot 通话连接更快、Codex / Work 对话中切换推理强度不再使缓存失效，以及 Codex CLI 更新。[Tibo 主帖](https://x.com/thsottiaux/status/2113770573994299544)发表于北京时间 10 月 24 日 07:12:31，对应美西 10 月 23 日，因此系列仍归在 10 月 23 日。

## 切换推理强度时保留缓存

Tibo 表示，在 Codex 和 Work 的同一段对话中调整 reasoning，不再让缓存失效。一个任务从常规处理进入复杂判断时，用户可以调整推理强度，这次变化消除了原帖所指的缓存失效问题。

原帖没有给出节省额度的比例，也没有逐项列明模型和客户端版本；不能据此认定任意切换模型也能保留缓存。[Day 16](/zh-CN/guides/tibo-day-16-prompt-caching/)说的是 API 可选的 12 小时提示缓存，Day 19 说的是对话中调整推理强度对缓存的影响，两者对应不同的复用条件。

## CLI 具体更新了什么

Tibo 在北京时间 07:13:40 的[补充回复](https://x.com/thsottiaux/status/2113770862860222611)中列出提示词预设、行内模型与权限设置、企业 MCP 登录、长会话恢复修复，以及 Windows 企业代理认证。这些项目也能在 [0.164.0 正式发布说明](https://github.com/openai/codex/releases/tag/rust-v0.164.0)中找到。

| 改动 | 对使用的影响 |
| --- | --- |
| 提示词预设 | 通过 /presets 的编号位置复用常用指令。 |
| 行内设置 | 用命令参数调整模型、推理、速度或权限。 |
| 企业 MCP 认证 | 登录受支持的企业 MCP 连接。 |
| 会话恢复 | 找回已压缩的历史，并恢复保存的会话设置。 |
| Windows 代理支持 | 使用当前 Windows 用户身份处理企业代理认证。 |

核对行为前，可以运行 `codex --version` 查看本机版本，再与这份发布说明比较。这些是 CLI 改动，原帖没有说明所有桌面界面也新增了相同控件。

## dot 通话连接更快

另一项改进是呼叫 dot 时更快接通。Tibo 没有提供具体耗时、测速条件或地区清单，本站因此只记录这项已宣布的改进，不给出加速倍数，也不将其写成本站实测。

Day 19 主帖讲的是功能与稳定性，没有新增重置预告。下一天的 [Day 20 重置](/zh-CN/guides/tibo-day-20-reset-announced/)单独记录；[28 天目录](/zh-CN/guides/tibo-28-day-plan/)保留每日日期与原始来源。
