---
{
  "id": "chatgpt-pro-business-api-credits",
  "slug": "chatgpt-pro-business-api-credits",
  "title": "ChatGPT Pro and Business API credits: eligibility, amounts and limits",
  "summary": "Eligible Pro and Business subscribers can claim API credits. See plan amounts, the ownership requirements, expiration and the Codex exclusion.",
  "locale": "en",
  "category": "updates",
  "publishedAt": "2026-10-29T08:38:44.182Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI: API credits for ChatGPT subscribers",
      "url": "https://developers.openai.com/api/docs/guides/chatgpt-api-credits"
    },
    {
      "label": "OpenAI Developers: announcement",
      "url": "https://x.com/OpenAIDevs/status/2115583698074755078"
    }
  ]
}
---

[OpenAI’s subscriber benefit](https://developers.openai.com/api/docs/guides/chatgpt-api-credits) lets eligible paid ChatGPT Pro and Business subscribers claim API credits for an API organization they own. The advertised maximum of **$500 per month is not the amount every subscriber receives**.

| Subscription | Monthly API credits |
| --- | --- |
| Pro $100 / $200 / $500 | $100 / $200 / $500 respectively |
| Business Standard | $20 per paid Standard seat |
| Business Premium | $100 per paid Premium seat |

Business credits are pooled and capped at $500 per workspace per month. For Business subscriptions paid annually upfront, the full year’s grant is issued together and expires at the end of the annual billing cycle; the annual cap is $6,000. The first grant is prorated for the time remaining in the current billing cycle. Unused credits expire at the end of that cycle and do not roll over. Renewals continue only while the subscription and benefit remain eligible.

## Who can claim and where

The paid subscription must have been active for at least seven days; trials and complimentary subscriptions do not qualify. You must own both the Pro subscription or Business workspace and the receiving API organization, using the same email for ChatGPT and the API account. Free, Go, Plus and Enterprise are not eligible for this benefit.

For Pro, open ChatGPT **Settings → Billing**; for Business, use workspace billing settings or the Admin Console. Find the API credit benefit, review the receiving organization, and confirm. You can also start from API Platform Billing. Choose the organization carefully: changing it later requires contacting support. An API payment method is not required to use active free credits.

## API credits are separate from Codex allowance

The grant covers eligible API Platform usage such as Responses, Agents, image generation and built-in tools. **It does not support Codex usage authenticated with an API key, and does not increase ChatGPT or signed-in Codex usage limits.** Those are different from purchased credits for eligible usage; see the [usage guide](/guides/codex-usage-dashboard-and-shared-limits/).

Free API credits are used before purchased API credits. If the free balance runs out, requests may use a purchased API balance; if no credits remain, the API returns HTTP 429 with `credit_balance_exhausted`. Check your linked organization and balances before sending requests. This is an account benefit, not a reset.
