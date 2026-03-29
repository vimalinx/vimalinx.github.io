import matter from 'gray-matter';
import type { BlogPost, BlogPostFrontmatter } from '../types/blog';

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

    posts.push({
      slug,
      lang: lang as 'zh' | 'en',
      frontmatter: data as BlogPostFrontmatter,
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
