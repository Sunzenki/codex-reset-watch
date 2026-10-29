---
{
  "id": "chatgpt-pro-business-api-credits",
  "slug": "chatgpt-pro-business-api-credits",
  "title": "ChatGPT Pro 和 Business 赠送 API credits：资格、金额与使用限制",
  "summary": "符合条件的 Pro 与 Business 订阅可领取 API 赠额。本文梳理套餐金额、领取资格、到期规则，以及 Codex 不适用的边界。",
  "locale": "zh-CN",
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

[OpenAI 的订阅权益](https://developers.openai.com/api/docs/guides/chatgpt-api-credits)允许符合条件的付费 ChatGPT Pro 和 Business 用户，为自己拥有的 API 组织领取 credits。宣传中的**每月最高 500 美元不是每位订阅者都能领取 500 美元**。

| 订阅 | 每月 API credits |
| --- | --- |
| Pro 100 / 200 / 500 美元档 | 分别为 100 / 200 / 500 美元 |
| Business Standard | 每个付费 Standard 席位 20 美元 |
| Business Premium | 每个付费 Premium 席位 100 美元 |

Business 赠额由工作区共享，每月每个工作区上限 500 美元。一次性预付年费的 Business 工作区会一次收到全年赠额，并在年度账单周期结束时过期，年周期上限为 6,000 美元。首次发放按当前账单周期剩余时间折算；未使用的赠额在账单周期结束时过期，不结转。后续发放以订阅和权益仍符合条件为前提。

## 谁能领取，入口在哪里

付费订阅须已持续生效至少七天，免费试用和赠送订阅不符合条件。领取人既要拥有 Pro 订阅或 Business 工作区，也要拥有接收赠额的 API 组织；ChatGPT 与 API 账号须使用相同邮箱。Free、Go、Plus 和 Enterprise 不适用这项权益。

Pro 可在 ChatGPT **设置 → 账单**查找 API credits 权益；Business 可进入工作区账单设置或 Admin Console。选择并确认接收赠额的 API 组织，也可以从 API Platform 的 Billing 入口开始。选择前请核对组织：之后更换接收组织需要联系支持。使用有效免费赠额不要求预先添加 API 支付方式。

## API 赠额与 Codex 用量是两回事

赠额可覆盖符合条件的 API Platform 用量，例如 Responses、Agents、图像生成和内置工具。**它不支持通过 API key 使用 Codex，也不会增加 ChatGPT 或登录状态下 Codex 的用量限制。**这与购买用于合资格用量的 credits 不同，参见[用量指南](/zh-CN/guides/codex-usage-dashboard-and-shared-limits/)。

免费 API credits 先于已购买的 API credits 消耗。免费余额用完后，若有已购余额会继续使用；若没有余额，API 请求会返回 HTTP 429 和 `credit_balance_exhausted`。使用前应核对所选组织与余额。这是订阅权益，不是一次额度重置。
