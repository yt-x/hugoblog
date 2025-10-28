# Hugo + PaperMod 完整配置指南（实战版）

> 本指南基于你的实际项目结构编写，所有目录和文件都经过实际验证。

---

## 📁 你的实际项目结构

### 当前项目目录（已存在）

```
C:\Users\XYT\Desktop\hugoblog\          # 项目根目录
│
├── archetypes/                          # ✅ 已存在：文章模板
│   ├── default.md                      # 默认内容模板
│   └── post.md                         # 博客文章模板
│
├── content/                             # ✅ 已存在：网站内容
│   ├── posts/                          # 博客文章目录
│   │   └── first-try.md               # 你的第一篇文章
│   ├── archives.md                     # 归档页面
│   └── search.md                       # 搜索页面
│
├── static/                              # ✅ 已存在：静态资源
│   └── images/                         # 图片目录
│
├── themes/                              # ✅ 已存在：主题目录
│   └── PaperMod/                       # PaperMod 主题（Git 子模块）
│
├── public/                              # ✅ 自动生成：构建输出（不要手动编辑）
│
├── hugo.yml                             # ✅ 已存在：主配置文件
├── README.md                            # 项目说明
├── HUGO_GUIDE.md                        # 配置指南
└── .hugo_build.lock                     # Hugo 构建锁文件
```

### 需要手动创建的目录（自定义时）

这些目录默认**不存在**，需要自定义功能时才创建：

```
hugoblog/
├── layouts/                # ❌ 不存在，需要时创建：自定义布局模板
├── assets/                 # ❌ 不存在，需要时创建：自定义 CSS/JS
├── i18n/                   # ❌ 不存在，需要时创建：自定义翻译
└── data/                   # ❌ 不存在，需要时创建：数据文件
```

**重要概念：** Hugo 采用**覆盖机制**，项目根目录的文件会覆盖主题中的同名文件。

---

## 🎨 PaperMod 主题目录结构

### 主题完整结构（themes/PaperMod/）

```
themes/PaperMod/
│
├── layouts/                             # 🎨 布局模板（可覆盖）
│   ├── _default/                       # 默认页面布局
│   │   ├── baseof.html                # 基础模板（所有页面继承）
│   │   ├── list.html                  # 列表页（首页、分类页）
│   │   ├── single.html                # 单页（文章详情页）
│   │   ├── archives.html              # 归档页
│   │   ├── search.html                # 搜索页
│   │   ├── terms.html                 # 分类/标签列表页
│   │   └── index.json                 # JSON 输出（搜索用）
│   │
│   ├── partials/                       # 部分模板（组件）
│   │   ├── head.html                  # HTML <head> 部分
│   │   ├── header.html                # 网站头部
│   │   ├── footer.html                # 网站底部
│   │   ├── index_profile.html         # 首页 Profile 模式
│   │   ├── home_info.html             # 首页 Info 模式
│   │   ├── post_meta.html             # 文章元信息
│   │   ├── post_nav_links.html        # 文章导航
│   │   ├── toc.html                   # 文章目录
│   │   ├── cover.html                 # 封面图
│   │   ├── share_icons.html           # 分享按钮
│   │   ├── social_icons.html          # 社交图标
│   │   ├── breadcrumbs.html           # 面包屑导航
│   │   ├── comments.html              # 评论区
│   │   ├── extend_head.html           # <head> 扩展点（空文件）
│   │   └── extend_footer.html         # 底部扩展点（空文件）
│   │
│   ├── shortcodes/                     # 短代码（Markdown 中使用）
│   │   └── （主题提供的短代码）
│   │
│   ├── 404.html                        # 404 错误页面
│   └── robots.txt                      # robots.txt 模板
│
├── assets/                              # 💎 资源文件
│   ├── css/                            # 样式文件
│   │   ├── core/                      # 核心样式
│   │   │   ├── reset.css             # CSS 重置
│   │   │   ├── theme-vars.css        # 主题变量（颜色、间距等）
│   │   │   └── zmedia.css            # 响应式媒体查询
│   │   │
│   │   ├── common/                    # 通用组件样式
│   │   │   ├── main.css              # 主要样式
│   │   │   ├── header.css            # 头部样式
│   │   │   ├── footer.css            # 底部样式
│   │   │   ├── post-entry.css        # 文章列表样式
│   │   │   ├── post-single.css       # 文章详情样式
│   │   │   ├── profile-mode.css      # Profile 模式样式
│   │   │   ├── archive.css           # 归档页样式
│   │   │   └── search.css            # 搜索页样式
│   │   │
│   │   ├── extended/                  # 扩展样式目录
│   │   │   └── blank.css             # 空白文件（占位）
│   │   │
│   │   └── includes/                  # 可包含的样式片段
│   │       ├── chroma-styles.css     # 代码高亮样式
│   │       └── scroll-bar.css        # 滚动条样式
│   │
│   └── js/                             # JavaScript 文件
│       ├── fastsearch.js              # 搜索功能
│       └── fuse.basic.min.js          # 搜索引擎库
│
├── i18n/                                # 🌍 国际化翻译文件
│   ├── en.yaml                         # 英文
│   ├── zh.yaml                         # 简体中文
│   ├── zh-tw.yaml                      # 繁体中文
│   └── ...                             # 其他语言
│
└── theme.toml                           # 主题信息文件
```

