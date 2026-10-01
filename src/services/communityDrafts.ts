import { NewPostInput, SharedLook } from '../types/community';
import { Outfit } from '../types/outfit';
import { GARMENTS } from '../data/garments';
import { COLORS } from '../data/colors';
import { PRESET_CLOTHING_ITEMS } from '../data/modelsTryOn';
import { normalizeTag } from './communityService';

export type PostDraft = Partial<NewPostInput>;

export const lookImage = (look: SharedLook, aiImage?: string) => {
  if (aiImage) return aiImage;
  const item = PRESET_CLOTHING_ITEMS.find((c) => c.garmentType === look.garmentId);
  return item?.colorVariants?.[look.colorId] || item?.thumbnailUrl || GARMENTS.find((g) => g.id === look.garmentId)?.image || '';
};

// Tag tự động từ bản phối, ví dụ #AoDai #DoSon
export const autoTagsForLook = (look: SharedLook) => {
  const g = GARMENTS.find((x) => x.id === look.garmentId);
  const c = COLORS.find((x) => x.id === look.colorId);
  return [g?.name, c?.vietnameseName.split(' ').slice(0, 2).join(' ')].filter(Boolean).map((s) => normalizeTag(s as string));
};

// Bản nháp bài viết từ một outfit (Studio / Tủ đồ) — ảnh AI, công thức và tag tự động
export const draftFromOutfit = (outfit: Outfit): PostDraft => {
  const look: SharedLook = {
    garmentId: outfit.garmentId,
    colorId: outfit.colorId,
    accessoryIds: outfit.accessoryIds,
    styleId: outfit.styleId,
    occasionId: outfit.occasionId,
    gender: outfit.gender
  };
  const img = lookImage(look, outfit.aiGeneratedImage);
  return {
    category: 'showcase',
    title: outfit.name,
    content: outfit.notes || '',
    images: img ? [img] : [],
    tags: autoTagsForLook(look),
    look
  };
};
