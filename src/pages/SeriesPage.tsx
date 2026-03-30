import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BlogLayout } from '../components/BlogLayout';
import { getSeriesPosts } from '../utils/blog';
import type { Language } from '../config';

export function SeriesPage() {
  const { name } = useParams<{ name: string }>();
  const [lang, setLang] = useState<Language>('zh');
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  const posts = name ? getSeriesPosts(name, lang) : [];
  const displayName = name?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) ?? '';

  return (
    <BlogLayout lang={lang} toggleLang={toggleLang}>
      <Helmet>
        <title>{displayName} — Vimalinx</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => history.back()}
          className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'zh' ? '返回' : 'Back'}
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-6 w-6 text-purple-400" />
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                {displayName}
              </span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            {lang === 'zh' ? `${posts.length} 篇文章` : `${posts.length} posts`}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <BookOpen className="h-12 w-12 mb-4 opacity-30" />
            <p>{lang === 'zh' ? '该系列暂无文章' : 'No posts in this series'}</p>
          </div>
        ) : (
          <div className="space-y-0 border-l-2 border-white/5 ml-2 pl-6">
            {posts.map((post, idx) => {
              const order = post.frontmatter.series?.order ?? idx + 1;
              return (
                <motion.div
                  key={`${post.slug}-${post.lang}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex items-center gap-4 py-4 -ml-6 pl-6 border-l-2 border-transparent hover:border-purple-500/50 hover:bg-white/[0.02] transition-all"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-xs font-mono text-gray-500 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all">
                      {order}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                        {post.frontmatter.title}
                      </span>
                      {post.frontmatter.excerpt && (
                        <p className="mt-0.5 text-xs text-gray-600 line-clamp-1">{post.frontmatter.excerpt}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 shrink-0">{post.frontmatter.date}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </BlogLayout>
  );
}