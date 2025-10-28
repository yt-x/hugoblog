# Hugo 模板编写完全指南

> 深入理解 Hugo 模板系统、编写方法以及页面渲染流程

---

## 目录

1. [Hugo 模板系统概述](#1-hugo-模板系统概述)
2. [模板层次结构](#2-模板层次结构)
3. [页面渲染流程](#3-页面渲染流程)
4. [模板语法详解](#4-模板语法详解)
5. [常用模板函数](#5-常用模板函数)
6. [实战案例](#6-实战案例)
7. [调试技巧](#7-调试技巧)

---

## 1. Hugo 模板系统概述

### 什么是模板？

模板是 HTML 文件 + Go 模板语法，用于定义网页的结构和内容展示方式。

```
内容（Markdown）+ 模板（HTML + Go Template）= 最终页面（HTML）
```

### Hugo 模板引擎

Hugo 使用 **Go 模板引擎**（text/template 和 html/template）：

```
.md 文件（内容）
    ↓
Hugo 处理
    ↓
应用模板（.html）
    ↓
生成最终 HTML
    ↓
输出到 public/
```

### 模板的作用

| 模板类型 | 作用 | 示例 |
|----------|------|------|
| **基础模板** | 定义页面骨架 | `baseof.html` |
| **列表模板** | 显示内容列表 | `list.html`（首页、分类页） |
| **单页模板** | 显示单篇内容 | `single.html`（文章页） |
| **部分模板** | 可复用组件 | `header.html`, `footer.html` |
| **短代码** | Markdown 中的特殊标签 | `{{< youtube >}}` |

---

## 2. 模板层次结构

### 完整的模板查找顺序

Hugo 按照以下优先级查找模板：

```
1. 项目 layouts/ 目录       ⭐ 优先级最高
2. 主题 themes/xxx/layouts/ 目录
```

### 目录结构详解

```
hugoblog/
├── layouts/                         # 🎨 你的自定义模板（优先级高）
│   ├── _default/                   # 默认模板
│   │   ├── baseof.html             # 基础模板（所有页面继承）
│   │   ├── list.html               # 列表页模板
│   │   ├── single.html             # 单页模板
│   │   └── terms.html              # 分类/标签页模板
│   │
│   ├── partials/                   # 部分模板（可复用组件）
│   │   ├── header.html             # 页头
│   │   ├── footer.html             # 页脚
│   │   ├── head.html               # <head> 部分
│   │   └── extend_head.html        # 扩展 head
│   │
│   ├── shortcodes/                 # 短代码
│   │   └── note.html               # 自定义短代码
│   │
│   ├── index.html                  # 首页专用模板
│   └── 404.html                    # 404 页面
│
└── themes/PaperMod/layouts/        # 主题模板（优先级低）
    └── （主题提供的所有模板）
```

### 模板查找规则（重要！）

当 Hugo 需要渲染一个页面时，会按顺序查找：

**示例：渲染文章页面**

```
查找顺序：
1. layouts/posts/single.html          ← 特定 section
2. layouts/_default/single.html       ← 默认 single
3. themes/PaperMod/layouts/posts/single.html
4. themes/PaperMod/layouts/_default/single.html  ← 最终使用
```

**覆盖规则：**

```
要覆盖主题的 footer.html：
1. 复制 themes/PaperMod/layouts/partials/footer.html
2. 粘贴到 layouts/partials/footer.html
3. 修改你的版本
4. Hugo 会优先使用你的版本 ✅
```

---

## 3. 页面渲染流程

### 完整渲染流程

```
1. 用户访问 URL
   ↓
2. Hugo 确定页面类型（首页/列表页/单页）
   ↓
3. 加载对应的模板
   ↓
4. 从 content/ 读取内容
   ↓
5. 应用 front matter 配置
   ↓
6. 执行模板代码（Go Template）
   ↓
7. 渲染部分模板（partials）
   ↓
8. 生成最终 HTML
   ↓
9. 输出到 public/
```

### 页面类型与模板对应

| 页面类型 | URL 示例 | 使用的模板 | 说明 |
|----------|----------|------------|------|
| **首页** | `/` | `index.html` 或 `list.html` | 网站首页 |
| **列表页** | `/posts/` | `list.html` | 文章列表 |
| **单页** | `/posts/my-article/` | `single.html` | 单篇文章 |
| **分类页** | `/categories/` | `terms.html` | 所有分类 |
| **分类列表** | `/categories/tech/` | `taxonomy.html` 或 `list.html` | 某分类下的文章 |
| **标签页** | `/tags/` | `terms.html` | 所有标签 |

### 模板继承关系

```html
<!-- baseof.html（基础模板）-->
<!DOCTYPE html>
<html>
<head>
    {{- partial "head.html" . -}}
</head>
<body>
    {{- partial "header.html" . -}}

    <main>
        {{- block "main" . }}{{- end }}  ← 子模板填充这里
    </main>

    {{- partial "footer.html" . -}}
</body>
</html>

<!-- single.html（继承 baseof.html）-->
{{ define "main" }}
    <article>
        <h1>{{ .Title }}</h1>
        {{ .Content }}
    </article>
{{ end }}

<!-- 最终输出 -->
<!DOCTYPE html>
<html>
<head>...</head>
<body>
    <header>...</header>
    <main>
        <article>
            <h1>文章标题</h1>
            <p>文章内容...</p>
        </article>
    </main>
    <footer>...</footer>
</body>
</html>
```

---

## 4. 模板语法详解

### 4.1 基础语法

#### 变量输出

```go
{{ .Title }}          // 输出标题
{{ .Content }}        // 输出内容
{{ .Date }}          // 输出日期
```

#### 注释

```go
{{/* 这是注释，不会出现在 HTML 中 */}}

{{- /* 带 - 的注释会移除前面的空格 */ -}}
```

#### 去除空格

```go
{{- .Title -}}       // 移除前后空格
{{ .Title }}         // 保留空格
```

### 4.2 条件判断

```go
<!-- if 语句 -->
{{ if .Params.ShowToc }}
    <div class="toc">目录</div>
{{ end }}

<!-- if-else -->
{{ if .Title }}
    <h1>{{ .Title }}</h1>
{{ else }}
    <h1>无标题</h1>
{{ end }}

<!-- if-else if-else -->
{{ if eq .Type "posts" }}
    <p>这是文章</p>
{{ else if eq .Type "pages" }}
    <p>这是页面</p>
{{ else }}
    <p>其他类型</p>
{{ end }}

<!-- 多个条件 -->
{{ if and .Title .Date }}
    有标题且有日期
{{ end }}

{{ if or .Params.draft .Params.expired }}
    草稿或已过期
{{ end }}

<!-- 否定 -->
{{ if not .IsHome }}
    不是首页
{{ end }}
```

### 4.3 循环

```go
<!-- range 遍历 -->
{{ range .Pages }}
    <h2>{{ .Title }}</h2>
    <p>{{ .Summary }}</p>
{{ end }}

<!-- 带索引 -->
{{ range $index, $page := .Pages }}
    <div>{{ $index }}: {{ $page.Title }}</div>
{{ end }}

<!-- 带 else（集合为空时）-->
{{ range .Pages }}
    <h2>{{ .Title }}</h2>
{{ else }}
    <p>没有文章</p>
{{ end }}
```

### 4.4 变量

```go
<!-- 定义变量 -->
{{ $title := .Title }}
{{ $title }}

<!-- 修改变量 -->
{{ $count := 0 }}
{{ $count = add $count 1 }}

<!-- 使用变量 -->
{{ $image := .Params.cover.image }}
{{ if $image }}
    <img src="{{ $image }}" alt="封面">
{{ end }}
```

### 4.5 部分模板（Partials）

```go
<!-- 引入部分模板 -->
{{ partial "header.html" . }}

<!-- 传递数据 -->
{{ partial "post-meta.html" . }}

<!-- 传递自定义数据 -->
{{ partial "sidebar.html" (dict "title" "侧边栏" "items" .Pages) }}

<!-- 检查部分模板是否存在 -->
{{ if templates.Exists "partials/custom.html" }}
    {{ partial "custom.html" . }}
{{ end }}
```

### 4.6 函数调用

```go
<!-- 字符串函数 -->
{{ upper .Title }}              // 大写
{{ lower .Title }}              // 小写
{{ title .Title }}              // 首字母大写
{{ truncate 100 .Summary }}     // 截断到 100 字符

<!-- 数学函数 -->
{{ add 1 2 }}                   // 加法: 3
{{ sub 5 2 }}                   // 减法: 3
{{ mul 2 3 }}                   // 乘法: 6
{{ div 10 2 }}                  // 除法: 5

<!-- 比较函数 -->
{{ eq .Type "posts" }}          // 等于
{{ ne .Type "pages" }}          // 不等于
{{ gt .WordCount 1000 }}        // 大于
{{ lt .WordCount 500 }}         // 小于
{{ ge .ReadingTime 5 }}         // 大于等于
{{ le .ReadingTime 3 }}         // 小于等于

<!-- 日期函数 -->
{{ .Date.Format "2006-01-02" }}
{{ dateFormat "January 2, 2006" .Date }}

<!-- URL 函数 -->
{{ .Permalink }}                // 完整 URL
{{ .RelPermalink }}             // 相对 URL
{{ absURL .RelPermalink }}      // 绝对 URL
{{ relURL "/images/photo.jpg" }}

<!-- 集合函数 -->
{{ len .Pages }}                // 长度
{{ first 5 .Pages }}            // 前 5 个
{{ after 2 .Pages }}            // 跳过前 2 个
{{ where .Pages "Type" "posts" }}
```

---

## 5. 常用模板函数

### 5.1 页面变量（Page Variables）

```go
// 基础信息
{{ .Title }}           // 标题
{{ .Content }}         // 内容（HTML）
{{ .Summary }}         // 摘要
{{ .Description }}     // 描述
{{ .Date }}           // 日期
{{ .Lastmod }}        // 最后修改日期
{{ .PublishDate }}    // 发布日期

// 页面属性
{{ .Type }}           // 类型（posts, pages 等）
{{ .Kind }}           // 种类（page, home, section 等）
{{ .Section }}        // 所属 section
{{ .WordCount }}      // 字数
{{ .ReadingTime }}    // 阅读时间（分钟）
{{ .Draft }}          // 是否草稿

// URL 相关
{{ .Permalink }}      // https://example.com/posts/my-article/
{{ .RelPermalink }}   // /posts/my-article/
{{ .URL }}            // URL 路径

// 分类和标签
{{ .Params.tags }}        // 标签列表
{{ .Params.categories }}  // 分类列表

// 自定义参数
{{ .Params.author }}      // Front Matter 中的 author
{{ .Params.cover.image }} // Front Matter 中的嵌套参数
```

### 5.2 网站变量（Site Variables）

```go
// 基础配置
{{ site.Title }}              // 网站标题
{{ site.BaseURL }}           // 基础 URL
{{ site.LanguageCode }}      // 语言代码
{{ site.Copyright }}         // 版权信息

// 参数
{{ site.Params.author }}     // hugo.yml 中的 params.author
{{ site.Params.description }}

// 内容
{{ site.Pages }}             // 所有页面
{{ site.RegularPages }}      // 所有普通页面（不含 section）

// 分类
{{ site.Taxonomies.tags }}   // 所有标签
{{ site.Taxonomies.categories }}

// 菜单
{{ site.Menus.main }}        // 主菜单
```

### 5.3 字符串处理

```go
<!-- 大小写 -->
{{ upper "hello" }}           // HELLO
{{ lower "WORLD" }}          // world
{{ title "hello world" }}    // Hello World

<!-- 替换 -->
{{ replace "Hello World" " " "-" }}  // Hello-World

<!-- 截断 -->
{{ truncate 50 .Summary }}           // 截断到 50 字符
{{ truncate 50 "..." .Summary }}     // 自定义结束符

<!-- 去除 HTML -->
{{ .Content | plainify }}

<!-- Markdown 转 HTML -->
{{ .Content | markdownify }}

<!-- 安全 HTML -->
{{ .Content | safeHTML }}
```

### 5.4 图片处理

```go
<!-- 获取资源 -->
{{ $image := resources.Get "images/photo.jpg" }}

<!-- 调整大小 -->
{{ $resized := $image.Resize "600x" }}
<img src="{{ $resized.RelPermalink }}">

<!-- 裁剪 -->
{{ $cropped := $image.Fill "300x200" }}

<!-- 格式转换 -->
{{ $webp := $image.Resize "800x webp" }}
```

### 5.5 条件函数

```go
<!-- with：检查变量是否存在 -->
{{ with .Params.author }}
    作者：{{ . }}
{{ end }}

<!-- cond：三元运算符 -->
{{ $class := cond .IsHome "home" "page" }}
<body class="{{ $class }}">

<!-- default：默认值 -->
{{ $author := default "匿名" .Params.author }}
```

### 5.6 集合操作

```go
<!-- where：过滤 -->
{{ $posts := where site.RegularPages "Type" "posts" }}
{{ $drafts := where .Pages "Draft" true }}

<!-- first：取前 N 个 -->
{{ range first 5 .Pages }}
    {{ .Title }}
{{ end }}

<!-- after：跳过前 N 个 -->
{{ range after 3 .Pages }}
    {{ .Title }}
{{ end }}

<!-- sort：排序 -->
{{ range sort .Pages "Date" "desc" }}
    {{ .Title }}
{{ end }}

<!-- group：分组 -->
{{ range .Pages.GroupByDate "2006" }}
    <h2>{{ .Key }}</h2>
    {{ range .Pages }}
        <p>{{ .Title }}</p>
    {{ end }}
{{ end }}
```

---

## 6. 实战案例

### 案例 1：自定义 header.html

```html
<!-- layouts/partials/header.html -->
<header class="site-header">
    <div class="container">
        <!-- Logo -->
        <div class="logo">
            <a href="{{ "/" | relURL }}">
                {{- if site.Params.logo -}}
                    <img src="{{ site.Params.logo | relURL }}" alt="{{ site.Title }}">
                {{- else -}}
                    <span>{{ site.Title }}</span>
                {{- end -}}
            </a>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav">
            <ul>
                {{- range site.Menus.main -}}
                <li class="{{ if or (eq $.RelPermalink .URL) ($.IsMenuCurrent "main" .) }}active{{ end }}">
                    <a href="{{ .URL | relURL }}">
                        {{ .Name }}
                    </a>
                </li>
                {{- end -}}
            </ul>
        </nav>

        <!-- 主题切换按钮 -->
        {{- if not site.Params.disableThemeToggle -}}
        <button id="theme-toggle" aria-label="切换主题">
            <span class="icon">🌓</span>
        </button>
        {{- end -}}
    </div>
</header>
```

### 案例 2：自定义 footer.html

```html
<!-- layouts/partials/footer.html -->
<footer class="footer">
    <div class="container">
        <!-- 版权信息 -->
        <div class="copyright">
            {{- if site.Copyright -}}
                {{ site.Copyright | markdownify }}
            {{- else -}}
                &copy; {{ now.Year }}
                <a href="{{ "/" | relURL }}">{{ site.Title }}</a>
            {{- end -}}
        </div>

        <!-- Powered by -->
        <div class="powered">
            Powered by
            <a href="https://gohugo.io/" target="_blank">Hugo</a>
            {{ with site.Params.theme }}
                & <a href="{{ . }}" target="_blank">{{ site.Params.themeName }}</a>
            {{ end }}
        </div>

        <!-- 社交图标 -->
        {{- if site.Params.socialIcons -}}
        <div class="social">
            {{- range site.Params.socialIcons -}}
            <a href="{{ .url }}" target="_blank" rel="noopener noreferrer" aria-label="{{ .name }}">
                {{ partial "svg.html" .name }}
            </a>
            {{- end -}}
        </div>
        {{- end -}}

        <!-- 备案信息 -->
        {{- with site.Params.icp -}}
        <div class="icp">
            <a href="https://beian.miit.gov.cn/" target="_blank">{{ . }}</a>
        </div>
        {{- end -}}
    </div>
</footer>

<style>
.footer {
    background: var(--theme);
    padding: 30px 0;
    margin-top: 60px;
}

.footer .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    text-align: center;
}

.footer a {
    color: var(--primary);
    text-decoration: none;
}

.footer a:hover {
    text-decoration: underline;
}

.social {
    display: flex;
    gap: 15px;
}

.social svg {
    width: 24px;
    height: 24px;
    fill: var(--primary);
    transition: fill 0.2s;
}

.social a:hover svg {
    fill: var(--link);
}
</style>
```

### 案例 3：文章元信息（post_meta.html）

```html
<!-- layouts/partials/post_meta.html -->
<div class="post-meta">
    <!-- 日期 -->
    <span class="meta-item date">
        <svg><!-- 日历图标 --></svg>
        <time datetime="{{ .Date.Format "2006-01-02" }}">
            {{ .Date.Format (default "2006-01-02" site.Params.DateFormat) }}
        </time>
    </span>

    <!-- 作者 -->
    {{- with .Params.author -}}
    <span class="meta-item author">
        <svg><!-- 用户图标 --></svg>
        <span>{{ . }}</span>
    </span>
    {{- end -}}

    <!-- 字数和阅读时间 -->
    {{- if site.Params.ShowWordCount -}}
    <span class="meta-item words">
        <svg><!-- 文档图标 --></svg>
        <span>{{ .WordCount }} 字</span>
    </span>
    {{- end -}}

    {{- if site.Params.ShowReadingTime -}}
    <span class="meta-item reading-time">
        <svg><!-- 时钟图标 --></svg>
        <span>{{ .ReadingTime }} 分钟</span>
    </span>
    {{- end -}}

    <!-- 分类 -->
    {{- with .Params.categories -}}
    <span class="meta-item categories">
        <svg><!-- 文件夹图标 --></svg>
        {{- range . -}}
        <a href="{{ "/categories/" | relURL }}{{ . | urlize }}/">{{ . }}</a>
        {{- end -}}
    </span>
    {{- end -}}

    <!-- 标签 -->
    {{- with .Params.tags -}}
    <span class="meta-item tags">
        <svg><!-- 标签图标 --></svg>
        {{- range . -}}
        <a href="{{ "/tags/" | relURL }}{{ . | urlize }}/" class="tag">{{ . }}</a>
        {{- end -}}
    </span>
    {{- end -}}
</div>

<style>
.post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    color: var(--secondary);
    font-size: 14px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.meta-item svg {
    width: 16px;
    height: 16px;
}

.meta-item a {
    color: var(--secondary);
    text-decoration: none;
}

.meta-item a:hover {
    color: var(--primary);
}

.tag {
    background: var(--entry);
    padding: 2px 8px;
    border-radius: 4px;
}
</style>
```

### 案例 4：目录（toc.html）

```html
<!-- layouts/partials/toc.html -->
{{- if and (.Params.showtoc) (gt .WordCount 400) -}}
<div class="toc">
    <div class="toc-header">
        <h3>目录</h3>
        <button class="toc-toggle" aria-label="展开/折叠目录">
            <span class="icon">{{ if .Params.TocOpen }}▼{{ else }}▶{{ end }}</span>
        </button>
    </div>

    <div class="toc-content {{ if .Params.TocOpen }}open{{ end }}">
        {{- if site.Params.UseHugoToc -}}
            {{ .TableOfContents }}
        {{- else -}}
            <!-- 自定义目录处理 -->
            <nav id="TableOfContents">
                {{ .TableOfContents }}
            </nav>
        {{- end -}}
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.toc-toggle');
    const content = document.querySelector('.toc-content');
    const icon = toggle.querySelector('.icon');

    toggle.addEventListener('click', function() {
        content.classList.toggle('open');
        icon.textContent = content.classList.contains('open') ? '▼' : '▶';
    });

    // 高亮当前标题
    const links = document.querySelectorAll('.toc-content a');
    const headings = document.querySelectorAll('h2, h3, h4');

    window.addEventListener('scroll', function() {
        let current = '';

        headings.forEach(heading => {
            const top = heading.offsetTop;
            if (window.pageYOffset >= top - 100) {
                current = heading.id;
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});
</script>

<style>
.toc {
    background: var(--entry);
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.toc-header h3 {
    margin: 0;
    font-size: 18px;
}

.toc-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
}

.toc-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.toc-content.open {
    max-height: 500px;
    overflow-y: auto;
}

.toc-content ul {
    list-style: none;
    padding-left: 0;
}

.toc-content li {
    margin: 5px 0;
}

.toc-content li li {
    margin-left: 20px;
}

.toc-content a {
    color: var(--secondary);
    text-decoration: none;
    transition: color 0.2s;
}

.toc-content a:hover,
.toc-content a.active {
    color: var(--primary);
}
</style>
{{- end -}}
```

### 案例 5：面包屑导航（breadcrumbs.html）

```html
<!-- layouts/partials/breadcrumbs.html -->
{{- if not .IsHome -}}
<nav class="breadcrumbs" aria-label="面包屑导航">
    <ol>
        <!-- 首页 -->
        <li>
            <a href="{{ "/" | relURL }}">
                <svg><!-- 首页图标 --></svg>
                <span>首页</span>
            </a>
        </li>

        <!-- Section -->
        {{- if .Section -}}
        <li>
            <span class="separator">/</span>
            <a href="{{ "/\((.Section)/" | relURL }}">
                {{ .Section | humanize | title }}
            </a>
        </li>
        {{- end -}}

        <!-- 当前页面 -->
        {{- if not .IsSection -}}
        <li>
            <span class="separator">/</span>
            <span class="current" aria-current="page">{{ .Title }}</span>
        </li>
        {{- end -}}
    </ol>
</nav>

<style>
.breadcrumbs {
    margin: 20px 0;
    font-size: 14px;
}

.breadcrumbs ol {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
}

.breadcrumbs li {
    display: flex;
    align-items: center;
}

.breadcrumbs a {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--secondary);
    text-decoration: none;
}

.breadcrumbs a:hover {
    color: var(--primary);
}

.breadcrumbs .separator {
    margin: 0 10px;
    color: var(--tertiary);
}

.breadcrumbs .current {
    color: var(--primary);
    font-weight: 500;
}
</style>
{{- end -}}
```

### 案例 6：相关文章（related.html）

```html
<!-- layouts/partials/related.html -->
{{- $related := .Site.RegularPages.Related . | first 3 -}}

{{- if $related -}}
<div class="related-posts">
    <h3>相关文章</h3>
    <div class="posts-grid">
        {{- range $related -}}
        <article class="post-card">
            {{- if .Params.cover.image -}}
            <a href="{{ .RelPermalink }}" class="cover">
                <img src="{{ .Params.cover.image | relURL }}" alt="{{ .Title }}" loading="lazy">
            </a>
            {{- end -}}

            <div class="content">
                <h4>
                    <a href="{{ .RelPermalink }}">{{ .Title }}</a>
                </h4>

                <p class="summary">
                    {{ .Summary | truncate 100 }}
                </p>

                <div class="meta">
                    <time datetime="{{ .Date.Format "2006-01-02" }}">
                        {{ .Date.Format "2006-01-02" }}
                    </time>
                    <span class="reading-time">{{ .ReadingTime }} 分钟</span>
                </div>
            </div>
        </article>
        {{- end -}}
    </div>
</div>

<style>
.related-posts {
    margin-top: 60px;
    padding-top: 40px;
    border-top: 2px solid var(--tertiary);
}

.related-posts h3 {
    margin-bottom: 20px;
    font-size: 24px;
}

.posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.post-card {
    background: var(--entry);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
}

.post-card:hover {
    transform: translateY(-4px);
}

.post-card .cover img {
    width: 100%;
    height: 160px;
    object-fit: cover;
}

.post-card .content {
    padding: 15px;
}

.post-card h4 {
    margin: 0 0 10px;
    font-size: 18px;
}

.post-card h4 a {
    color: var(--primary);
    text-decoration: none;
}

.post-card .summary {
    color: var(--secondary);
    font-size: 14px;
    margin: 10px 0;
}

.post-card .meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--tertiary);
}
</style>
{{- end -}}
```

---

## 7. 调试技巧

### 7.1 打印变量

```go
<!-- 调试输出 -->
{{ printf "%#v" . }}              // 打印整个上下文
{{ printf "%#v" .Params }}        // 打印参数
{{ printf "Title: %s" .Title }}   // 格式化输出

<!-- 查看所有页面变量 -->
<pre>{{ . | jsonify (dict "indent" "  ") }}</pre>
```

### 7.2 条件调试

```go
<!-- 仅在开发环境显示 -->
{{ if eq hugo.Environment "development" }}
    <div class="debug">
        <h3>调试信息</h3>
        <pre>{{ . | jsonify (dict "indent" "  ") }}</pre>
    </div>
{{ end }}
```

### 7.3 查看模板路径

```go
<!-- 显示当前使用的模板 -->
<!-- hugo server --debug 会在 HTML 注释中显示 -->
```

### 7.4 常见错误

#### 错误 1：变量未定义

```go
<!-- ❌ 错误 -->
{{ .Params.customField }}

<!-- ✅ 使用 with 检查 -->
{{ with .Params.customField }}
    {{ . }}
{{ else }}
    默认值
{{ end }}

<!-- ✅ 使用 default -->
{{ default "默认值" .Params.customField }}
```

#### 错误 2：模板未找到

```
Error: partial "xxx.html" not found

解决：
1. 检查文件路径：layouts/partials/xxx.html
2. 检查文件名拼写
3. 确保文件在正确的目录
```

#### 错误 3：语法错误

```go
<!-- ❌ 忘记结束标签 -->
{{ if .Title }}
    <h1>{{ .Title }}</h1>
<!-- 缺少 {{ end }} -->

<!-- ✅ 正确 -->
{{ if .Title }}
    <h1>{{ .Title }}</h1>
{{ end }}
```

---

## 8. 模板最佳实践

### 8.1 性能优化

```go
<!-- ❌ 低效：重复查询 -->
{{ range .Pages }}
    {{ if eq .Type "posts" }}
        {{ .Title }}
    {{ end }}
{{ end }}

<!-- ✅ 高效：先过滤 -->
{{ $posts := where .Pages "Type" "posts" }}
{{ range $posts }}
    {{ .Title }}
{{ end }}
```

### 8.2 代码复用

```go
<!-- ❌ 重复代码 -->
<div class="meta">
    <span>{{ .Date.Format "2006-01-02" }}</span>
    <span>{{ .ReadingTime }} 分钟</span>
</div>

<!-- ✅ 使用 partial -->
{{ partial "post-meta.html" . }}
```

### 8.3 安全性

```go
<!-- ❌ XSS 风险 -->
{{ .Params.userInput }}

<!-- ✅ HTML 转义 -->
{{ .Params.userInput | htmlEscape }}

<!-- 如果需要 HTML -->
{{ .Params.trustedHTML | safeHTML }}
```

### 8.4 可读性

```go
<!-- ❌ 难以阅读 -->
{{if .Title}}{{.Title}}{{else}}无标题{{end}}

<!-- ✅ 格式化 -->
{{ if .Title }}
    {{ .Title }}
{{ else }}
    无标题
{{ end }}
```

---

## 9. 完整示例：自定义文章页面

```html
<!-- layouts/_default/single.html -->
{{ define "main" }}
<article class="post">
    <!-- 头部 -->
    <header class="post-header">
        <!-- 面包屑 -->
        {{- partial "breadcrumbs.html" . -}}

        <!-- 标题 -->
        <h1 class="post-title">{{ .Title }}</h1>

        <!-- 元信息 -->
        {{- partial "post_meta.html" . -}}

        <!-- 封面图 -->
        {{- if .Params.cover.image -}}
        <div class="post-cover">
            <img src="{{ .Params.cover.image | relURL }}"
                 alt="{{ default .Title .Params.cover.alt }}"
                 loading="lazy">
            {{- with .Params.cover.caption -}}
            <p class="caption">{{ . | markdownify }}</p>
            {{- end -}}
        </div>
        {{- end -}}
    </header>

    <!-- 目录 -->
    {{- partial "toc.html" . -}}

    <!-- 正文 -->
    <div class="post-content">
        {{ .Content }}
    </div>

    <!-- 底部 -->
    <footer class="post-footer">
        <!-- 标签 -->
        {{- if .Params.tags -}}
        <div class="tags">
            {{- range .Params.tags -}}
            <a href="{{ "/tags/" | relURL }}{{ . | urlize }}/" class="tag">
                #{{ . }}
            </a>
            {{- end -}}
        </div>
        {{- end -}}

        <!-- 分享按钮 -->
        {{- partial "share_buttons.html" . -}}

        <!-- 编辑链接 -->
        {{- partial "edit_post.html" . -}}
    </footer>

    <!-- 相关文章 -->
    {{- partial "related.html" . -}}

    <!-- 评论 -->
    {{- partial "comments.html" . -}}
</article>
{{ end }}
```

---

## 10. 快速参考

### 常用语法速查

| 功能 | 语法 | 示例 |
|------|------|------|
| **输出变量** | `{{ .Var }}` | `{{ .Title }}` |
| **条件** | `{{ if }} {{ end }}` | `{{ if .Title }}...{{ end }}` |
| **循环** | `{{ range }} {{ end }}` | `{{ range .Pages }}...{{ end }}` |
| **部分模板** | `{{ partial }}` | `{{ partial "header.html" . }}` |
| **注释** | `{{/* */}}` | `{{/* 注释 */}}` |
| **变量** | `{{ $var := }}` | `{{ $title := .Title }}` |

### 常用变量速查

| 变量 | 说明 |
|------|------|
| `.Title` | 标题 |
| `.Content` | 内容 |
| `.Summary` | 摘要 |
| `.Date` | 日期 |
| `.Permalink` | 完整 URL |
| `.Params` | 自定义参数 |
| `site.Title` | 网站标题 |
| `site.Pages` | 所有页面 |

---

**最后更新：** 2025-10-28

这是一份完整的 Hugo 模板编写指南，涵盖了从基础到高级的所有知识点！🎉
