export interface BlogPostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readTime: number;
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
