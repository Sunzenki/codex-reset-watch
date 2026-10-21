---
{
  "id": "tibo-day-12",
  "slug": "tibo-day-12-effective-usage",
  "title": "Tibo's Day 12｜重複使用子代理上下文，讓 Codex 用量更有效",
  "summary": "Codex 與 Work 透過共享上下文、更長快取及路由最佳化減少重複處理；實際收益取決於任務的重複使用程度。",
  "locale": "zh-TW",
  "category": "updates",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "seriesId": "tibo-28-days",
  "seriesDay": 12,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-16T23:55:11Z",
  "sources": [
    {
      "label": "Tibo：Day 12 有效用量改進",
      "url": "https://x.com/thsottiaux/status/2111244596131111253"
    },
    {
      "label": "評論：個人帳號的用量體驗",
      "url": "https://x.com/integer_32/status/2111245338178887696"
    },
    {
      "label": "Tibo 回覆：同日 GPT-6 Pro 更新",
      "url": "https://x.com/thsottiaux/status/2111244957851984181"
    }
  ]
}
---

[Day 12 公告](https://x.com/thsottiaux/status/2111244596131111253)介紹了 Codex 與 Work 的三項效率改進：重複使用子代理之間的上下文、延長快取，以及改進請求路由來增加快取命中。

## 收益來自減少重複處理

多個子代理處理同一個專案時，可能反覆帶入相同指令和背景。重複使用這些內容，可以減少重複處理，讓用量更多花在新的任務步驟上。

因此，有大量共同背景的多代理任務更值得關注這類改進。重複內容少、上下文頻繁變化的任務，收益可能不同。公告沒有給出所有帳號統一增加的百分比或新的每週配額數值。

## 為何仍有人覺得用量消耗快

原貼文下的[相關使用者回饋](https://x.com/integer_32/status/2111245338178887696)仍提到，一週配額可能很快用完。這是具體帳號的體感，評論沒有提供完整模型、任務和用量週期條件，無法用來估算平均改善。

想比較自己的變化，可保留相近任務、模型、是否使用子代理，以及用量週期的記錄。不要只比較兩次任務結束時的剩餘百分比。

## 後續可以對照哪一項更新

[Day 16 的快取說明](/zh-TW/guides/tibo-day-16-prompt-caching/)進一步給出 API 的 12 小時選項，以及登入產品恢復舊對話的快取說法。它提供更具體的重複使用條件，但同樣不能直接換算為每個使用者的統一加量倍數。

同一對話串的[Tibo 補充](https://x.com/thsottiaux/status/2111244957851984181)還提到 GPT-6 Pro 的速度、工具和並行代理改進；這是另一項產品範圍，和本篇 Codex 上下文重複使用分別理解。