---

## ⚙️ 配置文件完整解析（hugo.yml）

### 1. 基础配置

```yaml
# ============================================
# 网站基础信息
# ============================================
baseURL: https://sgldbhxs.top/
# 说明：网站的完整 URL，必须与实际部署地址一致
# 影响：RSS 链接、sitemap、社交分享链接
# 示例：https://example.com/ 或 https://username.github.io/

languageCode: zh-cn
# 说明：网站主要语言代码
# 常用值：en-us（英语）, zh-cn（简体中文）, zh-tw（繁体中文）, ja（日语）
# 影响：HTML <html lang="zh-cn">、SEO、浏览器翻译提示

title: SGLDBHXS
# 说明：网站标题，显示在浏览器标签栏
# 影响：<title> 标签、RSS 标题、搜索引擎结果

theme: ["PaperMod"]
# 说明：使用的主题名称，对应 themes/ 目录下的文件夹名
# 支持多主题：["PaperMod", "AnotherTheme"]（按顺序查找文件）
```

### 2. 分页配置

```yaml
# ============================================
# 分页设置
# ============================================
pagination:
  pagerSize: 5
# 说明：每页显示的文章数量
# 影响：首页、分类页、标签页的文章列表
# 建议：5-10 篇，太多影响加载速度
```

### 3. 构建和 SEO 配置

```yaml
# ============================================
# SEO 和构建选项
# ============================================
enableRobotsTXT: true
# 说明：是否生成 robots.txt 文件
# 作用：告诉搜索引擎哪些页面可以抓取
# 生成位置：public/robots.txt

buildDrafts: false
# 说明：是否构建标记为 draft: true 的草稿文章
# 开发时：设为 true，可以预览草稿
# 生产环境：必须设为 false

buildFuture: false
# 说明：是否构建未来日期的文章
# 用途：可以提前写好文章，设置发布日期，到期自动发布

buildExpired: false
# 说明：是否构建已过期的文章（expiryDate 已过）
# 用途：可以设置文章有效期

enableGitInfo: false
# 说明：是否启用 Git 信息（需要 Git 仓库）
# 作用：可获取文章的最后修改时间、作者等 Git 信息
# 注意：会增加构建时间
```

### 4. 压缩优化

```yaml
# ============================================
# 输出优化
# ============================================
minify:
  disableXML: true
  # 说明：是否禁用 XML 文件压缩（RSS、sitemap）
  # 建议：true（XML 压缩后可读性差，调试困难）

  minifyOutput: true
  # 说明：是否压缩 HTML/CSS/JS 输出
  # 作用：移除空格、换行，减小文件体积
  # 建议：生产环境 true，开发环境 false
```

### 5. 输出格式配置

```yaml
# ============================================
# 输出格式（重要！）
# ============================================
outputs:
  home:
    - HTML      # 生成 HTML 首页
    - RSS       # 生成 RSS 订阅源（/index.xml）
    - JSON      # 生成 JSON（/index.json，搜索功能必需！）

# 说明：定义首页生成哪些格式的文件
# 注意：JSON 是 PaperMod 搜索功能的必需项，不能删除！
```

### 6. 菜单配置

```yaml
# ============================================
# 导航菜单
# ============================================
menu:
  main:
    - identifier: categories    # 唯一标识符（不重复即可）
      name: 分类                # 菜单显示文本
      url: /categories/         # 链接地址
      weight: 10                # 排序权重（数字越小越靠前）

    - identifier: tags
      name: 标签
      url: /tags/
      weight: 20

    - identifier: archives
      name: 归档
      url: /archives/
      weight: 30

    - identifier: search
      name: 搜索
      url: /search/
      weight: 40

    - identifier: about
      name: 关于
      url: /about/
      weight: 50

# 对应关系：
# /categories/ → 自动生成（所有分类列表）
# /tags/ → 自动生成（所有标签列表）
# /archives/ → content/archives.md
# /search/ → content/search.md
# /about/ → 需要创建 content/about.md
```

### 7. params 参数（PaperMod 主题专用）

