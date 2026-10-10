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
| 换行符统一 | 完成 | `.gitattributes` |
| 全站引用复核 | 完成 | `content/posts/first-try.md` |
| 关于页与首页文案 | 进行中 | `content/about.md` |
| 顶栏品牌文字 | 搁置 | |
| 导航回主站 | 未开始 | |
| mask-icon 图标 | 搁置 | |

## 当前状态

- 线上 `https://sgldbhxs.top/hugoblog/`；无自己的 CNAME，靠用户站下沉路由。
- Hugo 0.147.3（CI 固定）+ PaperMod（submodule 钉 `1cf5327`）；配置两层合并。
- 跟踪文件 109 → 46（`public/` 与 `.hugo_build.lock` 出库，`questions/` 9 篇删除）。
- 界面已中文化：`defaultContentLanguage: zh` 带出「主页 / 文章 / 分钟 / 字 / 目录 / 建议修改」。
- 关于页邮箱已换成真实地址；简介与首页副标题、顶栏文字按用户要求先置空，后续自行填写。
- `first-try.md` 清掉了模板遗留的占位封面，线上曾因此挂着一张坏图。
- 换行符已统一：`.gitattributes` 规定 LF，`git add` 不再出现 CRLF 警告。
- 全站引用复核：12 个页面 190 处站内引用，只剩 `safari-pinned-tab.svg` 一个已知项（搁置）。
- 唯一文章没有正文，列表与详情都显示「0 分钟 / 0 字」。

## 下一步

1. 补文案——关于页简介写在 `content/about.md`，首页副标题与顶栏文字写在 `hugo.yml`（当前均为空）
2. 空文章处理——`first-try.md` 补正文或删除，页面不再显示「0 分钟 / 0 字」
3. 导航回主站——博客导航里有指向 `https://sgldbhxs.top/` 的链接

## 阻塞

- 无
