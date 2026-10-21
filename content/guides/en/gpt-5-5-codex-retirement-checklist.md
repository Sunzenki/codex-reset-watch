---
{
  "id": "gpt-5-5-codex-retirement-checklist",
  "slug": "gpt-5-5-codex-retirement-checklist",
  "title": "GPT-5.5 retirement in Codex: check saved model settings",
  "summary": "The October 14 change affects ChatGPT sign-in. Check workspace defaults, custom agents and scheduled tasks; API-key sessions have a different scope.",
  "locale": "en",
  "category": "news",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI: GPT-5.5 retirement and migration",
      "url": "https://learn.chatgpt.com/docs/models"
    },
    {
      "label": "OpenAI: ChatGPT and Codex changelog",
      "url": "https://learn.chatgpt.com/docs/changelog"
    }
  ]
}
---

**GPT-5.5 retired from Codex with ChatGPT sign-in on October 14, 2026, at 19:00 UTC**—noon Pacific daylight time. The [official model guide](https://learn.chatgpt.com/docs/models) lists replacements and settings to review. A saved task that still selects `gpt-5.5` may need a model change.

## Match the replacement to your sign-in method

| Access path | Official scope and replacement |
| --- | --- |
| ChatGPT sign-in on Plus, Pro, Business, Enterprise or Edu | Choose GPT-6.1 Sol (`gpt-6.1-sol`) when available to your account and client |
| ChatGPT sign-in on Free or Go | Choose GPT-6 Luna (`gpt-6-luna`) in the desktop app when available |
| OpenAI API or an API-key-authenticated Codex session | This retirement does not affect this path; model access follows the API project |

Enterprise and Edu availability also depends on administrator settings. Entering a model identifier does not grant workspace access to it.

## Check settings beyond the current conversation

Use the model control below the desktop composer, or `/model` in an interactive CLI session. If a new chat works but an older task still fails, inspect persistent choices:

- Workspace defaults and saved client model selections.
- Managed configuration and custom agents that name `gpt-5.5`.
- Scheduled tasks, automation scripts and launch arguments that specify a model.

A CLI launch can explicitly select a model your account already supports:

```sh
codex --model gpt-6.1-sol
```

This illustrates the identifier. Free, Go and workspaces without Sol access need an available alternative.

## Verify the saved task too

Reopen the affected task, confirm the selected model, and try a small task that exercises the tools you need. If interactive use succeeds while an automation still reports the retired model, inspect that automation's saved settings first.

Keep sign-in method, subscription access and workspace permissions separate when diagnosing the failure. This guide reflects the [official migration notice and changelog](https://learn.chatgpt.com/docs/changelog) checked on October 21, 2026.
