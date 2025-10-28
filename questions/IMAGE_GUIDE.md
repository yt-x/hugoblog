# Hugo 博客图片路径完全指南

> 详细讲解 Hugo 博客中图片的存放位置、引用方式、配置方法和最佳实践

---

## 📁 图片存放位置概览

### 完整的图片目录结构

```
hugoblog/                                    # 项目根目录
│
├── static/                                  # ⭐ 静态资源目录（你的图片主要放这里）
│   ├── images/                             # 图片目录（推荐）
│   │   ├── avatar.png                      # 头像
│   │   ├── og-image.png                    # 社交分享图
│   │   ├── cover-*.jpg                     # 文章封面图
│   │   └── posts/                          # 文章配图（可选子目录）
│   │       └── 2024/
│   │           └── article-1.jpg
│   │
│   ├── favicon.ico                         # 网站图标
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   └── safari-pinned-tab.svg
│
├── content/                                 # 内容目录
│   └── posts/
│       ├── my-post.md                      # 普通文章
│       │
│       └── my-post/                        # 📦 Page Bundle（推荐）
│           ├── index.md                    # 文章内容
│           ├── featured.jpg                # 文章专属图片
│           ├── diagram.png
│           └── screenshot.jpg
│
├── assets/                                  # 资源目录（需要处理的资源）
│   └── images/                             # 需要 Hugo 处理的图片
│       └── logo.svg                        # 例如需要优化的 SVG
│
├── themes/PaperMod/                        # 主题目录
│   ├── images/                             # 主题自带图片（不要修改）
│   │   ├── screenshot.png                  # 主题预览图
│   │   └── tn.png                          # 主题缩略图
│   │
│   └── assets/                             # 主题资源（不要修改）
│       ├── css/
│       └── js/
│
└── public/                                  # 🚫 构建输出（自动生成，不要编辑）
    ├── images/                             # static/images/ 的复制
    └── posts/
        └── my-post/                        # Page Bundle 图片的复制
```

---

## 🎯 三种图片路径详解

### 1. static/ 目录中的图片（最常用）⭐

#### 工作原理

```
static/ 目录中的所有文件会被直接复制到 public/ 根目录

static/images/avatar.png  →  public/images/avatar.png  →  /images/avatar.png
static/favicon.ico        →  public/favicon.ico        →  /favicon.ico
```

#### 适用场景

- ✅ 网站全局图片（头像、Logo、图标）
- ✅ 文章封面图
- ✅ 网站 Favicon
- ✅ 社交分享图（OpenGraph）
- ✅ 公共资源图片

#### 引用方式

**在 hugo.yml 配置文件中：**

```yaml
params:
  # ❌ 错误写法
  images: ["static/images/og-image.png"]        # 错误！
  images: ["images/og-image.png"]               # 错误！

  # ✅ 正确写法
  images: ["/images/og-image.png"]              # 正确！以 / 开头

  profileMode:
    imageUrl: "/images/avatar.png"              # 正确！

  assets:
    favicon: "/favicon.ico"                     # 正确！
    favicon16x16: "/favicon-16x16.png"
    apple_touch_icon: "/apple-touch-icon.png"

  label:
    icon: /apple-touch-icon.png                 # 正确！
```

**在 Markdown 文章中：**

```markdown
<!-- ✅ 绝对路径（推荐） -->
![头像](/images/avatar.png)
![封面图](/images/covers/post-1.jpg)

<!-- ❌ 错误写法 -->
![头像](static/images/avatar.png)              # 错误！
![头像](images/avatar.png)                     # 错误！（相对路径）
```

**在 HTML 模板中：**

```html
<!-- ✅ 正确写法 -->
<img src="/images/avatar.png" alt="头像">

<!-- ✅ 使用 Hugo 函数（更好） -->
<img src="{{ "/images/avatar.png" | absURL }}" alt="头像">
<!-- 输出: https://sgldbhxs.top/images/avatar.png -->

<img src="{{ "/images/avatar.png" | relURL }}" alt="头像">
<!-- 输出: /images/avatar.png -->
```

#### 目录组织建议

