---
{
  "id": "tibo-day-19",
  "slug": "tibo-day-19-small-updates",
  "title": "Tibo's Day 19 | Faster dot calls, reasoning-cache reuse and CLI updates",
  "summary": "Dot calls connect faster, and changing reasoning effort mid-conversation preserves the cache in Codex and Work. The CLI changes also appear in the 0.164.0 release notes.",
  "locale": "en",
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
      "label": "Tibo: Day 19 updates",
      "url": "https://x.com/thsottiaux/status/2113770573994299544"
    },
    {
      "label": "Tibo: CLI details",
      "url": "https://x.com/thsottiaux/status/2113770862860222611"
    },
    {
      "label": "OpenAI: Codex CLI 0.164.0 release",
      "url": "https://github.com/openai/codex/releases/tag/rust-v0.164.0"
    }
  ]
}
---

Day 19 brings three smaller workflow improvements: faster call connections for dots, preserved cache when changing reasoning effort during a Codex / Work conversation, and a Codex CLI update. [Tibo’s post](https://x.com/thsottiaux/status/2113770573994299544) was published on October 23 at 23:12:31 UTC, still October 23 in Pacific time.

## Changing reasoning effort without discarding the cache

Tibo says that changing reasoning mid-conversation in Codex and Work no longer invalidates the cache. This matters when a task moves between routine work and a harder decision: adjusting reasoning effort no longer causes the cache invalidation described in the announcement.

The post does not quantify savings or specify every supported model and client version. It also does not establish that switching models preserves the cache. The [Day 16 update](/guides/tibo-day-16-prompt-caching/) concerns optional 12-hour API prompt caching; Day 19 addresses what happens when reasoning effort changes during a conversation. These are different conditions for cache reuse.

## Which CLI changes are included

In a [follow-up](https://x.com/thsottiaux/status/2113770862860222611) at 23:13:40 UTC, Tibo names reusable prompt presets, inline model and permission settings, enterprise MCP sign-in, long-session resume fixes and Windows corporate-proxy authentication. Those changes also appear in the [official 0.164.0 release notes](https://github.com/openai/codex/releases/tag/rust-v0.164.0).

| Change | Where it helps |
| --- | --- |
| Prompt presets | Reuse frequent instructions through numbered slots in /presets. |
| Inline settings | Adjust model, reasoning, speed or permissions through command arguments. |
| Enterprise MCP authentication | Sign in to supported company MCP connections. |
| Session recovery | Resume compressed histories with saved thread settings. |
| Windows proxy support | Handle corporate proxy authentication using the signed-in Windows user. |

Check your installed version with `codex --version` when comparing behavior with this release. These are CLI changes; the post does not say that every desktop interface received the same controls.

## Faster dot call connections

The other change is shorter connection time when calling a dot. Tibo gives no benchmark or regional rollout list, so this article records the announced improvement without assigning a speedup or claiming that the site tested it.

Day 19 announces feature and reliability changes, with no new usage reset in this post. The next [Day 20 reset announcement](/guides/tibo-day-20-reset-announced/) is covered separately. The [28-day index](/guides/tibo-28-day-plan/) keeps the series dates and original sources together.
