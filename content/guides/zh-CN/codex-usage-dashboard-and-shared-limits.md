---
{
  "id": "codex-usage-dashboard-and-shared-limits",
  "slug": "codex-usage-dashboard-and-shared-limits",
  "title": "Codex 额度在哪里看：窗口、共享用量与额外 credits",
  "summary": "从用量面板和 CLI /status 看自己的限制；分清当前套餐窗口、Work 共享用量，以及 API key 的独立计费路径。",
  "locale": "zh-CN",
  "category": "tutorials",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI：用量、套餐与共享额度说明",
      "url": "https://learn.chatgpt.com/docs/pricing"
    },
    {
      "label": "Codex：账号用量面板",
      "url": "https://chatgpt.com/codex/settings/usage"
    }
  ]
}
---

想知道 Codex 还能用多少、何时恢复，先打开[账号用量面板](https://chatgpt.com/codex/settings/usage)，或在正在使用的 CLI 会话输入 `/status`。[官方用量说明](https://learn.chatgpt.com/docs/pricing)把它们列为查询当前限制和重置时间的入口。本文按 2026 年 10 月 21 日的文档整理。

## 先核对账号、窗口和时区

确认登录的是实际运行任务的账号及工作区，再记录页面显示的窗口名称、剩余量和恢复时间。截图要保留时间与时区，方便前后对照；不要只截一个百分比。

当前官方文档的五小时消息区间用于 **Plus 与 Standard Business**，同时说明 **Pro 当前没有五小时限制**；部分用量仍可能受周限额约束。自己看到的窗口应以当前账号面板为准，不能把某个套餐截图套到所有账号。

## 哪些操作可能用同一份额度

官方说明，**ChatGPT Work 与 Codex 共享用量**，本地消息与云端任务也共享套餐用量。任务使用的模型、上下文、推理、工具和缓存都会影响消耗；消息数量相同，实际用量也可能不同。

因此，在比较两个任务之前，至少记下模型、速度档位、任务范围，以及这段时间是否还有其他 Work 或 Codex 任务在运行。这个记录方法有助于解释自己的变化，不能据此估算所有人的统一可用次数。

## 额度用完后的三种路径

| 路径 | 需要看什么 |
| --- | --- |
| 等待套餐窗口恢复 | 账号面板给出的当前限制与恢复时间 |
| 使用额外 credits | 套餐是否支持、账号或工作区的可用余额与管理设置 |
| 使用 API key 继续本地任务 | API 项目权限、额度和单独计费；按 API 价格计算 |

credits 和 API key 都涉及各自的计费规则。评估之前先确认你准备使用哪条路径；订阅里的剩余百分比不能直接换算成 API 余额。本文提供核对入口，不代替账号购买或修改工作区预算。

## 为下一次比较留下可用记录

用同一类小任务观察一段时间：保留开始与结束的用量截图、模型、速度档位和同时运行的任务。不要为了比较而反复重跑昂贵任务，也无需贴出 API key 或完整私人对话。

如果出现的是连接失败或服务报错，接着按[具体状态事件](/zh-CN/guides/openai-2026-10-21-service-degradation/)中的组件与时间排查。把用量记录和错误原文放在一起，比单看“今天掉得快”更容易找到原因。
