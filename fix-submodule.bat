@echo off
chcp 65001 >nul
echo ====================================
echo 🔧 修复 PaperMod 子模块
echo ====================================
echo.

cd /d "%~dp0"

echo 📌 步骤 1/5: 同步子模块配置...
git submodule sync

echo.
echo 📌 步骤 2/5: 更新 Git 配置...
git config -f .git\config submodule.themes/PaperMod.url https://github.com/adityatelange/hugo-PaperMod.git

echo.
echo 📌 步骤 3/5: 清理旧缓存...
if exist .git\modules\hugo-PaperMod (
    rmdir /s /q .git\modules\hugo-PaperMod
    echo ✅ 已删除旧缓存
)

echo.
echo 📌 步骤 4/5: 初始化子模块...
git submodule update --init --recursive

echo.
echo 📌 步骤 5/5: 提交更改...
git add .gitmodules
git commit -m "Fix: Correct submodule path in .gitmodules"

echo.
echo ====================================
echo ✅ 修复完成！
echo ====================================
echo.
echo 📌 下一步：
echo    1. 检查子模块: git submodule status
echo    2. 测试构建: hugo --minify
echo    3. 推送代码: git push origin main
echo.
pause