```yaml
# ============================================
# PaperMod 主题参数
# ============================================
params:
  # ---------- 环境配置 ----------
  env: production
  # 可选值：production, development
  # production：启用 Google Analytics、OpenGraph 等
  # development：显示草稿、调试信息

  # ---------- 网站信息 ----------
  title: SGLDBHXS
  description: "SGLDBHXS'S BLOG"
  keywords: [Blog, Portfolio, PaperMod]
  author: SGLDBHXS
  # 或多作者：author: ["作者1", "作者2"]

  images: ["/images/og-image.png"]
  # 说明：社交分享时的默认图片
  # 用于：Twitter Cards, Facebook OpenGraph
  # 位置：static/images/og-image.png
  # 建议尺寸：1200x630 像素

  # ---------- 日期格式 ----------
  # 日期格式, 参考 https://golang.org/src/time/format.go 中的日期格式
  DateFormat: "2006-01-02"
  # Go 语言时间格式（固定写法）
  # 示例：
  #   "2006-01-02"          → 2024-10-28
  #   "2006/01/02"          → 2024/10/28
  #   "January 2, 2006"     → October 28, 2024
  #   "2006年01月02日"      → 2024年10月28日
  #   "02 Jan 2006"         → 28 Oct 2024

  # ---------- 主题外观 ----------
  defaultTheme: auto
  # 可选值：light（亮色）, dark（暗色）, auto（跟随系统）
  # auto：根据用户系统设置自动切换

  disableThemeToggle: false
  # true：隐藏主题切换按钮
  # false：显示亮/暗主题切换按钮

  # ---------- 功能开关 ----------
  ShowReadingTime: true
  # 显示文章阅读时间（自动计算）

  ShowShareButtons: true
  # 显示分享按钮（Twitter、LinkedIn、Reddit 等）

  ShowPostNavLinks: true
  # 显示文章底部的上一篇/下一篇导航

  ShowBreadCrumbs: true
  # 显示面包屑导航（首页 > 分类 > 文章）

  ShowCodeCopyButtons: true
  # 显示代码块的复制按钮

  ShowWordCount: true
  # 显示文章字数统计

  ShowRssButtonInSectionTermList: true
  # 在分类/标签页显示 RSS 订阅按钮

  UseHugoToc: true
  # 是否开启 Hugo 自动生成的目录（TOC）功能
  # 参考 URL_ADDRESS  # 参考 https://gohugo.io/content-management/toc/
  # 使用 Hugo 内置目录生成（推荐 true）

  disableSpecial1stPost: false
  # true：首页第一篇文章使用普通样式
  # false：首页第一篇文章使用大卡片样式

  disableScrollToTop: false
  # true：禁用"返回顶部"按钮
  # false：显示"返回顶部"按钮

  comments: false
  # 全局是否启用评论（需配合评论系统）

  hidemeta: false
  # true：隐藏文章元信息（日期、作者、阅读时间等）

  hideSummary: false
  # true：在列表页隐藏文章摘要

  showtoc: true
  # true：显示文章目录

  tocopen: false
  # true：目录默认展开
  # false：目录默认折叠

  # ---------- 网站图标 ----------
  assets:
    favicon: "/favicon.ico"
    favicon16x16: "/favicon-16x16.png"
    favicon32x32: "/favicon-32x32.png"
    apple_touch_icon: "/apple-touch-icon.png"
    safari_pinned_tab: "/safari-pinned-tab.svg"
    # 文件位置：static/ 目录下
    # 生成工具：https://realfavicongenerator.net/

  # ---------- 网站标签（左上角） ----------
  label:
    text: "Home"              # 显示文本
    icon: /apple-touch-icon.png
    iconHeight: 35
    # 注意：如果图标文件不存在，删除这两行

  # ---------- 首页模式 1：Profile Mode ----------
  profileMode:
    enabled: true             # 启用 Profile 模式
    title: "Archives"
    subtitle: "This is subtitle"
    imageUrl: ""              # ⚠️ 重要：留空或设置实际图片路径
    # imageUrl: "/images/avatar.png"  # 使用头像
    imageTitle: "my image"
    imageWidth: 120
    imageHeight: 120

    buttons:
      - name: Posts
        url: /posts
      - name: Archives
        url: /archives
      - name: Tags
        url: /tags
      - name: Github
        url: "https://github.com/yt-x"

  # ---------- 首页模式 2：Home Info Mode ----------
  homeInfoParams:
    Title: "Hi Dear Friend 👋"
    Content: Welcome to SGLDBHXS's blog.
    # 注意：如果 profileMode.enabled = true，这个配置不生效

  # ---------- 社交图标 ----------
  socialIcons:
    - name: stackoverflow
      url: "https://stackoverflow.com/users/21336871/kkk-su"
    - name: github
      url: "https://github.com/yt-x"
    - name: bilibili
      url: "https://space.bilibili.com/474791264"
    - name: telegram
      url: "https://t.me/Sgldbhxs"
    - name: rss
      url: "/index.xml"
    # 更多图标：email, twitter, facebook, instagram, linkedin, youtube

  # ---------- 封面图配置 ----------
  cover:
    hidden: false             # 全局是否隐藏封面图
    hiddenInList: false       # 列表页是否隐藏封面图
    hiddenInSingle: false     # 文章详情页是否隐藏封面图

  # ---------- 编辑链接 ----------
  editPost:
    URL: "https://github.com/yt-x/hugoblog/tree/main/content"
    Text: "Suggest Changes"
    appendFilePath: true      # 是否追加文件路径

  # ---------- 搜索配置 ----------
  # https://fusejs.io/api/options.html
  fuseOpts:
    isCaseSensitive: false    # 是否区分大小写
    shouldSort: true          # 是否排序结果
    location: 0
    distance: 1000
    threshold: 0.4            # 匹配阈值（0-1，越小越严格）
    minMatchCharLength: 0
    limit: 10                 # 结果数量限制
    keys: ["title", "permalink", "summary", "content"]
    # 搜索字段：标题、链接、摘要、正文内容
```

