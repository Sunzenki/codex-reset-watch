---
{
  "id": "gpt-5-5-codex-retirement-checklist",
  "slug": "gpt-5-5-codex-retirement-checklist",
  "title": "GPT-5.5 已从 Codex 订阅入口退役，哪些配置需要改",
  "summary": "10 月 14 日调整针对使用 ChatGPT 登录的 Codex；检查默认模型、自定义代理和定时任务，API key 会话的范围另看。",
  "locale": "zh-CN",
  "category": "news",
  "publishedAt": "2026-10-21T20:51:53Z",
  "status": "published",
  "sources": [
    {
      "label": "OpenAI：GPT-5.5 退役与迁移说明",
      "url": "https://learn.chatgpt.com/docs/models"
    },
    {
      "label": "OpenAI：ChatGPT 与 Codex 更新日志",
      "url": "https://learn.chatgpt.com/docs/changelog"
    }
  ]
}
---

使用 ChatGPT 登录 Codex 时，**GPT-5.5 已于 2026 年 10 月 14 日 19:00 UTC 退役**，对应北京时间 10 月 15 日凌晨 3 点。[官方模型说明](https://learn.chatgpt.com/docs/models)给出了替代型号和需要检查的配置位置。仍在指定 `gpt-5.5` 的旧任务，值得先检查模型选择。

## 先看登录方式，再选替代模型

| 使用路径 | 官方说明与可选方向 |
| --- | --- |
| Plus、Pro、Business、Enterprise、Edu 的 ChatGPT 登录 | 在账号与客户端支持时选择 GPT-6.1 Sol，模型标识为 `gpt-6.1-sol` |
| Free、Go 的 ChatGPT 登录 | 桌面端支持时选择 GPT-6 Luna，模型标识为 `gpt-6-luna` |
| OpenAI API 或 Codex 的 API key 会话 | 本次退役不影响这条路径；可用型号按 API 项目权限判断 |

Enterprise 与 Edu 的模型开放还受管理员设置影响。配置里写入一个名称，并不会给工作区增加模型权限。

## 不只改当前对话的模型

桌面端可以从输入框下方的模型控件选择可用型号，CLI 交互会话使用 `/model`。如果当前对话已经正常，但旧任务仍失败，继续检查这些持久设置：

- 工作区默认模型与客户端保存的模型选择。
- 托管配置、自定义代理里明确指定的 `gpt-5.5`。
- 定时任务、自动化脚本及启动参数中的模型名称。

例如，CLI 启动参数可以明确使用账号已获准的型号：

```sh
codex --model gpt-6.1-sol
```

这个示例只展示型号写法；Free、Go 或尚未开放 Sol 的工作区，应选择自身可用的模型。

## 怎样确认迁移完成

重新打开受影响的任务，核对实际选中的模型，再用一个小任务检查能否正常启动、调用所需工具并返回结果。若手动对话正常而自动任务仍报旧型号，优先检查自动任务保存的配置，而不是反复修改同一个对话。

这次需要清理的是已失效的订阅模型选择。API key、订阅身份和工作区权限是三个需要分别核对的条件，保留原有登录路径更容易定位问题。本文按 2026 年 10 月 21 日读取的[官方迁移说明与更新记录](https://learn.chatgpt.com/docs/changelog)整理。
