import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { Calendar, Clock, Tag, ArrowLeft, Languages } from 'lucide-react';
import { BlogLayout } from '../components/BlogLayout';
import { getPost, getAvailableLangs } from '../utils/blog';
import type { Language } from '../config';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('zh');

  const post = slug ? getPost(slug, lang) : undefined;
  // Fallback to whatever language is available
  const availableLangs = slug ? getAvailableLangs(slug) : [];
  const displayPost = post ?? (slug && availableLangs.length > 0 ? getPost(slug, availableLangs[0]) : undefined);
  const displayLang = displayPost?.lang ?? lang;

  const toggleLang = () => {
    const otherLang: Language = displayLang === 'zh' ? 'en' : 'zh';
    setLang(otherLang);
  };

  if (!displayPost) {
    return (
      <BlogLayout lang={lang} toggleLang={toggleLang}>
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-xl mb-4">{lang === 'zh' ? '文章未找到' : 'Post not found'}</p>
          <Link to="/blog" className="text-purple-400 hover:text-purple-300 transition-colors">
            {lang === 'zh' ? '返回博客' : 'Back to Blog'}
          </Link>
        </div>
      </BlogLayout>
    );
  }

  const fm = displayPost.frontmatter;

  return (
    <BlogLayout lang={displayLang} toggleLang={toggleLang}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        {/* Back link */}
        <button
          onClick={() => navigate('/blog')}
          className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {displayLang === 'zh' ? '返回博客' : 'Back to Blog'}
        </button>

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              {fm.title}
            </span>
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {fm.date}
            </span>
            {fm.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {fm.readTime} {displayLang === 'zh' ? '分钟' : 'min'}
              </span>
            )}
            {availableLangs.length > 1 && (
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Languages className="h-4 w-4" />
                {displayLang === 'zh' ? 'English' : '中文'}
              </button>
            )}
          </div>

          {fm.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {fm.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />

        {/* Article Content */}
        <div className="blog-prose">
          <Markdown>{displayPost.content}</Markdown>
        </div>
      </motion.article>
    </BlogLayout>
  );
}
