# 🔄 开发与生产环境配置指南

## 📋 问题说明

你的项目有两个不同的访问路径：
- **本地开发**：`http://localhost:1313/`
- **生产部署**：`https://sgldbhxs.top/hugoblog/`

直接修改图片路径会导致：
- ✅ 生产环境正常
- ❌ 本地开发图片加载失败

---

## ✅ 解决方案：环境配置分离

### 方案架构

```
hugoblog/
├── hugo.yml                      # 基础配置（共享）
├── config/
│   ├── development/
│   │   └── hugo.yaml            # 开发环境配置
│   └── production/
│       └── hugo.yaml            # 生产环境配置
```

### 配置文件说明

#### 1. hugo.yml（基础配置）

保持图片路径为**相对路径**（不含 `/hugoblog/`）：

```yaml
baseURL: https://sgldbhxs.top/hugoblog/  # 默认为生产环境

params:
  images: ["/images/girl.jpg"]            # ← 相对路径

  assets:
    favicon: "/images/frown32.png"        # ← 相对路径
    favicon16x16: "/images/frown16.png"
    favicon32x32: "/images/frown32.png"

  label:
    icon: /images/girl.png                # ← 相对路径

  profileMode:
    imageUrl: "/images/avatar.png"        # ← 相对路径
```

#### 2. config/development/hugo.yaml（开发环境）

```yaml
# 开发环境配置
baseURL: http://localhost:1313/
```

#### 3. config/production/hugo.yaml（生产环境）

```yaml
# 生产环境配置
baseURL: https://sgldbhxs.top/hugoblog/

params:
  # 覆盖图片路径，添加 /hugoblog/ 前缀
  images: ["/hugoblog/images/girl.jpg"]

  assets:
    favicon: "/hugoblog/images/frown32.png"
    favicon16x16: "/hugoblog/images/frown16.png"
    favicon32x32: "/hugoblog/images/frown32.png"

  label:
    icon: /hugoblog/images/girl.png

  profileMode:
    imageUrl: "/hugoblog/images/avatar.png"
```

---

## 🚀 使用方法

### 本地开发

```bash
# 使用开发环境配置
hugo server -D --environment development

# 或者简写（默认就是 development）
hugo server -D
```

**访问：** `http://localhost:1313/`
**图片路径：** `/images/avatar.png` → `http://localhost:1313/images/avatar.png` ✅

### 生产构建

```bash
# 使用生产环境配置
hugo --environment production --minify

# 或指定 baseURL（推荐）
hugo --baseURL https://sgldbhxs.top/hugoblog/ --minify
```

**部署后访问：** `https://sgldbhxs.top/hugoblog/`
**图片路径：** `/hugoblog/images/avatar.png` → `https://sgldbhxs.top/hugoblog/images/avatar.png` ✅

---

## 🔧 修改 GitHub Actions 工作流

更新 `.github/workflows/hugo.yaml`，确保使用生产环境配置：

### 找到 "Build with Hugo" 步骤

修改为：

```yaml
- name: Build with Hugo
  env:
    HUGO_ENVIRONMENT: production
  run: |
    hugo \
      --gc \
      --minify \
      --environment production \
      --baseURL "${{ steps.pages.outputs.base_url }}/"
```

**关键点：**
- `--environment production`：使用生产环境配置
- `--baseURL`：自动获取 GitHub Pages URL

---

## 📝 完整工作流示例

`.github/workflows/hugo.yaml`：

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

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.152.2
      HUGO_ENVIRONMENT: production          # ← 设置为生产环境
      TZ: Asia/Shanghai
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb

      - name: Install Dart Sass
        run: sudo snap install dart-sass

      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Build with Hugo
        env:
          HUGO_ENVIRONMENT: production      # ← 生产环境
        run: |
          hugo \
            --gc \
            --minify \
            --environment production \
            --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
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
        uses: actions/deploy-pages@v4
