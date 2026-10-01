import React from 'react';
import { CommunityAuthor } from '../../types/community';
import { titleForLikes } from '../../data/community';

// Hoa sen — biểu tượng "thả tim" mang tính di sản
export const LotusIcon: React.FC<{ active?: boolean; className?: string }> = ({ active, className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <g
      fill={active ? '#CA4F76' : 'none'}
      stroke={active ? '#9B1D20' : 'currentColor'}
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M12 3c2.2 2.4 3.2 5 3.2 7.6 0 2.8-1.4 5.2-3.2 6.9-1.8-1.7-3.2-4.1-3.2-6.9C8.8 8 9.8 5.4 12 3z" />
      <path d="M8.9 9.4C6.6 8.4 4.2 8.3 2.5 8.8c.4 3.6 2.5 7 6.2 8.3 1.1.4 2.2.5 3.3.4" />
      <path d="M15.1 9.4c2.3-1 4.7-1.1 6.4-.6-.4 3.6-2.5 7-6.2 8.3-1.1.4-2.2.5-3.3.4" />
    </g>
    <path d="M5 20.5h14" stroke={active ? '#C59338' : 'currentColor'} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const Avatar: React.FC<{ author: CommunityAuthor; size?: string }> = ({ author, size = 'w-9 h-9' }) => (
  <div className={`${size} rounded-full overflow-hidden bg-gradient-to-br from-heritage-red to-heritage-gold shrink-0 ring-2 ring-white shadow-sm flex items-center justify-center text-white font-serif font-bold text-sm`}>
    {author.avatar ? (
      <img
        src={author.avatar}
        alt={author.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    ) : (
      author.name.charAt(0).toUpperCase()
    )}
  </div>
);

export const TitleChip: React.FC<{ likes: number }> = ({ likes }) => {
  const t = titleForLikes(likes);
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${t.color}`}>
      {t.name}
    </span>
  );
};

// Hiển thị nội dung bài: **đậm**, *nghiêng*, [chữ](link), #hashtag, danh sách đánh số
export const RichText: React.FC<{ text: string; onTagClick?: (tag: string) => void; className?: string }> = ({
  text,
  onTagClick,
  className = ''
}) => {
  const renderInline = (line: string, keyPrefix: string) => {
    const parts: React.ReactNode[] = [];
    const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|#[\p{L}\p{N}_]+|https?:\/\/[^\s]+)/gu;
    let last = 0;
    let m: RegExpExecArray | null;
    let i = 0;
    while ((m = re.exec(line))) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      const tok = m[0];
      const key = `${keyPrefix}-${i++}`;
      if (tok.startsWith('**')) parts.push(<strong key={key} className="font-bold text-stone-900">{tok.slice(2, -2)}</strong>);
      else if (tok.startsWith('[')) {
        const [, label, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/) || [];
        parts.push(
          <a key={key} href={href} target="_blank" rel="noopener noreferrer nofollow" className="text-heritage-red underline underline-offset-2">
            {label}
          </a>
        );
      } else if (tok.startsWith('#'))
        parts.push(
          <button
            key={key}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTagClick?.(tok.slice(1));
            }}
            className="text-teal-700 font-semibold hover:underline"
          >
            {tok}
          </button>
        );
      else if (tok.startsWith('http'))
        parts.push(
          <a key={key} href={tok} target="_blank" rel="noopener noreferrer nofollow" className="text-heritage-red underline break-all">
            {tok}
          </a>
        );
      else parts.push(<em key={key}>{tok.slice(1, -1)}</em>);
      last = m.index + tok.length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return parts;
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {text.split('\n').map((line, idx) =>
        line.trim() === '' ? (
          <div key={idx} className="h-1" />
        ) : /^\d+\.\s/.test(line) ? (
          <div key={idx} className="flex gap-2 pl-1">
            <span className="text-heritage-gold font-bold">{line.match(/^\d+/)![0]}.</span>
            <span>{renderInline(line.replace(/^\d+\.\s/, ''), `l${idx}`)}</span>
          </div>
        ) : (
          <p key={idx}>{renderInline(line, `l${idx}`)}</p>
        )
      )}
    </div>
  );
};
