# GitHub Actions 工作流问题修复指南

## 🔍 问题诊断

### 错误信息
```
fatal: No url found for submodule path 'themes/PaperMod' in .gitmodules
```

### 问题根源

你的 `.gitmodules` 配置有误：

```ini
# ❌ 当前配置（错误）
[submodule "hugo-PaperMod"]
    path = hugo-PaperMod          # ← 错误的路径
    url = https://github.com/adityatelange/hugo-PaperMod.git
```

**实际情况：**
- 主题目录：`themes/PaperMod/` ✅
- 配置路径：`hugo-PaperMod` ❌

**不匹配导致：**
- Git 找不到子模块
- GitHub Actions 无法 checkout 子模块
- 构建失败

---

## ✅ 完整修复方案

### 方案一：重新配置子模块（推荐）⭐

#### 步骤 1：删除现有子模块配置

```bash
cd C:\Users\XYT\Desktop\hugoblog

# 1. 删除子模块配置
git submodule deinit -f themes/PaperMod
git rm -f themes/PaperMod

# 2. 删除 Git 缓存
rm -rf .git/modules/themes/PaperMod
rm -rf .git/modules/hugo-PaperMod

# 3. 删除错误的 .gitmodules
rm .gitmodules

# 4. 提交删除
git add .gitmodules
git commit -m "Remove incorrect submodule configuration"
```

#### 步骤 2：重新添加子模块

```bash
# 重新添加 PaperMod 作为子模块
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod

# 初始化子模块
git submodule update --init --recursive

# 提交更改
git add .
git commit -m "Fix: Re-add PaperMod as submodule with correct path"
```

#### 步骤 3：推送到 GitHub

```bash
git push origin main
```

---

### 方案二：手动修复配置文件（快速）

#### 步骤 1：修改 .gitmodules

编辑 `.gitmodules` 文件：

```ini
# ✅ 修复后的配置
[submodule "themes/PaperMod"]
    path = themes/PaperMod
    url = https://github.com/adityatelange/hugo-PaperMod.git
```

#### 步骤 2：更新 Git 配置

```bash
cd C:\Users\XYT\Desktop\hugoblog

# 1. 同步子模块配置
git submodule sync

# 2. 更新 .git/config
git config -f .git/config submodule.themes/PaperMod.url https://github.com/adityatelange/hugo-PaperMod.git

# 3. 删除旧的子模块缓存
rm -rf .git/modules/hugo-PaperMod

# 4. 重新初始化
git submodule update --init --recursive
```

#### 步骤 3：提交更改

```bash
git add .gitmodules
git commit -m "Fix: Correct submodule path in .gitmodules"
git push origin main
```

---

## 📝 修复后的文件

### .gitmodules（正确配置）

```ini
[submodule "themes/PaperMod"]
	path = themes/PaperMod
	url = https://github.com/adityatelange/hugo-PaperMod.git
```

### .github/workflows/hugo.yaml（已优化）

你的工作流文件配置正确，但可以稍微优化：

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
      HUGO_VERSION: 0.152.2          # ← 更新到你的版本
      HUGO_ENVIRONMENT: production
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
          submodules: recursive      # ← 关键：递归 checkout 子模块
          fetch-depth: 0

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Install Node.js dependencies
        run: "[[ -f package-lock.json || -f npm-shrinkwrap.json ]] && npm ci || true"

      - name: Build with Hugo
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
        run: |
          hugo \
            --gc \
            --minify \
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

## 🔧 验证修复

### 本地验证

```bash
# 1. 检查子模块状态
git submodule status

# 应该显示：
# [commit-hash] themes/PaperMod (v7.0)

# 2. 检查 .gitmodules
cat .gitmodules

# 应该显示：
# [submodule "themes/PaperMod"]
#     path = themes/PaperMod
#     url = https://github.com/adityatelange/hugo-PaperMod.git

# 3. 测试构建
hugo --minify

# 应该成功构建
```

### GitHub Actions 验证

1. 推送代码后，访问：
   ```
   https://github.com/yt-x/hugoblog/actions
   ```

2. 查看最新的工作流运行

3. 应该看到：
   ```
   ✅ Checkout - 成功
   ✅ Build with Hugo - 成功
   ✅ Deploy to GitHub Pages - 成功
   ```

---

## 🚨 常见问题

### Q1: 执行 `git submodule deinit` 失败

```bash
# 强制删除
git submodule deinit -f themes/PaperMod

# 如果还是失败
rm -rf themes/PaperMod
git rm -f themes/PaperMod
```

### Q2: 子模块目录不为空

