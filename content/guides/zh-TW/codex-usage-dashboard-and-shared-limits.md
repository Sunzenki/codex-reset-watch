---
{
  "id": "codex-usage-dashboard-and-shared-limits",
  "slug": "codex-usage-dashboard-and-shared-limits",
  "title": "Codex 配額在哪裡看：用量週期、共享用量與額外 credits",
  "summary": "從用量面板和 CLI /status 看自己的限制；分清目前方案週期、Work 共享用量，以及 API key 的獨立計費路徑。",
  "locale": "zh-TW",
  "category": "tutorials",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI：用量、方案與共享配額說明",
      "url": "https://learn.chatgpt.com/docs/pricing"
    },
    {
      "label": "Codex：帳號用量面板",
      "url": "https://chatgpt.com/codex/settings/usage"
    }
  ]
}
---

想知道 Codex 還能用多少、何時恢復，先開啟[帳號用量面板](https://chatgpt.com/codex/settings/usage)，或在正在使用的 CLI 工作階段輸入 `/status`。[官方用量說明](https://learn.chatgpt.com/docs/pricing)把它們列為查詢目前限制和重置時間的入口。本文按 2026 年 10 月 21 日的文件整理。

## 先核對帳號、用量週期和時區

確認登入的是實際執行任務的帳號及工作區，再記錄頁面顯示的週期名稱、剩餘量和恢復時間。截圖要保留時間與時區，方便前後對照；不要只截一個百分比。

目前官方文件的五小時訊息區間用於 **Plus 與 Standard Business**，同時說明 **Pro 目前沒有五小時限制**；部分用量仍可能受每週上限約束。自己看到的用量週期應以目前帳號面板為準，不能把某個方案截圖套到所有帳號。

## 哪些操作可能用同一份配額

官方說明，**ChatGPT Work 與 Codex 共享用量**，本地訊息與雲端任務也共享方案用量。任務使用的模型、上下文、推理、工具和快取都會影響消耗；訊息數量相同，實際用量也可能不同。

因此，在比較兩個任務之前，至少記下模型、速度檔位、任務範圍，以及這段時間是否還有其他 Work 或 Codex 任務在執行。這個記錄方法有助於解釋自己的變化，不能據此估算所有人的統一可用次數。

## 配額用完後的三種路徑

| 路徑 | 需要看什麼 |
| --- | --- |
| 等待方案週期恢復 | 帳號面板給出的目前限制與恢復時間 |
| 使用額外 credits | 方案是否支援、帳號或工作區的可用餘額與管理設定 |
| 使用 API key 繼續本地任務 | API 專案權限、配額和單獨計費；按 API 價格計算 |

credits 和 API key 都涉及各自的計費規則。評估之前先確認你準備使用哪條路徑；訂閱裡的剩餘百分比不能直接換算成 API 餘額。本文提供核對入口，不代替帳號購買或修改工作區預算。

## 為下一次比較留下可用記錄

用同一類小任務觀察一段時間：保留開始與結束的用量截圖、模型、速度檔位和同時執行的任務。不要為了比較而反覆重跑昂貴任務，也無需貼出 API key 或完整私人對話。

如果出現的是連線失敗或服務報錯，接著按[具體狀態事件](/zh-TW/guides/openai-2026-10-21-service-degradation/)中的元件與時間排查。把用量記錄和錯誤原文放在一起，比單看“今天掉得快”更容易找到原因。
