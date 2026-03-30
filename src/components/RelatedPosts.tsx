import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
  };
}

interface RelatedPostsProps {
  posts: Post[];
  lang: 'zh' | 'en';
}

export function RelatedPosts({ posts, lang }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-white/10">
      <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">
        {lang === 'zh' ? '相关文章' : 'Related Posts'}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="group block rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                {post.frontmatter.title}
              </h4>
              {post.frontmatter.excerpt && (
                <p className="mt-1.5 text-xs text-gray-600 line-clamp-2">{post.frontmatter.excerpt}</p>
              )}
              <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.frontmatter.date}
                </span>
                {post.frontmatter.tags.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {post.frontmatter.tags.slice(0, 2).join(', ')}
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}