```bash
# 备份主题（如果有自定义）
cp -r themes/PaperMod themes/PaperMod_backup

# 强制删除
rm -rf themes/PaperMod

# 重新添加子模块
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

### Q3: GitHub Actions 仍然失败

**检查清单：**
1. ✅ .gitmodules 文件已正确修改
2. ✅ 子模块已提交到仓库
3. ✅ 工作流文件包含 `submodules: recursive`
4. ✅ 已推送到 GitHub

**查看日志：**
```
GitHub Actions → 点击失败的工作流 → 查看 "Checkout" 步骤日志
```

### Q4: Windows 路径问题

如果使用 Windows，某些命令需要调整：

```powershell
# PowerShell 命令
Remove-Item -Recurse -Force themes/PaperMod
Remove-Item -Recurse -Force .git/modules/themes/PaperMod

# 或使用 Git Bash
# 在 Git Bash 中执行修复步骤
```

---

## 📋 完整修复脚本（推荐使用）

### 自动修复脚本（Git Bash）

创建 `fix-submodule.sh`：

```bash
#!/bin/bash
# Hugo PaperMod 子模块修复脚本

echo "🔧 开始修复 PaperMod 子模块..."

# 1. 保存当前更改
echo "📦 保存当前更改..."
git stash

# 2. 删除错误的子模块配置
echo "🗑️  删除旧配置..."
git submodule deinit -f themes/PaperMod 2>/dev/null || true
git rm -f themes/PaperMod 2>/dev/null || true
rm -rf .git/modules/themes/PaperMod
rm -rf .git/modules/hugo-PaperMod

# 3. 删除 .gitmodules
rm -f .gitmodules

# 4. 提交删除
git add .gitmodules 2>/dev/null || true
git commit -m "Remove incorrect submodule configuration" 2>/dev/null || true

# 5. 重新添加子模块
echo "➕ 重新添加 PaperMod 子模块..."
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod

# 6. 初始化子模块
echo "🔄 初始化子模块..."
git submodule update --init --recursive

# 7. 提交更改
echo "💾 提交更改..."
git add .
git commit -m "Fix: Re-add PaperMod as submodule with correct path"

# 8. 恢复保存的更改
echo "📂 恢复之前的更改..."
git stash pop 2>/dev/null || true

echo "✅ 修复完成！"
echo ""
echo "📌 下一步："
echo "   1. 检查子模块状态: git submodule status"
echo "   2. 测试构建: hugo --minify"
echo "   3. 推送到 GitHub: git push origin main"
```

**使用方法：**

```bash
# 1. 保存脚本
# 将上面的内容保存为 fix-submodule.sh

# 2. 添加执行权限
chmod +x fix-submodule.sh

# 3. 运行脚本
./fix-submodule.sh

# 4. 推送到 GitHub
git push origin main
```

---

## 🎯 推荐方案（最简单）

如果你不确定该用哪个方案，使用这个：

```bash
# 1. 进入项目目录
cd C:\Users\XYT\Desktop\hugoblog

# 2. 备份当前主题（可选）
cp -r themes/PaperMod themes/PaperMod_backup

# 3. 完全删除子模块
git rm -f themes/PaperMod
rm -rf .git/modules/themes
rm -rf .git/modules/hugo-PaperMod
rm -f .gitmodules

# 4. 提交删除
git add .
git commit -m "Remove old submodule"

# 5. 重新添加子模块
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod

# 6. 提交新配置
git add .
git commit -m "Add PaperMod submodule with correct path"

# 7. 推送
git push origin main
```

---

## ✅ 验证清单

修复完成后，检查以下项目：

- [ ] `.gitmodules` 路径正确（`themes/PaperMod`）
- [ ] `git submodule status` 显示正常
- [ ] `ls themes/PaperMod/` 有文件
- [ ] `hugo --minify` 构建成功
- [ ] GitHub Actions 工作流运行成功
- [ ] 网站部署正常

---

## 📚 延伸阅读

### Git 子模块最佳实践

1. **添加子模块**
   ```bash
   git submodule add <url> <path>
   ```

2. **克隆包含子模块的仓库**
   ```bash
   git clone --recurse-submodules <url>
   ```

3. **更新子模块**
   ```bash
   git submodule update --remote --merge
   ```

4. **删除子模块**
   ```bash
   git submodule deinit <path>
   git rm <path>
   rm -rf .git/modules/<path>
   ```

### GitHub Actions 调试

```yaml
# 启用调试日志
- name: Checkout
  uses: actions/checkout@v4
  with:
    submodules: recursive
    fetch-depth: 0
  env:
    ACTIONS_STEP_DEBUG: true
```

---

**最后更新：** 2025-10-28

按照上述方案修复后，你的 GitHub Actions 工作流应该能正常运行了！🎉
