# Codex Reset Watch

CRW 是 WarpNav 制作的非官方、人工整理的 Codex 额度重置信息站：展示公开预告、完成确认、时间换算和历史记录，并提供浏览器提醒。正式站：[crw.warpnav.com](https://crw.warpnav.com/)。不自动抓取 X，不根据历史间隔预测下一次重置。

协作从 [AGENTS.md](AGENTS.md) 开始，当前工作和发布阶段见 [CHANGELOG.md](CHANGELOG.md) 的“未发布”。文档描述仓库维护方式；是否已上线需看部署证据。

## 文档入口

| 文档 | 职责 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | 执行规则、任务路由、按范围验证与交付要求 |
| [PROJECT-MAINTENANCE-GUIDE.md](PROJECT-MAINTENANCE-GUIDE.md) | 架构、产品边界、维护流程与索引 |
| [DESIGN.md](DESIGN.md) | 当前手账视觉规范 |
| [内容与数据](docs/content-and-data.md) | 来源、时区、JSON、三语言、日历和 SEO |
| [资讯指南](docs/guides.md) | Markdown 文章、置顶/精选、译文与预览隔离 |
| [资讯编辑与发布规则](docs/guides-editorial-policy.md) | 选题、来源核验、Google SEO、E-E-A-T、文风与常规文章发布授权 |
| [推送操作](docs/push-operations.md) | 订阅状态、后台、失败原因和人工发送 |
| [部署与排障](docs/deployment-troubleshooting.md) | 预览、构建、Git、Cloudflare、缓存和统计 |
| [CHANGELOG.md](CHANGELOG.md) | 完整改动及提交、部署、验证、通知状态 |
| [design-qa.md](design-qa.md) | 最近一次本地视觉验收及局限，非上线证明 |

上一阶段交接：[2026-10-15 至 16 改版成果与下一阶段计划](docs/history/2026年10月15日至16日-改版成果与下一阶段推进报告.md)。当前资讯栏目与网站发布状态见 CHANGELOG。

历史方案和事故纪要由主手册链接，只供追溯。

## 本地开发

Node 版本要求和脚本以 [package.json](package.json) 为准，使用 pnpm：

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

英文首页 `/`、历史页 `/history/`；简繁中文分别为 `/zh-CN/`、`/zh-TW/`，各有 `/history/`。旧 `/en/` 和 `/en/history/` 仅保留永久重定向。

资讯栏目本地预览：`pnpm build:preview` 后运行 `pnpm preview`，访问 `/zh-CN/guides/`。正式构建 `pnpm build` 排除预览稿和草稿；旧版式示例已移除，当前为 Tibo 系列加四篇实用稿共 21 个选题，英/简/繁各 21 篇，共 63 个正式稿文件（published）；本次首次发布与线上验证状态见 CHANGELOG。八篇分页、置顶、精选轮播、系列目录与新增文章见 [资讯指南维护](docs/guides.md)。

Vite 开发/静态预览不运行 `/api/push/*`。本地与正式站订阅分别属于不同 origin；完整 Functions 环境按推送和部署手册准备。

## 按范围检查

```sh
pnpm docs:check       # 文档文件、相对链接和忽略规则
pnpm test:docs        # 文档检查器的离线回归测试
pnpm test:guides      # Markdown、置顶排序、示例/草稿隔离
pnpm check:guides-seo # 构建后检查资讯静态分页、文章和索引输出
pnpm test:push-state  # 提醒状态与订阅登记回滚，无真实推送
pnpm test:push        # Web Push 报文离线检查，无真实推送
```

纯文档修改运行文档检查；改动检查器时增加它的回归测试。应用和数据修改运行 `pnpm build`，其他专项验证由对应手册说明。

`pnpm build` 验证数据与六页 SEO，完成 TypeScript/Vite 构建，并生成静态快照、JSON-LD、sitemap、robots、llms.txt 和 ads.txt。`dist` 不提交 Git。

内容更新同步 JSON 与受影响三语言文案；每次完整改动同步对应文档和变更日志。UI 先提供本地预览，发布按用户授权执行，部署与真实通知发送分别记录。
