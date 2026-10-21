# CRW Tibo 日文章标题前缀本地验收 — 2026-10-22

final result: passed

范围：三语 Day 1–16 的标题前缀与受影响页面。仅本地预览，未提交或部署。此前完整审计与证据范围见 [变更日志](CHANGELOG.md) 和 [采编复查](docs/guides-practical-source-review.md)。

- 英文、简中、繁中共 48 篇日文章统一以 `Tibo's Day {n}` 开头，日号不补零；总目录保留独立名称。只调整标题，正文、来源、日期、状态和 URL 不变。
- 列表、详情 H1、精选、相关阅读和元数据使用源标题；日历格已有 DAY 日号，其正文标题继续省去重复前缀。SEO 校验兼容撇号的两种等价 HTML 转义。
- 浏览器 12 组：三语产品更新列表与 Day 16，在 1440×900 和 374×1050 CSS px 检查；标题显示正确，无横向溢出。记录在忽略的 experiments/guides/title-prefix-layouts.json。
- 已查看中文列表截图 experiments/guides/title-prefix-desktop.png；仅裁去实际视口外画布空白。已刷新保留的中文资讯列表，恢复默认视口，关闭临时核对标签。
- pnpm test:guides 18/18，pnpm build 与 pnpm build:preview 通过；最终 93 页 SEO/HTTP 检查通过，保留 preview/noindex 和真实 404。
- pnpm docs:check 通过（19 份文档、227 个链接），git diff --check 通过。未暂存、提交、推送、部署或发送通知；保留既有用户修改及 social/。
