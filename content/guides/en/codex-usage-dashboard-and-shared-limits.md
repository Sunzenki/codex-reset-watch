---
{
  "id": "codex-usage-dashboard-and-shared-limits",
  "slug": "codex-usage-dashboard-and-shared-limits",
  "title": "Check Codex limits: windows, shared usage and extra credits",
  "summary": "Use the usage dashboard or CLI /status, identify your plan windows, and distinguish shared Work usage from separately billed API-key access.",
  "locale": "en",
  "category": "tutorials",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI: pricing, limits and shared usage",
      "url": "https://learn.chatgpt.com/docs/pricing"
    },
    {
      "label": "Codex: account usage dashboard",
      "url": "https://chatgpt.com/codex/settings/usage"
    },
    {
      "label": "OpenAI: API credits for ChatGPT subscribers",
      "url": "https://developers.openai.com/api/docs/guides/chatgpt-api-credits"
    },
    {
      "label": "OpenAI: ChatGPT Pro tiers",
      "url": "https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers"
    }
  ],
  "updatedAt": "2026-10-29T17:16:29.851Z"
}
---

To check remaining Codex usage and reset times, open the [account usage dashboard](https://chatgpt.com/codex/settings/usage), or enter `/status` in an active CLI session. The [official pricing guide](https://learn.chatgpt.com/docs/pricing) identifies these as the relevant entry points. This article reflects documentation checked on October 21, 2026.

## Record the account, window and time zone

Confirm the account and workspace running the task, then record the window label, remaining amount and reset time shown. Include the timestamp and time zone in screenshots so comparisons retain their context.

The current documentation gives five-hour message estimates for **Plus and Standard Business**, while stating that **Pro currently has no five-hour limit**. Weekly limits may still apply. Use your account's current dashboard rather than applying another plan's screenshot to your own account.

## Which work can share the allowance?

**ChatGPT Work and Codex share usage**, and local messages and cloud tasks share the plan allowance. Model, context, reasoning, tools and caching affect consumption, so equal message counts can use different amounts.

Before comparing two tasks, record the model, speed setting, scope and any other Work or Codex activity during that interval. This helps explain a personal usage change without treating it as a universal task allowance.

## Options after reaching a limit

| Path | What to check |
| --- | --- |
| Wait for a plan window to reset | Current limits and reset time in the account dashboard |
| Use additional credits | Plan eligibility, available account or workspace credits, and administrator settings |
| Use an API key for local work | API project access, limits and separate usage-based billing |

Credits and API-key access have their own billing rules. Identify the intended path before comparing costs; a subscription percentage does not translate directly into an API balance. This guide does not purchase credits or change a workspace budget.

Subscriber [API credits](/guides/chatgpt-pro-business-api-credits/) are a separate benefit: they do not increase signed-in Codex limits and cannot pay for Codex usage through API keys. Pro 200 users should also check the [canceled allowance reduction](/guides/pro-200-grandfathered-allowance-october-2026/).

## Keep a useful comparison record

Observe comparable small tasks over time. Keep before-and-after usage screenshots, model, speed setting and concurrent work. Avoid expensive repeated runs solely to measure consumption, and do not include API keys or private conversation contents in reports.

For connection failures or service errors, compare components and timestamps with a [specific status incident](/guides/openai-2026-10-21-service-degradation/). Usage records plus the exact error are more useful than a remaining percentage alone.
