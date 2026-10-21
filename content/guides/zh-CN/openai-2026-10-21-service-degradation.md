---
{
  "id": "openai-2026-10-21-service-degradation",
  "slug": "openai-2026-10-21-service-degradation",
  "title": "10 月 21 日 Codex、ChatGPT 与 API 服务降级已恢复",
  "summary": "官方在 03:28 UTC 确认恢复；按受影响组件与通报时间对照这次故障，保留任务记录后再核对重试结果。",
  "locale": "zh-CN",
  "category": "incidents",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI Status：本次服务降级事件",
      "url": "https://status.openai.com/incidents/01M5E4G39TD1BW1QWHZG6RFA5H"
    },
    {
      "label": "OpenAI Status：事件历史",
      "url": "https://status.openai.com/history"
    }
  ]
}
---

**本次事件已恢复。** [OpenAI Status 的事件记录](https://status.openai.com/incidents/01M5E4G39TD1BW1QWHZG6RFA5H)在 2026 年 10 月 21 日 **03:28 UTC（北京时间 11:28）**标为 Resolved，说明所有受影响服务已恢复。本文记录这一次事件，截至 10 月 21 日 15:24 UTC 核对。

## 哪些服务被列入影响范围

事件同时列出 ChatGPT、Codex 和 API 组件。与 Codex 用户直接相关的有 **Codex Web、Codex API、CLI**，以及 ChatGPT 分组中的 **Work 和桌面端 Codex**。API 分组还包含 Responses、Chat Completions、Agents 等组件。

这个范围便于核对同一时段的异常：先找自己使用的入口，再对应错误发生时间。状态页的组件列表表示官方报告的影响范围，个人账号的失败还需要结合自己的请求记录判断。

## 官方通报时间线

| 进展 | 2026-10-21 UTC | 北京时间 |
| --- | --- | --- |
| Investigating：开始调查已列服务的问题 | 02:26:28 | 10:26:28 |
| Monitoring：已采取缓解措施并观察恢复 | 02:48 | 10:48 |
| Resolved：确认受影响服务恢复 | 03:28 | 11:28 |

表格使用官方事件数据中的通报时间。状态网页会按访问环境显示当地时刻，所以同一节点在截图里可能落在美西 10 月 20 日；对应的是同一次事件。当前记录未给出根因分析或补偿安排。

## 恢复之后，任务仍失败怎么办

先保留错误原文、客户端、模型、登录方式和带时区的发生时间。对于已经执行到写文件、发请求等阶段的任务，先检查已有结果，再决定从哪里继续，避免重复操作。

之后用一个范围较小的请求确认当前入口能否工作。若新请求正常、旧任务仍失败，重点记录恢复旧任务时的具体步骤；若多个入口都异常，再查看[状态页的新事件](https://status.openai.com/history)，不要将后续问题全部归入这一次已恢复事件。

`429`、连接错误、模型容量不足和账号额度不足，需要保留准确错误内容后分别排查。关于账号用量入口，可以继续看[Codex 额度查看方法](/zh-CN/guides/codex-usage-dashboard-and-shared-limits/)。
