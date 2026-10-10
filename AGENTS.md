# AGENTS.md — hugoblog 项目指南

> Hugo 博客源码，线上地址 `https://sgldbhxs.top/hugoblog/`（个人主页域名的子路径）。
> 读序：本文件（机制与坑）→ `TODO.md`（状态）→ `decisions/`（取舍因果）。
> 工作区总览、跨仓库约定与本机环境坑见上层 `../AGENTS.md`。

## 定位与技术栈

- Hugo 静态站。CI 固定 **Hugo 0.147.3**（本机版本可能更高，见上层环境坑 4）。
- 主题 PaperMod，以 git submodule 钉在 commit `1cf5327`。
- 无前端构建链；样式走主题自带的 assets 管线。

## 命令

```bash
hugo server -D                                    # 本地开发（development 环境）
hugo --environment production --minify \
     --baseURL "https://sgldbhxs.top/hugoblog/" \
     --destination <临时目录>                      # 复刻 CI 构建
```

- **不要把构建输出写进 `public/`**：该目录被 git 跟踪，会污染工作区。用 `--destination` 指到仓库外。
- 检查合并后的实际配置：`hugo config --environment production`。

## 机制（改前必读）

1. **配置是两层合并的**：根 `hugo.yml` 提供主题、菜单、outputs、PaperMod params；`config/<environment>/hugo.yaml` 只覆盖差异（baseURL 与图片路径）。两者同时生效，不是"config 目录覆盖根文件"。
2. **主题只有 home 的 JSON 模板**（`themes/PaperMod/layouts/_default/index.json`，用途是站内搜索索引），**没有 section 的 JSON 模板**。section 的 JSON 由项目层 `layouts/posts/list.json.json` 提供，删掉它线上 `/posts/index.json` 立刻回到 404，个人主页博客卡会先吃一次 404 再回退 RSS。取舍因果见 `decisions/`。
3. **子模块必须先检出**：`themes/PaperMod` 为空时本地构建会报一串 `found no layout file for "html"`，产出里没有任何页面。本机初始化方式见上层环境坑 2。
4. **CI 会覆盖 baseURL**：workflow 用 `--baseURL "${{ steps.pages.outputs.base_url }}/"`，取值含 `/hugoblog` 子路径；`config/production/hugo.yaml` 里的绝对图片路径前缀必须与之匹配，否则线上图片 404。
5. **样式与脚本的落地方式不一样**：`assets/css/extended/*.css` 由主题 `head.html` 用 `resources.Match` 自动打进主样式包，**不要另写 `<link>`**（会 404 且重复应用）；`assets/js/*.js` 不在打包范围，必须在 `layouts/partials/extend_head.html` 里用 `resources.Get | minify | fingerprint` 取地址，手写固定路径会 404。图标类文件放 `static/` 根目录——主题在 params 留空时会回退到 `apple-touch-icon.png`、`safari-pinned-tab.svg`、`favicon.ico` 这些根路径默认值，缺文件就是线上 404。
6. **内容与写作**：本仓库没有 `CONSTRAINTS.md`，作者视角的机制与坑集中在 `README.md` 的「写作与发布」「常见问题」两节，改内容相关的东西前先看那里。要点：新建文章只有一个模板 `archetypes/default.md`（Hugo 按 kind 找 `archetypes/<kind>.md`，`posts/x.md` 的 kind 是 section 名 `posts`，无同名文件即回退 `default.md`）；正文图片必须走页面包或 `canonifyURLs`，因为整站在 `/hugoblog/` 子路径而开发在根路径；`draft: true` 与写在未来的 `date` 都不会上线且不报错；`searchHidden: true` 会让文章进不了搜索索引。

## 禁忌

- 禁止改 `themes/` 里的主题文件：升级子模块会丢，要覆盖就放项目层 `layouts/`。
- 禁止把构建产物提交进 `public/`。
- Git 默认只读，提交需用户明确要求。

## 规格工作流登记

- 当前规格入口：`AGENTS.md`
- 当前变更入口：无
- 历史变更入口：`decisions/`
- 验证证据入口：`decisions/implemented/缺陷/2026-10-10-posts-index-json-404.md`
- 未检测到 OpenSpec / SpecKit / Superpowers 等规格工具，按文档 + `decisions/` 手工维护。

## 门禁

```bash
python ~/.agents/tools/verify_docs.py .
```
