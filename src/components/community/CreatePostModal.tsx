import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Eye, Hash, ImagePlus, Italic, Link2, Loader2, Shirt, X } from 'lucide-react';
import { CommunityPost, PostCategory, SharedLook } from '../../types/community';
import { CATEGORIES, GUIDELINES, WEEKLY_CHALLENGE } from '../../data/community';
import { GARMENTS } from '../../data/garments';
import { COLORS } from '../../data/colors';
import { StorageService } from '../../services/storageService';
import { CommunityService, normalizeTag, readFileAsDataUrl } from '../../services/communityService';
import { autoTagsForLook, lookImage, PostDraft } from '../../services/communityDrafts';
import { useToast } from '../../context/ToastContext';
import { RichText } from './CommunityBits';


interface CreatePostModalProps {
  draft?: PostDraft;
  onClose: () => void;
  onCreated: (post: CommunityPost) => void;
}

const AGREED_KEY = 'vietphuc_community_agreed_rules';
const MAX_IMAGES = 6;
const MAX_FILE_MB = 8;

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ draft, onClose, onCreated }) => {
  const { showToast } = useToast();
  const [category, setCategory] = useState<PostCategory>(draft?.category || 'showcase');
  const [title, setTitle] = useState(draft?.title || '');
  const [content, setContent] = useState(draft?.content || '');
  const [images, setImages] = useState<string[]>(draft?.images || []);
  const [tags, setTags] = useState<string[]>(draft?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [look, setLook] = useState<SharedLook | undefined>(draft?.look);
  const [preview, setPreview] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(() => {
    try {
      return localStorage.getItem(AGREED_KEY) === '1';
    } catch {
      return false;
    }
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const wardrobe = useMemo(() => StorageService.getSavedOutfits(), []);

  const wrap = (before: string, after = before, placeholder = 'chữ') => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = content.slice(s, e) || placeholder;
    const next = content.slice(0, s) + before + selected + after + content.slice(e);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  };

  const addLink = () => {
    const url = window.prompt('Dán đường dẫn (https://...)');
    if (!url || !/^https?:\/\//.test(url)) return;
    wrap('[', `](${url})`, 'liên kết');
  };

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const room = MAX_IMAGES - images.length;
    const picked = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, room);
    const tooBig = picked.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig) {
      showToast({ type: 'warning', title: 'Ảnh quá lớn', message: `Mỗi ảnh tối đa ${MAX_FILE_MB}MB.` });
      return;
    }
    const urls = await Promise.all(picked.map(readFileAsDataUrl));
    setImages((prev) => [...prev, ...urls].slice(0, MAX_IMAGES));
  };

  const addTag = (raw: string) => {
    const t = normalizeTag(raw);
    if (t && !tags.includes(t) && tags.length < 10) setTags([...tags, t]);
    setTagInput('');
  };

  const pickOutfit = (outfitId: string) => {
    const o = wardrobe.find((x) => x.id === outfitId);
    if (!o) return;
    const l: SharedLook = {
      garmentId: o.garmentId,
      colorId: o.colorId,
      accessoryIds: o.accessoryIds,
      styleId: o.styleId,
      occasionId: o.occasionId,
      gender: o.gender
    };
    setLook(l);
    const img = lookImage(l, o.aiGeneratedImage);
    if (img && !images.includes(img)) setImages((prev) => [img, ...prev].slice(0, MAX_IMAGES));
    if (!title) setTitle(o.name);
    setTags((prev) => Array.from(new Set([...prev, ...autoTagsForLook(l)])).slice(0, 10));
    setShowWardrobe(false);
  };

  const submit = async () => {
    if (!agreed) {
      showToast({ type: 'warning', title: 'Vui lòng đồng ý nội quy cộng đồng trước khi đăng' });
      return;
    }
    if (category === 'showcase' && images.length === 0) {
      showToast({ type: 'warning', title: 'Bài Phối đồ cần ít nhất 1 ảnh' });
      return;
    }
    setSubmitting(true);
    try {
      try {
        localStorage.setItem(AGREED_KEY, '1');
      } catch {
        /* bỏ qua */
      }
      const post = await CommunityService.createPost({ category, title, content, images, tags, look });
      showToast({ type: 'success', title: 'Đã đăng lên Cộng đồng!', message: 'Mọi người có thể thả sen và bình luận ngay.' });
      onCreated(post);
    } catch (e) {
      showToast({ type: 'error', title: 'Chưa đăng được', message: (e as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  const lookGarment = look ? GARMENTS.find((g) => g.id === look.garmentId) : undefined;
  const lookColor = look ? COLORS.find((c) => c.id === look.colorId) : undefined;

  return createPortal(
    <div className="fixed inset-0 z-[95] bg-stone-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tạo bài viết"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF7F2] w-full max-w-2xl rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[94vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-heritage-border/70">
          <h2 className="font-serif font-bold text-lg text-stone-900">Đăng bài lên Cộng đồng</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200/60" aria-label="Đóng">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* Chuyên mục */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                  category === c.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-heritage-border hover:border-heritage-gold'
                }`}
              >
                <div className="font-bold">{c.short}</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${category === c.id ? 'text-stone-300' : 'text-stone-500'}`}>{c.description}</div>
              </button>
            ))}
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={140}
            placeholder="Tiêu đề bài viết…"
            className="w-full text-lg font-serif font-bold bg-transparent border-b border-heritage-border focus:border-heritage-gold outline-none py-2 placeholder:text-stone-400"
          />

          {/* Trình soạn thảo */}
          <div className="bg-white rounded-2xl border border-heritage-border overflow-hidden">
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-stone-100 bg-stone-50/60">
              <button onClick={() => wrap('**')} className="p-1.5 rounded hover:bg-stone-200" title="In đậm">
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => wrap('*')} className="p-1.5 rounded hover:bg-stone-200" title="In nghiêng">
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button onClick={addLink} className="p-1.5 rounded hover:bg-stone-200" title="Chèn liên kết">
                <Link2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => wrap('#', '', 'hashtag')} className="p-1.5 rounded hover:bg-stone-200" title="Hashtag">
                <Hash className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreview((p) => !p)}
                className={`ml-auto flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded ${preview ? 'bg-stone-900 text-white' : 'hover:bg-stone-200'}`}
              >
                <Eye className="w-3.5 h-3.5" /> Xem trước
              </button>
            </div>
            {preview ? (
              <div className="p-3 min-h-[140px] text-sm text-stone-700">
                {content ? <RichText text={content} /> : <span className="text-stone-400">Chưa có nội dung.</span>}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                maxLength={5000}
                placeholder="Chia sẻ câu chuyện bản phối, dịp mặc, câu hỏi… Dùng #hashtag để mọi người dễ tìm."
                className="w-full p-3 text-sm resize-y outline-none min-h-[140px]"
              />
            )}
          </div>

          {/* Ảnh */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700">Hình ảnh ({images.length}/{MAX_IMAGES})</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowWardrobe((s) => !s)}
                  className="text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
                >
                  <Shirt className="w-3 h-3" /> Từ Tủ đồ ({wardrobe.length})
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={images.length >= MAX_IMAGES}
                  className="text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:border-stone-400 disabled:opacity-40"
                >
                  <ImagePlus className="w-3 h-3" /> Tải ảnh
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
              </div>
            </div>

            {showWardrobe && (
              <div className="mb-3 grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-2 bg-white rounded-xl border border-heritage-border">
                {wardrobe.length === 0 && <p className="col-span-full text-xs text-stone-500 p-2">Tủ đồ trống — hãy lưu bản phối từ Studio trước.</p>}
                {wardrobe.map((o) => (
                  <button key={o.id} onClick={() => pickOutfit(o.id)} className="text-left rounded-lg overflow-hidden border border-stone-200 hover:ring-2 hover:ring-heritage-gold">
                    <img src={lookImage({ garmentId: o.garmentId, colorId: o.colorId, accessoryIds: o.accessoryIds }, o.aiGeneratedImage)} alt={o.name} className="w-full aspect-[3/4] object-cover" />
                    <div className="text-[10px] p-1 line-clamp-2 leading-tight">{o.name}</div>
                  </button>
                ))}
              </div>
            )}

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              className="grid grid-cols-3 sm:grid-cols-6 gap-2"
            >
              {images.map((src, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-stone-200 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/60 text-white px-1.5 rounded">Ảnh bìa</span>}
                  <button
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                    aria-label="Gỡ ảnh"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="aspect-[3/4] rounded-xl border-2 border-dashed border-stone-300 text-stone-400 hover:border-heritage-gold hover:text-heritage-gold flex flex-col items-center justify-center text-[10px] gap-1"
                >
                  <ImagePlus className="w-5 h-5" /> Kéo thả
                </button>
              )}
            </div>
          </div>

          {/* Bản phối đính kèm */}
          {look && lookGarment && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-heritage-gold/40">
              {lookColor && <span className="w-8 h-8 rounded-lg" style={{ backgroundColor: lookColor.hex }} />}
              <div className="text-xs flex-1">
                <div className="font-bold text-stone-900">Đính kèm công thức: {lookGarment.name}</div>
                <div className="text-stone-500">Người xem có thể bấm “Thử bản phối này” để remix.</div>
              </div>
              <button onClick={() => setLook(undefined)} className="p-1 text-stone-400 hover:text-stone-800" aria-label="Gỡ công thức">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Tag */}
          <div>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-xl border border-heritage-border">
              {tags.map((t) => (
                <span key={t} className="text-[11px] font-semibold text-teal-700 bg-teal-50 pl-2 pr-1 py-0.5 rounded-full flex items-center gap-1">
                  #{t}
                  <button onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`Gỡ ${t}`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                onBlur={() => tagInput && addTag(tagInput)}
                placeholder={tags.length ? '' : 'Thêm hashtag (Enter)…'}
                className="flex-1 min-w-[120px] text-xs outline-none bg-transparent py-1"
              />
            </div>
            {!tags.includes(WEEKLY_CHALLENGE.tag) && (
              <button onClick={() => addTag(WEEKLY_CHALLENGE.tag)} className="mt-1.5 text-[11px] text-heritage-red font-semibold hover:underline">
                + Tham gia thử thách tuần #{WEEKLY_CHALLENGE.tag}
              </button>
            )}
          </div>

          <label className="flex items-start gap-2 text-[11px] text-stone-600 bg-heritage-parchment/60 rounded-xl p-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-heritage-red" />
            <span>
              Tôi đồng ý với nội quy cộng đồng: <span className="text-stone-500">{GUIDELINES.slice(0, 3).join(' · ')}</span>
            </span>
          </label>
        </div>

        <div className="px-6 py-4 border-t border-heritage-border/70 flex items-center gap-3">
          <span className="text-[11px] text-stone-500">
            {CommunityService.mode === 'cloud' ? 'Bài sẽ hiển thị công khai cho mọi người.' : 'Chế độ demo: bài lưu trên trình duyệt này.'}
          </span>
          <button
            onClick={submit}
            disabled={submitting || !title.trim()}
            className="ml-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-heritage-red to-heritage-red-dark text-white text-sm font-bold disabled:opacity-40 flex items-center gap-2 shadow-red-glow"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Đăng bài
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
