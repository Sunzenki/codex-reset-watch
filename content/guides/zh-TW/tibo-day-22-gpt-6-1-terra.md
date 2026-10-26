---
{
  "id": "tibo-day-22",
  "slug": "tibo-day-22-gpt-6-1-terra",
  "title": "Tibo's Day 22｜GPT-6.1 Terra 上線 Work、Codex 和 API",
  "summary": "GPT-6.1 Terra 主打寫作、視覺理解和電腦操作。本文整理模型入口、適用方案、與 Sol 的 API 價格對照，以及 Tibo 所說「2 倍用量」的範圍。",
  "locale": "zh-TW",
  "category": "updates",
  "publishedAt": "2026-10-26T19:52:49.058Z",
  "status": "published",
  "seriesId": "tibo-28-days",
  "seriesDay": 22,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-26T19:24:11.000Z",
  "sources": [
    {
      "label": "Tibo：Day 22，Terra 回歸",
      "url": "https://x.com/thsottiaux/status/2114800277677092936"
    },
    {
      "label": "OpenAI：GPT-6.1 Terra 發佈帖",
      "url": "https://x.com/OpenAI/status/2114780711664398349"
    },
    {
      "label": "OpenAI：GPT-6.1 Terra 發佈說明",
      "url": "https://openai.com/index/introducing-gpt-6-1-terra/"
    },
    {
      "label": "Work 與 Codex 更新日誌",
      "url": "https://developers.openai.com/codex/changelog/"
    },
    {
      "label": "Work 與 Codex 模型選擇說明",
      "url": "https://developers.openai.com/codex/models?surface=app"
    },
    {
      "label": "GPT-6.1 Terra API 模型與價格",
      "url": "https://developers.openai.com/api/docs/models/gpt-6.1-terra"
    },
    {
      "label": "GPT-6.1 Sol API 模型與價格",
      "url": "https://developers.openai.com/api/docs/models/gpt-6.1-sol"
    }
  ]
}
---

GPT-6.1 Terra 已上線 ChatGPT Work、Codex 和 API。[Tibo 的 Day 22 原帖](https://x.com/thsottiaux/status/2114800277677092936)強調寫作、對請求細節的理解以及電腦操作能力，並表示在 API 和訂閱中，相比 GPT-6.1 Sol 可以獲得 2 倍用量。

## 寫作、看圖與日常應用操作

[OpenAI 發佈說明](https://openai.com/index/introducing-gpt-6-1-terra/)將 Terra 定位為速度更快、成本更低的視覺推理、電腦操作和自然寫作模型。對應到具體工作，可以用來理解截圖、將商品圖片與目錄項目配對，或起草和修改文件。

這些能力描述來自 OpenAI，本站尚未對模型進行基準測試。官方仍將 GPT-6.1 Sol 和 GPT-6 Astra 列為最複雜程式設計任務的更好選擇。Terra 為日常工作增加了一個更省用量的選項，複雜任務仍需按能力需求選擇模型。

## 在哪裡選擇 Terra

[10 月 26 日 Work 與 Codex 更新日誌](https://developers.openai.com/codex/changelog/)列出的方案包括 **Plus、Pro、Business、Enterprise 和 Edu**。在 ChatGPT 桌面應用程式或網頁版 Work 中，開啟 **Advanced**，再從模型清單選擇 **GPT-6.1 Terra**；行動版 Work 也支援。這裡的可用範圍是 Work 和 Codex，日誌明確說明一般 Chat 中尚不可用。Enterprise 還受工作區開放情況和管理員設定影響，暫不支援 UAE 推論駐留。

[模型選擇文件](https://developers.openai.com/codex/models?surface=app)說明，可見選項隨方案、用戶端、工作區設定和推出進度而異；電腦操作還需要對應工具與存取權限。API 使用模型 ID **gpt-6.1-terra**，[API 模型頁](https://developers.openai.com/api/docs/models/gpt-6.1-terra)註明工具呼叫需要使用 Responses API。

## 「2 倍用量」具體指什麼

Tibo 的比較對象是 **GPT-6.1 Sol**。OpenAI 對訂閱收益的解釋是，同一份 Work 或 Codex 額度可以完成更多工作。這是模型用量效率的對照，不能據此推導所有方案額度永久翻倍，或已經發放了一次重置；任務長度、推理和工具使用仍會影響消耗。

API 方面，[Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra)下列 Standard token 單價均為 [Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol)的一半，單位為**美元／每百萬 token**：

| 模型 | 輸入 | 快取讀取 | 輸出 |
| --- | --- | --- | --- |
| GPT-6.1 Terra | $1.00 | $0.05 | $5.00 |
| GPT-6.1 Sol | $2.00 | $0.10 | $10.00 |

快取讀取與寫入分開計價。Terra 快取寫入的每百萬 token 價格為：保留 30 分鐘 $1.25，保留 12 小時 $2.50。輸入超過 **272K token** 時，兩款模型都對**整個請求**按輸入及快取費率 2 倍、輸出費率 1.5 倍計費。工具費用、速度模式和區域處理還可能改變總價，表格只列 Standard token 基礎價格，不能直接換算為每項任務固定省一半。

## Day 22 歸在美西 10 月 26 日

[OpenAI 發佈帖](https://x.com/OpenAI/status/2114780711664398349)發佈於**台北時間 10 月 27 日 02:06:27**（UTC 10 月 26 日 18:06:27），Tibo 原帖則為 **03:24:11**（UTC 19:24:11）。[系列日曆](/zh-TW/guides/tibo-28-day-plan/)按美西日期將 Day 22 歸到 10 月 26 日，現已整理 **22/28 天**，其中 13 個功能日、11 個重置相關日；先前的 [Day 21 額度重置](/zh-TW/guides/tibo-day-21-reset-landed/)保留為獨立事件。
