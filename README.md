# hugoblog

个人博客源码（Hugo + PaperMod），线上地址：<https://sgldbhxs.top/hugoblog/>

站点挂在个人主页域名的子路径下：它没有自己的 `CNAME`，依靠用户站（`yt-x.github.io`）绑定的自定义域名向项目站下沉路由。

## 技术栈

- Hugo（CI 固定 0.147.3）
- 主题 PaperMod，以 git submodule 钉在固定 commit
- 没有额外的前端构建链

## 本地开发

```bash
# 首次：检出主题子模块
# 沙箱环境里 git submodule 不可用，替代方式见 ../AGENTS.md 的「环境坑」
git submodule update --init --recursive

hugo server -D          # http://localhost:1313/
```

复刻线上构建（产物写到仓库外，避免污染工作区）：

```bash
hugo --environment production --minify \
     --baseURL "https://sgldbhxs.top/hugoblog/" \
     --destination ../.build-check
```

## 目录

```text
hugo.yml                                  # 主配置：主题、菜单、outputs、PaperMod params
config/development|production/hugo.yaml   # 按环境覆盖 baseURL 与图片路径
content/                                  # 文章与页面
layouts/                                  # 项目层模板（覆盖主题同名声明的部分）
themes/PaperMod/                          # 主题（submodule，勿手改）
static/images/                            # 站点图片
.github/workflows/hugo.yaml               # 构建并部署到 GitHub Pages
```

## 部署

推送 `main` 触发 `.github/workflows/hugo.yaml`：CI 用 Hugo 0.147.3 构建 `public/`，再部署到 GitHub Pages。

`public/` 是构建产物，已被 `.gitignore` 忽略，不参与版本控制。

## 文档

| 文件 | 内容 |
| --- | --- |
| `AGENTS.md` | 机制、禁区与文档门禁（改动前先读） |
| `TODO.md` | 当前状态、下一步与阻塞 |
| `decisions/` | 取舍因果记录 |