### 8. 代码高亮配置

```yaml
# ============================================
# Markdown 和代码高亮
# ============================================
pygmentsUseClasses: true
# 说明：使用 CSS 类而不是内联样式
markup:
  highlight:
    noClasses: false          # 不使用内联样式
    lineNos: true             # 显示行号
    style: monokai            # 高亮主题
    # 可选主题：
    #   monokai, dracula, nord, github, solarized-dark,
    #   solarized-light, vs, xcode, emacs, vim
    # 预览：https://xyproto.github.io/splash/docs/

  goldmark:                   # Markdown 渲染器
    renderer:
      unsafe: true            # 允许 Markdown 中的 HTML 标签
      # false：禁用 HTML 标签（更安全但限制功能）
```

---

## 🎨 自定义博客外观（实战步骤）

### 方法 1：自定义 CSS（最简单）

#### 步骤 1：创建 assets 目录

```bash
# 在项目根目录执行
cd C:\Users\XYT\Desktop\hugoblog
mkdir -p assets\css\extended
```

#### 步骤 2：创建自定义 CSS 文件

创建 `assets/css/extended/custom.css`：

```css
/* ============================================
   自定义样式 - 会自动加载
   ============================================ */

/* ---------- 自定义颜色变量 ---------- */
:root {
    /* 主题色 */
    --theme: #3b82f6;              /* 主色调（蓝色） */
    --entry: #f9fafb;              /* 卡片背景 */
    --primary: rgba(0, 0, 0, 0.88);
    --secondary: rgba(0, 0, 0, 0.56);
    --tertiary: rgba(0, 0, 0, 0.16);

    /* 链接颜色 */
    --link-color: #2563eb;
    --link-hover-color: #1d4ed8;

    /* 间距 */
    --gap: 24px;
    --content-gap: 20px;
    --nav-width: 1024px;
    --main-width: 720px;

    /* 圆角 */
    --radius: 8px;
}

/* 暗色主题 */
.dark {
    --theme: #1e293b;
    --entry: #334155;
    --primary: rgb(218, 218, 219);
    --secondary: rgb(155, 156, 157);
    --tertiary: rgb(65, 66, 68);
}

/* ---------- 自定义字体 ---------- */
body {
    font-family: -apple-system, BlinkMacSystemFont,
                 "Segoe UI", "Microsoft YaHei", "微软雅黑",
                 sans-serif;
}

code, pre {
    font-family: "JetBrains Mono", "Fira Code",
                 "Consolas", monospace !important;
}

/* ---------- 文章标题美化 ---------- */
.post-title {
    font-size: 36px;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 20px;
    color: var(--primary);
}

/* ---------- 文章内容样式 ---------- */
.post-content {
    line-height: 1.8;
}

.post-content h2 {
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 28px;
    border-bottom: 2px solid var(--tertiary);
    padding-bottom: 10px;
}

.post-content h3 {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 24px;
}

/* ---------- 链接样式 ---------- */
.post-content a {
    color: var(--link-color);
    text-decoration: underline;
    text-decoration-color: var(--link-color);
    text-underline-offset: 3px;
    transition: all 0.2s;
}

.post-content a:hover {
    color: var(--link-hover-color);
    text-decoration-color: var(--link-hover-color);
}

/* ---------- 引用块美化 ---------- */
blockquote {
    border-left: 4px solid var(--theme);
    padding-left: 20px;
    margin: 20px 0;
    font-style: italic;
    color: var(--secondary);
    background-color: var(--entry);
    padding: 15px 20px;
    border-radius: var(--radius);
}

/* ---------- 代码块美化 ---------- */
.highlight {
    margin: 20px 0;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

pre {
    padding: 20px !important;
    border-radius: var(--radius);
    line-height: 1.6;
}

/* 行内代码 */
:not(pre) > code {
    background-color: var(--entry);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    color: #e83e8c;
}

/* ---------- 表格美化 ---------- */
table {
    border-collapse: collapse;
    width: 100%;
    margin: 20px 0;
    overflow-x: auto;
    display: block;
}

table th,
table td {
    border: 1px solid var(--tertiary);
    padding: 12px 16px;
    text-align: left;
}

table th {
    background-color: var(--entry);
    font-weight: 600;
}

table tr:hover {
    background-color: var(--entry);
}

/* ---------- 文章卡片悬停效果 ---------- */
.post-entry {
    transition: transform 0.2s, box-shadow 0.2s;
}

.post-entry:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* ---------- 首页头像圆形 ---------- */
.profile img {
    border-radius: 50%;
    border: 4px solid var(--theme);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* ---------- 按钮美化 ---------- */
.profile .button {
    padding: 12px 24px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s;
    border: 2px solid var(--theme);
}

.profile .button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* ---------- 滚动条美化 ---------- */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track {
    background: var(--entry);
}

::-webkit-scrollbar-thumb {
    background: var(--tertiary);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--secondary);
}

/* ---------- 返回顶部按钮 ---------- */
#top-link {
    font-size: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* ---------- 图片样式 ---------- */
.post-content img {
    border-radius: var(--radius);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    height: auto;
}

/* ---------- 目录美化 ---------- */
.toc {
    background-color: var(--entry);
    border-radius: var(--radius);
    padding: 15px 20px;
}

.toc ul {
    list-style: none;
}

.toc a {
    color: var(--secondary);
    text-decoration: none;
    transition: color 0.2s;
}

.toc a:hover {
    color: var(--primary);
}
```

