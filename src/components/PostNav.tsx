import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../types/blog';

interface PostNavProps {
  prev?: BlogPost;
  next?: BlogPost;
  lang: 'zh' | 'en';
}

export function PostNav({ prev, next, lang }: PostNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          to={`/blog/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]"
        >
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <ArrowLeft className="h-3 w-3" />
            {lang === 'zh' ? '上一篇' : 'Previous'}
          </span>
          <span className="text-sm font-medium text-gray-300 group-hover:text-purple-300 transition-colors line-clamp-1">
            {prev.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={`/blog/${next.slug}`}
          className="group flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-right transition-all hover:border-white/10 hover:bg-white/[0.04]"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-gray-500">
            {lang === 'zh' ? '下一篇' : 'Next'}
            <ArrowRight className="h-3 w-3" />
          </span>
          <span className="text-sm font-medium text-gray-300 group-hover:text-purple-300 transition-colors line-clamp-1">
            {next.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}