---
{
  "id": "chatgpt-pro-business-api-credits",
  "slug": "chatgpt-pro-business-api-credits",
  "title": "ChatGPT Pro 與 Business 贈送 API credits：資格、金額與使用限制",
  "summary": "符合條件的 Pro 與 Business 訂閱可領取 API 贈額。本文整理方案金額、領取資格、到期規則，以及 Codex 不適用的範圍。",
  "locale": "zh-TW",
  "category": "updates",
  "publishedAt": "2026-10-29T08:38:44.182Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI: API credits for ChatGPT subscribers",
      "url": "https://developers.openai.com/api/docs/guides/chatgpt-api-credits"
    },
    {
      "label": "OpenAI Developers: announcement",
      "url": "https://x.com/OpenAIDevs/status/2115583698074755078"
    }
  ]
}
---

[OpenAI 的訂閱權益](https://developers.openai.com/api/docs/guides/chatgpt-api-credits)允許符合條件的付費 ChatGPT Pro 與 Business 使用者，為自己擁有的 API 組織領取 credits。宣傳中的**每月最高 500 美元不代表每位訂閱者都能領取 500 美元**。

| 訂閱 | 每月 API credits |
| --- | --- |
| Pro 100 / 200 / 500 美元方案 | 分別為 100 / 200 / 500 美元 |
| Business Standard | 每個付費 Standard 席位 20 美元 |
| Business Premium | 每個付費 Premium 席位 100 美元 |

Business 贈額由工作區共享，每月每個工作區上限 500 美元。一次預付年費的 Business 工作區會一次收到全年贈額，並在年度帳單週期結束時到期，年週期上限為 6,000 美元。首次發放依目前帳單週期剩餘時間按比例計算；未使用的贈額在帳單週期結束時到期，不會結轉。後續發放以訂閱和權益仍符合條件為前提。

## 誰能領取，入口在哪裡

付費訂閱須已持續生效至少七天，免費試用和贈送訂閱不符合條件。領取者既要擁有 Pro 訂閱或 Business 工作區，也要擁有接收贈額的 API 組織；ChatGPT 與 API 帳戶須使用相同電子郵件。Free、Go、Plus 和 Enterprise 不適用這項權益。

Pro 可在 ChatGPT **設定 → 帳單**尋找 API credits 權益；Business 可進入工作區帳單設定或 Admin Console。選擇並確認接收贈額的 API 組織，也可以從 API Platform 的 Billing 入口開始。選擇前請核對組織：之後更換接收組織需要聯絡支援。使用有效免費贈額不要求預先新增 API 付款方式。

## API 贈額與 Codex 用量是兩回事

贈額可涵蓋符合條件的 API Platform 用量，例如 Responses、Agents、影像生成和內建工具。**它不支援透過 API key 使用 Codex，也不會增加 ChatGPT 或登入狀態下 Codex 的用量限制。**這與購買用於合資格用量的 credits 不同，參見[用量指南](/zh-TW/guides/codex-usage-dashboard-and-shared-limits/)。

免費 API credits 先於已購買的 API credits 消耗。免費餘額用完後，若有已購餘額會繼續使用；若沒有餘額，API 請求會回傳 HTTP 429 和 `credit_balance_exhausted`。使用前應核對所選組織與餘額。這是訂閱權益，不是一次額度重置。
