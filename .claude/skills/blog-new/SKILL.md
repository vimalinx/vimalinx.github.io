---
name: blog-new
description: Create a new blog post. User provides a topic or title, Claude generates content and creates the post.
disable-model-invocation: true
allowed-tools: Bash, Read, AskUserQuestion
argument-hint: [title or topic]
---

# Create a New Blog Post

You are creating a new blog post for this website. Follow these steps:

## Step 1: Gather Requirements

The user provided: $ARGUMENTS

If the argument is a topic (not a clear title), generate a concise title.
Ask the user to confirm or adjust the title.

Use AskUserQuestion to clarify:
- **Language**: Chinese only, or both zh + en?
- **Tags**: What tags to use? Suggest relevant tags based on the topic.
- **Tone/Style**: Any specific style preference? (Default: conversational, personal)

## Step 2: Generate Slug

Convert the title to a URL-friendly slug:
- English: lowercase, hyphens (e.g., "My First Post" → "my-first-post")
- Chinese: use pinyin or a descriptive English slug (e.g., "技术选型" → "tech-stack" or "building-this-site")

## Step 3: Generate Content

Write the blog post content in Markdown:
- Use `##` headings, not `#` (the title comes from frontmatter)
- Include real substance, not placeholder text
- Keep the writing style consistent with existing posts (personal, reflective, technically grounded)
- Include code blocks, quotes, or lists where appropriate

## Step 4: Create the Post

Use the CLI to create the post. Run:

```bash
npm run blog -- ai create --slug <slug> --lang zh --title "<title>" --tags "<tag1>,<tag2>" --content "<content>"
```

For the `--content` argument, pass the full markdown body. If the content contains special characters or is long, write it to a temp file first and use `$(cat /tmp/blog-content.md)`.

If the user wants both languages, create the zh version first, then create the en version:

```bash
npm run blog -- ai create --slug <slug> --lang en --title "<english title>" --tags "<tags>" --content "<english content>"
```

## Step 5: Confirm

Show the user:
1. The created file path(s)
2. A preview of the frontmatter
3. The post URL: `/blog/<slug>`
