---
{
  "id": "tibo-day-14",
  "slug": "tibo-day-14-edit-messages",
  "title": "Tibo's Day 14｜桌面端可编辑旧消息，Tibo 补充 time travel 语义",
  "summary": "编辑线程中的历史提示，与执行中追加 steering 的作用不同；文件和外部操作是否恢复，公告未完整说明。",
  "locale": "zh-CN",
  "category": "updates",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "seriesId": "tibo-28-days",
  "seriesDay": 14,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-19T01:18:10Z",
  "sources": [
    {
      "label": "Tibo：Day 14 编辑历史消息",
      "url": "https://x.com/thsottiaux/status/2111990254408434095"
    },
    {
      "label": "评论：编辑与 steering 的区别",
      "url": "https://x.com/JamesStewau0y5/status/2111991077490360408"
    },
    {
      "label": "Tibo 回复：Registers as time travel",
      "url": "https://x.com/thsottiaux/status/2111994295364571327"
    }
  ]
}
---

[Day 14 更新](https://x.com/thsottiaux/status/2111990254408434095)为桌面端增加编辑同一线程中已发送消息的能力。对先前提示写错条件、希望从旧要求重新处理的用户，这是一个更直接的更正入口。

## 与 steering 有什么不同

James Stewart 在[评论](https://x.com/JamesStewau0y5/status/2111991077490360408)中追问：编辑先前提示，效果是否像 steering？Tibo [回复](https://x.com/thsottiaux/status/2111994295364571327)，会作为“time travel”处理。

作者由此将两种交互区分开：steering 在任务进行中补充方向，编辑历史消息则回到此前的位置。若只需给正在运行的任务追加约束，可对照[Day 4 的即时 steering 更新](/zh-CN/guides/tibo-day-04-steering-ultrafast/)。

## 回到旧消息后，已有成果怎么办

这段问答没有完整说明分支、后续消息保留方式，以及文件或外部操作的回滚规则。聊天历史能回退，并不足以说明已经写出的文件、提交或外部动作会自动撤销。

因此，使用前应看当前客户端的提示，处理后核对已有工作成果。本站本轮核对的是公开消息与问答，没有执行文件恢复测试。
