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
| safari-pinned-tab 图标 | 未开始 | |
| 换行符统一 | 未开始 | |
| questions/ 历史文档归档 | 未开始 | |

## 当前状态

- 线上 `https://sgldbhxs.top/hugoblog/`；没有自己的 CNAME，靠用户站自定义域名下沉路由。
- 构建链：Hugo 0.147.3（CI 固定）+ PaperMod（submodule 钉在 `1cf5327`）。
- 配置两层合并：`hugo.yml` 为主，`config/production/hugo.yaml` 覆盖 baseURL 与图片路径。
- 跟踪文件 109 → 53：`public/` 与 `.hugo_build.lock` 出库并进 `.gitignore`。
- 线上唯一已知 404：`safari-pinned-tab.svg`——主题在 params 留空时回退到根路径默认值。

## 下一步

1. 补 safari-pinned-tab.svg——线上该地址返回 200；需要一张单色矢量图，且要先解决本机无法渲染 SVG 的验证缺口
2. 统一换行符——加 `.gitattributes` 后 `git status` 不再出现 CRLF 警告
3. 归档 questions/ 历史文档——9 篇内容并入 `AGENTS.md` 后可删；属删除操作，待用户确认

## 阻塞

- 无
