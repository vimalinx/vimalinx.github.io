import { Link } from 'react-router-dom';
import { Languages, ArrowLeft } from 'lucide-react';
import { Background } from './Background';

interface BlogLayoutProps {
  lang: 'zh' | 'en';
  toggleLang: () => void;
  children: React.ReactNode;
}

export function BlogLayout({ lang, toggleLang, children }: BlogLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-purple-500/30">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Background />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between px-6 py-6 md:px-12">
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
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm backdrop-blur-md transition-all hover:bg-white/10 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{lang === 'zh' ? '首页' : 'Home'}</span>
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
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 pt-28 pb-16 px-6 md:px-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-6 md:px-12 text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} Vimalinx</p>
      </footer>
    </div>
  );
}
