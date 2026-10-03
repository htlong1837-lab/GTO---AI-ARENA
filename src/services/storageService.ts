import { Outfit, UserProfile } from '../types/outfit';

const STORAGE_KEYS = {
  PROFILE: 'vietphuc_remix_profile',
  SAVED_OUTFITS: 'vietphuc_remix_saved_outfits',
  COMPARE_LIST: 'vietphuc_remix_compare_list',
  HISTORY: 'vietphuc_remix_history',
  GUEST_NUMBER: 'vietphuc_remix_guest_number',
  GUEST_COUNTER: 'vietphuc_remix_guest_counter'
};

// Avatar pool cho khách — chọn theo số thứ tự
const GUEST_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
];

/**
 * Lấy số thứ tự khách cho thiết bị/trình duyệt hiện tại.
 * Mỗi lần trình duyệt mới truy cập lần đầu → counter +1 và gán cho khách đó.
 * Khách quay lại (đã có localStorage) → giữ nguyên số cũ.
 */
const getGuestNumber = (): number => {
  // Đã có số thứ tự → trả về luôn
  const existing = localStorage.getItem(STORAGE_KEYS.GUEST_NUMBER);
  if (existing) return parseInt(existing, 10);

  // Lấy counter hiện tại, +1
  const currentCounter = parseInt(localStorage.getItem(STORAGE_KEYS.GUEST_COUNTER) || '0', 10);
  const newNumber = currentCounter + 1;

  // Lưu counter mới và gán số cho khách này
  localStorage.setItem(STORAGE_KEYS.GUEST_COUNTER, String(newNumber));
  localStorage.setItem(STORAGE_KEYS.GUEST_NUMBER, String(newNumber));

  return newNumber;
};

const buildDefaultProfile = (): UserProfile => {
  const guestNum = getGuestNumber();
  return {
    name: `Khách ${guestNum}`,
    avatar: GUEST_AVATARS[(guestNum - 1) % GUEST_AVATARS.length],
    title: 'Nhà Sáng Tạo Cổ Phong Gen Z',
    bio: 'Yêu di sản Việt qua lăng kính thời trang đương đại. Tự hào lan tỏa tà áo Việt đến bạn bè khắp thế giới.',
    savedOutfits: [],
    customLookbooks: [
      {
        id: 'lookbook-tet',
        title: 'Tết Bính Ngọ 2026',
        description: 'Các bản phối du xuân năng động cùng bạn bè',
        outfitIds: []
      }
    ],
    history: [],
    compareList: []
  };
};

const INITIAL_SAVED_OUTFITS: Outfit[] = [
  {
    id: 'saved-1',
    name: 'Áo Dài Đỏ Son × Sneaker Trắng Chunky',
    garmentId: 'ao-dai',
    occasionId: 'tet',
    colorId: 'do-son',
    accessoryIds: ['sneaker-chunky', 'kieng-bac', 'tote-typography'],
    styleId: 'modern-genz',
    createdAt: new Date().toISOString(),
    isFavorite: true,
    likesCount: 142
  },
  {
    id: 'saved-2',
    name: 'Ngũ Thân Tay Chẽn Vàng × Boots Da Đen',
    garmentId: 'ao-ngu-than',
    occasionId: 'tot-nghiep',
    colorId: 'vang-hoang-cuc',
    accessoryIds: ['khan-dong', 'boots-da', 'kieng-bac'],
    styleId: 'elegant',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isFavorite: true,
    likesCount: 98
  }
];

