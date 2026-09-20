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
    category: 'royal',
    element: 'Hỏa',
    colorType: 'chinh_sac',
    elementMeaning: 'Hành Hỏa phương Nam, biểu trưng cho sinh khí, nhiệt huyết, lễ nghi quang minh và hỷ sự.',
    isPopular: true
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
    category: 'heritage',
    element: 'Kim',
    colorType: 'chinh_sac',
    elementMeaning: 'Hành Kim phương Tây, biểu trưng cho đức tính chính trực, thanh khiết và vẹn nguyên sơ tâm.',
    isPopular: true
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
    category: 'pastel',
    element: 'Hỏa',
    colorType: 'gian_sac',
    elementMeaning: 'Gian sắc phối thuộc Hỏa, biểu trưng cho sự nhu hòa, duyên dáng thanh tao của người thiếu nữ.',
    isPopular: true
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
    category: 'royal',
    element: 'Thổ',
    colorType: 'chinh_sac',
    elementMeaning: 'Hành Thổ vị trí trung cung, biểu trưng cho cội nguồn đất mẹ bao dung, vương giả và sự vững chãi.',
    isPopular: true
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
    category: 'royal',
    element: 'Mộc',
    colorType: 'chinh_sac',
    elementMeaning: 'Hành Mộc phương Đông, tượng trưng cho mùa xuân, đức nhân, sự sinh sôi nảy nở và tính khiêm cung.',
    isPopular: true
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
    category: 'heritage',
    element: 'Hỏa',
    colorType: 'gian_sac',
    elementMeaning: 'Gian sắc phối giữa xanh chàm và đỏ tía, biểu trưng cho lòng thủy chung son sắt và chất trữ tình Cố đô.',
    isPopular: true
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
    category: 'heritage',
    element: 'Thủy',
    colorType: 'gian_sac',
    elementMeaning: 'Hành Thủy phương Bắc, biểu trưng cho sự thâm sâu, bền bỉ và tri thức nội tâm của người xưa.',
    isPopular: true
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
    category: 'modern',
    element: 'Thủy',
    colorType: 'chinh_sac',
    elementMeaning: 'Hành Thủy cổ truyền (Huyền sắc), tượng trưng cho sự huyền vi, uy nghiêm đĩnh đạc của bậc sĩ phu.',
    isPopular: false
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
    category: 'pastel',
    element: 'Mộc',
    colorType: 'gian_sac',
    elementMeaning: 'Gian sắc hòa sắc thanh tân, kế thừa mỹ cảm đồ gốm hoa lam thời Lý - Trần kết hợp phong cách đương đại.',
    isPopular: false
  },
  {
    id: 'nau-gu',
    name: 'Nâu Gụ Hạt Dẻ',
    vietnameseName: 'Nâu Gụ Quan Họ Kinh Bắc',
    hex: '#5C3A21',
    hsl: { h: 26, s: 47, l: 24 },
    secondaryHex: '#9B1D20',
    accentHex: '#1D6246',
    mood: 'Mộc mạc, đằm thắm, duyên dáng và đậm đà hồn quê Quan họ',
    culturalMeaning: 'Màu nhuộm củ nâu truyền thống ngàn năm của cư dân đồng bằng Bắc Bộ, gắn liền với hình tượng liền chị nón quai thao.',
    category: 'heritage',
    element: 'Thổ',
    colorType: 'gian_sac',
    elementMeaning: 'Hành Thổ cội nguồn, chất phác, đằm thắm và son sắt.',
    isPopular: true
  },
  {
    id: 'nau-song',
    name: 'Nâu Sồng Đất',
    vietnameseName: 'Nâu Sồng Đất Phù Sa Nam Bộ',
    hex: '#664228',
    hsl: { h: 25, s: 44, l: 28 },
    secondaryHex: '#1A1C20',
    accentHex: '#F4EFE6',
    mood: 'Chân chất, phóng khoáng, kiên cường và bao dung sông nước',
    culturalMeaning: 'Màu áo bà ba nhuộm vỏ trâm bầu, mặc cùng quần lụa đen - biểu tượng bất khuất và bình dị của người Nam Bộ.',
    category: 'heritage',
    element: 'Thổ',
    colorType: 'gian_sac',
    elementMeaning: 'Hành Thổ phù sa màu mỡ, gắn liền với ruộng đồng và phù sa châu thổ Cửu Long.',
    isPopular: true
  }
];

