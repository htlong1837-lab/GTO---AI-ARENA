import React from 'react';
import { MessageCircle, Images, Wand2 } from 'lucide-react';
import { CommunityPost } from '../../types/community';
import { CATEGORIES } from '../../data/community';
import { GARMENTS } from '../../data/garments';
import { COLORS } from '../../data/colors';
import { timeAgo } from '../../services/communityService';
import { Avatar, LotusIcon, TitleChip } from './CommunityBits';

interface PostCardProps {
  post: CommunityPost;
  liked: boolean;
  authorLikes: number;
  onOpen: () => void;
  onLike: () => void;
  onTagClick: (tag: string) => void;
}

const CATEGORY_STYLE: Record<string, string> = {
  showcase: 'bg-heritage-red text-white',
  qa: 'bg-teal-600 text-white',
  culture: 'bg-heritage-indigo text-white',
  events: 'bg-heritage-gold text-stone-950'
};

export const PostCard: React.FC<PostCardProps> = ({ post, liked, authorLikes, onOpen, onLike, onTagClick }) => {
  const category = CATEGORIES.find((c) => c.id === post.category);
  const garment = post.look ? GARMENTS.find((g) => g.id === post.look!.garmentId) : undefined;
  const color = post.look ? COLORS.find((c) => c.id === post.look!.colorId) : undefined;
  const cover = post.images[0];

  return (
    <article
      onClick={onOpen}
      className="break-inside-avoid mb-4 bg-white rounded-3xl border border-heritage-border overflow-hidden shadow-xs hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
    >
      {cover && (
        <div className="relative overflow-hidden bg-heritage-parchment">
          <img
            src={cover}
            alt={post.title}
            loading="lazy"
            className="w-full h-auto max-h-[520px] object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
          <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${CATEGORY_STYLE[post.category]}`}>
            {category?.short}
          </span>
          {post.images.length > 1 && (
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-black/60 text-white flex items-center gap-1">
              <Images className="w-3 h-3" /> {post.images.length}
            </span>
          )}
          {garment && (
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex items-center gap-2">
              {color && <span className="w-3.5 h-3.5 rounded-full ring-2 ring-white/80" style={{ backgroundColor: color.hex }} />}
              <span className="text-[11px] font-semibold text-white drop-shadow">{garment.name}</span>
              <Wand2 className="w-3 h-3 text-amber-300 ml-auto" />
            </div>
          )}
        </div>
      )}

      <div className="p-4 space-y-2.5">
        {!cover && (
          <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_STYLE[post.category]}`}>
            {category?.short}
          </span>
        )}
        <h3 className="font-serif font-bold text-stone-900 leading-snug line-clamp-2">{post.title}</h3>
        {post.content && <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 font-light">{post.content.replace(/\*\*|\*/g, '')}</p>}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 4).map((t) => (
              <button
                key={t}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(t);
                }}
                className="text-[10px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-full transition-colors"
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <Avatar author={post.author} size="w-7 h-7" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-800 truncate">{post.author.name}</span>
              <TitleChip likes={authorLikes} />
            </div>
            <span className="text-[10px] text-stone-400">{timeAgo(post.createdAt)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            aria-pressed={liked}
            aria-label={liked ? 'Bỏ thả sen' : 'Thả sen'}
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-all active:scale-90 ${
              liked ? 'text-heritage-red bg-red-50' : 'text-stone-500 hover:text-heritage-red hover:bg-red-50/60'
            }`}
          >
            <LotusIcon active={liked} />
            {post.likesCount}
          </button>
          <span className="flex items-center gap-1 text-xs text-stone-500">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.commentsCount}
          </span>
        </div>
      </div>
    </article>
  );
};
