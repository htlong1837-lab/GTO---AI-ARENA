import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, Cloud, Flame, HardDrive, Loader2, PenSquare, Search, ShieldCheck, Sparkles, TrendingUp, Trophy, X } from 'lucide-react';
import { CommunityPost, FeedSort, PostCategory, SharedLook } from '../types/community';
import { CATEGORIES, GUIDELINES, TITLES, WEEKLY_CHALLENGE, titleForLikes } from '../data/community';
import { CommunityService, getLikedPostIds, getMe, normalizeTag } from '../services/communityService';
import { useToast } from '../context/ToastContext';
import { PostCard } from '../components/community/PostCard';
import { PostDetail } from '../components/community/PostDetail';
import { CreatePostModal } from '../components/community/CreatePostModal';
import { PostDraft } from '../services/communityDrafts';
import { Avatar, TitleChip } from '../components/community/CommunityBits';

interface CommunityPageProps {
  initialPostId?: string | null;
  draft?: PostDraft | null;
  onDraftConsumed: () => void;
  onRemixLook: (look: SharedLook) => void;
  onOpenPostChange: (postId: string | null) => void;
  onNavigate: (tab: string) => void;
}

const SORTS: { id: FeedSort; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'hot', label: 'Nổi bật', icon: Flame },
  { id: 'new', label: 'Mới nhất', icon: Sparkles },
  { id: 'top', label: 'Nhiều sen', icon: Trophy }
];

const BADGES = [
  { id: 'mo-loi', name: 'Người Mở Lối', emoji: '🏮', hint: 'Đăng bài Phối đồ đầu tiên', test: (p: CommunityPost[]) => p.some((x) => x.category === 'showcase') },
  { id: 'but-nghien', name: 'Bút Nghiên', emoji: '🖌️', hint: 'Chia sẻ một bài Tàng Thư Văn Hóa', test: (p: CommunityPost[]) => p.some((x) => x.category === 'culture') },
  { id: 'hoa-mai', name: 'Hoa Mai', emoji: '🌼', hint: 'Đăng bài gắn tag Tết', test: (p: CommunityPost[]) => p.some((x) => x.tags.some((t) => /^tet/i.test(t))) },
  { id: 'phuong-neon', name: 'Phượng Neon', emoji: '🐦‍🔥', hint: `Tham gia thử thách #${WEEKLY_CHALLENGE.tag}`, test: (p: CommunityPost[]) => p.some((x) => x.tags.includes(WEEKLY_CHALLENGE.tag)) },
  { id: 'tri-am', name: 'Tri Âm', emoji: '🪷', hint: 'Thả sen cho 10 bài viết', test: () => getLikedPostIds().size >= 10 }
];

const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));

