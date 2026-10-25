---
{
  "id": "tibo-day-19",
  "slug": "tibo-day-19-small-updates",
  "title": "Tibo's Day 19｜dot 通話更快，切換推理強度保留快取，CLI 更新",
  "summary": "Day 19 改善了 dot 通話連線速度，Codex / Work 對話中切換推理強度不再使快取失效。作者還補充了 CLI 更新，相關改動可與 0.164.0 正式說明核對。",
  "locale": "zh-TW",
  "category": "updates",
  "publishedAt": "2026-10-25T04:07:41.776Z",
  "status": "published",
  "seriesId": "tibo-28-days",
  "seriesDay": 19,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-23T23:12:31.000Z",
  "sources": [
    {
      "label": "Tibo：Day 19 更新",
      "url": "https://x.com/thsottiaux/status/2113770573994299544"
    },
    {
      "label": "Tibo：CLI 更新詳情",
      "url": "https://x.com/thsottiaux/status/2113770862860222611"
    },
    {
      "label": "OpenAI：Codex CLI 0.164.0 發佈說明",
      "url": "https://github.com/openai/codex/releases/tag/rust-v0.164.0"
    }
  ]
}
---

Day 19 是三項日常使用改進：dot 通話連線更快、Codex / Work 對話中切換推理強度不再使快取失效，以及 Codex CLI 更新。[Tibo 主帖](https://x.com/thsottiaux/status/2113770573994299544)發佈於台北時間 10 月 24 日 07:12:31，對應美西 10 月 23 日，因此系列仍歸在 10 月 23 日。

## 切換推理強度時保留快取

Tibo 表示，在 Codex 和 Work 的同一段對話中調整 reasoning，不再讓快取失效。一個任務從常規處理進入複雜判斷時，使用者可以調整推理強度，這次變化消除了原帖所指的快取失效問題。

原帖沒有給出節省額度的比例，也沒有逐項列明模型和用戶端版本；不能據此認定任意切換模型也能保留快取。[Day 16](/zh-TW/guides/tibo-day-16-prompt-caching/)說的是 API 可選的 12 小時提示快取，Day 19 說的是對話中調整推理強度對快取的影響，兩者對應不同的重用條件。

## CLI 具體更新了什麼

Tibo 在台北時間 07:13:40 的[補充回覆](https://x.com/thsottiaux/status/2113770862860222611)中列出提示詞預設、行內模型與權限設定、企業 MCP 登入、長對話恢復修復，以及 Windows 企業代理認證。這些項目也能在 [0.164.0 正式發佈說明](https://github.com/openai/codex/releases/tag/rust-v0.164.0)中找到。

| 改動 | 對使用的影響 |
| --- | --- |
| 提示詞預設 | 透過 /presets 的編號位置重用常用指令。 |
| 行內設定 | 用命令參數調整模型、推理、速度或權限。 |
| 企業 MCP 認證 | 登入受支援的企業 MCP 連線。 |
| 對話恢復 | 找回已壓縮的歷史，並恢復儲存的對話設定。 |
| Windows 代理支援 | 使用目前 Windows 使用者身分處理企業代理認證。 |

核對行為前，可以執行 `codex --version` 查看本機版本，再與這份發佈說明比較。這些是 CLI 改動，原帖沒有說明所有桌面介面也新增了相同控制項。

## dot 通話連線更快

另一項改進是呼叫 dot 時更快接通。Tibo 沒有提供具體耗時、測速條件或地區清單，本站因此只記錄這項已宣布的改進，不給出加速倍數，也不將其寫成本站實測。

Day 19 主帖講的是功能與穩定性，沒有新增重置預告。下一天的 [Day 20 重置](/zh-TW/guides/tibo-day-20-reset-announced/)單獨記錄；[28 天目錄](/zh-TW/guides/tibo-28-day-plan/)保留每日日期與原始來源。
