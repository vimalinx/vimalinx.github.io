---
title: Tech Stack Behind This Blog
date: 2026-03-28
tags: [tech, React, Vite]
excerpt: A record of the technical architecture behind this blog — why Markdown files, how routing works, and lessons learned along the way.
readTime: 4
---

## The Stack

The entire site is built on:

- **React 19** + **TypeScript** — Frontend framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **react-router-dom** — Client-side routing
- **gray-matter + react-markdown** — Markdown processing

## Why Markdown Files

Compared to CMS or database solutions, Markdown files are the simplest approach:

1. **No server dependency** — GitHub Pages is purely static hosting
2. **Git version control** — Article changes are code changes
3. **Great writing experience** — Write in any editor
4. **Build-time processing** — Vite's `import.meta.glob` imports all `.md` files directly

## Markdown File Structure

```
content/blog/
  hello-world/
    zh.md
    en.md
  building-this-site/
    zh.md
    en.md
```

Each article gets its own folder, and the folder name becomes the URL slug. Chinese and English versions live separately, each with its own complete frontmatter.

## Routing Strategy

Using `BrowserRouter` with the GitHub Pages `404.html` trick. When GitHub Pages encounters an unknown URL path, it serves `404.html`. We make it identical to `index.html`, so React Router can take over routing.

## Lessons Learned

### gray-matter ESM Compatibility

`gray-matter` is a CommonJS module. In Vite's ESM environment, it needs to be imported as a default import.

### import.meta.glob Paths

Glob paths are relative to the current file, so you need paths like `../../content/blog/`.

---

If you're building something similar, I hope these notes help.
