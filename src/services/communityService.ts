import {
  CommunityAuthor,
  CommunityComment,
  CommunityPost,
  CreatorStats,
  FeedSort,
  NewPostInput,
  PostCategory
} from '../types/community';
import { SEED_COMMENTS, SEED_POSTS } from '../data/community';
import { StorageService } from './storageService';

// -------------------------------------------------------------
// Diễn đàn cộng đồng.
// - Mặc định chạy "local": lưu trong localStorage (demo, chỉ mình bạn thấy).
// - Khi có VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY: chạy "cloud" qua Supabase REST,
//   mọi người dùng thấy bài và bình luận của nhau. Schema: supabase/schema.sql
// Bài/bình luận seed (id bắt đầu bằng "seed-") luôn xử lý ở local.
// -------------------------------------------------------------

const KEYS = {
  ME: 'vietphuc_community_me',
  POSTS: 'vietphuc_community_posts',
  COMMENTS: 'vietphuc_community_comments',
  LIKED_POSTS: 'vietphuc_community_liked_posts',
  LIKED_COMMENTS: 'vietphuc_community_liked_comments',
  REPORTED: 'vietphuc_community_reported',
  SEED_DELTA: 'vietphuc_community_seed_delta'
};

export const HIDE_REPORT_THRESHOLD = 3;
const MAX_IMAGE_EDGE = 1080;

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'community';

export const COMMUNITY_MODE: 'cloud' | 'local' = SUPABASE_URL && SUPABASE_KEY ? 'cloud' : 'local';

// ---------- helpers ----------
const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    throw new Error(
      e instanceof DOMException && e.name === 'QuotaExceededError'
        ? 'Bộ nhớ trình duyệt đã đầy. Hãy xóa bớt bài viết có ảnh lớn.'
        : 'Không thể lưu dữ liệu vào trình duyệt.'
    );
  }
};

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const isSeed = (id: string) => id.startsWith('seed-');

