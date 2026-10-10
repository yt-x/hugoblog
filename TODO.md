# TODO.md — hugoblog 当前状态与待办

> 读序：本文件（状态）→ `AGENTS.md`（机制与坑）→ `decisions/`（取舍因果）。

## 功能进度

| 功能 | 状态 | 证据 |
| --- | --- | --- |
| PaperMod 站点（首页/文章/归档/标签/搜索） | 完成 | `hugo.yml` |
| section JSON feed | 完成 | `layouts/posts/list.json.json` |
| RSS feed | 完成 | `hugo.yml` |
| GitHub Pages 自动部署 | 完成 | `.github/workflows/hugo.yaml` |
| 仓库卫生（.gitignore、public 出库） | 未开始 | |
| 仓库 README | 未开始 | |
| 图片引用修正 | 未开始 | |

## 当前状态

- 线上 `https://sgldbhxs.top/hugoblog/`；没有自己的 CNAME，靠用户站自定义域名下沉路由。
- 构建链：Hugo 0.147.3（CI 固定）+ PaperMod（submodule 钉在 `1cf5327`）。
- 配置两层合并：`hugo.yml` 为主，`config/production/hugo.yaml` 覆盖 baseURL 与图片路径。
- `public/` 里是本机 dev 构建产物，但已被 git 跟踪，且仓库根没有 `.gitignore`。
- `params.images` 指向 `static/images/` 中不存在的 `girl.jpg`，RSS 与社交卡的配图因此 404。

## 下一步

1. 仓库卫生——`git check-ignore -v public/index.html` 命中，且删掉跟踪后 CI 仍能部署成功
2. 补 README——`README.md` 非空且写明本地构建与线上部署方式
3. 修正图片引用——RSS 的 `channel.image` 指向的图片返回 200

## 阻塞

- 无
