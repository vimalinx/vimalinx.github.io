import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

interface HeadingAnchorProps {
  id: string;
  children: React.ReactNode;
  as: 'h2' | 'h3';
}

export function HeadingAnchor({ id, children, as: Tag }: HeadingAnchorProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    window.history.replaceState(null, '', `#${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tag id={id} className="group relative scroll-mt-24">
      <a
        href={`#${id}`}
        onClick={handleClick}
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-purple-400"
        aria-label={`Link to ${String(children)}`}
      >
        <LinkIcon className="h-4 w-4" />
      </a>
      {copied && (
        <span className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs text-green-400 whitespace-nowrap">
          Copied!
        </span>
      )}
      {children}
    </Tag>
  );
}