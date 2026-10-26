---
{
  "id": "tibo-day-22",
  "slug": "tibo-day-22-gpt-6-1-terra",
  "title": "Tibo's Day 22｜GPT-6.1 Terra 上线 Work、Codex 和 API",
  "summary": "GPT-6.1 Terra 主打写作、视觉理解和电脑操作。本文整理模型入口、适用套餐、与 Sol 的 API 价格对照，以及 Tibo 所说“2 倍用量”的范围。",
  "locale": "zh-CN",
  "category": "updates",
  "publishedAt": "2026-10-26T19:52:49.058Z",
  "status": "published",
  "seriesId": "tibo-28-days",
  "seriesDay": 22,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-26T19:24:11.000Z",
  "sources": [
    {
      "label": "Tibo：Day 22，Terra 回归",
      "url": "https://x.com/thsottiaux/status/2114800277677092936"
    },
    {
      "label": "OpenAI：GPT-6.1 Terra 发布帖",
      "url": "https://x.com/OpenAI/status/2114780711664398349"
    },
    {
      "label": "OpenAI：GPT-6.1 Terra 发布说明",
      "url": "https://openai.com/index/introducing-gpt-6-1-terra/"
    },
    {
      "label": "Work 与 Codex 更新日志",
      "url": "https://developers.openai.com/codex/changelog/"
    },
    {
      "label": "Work 与 Codex 模型选择说明",
      "url": "https://developers.openai.com/codex/models?surface=app"
    },
    {
      "label": "GPT-6.1 Terra API 模型与价格",
      "url": "https://developers.openai.com/api/docs/models/gpt-6.1-terra"
    },
    {
      "label": "GPT-6.1 Sol API 模型与价格",
      "url": "https://developers.openai.com/api/docs/models/gpt-6.1-sol"
    }
  ]
}
---

GPT-6.1 Terra 已上线 ChatGPT Work、Codex 和 API。[Tibo 的 Day 22 原帖](https://x.com/thsottiaux/status/2114800277677092936)强调写作、对请求细节的理解以及电脑操作能力，并表示在 API 和订阅中，相比 GPT-6.1 Sol 可以获得 2 倍用量。

## 写作、看图与日常应用操作

[OpenAI 发布说明](https://openai.com/index/introducing-gpt-6-1-terra/)将 Terra 定位为速度更快、成本更低的视觉推理、电脑操作和自然写作模型。对应到具体工作，可以用来理解截图、将商品图片与目录条目匹配，或起草和修改文档。

这些能力描述来自 OpenAI，本站尚未对模型进行基准测试。官方仍将 GPT-6.1 Sol 和 GPT-6 Astra 列为最复杂编程任务的更好选择。Terra 为日常工作增加了一个更省用量的选项，复杂任务仍需按能力需求选择模型。

## 在哪里选择 Terra

[10 月 26 日 Work 与 Codex 更新日志](https://developers.openai.com/codex/changelog/)列出的套餐包括 **Plus、Pro、Business、Enterprise 和 Edu**。在 ChatGPT 桌面应用或网页版 Work 中，打开 **Advanced**，再从模型列表选择 **GPT-6.1 Terra**；移动端 Work 也支持。这里的可用范围是 Work 和 Codex，日志明确说明普通 Chat 中尚不可用。Enterprise 还受工作区开放情况和管理员设置影响，暂不支持 UAE 推理驻留。

[模型选择文档](https://developers.openai.com/codex/models?surface=app)说明，可见选项随套餐、客户端、工作区设置和推出进度而异；电脑操作还需要对应工具与访问权限。API 使用模型 ID **gpt-6.1-terra**，[API 模型页](https://developers.openai.com/api/docs/models/gpt-6.1-terra)注明工具调用需要使用 Responses API。

## “2 倍用量”具体指什么

Tibo 的比较对象是 **GPT-6.1 Sol**。OpenAI 对订阅收益的解释是，同一份 Work 或 Codex 额度可以完成更多工作。这是模型用量效率的对照，不能据此推导所有套餐额度永久翻倍，或已经发放了一次重置；任务长度、推理和工具使用仍会影响消耗。

API 方面，[Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra)下列 Standard token 单价均为 [Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol)的一半，单位为**美元／每百万 token**：

| 模型 | 输入 | 缓存读取 | 输出 |
| --- | --- | --- | --- |
| GPT-6.1 Terra | $1.00 | $0.05 | $5.00 |
| GPT-6.1 Sol | $2.00 | $0.10 | $10.00 |

缓存读取与写入分开计价。Terra 缓存写入的每百万 token 价格为：保留 30 分钟 $1.25，保留 12 小时 $2.50。输入超过 **272K token** 时，两款模型都对**整个请求**按输入及缓存费率 2 倍、输出费率 1.5 倍计费。工具费用、速度模式和区域处理还可能改变总价，表格只列 Standard token 基础价格，不能直接换算为每项任务固定省一半。

## Day 22 归在美西 10 月 26 日

[OpenAI 发布帖](https://x.com/OpenAI/status/2114780711664398349)发表于**北京时间 10 月 27 日 02:06:27**（UTC 10 月 26 日 18:06:27），Tibo 原帖则为 **03:24:11**（UTC 19:24:11）。[系列日历](/zh-CN/guides/tibo-28-day-plan/)按美西日期将 Day 22 归到 10 月 26 日，现已整理 **22/28 天**，其中 13 个功能日、11 个重置相关日；此前的 [Day 21 额度重置](/zh-CN/guides/tibo-day-21-reset-landed/)保留为独立事件。
