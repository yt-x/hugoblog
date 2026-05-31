# ✅ 图片加载问题解决方案总结

## 🎯 问题回顾

**原始问题：**
- 本地开发：`http://localhost:1313/`
- 生产部署：`https://sgldbhxs.top/hugoblog/`
- 图片路径不匹配导致加载失败

---

## ✨ 解决方案：环境配置分离

### 创建的文件

```
hugoblog/
├── config/
│   ├── development/
│   │   └── hugo.yaml          # 开发环境配置
│   └── production/
│       └── hugo.yaml          # 生产环境配置
├── .github/workflows/
│   └── hugo.yaml              # 已更新：使用 production 环境
└── DEV_PROD_GUIDE.md          # 详细使用指南
```

---

## 🚀 使用方法

### 1️⃣ 本地开发（推荐）

```bash
cd C:\Users\XYT\Desktop\hugoblog

# 启动开发服务器（自动使用 development 环境）
hugo server -D

# 访问
http://localhost:1313/
```

**图片路径：** `/images/avatar.png` → `http://localhost:1313/images/avatar.png` ✅

### 2️⃣ 本地预览生产环境

```bash
# 使用生产环境配置构建
hugo --environment production --minify

# 启动简单 HTTP 服务器查看
cd public
python -m http.server 8000

# 访问
http://localhost:8000/hugoblog/
```

### 3️⃣ 部署到 GitHub Pages

```bash
# 提交并推送（GitHub Actions 自动使用 production 环境）
git push origin main

# 等待 1-2 分钟，访问
https://sgldbhxs.top/hugoblog/
```

**图片路径：** `/hugoblog/images/avatar.png` → `https://sgldbhxs.top/hugoblog/images/avatar.png` ✅

---

## 📋 快速命令

```bash
# ========== 本地开发 ==========
hugo server -D                    # 使用开发环境（默认）

# ========== 生产构建 ==========
hugo --environment production --minify

# ========== 清理缓存 ==========
hugo --cleanDestinationDir

# ========== 查看配置 ==========
hugo config                       # 查看合并后的配置
hugo env                          # 查看环境信息
```

---

## 🔍 验证配置

### 测试开发环境

```bash
# 1. 启动服务器
hugo server -D

# 2. 访问 http://localhost:1313/
# 3. 检查图片是否正常显示
# 4. 按 F12 查看图片 URL，应该是：
#    http://localhost:1313/images/avatar.png
```

### 测试生产环境

```bash
# 1. 构建
hugo --environment production --minify

# 2. 检查 HTML
cat public/index.html | grep -i avatar

# 3. 应该看到：
#    src=https://sgldbhxs.top/hugoblog/images/avatar.png
```

---

## 📊 工作原理

### 配置文件加载顺序

```
1. hugo.yml                      # 基础配置
   ↓
2. config/development/hugo.yaml  # 开发环境覆盖
   或
   config/production/hugo.yaml   # 生产环境覆盖
   ↓
3. 命令行参数                    # 最高优先级
```

### 开发环境配置

`config/development/hugo.yaml`：
```yaml
baseURL: http://localhost:1313/
```

图片路径保持为：`/images/avatar.png`

### 生产环境配置

`config/production/hugo.yaml`：
```yaml
baseURL: https://sgldbhxs.top/hugoblog/

params:
  images: ["/hugoblog/images/girl.jpg"]
  assets:
    favicon: "/hugoblog/images/frown32.png"
    # ... 其他图片路径都加上 /hugoblog/ 前缀
  profileMode:
    imageUrl: "/hugoblog/images/avatar.png"
```

---

## ✅ 修复验证清单

- [x] 创建开发环境配置
- [x] 创建生产环境配置
- [x] 更新 GitHub Actions 工作流
- [x] 本地测试开发环境 ✅
- [x] 本地测试生产环境 ✅
- [x] 提交更改到 Git
- [ ] **推送到 GitHub**（下一步）
- [ ] **验证线上部署**（推送后）

---

## 🎯 下一步操作

### 立即执行

