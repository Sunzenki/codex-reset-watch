---
{
  "id": "tibo-day-16",
  "slug": "tibo-day-16-prompt-caching",
  "title": "Tibo's Day 16 | 12-hour API caching and resumed Codex chats",
  "summary": "The API adds a longer retention option. Tibo separately describes cache behavior when restoring signed-in Codex and Work conversations.",
  "locale": "en",
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
      "label": "Tibo: Day 16 caching explanation",
      "url": "https://x.com/thsottiaux/status/2112712984644784534"
    },
    {
      "label": "OpenAI Developers: 12-hour API caching announcement",
      "url": "https://x.com/OpenAIDevs/status/2112603916076781778"
    },
    {
      "label": "OpenAI: prompt-caching documentation",
      "url": "https://developers.openai.com/api/docs/guides/prompt-caching"
    },
    {
      "label": "Reader reply: permanent subscription-cache question",
      "url": "https://x.com/Avery_Jones/status/2112715170200043683"
    }
  ],
  "coverAlt": "12-hour API prompt caching: stable prefix notes are reused across subsequent requests.",
  "coverWidth": 1967,
  "coverHeight": 799,
  "bannerCover": "/images/guides-tibo-prompt-cache-banner.webp"
}
---

The [Day 16 post](https://x.com/thsottiaux/status/2112712984644784534) covers two related changes with different scopes: a selectable 12-hour prompt-cache option in the API, and Tibo’s statement that signed-in Codex and Work retain caches so conversations resumed hours later can hit them.

## Which tasks suit a 12-hour API cache?

The [@OpenAIDevs announcement](https://x.com/OpenAIDevs/status/2112603916076781778) concerns agent tasks that reuse instructions, tools and background throughout a day. Keeping stable material cached longer allows subsequent reuse at the lower cached-input rate.

The [official documentation](https://developers.openai.com/api/docs/guides/prompt-caching) requires a reusable prompt-prefix match. Changing earlier instructions or tools can affect hits. A shared conversation identifier by itself does not guarantee a hit.

The current official documentation supports this option for **GPT-5.6 and later in the Responses API**. The request configuration fragment is:

```json
{"prompt_cache_options": {"ttl": "12h"}}
```

`12h` specifies a minimum cache lifetime. Writes cost **2.5 times** the ordinary input-token rate; this is the total write rate. Reads that hit the cache use the model’s cached-input rate. A minimum lifetime does not guarantee lower latency on every request.

Repeatedly reusing long instructions across a morning and afternoon is a stronger candidate than a single call or a task that keeps changing its prefix. Compare writes, reads and uncached input together, using the current [official caching documentation](https://developers.openai.com/api/docs/guides/prompt-caching) for pricing. This is a mechanism-based comparison, without a CRW cost benchmark.

## Do signed-in Codex and Work users need an API setting?

Tibo’s product statement concerns resuming earlier conversations in signed-in products. It does not instruct those users to configure an API cache option. Keep the API and subscription-product paths separate.

A [reader asks whether subscription caching is permanent](https://x.com/Avery_Jones/status/2112715170200043683). The current basis is Tibo’s public statement about product behavior. Long-term retention, invalidation conditions and consistency across clients have not been independently verified. Cache reuse also does not enlarge a model’s context window or remove normal usage consumption.

## How this extends Day 12

[Day 12](/guides/tibo-day-12-effective-usage/) describes subagent reuse, longer caching and routing improvements. Day 16 adds more specific retention options and resumed-conversation behavior. Both concern less repeated processing, without announcing a common usage-increase multiplier for all users.