// Danh sách các sắc lụa di sản phổ biến nhất trong trang phục truyền thống Việt Nam
export const POPULAR_COLORS: ColorOption[] = COLORS.filter((c) => c.isPopular);

export interface CuratedPaletteOption {
  id: string; // colorId in colorVariants (e.g. 'do-son')
  name: string; // Tên bản phối mỹ miều (vd: 'Đỏ Son Cát Tường')
  primaryColorHex: string; // Màu thân áo
  secondaryColorHex: string; // Màu quần / yếm / nẹp cổ
  primaryName: string; // Tên màu áo
  secondaryName: string; // Tên màu quần/yếm
  context: string; // Ngữ cảnh sử dụng
  description: string; // Mô tả hòa sắc
  tag: string; // Tag hiển thị
}

export const GARMENT_CURATED_PALETTES: Record<string, CuratedPaletteOption[]> = {
  'ao-dai': [
    {
      id: 'do-son',
      name: 'Đỏ Son Cát Tường',
      primaryColorHex: '#9B1D20',
      secondaryColorHex: '#F4EFE6',
      primaryName: 'Áo lụa Đỏ Son',
      secondaryName: 'Quần lụa trắng ngà',
      context: 'Hỷ sự, Lễ Tết, Khai xuân',
      description: 'Sắc đỏ son vương giả kết hợp quần lụa trắng ngà buông rủ thanh khiết.',
      tag: 'Kinh điển'
    },
    {
      id: 'trang-lua-nga',
      name: 'Bạch Ngọc Nữ Sinh',
      primaryColorHex: '#F4EFE6',
      secondaryColorHex: '#1A1C20',
      primaryName: 'Áo lụa Bạch Ngọc',
      secondaryName: 'Quần lụa đen/trắng',
      context: 'Thanh tân học đường, Lễ tốt nghiệp',
      description: 'Tà áo dài trắng ngọc thuần khiết, biểu tượng nữ sinh Việt Nam qua nhiều thế hệ.',
      tag: 'Kinh điển'
    },
    {
      id: 'hong-canh-sen',
      name: 'Hồng Sen Thanh Lịch',
      primaryColorHex: '#CA4F76',
      secondaryColorHex: '#F4EFE6',
      primaryName: 'Áo Hồng Cánh Sen',
      secondaryName: 'Quần lụa trắng ngà',
      context: 'Du xuân, Dạo phố, Tiệc trà',
      description: 'Sắc hồng sen tao nhã, nhu hòa tôn vinh nét duyên dáng thiếu nữ.',
      tag: 'Phổ biến'
    },
    {
      id: 'xanh-ngoc-luc',
      name: 'Ngọc Bích Quý Phái',
      primaryColorHex: '#1D6246',
      secondaryColorHex: '#F4EFE6',
      primaryName: 'Áo Xanh Ngọc Bích',
      secondaryName: 'Quần lụa trắng ngà',
      context: 'Nghi lễ trang trọng, Dạ tiệc',
      description: 'Sắc ngọc lục bảo sang trọng, cốt cách thanh tao và trường tồn.',
      tag: 'Quý phái'
    }
  ],
  'ao-ngu-than': [
    {
      id: 'xanh-cham',
      name: 'Xanh Chàm Nho Sinh',
      primaryColorHex: '#182747',
      secondaryColorHex: '#F4EFE6',
      primaryName: 'Áo Xanh Chàm',
      secondaryName: 'Nẹp cổ & Quần trắng',
      context: 'Học đạo, Thư phòng, Bác học',
      description: 'Sắc chàm thâm trầm của bậc sĩ phu Nho học, nẹp cổ lập lĩnh trắng nghiêm cẩn.',
      tag: 'Kinh điển'
    },
    {
      id: 'vang-hoang-cuc',
      name: 'Vàng Cúc Vương Giả',
      primaryColorHex: '#C59338',
      secondaryColorHex: '#F4EFE6',
      primaryName: 'Áo Vàng Hoàng Cúc',
      secondaryName: 'Nẹp cổ & Quần trắng',
      context: 'Khánh tiết, Hội nghị, Lễ nghi',
      description: 'Sắc vàng tơ cúc vương giả, đại diện vị thế cao sang và phúc lộc.',
      tag: 'Phổ biến'
    },
    {
      id: 'den-tuyen',
      name: 'Hắc Tuyền Trầm Mặc',
      primaryColorHex: '#1A1C20',
      secondaryColorHex: '#F4EFE6',
      primaryName: 'Áo Đen Hắc Tuyền',
      secondaryName: 'Nẹp cổ & Quần trắng',
      context: 'Đại lễ, Trưởng thượng, Mực thước',
      description: 'Màu đen tuyền kinh điển của quan viên, văn nhân xưa, tương phản nẹp cổ trắng.',
      tag: 'Truyền thống'
    },
    {
      id: 'do-son',
      name: 'Đỏ Son Hỷ Sự',
      primaryColorHex: '#9B1D20',
      secondaryColorHex: '#F4EFE6',
      primaryName: 'Áo Gấm Đỏ Son',
      secondaryName: 'Nẹp cổ & Quần trắng',
      context: 'Đón hỷ, Chúc thọ, Gia lễ',
      description: 'Sắc gấm đỏ son tươi thắm mang lại may mắn, phúc thọ tràn đầy.',
      tag: 'Hỷ sự'
    }
  ],
  'nhat-binh': [
    {
      id: 'vang-hoang-cuc',
      name: 'Hoàng Cúc Đại Triều',
      primaryColorHex: '#C59338',
      secondaryColorHex: '#E8C57A',
      primaryName: 'Áo Vàng Hoàng Cúc',
      secondaryName: 'Cổ ngũ sắc & Quần trắng',
      context: 'Đại triều • Hoàng Thái Hậu, Hoàng Hậu',
      description: 'Màu vàng hoàng yến độc tôn hoàng tộc triều Nguyễn, cổ áo ngũ sắc dệt chỉ vàng lộng lẫy.',
      tag: 'Vương quyền'
    },
    {
      id: 'do-son',
      name: 'Xích Đào Cung Đình',
      primaryColorHex: '#9B1D20',
      secondaryColorHex: '#DFB058',
      primaryName: 'Áo Đỏ Xích Đào',
      secondaryName: 'Cổ ngũ sắc & Quần trắng',
      context: 'Cung đình • Công Chúa, Hoàng Quý Phi',
      description: 'Sắc đỏ xích đào tôn quý của bậc Công Chúa, kết hợp hoa văn phụng điệp cung đình.',
      tag: 'Hoàng gia'
    },
    {
      id: 'tim-hue',
      name: 'Tím Cố Đô Sông Hương',
      primaryColorHex: '#6B3074',
      secondaryColorHex: '#F4EFE6',
      primaryName: 'Áo Tím Hoa Cà',
      secondaryName: 'Cổ ngũ sắc & Quần trắng',
      context: 'Cung phụng • Nhất phẩm Phu nhân',
      description: 'Màu tím đặc trưng xứ Huế, biểu trưng cho sự thủy chung và trang nghiêm cổ kính.',
      tag: 'Kinh điển'
    },
    {
      id: 'xanh-ngoc-luc',
      name: 'Thanh Ngọc Bát Bảo',
      primaryColorHex: '#1D6246',
      secondaryColorHex: '#DFB058',
      primaryName: 'Áo Ngọc Lục Bảo',
      secondaryName: 'Cổ ngũ sắc & Quần trắng',
      context: 'Triều nghi • Nhị/Tam phẩm Cung tần',
      description: 'Sắc ngọc bích quý tộc kết hợp cổ áo thêu thủy ba tam sơn bát bảo cát tường.',
      tag: 'Trang nhã'
    }
  ],
  'ao-tu-than': [
    {
      id: 'nau-gu',
      name: 'Nâu Gụ Yếm Đào',
      primaryColorHex: '#5C3A21',
      secondaryColorHex: '#9B1D20',
      primaryName: 'Vạt áo Nâu Gụ',
      secondaryName: 'Yếm đào đỏ & Váy sồi đen',
      context: 'Hội Lim, Quan họ Kinh Bắc kinh điển',
      description: 'Bản phối trứ danh ngàn đời của liền chị Quan họ: vạt lụa nâu gụ, yếm đào đỏ son và váy sồi đen tuyền.',
      tag: 'Kinh điển'
    },
    {
      id: 'vang-hoang-cuc',
      name: 'Vàng Tơ Cúc Yếm Đào',
      primaryColorHex: '#C59338',
      secondaryColorHex: '#CA4F76',
      primaryName: 'Vạt áo Vàng Cúc',
      secondaryName: 'Yếm đào sen & Váy sồi đen',
      context: 'Du xuân, Hội làng trẩy hội',
      description: 'Sắc vàng tơ tằm óng ả làm bừng sáng yếm sen hồng đào và dải lụa thắt lưng xanh.',
      tag: 'Duyên dáng'
    },
    {
      id: 'hong-canh-sen',
      name: 'Hồng Sen Trẩy Hội',
      primaryColorHex: '#CA4F76',
      secondaryColorHex: '#9B1D20',
      primaryName: 'Vạt áo Hồng Sen',
      secondaryName: 'Yếm đào đỏ & Váy sồi đen',
      context: 'Trẩy hội mùa xuân, Giao duyên',
      description: 'Sắc hồng sen ngọt ngào kết hợp yếm thắm, dải bao sáp lụa mềm mại vắt ngang lưng.',
      tag: 'Phổ biến'
    },
    {
      id: 'xanh-cham',
      name: 'Chàm Then Cổ Truyền',
      primaryColorHex: '#182747',
      secondaryColorHex: '#CA4F76',
      primaryName: 'Vạt áo Xanh Chàm',
      secondaryName: 'Yếm đào sen & Váy sồi đen',
      context: 'Dân gian mộc mạc, Lễ hội làng',
      description: 'Vạt chàm then truyền thống mộc mạc, làm bừng sáng yếm sen hồng đào bên trong.',
      tag: 'Dân gian'
    }
  ],
  'ao-ba-ba': [
    {
      id: 'nau-song',
      name: 'Nâu Sồng Đất Phù Sa',
      primaryColorHex: '#664228',
      secondaryColorHex: '#1A1C20',
      primaryName: 'Áo Nâu Sồng Nam Bộ',
      secondaryName: 'Quần lụa phi bóng đen',
      context: 'Sông nước Cửu Long, Đời thường mộc mạc',
      description: 'Biểu tượng kinh điển của người Nam Bộ: áo bà ba nâu sồng chân chất, khuy ngọc và quần lụa đen bóng.',
      tag: 'Kinh điển'
    },
    {
      id: 'hong-canh-sen',
      name: 'Hồng Sen Miệt Vườn',
      primaryColorHex: '#CA4F76',
      secondaryColorHex: '#1A1C20',
      primaryName: 'Áo Hồng Sen',
      secondaryName: 'Quần lụa phi bóng đen',
      context: 'Dạo phố sông nước, Chợ nổi miền Tây',
      description: 'Nét duyên mộc mạc của cô gái phương Nam với áo bà ba sen hồng và quần lụa đen bóng.',
      tag: 'Duyên dáng'
    },
    {
      id: 'xanh-ngoc-luc',
      name: 'Xanh Ngọc Phù Sa',
      primaryColorHex: '#1D6246',
      secondaryColorHex: '#1A1C20',
      primaryName: 'Áo Xanh Ngọc Lục',
      secondaryName: 'Quần lụa phi bóng đen',
      context: 'Du lịch sinh thái, Miệt vườn',
      description: 'Màu xanh lục mát dịu như vườn cây trái trĩu quả miền Tây, khuy ngọc trắng nổi bật.',
      tag: 'Tươi mát'
    },
    {
      id: 'trang-lua-nga',
      name: 'Trắng Khôi Nguyên',
      primaryColorHex: '#F4EFE6',
      secondaryColorHex: '#1A1C20',
      primaryName: 'Áo Trắng Ngà',
      secondaryName: 'Quần lụa phi bóng đen',
      context: 'Đời thường, Thanh lịch dung dị',
      description: 'Bản phối tương phản trắng - đen thuần túy kinh điển của áo bà ba Nam Bộ.',
      tag: 'Thuần khiết'
    }
  ]

};

// Helper chuẩn hoá type
export function normalizeGarmentTypeKey(garmentIdOrType?: string): string {
  if (!garmentIdOrType) return 'ao-dai';
  const clean = garmentIdOrType.replace('clothes-', '').toLowerCase();
  if (clean.includes('nhat-binh') || clean.includes('nhat_binh')) return 'nhat-binh';
  if (clean.includes('ngu-than') || clean.includes('ngu_than')) return 'ao-ngu-than';
  if (clean.includes('tu-than') || clean.includes('tu_than')) return 'ao-tu-than';
  if (clean.includes('ba-ba') || clean.includes('ba_ba')) return 'ao-ba-ba';
  return 'ao-dai';
}

export function getCuratedPalettesForGarment(garmentIdOrType?: string): CuratedPaletteOption[] {
  const key = normalizeGarmentTypeKey(garmentIdOrType);
  return GARMENT_CURATED_PALETTES[key] || GARMENT_CURATED_PALETTES['ao-dai'];
}