```
static/
├── images/                      # 图片主目录
│   ├── avatar.png              # 头像
│   ├── og-image.png            # OpenGraph 分享图
│   │
│   ├── covers/                 # 文章封面图
│   │   ├── tech-1.jpg
│   │   ├── tech-2.jpg
│   │   └── life-1.jpg
│   │
│   ├── posts/                  # 文章配图（按年份）
│   │   ├── 2024/
│   │   │   ├── 01-hugo-guide/
│   │   │   │   ├── screenshot-1.png
│   │   │   │   └── screenshot-2.png
│   │   │   └── 02-another-post/
│   │   └── 2025/
│   │
│   └── misc/                   # 其他图片
│       ├── logo.svg
│       └── banner.jpg
│
├── favicon.ico                 # 网站图标
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
└── safari-pinned-tab.svg
```

---

### 2. content/ 目录中的图片（Page Bundle）📦

#### 工作原理

使用 **Page Bundle** 将文章和图片放在一起：

```
content/posts/my-article/
├── index.md              # 文章内容（注意：必须是 index.md）
├── cover.jpg            # 文章封面
├── diagram.png          # 文章配图
└── screenshot.jpg       # 文章配图
```

**构建后：**

```
public/posts/my-article/
├── index.html           # 文章页面
├── cover.jpg           # 图片被复制到这里
├── diagram.png
└── screenshot.jpg
```

#### 适用场景

- ✅ 文章专属图片（不会被其他文章使用）
- ✅ 图片和文章一起管理（便于组织）
- ✅ 需要使用相对路径引用

#### 创建 Page Bundle

**步骤 1：创建文章目录**

```bash
# 在 content/posts/ 下创建文章目录
cd content/posts
mkdir my-article
cd my-article
```

**步骤 2：创建 index.md**

```markdown
---
title: "我的文章"
date: 2024-10-28
cover:
  image: "cover.jpg"        # ✅ 相对路径，指向同目录的 cover.jpg
  relative: true            # ⚠️ 必须设为 true
---

## 内容

这是一张图片：

![示意图](diagram.png)     <!-- ✅ 相对路径 -->
![截图](screenshot.jpg)    <!-- ✅ 相对路径 -->
```

**步骤 3：放入图片**

```
content/posts/my-article/
├── index.md
├── cover.jpg          ← 封面图
├── diagram.png        ← 配图1
└── screenshot.jpg     ← 配图2
```

#### 引用方式

**在 front matter 中：**

```yaml
---
title: "我的文章"
cover:
  image: "cover.jpg"        # ✅ 相对路径
  relative: true            # ⚠️ 必须设为 true！
  alt: "封面图"
---
```

**在 Markdown 内容中：**

```markdown
<!-- ✅ 相对路径（Page Bundle） -->
![图片说明](diagram.png)

<!-- ✅ 绝对路径（static 目录） -->
![全局图片](/images/logo.png)
```

#### Page Bundle vs 普通文章

| 类型 | 文件结构 | 图片引用 |
|------|----------|----------|
| **普通文章** | `content/posts/article.md` | 只能用绝对路径引用 `static/` 图片 |
| **Page Bundle** | `content/posts/article/index.md` | 可用相对路径引用同目录图片 |

---

### 3. assets/ 目录中的图片（高级）🔧

#### 工作原理

`assets/` 目录中的资源会被 **Hugo Pipes** 处理（优化、转换、合并）

```
assets/images/logo.svg  →  Hugo 处理  →  public/images/logo.min.svg
```

#### 适用场景

- ✅ 需要 Hugo 处理的图片（优化、调整大小）
- ✅ 需要使用 Hugo 图片处理功能
- ✅ SVG、图标等需要内联的资源

#### 使用方式

**在模板中：**

```html
{{- $image := resources.Get "images/logo.svg" -}}
{{- $resized := $image.Resize "300x" -}}
<img src="{{ $resized.RelPermalink }}" alt="Logo">
```

**在配置中：**

```yaml
# ❌ 不能直接在 hugo.yml 中引用 assets/
# assets/ 中的资源必须通过模板处理
```

#### 普通用户建议

**对于大多数用户：**
- ❌ 不需要使用 `assets/` 目录
- ✅ 直接使用 `static/` 目录即可

---

### 4. themes/ 目录中的图片（主题资源）🎨

#### 工作原理

主题自带的图片，用于：
- 主题预览图（screenshot.png）
- 主题说明图（tn.png）