```

---

## 🎯 方案对比

| 方案 | 本地开发 | 生产部署 | 复杂度 | 推荐度 |
|------|----------|----------|--------|--------|
| **环境配置分离** | ✅ 正常 | ✅ 正确路径 | 中等 | ⭐⭐⭐⭐⭐ |
| **命令行参数** | ✅ 需要参数 | ✅ 正常 | 简单 | ⭐⭐⭐⭐ |
| **直接修改路径** | ❌ 失败 | ✅ 正常 | 最简单 | ⭐ |

---

## 💡 其他方案（备选）

### 方案 2：本地也使用子路径

本地开发时也访问 `/hugoblog/` 子路径：

```bash
# 本地启动
hugo server -D --baseURL http://localhost:1313/hugoblog/

# 访问
http://localhost:1313/hugoblog/
```

**优点：** 与生产环境完全一致
**缺点：** URL 变长，稍微不便

### 方案 3：使用 Hugo 模板函数

在模板中使用 `absURL` 或 `relURL` 函数自动处理路径：

```go
<!-- layouts/partials/custom.html -->
<img src="{{ "/images/avatar.png" | absURL }}">
<!-- 自动输出正确的完整 URL -->
```

但这需要修改主题模板，不推荐。

---

## 🔍 验证配置

### 开发环境测试

```bash
cd C:\Users\XYT\Desktop\hugoblog

# 启动开发服务器
hugo server -D --environment development

# 访问
http://localhost:1313/

# 检查图片是否正常显示
```

### 生产环境测试

```bash
# 使用生产环境构建
hugo --environment production --minify

# 检查生成的 HTML
cat public/index.html | grep -i "avatar\|girl"

# 应该看到 /hugoblog/images/ 路径
```

### 提交并部署

```bash
# 提交新配置
git add config/ .github/workflows/hugo.yaml
git commit -m "Add environment-specific configuration for dev/prod"
git push origin main

# 等待 GitHub Actions 完成
# 访问 https://sgldbhxs.top/hugoblog/
# 检查图片是否正常显示
```

---

## 📋 快速命令参考

```bash
# ========== 本地开发 ==========
# 方式 1：使用开发环境配置
hugo server -D --environment development

# 方式 2：默认（development）
hugo server -D

# 方式 3：本地也用子路径
hugo server -D --baseURL http://localhost:1313/hugoblog/


# ========== 生产构建 ==========
# 方式 1：使用生产环境配置
hugo --environment production --minify

# 方式 2：指定 baseURL
hugo --baseURL https://sgldbhxs.top/hugoblog/ --minify


# ========== 清理缓存 ==========
hugo --cleanDestinationDir


# ========== 查看环境 ==========
hugo env
```

---

## ⚙️ VS Code 快捷配置（可选）

创建 `.vscode/tasks.json`：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Hugo Dev Server",
      "type": "shell",
      "command": "hugo server -D --environment development",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "Hugo Production Build",
      "type": "shell",
      "command": "hugo --environment production --minify",
      "problemMatcher": []
    }
  ]
}
```

使用：`Ctrl+Shift+B` → 选择任务

---

## 🎓 工作原理

Hugo 配置文件的优先级：

```
1. 命令行参数（最高优先级）
   --baseURL, --environment

2. 环境配置文件
   config/<environment>/hugo.yaml

3. 主配置文件（最低优先级）
   hugo.yml
```

**示例：**

```bash
hugo server -D --environment development
```

Hugo 会按顺序加载：
1. `hugo.yml`（基础配置）
2. `config/development/hugo.yaml`（覆盖基础配置）
3. 命令行参数（如果有）

---

## ✅ 推荐方案总结

**最佳实践：环境配置分离**

1. ✅ **本地开发**：
   ```bash
   hugo server -D
   # 访问 http://localhost:1313/
   # 图片路径：/images/xxx.png
   ```

2. ✅ **生产部署**：
   ```yaml
   # GitHub Actions 自动使用 production 环境
   # 图片路径：/hugoblog/images/xxx.png
   ```

3. ✅ **无需手动切换配置**
4. ✅ **两个环境独立，互不影响**

---

**最后更新：** 2025-10-29

现在你可以正常本地调试，同时生产环境图片也能正确加载！🎉
