export interface TryOnModel {
  id: string;
  name: string;
  gender: 'female' | 'male';
  title: string;
  description: string;
  avatarUrl: string;
  fullBodyUrl: string;
  basePhotoUrl: string; // The baseline un-costumed model photo
  tag: string;
}

export interface ClothingItemOption {
  id: string;
  name: string;
  garmentType: 'ao-dai' | 'ao-ngu-than' | 'nhat-binh' | 'ao-tu-than' | 'ao-ba-ba';
  colorHex: string;
  colorName: string;
  thumbnailUrl: string;
  defaultModelLookUrl: Record<string, string>; // Maps modelId to result image of that exact model
  description: string;
  era: string;
}

// 2 MẪU ẢNH CHUẨN STUDIO: NỮ ♀ VÀ NAM ♂ (TRANG PHỤC NEUTRAL CHUẨN PHÒNG THỬ ĐỒ)
export const BASE_STUDIO_MODELS: TryOnModel[] = [
  {
    id: 'model-female-standard',
    name: 'Mẫu Nữ ♀ (Mai Anh)',
    gender: 'female',
    title: 'Người mẫu Nữ Studio',
    description: 'Vóc dáng thanh tân, nét mặt Á Đông trang nhã, chiều cao 1m68 chuẩn form thử đồ.',
    avatarUrl: '/images/models/studio_model_female.jpg',
    fullBodyUrl: '/images/models/studio_model_female.jpg',
    basePhotoUrl: '/images/models/studio_model_female.jpg',
    tag: 'Dáng chuẩn Nữ • 1m68'
  },
  {
    id: 'model-male-standard',
    name: 'Mẫu Nam ♂ (Hoàng Long)',
    gender: 'male',
    title: 'Người mẫu Nam Studio',
    description: 'Vóc dáng đĩnh đạc, gương mặt góc cạnh nam tính, chiều cao 1m78 chuẩn form thử đồ.',
    avatarUrl: '/images/models/studio_model_male.jpg',
    fullBodyUrl: '/images/models/studio_model_male.jpg',
    basePhotoUrl: '/images/models/studio_model_male.jpg',
    tag: 'Dáng chuẩn Nam • 1m78'
  }
];

export const STUDIO_MODELS = BASE_STUDIO_MODELS;

export const PRESET_CLOTHING_ITEMS: ClothingItemOption[] = [
  {
    id: 'clothes-ao-dai',
    name: 'Áo Dài Truyền Thống Tân Thời',
    garmentType: 'ao-dai',
    colorHex: '#9B1D20',
    colorName: 'Đỏ Son Cung Đình',
    thumbnailUrl: '/images/viet_phuc/ao_dai.jpg',
    defaultModelLookUrl: {
      'model-female-standard': '/images/looks/look_aodai_duxuan.jpg',
      'model-male-standard': '/images/hero_vietphuc.jpg'
    },
    description: 'Hai tà áo lụa buông dài thướt tha xẻ eo cao, mặc kèm quần lụa suông thanh lịch.',
    era: 'Thế kỷ 20 - Nay'
  },
  {
    id: 'clothes-ao-ngu-than',
    name: 'Áo Ngũ Thân Lập Lĩnh',
    garmentType: 'ao-ngu-than',
    colorHex: '#C59338',
    colorName: 'Vàng Hoàng Cúc',
    thumbnailUrl: '/images/viet_phuc/ao_ngu_than.jpg',
    defaultModelLookUrl: {
      'model-female-standard': '/images/looks/look_nguthan_trachieu.jpg',
      'model-male-standard': '/images/looks/look_nguthan_trachieu.jpg'
    },
    description: 'Năm thân áo tượng trưng ngũ thường và tứ thân phụ mẫu, cổ đứng lập lĩnh 5 khuy cài nghiêm trang.',
    era: 'Thời Chúa Nguyễn & Triều Nguyễn'
  },
  {
    id: 'clothes-nhat-binh',
    name: 'Áo Nhật Bình Cung Đình Huế',
    garmentType: 'nhat-binh',
    colorHex: '#582C4D',
    colorName: 'Tím Hoa Cà Cố Đô',
    thumbnailUrl: '/images/viet_phuc/ao_nhat_binh.jpg',
    defaultModelLookUrl: {
      'model-female-standard': '/images/looks/look_nhatbinh_hoangtrieu.jpg',
      'model-male-standard': '/images/looks/look_nhatbinh_hoangtrieu.jpg'
    },
    description: 'Cổ áo hình chữ nhật viền ngũ sắc đối khâm thêu hoa văn ngũ hành tương sinh quyền quý hoàng gia.',
    era: 'Triều Nguyễn (1802 - 1945)'
  },
  {
    id: 'clothes-ao-tu-than',
    name: 'Áo Tứ Thân Kinh Bắc & Yếm Đào',
    garmentType: 'ao-tu-than',
    colorHex: '#182747',
    colorName: 'Xanh Chàm Bắc Bộ',
    thumbnailUrl: '/images/viet_phuc/ao_tu_than.jpg',
    defaultModelLookUrl: {
      'model-female-standard': '/images/looks/look_aodai_duxuan.jpg',
      'model-male-standard': '/images/looks/look_nguthan_trachieu.jpg'
    },
    description: 'Bốn vạt áo thắt nơ trước bụng, bên trong mặc yếm đào duyên dáng mộc mạc Kinh Bắc.',
    era: 'Thế kỷ 12 - 20'
  },
  {
    id: 'clothes-ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ Phóng Khoáng',
    garmentType: 'ao-ba-ba',
    colorHex: '#1A1C20',
    colorName: 'Đen Tuyền Mực Tàu',
    thumbnailUrl: '/images/viet_phuc/ao_ba_ba.jpg',
    defaultModelLookUrl: {
      'model-female-standard': '/images/hero_model_modern.jpg',
      'model-male-standard': '/images/hero_vietphuc.jpg'
    },
    description: 'Cổ tròn xẻ ngực, hàng khuy ngọc trai, xẻ tà hông mang đậm vẻ đẹp hồn hậu phóng khoáng phương Nam.',
    era: 'Thế kỷ 19 - Nay'
  }
];

export interface TryOnResultRecord {
  id: string;
  timestamp: string;
  imageUrl: string;
  baseModelImageUrl: string;
  modelName: string;
  modelGender: 'female' | 'male';
  clothesName: string;
  harmonyScore: number;
  heritageRating: string;
  accessoryNames: string[];
}
