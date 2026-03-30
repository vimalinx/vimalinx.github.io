export type Category = 'tech' | 'weekly' | 'project' | 'essay' | 'learning';

export const CATEGORY_META: Record<Category, { label: { zh: string; en: string }; color: string }> = {
  tech:     { label: { zh: '技术', en: 'Tech' },       color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  weekly:   { label: { zh: '周刊', en: 'Weekly' },     color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  project:  { label: { zh: '项目', en: 'Project' },    color: 'text-green-400 border-green-500/30 bg-green-500/10' },
  essay:    { label: { zh: '随笔', en: 'Essay' },      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  learning: { label: { zh: '学习', en: 'Learning' },   color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
};

export const ALL_CATEGORIES: Category[] = ['tech', 'weekly', 'project', 'essay', 'learning'];

export interface BlogPostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readTime: number;
  category?: Category;
  draft?: boolean;
  series?: {
    name: string;
    order: number;
  };
}

export interface BlogPost {
  slug: string;
  lang: 'zh' | 'en';
  frontmatter: BlogPostFrontmatter;
  content: string;
}

/** TOC heading entry */
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}
