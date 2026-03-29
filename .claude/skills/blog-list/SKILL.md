---
name: blog-list
description: List all blog posts with metadata. Shows titles, dates, tags, and available languages.
disable-model-invocation: true
allowed-tools: Bash
---

# List Blog Posts

Run the following command to get all posts as JSON:

```bash
npm run blog -- ai list
```

Parse the JSON output and display the posts in a readable table format:

| # | Date | Slug | Lang | Title | Tags |
|---|------|------|------|-------|------|
| 1 | 2026-03-29 | hello-world | zh | 你好，世界 | 随笔, 起点 |
| 2 | 2026-03-29 | hello-world | en | Hello, World | thoughts, beginning |

Group posts by slug (show both languages on the same row if both exist).

Also show the total count: "X posts (Y in Chinese, Z in English)"