export const CommunityPage: React.FC<CommunityPageProps> = ({
  initialPostId,
  draft,
  onDraftConsumed,
  onRemixLook,
  onOpenPostChange,
  onNavigate
}) => {
  const { showToast } = useToast();
  const me = getMe();
  const [all, setAll] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<PostCategory | 'all'>('all');
  const [sort, setSort] = useState<FeedSort>('hot');
  const [tag, setTag] = useState<string>('');
  const [search, setSearch] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);
  const [liked, setLiked] = useState(getLikedPostIds);
  const [openId, setOpenId] = useState<string | null>(initialPostId || null);
  const [composer, setComposer] = useState<PostDraft | null>(draft || null);

  const load = useCallback(async () => {
    try {
      setAll(await CommunityService.listAll());
    } catch (e) {
      showToast({ type: 'error', title: 'Không tải được diễn đàn', message: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
    if (CommunityService.mode !== 'cloud') return;
    const timer = window.setInterval(load, 20000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (draft) {
      setComposer(draft);
      onDraftConsumed();
    }
  }, [draft, onDraftConsumed]);

  useEffect(() => {
    setOpenId(initialPostId || null);
  }, [initialPostId]);

  const openPost = (id: string | null) => {
    setOpenId(id);
    onOpenPostChange(id);
  };

  const visible = useMemo(
    () => CommunityService.filterPosts(all, { category, tag, search, sort, authorId: onlyMine ? me.id : undefined }),
    [all, category, tag, search, sort, onlyMine, me.id]
  );

  const creators = useMemo(() => CommunityService.creators(all), [all]);
  const likesByAuthor = useMemo(() => new Map(creators.map((c) => [c.author.id, c.likes])), [creators]);
  const trending = useMemo(() => CommunityService.trendingTags(all), [all]);
  const myPosts = useMemo(() => all.filter((p) => p.author.id === me.id), [all, me.id]);
  const myLikes = likesByAuthor.get(me.id) || 0;
  const myTitle = titleForLikes(myLikes);
  const nextTitle = TITLES.find((t) => t.min > myLikes);
  const challengeCount = all.filter((p) => p.tags.includes(WEEKLY_CHALLENGE.tag)).length;
  const openPostData = all.find((p) => p.id === openId);

  // Bài được mở qua link nhưng không có trong danh sách (vd. đã ẩn)
  useEffect(() => {
    if (!loading && openId && !openPostData) {
      CommunityService.getPost(openId).then((p) => {
        if (p) setAll((prev) => (prev.some((x) => x.id === p.id) ? prev : [p, ...prev]));
        else {
          showToast({ type: 'warning', title: 'Bài viết không tồn tại hoặc đã bị ẩn' });
          openPost(null);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, openId, openPostData]);

  const toggleLike = async (post: CommunityPost) => {
    const willLike = !liked.has(post.id);
    // Cập nhật lạc quan
    setAll((prev) => prev.map((p) => (p.id === post.id ? { ...p, likesCount: Math.max(0, p.likesCount + (willLike ? 1 : -1)) } : p)));
    try {
      await CommunityService.toggleLikePost(post.id);
      setLiked(getLikedPostIds());
    } catch (e) {
      setAll((prev) => prev.map((p) => (p.id === post.id ? { ...p, likesCount: post.likesCount } : p)));
      showToast({ type: 'error', title: 'Không thả sen được', message: (e as Error).message });
    }
  };

  const updateCommentCount = useCallback(
    (count: number) => {
      setAll((prev) => prev.map((p) => (p.id === openId && p.commentsCount !== count ? { ...p, commentsCount: count } : p)));
    },
    [openId]
  );

  const pickTag = (t: string) => {
    setTag(normalizeTag(t));
    openPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-heritage-indigo-deep text-white px-6 sm:px-10 py-8 sm:py-10 mb-6">
        <div className="absolute inset-0 opacity-25 bg-[url('images/vanlong_ornament.jpg')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-heritage-red/40 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-heritage-gold-light">
              {CommunityService.mode === 'cloud' ? <Cloud className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
              {CommunityService.mode === 'cloud' ? 'Đang kết nối cộng đồng trực tuyến' : 'Chế độ demo trên trình duyệt'}
            </span>
            <h1 className="mt-2 text-3xl sm:text-5xl font-serif font-bold leading-tight">
              Đình Làng <span className="text-heritage-gold-light italic">Việt Phục</span>
            </h1>
            <p className="mt-2 text-sm text-stone-300 max-w-xl font-light">
              Nơi chia sẻ bản phối bạn tạo ra, hỏi đáp phối màu và cùng nhau gìn giữ phong tục áo mũ Việt.
            </p>
            {trending.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                <TrendingUp className="w-4 h-4 text-heritage-gold-light mr-1" />
                {trending.map((t) => (
                  <button
                    key={t.tag}
                    onClick={() => pickTag(t.tag)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                      tag === t.tag ? 'bg-heritage-gold text-stone-950 border-heritage-gold' : 'bg-white/10 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    #{t.tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setComposer({})}
            className="self-start lg:self-end flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-heritage-gold-light to-heritage-gold text-stone-950 font-bold text-sm shadow-gold-glow hover:scale-[1.02] transition-transform"
          >
            <PenSquare className="w-4 h-4" /> Đăng bản phối
          </button>
        </div>
      </section>

      {/* Thử thách tuần */}
      <section className="mb-6 rounded-3xl border border-heritage-gold/50 bg-gradient-to-r from-amber-50 via-white to-red-50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-heritage-red text-heritage-gold-light flex items-center justify-center shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-heritage-red">Thử thách tuần · còn {daysLeft(WEEKLY_CHALLENGE.endsAt)} ngày · {challengeCount} bài dự thi</div>
          <h2 className="font-serif font-bold text-stone-900 text-lg">{WEEKLY_CHALLENGE.title}</h2>
          <p className="text-xs text-stone-600">{WEEKLY_CHALLENGE.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => pickTag(WEEKLY_CHALLENGE.tag)} className="px-4 py-2 rounded-full text-xs font-bold bg-white border border-stone-200 hover:border-stone-400">
            Xem bài dự thi
          </button>
          <button
            onClick={() => onRemixLook({ garmentId: WEEKLY_CHALLENGE.garmentId, colorId: 'tim-hue', accessoryIds: [] })}
            className="px-4 py-2 rounded-full text-xs font-bold bg-stone-900 text-white hover:bg-stone-800"
          >
            Vào Studio dự thi
          </button>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-4 order-2 lg:order-1">
          <div className="bg-white rounded-3xl border border-heritage-border p-4">
            <div className="flex items-center gap-3">
              <Avatar author={me} size="w-12 h-12" />
              <div className="min-w-0">
                <div className="font-bold text-stone-900 truncate">{me.name}</div>
                <TitleChip likes={myLikes} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-center">
              <div className="rounded-xl bg-heritage-ivory py-2">
                <div className="font-serif font-bold text-lg">{myPosts.length}</div>
                <div className="text-[10px] text-stone-500">Bài viết</div>
              </div>
              <div className="rounded-xl bg-heritage-ivory py-2">
                <div className="font-serif font-bold text-lg text-heritage-red">{myLikes}</div>
                <div className="text-[10px] text-stone-500">Sen nhận được</div>
              </div>
            </div>
            {nextTitle && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                  <span>{myTitle.name}</span>
                  <span>
                    {nextTitle.name} ({nextTitle.min} sen)
                  </span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-heritage-gold to-heritage-red"
                    style={{ width: `${Math.min(100, ((myLikes - myTitle.min) / (nextTitle.min - myTitle.min)) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {BADGES.map((b) => {
                const earned = b.test(myPosts);
                return (
                  <span
                    key={b.id}
                    title={`${b.name} — ${b.hint}`}
                    className={`text-[10px] px-2 py-1 rounded-full border ${earned ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-stone-50 border-stone-200 text-stone-400 grayscale'}`}
                  >
                    {b.emoji} {b.name}
                  </span>
                );
              })}
            </div>
            <button
              onClick={() => setOnlyMine((v) => !v)}
              className={`mt-4 w-full text-xs font-semibold py-2 rounded-xl border ${onlyMine ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 hover:border-stone-400'}`}
            >
              {onlyMine ? 'Đang xem bài của tôi' : 'Xem bài của tôi'}
            </button>
            <button onClick={() => onNavigate('profile')} className="mt-2 w-full text-[11px] text-stone-500 hover:text-stone-900">
              Đổi tên / ảnh đại diện trong Tủ đồ →
            </button>
          </div>

          <nav className="bg-white rounded-3xl border border-heritage-border p-2" aria-label="Chuyên mục">
            {[{ id: 'all' as const, name: 'Tất cả bài viết' }, ...CATEGORIES].map((c) => {
              const count = c.id === 'all' ? all.length : all.filter((p) => p.category === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm transition-colors ${
                    category === c.id ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className={`text-[10px] ${category === c.id ? 'text-stone-300' : 'text-stone-400'}`}>{count}</span>
                </button>
              );
            })}
          </nav>

          <div className="bg-white rounded-3xl border border-heritage-border p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-heritage-gold" /> Bảng vàng nghệ nhân
            </h3>
            <ol className="space-y-2.5">
              {creators.slice(0, 5).map((c, i) => (
                <li key={c.author.id} className="flex items-center gap-2.5">
                  <span className={`w-5 text-center font-serif font-bold ${i === 0 ? 'text-heritage-gold' : 'text-stone-400'}`}>{i + 1}</span>
                  <Avatar author={c.author} size="w-8 h-8" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{c.author.name}</div>
                    <div className="text-[10px] text-stone-500">
                      {c.likes} sen · {c.posts} bài
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-3xl border border-heritage-border p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Nội quy cộng đồng
            </h3>
            <ul className="space-y-1.5 text-[11px] text-stone-600 list-disc pl-4">
              {GUIDELINES.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Feed */}
        <section className="lg:col-span-9 order-1 lg:order-2">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bài viết, người dùng, hashtag…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-heritage-border text-sm outline-none focus:ring-2 focus:ring-heritage-gold/40"
              />
            </div>
            <div className="flex bg-white border border-heritage-border rounded-full p-1">
              {SORTS.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSort(s.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${sort === s.id ? 'bg-heritage-red text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chuyên mục dạng chip trên mobile */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-2 -mx-4 px-4">
            {[{ id: 'all' as const, short: 'Tất cả' }, ...CATEGORIES].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border ${category === c.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-heritage-border'}`}
              >
                {c.short}
              </button>
            ))}
          </div>

          {tag && (
            <div className="mb-4 flex items-center gap-2 text-sm">
              <span className="text-stone-500">Đang lọc theo</span>
              <span className="font-bold text-teal-700 bg-teal-50 pl-3 pr-1.5 py-1 rounded-full flex items-center gap-1">
                #{tag}
                <button onClick={() => setTag('')} aria-label="Bỏ lọc hashtag" className="p-0.5 rounded-full hover:bg-teal-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-24 text-stone-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-heritage-border">
              <p className="font-serif text-lg text-stone-700">Chưa có bài viết nào ở đây.</p>
              <p className="text-xs text-stone-500 mt-1">Hãy là người khai bút cho chủ đề này!</p>
              <button onClick={() => setComposer({ category: category === 'all' ? 'showcase' : category, tags: tag ? [tag] : [] })} className="mt-4 px-5 py-2 rounded-full bg-heritage-red text-white text-xs font-bold">
                Viết bài đầu tiên
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
              {visible.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  liked={liked.has(post.id)}
                  authorLikes={likesByAuthor.get(post.author.id) || 0}
                  onOpen={() => openPost(post.id)}
                  onLike={() => toggleLike(post)}
                  onTagClick={pickTag}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Nút đăng nổi trên mobile */}
      <button
        onClick={() => setComposer({})}
        className="lg:hidden fixed right-5 bottom-24 z-40 w-14 h-14 rounded-full bg-heritage-red text-heritage-gold-light shadow-red-glow flex items-center justify-center border-2 border-heritage-gold"
        aria-label="Đăng bài"
      >
        <PenSquare className="w-6 h-6" />
      </button>

      {openPostData && (
        <PostDetail
          post={openPostData}
          liked={liked.has(openPostData.id)}
          authorLikes={likesByAuthor.get(openPostData.author.id) || 0}
          onClose={() => openPost(null)}
          onLike={() => toggleLike(openPostData)}
          onDeleted={() => {
            openPost(null);
            load();
          }}
          onCommentCount={updateCommentCount}
          onTagClick={pickTag}
          onRemix={onRemixLook}
        />
      )}

      {composer && (
        <CreatePostModal
          draft={composer}
          onClose={() => setComposer(null)}
          onCreated={(post) => {
            setComposer(null);
            setAll((prev) => [post, ...prev]);
            setSort('new');
            setCategory('all');
            setTag('');
            openPost(post.id);
          }}
        />
      )}
    </div>
  );
};
