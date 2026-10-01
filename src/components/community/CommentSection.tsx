import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownRight, Loader2, Send, Trash2, X } from 'lucide-react';
import { CommunityComment } from '../../types/community';
import {
  buildCommentTree,
  CommunityService,
  getLikedCommentIds,
  getMe,
  timeAgo
} from '../../services/communityService';
import { useToast } from '../../context/ToastContext';
import { Avatar, LotusIcon, RichText } from './CommunityBits';

interface CommentSectionProps {
  postId: string;
  postAuthorId: string;
  onCountChange: (count: number) => void;
  onTagClick: (tag: string) => void;
}

const QUICK_REPLIES = ['Phối màu tinh tế quá! 🌸', 'Xin công thức bản phối với ạ', 'Chuẩn phong tục luôn 👏', 'Thử đổi phụ kiện truyền thống xem sao?'];

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, postAuthorId, onCountChange, onTagClick }) => {
  const { showToast } = useToast();
  const me = getMe();
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<CommunityComment | null>(null);
  const [sending, setSending] = useState(false);
  const [liked, setLiked] = useState(getLikedCommentIds);
  const [order, setOrder] = useState<'old' | 'top'>('old');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async () => {
    try {
      const list = await CommunityService.listComments(postId);
      setComments(list);
      onCountChange(list.length);
    } catch (e) {
      showToast({ type: 'error', title: 'Không tải được bình luận', message: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, [postId, onCountChange, showToast]);

  useEffect(() => {
    load();
    if (CommunityService.mode !== 'cloud') return;
    const timer = window.setInterval(load, 15000);
    return () => window.clearInterval(timer);
  }, [load]);

  const tree = useMemo(() => {
    const t = buildCommentTree(comments);
    return order === 'top' ? [...t].sort((a, b) => b.comment.likesCount - a.comment.likesCount) : t;
  }, [comments, order]);

  const submit = async () => {
    if (sending || !text.trim()) return;
    setSending(true);
    try {
      const c = await CommunityService.addComment(postId, text, replyTo?.id || null);
      const next = [...comments, c];
      setComments(next);
      onCountChange(next.length);
      setText('');
      setReplyTo(null);
    } catch (e) {
      showToast({ type: 'warning', title: 'Chưa gửi được bình luận', message: (e as Error).message });
    } finally {
      setSending(false);
    }
  };

  const toggleLike = async (c: CommunityComment) => {
    try {
      const nowLiked = await CommunityService.toggleLikeComment(c);
      setLiked(getLikedCommentIds());
      setComments((prev) => prev.map((x) => (x.id === c.id ? { ...x, likesCount: Math.max(0, x.likesCount + (nowLiked ? 1 : -1)) } : x)));
    } catch (e) {
      showToast({ type: 'error', title: 'Lỗi', message: (e as Error).message });
    }
  };

  const remove = async (c: CommunityComment) => {
    if (!window.confirm('Xóa bình luận này (và các trả lời của nó)?')) return;
    try {
      await CommunityService.deleteComment(c);
      await load();
    } catch (e) {
      showToast({ type: 'error', title: 'Không xóa được', message: (e as Error).message });
    }
  };

  const startReply = (c: CommunityComment) => {
    setReplyTo(c);
    if (!text.trim()) setText(c.parentId ? `@${c.author.name} ` : '');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const renderComment = (c: CommunityComment, isReply: boolean) => (
    <div key={c.id} className={`flex gap-2.5 ${isReply ? 'mt-3' : ''}`}>
      <Avatar author={c.author} size={isReply ? 'w-7 h-7' : 'w-8 h-8'} />
      <div className="flex-1 min-w-0">
        <div className="bg-heritage-ivory rounded-2xl rounded-tl-sm px-3.5 py-2.5 border border-heritage-border/70">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-bold text-stone-900">{c.author.name}</span>
            {c.author.id === postAuthorId && (
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-heritage-gold/20 text-heritage-gold-dark">Tác giả</span>
            )}
          </div>
          <RichText text={c.content} onTagClick={onTagClick} className="text-[13px] text-stone-700 leading-relaxed break-words" />
        </div>
        <div className="flex items-center gap-3 mt-1 pl-2 text-[11px] text-stone-500">
          <span>{timeAgo(c.createdAt)}</span>
          <button
            onClick={() => toggleLike(c)}
            className={`flex items-center gap-1 font-semibold ${liked.has(c.id) ? 'text-heritage-red' : 'hover:text-heritage-red'}`}
          >
            <LotusIcon active={liked.has(c.id)} className="w-3.5 h-3.5" />
            {c.likesCount > 0 && c.likesCount}
          </button>
          <button onClick={() => startReply(c)} className="font-semibold hover:text-stone-900">
            Trả lời
          </button>
          {c.author.id === me.id && (
            <button onClick={() => remove(c)} className="flex items-center gap-0.5 hover:text-red-600" title="Xóa bình luận">
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-stone-900">Bình luận ({comments.length})</h3>
        <div className="flex text-[11px] font-semibold bg-stone-100 rounded-full p-0.5">
          {(['old', 'top'] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrder(o)}
              className={`px-2.5 py-1 rounded-full ${order === o ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'}`}
            >
              {o === 'old' ? 'Theo thời gian' : 'Nhiều sen'}
            </button>
          ))}
        </div>
      </div>

      {/* Ô nhập */}
      <div className="bg-white rounded-2xl border border-heritage-border p-3 space-y-2 focus-within:ring-2 focus-within:ring-heritage-gold/40 transition-shadow">
        {replyTo && (
          <div className="flex items-center gap-2 text-[11px] text-stone-600 bg-stone-50 rounded-lg px-2 py-1">
            <CornerDownRight className="w-3 h-3" />
            Đang trả lời <b>{replyTo.author.name}</b>
            <button onClick={() => setReplyTo(null)} className="ml-auto text-stone-400 hover:text-stone-800" aria-label="Hủy trả lời">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-2.5">
          <Avatar author={me} size="w-8 h-8" />
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit();
            }}
            rows={2}
            maxLength={1500}
            placeholder="Góp ý bản phối một cách tinh tế… (Ctrl + Enter để gửi)"
            className="flex-1 resize-none text-sm bg-transparent outline-none placeholder:text-stone-400"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {!text &&
            QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => setText(q)}
                className="text-[10px] px-2 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                {q}
              </button>
            ))}
          <button
            onClick={submit}
            disabled={sending || !text.trim()}
            className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-heritage-red text-white disabled:opacity-40 hover:bg-heritage-red-dark transition-colors"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Gửi
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6 text-stone-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : tree.length === 0 ? (
        <p className="text-center text-xs text-stone-400 py-6">Chưa có bình luận nào — hãy là người đầu tiên góp ý!</p>
      ) : (
        <div className="space-y-4">
          {tree.map(({ comment, replies }) => (
            <div key={comment.id}>
              {renderComment(comment, false)}
              {replies.length > 0 && (
                <div className="ml-10 pl-3 border-l-2 border-heritage-gold/25">{replies.map((r) => renderComment(r, true))}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
