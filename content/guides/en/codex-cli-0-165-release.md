---
{
  "id": "codex-cli-0-165-release",
  "slug": "codex-cli-0-165-release",
  "title": "Codex CLI 0.165.0: Terra, session navigation and provider updates",
  "summary": "The 0.165.0 release adds GPT-6.1 Terra, a session repository filter and a built-in Vertex AI provider, alongside fixes for queued work and approvals.",
  "locale": "en",
  "category": "updates",
  "publishedAt": "2026-10-29T08:38:44.182Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI Codex: 0.165.0 release",
      "url": "https://github.com/openai/codex/releases/tag/rust-v0.165.0"
    }
  ]
}
---

[Codex 0.165.0](https://github.com/openai/codex/releases/tag/rust-v0.165.0) is marked as the latest stable GitHub release when checked on October 29, 2026. Its release notes cover the CLI and related components; a feature in the app-server API is not automatically a desktop-app feature.

## Changes for daily work

- The model catalog adds GPT-6.1 Terra. Model access still depends on the account and client; see [Day 22](/guides/tibo-day-22-gpt-6-1-terra/).
- The session picker adds a repository filter, and the agent command center groups sessions by directory. This helps locate work across linked worktrees.
- Changing reasoning effort during a conversation is enabled by default for supported models.
- A built-in Google Cloud Vertex AI provider can be selected with `model_provider = "gcp"`; provider access and credentials still need to be configured separately.
- Memory v2 is enabled by default for fresh profiles, with support for importing external-agent memories. The release does not say existing profiles are automatically migrated.

## Fixes worth knowing

The release fixes fresh terminal sessions ignoring the server’s default approval reviewer, and prevents queued agent messages from restarting work after an interruption or a switch to Plan mode. Provider “model not found” errors stop retrying and preserve the error message.

Run `codex --version` to check the CLI installed on your machine. Release availability and version numbers can differ for the desktop app and other clients; check the [release notes](https://github.com/openai/codex/releases/tag/rust-v0.165.0) for details before changing a working setup.
