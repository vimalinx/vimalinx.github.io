---
title: 搭建这个博客的技术选型
date: 2026-03-28
tags: [技术, React, Vite]
excerpt: 记录一下这个博客系统的技术架构——为什么选 Markdown 文件管理、怎么处理路由、以及一些踩坑经验。
readTime: 5
category: tech
---

## 技术栈

整个网站基于以下技术：

- **React 19** + **TypeScript** — 前端框架
- **Vite** — 构建工具
- **Tailwind CSS** — 样式方案
- **Framer Motion** — 动画库
- **react-router-dom** — 客户端路由
- **gray-matter + react-markdown** — Markdown 处理

## 为什么用 Markdown 文件

相比于 CMS 或数据库方案，Markdown 文件最简单直接：

1. **无服务端依赖** — GitHub Pages 是纯静态托管
2. **Git 版本控制** — 文章变更就是代码变更
3. **写作体验好** — 用任何编辑器都能写
4. **构建时处理** — Vite 的 `import.meta.glob` 直接导入所有 `.md` 文件

## Markdown 文件结构

```
content/blog/
  hello-world/
    zh.md
    en.md
  building-this-site/
    zh.md
    en.md
```

每篇文章一个文件夹，文件夹名就是 URL slug。中英文分开存放，各自包含完整的 frontmatter。

## 路由方案

使用 `BrowserRouter` + GitHub Pages 的 `404.html` trick。当 GitHub Pages 遇到未知的 URL 路径时，会返回 `404.html`，我们把它设置为和 `index.html` 完全相同的内容，这样 React Router 就能接管路由了。

## 踩坑记录

### gray-matter 的 ESM 兼容性

`gray-matter` 是 CommonJS 模块，在 Vite 的 ESM 环境下需要用默认导入。

### import.meta.glob 的路径

glob 路径是相对于当前文件的，所以需要用 `../../content/blog/` 这样的相对路径。

---

如果你也在搭建类似的博客，希望这些经验对你有帮助。
