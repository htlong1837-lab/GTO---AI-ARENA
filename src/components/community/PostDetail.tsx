import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Flag, Link2, Trash2, Wand2 } from 'lucide-react';
import { CommunityPost, SharedLook } from '../../types/community';
import { CATEGORIES } from '../../data/community';
import { GARMENTS } from '../../data/garments';
import { COLORS } from '../../data/colors';
import { ACCESSORIES } from '../../data/accessories';
import { CommunityService, getMe, timeAgo } from '../../services/communityService';
import { useToast } from '../../context/ToastContext';
import { Avatar, LotusIcon, RichText, TitleChip } from './CommunityBits';
import { CommentSection } from './CommentSection';

interface PostDetailProps {
  post: CommunityPost;
  liked: boolean;
  authorLikes: number;
  onClose: () => void;
  onLike: () => void;
  onDeleted: () => void;
  onCommentCount: (count: number) => void;
  onTagClick: (tag: string) => void;
  onRemix: (look: SharedLook) => void;
}

const REPORT_REASONS = ['Spam / quảng cáo', 'Xuyên tạc lịch sử, văn hóa', 'Công kích cá nhân', 'Hình ảnh không phù hợp', 'Mạo danh / ảnh không phải của mình'];

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  liked,
  authorLikes,
  onClose,
  onLike,
  onDeleted,
  onCommentCount,
  onTagClick,
  onRemix
}) => {
  const { showToast } = useToast();
  const [imageIdx, setImageIdx] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const isMine = post.author.id === getMe().id;
  const garment = post.look ? GARMENTS.find((g) => g.id === post.look!.garmentId) : undefined;
  const color = post.look ? COLORS.find((c) => c.id === post.look!.colorId) : undefined;
  const accs = post.look ? ACCESSORIES.filter((a) => post.look!.accessoryIds.includes(a.id)) : [];
  const category = CATEGORIES.find((c) => c.id === post.category);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setImageIdx((i) => Math.min(post.images.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setImageIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, post.images.length]);

  const handleCount = useCallback((n: number) => onCommentCount(n), [onCommentCount]);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/community/post/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast({ type: 'success', title: 'Đã sao chép liên kết bài viết' });
    } catch {
      window.prompt('Sao chép liên kết:', url);
    }
  };

  const report = async (reason: string) => {
    setReportOpen(false);
    try {
      await CommunityService.reportPost(post.id, reason);
      showToast({ type: 'info', title: 'Cảm ơn bạn đã báo cáo', message: 'Bài viết sẽ tự ẩn khi nhận đủ báo cáo từ cộng đồng.' });
    } catch (e) {
      showToast({ type: 'warning', title: 'Không gửi được báo cáo', message: (e as Error).message });
    }
  };

  const remove = async () => {
    if (!window.confirm('Xóa vĩnh viễn bài viết này?')) return;
    try {
      await CommunityService.deletePost(post.id);
      showToast({ type: 'success', title: 'Đã xóa bài viết' });
      onDeleted();
    } catch (e) {
      showToast({ type: 'error', title: 'Không xóa được', message: (e as Error).message });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[90] bg-stone-950/70 backdrop-blur-sm flex items-stretch sm:items-center justify-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={post.title}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#FAF7F2] w-full max-w-6xl sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-full sm:max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Ảnh */}
        {post.images.length > 0 && (
          <div className="relative lg:w-[55%] bg-stone-950 flex items-center justify-center shrink-0 max-h-[55vh] lg:max-h-none">
            <img src={post.images[imageIdx]} alt={post.title} className="w-full h-full max-h-[55vh] lg:max-h-[92vh] object-contain" />
            {post.images.length > 1 && (
              <>
                <button
                  onClick={() => setImageIdx((i) => Math.max(0, i - 1))}
                  disabled={imageIdx === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center disabled:opacity-30"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setImageIdx((i) => Math.min(post.images.length - 1, i + 1))}
                  disabled={imageIdx === post.images.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center disabled:opacity-30"
                  aria-label="Ảnh sau"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  {post.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${i === imageIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                      aria-label={`Ảnh ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-[#FAF7F2]/95 backdrop-blur px-5 py-3 flex items-center gap-2 border-b border-heritage-border/60">
            <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-stone-200/60" aria-label="Đóng">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{category?.name}</span>
            <div className="ml-auto flex items-center gap-1">
              <button onClick={copyLink} className="p-2 rounded-full hover:bg-stone-200/60 text-stone-600" title="Sao chép liên kết">
                <Link2 className="w-4 h-4" />
              </button>
              {isMine ? (
                <button onClick={remove} className="p-2 rounded-full hover:bg-red-50 text-red-500" title="Xóa bài viết">
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <div className="relative">
                  <button onClick={() => setReportOpen((o) => !o)} className="p-2 rounded-full hover:bg-stone-200/60 text-stone-500" title="Báo cáo vi phạm">
                    <Flag className="w-4 h-4" />
                  </button>
                  {reportOpen && (
                    <div className="absolute right-0 top-10 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-20">
                      <p className="text-[11px] font-bold text-stone-500 px-2 py-1">Lý do báo cáo</p>
                      {REPORT_REASONS.map((r) => (
                        <button key={r} onClick={() => report(r)} className="w-full text-left text-xs px-2 py-2 rounded-lg hover:bg-stone-100">
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-3">
              <Avatar author={post.author} size="w-11 h-11" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">{post.author.name}</span>
                  <TitleChip likes={authorLikes} />
                </div>
                <span className="text-xs text-stone-500">{timeAgo(post.createdAt)}</span>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-stone-900 leading-tight">{post.title}</h2>
            {post.content && <RichText text={post.content} onTagClick={onTagClick} className="text-sm text-stone-700 leading-relaxed" />}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <button key={t} onClick={() => onTagClick(t)} className="text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-full">
                    #{t}
                  </button>
                ))}
              </div>
            )}

            {/* Công thức bản phối */}
            {garment && (
              <div className="rounded-2xl bg-white border border-heritage-gold/40 p-4 space-y-3 shadow-gold-fine">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-gold-dark">Công thức bản phối</span>
                  <span className="text-[10px] text-stone-400">{garment.region}</span>
                </div>
                <div className="flex items-center gap-3">
                  {color && <span className="w-10 h-10 rounded-xl ring-2 ring-white shadow" style={{ backgroundColor: color.hex }} />}
                  <div>
                    <div className="font-serif font-bold text-stone-900">{garment.name}</div>
                    <div className="text-xs text-stone-500">{color?.vietnameseName}</div>
                  </div>
                </div>
                {accs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {accs.map((a) => (
                      <span key={a.id} className={`text-[10px] px-2 py-1 rounded-full border ${a.isTraditional ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-stone-50 border-stone-200 text-stone-700'}`}>
                        {a.name}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => onRemix(post.look!)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-heritage-red to-heritage-red-dark text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-red-glow transition-shadow"
                >
                  <Wand2 className="w-4 h-4 text-heritage-gold-light" /> Thử bản phối này trong Studio
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onLike}
                aria-pressed={liked}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all active:scale-95 ${
                  liked ? 'bg-red-50 border-red-200 text-heritage-red' : 'bg-white border-stone-200 text-stone-600 hover:border-red-200'
                }`}
              >
                <LotusIcon active={liked} className="w-5 h-5" /> {post.likesCount} sen
              </button>
            </div>

            <div className="border-t border-heritage-border/70 pt-5">
              <CommentSection postId={post.id} postAuthorId={post.author.id} onCountChange={handleCount} onTagClick={onTagClick} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
