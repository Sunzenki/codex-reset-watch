---
{
  "id": "gpt-5-5-codex-retirement-checklist",
  "slug": "gpt-5-5-codex-retirement-checklist",
  "title": "GPT-5.5 已從 Codex 訂閱入口退役，哪些設定需要修改",
  "summary": "10 月 14 日調整針對使用 ChatGPT 登入的 Codex；檢查預設模型、自訂代理和定時任務，API key 對話的範圍另看。",
  "locale": "zh-TW",
  "category": "news",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI：GPT-5.5 退役與遷移說明",
      "url": "https://learn.chatgpt.com/docs/models"
    },
    {
      "label": "OpenAI：ChatGPT 與 Codex 更新日誌",
      "url": "https://learn.chatgpt.com/docs/changelog"
    }
  ]
}
---

使用 ChatGPT 登入 Codex 時，**GPT-5.5 已於 2026 年 10 月 14 日 19:00 UTC 退役**，對應北京時間 10 月 15 日凌晨 3 點。[官方模型說明](https://learn.chatgpt.com/docs/models)給出了替代型號和需要檢查的設定位置。仍在指定 `gpt-5.5` 的舊任務，值得先檢查模型選擇。

## 先看登入方式，再選替代模型

| 使用路徑 | 官方說明與可選方向 |
| --- | --- |
| Plus、Pro、Business、Enterprise、Edu 的 ChatGPT 登入 | 在帳號與用戶端支援時選擇 GPT-6.1 Sol，模型識別碼為 `gpt-6.1-sol` |
| Free、Go 的 ChatGPT 登入 | 桌面版支援時選擇 GPT-6 Luna，模型識別碼為 `gpt-6-luna` |
| OpenAI API 或 Codex 的 API key 對話 | 本次退役不影響這條路徑；可用型號按 API 專案權限判斷 |

Enterprise 與 Edu 的模型開放還受管理員設定影響。設定裡寫入一個名稱，並不會給工作區增加模型權限。

## 不只改目前對話的模型

桌面版可以從輸入框下方的模型控制元件選擇可用型號，CLI 互動對話使用 `/model`。如果目前對話已經正常，但舊任務仍失敗，繼續檢查這些持久設定：

- 工作區預設模型與用戶端儲存的模型選擇。
- 託管設定、自訂代理裡明確指定的 `gpt-5.5`。
- 定時任務、自動化指令碼及啟動引數中的模型名稱。

例如，CLI 啟動引數可以明確使用帳號已獲准的型號：

```sh
codex --model gpt-6.1-sol
```

這個示例只展示型號寫法；Free、Go 或尚未開放 Sol 的工作區，應選擇自身可用的模型。

## 怎樣確認遷移完成

重新開啟受影響的任務，核對實際選中的模型，再用一個小任務檢查能否正常啟動、呼叫所需工具並返回結果。若手動對話正常而自動任務仍報舊型號，優先檢查自動任務儲存的設定，而不是反覆修改同一個對話。

這次需要清理的是已失效的訂閱模型選擇。API key、訂閱身份和工作區權限是三個需要分別核對的條件，保留原有登入路徑更容易定位問題。本文按 2026 年 10 月 21 日讀取的[官方遷移說明與更新記錄](https://learn.chatgpt.com/docs/changelog)整理。
