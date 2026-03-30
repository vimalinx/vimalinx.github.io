import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { getAllPosts } from '../utils/blog';
import { getSearchIndex } from '../utils/search';
import type { Language } from '../config';

interface SearchBoxProps {
  lang: Language;
  onSelect: (slug: string) => void;
}

export function SearchBox({ lang, onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const posts = getAllPosts(lang);
  const index = useMemo(() => getSearchIndex(posts), [posts]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return index.search(query.trim()).slice(0, 8);
  }, [query, index]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 transition-all hover:border-white/20 hover:bg-white/10"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{lang === 'zh' ? '搜索' : 'Search'}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
        <Search className="h-3.5 w-3.5 text-gray-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'zh' ? '搜索文章...' : 'Search posts...'}
          className="bg-transparent text-sm text-white outline-none placeholder-gray-500 w-40 sm:w-56"
        />
        <button onClick={() => { setQuery(''); setOpen(false); }}>
          <X className="h-3.5 w-3.5 text-gray-400 hover:text-white" />
        </button>
      </div>

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-72 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-xl z-50 py-2">
          {results.map(({ item: post }) => (
            <button
              key={`${post.slug}-${post.lang}`}
              onClick={() => { onSelect(post.slug); setOpen(false); setQuery(''); }}
              className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors"
            >
              <p className="text-sm font-medium text-white truncate">{post.frontmatter.title}</p>
              {post.frontmatter.excerpt && (
                <p className="text-xs text-gray-500 truncate mt-0.5">{post.frontmatter.excerpt}</p>
              )}
            </button>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="absolute top-full mt-2 w-72 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-xl z-50 py-4 text-center text-sm text-gray-500">
          {lang === 'zh' ? '没有找到相关文章' : 'No results found'}
        </div>
      )}
    </div>
  );
}