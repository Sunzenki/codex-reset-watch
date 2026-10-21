---
{
  "id": "tibo-day-11",
  "slug": "tibo-day-11-model-capacity",
  "title": "Tibo's Day 11 | Fewer capacity interruptions and automatic continuation",
  "summary": "The update targets model-capacity blocks: fewer messages and improved continuation after congestion, without a fixed recovery-time promise.",
  "locale": "en",
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
      "label": "Tibo: Day 11 capacity and automatic continuation",
      "url": "https://x.com/thsottiaux/status/2110750421367287996"
    },
    {
      "label": "OpenAI Status",
      "url": "https://status.openai.com/"
    }
  ]
}
---

A long task blocked by **Selected model is at capacity. Please try a different model** is the problem addressed by [Day 11](https://x.com/thsottiaux/status/2110750421367287996). Tibo says changes and added compute have substantially reduced these messages. Tasks encountering one again should subsequently continue on their own.

## Two changes to watch

Look at whether capacity messages appear less often, and whether a blocked task resumes progress. The announcement uses “should continue” and gives no fixed wait time.

That matters for users who leave tasks running without watching continuously. The post also invites feedback from users still affected, leaving improvement to be assessed against actual runs.

## Capacity and exhausted usage need different checks

A model-capacity message concerns service capacity; an exhausted plan allowance is a separate restriction. This change targets capacity and does not announce removal of usage windows.

Keep the exact error, selected model and occurrence time. If a broader incident seems possible, compare them with a [specific OpenAI Status event](https://status.openai.com/) and its affected components. This historical update does not describe current service health.