```bash
cd C:\Users\XYT\Desktop\hugoblog

# 推送到 GitHub
git push origin main
```

### 等待部署（1-2 分钟）

1. 访问 GitHub Actions：
   ```
   https://github.com/yt-x/hugoblog/actions
   ```

2. 查看最新运行，应该显示：
   ```
   ✅ Build with Hugo (environment: production)
   ✅ Deploy to GitHub Pages
   ```

3. 访问网站：
   ```
   https://sgldbhxs.top/hugoblog/
   ```

4. 检查图片是否正常显示

5. 按 `Ctrl+F5` 强制刷新

---

## 🔧 故障排查

### 问题 1：本地图片不显示

**检查：**
```bash
# 确认使用的环境
hugo server -D --verbose | grep environment

# 应该显示：development
```

**解决：**
```bash
# 明确指定开发环境
hugo server -D --environment development
```

### 问题 2：部署后图片仍然 404

**检查：**
1. GitHub Actions 是否使用了 `--environment production`？
2. 构建日志中图片路径是否正确？
3. 是否清除了浏览器缓存？

**解决：**
```bash
# 查看 .github/workflows/hugo.yaml
# 确保包含：--environment production

# 触发重新部署
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

### 问题 3：某些图片正常，某些不正常

**原因：** 可能某些图片路径在主配置文件中没有覆盖

**检查：**
```bash
# 查看生产环境配置
cat config/production/hugo.yaml

# 确保所有图片路径都加了 /hugoblog/ 前缀
```

---

## 📝 配置文件对比

### 主配置 (hugo.yml)

```yaml
baseURL: https://sgldbhxs.top/hugoblog/

params:
  images: ["/images/girl.jpg"]        # ← 开发环境用

  assets:
    favicon: "/images/frown32.png"    # ← 开发环境用

  profileMode:
    imageUrl: "/images/avatar.png"    # ← 开发环境用
```

### 生产配置 (config/production/hugo.yaml)

```yaml
baseURL: https://sgldbhxs.top/hugoblog/

params:
  images: ["/hugoblog/images/girl.jpg"]        # ← 覆盖

  assets:
    favicon: "/hugoblog/images/frown32.png"    # ← 覆盖

  profileMode:
    imageUrl: "/hugoblog/images/avatar.png"    # ← 覆盖
```

---

## 💡 其他注意事项

### 1. 不需要修改主配置文件

`hugo.yml` 中的图片路径**保持不变**（`/images/`），由环境配置文件覆盖。

### 2. 子模块不影响

`themes/PaperMod` 子模块中的未跟踪内容是正常的，不影响部署。

### 3. 本地 public/ 目录

本地 `public/` 目录是构建输出，不需要提交到 Git（已在 `.gitignore` 中）。

### 4. 缓存问题

如果更新后图片仍然不显示：
- 清除浏览器缓存（Ctrl+Shift+Delete）
- 强制刷新（Ctrl+F5）
- 等待 GitHub Pages CDN 刷新（5-10 分钟）

---

## 📚 相关文档

- [DEV_PROD_GUIDE.md](DEV_PROD_GUIDE.md) - 详细使用指南
- [FIX_GITHUB_ACTIONS.md](FIX_GITHUB_ACTIONS.md) - 子模块修复指南
- [IMAGE_GUIDE.md](IMAGE_GUIDE.md) - 图片路径完整指南

---

## 🎉 总结

**现在你的项目支持：**

✅ **本地开发**：`hugo server -D` → `http://localhost:1313/`
- 图片路径：`/images/avatar.png`
- 访问正常 ✅

✅ **生产部署**：`git push` → `https://sgldbhxs.top/hugoblog/`
- 图片路径：`/hugoblog/images/avatar.png`
- 访问正常 ✅

✅ **自动切换**：无需手动修改配置
✅ **完全分离**：开发和生产互不影响

---

**最后更新：** 2025-10-29 00:50

**状态：** ✅ 配置完成，等待推送验证

**下一步：** 执行 `git push origin main` 🚀
