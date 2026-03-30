import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag as TagIcon, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BlogLayout } from '../components/BlogLayout';
import { getAllPosts, getAllTags } from '../utils/blog';
import { CATEGORY_META } from '../types/blog';
import { useState } from 'react';
import type { Language } from '../config';

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const [lang, setLang] = useState<Language>('zh');
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  const allPosts = getAllPosts(lang);
  const posts = allPosts.filter(p => p.frontmatter.tags.includes(tag || ''));
  const allTags = getAllTags(lang);

  return (
    <BlogLayout lang={lang} toggleLang={toggleLang}>
      <Helmet>
        <title>#{tag} — Vimalinx</title>
        <meta name="description" content={`Posts tagged with ${tag}`} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'zh' ? '返回博客' : 'Back to Blog'}
        </Link>

        {/* Tag Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <TagIcon className="h-6 w-6 text-purple-400" />
            <h1 className="text-3xl font-black text-white">#{tag}</h1>
          </div>
          <p className="text-gray-500">
            {posts.length} {lang === 'zh' ? '篇文章' : 'posts'}
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FileText className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg">{lang === 'zh' ? '该标签下暂无文章' : 'No posts with this tag'}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {posts.map((post, index) => {
              const cat = post.frontmatter.category;
              const catMeta = cat ? CATEGORY_META[cat] : null;
              const d = new Date(post.frontmatter.date);
              const month = d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short' });
              const day = d.getDate();
              return (
                <motion.div
                  key={`${post.slug}-${post.lang}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex gap-6 py-6 transition-all hover:bg-white/[0.02] -mx-3 px-3 rounded-xl"
                  >
                    <div className="hidden sm:flex flex-col items-center justify-center w-16 shrink-0 pt-1">
                      <span className="text-xs text-gray-500 uppercase">{month}</span>
                      <span className="text-2xl font-bold text-gray-400 group-hover:text-purple-300 transition-colors">{day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                          {post.frontmatter.title}
                        </h2>
                        {catMeta && (
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${catMeta.color}`}>
                            {catMeta.label[lang]}
                          </span>
                        )}
                      </div>
                      {post.frontmatter.excerpt && (
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-2">{post.frontmatter.excerpt}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Other Tags */}
        {allTags.length > 1 && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              {lang === 'zh' ? '其他标签' : 'Other Tags'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.filter(t => t !== tag).map(t => (
                <Link
                  key={t}
                  to={`/blog/tag/${t}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 hover:border-white/20 hover:text-purple-300 transition-all"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </BlogLayout>
  );
}