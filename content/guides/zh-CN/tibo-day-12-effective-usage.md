---
{
  "id": "tibo-day-12",
  "slug": "tibo-day-12-effective-usage",
  "title": "Tibo's Day 12｜复用子代理上下文，让 Codex 用量更有效",
  "summary": "Codex 与 Work 通过共享上下文、更长缓存及路由优化减少重复处理；实际收益取决于任务的复用程度。",
  "locale": "zh-CN",
  "category": "updates",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "seriesId": "tibo-28-days",
  "seriesDay": 12,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-16T23:55:11Z",
  "sources": [
    {
      "label": "Tibo：Day 12 有效用量改进",
      "url": "https://x.com/thsottiaux/status/2111244596131111253"
    },
    {
      "label": "评论：个人账号的用量体验",
      "url": "https://x.com/integer_32/status/2111245338178887696"
    },
    {
      "label": "Tibo 回复：同日 GPT-6 Pro 更新",
      "url": "https://x.com/thsottiaux/status/2111244957851984181"
    }
  ]
}
---

[Day 12 公告](https://x.com/thsottiaux/status/2111244596131111253)介绍了 Codex 与 Work 的三项效率改进：复用子代理之间的上下文、延长缓存，以及改进请求路由来增加缓存命中。

## 收益来自减少重复处理

多个子代理处理同一个项目时，可能反复带入相同指令和背景。复用这些内容，可以减少重复处理，让用量更多花在新的任务步骤上。

因此，有大量共同背景的多代理任务更值得关注这类改进。重复内容少、上下文频繁变化的任务，收益可能不同。公告没有给出所有账号统一增加的百分比或新的每周额度数值。

## 为何仍有人觉得用量消耗快

原帖下的[相关用户反馈](https://x.com/integer_32/status/2111245338178887696)仍提到，一周额度可能很快用完。这是具体账号的体感，评论没有提供完整模型、任务和窗口条件，无法用来估算平均改善。

想比较自己的变化，可保留相近任务、模型、是否使用子代理，以及用量窗口的记录。不要只比较两次任务结束时的剩余百分比。

## 后续可以对照哪一项更新

[Day 16 的缓存说明](/zh-CN/guides/tibo-day-16-prompt-caching/)进一步给出 API 的 12 小时选项，以及登录产品恢复旧会话的缓存说法。它提供更具体的复用条件，但同样不能直接换算为每个用户的统一加量倍数。

同一线程的[Tibo 补充](https://x.com/thsottiaux/status/2111244957851984181)还提到 GPT-6 Pro 的速度、工具和并行代理改进；这是另一项产品范围，和本篇 Codex 上下文复用分别理解。