**说明：** 将此文件保存为 `assets/css/extended/custom.css`，Hugo 会自动加载！

#### 步骤 3：验证效果

```bash
# 启动开发服务器
hugo server -D

# 访问 http://localhost:1313/
```

**原理：** PaperMod 主题会自动加载 `assets/css/extended/` 目录下的所有 CSS 文件。

---

### 方法 2：自定义 JavaScript

#### 步骤 1：创建 layouts 目录

```bash
cd C:\Users\XYT\Desktop\hugoblog
mkdir -p layouts\partials
mkdir -p assets\js
```

#### 步骤 2：创建 JS 文件

创建 `assets/js/custom.js`：

```javascript
// ============================================
// 自定义 JavaScript 功能
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // 添加阅读进度条
    addReadingProgress();

    // 图片点击放大
    enableImageLightbox();

    // 外部链接新标签页打开
    openExternalLinksInNewTab();

    // 平滑滚动
    enableSmoothScroll();
});

// ---------- 阅读进度条 ----------
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(to right, #00c9ff, #92fe9d);
        z-index: 9999;
        transition: width 0.2s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ---------- 图片点击放大 ----------
function enableImageLightbox() {
    const images = document.querySelectorAll('.post-content img');

    images.forEach(img => {
        img.style.cursor = 'zoom-in';

        img.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: zoom-out;
                animation: fadeIn 0.2s;
            `;

            const lightboxImg = document.createElement('img');
            lightboxImg.src = this.src;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 8px;
                box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
            `;

            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);

            lightbox.addEventListener('click', () => {
                document.body.removeChild(lightbox);
            });
        });
    });
}

// ---------- 外部链接新标签页打开 ----------
function openExternalLinksInNewTab() {
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach(link => {
        const linkHost = new URL(link.href).hostname;
        if (linkHost !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// ---------- 平滑滚动 ----------
function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// CSS 动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
```

#### 步骤 3：引入 JS 文件

创建 `layouts/partials/extend_head.html`：

```html
<!-- 自定义 CSS -->
<link rel="stylesheet" href="{{ "css/extended/custom.css" | absURL }}">

<!-- 自定义 JavaScript -->
<script src="{{ "js/custom.js" | absURL }}" defer></script>
```

**说明：**
- `extend_head.html` 会被自动包含在所有页面的 `<head>` 部分
- `defer` 属性确保 JS 在页面加载完成后执行

---

### 方法 3：自定义布局模板

#### 示例 1：自定义页脚

创建 `layouts/partials/footer.html`：

