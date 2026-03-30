import { Tag } from 'lucide-react';

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  allLabel?: string;
}

export function TagFilter({ tags, activeTag, onTagChange, allLabel = '全部' }: TagFilterProps) {
  return (
    <div className="tag-filter">
      <button
        onClick={() => onTagChange(null)}
        className={`tag-pill ${activeTag === null ? 'active' : ''}`}
      >
        {allLabel}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(activeTag === tag ? null : tag)}
          className={`tag-pill ${activeTag === tag ? 'active' : ''}`}
        >
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        </button>
      ))}
    </div>
  );
}