import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag } from 'lucide-react';
import { BlogLayout } from '../components/BlogLayout';
import { getAllPosts } from '../utils/blog';
import type { Language } from '../config';

export function BlogList() {
  const [lang, setLang] = useState<Language>('zh');
  const posts = getAllPosts(lang);

  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  return (
    <BlogLayout lang={lang} toggleLang={toggleLang}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              {lang === 'zh' ? '博客' : 'Blog'}
            </span>
          </h1>
          <p className="mt-4 text-gray-500 text-lg">
            {lang === 'zh' ? '想法、记录、技术分享' : 'Thoughts, notes, and technical sharing'}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg">{lang === 'zh' ? '还没有文章，敬请期待' : 'No posts yet, stay tuned'}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={`${post.slug}-${post.lang}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {post.frontmatter.title}
                  </h2>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed line-clamp-3">
                    {post.frontmatter.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.frontmatter.date}
                    </span>
                    {post.frontmatter.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.frontmatter.readTime} {lang === 'zh' ? '分钟' : 'min'}
                      </span>
                    )}
                  </div>
                  {post.frontmatter.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-gray-400"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </BlogLayout>
  );
}
