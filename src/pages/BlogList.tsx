import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Bookmark, Tag as TagIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BlogLayout } from '../components/BlogLayout';
import { SearchBox } from '../components/SearchBox';
import { getAllPosts, getAllTags } from '../utils/blog';
import { CATEGORY_META, ALL_CATEGORIES, type Category } from '../types/blog';
import type { Language } from '../config';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useSearchFocus } from '../hooks/useSearchFocus';

export function BlogList() {
  const [lang, setLang] = useState<Language>('zh');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  const allPostsForLang = getAllPosts(lang);
  const tags = getAllTags(lang);

  const posts = useMemo(() => {
    if (!activeCategory) return allPostsForLang;
    return allPostsForLang.filter((p) => p.frontmatter.category === activeCategory);
  }, [allPostsForLang, activeCategory]);

  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  const focusSearch = useSearchFocus();

  useKeyboardShortcuts({
    '/': focusSearch,
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short' });
    const day = d.getDate();
    return { month, day };
  };

  // Get categories that have posts
  const categories = useMemo(() => {
    const catSet = new Set<Category>();
    allPostsForLang.forEach(p => { if (p.frontmatter.category) catSet.add(p.frontmatter.category); });
    return ALL_CATEGORIES.filter(c => catSet.has(c));
  }, [allPostsForLang]);

  // Count posts per tag
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    allPostsForLang.forEach(p => {
      p.frontmatter.tags.forEach(t => {
        counts.set(t, (counts.get(t) || 0) + 1);
      });
    });
    return counts;
  }, [allPostsForLang]);

  return (
    <BlogLayout lang={lang} toggleLang={toggleLang}>
      <Helmet>
        <title>博客 — Vimalinx</title>
        <meta name="description" content={lang === 'zh' ? '想法、记录、技术分享' : 'Thoughts, notes, and technical sharing'} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              {lang === 'zh' ? '博客' : 'Blog'}
            </span>
          </h1>
          <p className="mt-3 text-gray-500 text-lg">
            {lang === 'zh' ? '想法、记录、技术分享' : 'Thoughts, notes, and technical sharing'}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <SearchBox lang={lang} onSelect={(slug) => navigate(`/blog/${slug}`)} />
            <span className="flex items-center gap-1.5 text-xs text-gray-600">
              <FileText className="h-3 w-3" />
              {allPostsForLang.length} {lang === 'zh' ? '篇' : 'posts'}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-600">
              <Bookmark className="h-3 w-3" />
              {tags.length} {lang === 'zh' ? '标签' : 'tags'}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-600">
              <Calendar className="h-3 w-3" />
              {lang === 'zh' ? '约' : '~'}{Math.round(allPostsForLang.reduce((sum, p) => sum + (p.frontmatter.readTime || 0), 0) / 60)}{lang === 'zh' ? '小时阅读' : 'h reading'}
            </span>
            {categories.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                {categories.length} {lang === 'zh' ? '个分类' : 'categories'}
              </span>
            )}
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6 tag-filter">
            <button
              onClick={() => setActiveCategory(null)}
              className={`tag-pill ${activeCategory === null ? 'active' : ''}`}
            >
              {lang === 'zh' ? '全部' : 'All'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`tag-pill ${activeCategory === cat ? 'active' : ''}`}
              >
                {CATEGORY_META[cat].label[lang]}
              </button>
            ))}
          </div>
        )}

        {/* Two-column layout */}
        <div className="lg:flex lg:gap-12">
          {/* Main: Post List */}
          <div className="flex-1 min-w-0">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <FileText className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-lg">
                  {activeCategory
                    ? (lang === 'zh' ? '该分类下暂无文章' : 'No posts in this category')
                    : (lang === 'zh' ? '还没有文章' : 'No posts yet')}
                </p>
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="mt-4 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    {lang === 'zh' ? '清除筛选' : 'Clear filter'}
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {posts.map((post, index) => {
                  const { month, day } = formatDate(post.frontmatter.date);
                  const cat = post.frontmatter.category;
                  const catMeta = cat ? CATEGORY_META[cat] : null;
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
                        {/* Date */}
                        <div className="hidden sm:flex flex-col items-center justify-center w-14 shrink-0 pt-0.5">
                          <span className="text-[10px] text-gray-600 uppercase">{month}</span>
                          <span className="text-xl font-bold text-gray-500 group-hover:text-purple-300 transition-colors">
                            {day}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                              {post.frontmatter.title}
                            </h2>
                            {catMeta && (
                              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${catMeta.color}`}>
                                {catMeta.label[lang]}
                              </span>
                            )}
                          </div>
                          {post.frontmatter.excerpt && (
                            <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
                              {post.frontmatter.excerpt}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                            <span className="sm:hidden flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.frontmatter.date}
                            </span>
                            {post.frontmatter.readTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.frontmatter.readTime}{lang === 'zh' ? '分钟' : 'min'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tags on right */}
                        {post.frontmatter.tags.length > 0 && (
                          <div className="hidden md:flex flex-wrap justify-end gap-1.5 max-w-[180px] self-center">
                            {post.frontmatter.tags.map((t) => (
                              <Link
                                key={t}
                                to={`/blog/tag/${t}`}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[10px] text-gray-500 hover:border-purple-500/30 hover:text-purple-400 hover:bg-purple-500/5 transition-all"
                              >
                                #{t}
                              </Link>
                            ))}
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              {/* Tag Cloud */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  <TagIcon className="h-3.5 w-3.5" />
                  {lang === 'zh' ? '标签' : 'Tags'}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(tagCounts.entries())
                    .sort((a, b) => b[1] - a[1])
                    .map(([tag, count]) => (
                      <Link
                        key={tag}
                        to={`/blog/tag/${tag}`}
                        className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-xs text-gray-500 hover:border-purple-500/30 hover:text-purple-400 hover:bg-purple-500/5 transition-all"
                      >
                        #{tag}
                        <span className="text-[10px] text-gray-700">{count}</span>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    {lang === 'zh' ? '分类' : 'Categories'}
                  </h3>
                  <div className="space-y-1">
                    {categories.map(cat => {
                      const meta = CATEGORY_META[cat];
                      const count = allPostsForLang.filter(p => p.frontmatter.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                          className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                            activeCategory === cat
                              ? 'bg-purple-500/10 text-purple-300'
                              : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300'
                          }`}
                        >
                          <span>{meta.label[lang]}</span>
                          <span className="text-xs text-gray-700">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  {lang === 'zh' ? '链接' : 'Links'}
                </h3>
                <div className="space-y-1">
                  <Link to="/blog/archive" className="block rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 transition-all">
                    {lang === 'zh' ? '归档' : 'Archive'}
                  </Link>
                  <a href="/feed.xml" target="_blank" className="block rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 transition-all">
                    RSS
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </BlogLayout>
  );
}