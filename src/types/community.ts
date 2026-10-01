export type PostCategory = 'showcase' | 'qa' | 'culture' | 'events';

export interface CommunityAuthor {
  id: string;
  name: string;
  avatar: string;
}

// Snapshot bản phối đính kèm bài viết — đủ để người khác bấm "Thử bản phối này"
export interface SharedLook {
  garmentId: string;
  colorId: string;
  accessoryIds: string[];
  styleId?: string;
  occasionId?: string;
  gender?: 'female' | 'male';
}

export interface CommunityPost {
  id: string;
  author: CommunityAuthor;
  category: PostCategory;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  look?: SharedLook;
  likesCount: number;
  commentsCount: number;
  reportsCount: number;
  createdAt: string;
  isSeed?: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  parentId: string | null;
  author: CommunityAuthor;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface NewPostInput {
  category: PostCategory;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  look?: SharedLook;
}

export interface CreatorStats {
  author: CommunityAuthor;
  posts: number;
  likes: number;
}

export type FeedSort = 'new' | 'hot' | 'top';
