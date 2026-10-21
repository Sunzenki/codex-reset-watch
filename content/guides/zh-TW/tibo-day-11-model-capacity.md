---
{
  "id": "tibo-day-11",
  "slug": "tibo-day-11-model-capacity",
  "title": "Tibo's Day 11｜減少 model at capacity 中斷，擁塞後可自行繼續",
  "summary": "更新針對模型滿載造成的任務阻塞：降低提示出現頻率，並改善擁塞後的繼續行為，未給出固定恢復時長。",
  "locale": "zh-TW",
  "category": "updates",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "seriesId": "tibo-28-days",
  "seriesDay": 11,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-15T15:11:30Z",
  "sources": [
    {
      "label": "Tibo：Day 11 容量與自動繼續說明",
      "url": "https://x.com/thsottiaux/status/2110750421367287996"
    },
    {
      "label": "OpenAI Status",
      "url": "https://status.openai.com/"
    }
  ]
}
---

長任務被 **Selected model is at capacity. Please try a different model** 卡住，是[Day 11 更新](https://x.com/thsottiaux/status/2110750421367287996)針對的問題。Tibo 稱，一系列修改和新增算力已顯著降低這類提示的出現頻率；再次遇到時，任務也應能隨後自行繼續。

## 觀察兩種變化

一是模型滿載提示是否更少，二是遇到提示後，任務能否恢復推進。公告保留了“應該會繼續”的表述，沒有給出固定等待時長。

這對需要持續執行、無法一直守著任務的使用者尤其相關。主貼文還邀請仍遇到問題的使用者回饋，說明這項改善需要結合具體執行情況觀察。

## 先區分容量問題與用量耗盡

模型滿載提示指向服務容量，帳號的方案用量耗盡則是另一類限制。此次改動針對前者，沒有宣佈取消配額週期。

排查時先保留準確錯誤文字、模型和出現時間。如果懷疑是較廣泛的故障，可檢視 [OpenAI Status 的具體事件](https://status.openai.com/)，再與受影響元件和時段對照；這篇歷史更新不代表目前服務狀態。
