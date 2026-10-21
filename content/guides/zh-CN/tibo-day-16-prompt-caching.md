---
{
  "id": "tibo-day-16",
  "slug": "tibo-day-16-prompt-caching",
  "title": "Tibo's Day 16｜API 可选 12 小时缓存，Codex 恢复旧会话有何变化",
  "summary": "API 新增长时缓存选项；Tibo 另说明登录 Codex 与 Work 后恢复旧会话的缓存行为，使用条件和费用分别看。",
  "locale": "zh-CN",
  "category": "updates",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "featuredOrder": 2,
  "cover": "/images/guides-tibo-prompt-cache.webp",
  "seriesId": "tibo-28-days",
  "seriesDay": 16,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-21T01:10:02Z",
  "sources": [
    {
      "label": "Tibo：Day 16 缓存说明",
      "url": "https://x.com/thsottiaux/status/2112712984644784534"
    },
    {
      "label": "OpenAI Developers：12 小时 API 缓存公告",
      "url": "https://x.com/OpenAIDevs/status/2112603916076781778"
    },
    {
      "label": "OpenAI：Prompt caching 官方文档",
      "url": "https://developers.openai.com/api/docs/guides/prompt-caching"
    },
    {
      "label": "评论：订阅永久缓存疑问",
      "url": "https://x.com/Avery_Jones/status/2112715170200043683"
    }
  ],
  "coverAlt": "API 12 小时提示缓存示意：共享上下文写入缓存后被多次请求复用。",
  "coverWidth": 1967,
  "coverHeight": 799,
  "bannerCover": "/images/guides-tibo-prompt-cache-banner.webp"
}
---

[Day 16 主帖](https://x.com/thsottiaux/status/2112712984644784534)介绍了两件相关但适用范围不同的事：API 可以选择 12 小时提示缓存；登录使用 Codex 与 Work 时，Tibo 表示会保留缓存，让隔数小时恢复旧对话也能命中。

## API 12 小时缓存适合什么任务

[@OpenAIDevs 公告](https://x.com/OpenAIDevs/status/2112603916076781778)面向一天里反复使用相同指令、工具和背景的代理任务：把稳定内容缓存更久，后续复用时按较低的缓存输入费率读取。

[官方文档](https://developers.openai.com/api/docs/guides/prompt-caching)要求匹配可复用的提示前缀；改变前面的指令、工具等内容可能影响命中。同一个会话标识本身不保证命中。

按当前官方文档，这个选项适用于 **Responses API 中的 GPT-5.6 及后续模型**。请求中的配置片段为：

```json
{"prompt_cache_options": {"ttl": "12h"}}
```

`12h` 表示最低缓存保留时间。写入按普通输入费率的 **2.5 倍**计费，这是写入的总费率；命中后的读取按该模型的缓存输入费率计费。最低保留时间也不保证每次请求的延迟都会降低。

上午和下午多次复用同一段长指令，通常比只调用一次、或不断改动开头内容的任务，更值得评估长时缓存。比较时把写入、读取和未命中的输入成本一起算，实际价格以[官方缓存文档](https://developers.openai.com/api/docs/guides/prompt-caching)为准。这里是机制分析，未作费用实测。

## 登录 Codex 与 Work 的用户要设置吗

Tibo 的说明针对已登录产品中的旧会话恢复，并非要求这些用户去设置 API 的缓存选项。API 和订阅产品的使用路径分别处理。

原帖下[有人追问订阅缓存是否永久](https://x.com/Avery_Jones/status/2112715170200043683)。当前依据是 Tibo 对产品行为的公开说法，长期保留时限、失效条件和各客户端一致性尚未独立验证。缓存复用也不改变模型上下文窗口或取消正常用量消耗。

## 和第 12 天怎样衔接

[Day 12](/zh-CN/guides/tibo-day-12-effective-usage/)介绍子代理复用、延长缓存和路由优化，Day 16 给出了更具体的保留选项与旧会话恢复说明。两天都围绕减少重复处理，但没有给所有用户公布统一的用量增长倍数。
