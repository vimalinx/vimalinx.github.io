import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { Calendar, Clock, Tag, ArrowLeft, Languages, ArrowUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BlogLayout } from '../components/BlogLayout';
import { ReadingProgress } from '../components/ReadingProgress';
import { TableOfContents } from '../components/TableOfContents';
import { PostNav } from '../components/PostNav';
import { Comments } from '../components/Comments';
import { getPost, getAvailableLangs, getTableOfContents, getAdjacentPosts } from '../utils/blog';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';
import 'highlight.js/styles/github-dark.min.css';
import type { Language } from '../config';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('markdown', markdown);

// CodeBlock component
function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const _language = className?.replace('language-', '') || '';
  void _language;

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children]);

  const handleCopy = () => {
    const text = codeRef.current?.textContent || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <button onClick={handleCopy} className={`copy-btn ${copied ? 'copied' : ''}`}>
        {copied ? '✓ 已复制' : '复制'}
      </button>
      <pre className={className} {...props}>
        <code ref={codeRef} className={className}>{children}</code>
      </pre>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('zh');
  const [showBackTop, setShowBackTop] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const post = slug ? getPost(slug, lang) : undefined;
  const availableLangs = slug ? getAvailableLangs(slug) : [];
  const displayPost = post ?? (slug && availableLangs.length > 0 ? getPost(slug, availableLangs[0]) : undefined);
  const displayLang = displayPost?.lang ?? lang;

  const toc = displayPost ? getTableOfContents(displayPost.content) : [];
  const adjacent = slug ? getAdjacentPosts(slug, displayLang) : {};

  const toggleLang = () => {
    const otherLang: Language = displayLang === 'zh' ? 'en' : 'zh';
    setLang(otherLang);
  };

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const siteUrl = 'https://vimalinx.xyz';

  return (
    <>
      <Helmet>
        <title>{fm.title} — Vimalinx</title>
        <meta name="description" content={fm.excerpt} />
        <meta property="og:title" content={fm.title} />
        <meta property="og:description" content={fm.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${siteUrl}/blog/${slug}`} />
        <meta property="article:published_time" content={fm.date} />
        {fm.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>
      <ReadingProgress />
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
            <Markdown
              components={{
                h2: ({ children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
                  return <h2 id={id} {...props}>{children}</h2>;
                },
                h3: ({ children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
                  return <h3 id={id} {...props}>{children}</h3>;
                },
                pre: ({ children, ...props }) => {
                  // Extract code element from children
                  const codeChild = Array.isArray(children) ? children[0] : children;
                  if (codeChild?.props?.className?.startsWith('language-')) {
                    return <CodeBlock {...codeChild.props} />;
                  }
                  return <pre {...props}>{children}</pre>;
                },
                img: ({ src, alt, ...props }) => (
                  <img
                    src={src}
                    alt={alt}
                    className="mb-6 rounded-xl border border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxSrc(src || null)}
                    {...props}
                  />
                ),
              }}
            >
              {displayPost.content}
            </Markdown>
          </div>

          {/* Post Navigation */}
          <PostNav prev={adjacent.prev} next={adjacent.next} lang={displayLang} />
        </motion.article>

        <Comments slug={slug || ''} lang={displayLang} />

        {/* Table of Contents */}
        <TableOfContents headings={toc} />
      </BlogLayout>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={`back-to-top ${showBackTop ? 'visible' : ''}`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      {/* Image Lightbox */}
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="" />
        </div>
      )}
    </>
  );
}