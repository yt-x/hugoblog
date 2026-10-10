# 缺陷: 线上 section JSON feed 返回 404

Status: implemented

## Problem

`https://sgldbhxs.top/hugoblog/posts/index.json` 返回 404。个人主页仓库的 `js/main.js` 里，函数 `fetchLatestPost` 把该端点当作首选数据源，取不到时才回退到 `https://sgldbhxs.top/hugoblog/posts/index.xml`。于是每次打开主页都在 Console 留下一条 404 网络错误。

`hugo.yml` 的 `outputs.section` 已经列出 `JSON`，所以问题不在配置漏配。

## Decision

在项目层新增 `layouts/posts/list.json.json`，为 section 输出 JSON 列表：按 `Date` 倒序，字段为 `title` / `permalink` / `date` / `summary` / `content`。

根因是主题 PaperMod 只提供 home 的 JSON 模板（`themes/PaperMod/layouts/_default/index.json`，用途是站内搜索索引），没有为 section 提供 JSON 模板；Hugo 在布局查找阶段找不到匹配模板就不产出文件，只在构建期打印一条 `found no layout file for "json" for kind "section"` 警告。

## Verification

- 用 CI 固定的 Hugo 0.147.3 与本机 0.166.0 各构建一次：两次都只新增 section 的 JSON 产物（19 vs 18 pages），其余 43 个产物逐字节不变，home 搜索索引未被接管。
- 产物为合法 JSON 数组，字段与 `fetchLatestPost` 的 JSON 分支读取的键一致，`permalink` 是含 `/hugoblog` 的绝对地址。
- 临时插入一篇日期更旧的文章后重建：数组首元素仍是最新一篇，排序符合前端"取 data[0]"的假设；验完已删除该文。

## Alternatives considered

1. **改前端，把 RSS 提到首位**：改动更小，同样能消除 Console 404；但它把"端点坏了"固化成设计，且 RSS 无日期字段，卡片会退化成显示 `Recent`。放弃。
2. **直接改主题内的模板**：主题是 submodule，升级时改动会丢。放弃。
3. **用通用的列表 JSON 模板做兜底**：覆盖面更广，但会一并接管后续所有 section 的 JSON 输出，作用域不如按 section 精确。放弃。

## Consequences

- 该端点从 404 变为 200，主页博客卡回到 JSON 主路径，并能显示文章日期。
- 这个端点依赖项目层的那一个模板文件：删掉它 404 就会回归，排查线索留在本目录。
- `outputs.section` 里的 `JSON` 从此才有实际产出，两者必须同时存在。
