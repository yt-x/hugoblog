# hugoblog

个人博客源码（Hugo + PaperMod），线上地址：<https://sgldbhxs.top/hugoblog/>

站点挂在个人主页域名的子路径下：它没有自己的 `CNAME`，依靠用户站（`yt-x.github.io`）绑定的自定义域名向项目站下沉路由。
子路径这件事会直接影响写文章时怎么放图片，见下。

## 写作与发布

### 1. 新建文章

```bash
hugo new content posts/我的文章.md
```

生成的文件带这几个字段，按需填：

| 字段 | 说明 |
| --- | --- |
| `title` | 标题，默认由文件名生成（`my-post` → `My Post`） |
| `date` | 时间；**不要写未来时间**，见第 4 步 |
| `draft` | `true` 是草稿，不会上线 |
| `tags` | 标签；不填就不会进标签页 |
| `description` | 摘要，用于分享卡片与搜索引擎；留空会回落到正文开头 |

模板只有 `archetypes/default.md` 一个：Hugo 是按 kind 找 `archetypes/<kind>.md` 的，`posts/x.md`
的 kind 是 section 名 `posts`，找不到同名模板就回退 `default.md`，所以它覆盖全部新建文章。

其余 PaperMod 开关（目录、阅读时长、分享按钮、字数、面包屑等）已在 `hugo.yml` 的 `params` 里统一设好，
单篇需要覆盖时再往 front matter 里加；封面用 `cover.image`，写法见第 2 步。

### 2. 写正文与插图

正文是 Markdown。图片的两种放法都能在开发与线上同时正确显示，**都不要写相对路径**：

| 写法 | 开发 | 线上 |
| --- | --- | --- |
| 页面包：图与 `index.md` 同目录，正文写 `![](photo.png)` | ✅ | ✅ |
| 图放 `static/images/`，配置开 `canonifyURLs: true`，正文写 `![](/images/x.png)` | ✅ | ✅ |
| 正文写 `![](/images/x.png)`（当前配置没开 canonifyURLs） | ✅ | ❌ 线上 404 |
| 正文写 `![](images/x.png)` | ❌ | ❌ |

原因是站点在 `/hugoblog/` 子路径下，而开发环境在根路径：根绝对路径只在开发下是对的。

默认配置没有开 `canonifyURLs`，所以上表第三行就是现状。要不要开它，实测有两条代价：

- **影响面不是局部的**：开启后 46 个产物里有 15 个会变（所有页面 HTML、RSS、JSON feed、
  `sitemap.xml`、搜索索引），是一次全站 URL 重写。
- **把域名写进正文产物**：输出变成 `https://sgldbhxs.top/hugoblog/images/x.png`；将来换域名
  （比如迁到 VPS）时这些地址都要重新生成。页面包输出的是 `/hugoblog/posts/x/photo.png`，
  根相对、不含域名，换域名不用动内容。

所以默认走页面包；只有图片要被多篇文章共用、必须集中放 `static/images/` 时，才值得开它。

**推荐页面包**，零配置且开发/线上一致：

```text
content/posts/我的文章/
├── index.md
└── photo.png
```

封面同理：`cover.image` 写文件名并配 `cover.relative: true`。
注意 `{{< figure >}}` 短代码**不会**解析页面包内的资源，用它时请写 `/images/...` 这类根绝对路径
（并配合上表第二行）。

### 3. 本地预览

```bash
hugo server -D      # -D 连草稿一起渲染 → http://localhost:1313/
```

### 4. 什么时候不会上线

CI 跑的是不带任何放宽参数的 `hugo --minify`，所以有两类内容不会出现在线上：

- `draft: true` 的文章；
- **`date` 写在未来的文章**——Hugo 默认跳过未来日期的内容，而且**不报错、不提示**。
  推送后文章没出现时先查这一条。

### 5. 推送发布

```bash
git add content/posts/我的文章/index.md
git commit -m "post: 我的文章"
git push
```

推送 `main` 触发 `.github/workflows/hugo.yaml`：CI 用 Hugo 0.147.3 构建并部署到 GitHub Pages，
通常 1～2 分钟。确认方式：仓库的 Actions 变绿，然后打开 <https://sgldbhxs.top/hugoblog/> 看文章在不在。

页面有缓存，看不到更新先按 `Ctrl+F5`。

## 常见问题

| 现象 | 先查这里 |
| --- | --- |
| 推送后文章没出现，Actions 却是绿的 | `draft: true`，或 `date` 写在未来 |
| 线上图片 404、本地正常 | 正文写了 `/images/...` 根绝对路径，且没开 `canonifyURLs` |
| 搜索搜不到文章 | 文章的 `searchHidden` 不能是 `true`，主题的搜索索引会跳过它 |
| 本地预览样式全无 | 主题子模块没检出，见下面「本地开发」 |

## 技术栈

- Hugo（CI 固定 0.147.3；本机版本更高，多出的弃用告警不影响构建）
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
archetypes/                               # 新建文章的模板（见「写作与发布」第 1 步）
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
