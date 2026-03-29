---
name: blog-publish
description: Build, commit, and deploy the blog to GitHub Pages.
disable-model-invocation: true
allowed-tools: Bash
---

# Publish Blog

Build the site and deploy to GitHub Pages.

## Step 1: Pre-flight Check

Before publishing, run a build to verify everything compiles:

```bash
npm run build
```

If the build fails, show the error and stop. Do not proceed with publishing.

## Step 2: Confirm with User

Show what will be published:
- Run `git status` to show changed files
- Run `git diff --stat` to show a summary of changes

Ask the user to confirm before pushing. Show the commit message that will be used.

## Step 3: Deploy

Run the publish command:

```bash
npm run blog -- publish "<commit message>"
```

If no specific message is provided, generate one based on what changed:
- New posts: `blog: add <post-title>`
- Updated posts: `blog: update <post-title>`
- Multiple changes: `blog: update content <date>`

## Step 4: Verify

After push, confirm the deployment is in progress. The GitHub Actions workflow will auto-deploy.

Remind the user that the site will be live at https://vimalinx.github.io/ in a few minutes.