```
themes/PaperMod/images/screenshot.png  →  主题展示用，不会出现在网站上
```

#### 注意事项

- ❌ **不要修改主题目录中的文件**
- ❌ **不要在配置中引用主题图片**
- ✅ 如果需要使用主题中的图片，复制到 `static/` 目录

---

## ⚙️ hugo.yml 配置中的图片路径

### 完整配置示例

```yaml
# ============================================
# hugo.yml 图片配置完整示例
# ============================================

params:
  # ---------- 社交分享图 ----------
  images: ["/images/og-image.png"]
  # 位置: static/images/og-image.png
  # 用途: Twitter Cards, Facebook OpenGraph, 微信分享
  # 尺寸: 1200x630 像素（推荐）
  # 格式: PNG/JPG

  # ---------- 网站图标 ----------
  assets:
    favicon: "/favicon.ico"
    # 位置: static/favicon.ico
    # 尺寸: 32x32 或 48x48 像素
    # 格式: ICO/PNG

    favicon16x16: "/favicon-16x16.png"
    # 位置: static/favicon-16x16.png
    # 尺寸: 16x16 像素
    # 格式: PNG

    favicon32x32: "/favicon-32x32.png"
    # 位置: static/favicon-32x32.png
    # 尺寸: 32x32 像素
    # 格式: PNG

    apple_touch_icon: "/apple-touch-icon.png"
    # 位置: static/apple-touch-icon.png
    # 尺寸: 180x180 像素
    # 格式: PNG

    safari_pinned_tab: "/safari-pinned-tab.svg"
    # 位置: static/safari-pinned-tab.svg
    # 格式: SVG（单色）

  # ---------- 网站标签图标（左上角）----------
  label:
    text: "Home"
    icon: /apple-touch-icon.png
    # 位置: static/apple-touch-icon.png
    # 尺寸: 建议 180x180 或更大
    # 格式: PNG/SVG
    iconHeight: 35

  # ---------- 首页 Profile 模式头像 ----------
  profileMode:
    enabled: true
    imageUrl: "/images/avatar.png"
    # 位置: static/images/avatar.png
    # 尺寸: 150x150 到 300x300 像素（推荐正方形）
    # 格式: PNG/JPG/WebP
    imageWidth: 150
    imageHeight: 150
```

### 路径规则总结

| 配置项 | 路径格式 | 实际文件位置 | 示例 |
|--------|----------|--------------|------|
| `images` | `/images/xxx.png` | `static/images/xxx.png` | `/images/og-image.png` |
| `favicon` | `/xxx.ico` | `static/xxx.ico` | `/favicon.ico` |
| `profileMode.imageUrl` | `/images/xxx.png` | `static/images/xxx.png` | `/images/avatar.png` |
| `label.icon` | `/xxx.png` | `static/xxx.png` | `/apple-touch-icon.png` |

**核心原则：**
1. ✅ 所有路径都以 `/` 开头（绝对路径）
2. ✅ 路径对应 `static/` 目录下的文件
3. ❌ 不要包含 `static/` 前缀
4. ❌ 不要使用相对路径（除非在 Page Bundle 中）

---

## 🖼️ 文章中的图片配置

### 1. 文章封面图

#### 方法 A：使用 static/ 目录图片

```markdown
---
title: "我的文章"
cover:
  image: "/images/covers/tech-1.jpg"    # ✅ 绝对路径
  alt: "封面图说明"
  caption: "图片来源：XXX"
  relative: false                        # ⚠️ 必须是 false
  hidden: false
---
```

**文件位置：** `static/images/covers/tech-1.jpg`

#### 方法 B：使用 Page Bundle

```markdown
---
title: "我的文章"
cover:
  image: "cover.jpg"                     # ✅ 相对路径
  alt: "封面图说明"
  relative: true                         # ⚠️ 必须是 true
  hidden: false
---
```

**文件结构：**
```
content/posts/my-article/
├── index.md        # 文章
└── cover.jpg       # 封面图（同目录）
```

### 2. 文章内配图

#### 使用 static/ 目录图片

