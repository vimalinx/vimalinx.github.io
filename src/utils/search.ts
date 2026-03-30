import Fuse from 'fuse.js';
import type { BlogPost } from '../types/blog';

let searchIndex: Fuse<BlogPost> | null = null;

export function getSearchIndex(posts: BlogPost[]): Fuse<BlogPost> {
  if (searchIndex) return searchIndex;

  searchIndex = new Fuse(posts, {
    keys: [
      { name: 'frontmatter.title', weight: 2 },
      { name: 'frontmatter.excerpt', weight: 1.5 },
      { name: 'frontmatter.tags', weight: 1 },
      { name: 'content', weight: 0.5 },
    ],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
  });

  return searchIndex;
}