import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { getAllPosts } from '../utils/blog';
import type { Language } from '../config';

export function NotFound() {
  const [lang] = useState<Language>('zh');
  const recentPosts = getAllPosts(lang).slice(0, 3);

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-purple-500/30">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />

      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between px-6 py-6 md:px-12">
        <Link to="/" className="text-xl font-bold tracking-tighter mix-blend-difference">
          VIMALINX
        </Link>
      </header>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-8xl font-black tracking-tighter sm:text-9xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              404
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            {lang === 'zh' ? '这个页面不存在' : 'This page doesn\'t exist'}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {lang === 'zh' ? '返回首页' : 'Home'}
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 transition-all hover:bg-purple-500/20"
            >
              <FileText className="h-4 w-4" />
              {lang === 'zh' ? '博客' : 'Blog'}
            </Link>
          </div>
        </motion.div>

        {recentPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 w-full max-w-md"
          >
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-gray-600">
              {lang === 'zh' ? '或许你想看' : 'You might like'}
            </p>
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group block rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 transition-all hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <span className="text-sm text-gray-300 group-hover:text-purple-300 transition-colors">
                    {post.frontmatter.title}
                  </span>
                  <span className="ml-2 text-xs text-gray-600">{post.frontmatter.date}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}