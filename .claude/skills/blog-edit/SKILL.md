---
name: blog-edit
description: Edit an existing blog post. Shows current content, applies user-requested changes, and saves.
disable-model-invocation: true
allowed-tools: Bash, Read, AskUserQuestion
argument-hint: [slug]
---

# Edit a Blog Post

The user wants to edit: $ARGUMENTS

## Step 1: Identify the Post

If the user provided a slug, use it directly. Otherwise, run `npm run blog -- ai list` to find the matching post.

If no slug is provided, list all posts and ask the user which one to edit.

## Step 2: Show Current Content

Run to get the full post:

```bash
npm run blog -- ai show <slug> --lang zh
```

If there's also an English version, show both:

```bash
npm run blog -- ai show <slug> --lang en
```

Display the current frontmatter and a preview of the content to the user.

## Step 3: Apply Changes

Based on the user's instructions, modify the content. Common operations:

- **Update title/excerpt/tags**: Use `npm run blog -- ai update <slug> --lang zh --title "new title"`
- **Replace content**: Use `npm run blog -- ai update <slug> --lang zh --content "$(cat /tmp/updated-content.md)"`
- **Both**: Combine frontmatter and content updates

For content changes, write the updated content to a temp file first, then pass it:

```bash
# Write updated content to temp file
cat > /tmp/blog-update.md << 'ENDOFCONTENT'
(updated markdown content)
ENDOFCONTENT

# Update the post
npm run blog -- ai update <slug> --lang zh --content "$(cat /tmp/blog-update.md)"
```

## Step 4: Handle Dual Language

If the post has both zh and en versions, ask the user:
- Edit both versions?
- Edit only one language?

If editing both, make consistent changes to both versions.

## Step 5: Confirm

Show the user what was changed and the updated file path.
