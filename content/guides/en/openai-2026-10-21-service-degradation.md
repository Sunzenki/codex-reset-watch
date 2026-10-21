---
{
  "id": "openai-2026-10-21-service-degradation",
  "slug": "openai-2026-10-21-service-degradation",
  "title": "Oct 21 UTC: Codex, ChatGPT and API degradation resolved",
  "summary": "OpenAI confirmed recovery at 03:28 UTC. Match affected components and update times to your task, then check existing results before retrying.",
  "locale": "en",
  "category": "incidents",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI Status: this degradation incident",
      "url": "https://status.openai.com/incidents/01M5E4G39TD1BW1QWHZG6RFA5H"
    },
    {
      "label": "OpenAI Status: incident history",
      "url": "https://status.openai.com/history"
    }
  ]
}
---

**This incident is resolved.** The [OpenAI Status incident](https://status.openai.com/incidents/01M5E4G39TD1BW1QWHZG6RFA5H) was marked Resolved at **03:28 UTC on October 21, 2026**, confirming recovery of affected services. This article records that incident and was checked at 15:24 UTC on October 21.

## Match the affected component

The incident lists ChatGPT, Codex and API components. Relevant Codex entries include **Codex Web, Codex API and CLI**, plus **Work and Codex in ChatGPT Desktop** under ChatGPT. The API group also includes Responses, Chat Completions and Agents, among other components.

Start with the surface you used and the time of the error. The component list establishes the reported scope; your own request records are still needed to match an individual failure to it.

## Official update timeline

| Update | October 21, 2026, UTC | Beijing time (UTC+8) |
| --- | --- | --- |
| Investigating: investigating the listed services | 02:26:28 | 10:26:28 |
| Monitoring: mitigation applied; recovery monitored | 02:48 | 10:48 |
| Resolved: affected services recovered | 03:28 | 11:28 |

These are update timestamps from the official incident data. The status website can display local times; a screenshot dated October 20 in US Pacific time can refer to the same event. The record does not provide a root-cause analysis or compensation details.

## If a task still fails after recovery

Keep the exact error, client, model, sign-in method and timestamp with its time zone. Before retrying a task that may already have written files or sent requests, inspect existing results to avoid repeating completed actions.

Try a small request on the affected surface. If new requests work but an old task fails to resume, record those resume steps. If several surfaces still fail, check for [new status incidents](https://status.openai.com/history) instead of assigning every later problem to this resolved event.

Keep distinct error messages—such as `429`, connection failures, capacity messages and exhausted account limits—for diagnosis. For account usage, see [how to check Codex limits](/guides/codex-usage-dashboard-and-shared-limits/).