export const StorageService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const defaults = buildDefaultProfile();
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...defaults,
          ...parsed,
          savedOutfits: Array.isArray(parsed.savedOutfits) ? parsed.savedOutfits : INITIAL_SAVED_OUTFITS,
          history: Array.isArray(parsed.history) ? parsed.history : [],
          compareList: Array.isArray(parsed.compareList) ? parsed.compareList : [],
          customLookbooks: Array.isArray(parsed.customLookbooks) ? parsed.customLookbooks : defaults.customLookbooks
        };
      }
      // Initialize with default and initial saved outfits
      const initialProfile = {
        ...defaults,
        savedOutfits: INITIAL_SAVED_OUTFITS,
        compareList: [INITIAL_SAVED_OUTFITS[0], INITIAL_SAVED_OUTFITS[1]]
      };
      this.saveProfile(initialProfile);
      return initialProfile;
    } catch {
      const defaults = buildDefaultProfile();
      return {
        ...defaults,
        savedOutfits: INITIAL_SAVED_OUTFITS,
        compareList: [INITIAL_SAVED_OUTFITS[0], INITIAL_SAVED_OUTFITS[1]]
      };
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  },

  getSavedOutfits(): Outfit[] {
    const profile = this.getProfile();
    return profile.savedOutfits || [];
  },

  saveOutfit(outfit: Outfit): Outfit[] {
    const profile = this.getProfile();
    const existingIndex = profile.savedOutfits.findIndex((o) => o.id === outfit.id);

    let updatedOutfits: Outfit[];
    if (existingIndex >= 0) {
      updatedOutfits = [...profile.savedOutfits];
      updatedOutfits[existingIndex] = outfit;
    } else {
      updatedOutfits = [outfit, ...profile.savedOutfits];
    }

    // Add to history if not there
    const updatedHistory = [outfit, ...profile.history.filter((h) => h.id !== outfit.id)].slice(0, 20);

    const updatedProfile: UserProfile = {
      ...profile,
      savedOutfits: updatedOutfits,
      history: updatedHistory
    };

    this.saveProfile(updatedProfile);
    return updatedOutfits;
  },

  deleteOutfit(outfitId: string): Outfit[] {
    const profile = this.getProfile();
    const updatedOutfits = profile.savedOutfits.filter((o) => o.id !== outfitId);
    const updatedCompare = profile.compareList.filter((o) => o.id !== outfitId);

    const updatedProfile: UserProfile = {
      ...profile,
      savedOutfits: updatedOutfits,
      compareList: updatedCompare
    };

    this.saveProfile(updatedProfile);
    return updatedOutfits;
  },

  getCompareList(): Outfit[] {
    const profile = this.getProfile();
    return profile.compareList || [];
  },

  addToCompare(outfit: Outfit): { success: boolean; list: Outfit[]; message: string } {
    const profile = this.getProfile();
    const list = profile.compareList || [];

    if (list.some((o) => o.id === outfit.id)) {
      return { success: false, list, message: 'Look này đã có trong danh sách so sánh' };
    }

    if (list.length >= 3) {
      return { success: false, list, message: 'Bạn chỉ có thể so sánh tối đa 3 look cùng lúc' };
    }

    const updatedList = [...list, outfit];
    this.saveProfile({ ...profile, compareList: updatedList });
    return { success: true, list: updatedList, message: 'Đã thêm vào bảng so sánh look!' };
  },

  removeFromCompare(outfitId: string): Outfit[] {
    const profile = this.getProfile();
    const updatedList = (profile.compareList || []).filter((o) => o.id !== outfitId);
    this.saveProfile({ ...profile, compareList: updatedList });
    return updatedList;
  },

  clearCompare(): void {
    const profile = this.getProfile();
    this.saveProfile({ ...profile, compareList: [] });
  },

  exportData(): string {
    const profile = this.getProfile();
    return JSON.stringify(profile, null, 2);
  },

  importData(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.name || !Array.isArray(data.savedOutfits)) {
        return { success: false, error: 'Định dạng dữ liệu JSON không đúng cấu trúc hồ sơ Việt Phục Remix.' };
      }
      this.saveProfile(data);
      return { success: true };
    } catch {
      return { success: false, error: 'Tệp JSON bị lỗi cú pháp, vui lòng kiểm tra lại.' };
    }
  },

  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }
};
