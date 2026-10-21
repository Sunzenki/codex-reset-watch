---
{
  "id": "tibo-day-16",
  "slug": "tibo-day-16-prompt-caching",
  "title": "Tibo's Day 16｜API 可選 12 小時快取，Codex 恢復舊對話有何變化",
  "summary": "API 新增長時快取選項；Tibo 另說明登入 Codex 與 Work 後恢復舊對話的快取行為，使用條件和費用分別看。",
  "locale": "zh-TW",
  "category": "updates",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "featuredOrder": 2,
  "cover": "/images/guides-tibo-prompt-cache.webp",
  "seriesId": "tibo-28-days",
  "seriesDay": 16,
  "seriesKinds": [
    "feature"
  ],
  "announcedAt": "2026-10-21T01:10:02Z",
  "sources": [
    {
      "label": "Tibo：Day 16 快取說明",
      "url": "https://x.com/thsottiaux/status/2112712984644784534"
    },
    {
      "label": "OpenAI Developers：12 小時 API 快取公告",
      "url": "https://x.com/OpenAIDevs/status/2112603916076781778"
    },
    {
      "label": "OpenAI：Prompt caching 官方文件",
      "url": "https://developers.openai.com/api/docs/guides/prompt-caching"
    },
    {
      "label": "評論：訂閱永久快取疑問",
      "url": "https://x.com/Avery_Jones/status/2112715170200043683"
    }
  ],
  "coverAlt": "API 12 小時提示快取示意：共享上下文寫入快取後被多次請求重複使用。",
  "coverWidth": 1967,
  "coverHeight": 799,
  "bannerCover": "/images/guides-tibo-prompt-cache-banner.webp"
}
---

[Day 16 主貼文](https://x.com/thsottiaux/status/2112712984644784534)介紹了兩件相關但適用範圍不同的事：API 可以選擇 12 小時提示快取；登入使用 Codex 與 Work 時，Tibo 表示會保留快取，讓隔數小時恢復舊對話也能命中。

## API 12 小時快取適合什麼任務

[@OpenAIDevs 公告](https://x.com/OpenAIDevs/status/2112603916076781778)面向一天裡反覆使用相同指令、工具和背景的代理任務：把穩定內容快取更久，後續重複使用時按較低的快取輸入費率讀取。

[官方文件](https://developers.openai.com/api/docs/guides/prompt-caching)要求匹配可重複使用的提示前綴；改變前面的指令、工具等內容可能影響命中。同一個對話識別碼本身不保證命中。

依目前官方文件，這個選項適用於 **Responses API 中的 GPT-5.6 及後續模型**。請求中的設定片段為：

```json
{"prompt_cache_options": {"ttl": "12h"}}
```

`12h` 表示最低快取保留時間。寫入按一般輸入費率的 **2.5 倍**計費，這是寫入的總費率；命中後的讀取按該模型的快取輸入費率計費。最低保留時間也不保證每次請求的延遲都會降低。

上午和下午多次重複使用同一段長指令，通常比只呼叫一次、或不斷改動開頭內容的任務，更值得評估長時快取。比較時把寫入、讀取和未命中的輸入成本一起算，實際價格以[官方快取文件](https://developers.openai.com/api/docs/guides/prompt-caching)為準。這裡是機制分析，未作費用實測。

## 登入 Codex 與 Work 的使用者要設定嗎

Tibo 的說明針對已登入產品中的舊對話恢復，並非要求這些使用者去設定 API 的快取選項。API 和訂閱產品的使用路徑分別處理。

原貼文下[有人追問訂閱快取是否永久](https://x.com/Avery_Jones/status/2112715170200043683)。目前依據是 Tibo 對產品行為的公開說法，長期保留時限、失效條件和各用戶端一致性尚未獨立驗證。快取重複使用也不改變模型上下文視窗或取消正常用量消耗。

## 和第 12 天怎樣銜接

[Day 12](/zh-TW/guides/tibo-day-12-effective-usage/)介紹子代理重複使用、延長快取和路由最佳化，Day 16 給出了更具體的保留選項與舊對話恢復說明。兩天都圍繞減少重複處理，但沒有給所有使用者公佈統一的用量增長倍數。
