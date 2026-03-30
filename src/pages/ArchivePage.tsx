import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, FolderOpen } from 'lucide-react';
import { BlogLayout } from '../components/BlogLayout';
import { getArchiveMonths } from '../utils/blog';
import { CATEGORY_META } from '../types/blog';
import type { Language } from '../config';

export function ArchivePage() {
  const [lang, setLang] = useState<Language>('zh');
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');
  const archives = getArchiveMonths(lang);

  const formatMonth = (year: number, month: number) => {
    const d = new Date(year, month - 1);
    return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <BlogLayout lang={lang} toggleLang={toggleLang}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              {lang === 'zh' ? '归档' : 'Archive'}
            </span>
          </h1>
          <p className="mt-4 text-gray-500 text-lg">
            {lang === 'zh' ? '按时间线浏览所有文章' : 'Browse all posts by timeline'}
          </p>
        </div>

        {archives.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FolderOpen className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg">{lang === 'zh' ? '暂无文章' : 'No posts yet'}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {archives.map(({ year, month, posts }) => (
              <section key={`${year}-${month}`}>
                <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatMonth(year, month)}
                  <span className="text-gray-600">({posts.length})</span>
                </h2>
                <div className="divide-y divide-white/5 border-l-2 border-white/5 ml-2 pl-6">
                  {posts.map((post, idx) => {
                    const cat = post.frontmatter.category;
                    const catMeta = cat ? CATEGORY_META[cat] : null;
                    const d = new Date(post.frontmatter.date);
                    const dayStr = String(d.getDate()).padStart(2, '0');
                    return (
                      <motion.div
                        key={`${post.slug}-${post.lang}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.3 }}
                      >
                        <Link
                          to={`/blog/${post.slug}`}
                          className="group flex items-center gap-4 py-3 -ml-6 pl-6 border-l-2 border-transparent hover:border-purple-500/50 hover:bg-white/[0.02] transition-all"
                        >
                          <span className="text-xs text-gray-600 font-mono w-6 shrink-0">
                            {dayStr}
                          </span>
                          <span className="text-sm text-white group-hover:text-purple-300 transition-colors flex-1">
                            {post.frontmatter.title}
                          </span>
                          {catMeta && (
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${catMeta.color}`}>
                              {catMeta.label[lang]}
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </motion.div>
    </BlogLayout>
  );
}