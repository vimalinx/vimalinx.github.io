import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Languages, ArrowLeft, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { Background } from './Background';

interface BlogLayoutProps {
  lang: 'zh' | 'en';
  toggleLang: () => void;
  children: React.ReactNode;
}

export function BlogLayout({ lang, toggleLang, children }: BlogLayoutProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('light', saved === 'light');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };
  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-purple-500/30">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:outline-none"
      >
        {lang === 'zh' ? '跳到正文' : 'Skip to content'}
      </a>

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Background />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between px-6 py-6 md:px-12">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold tracking-tighter mix-blend-difference">
              VIMALINX
            </Link>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-white mix-blend-difference"
            >
              {lang === 'zh' ? '博客' : 'Blog'}
            </Link>
            <Link
              to="/blog/archive"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-white mix-blend-difference"
            >
              {lang === 'zh' ? '归档' : 'Archive'}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm backdrop-blur-md transition-all hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-gray-400 group-hover:text-white" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400 group-hover:text-amber-300" />
              )}
            </button>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm backdrop-blur-md transition-all hover:bg-white/10 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{lang === 'zh' ? '首页' : 'Home'}</span>
            </Link>
            <button
              onClick={toggleLang}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm backdrop-blur-md transition-all hover:bg-white/10"
            >
              <Languages className="h-4 w-4 text-gray-400 group-hover:text-white" />
              <span className="font-medium text-gray-300 group-hover:text-white">
                {lang === 'zh' ? 'EN' : '中文'}
              </span>
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center justify-center rounded-full border border-white/10 bg-black/20 p-2 backdrop-blur-md transition-all hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <span className={`block h-0.5 w-4 bg-gray-300 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 w-4 bg-gray-300 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-4 bg-gray-300 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden mx-6 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden"
          >
            <nav className="flex flex-col p-2">
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
              >
                {lang === 'zh' ? '博客' : 'Blog'}
              </Link>
              <Link
                to="/blog/archive"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
              >
                {lang === 'zh' ? '归档' : 'Archive'}
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
              >
                {lang === 'zh' ? '首页' : 'Home'}
              </Link>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Content */}
      <main id="main-content" className="relative z-10 pt-28 pb-16 px-6 md:px-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-6 md:px-12 text-xs text-gray-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Vimalinx</p>
          <div className="flex gap-4">
            <Link to="/blog/archive" className="hover:text-gray-400 transition-colors">
              {lang === 'zh' ? '归档' : 'Archive'}
            </Link>
            <a href="/feed.xml" target="_blank" className="hover:text-gray-400 transition-colors">RSS</a>
            <a href="/sitemap.xml" target="_blank" className="hover:text-gray-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
