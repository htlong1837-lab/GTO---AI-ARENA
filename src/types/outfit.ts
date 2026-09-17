export type Region = 'Bắc Bộ' | 'Trung Bộ' | 'Nam Bộ' | 'Toàn quốc';

export interface Garment {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  era: string;
  region: Region;
  culturalNote: string;
  keyFeatures: string[];
  modernRemixTips: string[];
  silhouette: 'flowing' | 'layered' | 'structured' | 'regal' | 'casual';
  image: string;
  defaultColorId: string;
  historyDetails: {
    origin: string;
    significance: string;
    collarType: string;
    flapStructure: string;
  };
}

export interface Occasion {
  id: string;
  name: string;
  tag: string;
  icon: string;
  description: string;
  recommendedGarments: string[];
  recommendedStyles: string[];
}

export interface ColorOption {
  id: string;
  name: string;
  vietnameseName: string;
  hex: string;
  hsl: { h: number; s: number; l: number };
  secondaryHex: string;
  accentHex: string;
  mood: string;
  culturalMeaning: string;
  category: 'heritage' | 'royal' | 'pastel' | 'modern';
}

export interface Accessory {
  id: string;
  name: string;
  category: 'headwear' | 'footwear' | 'jewelry' | 'bags' | 'handheld' | 'modern';
  isTraditional: boolean;
  description: string;
  iconName: string;
  matchStyles: string[];
}

export interface StyleGenZ {
  id: string;
  name: string;
  tag: string;
  vibe: string;
  description: string;
  keyAesthetic: string;
  badgeColor: string;
}

export interface Outfit {
  id: string;
  name: string;
  garmentId: string;
  occasionId: string;
  colorId: string;
  accessoryIds: string[];
  styleId: string;
  notes?: string;
  createdAt: string;
  isFavorite?: boolean;
  likesCount?: number;
}

export interface ColorHarmonyReport {
  score: number; // 0 to 100
  rating: 'Tuyệt mỹ' | 'Hài hòa cao' | 'Cân bằng êm dịu' | 'Tương phản ấn tượng' | 'Cần tiết chế';
  primaryColorHex: string;
  secondaryColorHex: string;
  accentColorHex: string;
  paletteType: string;
  feedback: string;
  contrastScore: number;
}

export interface CulturalAdvice {
  status: 'respectful' | 'innovative' | 'caution';
  title: string;
  description: string;
  traditionalFeatures: string[];
  modernTwistNotes: string[];
}

export interface CuratedLook {
  id: string;
  name: string;
  tagline: string;
  garmentId: string;
  occasionId: string;
  colorId: string;
  accessoryIds: string[];
  styleId: string;
  region: Region;
  author: string;
  likes: number;
  imageUrl: string;
  culturalStory: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  title: string;
  bio: string;
  savedOutfits: Outfit[];
  customLookbooks: {
    id: string;
    title: string;
    description: string;
    outfitIds: string[];
  }[];
  history: Outfit[];
  compareList: Outfit[]; // max 3
}
