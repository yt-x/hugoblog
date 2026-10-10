# TODO.md — hugoblog 当前状态与待办

> 读序：本文件（状态）→ `AGENTS.md`（机制与坑）→ `decisions/`（取舍因果）。

## 功能进度

| 功能 | 状态 | 证据 |
| --- | --- | --- |
| PaperMod 站点（首页/文章/归档/标签/搜索） | 完成 | `hugo.yml` |
| section JSON feed | 完成 | `layouts/posts/list.json.json` |
| RSS feed | 完成 | `hugo.yml` |
| GitHub Pages 自动部署 | 完成 | `.github/workflows/hugo.yaml` |
| 仓库卫生（.gitignore、public 出库） | 完成 | `.gitignore` |
| 仓库 README | 完成 | `README.md` |
| 对外引用修正（配图与自定义脚本） | 完成 | `layouts/partials/extend_head.html` |
| questions/ 历史文档清理 | 完成 | `AGENTS.md` |
| safari-pinned-tab 图标 | 搁置 | |
| 换行符统一 | 未开始 | |

## 当前状态

- 线上 `https://sgldbhxs.top/hugoblog/`；没有自己的 CNAME，靠用户站自定义域名下沉路由。
- 构建链：Hugo 0.147.3（CI 固定）+ PaperMod（submodule 钉在 `1cf5327`）。
- 配置两层合并：`hugo.yml` 为主，`config/production/hugo.yaml` 覆盖 baseURL 与图片路径。
- 跟踪文件 109 → 45：`public/` 与 `.hugo_build.lock` 出库，`questions/` 的 9 篇历史文档已删，其中仍有效的机制并入 `AGENTS.md`，原文可从 git 历史取回。
- 线上已知 404 只剩 `safari-pinned-tab.svg`：主题在 params 留空时会回退到根路径默认值，暂不做这张单色矢量图，按已知项保留。

## 下一步

1. 统一换行符——加 `.gitattributes` 后 `git status` 不再出现 CRLF 警告，且 CI 构建产物无差异
2. 全站页面引用复核——除首页外，posts / archives / tags / search / about 模板里的站内引用也逐一落地检查通过

## 阻塞

- 无
