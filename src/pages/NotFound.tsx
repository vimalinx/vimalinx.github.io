import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white flex items-center justify-center">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-purple-900/20 via-black to-indigo-900/20" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-6"
      >
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600">
          404
        </h1>
        <p className="mt-4 text-gray-500 text-lg">页面不存在 / Page not found</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <Home className="h-4 w-4" />
            首页
          </Link>
          <Link
            to="/blog"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            博客
          </Link>
        </div>
      </motion.div>
    </div>
  );
}