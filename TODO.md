# TODO.md — hugoblog 当前状态与待办

> 读序：本文件（状态）→ `AGENTS.md`（机制与坑）→ `decisions/`（取舍因果）。

## 功能进度

| 功能 | 状态 | 证据 |
| --- | --- | --- |
| PaperMod 站点 | 完成 | `hugo.yml` |
| section JSON feed | 完成 | `layouts/posts/list.json.json` |
| RSS feed | 完成 | `hugo.yml` |
| Pages 自动部署 | 完成 | `.github/workflows/hugo.yaml` |
| 仓库卫生 | 完成 | `.gitignore` |
| README（含写作与发布流程） | 完成 | `README.md` |
| 对外引用修正 | 完成 | `layouts/partials/extend_head.html` |
| 历史文档清理 | 完成 | `AGENTS.md` |
| 界面语言本地化 | 完成 | `hugo.yml` |
| 搜索能搜到文章 | 完成 | `content/posts/first-try.md` |
| 关于页与首页文案 | 未开始 | |
| 顶栏品牌文字 | 未开始 | |
| 导航回主站 | 未开始 | |
| mask-icon 图标 | 搁置 | |
| 换行符统一 | 未开始 | |

## 当前状态

- 线上 `https://sgldbhxs.top/hugoblog/`；无自己的 CNAME，靠用户站下沉路由。
- Hugo 0.147.3（CI 固定）+ PaperMod（submodule 钉 `1cf5327`）；配置两层合并。
- 跟踪文件 109 → 46（`public/` 与 `.hugo_build.lock` 出库，`questions/` 9 篇删除）。
- 界面已中文化：`defaultContentLanguage: zh` 带出「主页 / 文章 / 分钟 / 字 / 目录 / 建议修改」。
- 搜索此前搜不到文章：`first-try.md` 带 `searchHidden: true` 会被搜索索引跳过；已修正，索引现有「First Try」与「关于我」。
- 模板只剩 `archetypes/default.md`（title/date/draft/tags/description）；只有 `--kind post` 才命中的 `post.md` 已删除（其 21 个字段里 12 个与全局 params 同值）。
- 写作到发布全流程已写进 `README.md`（新建 → 插图 → 预览 → 是否上线 → 推送）。
- 仍是英文或占位符的读者可见文字：顶栏 `Home`、首页副标题 `Look here`、关于页的 `your@email.com` 与「一名…」。
- 唯一文章没有正文，显示「0 分钟 / 0 字」；已知 404 只剩 `safari-pinned-tab.svg`（搁置）。

## 下一步

1. 补真实文案——关于页的联系邮箱与简介、首页副标题不再是占位符（需你提供内容）
2. 顶栏品牌文字——`params.label.text` 由 `Home` 改为「主页」或站点名
3. 导航回主站——博客导航里有指向 `https://sgldbhxs.top/` 的链接
4. 空文章处理——`first-try.md` 补正文或删除，页面不再显示「0 分钟 / 0 字」
5. 统一换行符——`git status` 不再出现 CRLF 警告，且 CI 构建产物无差异
6. 全站引用复核——非首页模板里的站内引用也逐一落地检查通过

## 阻塞

- 无