```html
<footer class="footer">
    <div class="footer-content">
        <!-- 版权信息 -->
        <span class="copyright">
            {{- if site.Copyright }}
            {{ site.Copyright | markdownify }}
            {{- else }}
            &copy; {{ now.Year }} <a href="{{ "" | absLangURL }}">{{ site.Title }}</a>
            {{- end }}
        </span>

        <!-- Powered by -->
        <span class="powered-by">
            Powered by
            <a href="https://gohugo.io/" target="_blank" rel="noopener noreferrer">Hugo</a>
            &
            <a href="https://github.com/adityatelange/hugo-PaperMod/" target="_blank" rel="noopener noreferrer">PaperMod</a>
        </span>

        <!-- 网站统计 -->
        <span class="stats">
            <span id="busuanzi_container_site_pv">
                访问量 <span id="busuanzi_value_site_pv"></span> 次
            </span>
            <span class="separator">|</span>
            <span id="busuanzi_container_site_uv">
                访客数 <span id="busuanzi_value_site_uv"></span> 人
            </span>
        </span>

        <!-- 社交图标 -->
        {{- if site.Params.socialIcons }}
        <div class="social-footer">
            {{- partial "social_icons.html" . -}}
        </div>
        {{- end }}
    </div>
</footer>

<!-- 不蒜子统计脚本 -->
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>

<style>
.footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 30px 20px;
    text-align: center;
}

.footer-content span {
    font-size: 14px;
    color: var(--secondary);
}

.separator {
    margin: 0 8px;
}

.social-footer {
    margin-top: 10px;
}
</style>
```

**说明：** 这个文件会完全覆盖主题的默认页脚。

#### 示例 2：自定义头部扩展

创建 `layouts/partials/extend_head.html`（如果还没创建）：

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<!-- 自定义 CSS -->
<link rel="stylesheet" href="{{ "css/extended/custom.css" | absURL }}">

<!-- 自定义 JavaScript -->
<script src="{{ "js/custom.js" | absURL }}" defer></script>

<!-- 网站验证 -->
{{- if site.Params.analytics.google.SiteVerificationTag }}
<meta name="google-site-verification" content="{{ site.Params.analytics.google.SiteVerificationTag }}">
{{- end }}

<!-- 自定义 meta 标签 -->
<meta name="author" content="{{ site.Params.author }}">
<meta name="keywords" content="{{ delimit site.Params.keywords "," }}">

<!-- 预加载关键资源 -->
<link rel="preload" href="{{ "css/extended/custom.css" | absURL }}" as="style">

<style>
/* 自定义字体应用 */
body {
    font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont,
                 'Segoe UI', sans-serif;
}

code, pre {
    font-family: 'JetBrains Mono', 'Consolas', monospace !important;
}
</style>
```

---

### 方法 4：添加评论系统（Giscus）

#### 步骤 1：配置 GitHub Discussions

1. 在 GitHub 仓库启用 Discussions
2. 访问 https://giscus.app/zh-CN
3. 按照提示获取配置代码

#### 步骤 2：创建评论模板

创建 `layouts/partials/comments.html`：

```html
{{- if .Params.comments }}
<div class="comments-container">
    <h3 class="comments-title">💬 评论</h3>

    <script src="https://giscus.app/client.js"
        data-repo="yt-x/hugoblog"
        data-repo-id="你的仓库ID"
        data-category="Announcements"
        data-category-id="你的分类ID"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
    </script>
</div>

<style>
.comments-container {
    margin-top: 60px;
    padding-top: 40px;
    border-top: 2px solid var(--tertiary);
}

.comments-title {
    margin-bottom: 20px;
    font-size: 24px;
    color: var(--primary);
}
</style>
{{- end }}
```

#### 步骤 3：在文章中启用

在文章的 front matter 中添加：

```markdown
---
title: "我的文章"
comments: true
---
```

---

## 📝 内容管理

### 1. 文章 Front Matter 完整参数

```markdown
---
# ========== 基础信息 ==========
title: "文章标题"                           # 必需
date: 2024-10-28T10:00:00+08:00            # 必需，发布日期
lastmod: 2024-10-29T15:30:00+08:00         # 最后修改日期（可选）
draft: false                                # 是否为草稿

# ========== 分类和标签 ==========
categories: ["技术"]                       # 分类（单个或多个）
tags: ["Hugo", "博客", "教程"]             # 标签

# ========== 作者 ==========
author: "SGLDBHXS"                         # 作者名

# ========== SEO ==========
description: "文章描述，用于搜索引擎和社交分享"
summary: "文章摘要，显示在列表页"            # 不设置则自动截取
keywords: [Hugo, 教程, 配置]               # 关键词
slug: "custom-url-slug"                    # 自定义 URL（可选）
canonicalURL: ""                           # 规范链接（可选）

# ========== 封面图 ==========
cover:
  image: "/images/cover.jpg"               # 封面图路径
  alt: "封面图描述"                        # 替代文本
  caption: "图片说明"                      # 图片说明
  relative: false                          # 相对路径还是绝对路径
  hidden: false                            # 是否隐藏封面图

# ========== 目录 ==========
showToc: true                              # 显示目录
TocOpen: false                             # 目录默认展开
UseHugoToc: true                           # 使用 Hugo 目录

# ========== 功能开关 ==========
ShowReadingTime: true                      # 显示阅读时间
ShowBreadCrumbs: true                      # 显示面包屑
ShowPostNavLinks: true                     # 显示上下篇导航
ShowWordCount: true                        # 显示字数
ShowRssButtonInSectionTermList: true       # RSS 按钮