export const normalizeTag = (raw: string) =>
  raw
    .trim()
    .replace(/^#+/, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 32);

export const extractHashtags = (text: string) =>
  Array.from(new Set((text.match(/#[\p{L}\p{N}_]+/gu) || []).map(normalizeTag).filter(Boolean)));

// Từ ngữ vi phạm cơ bản — chặn trước khi đăng, phần còn lại do cộng đồng báo cáo
const BLOCKED_WORDS = ['đồ nhái giá rẻ', 'lừa đảo', 'cá độ', 'vay tiền nhanh'];
export const moderateText = (text: string): string | null => {
  const lower = text.toLowerCase();
  const hit = BLOCKED_WORDS.find((w) => lower.includes(w));
  if (hit) return `Nội dung chứa cụm từ không phù hợp ("${hit}").`;
  if ((text.match(/https?:\/\//g) || []).length > 3) return 'Bài viết chứa quá nhiều liên kết, có dấu hiệu spam.';
  return null;
};

// Thu nhỏ ảnh về JPEG ≤ 1080px để tiết kiệm dung lượng. Ảnh khác domain không vẽ được thì giữ nguyên URL.
export async function compressImage(src: string): Promise<string> {
  if (src.startsWith('data:image/svg')) return src;
  if (!src.startsWith('data:') && !src.startsWith('blob:')) return src;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(src);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

// ---------- danh tính ẩn danh trên thiết bị ----------
interface MeRecord {
  id: string;
  token: string; // bí mật để xóa bài/bình luận của chính mình trên cloud
}

const getMeRecord = (): MeRecord => {
  const existing = readJson<MeRecord | null>(KEYS.ME, null);
  if (existing?.id && existing?.token) return existing;
  const fresh = { id: `u-${uid()}`, token: uid() + uid() };
  writeJson(KEYS.ME, fresh);
  return fresh;
};

export const getMe = (): CommunityAuthor => {
  const profile = StorageService.getProfile();
  return { id: getMeRecord().id, name: profile.name, avatar: profile.avatar };
};

// ---------- trạng thái tương tác cá nhân (dùng cho cả hai chế độ) ----------
const getSet = (key: string) => new Set(readJson<string[]>(key, []));
const saveSet = (key: string, set: Set<string>) => writeJson(key, Array.from(set));

export const getLikedPostIds = () => getSet(KEYS.LIKED_POSTS);
export const getLikedCommentIds = () => getSet(KEYS.LIKED_COMMENTS);
export const getReportedPostIds = () => getSet(KEYS.REPORTED);

// =============================================================
// LOCAL STORE
// =============================================================
interface SeedDelta {
  likes: Record<string, number>;
  reports: Record<string, number>;
}

const Local = {
  posts(): CommunityPost[] {
    const own = readJson<CommunityPost[]>(KEYS.POSTS, []);
    const delta = readJson<SeedDelta>(KEYS.SEED_DELTA, { likes: {}, reports: {} });
    const comments = this.allComments();
    const seeds = SEED_POSTS.map((p) => ({
      ...p,
      likesCount: p.likesCount + (delta.likes[p.id] || 0),
      reportsCount: p.reportsCount + (delta.reports[p.id] || 0),
      commentsCount: comments.filter((c) => c.postId === p.id).length
    }));
    return [...own, ...seeds];
  },

  allComments(): CommunityComment[] {
    const own = readJson<CommunityComment[]>(KEYS.COMMENTS, []);
    const delta = readJson<SeedDelta>(KEYS.SEED_DELTA, { likes: {}, reports: {} });
    const seeds = SEED_COMMENTS.map((c) => ({ ...c, likesCount: c.likesCount + (delta.likes[c.id] || 0) }));
    return [...seeds, ...own];
  },

  updateOwnPost(id: string, fn: (p: CommunityPost) => CommunityPost | null) {
    const own = readJson<CommunityPost[]>(KEYS.POSTS, []);
    const next = own.map((p) => (p.id === id ? fn(p) : p)).filter(Boolean) as CommunityPost[];
    writeJson(KEYS.POSTS, next);
  },

  bumpSeed(kind: keyof SeedDelta, id: string, by: number) {
    const delta = readJson<SeedDelta>(KEYS.SEED_DELTA, { likes: {}, reports: {} });
    delta[kind][id] = (delta[kind][id] || 0) + by;
    writeJson(KEYS.SEED_DELTA, delta);
  },

  createPost(input: NewPostInput, author: CommunityAuthor): CommunityPost {
    const post: CommunityPost = {
      id: `local-${uid()}`,
      author,
      ...input,
      likesCount: 0,
      commentsCount: 0,
      reportsCount: 0,
      createdAt: new Date().toISOString()
    };
    writeJson(KEYS.POSTS, [post, ...readJson<CommunityPost[]>(KEYS.POSTS, [])]);
    return post;
  },

  likePost(id: string, by: number) {
    if (isSeed(id)) this.bumpSeed('likes', id, by);
    else this.updateOwnPost(id, (p) => ({ ...p, likesCount: Math.max(0, p.likesCount + by) }));
  },

  reportPost(id: string) {
    if (isSeed(id)) this.bumpSeed('reports', id, 1);
    else this.updateOwnPost(id, (p) => ({ ...p, reportsCount: p.reportsCount + 1 }));
  },

  addComment(postId: string, content: string, parentId: string | null, author: CommunityAuthor): CommunityComment {
    const comment: CommunityComment = {
      id: `local-c-${uid()}`,
      postId,
      parentId,
      author,
      content,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };
    writeJson(KEYS.COMMENTS, [...readJson<CommunityComment[]>(KEYS.COMMENTS, []), comment]);
    if (!isSeed(postId)) this.updateOwnPost(postId, (p) => ({ ...p, commentsCount: p.commentsCount + 1 }));
    return comment;
  },

  likeComment(id: string, by: number) {
    if (isSeed(id)) return this.bumpSeed('likes', id, by);
    const own = readJson<CommunityComment[]>(KEYS.COMMENTS, []);
    writeJson(KEYS.COMMENTS, own.map((c) => (c.id === id ? { ...c, likesCount: Math.max(0, c.likesCount + by) } : c)));
  },

  deleteComment(id: string) {
    const own = readJson<CommunityComment[]>(KEYS.COMMENTS, []);
    const target = own.find((c) => c.id === id);
    if (!target) return;
    // Xóa cả các trả lời con
    const removed = new Set([id, ...own.filter((c) => c.parentId === id).map((c) => c.id)]);
    writeJson(KEYS.COMMENTS, own.filter((c) => !removed.has(c.id)));
    if (!isSeed(target.postId)) {
      this.updateOwnPost(target.postId, (p) => ({ ...p, commentsCount: Math.max(0, p.commentsCount - removed.size) }));
    }
  },

  deletePost(id: string) {
    this.updateOwnPost(id, () => null);
    writeJson(KEYS.COMMENTS, readJson<CommunityComment[]>(KEYS.COMMENTS, []).filter((c) => c.postId !== id));
  }
};

// =============================================================
// CLOUD STORE (Supabase PostgREST + Storage, không cần SDK)
// =============================================================
interface PostRow {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  category: PostCategory;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  look: CommunityPost['look'] | null;
  likes_count: number;
  comments_count: number;
  reports_count: number;
  created_at: string;
}

interface CommentRow {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  likes_count: number;
  created_at: string;
}

const POST_COLUMNS = 'id,author_id,author_name,author_avatar,category,title,content,images,tags,look,likes_count,comments_count,reports_count,created_at';
const COMMENT_COLUMNS = 'id,post_id,parent_id,author_id,author_name,author_avatar,content,likes_count,created_at';

const rowToPost = (r: PostRow): CommunityPost => ({
  id: r.id,
  author: { id: r.author_id, name: r.author_name, avatar: r.author_avatar },
  category: r.category,
  title: r.title,
  content: r.content,
  images: r.images || [],
  tags: r.tags || [],
  look: r.look || undefined,
  likesCount: r.likes_count,
  commentsCount: r.comments_count,
  reportsCount: r.reports_count,
  createdAt: r.created_at
});

const rowToComment = (r: CommentRow): CommunityComment => ({
  id: r.id,
  postId: r.post_id,
  parentId: r.parent_id,
  author: { id: r.author_id, name: r.author_name, avatar: r.author_avatar },
  content: r.content,
  likesCount: r.likes_count,
  createdAt: r.created_at
});

async function rest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Máy chủ cộng đồng lỗi ${res.status}${text ? `: ${text.slice(0, 160)}` : ''}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

const rpc = <T,>(fn: string, args: Record<string, unknown>) =>
  rest<T>(`rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) });

async function uploadImage(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith('data:image/') || dataUrl.startsWith('data:image/svg')) return dataUrl;
  const blob = await (await fetch(dataUrl)).blob();
  const ext = blob.type.split('/')[1] || 'jpg';
  const path = `posts/${new Date().toISOString().slice(0, 10)}/${uid()}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': blob.type },
    body: blob
  });
  if (!res.ok) throw new Error('Không tải được ảnh lên kho lưu trữ cộng đồng.');
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

const Cloud = {
  async posts(): Promise<CommunityPost[]> {
    const rows = await rest<PostRow[]>(`posts?select=${POST_COLUMNS}&order=created_at.desc&limit=200`);
    return rows.map(rowToPost);
  },

  async post(id: string): Promise<CommunityPost | null> {
    const rows = await rest<PostRow[]>(`posts?select=${POST_COLUMNS}&id=eq.${encodeURIComponent(id)}`);
    return rows[0] ? rowToPost(rows[0]) : null;
  },

  async createPost(input: NewPostInput, author: CommunityAuthor): Promise<CommunityPost> {
    const images = await Promise.all(input.images.map(uploadImage));
    const rows = await rest<PostRow[]>(`posts?select=${POST_COLUMNS}`, {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        author_id: author.id,
        author_name: author.name,
        author_avatar: author.avatar,
        author_token: getMeRecord().token,
        category: input.category,
        title: input.title,
        content: input.content,
        images,
        tags: input.tags,
        look: input.look || null
      })
    });
    return rowToPost(rows[0]);
  },

  async likePost(id: string, like: boolean) {
    const userId = getMeRecord().id;
    if (like) {
      await rest('post_likes', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates' },
        body: JSON.stringify({ post_id: id, user_id: userId })
      });
    } else {
      await rest(`post_likes?post_id=eq.${id}&user_id=eq.${encodeURIComponent(userId)}`, { method: 'DELETE' });
    }
  },

  async reportPost(id: string, reason: string) {
    await rest('post_reports', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates' },
      body: JSON.stringify({ post_id: id, user_id: getMeRecord().id, reason })
    });
  },

  async comments(postId: string): Promise<CommunityComment[]> {
    const rows = await rest<CommentRow[]>(
      `comments?select=${COMMENT_COLUMNS}&post_id=eq.${encodeURIComponent(postId)}&order=created_at.asc&limit=500`
    );
    return rows.map(rowToComment);
  },

  async addComment(postId: string, content: string, parentId: string | null, author: CommunityAuthor) {
    const rows = await rest<CommentRow[]>(`comments?select=${COMMENT_COLUMNS}`, {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        post_id: postId,
        parent_id: parentId,
        author_id: author.id,
        author_name: author.name,
        author_avatar: author.avatar,
        author_token: getMeRecord().token,
        content
      })
    });
    return rowToComment(rows[0]);
  },

  async likeComment(id: string, like: boolean) {
    const userId = getMeRecord().id;
    if (like) {
      await rest('comment_likes', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates' },
        body: JSON.stringify({ comment_id: id, user_id: userId })
      });
    } else {
      await rest(`comment_likes?comment_id=eq.${id}&user_id=eq.${encodeURIComponent(userId)}`, { method: 'DELETE' });
    }
  },

  deletePost: (id: string) => rpc('delete_own_post', { p_id: id, p_token: getMeRecord().token }),
  deleteComment: (id: string) => rpc('delete_own_comment', { p_id: id, p_token: getMeRecord().token })
};

// =============================================================
// FACADE
// =============================================================
const hotScore = (p: CommunityPost) => {
  const hours = (Date.now() - new Date(p.createdAt).getTime()) / 3600_000;
  return (p.likesCount + 2 * p.commentsCount + 1) / Math.pow(hours + 2, 1.4);
};

const isVisible = (p: CommunityPost) => p.reportsCount < HIDE_REPORT_THRESHOLD || p.author.id === getMeRecord().id;

export interface FeedQuery {
  category?: PostCategory | 'all';
  tag?: string;
  search?: string;
  sort?: FeedSort;
  authorId?: string;
}

export const CommunityService = {
  mode: COMMUNITY_MODE,

  async listAll(): Promise<CommunityPost[]> {
    if (COMMUNITY_MODE === 'local') return Local.posts().filter(isVisible);
    // Cloud lỗi mạng vẫn hiển thị bài seed để diễn đàn không trống
    const cloud = await Cloud.posts().catch((e) => {
      console.warn('[community] cloud unavailable', e);
      return [] as CommunityPost[];
    });
    const seeds = Local.posts().filter((p) => isSeed(p.id));
    return [...cloud, ...seeds].filter(isVisible);
  },

  async listPosts(query: FeedQuery = {}): Promise<CommunityPost[]> {
    return this.filterPosts(await this.listAll(), query);
  },

  filterPosts(all: CommunityPost[], query: FeedQuery = {}): CommunityPost[] {
    const q = (query.search || '').trim().toLowerCase();
    const tag = query.tag ? normalizeTag(query.tag).toLowerCase() : '';
    const filtered = all.filter(
      (p) =>
        (!query.category || query.category === 'all' || p.category === query.category) &&
        (!tag || p.tags.some((t) => t.toLowerCase() === tag)) &&
        (!query.authorId || p.author.id === query.authorId) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)))
    );
    const sort = query.sort || 'hot';
    return filtered.sort((a, b) =>
      sort === 'new'
        ? b.createdAt.localeCompare(a.createdAt)
        : sort === 'top'
        ? b.likesCount - a.likesCount
        : hotScore(b) - hotScore(a)
    );
  },

  async getPost(id: string): Promise<CommunityPost | null> {
    if (COMMUNITY_MODE === 'local' || isSeed(id)) return Local.posts().find((p) => p.id === id) || null;
    return Cloud.post(id);
  },

  async createPost(input: NewPostInput): Promise<CommunityPost> {
    const problem = moderateText(`${input.title}\n${input.content}`);
    if (problem) throw new Error(problem);
    if (!input.title.trim()) throw new Error('Bài viết cần có tiêu đề.');
    const images = await Promise.all(input.images.slice(0, 6).map(compressImage));
    const tags = Array.from(new Set([...input.tags, ...extractHashtags(input.content)].map(normalizeTag).filter(Boolean))).slice(0, 10);
    const clean = { ...input, title: input.title.trim().slice(0, 140), content: input.content.trim().slice(0, 5000), images, tags };
    return COMMUNITY_MODE === 'cloud' ? Cloud.createPost(clean, getMe()) : Local.createPost(clean, getMe());
  },

  async deletePost(id: string) {
    if (COMMUNITY_MODE === 'cloud' && !isSeed(id)) await Cloud.deletePost(id);
    else Local.deletePost(id);
  },

  async toggleLikePost(id: string): Promise<boolean> {
    const liked = getLikedPostIds();
    const willLike = !liked.has(id);
    if (COMMUNITY_MODE === 'cloud' && !isSeed(id)) await Cloud.likePost(id, willLike);
    else Local.likePost(id, willLike ? 1 : -1);
    if (willLike) liked.add(id);
    else liked.delete(id);
    saveSet(KEYS.LIKED_POSTS, liked);
    return willLike;
  },

  async reportPost(id: string, reason: string) {
    const reported = getReportedPostIds();
    if (reported.has(id)) throw new Error('Bạn đã báo cáo bài viết này rồi.');
    if (COMMUNITY_MODE === 'cloud' && !isSeed(id)) await Cloud.reportPost(id, reason);
    else Local.reportPost(id);
    reported.add(id);
    saveSet(KEYS.REPORTED, reported);
  },

  async listComments(postId: string): Promise<CommunityComment[]> {
    if (COMMUNITY_MODE === 'local' || isSeed(postId)) return Local.allComments().filter((c) => c.postId === postId);
    return Cloud.comments(postId);
  },

  async addComment(postId: string, content: string, parentId: string | null = null): Promise<CommunityComment> {
    const text = content.trim();
    if (!text) throw new Error('Bình luận đang trống.');
    if (text.length > 1500) throw new Error('Bình luận tối đa 1500 ký tự.');
    const problem = moderateText(text);
    if (problem) throw new Error(problem);
    if (COMMUNITY_MODE === 'cloud' && !isSeed(postId)) return Cloud.addComment(postId, text, parentId, getMe());
    return Local.addComment(postId, text, parentId, getMe());
  },

  async toggleLikeComment(comment: CommunityComment): Promise<boolean> {
    const liked = getLikedCommentIds();
    const willLike = !liked.has(comment.id);
    if (COMMUNITY_MODE === 'cloud' && !isSeed(comment.postId)) await Cloud.likeComment(comment.id, willLike);
    else Local.likeComment(comment.id, willLike ? 1 : -1);
    if (willLike) liked.add(comment.id);
    else liked.delete(comment.id);
    saveSet(KEYS.LIKED_COMMENTS, liked);
    return willLike;
  },

  async deleteComment(comment: CommunityComment) {
    if (COMMUNITY_MODE === 'cloud' && !isSeed(comment.postId)) await Cloud.deleteComment(comment.id);
    else Local.deleteComment(comment.id);
  },

  trendingTags(posts: CommunityPost[], limit = 8): { tag: string; count: number }[] {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1 + p.likesCount / 100)));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count: Math.round(count) }));
  },

  creators(posts: CommunityPost[]): CreatorStats[] {
    const map = new Map<string, CreatorStats>();
    posts.forEach((p) => {
      const s = map.get(p.author.id) || { author: p.author, posts: 0, likes: 0 };
      s.posts += 1;
      s.likes += p.likesCount;
      map.set(p.author.id, s);
    });
    return Array.from(map.values()).sort((a, b) => b.likes - a.likes);
  }
};

// Dựng cây bình luận: gốc theo thời gian, trả lời lồng 1 cấp dưới bình luận gốc
export function buildCommentTree(comments: CommunityComment[]) {
  const byId = new Map(comments.map((c) => [c.id, c]));
  const rootOf = (c: CommunityComment): string => {
    let cur = c;
    while (cur.parentId && byId.has(cur.parentId)) cur = byId.get(cur.parentId)!;
    return cur.id;
  };
  const roots = comments.filter((c) => !c.parentId || !byId.has(c.parentId));
  return roots.map((root) => ({
    comment: root,
    replies: comments.filter((c) => c.id !== root.id && c.parentId && rootOf(c) === root.id)
  }));
}

export const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
};
