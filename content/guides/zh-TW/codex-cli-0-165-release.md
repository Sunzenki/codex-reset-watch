---
{
  "id": "codex-cli-0-165-release",
  "slug": "codex-cli-0-165-release",
  "title": "Codex CLI 0.165.0 更新：Terra、工作階段導覽與模型供應商",
  "summary": "0.165.0 加入 GPT-6.1 Terra、工作階段儲存庫篩選和 Vertex AI 供應商，並修復排隊任務及審批設定問題。",
  "locale": "zh-TW",
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

[Codex 0.165.0](https://github.com/openai/codex/releases/tag/rust-v0.165.0)在 2026 年 10 月 29 日核對時標記為 GitHub 最新穩定版。這份發行說明涵蓋 CLI 及相關元件；app-server API 中的功能不等於桌面應用程式已提供相同入口。

## 日常使用有哪些變化

- 模型目錄加入 GPT-6.1 Terra。實際模型存取仍取決於帳戶和用戶端，參見 [Day 22](/zh-TW/guides/tibo-day-22-gpt-6-1-terra/)。
- 工作階段選擇器增加儲存庫篩選，agent 命令中心依目錄分組，便於在關聯 worktree 間尋找工作階段。
- 對支援的模型，預設允許在對話中調整推理強度。
- 內建 Google Cloud Vertex AI 供應商，可使用 `model_provider = "gcp"` 選擇；供應商存取權限和憑證仍需個別設定。
- 新建設定預設啟用 memory v2，並支援匯入外部 agent 記憶。發行說明沒有表示現有設定會自動移轉。

## 值得留意的修復

新終端機工作階段現在會遵循伺服器預設的審批審核設定；中斷任務或切換到 Plan 模式後，排隊訊息不會再讓工作重新啟動。供應商回報模型不存在時，用戶端會停止重試並保留錯誤資訊。

可以執行 `codex --version` 查看本機 CLI 版本。桌面應用程式與其他用戶端的版本和上線時間可能不同；變更現有工作設定前可查看[完整發行說明](https://github.com/openai/codex/releases/tag/rust-v0.165.0)。
