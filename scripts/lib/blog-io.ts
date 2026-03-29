import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.resolve(import.meta.dirname, '../../content/blog');

export interface BlogPostData {
  slug: string;
  lang: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
    readTime: number;
  };
  content: string;
}

/** Ensure the content/blog directory exists */
function ensureDir(): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

/** Get the file path for a post */
function filePath(slug: string, lang: string): string {
  return path.join(CONTENT_DIR, slug, `${lang}.md`);
}

/** Parse a single markdown file into BlogPostData */
function parseFile(slug: string, lang: string, raw: string): BlogPostData {
  const { data, content } = matter(raw);
  // Normalize date to ISO string (gray-matter parses YAML dates to Date objects)
  const date = data.date instanceof Date
    ? data.date.toISOString().slice(0, 10)
    : String(data.date);
  return {
    slug,
    lang,
    frontmatter: { ...data, date } as BlogPostData['frontmatter'],
    content,
  };
}

/** List all posts, optionally filtered by lang */
export function listPosts(lang?: string): BlogPostData[] {
  ensureDir();
  const posts: BlogPostData[] = [];
  const slugs = fs.readdirSync(CONTENT_DIR).filter((d) =>
    fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
  );

  for (const slug of slugs) {
    const dir = path.join(CONTENT_DIR, slug);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      const fileLang = file.replace('.md', '');
      if (lang && fileLang !== lang) continue;
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      posts.push(parseFile(slug, fileLang, raw));
    }
  }

  posts.sort((a, b) =>
    new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );

  return posts;
}

/** Get a single post */
export function getPost(slug: string, lang: string): BlogPostData | undefined {
  const fp = filePath(slug, lang);
  if (!fs.existsSync(fp)) return undefined;
  const raw = fs.readFileSync(fp, 'utf-8');
  return parseFile(slug, lang, raw);
}

/** Get available languages for a slug */
export function getLangs(slug: string): string[] {
  const dir = path.join(CONTENT_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));
}

/** Build frontmatter string */
function buildFrontmatter(fm: Record<string, unknown>): string {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fm)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => JSON.stringify(v)).join(', ')}]`);
    } else if (typeof value === 'string') {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

/** Create a new post */
export function createPost(opts: {
  slug: string;
  lang: string;
  title: string;
  tags?: string[];
  excerpt?: string;
  readTime?: number;
  content?: string;
}): { ok: boolean; path: string } {
  const dir = path.join(CONTENT_DIR, opts.slug);
  const fp = path.join(dir, `${opts.lang}.md`);

  if (fs.existsSync(fp)) {
    return { ok: false, path: fp };
  }

  fs.mkdirSync(dir, { recursive: true });

  const fm = {
    title: opts.title,
    date: new Date().toISOString().slice(0, 10),
    tags: opts.tags ?? [],
    excerpt: opts.excerpt ?? '',
    readTime: opts.readTime ?? 3,
  };

  const body = opts.content ?? '\n';
  const fileContent = `${buildFrontmatter(fm)}\n${body.startsWith('\n') ? body : '\n' + body}\n`;

  fs.writeFileSync(fp, fileContent, 'utf-8');
  return { ok: true, path: fp };
}

/** Update an existing post's frontmatter and/or content */
export function updatePost(
  slug: string,
  lang: string,
  updates: { frontmatter?: Record<string, unknown>; content?: string }
): { ok: boolean; path: string } {
  const fp = filePath(slug, lang);
  if (!fs.existsSync(fp)) {
    return { ok: false, path: fp };
  }

  const raw = fs.readFileSync(fp, 'utf-8');
  const { data, content } = matter(raw);

  const mergedFm = { ...data, ...(updates.frontmatter ?? {}) };
  const newContent = updates.content ?? content;

  const fileContent = `${buildFrontmatter(mergedFm)}\n${newContent.startsWith('\n') ? newContent : '\n' + newContent}\n`;
  fs.writeFileSync(fp, fileContent, 'utf-8');

  return { ok: true, path: fp };
}

/** Delete a post (specific lang or entire slug) */
export function deletePost(slug: string, lang?: string): { ok: boolean; deleted: string[] } {
  const deleted: string[] = [];

  if (lang) {
    const fp = filePath(slug, lang);
    if (fs.existsSync(fp)) {
      fs.unlinkSync(fp);
      deleted.push(fp);
    }
  } else {
    const dir = path.join(CONTENT_DIR, slug);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        const fp = path.join(dir, f);
        fs.unlinkSync(fp);
        deleted.push(fp);
      }
      fs.rmdirSync(dir);
    }
  }

  return { ok: deleted.length > 0, deleted };
}
