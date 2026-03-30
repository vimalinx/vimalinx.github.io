import { useState } from 'react';
import { Link2, Twitter } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  slug: string;
  lang: 'zh' | 'en';
}

export function ShareButtons({ title, slug, lang }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://vimalinx.xyz/blog/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`${title} — Vimalinx`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">
        {lang === 'zh' ? '分享' : 'Share'}
      </h3>
      <div className="flex gap-2">
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <Link2 className="h-4 w-4" />
          {copied ? (lang === 'zh' ? '已复制' : 'Copied!') : (lang === 'zh' ? '复制链接' : 'Copy link')}
        </button>
        <button
          onClick={shareTwitter}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </button>
      </div>
    </div>
  );
}