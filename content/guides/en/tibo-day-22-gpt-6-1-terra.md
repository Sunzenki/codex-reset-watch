---
{
  "id": "tibo-day-22",
  "slug": "tibo-day-22-gpt-6-1-terra",
  "title": "Tibo's Day 22 | GPT-6.1 Terra arrives in Work, Codex and the API",
  "summary": "GPT-6.1 Terra focuses on writing, visual understanding and computer use. Learn where to select it, how its API prices compare with Sol, and what Tibo’s 2× usage claim covers.",
  "locale": "en",
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
      "label": "Tibo: Day 22, Terra returns",
      "url": "https://x.com/thsottiaux/status/2114800277677092936"
    },
    {
      "label": "OpenAI: GPT-6.1 Terra announcement",
      "url": "https://x.com/OpenAI/status/2114780711664398349"
    },
    {
      "label": "OpenAI: introducing GPT-6.1 Terra",
      "url": "https://openai.com/index/introducing-gpt-6-1-terra/"
    },
    {
      "label": "Work and Codex changelog",
      "url": "https://developers.openai.com/codex/changelog/"
    },
    {
      "label": "Work and Codex model selection",
      "url": "https://developers.openai.com/codex/models?surface=app"
    },
    {
      "label": "GPT-6.1 Terra API model and pricing",
      "url": "https://developers.openai.com/api/docs/models/gpt-6.1-terra"
    },
    {
      "label": "GPT-6.1 Sol API model and pricing",
      "url": "https://developers.openai.com/api/docs/models/gpt-6.1-sol"
    }
  ]
}
---

GPT-6.1 Terra is available in ChatGPT Work, Codex and the API. [Tibo’s Day 22 post](https://x.com/thsottiaux/status/2114800277677092936) highlights better writing, more nuanced handling of requests and strong computer use, alongside a claim of twice the usage of GPT-6.1 Sol across API and subscriptions.

## Writing, screens and everyday app work

[OpenAI’s release article](https://openai.com/index/introducing-gpt-6-1-terra/) positions Terra as a faster, lower-cost model for visual reasoning, operating application screens and writing naturally. The practical uses include interpreting screenshots, matching product images to catalog entries, and drafting or revising documents.

These are OpenAI’s stated capabilities; CRW has not benchmarked the model. OpenAI still identifies GPT-6.1 Sol and GPT-6 Astra as stronger choices for the most complex coding tasks. Terra adds an efficient option for everyday work rather than making every existing model redundant.

## Where to select Terra

The [October 26 Work and Codex changelog](https://developers.openai.com/codex/changelog/) lists **Plus, Pro, Business, Enterprise and Edu**. In the ChatGPT desktop app or Work on the web, open **Advanced** and select **GPT-6.1 Terra** from the model list. Work also supports it on mobile. This availability is for Work and Codex; the changelog says Terra is not available in ordinary Chat. Enterprise access depends on workspace availability and administrator controls, and UAE inference residency is not supported.

The [model selection guide](https://developers.openai.com/codex/models?surface=app) notes that available options depend on the plan, client, workspace settings and rollout. Computer-use tasks also require the corresponding tools and access. API developers use the model ID **gpt-6.1-terra**; tool calling requires the Responses API, as specified in the [API model documentation](https://developers.openai.com/api/docs/models/gpt-6.1-terra).

## What “2× usage” means

Tibo compares Terra with **GPT-6.1 Sol**. OpenAI explains the subscription benefit as the same Work or Codex allowance covering more work. This is a model-efficiency comparison, not an announcement that every plan’s allowance has doubled or that a reset has been issued. Task length, reasoning and tool use still affect consumption.

For the API, [Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra) has half the following Standard token prices of [Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol). Amounts are USD per **one million tokens**:

| Model | Input | Cached input reads | Output |
| --- | --- | --- | --- |
| GPT-6.1 Terra | $1.00 | $0.05 | $5.00 |
| GPT-6.1 Sol | $2.00 | $0.10 | $10.00 |

Cached reads and cache writes have separate prices. Terra’s cache writes cost $1.25 for 30-minute retention or $2.50 for 12 hours per million tokens. For requests above **272K input tokens**, both model pages apply **2× input/cache rates and 1.5× output rates to the full request**. Tool charges, speed modes and regional processing can change the total; the table is the Standard token baseline, not a fixed price per task.

## Day 22’s series date

[OpenAI’s announcement](https://x.com/OpenAI/status/2114780711664398349) was posted on October 26 at **18:06:27 UTC**, followed by Tibo at **19:24:11 UTC**. The [series calendar](/guides/tibo-28-day-plan/) therefore files Day 22 under October 26 in Pacific time. Coverage now reaches **22/28 days**, including 13 feature days and 11 reset-related days; the previous [Day 21 reset](/guides/tibo-day-21-reset-landed/) remains its own event.
