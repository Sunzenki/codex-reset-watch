---
{
  "id": "codex-cli-0-163-practical-changes",
  "slug": "codex-cli-0-163-practical-changes",
  "title": "Codex CLI 0.163.0: searchable settings and practical fixes",
  "summary": "Find settings with /config, steer an active response, and review fixes for resumed sessions, Windows paste and WSL clipboard handling.",
  "locale": "en",
  "category": "updates",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI Codex: 0.163.0 release notes",
      "url": "https://github.com/openai/codex/releases/tag/rust-v0.163.0"
    },
    {
      "label": "OpenAI: CLI 0.163.0 changelog",
      "url": "https://learn.chatgpt.com/docs/changelog"
    }
  ]
}
---

[Codex CLI 0.163.0](https://github.com/openai/codex/releases/tag/rust-v0.163.0) was released on October 15, 2026. Frequent terminal users should look at settings search, follow-up messages during a response, and fixes involving resumed sessions and clipboard operations.

## Find settings with /config

In an interactive session, `/config` searches preferences across categories, lets you change supported settings immediately, and identifies changes that require a restart. It gives you a place to check available controls before guessing configuration keys.

Run `codex --version` to identify the CLI installation you use. The desktop application's version is a separate check; these CLI notes do not establish which changes a particular desktop build includes.

## Correct an active task sooner

This release lets you send a follow-up while Codex is responding to steer it immediately. For example, you can narrow work to the login module after noticing that the scope is too broad. Interrupting a turn also stops active Code Mode cells and nested tool calls.

Review changes already written to disk before deciding what to do next. An interruption can limit further unwanted work, but checking existing results remains part of the workflow.

## Resumed sessions and clipboard fixes

| Situation | What the release notes say |
| --- | --- |
| Resume a saved thread | Restore permissions and network approvals while respecting explicit overrides and current managed policy |
| Paste on Windows | `Ctrl+V` and `Shift+Insert` handle text as well as images |
| Repeated paste or copy on WSL | Reuse the clipboard reader and time out copy attempts instead of hanging |
| A child process keeps an output pipe open | Improve local command completion and retain late remote output for the final poll |

If one of these matches your problem, repeat the original operation after updating, using the same terminal and project. These are release-note claims; CRW has not reproduced every fix.

## Make the comparison useful

Keep the version, operating system, launch method and shortest reproduction steps. If a new session works but a resumed session fails, include that distinction in a report rather than only describing Codex as stuck.

The [official release page](https://github.com/openai/codex/releases/tag/rust-v0.163.0) contains the full scope. This article covers CLI 0.163.0, rather than assigning a common version to every Codex client.
