# 在 GitHub Pages 子目录下部署 Hugo 博客

## 背景

当你的 GitHub Pages 主站点已经绑定了一个 `index.html`（通常是个人主页或其他项目），但你想在子目录（如 `/hugoblog`）下部署 Hugo 博客时，需要进行特殊配置。

## 场景说明

- **主站点**: `https://username.github.io/` (已被占用)
- **Hugo 博客目标**: `https://username.github.io/hugoblog/`

## 解决方案

### 方案一：使用单独的仓库（推荐）

这是最简单且最推荐的方案。

#### 步骤：

1. **创建独立仓库**
   ```bash
   # 创建一个名为 hugoblog 的新仓库
   # 仓库名将成为子目录名
   ```

2. **配置 Hugo baseURL**

   编辑 `hugo.yml` 或 `config.toml`:
   ```yaml
   baseURL: "https://username.github.io/hugoblog/"
   ```

3. **生成静态文件**
   ```bash
   hugo --minify
   ```

4. **部署到 GitHub Pages**

   在仓库设置中：
   - 进入 Settings → Pages
   - Source 选择 `main` 分支和 `/public` 目录（或根目录）
   - 保存后等待部署完成

5. **访问博客**

   访问 `https://username.github.io/hugoblog/`

---

### 方案二：使用主仓库的子目录

如果你想把博客源码和主站放在同一个仓库中。

#### 项目结构：

```
username.github.io/
├── index.html              # 主站点入口
├── main-site/              # 主站点其他文件
├── hugoblog/               # Hugo 博客生成的静态文件
│   ├── index.html
│   ├── posts/
│   └── ...
└── hugo-source/            # Hugo 源码（可选，不会被访问）
    ├── content/
    ├── themes/
    └── hugo.yml
```

#### 步骤：

1. **配置 Hugo baseURL**
   ```yaml
   baseURL: "https://username.github.io/hugoblog/"
   ```

2. **修改输出目录**

   在 `hugo.yml` 中指定输出目录：
   ```yaml
   publishDir: "../hugoblog"  # 相对于 Hugo 项目根目录
   ```

   或者在构建时指定：
   ```bash
   hugo --destination ../hugoblog --minify
   ```

3. **构建并推送**
   ```bash
   # 在 hugo-source 目录中构建
   cd hugo-source
   hugo --minify

   # 返回仓库根目录
   cd ..

   # 提交 hugoblog 目录
   git add hugoblog/
   git commit -m "Update Hugo blog"
   git push
   ```

4. **确保 GitHub Pages 设置**

   在仓库设置中：
   - Settings → Pages
   - Source: `main` 分支 + `/ (root)` 目录

5. **访问博客**

   访问 `https://username.github.io/hugoblog/`

---

### 方案三：使用 GitHub Actions 自动化部署

对于方案二，可以使用 GitHub Actions 自动化构建和部署流程。

#### 创建 `.github/workflows/deploy-hugo.yml`:

```yaml
name: Deploy Hugo Blog to Subdirectory

on:
  push:
    branches:
      - main
    paths:
      - 'hugo-source/**'  # 仅当 Hugo 源码变更时触发

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          submodules: recursive  # 如果使用了主题子模块
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build Hugo site
        run: |
          cd hugo-source
          hugo --minify --destination ../hugoblog

      - name: Commit and push
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add hugoblog/
          git diff --staged --quiet || git commit -m "Auto-deploy Hugo blog [skip ci]"
          git push
```

---

## 常见问题

### 1. CSS/JS 资源加载失败

**原因**: `baseURL` 配置不正确

**解决**: 确保 `hugo.yml` 中的 `baseURL` 包含完整路径：
```yaml
baseURL: "https://username.github.io/hugoblog/"  # 注意末尾的斜杠
```

### 2. 链接跳转错误

**原因**: Hugo 生成的内部链接不包含子目录前缀

**解决**:
- 使用 Hugo 的 `ref` 和 `relref` 函数生成链接
- 或在主题模板中使用 `.Site.BaseURL` 变量

### 3. 图片路径问题

**原因**: 静态资源路径配置问题

**解决**:
- 图片放在 `static` 目录下
- 引用时使用相对路径，如 `/images/pic.jpg`
- Hugo 会自动添加 `baseURL` 前缀

### 4. 404 页面不工作

**原因**: GitHub Pages 的 404 处理是全局的

**解决**:
- 在主站根目录创建 `404.html`
- 使用 JavaScript 检测路径并重定向到对应子目录的 404 页面

---

## 推荐方案总结

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 独立仓库 | 简单、清晰、易维护 | 需要额外仓库 | **推荐首选** |
| 主仓库子目录 | 统一管理 | 构建流程复杂 | 项目关联性强 |
| GitHub Actions | 自动化、高效 | 需要学习 Actions | 频繁更新博客 |

---

## 检查清单

部署前请确认：

- [ ] `baseURL` 配置正确（包含子目录路径）
- [ ] 输出目录配置正确（如使用子目录方案）
- [ ] 构建成功无报错 (`hugo --minify`)
- [ ] GitHub Pages 设置正确
- [ ] 主题子模块已正确初始化（如果使用）
- [ ] 所有静态资源路径正确
- [ ] 测试几个页面的访问和跳转

---

## 参考资源

- [Hugo 官方文档 - 配置](https://gohugo.io/getting-started/configuration/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Hugo 部署到 GitHub Pages](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
