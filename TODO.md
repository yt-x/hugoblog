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
| README | 完成 | `README.md` |
| 对外引用修正 | 完成 | `layouts/partials/extend_head.html` |
| 历史文档清理 | 完成 | `AGENTS.md` |
| 界面语言本地化 | 完成 | `hugo.yml` |
| 关于页与首页文案 | 未开始 | |
| 顶栏品牌文字 | 未开始 | |
| 导航回主站 | 未开始 | |
| mask-icon 图标 | 搁置 | |
| 换行符统一 | 未开始 | |

## 当前状态

- 线上 `https://sgldbhxs.top/hugoblog/`；没有自己的 CNAME，靠用户站自定义域名下沉路由。
- Hugo 0.147.3（CI 固定）+ PaperMod（submodule 钉 `1cf5327`）；配置两层合并。
- 跟踪文件 109 → 45：`public/` 与 `.hugo_build.lock` 出库，`questions/` 的 9 篇已删。
- 界面已中文化：`defaultContentLanguage: zh` 带出「主页 / 文章 / 分钟 / 字 / 目录 / 建议修改」。
- 仍是英文或占位符的读者可见文字：顶栏 `Home`、首页副标题 `Look here`、关于页的 `your@email.com` 与「一名…」。
- 唯一文章 `first-try.md` 没有正文，列表与详情都显示「0 分钟 / 0 字」；已知 404 只剩 `safari-pinned-tab.svg`（搁置）。

## 下一步

1. 补真实文案——关于页的联系邮箱与简介、首页副标题不再是占位符（需你提供内容）
2. 顶栏品牌文字——`params.label.text` 由 `Home` 改为「主页」或站点名
3. 导航回主站——博客导航里有指向 `https://sgldbhxs.top/` 的链接
4. 空文章处理——`first-try.md` 补正文或删除，页面不再显示「0 分钟 / 0 字」
5. 统一换行符——`git status` 不再出现 CRLF 警告，且 CI 构建产物无差异
6. 全站引用复核——非首页模板里的站内引用也逐一落地检查通过

## 阻塞

- 无