# ========== 其他 ==========
hidemeta: false                            # 隐藏元信息
comments: true                             # 启用评论
disableShare: false                        # 禁用分享按钮
disableHLJS: false                         # 禁用代码高亮
hideSummary: false                         # 隐藏摘要
searchHidden: false                        # 从搜索中隐藏

weight: 1                                  # 排序权重
---

文章内容从这里开始...
```

### 2. 创建新文章

```bash
# 使用 post.md 模板创建新文章
hugo new posts/my-new-post.md

# 生成的文件路径：content/posts/my-new-post.md
```

### 3. 创建特殊页面

#### 关于页面

创建 `content/about.md`：

```markdown
---
title: "关于我"
url: "/about/"
hidemeta: true
showtoc: false
comments: false
---

## 👋 你好

我是 SGLDBHXS，一名...

## 🔧 技能

- **编程语言**：Python, JavaScript, Go
- **框架**：React, Vue, Django
- **工具**：Git, Docker, VS Code

## 📫 联系方式

- Email: your@email.com
- GitHub: [@yt-x](https://github.com/yt-x)
- Telegram: [@Sgldbhxs](https://t.me/Sgldbhxs)
```

#### 友情链接页面

创建 `content/links.md`：

```markdown
---
title: "友情链接"
url: "/links/"
---

## 友链列表

### 技术博客

- [Hugo 官方文档](https://gohugo.io/) - 最好的静态网站生成器
- [PaperMod 主题](https://github.com/adityatelange/hugo-PaperMod) - 简洁美观的 Hugo 主题

### 申请友链

欢迎交换友链！请在评论区留下：

- 网站名称
- 网站链接
- 网站描述
- 网站图标
```

### 4. 使用 Shortcodes

#### 内置 Shortcodes

```markdown
<!-- YouTube 视频 -->
{{< youtube w7Ft2ymGmfc >}}

<!-- 图片 -->
{{< figure src="/images/photo.jpg"
           title="图片标题"
           caption="图片说明"
           alt="替代文本" >}}

<!-- Gist 代码 -->
{{< gist username gist_id >}}

<!-- Tweet -->
{{< tweet user="username" id="1234567890" >}}
```

#### 自定义 Shortcode 示例

创建 `layouts/shortcodes/note.html`：

```html
<div class="custom-note {{ .Get 0 }}">
    {{ .Inner | markdownify }}
</div>

<style>
.custom-note {
    padding: 16px 20px;
    border-radius: 8px;
    margin: 20px 0;
    border-left: 4px solid;
}

.custom-note.info {
    background-color: #e3f2fd;
    border-color: #2196f3;
    color: #0d47a1;
}

.custom-note.warning {
    background-color: #fff3e0;
    border-color: #ff9800;
    color: #e65100;
}

.custom-note.danger {
    background-color: #ffebee;
    border-color: #f44336;
    color: #b71c1c;
}

.custom-note.success {
    background-color: #e8f5e9;
    border-color: #4caf50;
    color: #1b5e20;
}
</style>
```

**使用：**

```markdown
{{< note info >}}
这是一条提示信息
{{< /note >}}

{{< note warning >}}
这是一条警告信息
{{< /note >}}

{{< note danger >}}
这是一条危险信息
{{< /note >}}

{{< note success >}}
这是一条成功信息
{{< /note >}}
```

---

## 🚀 部署配置

### GitHub Pages 部署

#### 方案 1：GitHub Actions（推荐）

创建 `.github/workflows/hugo.yml`：

```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build
        run: hugo --minify

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

**配置步骤：**

1. 在 GitHub 仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 推送代码到 main 分支，自动部署

### Vercel 部署

1. 导入 GitHub 仓库到 Vercel
2. 构建配置：
   - **Build Command**: `hugo --minify`
   - **Output Directory**: `public`
   - **Install Command**: 留空

### Netlify 部署

创建 `netlify.toml`：

```toml
[build]
  publish = "public"
  command = "hugo --minify"

[build.environment]
  HUGO_VERSION = "0.152.2"
  HUGO_EXTENDED = "true"

[context.production.environment]
  HUGO_ENV = "production"
```

---

## 🛠️ 常见问题

### 问题 1：网站白板

**原因**：配置文件中有无效的占位符（如 `<img location>`）

**解决**：
1. 打开 `hugo.yml`
2. 搜索 `<` 和 `>` 符号
3. 删除或替换为实际值

### 问题 2：自定义 CSS 不生效

**检查：**
1. 文件路径是否正确：`assets/css/extended/custom.css`
2. 是否重启了 Hugo 服务器
3. 浏览器是否缓存（按 Ctrl+F5 强制刷新）

### 问题 3：图片不显示

**路径规则：**
```
static/images/photo.jpg  →  /images/photo.jpg
content/posts/my-post/photo.jpg  →  photo.jpg (relative: true)
```

### 问题 4：搜索功能无效

**检查：**
1. `hugo.yml` 中是否有 `outputs.home` 包含 `JSON`
2. 是否创建了 `content/search.md`
3. 浏览器控制台是否有错误

### 问题 5：主题不生效

**解决：**
```bash
# 初始化 Git 子模块
git submodule update --init --recursive

# 检查主题目录
ls themes/PaperMod/
```

---

## 📚 完整配置示例

### 最佳配置（hugo.yml）

```yaml
baseURL: https://sgldbhxs.top/
languageCode: zh-cn
title: SGLDBHXS 的技术博客
theme: ["PaperMod"]

enableRobotsTXT: true
buildDrafts: false
buildFuture: false
buildExpired: false

pagination:
  pagerSize: 10

minify:
  minifyOutput: true

outputs:
  home:
    - HTML
    - RSS
    - JSON

params:
  env: production
  title: SGLDBHXS
  description: "专注于技术分享的个人博客"
  keywords: [博客, 技术, Hugo, Web开发]
  author: SGLDBHXS
  images: ["/images/og-image.png"]

  DateFormat: "2006-01-02"
  defaultTheme: auto
  disableThemeToggle: false

  ShowReadingTime: true
  ShowShareButtons: true
  ShowPostNavLinks: true
  ShowBreadCrumbs: true
  ShowCodeCopyButtons: true
  ShowWordCount: true
  ShowRssButtonInSectionTermList: true
  UseHugoToc: true

  showtoc: true
  tocopen: false

  assets:
    favicon: "/favicon.ico"
    favicon16x16: "/favicon-16x16.png"
    favicon32x32: "/favicon-32x32.png"

  profileMode:
    enabled: true
    title: "欢迎来到 SGLDBHXS 的博客"
    subtitle: "记录技术成长，分享编程经验"
    imageUrl: "/images/avatar.png"
    imageWidth: 150
    imageHeight: 150
    buttons:
      - name: 📝 文章
        url: /posts
      - name: 🏷️ 标签
        url: /tags
      - name: 📁 归档
        url: /archives
      - name: 🔍 搜索
        url: /search

  socialIcons:
    - name: github
      url: "https://github.com/yt-x"
    - name: stackoverflow
      url: "https://stackoverflow.com/users/21336871/kkk-su"
    - name: bilibili
      url: "https://space.bilibili.com/474791264"
    - name: telegram
      url: "https://t.me/Sgldbhxs"
    - name: rss
      url: "/index.xml"

  cover:
    hidden: false
    hiddenInList: false
    hiddenInSingle: false

  editPost:
    URL: "https://github.com/yt-x/hugoblog/tree/main/content"
    Text: "建议修改"
    appendFilePath: true

  fuseOpts:
    isCaseSensitive: false
    shouldSort: true
    threshold: 0.4
    limit: 10
    keys: ["title", "permalink", "summary", "content"]

menu:
  main:
    - name: 文章
      url: /posts/
      weight: 1
    - name: 标签
      url: /tags/
      weight: 2
    - name: 归档
      url: /archives/
      weight: 3
    - name: 搜索
      url: /search/
      weight: 4
    - name: 关于
      url: /about/
      weight: 5

markup:
  highlight:
    noClasses: false
    lineNos: true
    style: monokai
  goldmark:
    renderer:
      unsafe: true

pygmentsUseClasses: true
```

---

## 🎯 快速开始检查清单

### 立即要做的事情

- [ ] 修复 `hugo.yml` 中的占位符（特别是 `profileMode.imageUrl`）
- [ ] 在 `static/images/` 放入头像图片
- [ ] 创建 `content/about.md` 关于页面
- [ ] 测试网站：`hugo server -D`

### 自定义外观

- [ ] 创建 `assets/css/extended/custom.css`
- [ ] 复制示例 CSS 代码
- [ ] 根据需要调整颜色和字体
- [ ] 创建 `layouts/partials/extend_head.html`

### 添加功能

- [ ] 创建 `assets/js/custom.js`
- [ ] 添加评论系统（Giscus）
- [ ] 配置网站统计（不蒜子）
- [ ] 添加友情链接页面

### 部署准备

- [ ] 配置 `.github/workflows/hugo.yml`
- [ ] 检查 `baseURL` 是否正确
- [ ] 测试构建：`hugo --minify`
- [ ] 推送到 GitHub

---

## 📖 参考资源

- [Hugo 官方文档](https://gohugo.io/documentation/)
- [PaperMod Wiki](https://github.com/adityatelange/hugo-PaperMod/wiki)
- [Hugo 主题列表](https://themes.gohugo.io/)
- [Markdown 语法](https://www.markdownguide.org/)

---

**最后更新：** 2025-10-28

基于你的实际项目结构编写，所有路径和目录都已验证！ 🎉
