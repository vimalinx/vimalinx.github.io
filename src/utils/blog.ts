import { Buffer } from 'buffer';
import matter from 'gray-matter';
import type { BlogPost, BlogPostFrontmatter, TocHeading } from '../types/blog';

// Ensure Buffer is available for gray-matter in browser
if (typeof (globalThis as any).Buffer === 'undefined') {
  (globalThis as any).Buffer = Buffer as any;
}

// Vite glob import — imports all .md files under content/blog/ as raw strings
const mdModules = import.meta.glob<{ default: string }>(
  '../../content/blog/**/*.md',
  { query: '?raw', eager: true }
);

function parsePosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, module] of Object.entries(mdModules)) {
    // Extract slug and lang from path like "../../content/blog/hello-world/zh.md"
    const match = path.match(/content\/blog\/([^/]+)\/(zh|en)\.md$/);
    if (!match) continue;

    const [, slug, lang] = match;
    const raw = typeof module === 'string' ? module : module.default;
    const { data, content } = matter(raw);

    // Normalize date to ISO string (gray-matter parses YAML dates to Date objects)
    const date = data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date);

    posts.push({
      slug,
      lang: lang as 'zh' | 'en',
      frontmatter: { ...data, date } as BlogPostFrontmatter,
      content,
    });
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

  return posts;
}

// Parse once at module level (build-time eager import means this runs once)
const allPosts = parsePosts();

export function getAllPosts(lang: 'zh' | 'en'): BlogPost[] {
  return allPosts.filter((p) => p.lang === lang);
}

export function getPost(slug: string, lang: 'zh' | 'en'): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug && p.lang === lang);
}

export function getAvailableLangs(slug: string): ('zh' | 'en')[] {
  return allPosts.filter((p) => p.slug === slug).map((p) => p.lang);
}

export function getAllSlugs(): string[] {
  const slugs = new Set(allPosts.map((p) => p.slug));
  return [...slugs];
}

/** Get all unique tags across all posts */
export function getAllTags(lang?: 'zh' | 'en'): string[] {
  const posts = lang ? allPosts.filter(p => p.lang === lang) : allPosts;
  const tags = new Set<string>();
  for (const p of posts) {
    for (const t of p.frontmatter.tags) {
      tags.add(t);
    }
  }
  return [...tags].sort();
}

/** Get adjacent posts (previous and next) by date */
export function getAdjacentPosts(slug: string, lang: 'zh' | 'en'): { prev?: BlogPost; next?: BlogPost } {
  const posts = allPosts.filter(p => p.lang === lang);
  const idx = posts.findIndex(p => p.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? posts[idx - 1] : undefined,
    next: idx < posts.length - 1 ? posts[idx + 1] : undefined,
  };
}


/** Extract table of contents from markdown content */
export function getTableOfContents(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-|-$/g, '');
      headings.push({ id, text, level });
    }
  }
  return headings;
}
