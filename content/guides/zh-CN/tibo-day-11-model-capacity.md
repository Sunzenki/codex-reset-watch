---
{
  "id": "tibo-day-11",
  "slug": "tibo-day-11-model-capacity",
  "title": "Tibo's Day 11｜减少 model at capacity 中断，拥塞后可自行继续",
  "summary": "更新针对模型满载造成的任务阻塞：降低提示出现频率，并改善拥塞后的继续行为，未给出固定恢复时长。",
  "locale": "zh-CN",
  "category": "updates",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "seriesId": "tibo-28-days",
  "seriesDay": 11,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-15T15:11:30Z",
  "sources": [
    {
      "label": "Tibo：Day 11 容量与自动继续说明",
      "url": "https://x.com/thsottiaux/status/2110750421367287996"
    },
    {
      "label": "OpenAI Status",
      "url": "https://status.openai.com/"
    }
  ]
}
---

长任务被 **Selected model is at capacity. Please try a different model** 卡住，是[Day 11 更新](https://x.com/thsottiaux/status/2110750421367287996)针对的问题。Tibo 称，一系列修改和新增算力已显著降低这类提示的出现频率；再次遇到时，任务也应能随后自行继续。

## 观察两种变化

一是模型满载提示是否更少，二是遇到提示后，任务能否恢复推进。公告保留了“应该会继续”的表述，没有给出固定等待时长。

这对需要持续运行、无法一直守着任务的用户尤其相关。主帖还邀请仍遇到问题的用户反馈，说明这项改善需要结合具体运行情况观察。

## 先区分容量问题与用量耗尽

模型满载提示指向服务容量，账号的套餐用量耗尽则是另一类限制。此次改动针对前者，没有宣布取消额度窗口。

排查时先保留准确错误文字、模型和出现时间。如果怀疑是较广泛的故障，可查看 [OpenAI Status 的具体事件](https://status.openai.com/)，再与受影响组件和时段对照；这篇历史更新不代表当前服务状态。
