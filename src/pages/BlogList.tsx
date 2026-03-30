import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Bookmark } from 'lucide-react';
import { BlogLayout } from '../components/BlogLayout';
import { TagFilter } from '../components/TagFilter';
import { getAllPosts, getAllTags } from '../utils/blog';
import { CATEGORY_META, type Category } from '../types/blog';
import type { Language } from '../config';

export function BlogList() {
  const [lang, setLang] = useState<Language>('zh');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const allPostsForLang = getAllPosts(lang);
  const tags = getAllTags(lang);

  const posts = useMemo(() => {
    let filtered = allPostsForLang;
    if (activeCategory) {
      filtered = filtered.filter((p) => p.frontmatter.category === activeCategory);
    }
    if (activeTag) {
      filtered = filtered.filter((p) => p.frontmatter.tags.includes(activeTag));
    }
    return filtered;
  }, [allPostsForLang, activeTag, activeCategory]);

  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

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
    return Array.from(catSet);
  }, [allPostsForLang]);

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
              {lang === 'zh' ? '博客' : 'Blog'}
            </span>
          </h1>
          <p className="mt-4 text-gray-500 text-lg">
            {lang === 'zh' ? '想法、记录、技术分享' : 'Thoughts, notes, and technical sharing'}
          </p>
          <div className="mt-6 flex gap-4">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400">
              <FileText className="h-4 w-4 text-purple-400" />
              {allPostsForLang.length} {lang === 'zh' ? '篇文章' : 'posts'}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400">
              <Bookmark className="h-4 w-4 text-indigo-400" />
              {tags.length} {lang === 'zh' ? '个标签' : 'tags'}
            </span>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-4 tag-filter">
            <button
              onClick={() => setActiveCategory(null)}
              className={`tag-pill ${activeCategory === null ? 'active' : ''}`}
            >
              {lang === 'zh' ? '全部分类' : 'All'}
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

        {/* Tag Filter */}
        {tags.length > 0 && (
          <div className="mb-8">
            <TagFilter
              tags={tags}
              activeTag={activeTag}
              onTagChange={setActiveTag}
              allLabel={lang === 'zh' ? '全部标签' : 'All Tags'}
            />
          </div>
        )}

        {/* Post List */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FileText className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg">
              {activeTag || activeCategory
                ? (lang === 'zh' ? '没有匹配的文章' : 'No matching posts')
                : (lang === 'zh' ? '还没有文章，敬请期待' : 'No posts yet, stay tuned')}
            </p>
            {(activeTag || activeCategory) && (
              <button
                onClick={() => { setActiveTag(null); setActiveCategory(null); }}
                className="mt-4 text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                {lang === 'zh' ? '清除筛选' : 'Clear filters'}
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
                    {/* Date Column */}
                    <div className="hidden sm:flex flex-col items-center justify-center w-16 shrink-0 pt-1">
                      <span className="text-xs text-gray-500 uppercase">{month}</span>
                      <span className="text-2xl font-bold text-gray-400 group-hover:text-purple-300 transition-colors">
                        {day}
                      </span>
                    </div>

                    {/* Content Column */}
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
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-2">
                          {post.frontmatter.excerpt}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="sm:hidden flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.frontmatter.date}
                        </span>
                        {post.frontmatter.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.frontmatter.readTime} {lang === 'zh' ? '分钟' : 'min'}
                          </span>
                        )}
                        {post.frontmatter.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {post.frontmatter.tags.map((tag) => (
                              <span key={tag} className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[11px] text-gray-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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