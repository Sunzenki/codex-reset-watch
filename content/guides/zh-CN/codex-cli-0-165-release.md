---
{
  "id": "codex-cli-0-165-release",
  "slug": "codex-cli-0-165-release",
  "title": "Codex CLI 0.165.0 更新：Terra、会话导航与模型服务商",
  "summary": "0.165.0 加入 GPT-6.1 Terra、会话仓库筛选和 Vertex AI 服务商，并修复排队任务和审批设置问题。",
  "locale": "zh-CN",
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

[Codex 0.165.0](https://github.com/openai/codex/releases/tag/rust-v0.165.0)在 2026 年 10 月 29 日核对时标记为 GitHub 最新稳定版。该发行说明涵盖 CLI 及相关组件；app-server API 中的功能不等于桌面应用已经提供同一入口。

## 日常使用有哪些变化

- 模型目录加入 GPT-6.1 Terra。实际模型访问仍取决于账号和客户端，参见 [Day 22](/zh-CN/guides/tibo-day-22-gpt-6-1-terra/)。
- 会话选择器增加仓库筛选，agent 命令中心按目录分组，便于在关联 worktree 间查找会话。
- 对支持的模型，默认允许在对话中调整推理强度。
- 内置 Google Cloud Vertex AI 服务商，可使用 `model_provider = "gcp"` 选择；服务商访问权限和凭据仍需单独配置。
- 新建配置默认启用 memory v2，并支持导入外部 agent 记忆。发行说明没有称现有配置会自动迁移。

## 值得留意的修复

新终端会话现在会遵循服务器默认的审批审核设置；中断任务或切换到 Plan 模式后，排队消息不会再让工作重新启动。服务商报告模型不存在时，客户端会停止重试并保留错误信息。

可以运行 `codex --version` 查看本机 CLI 版本。桌面应用和其他客户端的版本与上线时间可能不同；改变已有工作配置前可查看[完整发行说明](https://github.com/openai/codex/releases/tag/rust-v0.165.0)。