```markdown
<!-- Markdown 语法 -->
![图片说明](/images/posts/2024/screenshot.png)

<!-- HTML 语法 -->
<img src="/images/posts/2024/screenshot.png" alt="图片说明" width="600">

<!-- Hugo Figure Shortcode -->
{{< figure src="/images/posts/2024/screenshot.png"
           title="图片标题"
           caption="图片说明"
           alt="替代文本" >}}
```

#### 使用 Page Bundle 图片

```markdown
<!-- 确保文章是 Page Bundle 格式 -->
<!-- content/posts/my-article/index.md -->

![截图](screenshot.png)              <!-- ✅ 相对路径 -->
![示意图](./diagram.png)             <!-- ✅ 显式相对路径 -->
```

---

## 📐 图片格式和尺寸建议

### 1. 图片格式选择

| 用途 | 推荐格式 | 次选格式 | 说明 |
|------|----------|----------|------|
| **文章配图** | WebP | JPG/PNG | WebP 体积小，质量高 |
| **文章封面** | WebP | JPG | 大图优先 WebP |
| **头像/Logo** | PNG | WebP/SVG | 需要透明背景用 PNG |
| **图标** | SVG | PNG | 矢量图优先 SVG |
| **Favicon** | ICO | PNG | 兼容性最好用 ICO |
| **社交分享图** | JPG/PNG | WebP | 兼容性考虑用 JPG |
| **截图** | PNG | WebP | 保持清晰度用 PNG |
| **照片** | JPG | WebP | 文件体积最小 |

### 2. 各类图片尺寸建议

#### 网站图标（Favicon）

```yaml
favicon.ico               # 32x32 或 48x48 px
favicon-16x16.png         # 16x16 px
favicon-32x32.png         # 32x32 px
apple-touch-icon.png      # 180x180 px
safari-pinned-tab.svg     # 单色 SVG，任意尺寸
```

