import { execSync } from 'node:child_process';
import {
  listPosts,
  getPost,
  getLangs,
  createPost,
  updatePost,
  deletePost,
} from './lib/blog-io.js';

// ─── Arg Parsing ──────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

function hasFlag(name: string): boolean {
  return args.includes(name);
}

function outputJson(data: unknown): never {
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}

function outputError(message: string, code = 1): never {
  if (hasFlag('--json')) {
    console.log(JSON.stringify({ error: message }));
  } else {
    console.error(`Error: ${message}`);
  }
  process.exit(code);
}

// ─── Commands ─────────────────────────────────────────────────

function cmdNew(): void {
  const slug = args[1];
  if (!slug) outputError('Usage: blog new <slug> [--lang zh|en] [--title "..."] [--tags "t1,t2"]');

  const lang = getArg('--lang') ?? 'zh';
  const title = getArg('--title') ?? slug;
  const tagsStr = getArg('--tags');
  const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()) : [];
  const excerpt = getArg('--excerpt') ?? '';

  const result = createPost({ slug, lang, title, tags, excerpt });

  if (!result.ok) {
    outputError(`Post already exists: ${result.path}`);
  }

  if (hasFlag('--json')) {
    outputJson({ ok: true, path: result.path });
  }

  console.log(`Created: ${result.path}`);
}

function cmdList(): void {
  const lang = getArg('--lang');
  const posts = listPosts(lang);

  if (hasFlag('--json')) {
    outputJson({ posts });
  }

  if (posts.length === 0) {
    console.log('No posts found.');
    return;
  }

  for (const post of posts) {
    const tags = post.frontmatter.tags.length > 0 ? ` [${post.frontmatter.tags.join(', ')}]` : '';
    console.log(
      `  ${post.frontmatter.date}  ${post.slug}/${post.lang}  ${post.frontmatter.title}${tags}`
    );
  }
}

function cmdShow(): void {
  const slug = args[1];
  if (!slug) outputError('Usage: blog show <slug> [--lang zh|en]');

  const lang = getArg('--lang') ?? 'zh';
  const post = getPost(slug, lang);

  if (!post) outputError(`Post not found: ${slug}/${lang}`);

  if (hasFlag('--json')) {
    outputJson({ post });
  }

  const fm = post!.frontmatter;
  console.log(`Title:   ${fm.title}`);
  console.log(`Date:    ${fm.date}`);
  console.log(`Tags:    ${fm.tags.join(', ') || '(none)'}`);
  console.log(`Excerpt: ${fm.excerpt}`);
  console.log(`Read:    ${fm.readTime} min`);
  console.log(`Langs:   ${getLangs(slug).join(', ')}`);
  console.log('---');
  console.log(post!.content.trim());
}

function cmdEdit(): void {
  const slug = args[1];
  if (!slug) outputError('Usage: blog edit <slug> [--lang zh|en]');

  const lang = getArg('--lang') ?? 'zh';
  const langs = getLangs(slug);
  const targetLang = langs.includes(lang) ? lang : langs[0];

  if (!targetLang) outputError(`No posts found for slug: ${slug}`);

  const fp = `content/blog/${slug}/${targetLang}.md`;
  const editor = process.env.EDITOR || process.env.VISUAL || 'vim';

  try {
    execSync(`${editor} ${fp}`, { stdio: 'inherit' });
  } catch {
    outputError(`Failed to open editor: ${editor}`);
  }
}

function cmdPublish(): void {
  const message = args.slice(1).join(' ') || `blog: update ${new Date().toISOString().slice(0, 10)}`;

  const steps = [
    { label: 'Building...', cmd: 'npm run build' },
    { label: 'Staging...', cmd: 'git add -A' },
    { label: 'Committing...', cmd: `git commit -m "${message.replace(/"/g, '\\"')}"` },
    { label: 'Pushing...', cmd: 'git push' },
  ];

  for (const step of steps) {
    console.log(step.label);
    try {
      execSync(step.cmd, { stdio: 'inherit' });
    } catch {
      outputError(`Failed at: ${step.label}`);
    }
  }

  console.log('Published!');
}

// ─── AI Subcommands ───────────────────────────────────────────

function cmdAi(): void {
  const action = args[1];

  switch (action) {
    case 'list': {
      const lang = getArg('--lang');
      const posts = listPosts(lang);
      outputJson({ posts });
    }

    case 'show': {
      const slug = args[2];
      if (!slug) outputJson({ error: 'Missing slug' });
      const lang = getArg('--lang') ?? 'zh';
      const post = getPost(slug!, lang);
      if (!post) outputJson({ error: `Post not found: ${slug}/${lang}` });
      outputJson({ post });
    }

    case 'create': {
      const slug = getArg('--slug') ?? args[2];
      if (!slug) outputJson({ error: 'Missing slug' });

      const lang = getArg('--lang') ?? 'zh';
      const title = getArg('--title') ?? slug;
      const tagsStr = getArg('--tags');
      const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()) : [];
      const excerpt = getArg('--excerpt') ?? '';
      const readTime = getArg('--readTime') ? parseInt(getArg('--readTime')!, 10) : 3;
      const content = getArg('--content') ?? '';

      const result = createPost({ slug, lang, title, tags, excerpt, readTime, content });
      outputJson(result);
    }

    case 'update': {
      const slug = getArg('--slug') ?? args[2];
      if (!slug) outputJson({ error: 'Missing slug' });

      const lang = getArg('--lang') ?? 'zh';
      const fmUpdates: Record<string, unknown> = {};

      const title = getArg('--title');
      if (title) fmUpdates.title = title;
      const tagsStr = getArg('--tags');
      if (tagsStr) fmUpdates.tags = tagsStr.split(',').map((t) => t.trim());
      const excerpt = getArg('--excerpt');
      if (excerpt) fmUpdates.excerpt = excerpt;
      const readTime = getArg('--readTime');
      if (readTime) fmUpdates.readTime = parseInt(readTime, 10);

      const content = getArg('--content');
      const result = updatePost(slug, lang, {
        frontmatter: Object.keys(fmUpdates).length > 0 ? fmUpdates : undefined,
        content,
      });
      outputJson(result);
    }

    case 'delete': {
      const slug = getArg('--slug') ?? args[2];
      if (!slug) outputJson({ error: 'Missing slug' });

      const lang = getArg('--lang');
      const result = deletePost(slug, lang);
      outputJson(result);
    }

    default:
      outputJson({
        error: `Unknown ai action: ${action}`,
        available: ['list', 'show', 'create', 'update', 'delete'],
      });
  }
}

// ─── Help & Dispatch ──────────────────────────────────────────

function showHelp(): void {
  console.log(`Usage: blog <command> [options]

Commands:
  new <slug>         Create a new blog post
  list               List all posts
  show <slug>        Show post details
  edit <slug>        Open post in $EDITOR
  publish [msg]      Build, commit, and push
  ai <action>        AI-friendly JSON interface

Options:
  --lang <zh|en>     Language (default: zh)
  --title "..."      Post title
  --tags "t1,t2"     Tags (comma-separated)
  --excerpt "..."    Post excerpt
  --readTime <n>     Read time in minutes
  --content "..."    Post content (for ai create/update)
  --json             Output as JSON
`);
}

switch (command) {
  case 'new':    cmdNew(); break;
  case 'list':   cmdList(); break;
  case 'show':   cmdShow(); break;
  case 'edit':   cmdEdit(); break;
  case 'publish': cmdPublish(); break;
  case 'ai':     cmdAi(); break;
  case 'help':
  case '--help':
  case '-h':     showHelp(); break;
  default:
    showHelp();
    process.exit(1);
}
