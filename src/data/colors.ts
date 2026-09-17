import { ColorOption } from '../types/outfit';

export const COLORS: ColorOption[] = [
  {
    id: 'do-son',
    name: 'Đỏ Son (Chu Sa)',
    vietnameseName: 'Đỏ Son Cung Đình',
    hex: '#9B1D20',
    hsl: { h: 358, s: 68, l: 36 },
    secondaryHex: '#E8C57A',
    accentHex: '#182747',
    mood: 'Quyền quý, may mắn, rạng rỡ và nhiệt huyết thanh xuân',
    culturalMeaning: 'Màu của hỷ sự, may mắn cát tường và quyền uy quý phái của cung đình Việt Nam.',
    category: 'royal'
  },
  {
    id: 'vang-hoang-cuc',
    name: 'Vàng Hoàng Cúc',
    vietnameseName: 'Vàng Hoàng Cúc Triều Nguyễn',
    hex: '#C59338',
    hsl: { h: 39, s: 57, l: 50 },
    secondaryHex: '#9B1D20',
    accentHex: '#1D6246',
    mood: 'Ấm áp, đài các, phú quý và tươi sáng như ánh nắng phương Nam',
    culturalMeaning: 'Màu của đất mẹ phì nhiêu, sự vương giả và trí tuệ thâm trầm theo quan niệm ngũ hành Thổ.',
    category: 'royal'
  },
  {
    id: 'xanh-cham',
    name: 'Xanh Chàm Cổ',
    vietnameseName: 'Xanh Chàm Nhuộm Lá Tự Nhiên',
    hex: '#182747',
    hsl: { h: 221, s: 49, l: 19 },
    secondaryHex: '#DFB058',
    accentHex: '#CA4F76',
    mood: 'Thâm trầm, bí ẩn, tri thức và chiều sâu nội tâm',
    culturalMeaning: 'Màu nhuộm truyền thống từ cây chàm, gắn với đời sống lao động cần cù và nét mộc mạc bền bỉ.',
    category: 'heritage'
  },
  {
    id: 'trang-lua-nga',
    name: 'Trắng Lụa Ngà',
    vietnameseName: 'Bạch Ngọc Tơ Tằm',
    hex: '#F4EFE6',
    hsl: { h: 38, s: 33, l: 93 },
    secondaryHex: '#9B1D20',
    accentHex: '#182747',
    mood: 'Thanh khiết, tối giản, tao nhã và thanh tân học đường',
    culturalMeaning: 'Tượng trưng cho sự tinh khôi, trong sáng của tà áo dài nữ sinh Việt Nam qua bao thế hệ.',
    category: 'heritage'
  },
  {
    id: 'den-tuyen',
    name: 'Đen Mực Tàu',
    vietnameseName: 'Hắc Tuyền Trầm Mặc',
    hex: '#1A1C20',
    hsl: { h: 220, s: 10, l: 11 },
    secondaryHex: '#C59338',
    accentHex: '#FF4757',
    mood: 'Bí ẩn, uy nghiêm, cá tính và sắc sảo chuẩn thời trang cao cấp',
    culturalMeaning: 'Màu của mực tàu trên giấy điệp, tượng trưng cho nét bút Nho sinh đĩnh đạc và phong thái đĩnh đạc.',
    category: 'modern'
  },
  {
    id: 'hong-canh-sen',
    name: 'Hồng Cánh Sen',
    vietnameseName: 'Hồng Quốc Hoa Liên Hoa',
    hex: '#CA4F76',
    hsl: { h: 341, s: 52, l: 55 },
    secondaryHex: '#1D6246',
    accentHex: '#F4EFE6',
    mood: 'Ngọt ngào, duyên dáng, lãng mạn và yểu điệu',
    culturalMeaning: 'Sắc hồng của hoa sen - quốc hoa biểu trưng cho vẻ đẹp thuần khiết "gần bùn mà chẳng hôi tanh mùi bùn".',
    category: 'pastel'
  },
  {
    id: 'tim-hue',
    name: 'Tím Cố Đô',
    vietnameseName: 'Tím Hoa Cà Sông Hương',
    hex: '#6B3074',
    hsl: { h: 292, s: 42, l: 32 },
    secondaryHex: '#C59338',
    accentHex: '#F4EFE6',
    mood: 'Mơ màng, e ấp, thủy chung và hoài niệm cổ kính',
    culturalMeaning: 'Màu sắc đặc trưng của xứ Huế mộng mơ, gắn liền với hình bóng thiếu nữ bên dòng Hương giang.',
    category: 'heritage'
  },
  {
    id: 'xanh-ngoc-luc',
    name: 'Xanh Ngọc Bích',
    vietnameseName: 'Ngọc Lục Bảo Trân Quý',
    hex: '#1D6246',
    hsl: { h: 156, s: 54, l: 25 },
    secondaryHex: '#DFB058',
    accentHex: '#CA4F76',
    mood: 'Tươi mới, mát mẻ, tái sinh và sang trọng quý tộc',
    culturalMeaning: 'Màu của đá ngọc bích, biểu tượng cho tính khiêm hòa, cốt cách quân tử và vẻ đẹp trường tồn.',
    category: 'royal'
  },
  {
    id: 'pastel-thanh-thien',
    name: 'Pastel Thanh Thiên',
    vietnameseName: 'Xanh Khói Trời Mây',
    hex: '#A5C9CA',
    hsl: { h: 182, s: 28, l: 72 },
    secondaryHex: '#182747',
    accentHex: '#CA4F76',
    mood: 'Dịu dàng, hiện đại, bay bổng và đậm chất Gen Z aesthetic',
    culturalMeaning: 'Biến thể cách tân hiện đại lấy cảm hứng từ mây trời cao nguyên và men gốm hoa lam thời Lý - Trần.',
    category: 'pastel'
  }
];