**工具：** [RealFaviconGenerator](https://realfavicongenerator.net/)

#### 社交分享图（OpenGraph）

```yaml
images: ["/images/og-image.png"]
```

- **尺寸：** 1200×630 像素（推荐）
- **最小：** 600×315 像素
- **格式：** JPG（压缩质量 85%）或 PNG
- **文件大小：** < 1MB

**平台要求：**
- **Twitter：** 1200×675 px（16:9）
- **Facebook：** 1200×630 px（1.91:1）
- **LinkedIn：** 1200×627 px

#### 头像/Profile 图片

```yaml
profileMode:
  imageUrl: "/images/avatar.png"
  imageWidth: 150
  imageHeight: 150
```

- **尺寸：** 150×150 到 300×300 像素（正方形）
- **格式：** PNG（有透明背景）或 JPG
- **文件大小：** < 100KB

#### 文章封面图

```yaml
cover:
  image: "/images/covers/article-1.jpg"
```

- **尺寸：** 1200×600 到 1920×1080 像素
- **比例：** 16:9 或 2:1
- **格式：** WebP（首选）或 JPG
- **文件大小：** < 500KB

#### 文章内配图

- **宽度：** 800-1200 像素（自适应）
- **格式：** WebP 或 PNG（截图）
- **文件大小：** < 300KB

---

## 🎯 实战配置步骤

### 步骤 1：准备图片文件

#### 生成 Favicon

1. 访问 [RealFaviconGenerator](https://realfavicongenerator.net/)
2. 上传你的 Logo（至少 260×260 px）
3. 下载生成的文件包
4. 解压到 `static/` 目录

```
static/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
└── safari-pinned-tab.svg
```

#### 准备头像

```bash
# 创建目录
mkdir -p static/images

# 放入头像（150x150 或更大）
# 文件: static/images/avatar.png
```

#### 准备社交分享图

```bash
# 创建 1200x630 像素的图片
# 文件: static/images/og-image.png
```

### 步骤 2：配置 hugo.yml

```yaml
params:
  # 社交分享图
  images: ["/images/og-image.png"]

  # Favicon
  assets:
    favicon: "/favicon.ico"
    favicon16x16: "/favicon-16x16.png"
    favicon32x32: "/favicon-32x32.png"
    apple_touch_icon: "/apple-touch-icon.png"
    safari_pinned_tab: "/safari-pinned-tab.svg"

  # 头像
  profileMode:
    enabled: true
    imageUrl: "/images/avatar.png"
    imageWidth: 150
    imageHeight: 150

  # 网站标签图标
  label:
    text: "Home"
    icon: /apple-touch-icon.png
    iconHeight: 35
```

### 步骤 3：文章配图

#### 方法 A：集中管理（推荐新手）

```bash
# 所有图片放在 static/images/posts/
static/images/posts/
├── 2024-10-hugo-guide/
│   ├── cover.jpg
│   ├── screenshot-1.png
│   └── screenshot-2.png
└── 2024-11-another-post/
    └── cover.jpg
```

**文章中引用：**

```markdown
---
title: "Hugo 指南"
cover:
  image: "/images/posts/2024-10-hugo-guide/cover.jpg"
  relative: false
---

![截图1](/images/posts/2024-10-hugo-guide/screenshot-1.png)
```

#### 方法 B：Page Bundle（推荐进阶）

```bash
# 每篇文章一个目录
content/posts/
├── hugo-guide/
│   ├── index.md
│   ├── cover.jpg
│   ├── screenshot-1.png
│   └── screenshot-2.png
└── another-post/
    ├── index.md
    └── cover.jpg
```

**文章中引用：**

```markdown
---
title: "Hugo 指南"
cover:
  image: "cover.jpg"
  relative: true
---

![截图1](screenshot-1.png)
```

### 步骤 4：验证图片

```bash
# 启动开发服务器
hugo server -D

# 检查图片是否正常显示
# 访问 http://localhost:1313/

# 检查浏览器控制台是否有 404 错误
```

---

## 🔧 图片优化技巧

### 1. 压缩图片

#### 在线工具
- [TinyPNG](https://tinypng.com/) - PNG/JPG 压缩
- [Squoosh](https://squoosh.app/) - Google 出品，支持 WebP
- [Compressor.io](https://compressor.io/) - 多格式压缩

#### 命令行工具

```bash
# 安装 ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# 批量转换为 WebP
magick convert input.jpg -quality 85 output.webp

# 批量调整尺寸
magick convert input.jpg -resize 1200x output.jpg
```

### 2. 响应式图片

在 Markdown 中使用 HTML：

```html
<picture>
  <source srcset="/images/photo.webp" type="image/webp">
  <source srcset="/images/photo.jpg" type="image/jpeg">
  <img src="/images/photo.jpg" alt="照片" loading="lazy">
</picture>
```

### 3. 懒加载

```html
<img src="/images/photo.jpg" alt="照片" loading="lazy">
```

在自定义 CSS 中添加：

```css
img {
    loading: lazy;
}
```

---

## 📝 完整示例

### 示例 1：个人博客配置

**目录结构：**

```
hugoblog/
├── static/
│   ├── images/
│   │   ├── avatar.png              # 150x150
│   │   ├── og-image.png            # 1200x630
│   │   └── covers/
│   │       ├── tech-1.jpg
│   │       └── tech-2.jpg
│   │
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   └── apple-touch-icon.png
│
└── content/
    └── posts/
        ├── hugo-guide.md           # 普通文章
        │
        └── advanced-guide/         # Page Bundle
            ├── index.md
            ├── cover.jpg
            └── diagram.png
```

**hugo.yml 配置：**

```yaml
params:
  images: ["/images/og-image.png"]

  assets:
    favicon: "/favicon.ico"
    favicon16x16: "/favicon-16x16.png"
    apple_touch_icon: "/apple-touch-icon.png"

  profileMode:
    enabled: true
    imageUrl: "/images/avatar.png"
    imageWidth: 150
    imageHeight: 150
```

**普通文章（hugo-guide.md）：**

```markdown
---
title: "Hugo 完整指南"
cover:
  image: "/images/covers/tech-1.jpg"
  relative: false
---

![示例](/images/covers/tech-1.jpg)
```

**Page Bundle 文章（advanced-guide/index.md）：**

```markdown
---
title: "高级指南"
cover:
  image: "cover.jpg"
  relative: true
---

![示意图](diagram.png)
```

---

## ❓ 常见问题

### Q1: 图片不显示，显示 404

**检查清单：**

1. ✅ 图片路径是否以 `/` 开头？
   ```yaml
   # ✅ 正确
   imageUrl: "/images/avatar.png"

   # ❌ 错误
   imageUrl: "images/avatar.png"
   imageUrl: "static/images/avatar.png"
   ```

2. ✅ 文件是否确实存在于 `static/` 目录？
   ```bash
   # 检查文件
   ls static/images/avatar.png
   ```

3. ✅ 文件名大小写是否一致？
   ```
   # Windows 不区分大小写，但 Linux 服务器区分！
   Avatar.png ≠ avatar.png
   ```

4. ✅ 是否重启了 Hugo 服务器？
   ```bash
   # Ctrl+C 停止，然后重新运行
   hugo server -D
   ```

### Q2: Page Bundle 图片不显示

**检查清单：**

1. ✅ 文章文件名是否为 `index.md`？
   ```
   # ✅ 正确
   content/posts/my-article/index.md

   # ❌ 错误
   content/posts/my-article.md
   ```

2. ✅ 封面图配置是否设置 `relative: true`？
   ```yaml
   cover:
     image: "cover.jpg"
     relative: true        # ⚠️ 必须设为 true
   ```

### Q3: 如何批量添加图片？

```bash
# 方法 1：使用 static/ 目录（推荐）
static/images/posts/
├── 2024-10/
├── 2024-11/
└── 2024-12/

# 方法 2：使用 Page Bundle
content/posts/
├── article-1/
│   └── images/
├── article-2/
│   └── images/
```

### Q4: 图片文件太大怎么办？

```bash
# 使用 TinyPNG 压缩
# https://tinypng.com/

# 或使用命令行
magick convert input.jpg -quality 85 -resize 1200x output.jpg

# 转换为 WebP
magick convert input.jpg -quality 85 output.webp
```

### Q5: 主题更新后图片丢失？

**原因：** 如果图片放在主题目录中，主题更新会覆盖

**解决：**
1. ✅ 所有自定义图片放在 `static/` 目录
2. ❌ 不要修改 `themes/` 目录中的文件

---

## 🎓 最佳实践总结

### ✅ 推荐做法

1. **所有自定义图片放在 `static/images/`**
   ```
   static/images/
   ├── avatar.png
   ├── og-image.png
   ├── covers/
   └── posts/
   ```

2. **使用绝对路径引用**
   ```markdown
   ![](/images/photo.jpg)
   ```

3. **图片命名规范**
   ```
   小写字母 + 连字符
   例如：my-photo.jpg（✅）
   避免：My Photo.jpg（❌）
   ```

4. **压缩图片后上传**
   ```
   文章配图：< 300KB
   封面图：< 500KB
   ```

5. **使用 WebP 格式**
   ```
   现代浏览器都支持，文件更小
   ```

### ❌ 避免做法

1. ❌ 不要在配置文件中使用相对路径
2. ❌ 不要引用主题目录中的图片
3. ❌ 不要使用空格或中文命名文件
4. ❌ 不要上传过大的原图
5. ❌ 不要忘记压缩图片

---

## 📚 图片格式转换工具

### 在线工具

| 工具 | 功能 | 链接 |
|------|------|------|
| **TinyPNG** | JPG/PNG 压缩 | https://tinypng.com/ |
| **Squoosh** | 多格式转换和压缩 | https://squoosh.app/ |
| **CloudConvert** | 格式转换 | https://cloudconvert.com/ |
| **RealFaviconGenerator** | 生成 Favicon | https://realfavicongenerator.net/ |
| **Photopea** | 在线 PS | https://www.photopea.com/ |

### 桌面工具

- **ImageOptim** (Mac) - 图片无损压缩
- **FileOptimizer** (Windows) - 批量压缩
- **XnConvert** (全平台) - 批量转换

---

## 🎯 快速检查清单

准备上线前，检查以下项目：

- [ ] ✅ 所有图片都已压缩
- [ ] ✅ Favicon 已配置
- [ ] ✅ 社交分享图已设置
- [ ] ✅ 头像图片已放置
- [ ] ✅ 所有图片路径以 `/` 开头
- [ ] ✅ 图片文件名全部小写
- [ ] ✅ 文章封面图已设置
- [ ] ✅ 图片在本地显示正常
- [ ] ✅ 浏览器控制台无 404 错误
- [ ] ✅ 图片文件大小合理（< 500KB）

---

**最后更新：** 2025-10-28

完整的图片配置指南，包含所有路径规则、格式建议和实战示例！🎉
