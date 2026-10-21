---
{
  "id": "openai-2026-10-21-service-degradation",
  "slug": "openai-2026-10-21-service-degradation",
  "title": "10 月 21 日 Codex、ChatGPT 與 API 服務降級已恢復",
  "summary": "官方在 03:28 UTC 確認恢復；按受影響元件與通報時間對照這次故障，保留任務記錄後再核對重試結果。",
  "locale": "zh-TW",
  "category": "incidents",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI Status：本次服務降級事件",
      "url": "https://status.openai.com/incidents/01M5E4G39TD1BW1QWHZG6RFA5H"
    },
    {
      "label": "OpenAI Status：事件歷史",
      "url": "https://status.openai.com/history"
    }
  ]
}
---

**本次事件已恢復。** [OpenAI Status 的事件記錄](https://status.openai.com/incidents/01M5E4G39TD1BW1QWHZG6RFA5H)在 2026 年 10 月 21 日 **03:28 UTC（北京時間 11:28）**標為 Resolved，說明所有受影響服務已恢復。本文記錄這一次事件，截至 10 月 21 日 15:24 UTC 核對。

## 哪些服務被列入影響範圍

事件同時列出 ChatGPT、Codex 和 API 元件。與 Codex 使用者直接相關的有 **Codex Web、Codex API、CLI**，以及 ChatGPT 分組中的 **Work 和桌面版 Codex**。API 分組還包含 Responses、Chat Completions、Agents 等元件。

這個範圍便於核對同一時段的異常：先找自己使用的入口，再對應錯誤發生時間。狀態頁的元件列表表示官方報告的影響範圍，個人帳號的失敗還需要結合自己的請求記錄判斷。

## 官方通報時間線

| 進展 | 2026-10-21 UTC | 北京時間 |
| --- | --- | --- |
| Investigating：開始調查已列服務的問題 | 02:26:28 | 10:26:28 |
| Monitoring：已採取緩解措施並觀察恢復 | 02:48 | 10:48 |
| Resolved：確認受影響服務恢復 | 03:28 | 11:28 |

表格使用官方事件資料中的通報時間。狀態網頁會按訪問環境顯示當地時刻，所以同一節點在截圖裡可能落在美西 10 月 20 日；對應的是同一次事件。目前記錄未給出根因分析或補償安排。

## 恢復之後，任務仍失敗怎麼辦

先保留錯誤原文、用戶端、模型、登入方式和帶時區的發生時間。對於已經執行到寫檔案、發請求等階段的任務，先檢查已有結果，再決定從哪裡繼續，避免重複操作。

之後用一個範圍較小的請求確認目前入口能否工作。若新請求正常、舊任務仍失敗，重點記錄恢復舊任務時的具體步驟；若多個入口都異常，再檢視[狀態頁的新事件](https://status.openai.com/history)，不要將後續問題全部歸入這一次已恢復事件。

`429`、連線錯誤、模型容量不足和帳號配額不足，需要保留準確錯誤內容後分別排查。關於帳號用量入口，可以繼續看[Codex 配額檢視方法](/zh-TW/guides/codex-usage-dashboard-and-shared-limits/)。
