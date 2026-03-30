import { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

interface CommentsProps {
  slug: string;
  lang: 'zh' | 'en';
}

export function Comments({ slug, lang }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'vimalinx/vimalinx.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOQqfqjw');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOQqfqj84CjZgE');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'dark_tritanopia');
    script.setAttribute('data-lang', lang === 'zh' ? 'zh-CN' : 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);
  }, [slug, lang]);

  return (
    <div className="mt-16 pt-8 border-t border-white/10">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <MessageCircle className="h-4 w-4" />
        {lang === 'zh' ? '评论' : 'Comments'}
      </div>
      <div ref={containerRef} />
    </div>
  );
}