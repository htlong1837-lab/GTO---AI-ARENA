import { Accessory } from '../types/outfit';

export const ACCESSORIES: Accessory[] = [
  {
    id: 'khan-dong',
    name: 'Khăn Đóng (Khăn Xếp)',
    category: 'headwear',
    isTraditional: true,
    description: 'Khăn vấn nhiều nếp quấn gọn quanh đầu, tôn lên đường nét khuôn mặt đĩnh đạc và phong thái lễ nghi.',
    iconName: 'Crown',
    matchStyles: ['traditional', 'elegant', 'vintage']
  },
  {
    id: 'non-quai-thao',
    name: 'Nón Quai Thao (Nón Ba Tầm)',
    category: 'headwear',
    isTraditional: true,
    description: 'Nón lá tròn to phẳng viền mây, gắn quai thao bằng tơ mềm rủ xuống ngực, biểu tượng thiếu nữ Kinh Bắc.',
    iconName: 'SunMedium',
    matchStyles: ['traditional', 'vintage', 'elegant']
  },
  {
    id: 'guoc-moc',
    name: 'Guốc Mộc Sơn Mài',
    category: 'footwear',
    isTraditional: true,
    description: 'Guốc gỗ mít mài nhẵn, quai nhung thêu hoa hoặc vẽ hoa văn sơn mài mỹ nghệ tinh tế.',
    iconName: 'Footprints',
    matchStyles: ['traditional', 'vintage', 'minimal']
  },
  {
    id: 'sneaker-chunky',
    name: 'Sneaker Trắng Chunky',
    category: 'footwear',
    isTraditional: false,
    description: 'Giày thể thao đế độn năng động, tạo sự tương phản bùng nổ giữa tà áo cổ phong và năng lượng đường phố Gen Z.',
    iconName: 'Zap',
    matchStyles: ['street', 'modern-genz', 'cute']
  },
  {
    id: 'boots-da',
    name: 'Boots Da Cổ Thấp Mũi Vuông',
    category: 'footwear',
    isTraditional: false,
    description: 'Bốt da đen bóng hoặc nâu cà phê tạo phom đứng cá tính, mang phong cách runway thời trang cao cấp.',
    iconName: 'Sparkles',
    matchStyles: ['street', 'elegant', 'modern-genz']
  },
  {
    id: 'tui-coi-theu',
    name: 'Túi Cói Đan Tay & Khăn Lụa',
    category: 'bags',
    isTraditional: true,
    description: 'Túi thủ công từ cói bèo tự nhiên làng nghề Việt, quấn khăn lụa tơ tằm mềm mại bên quai.',
    iconName: 'ShoppingBag',
    matchStyles: ['minimal', 'vintage', 'cute']
  },
  {
    id: 'tote-typography',
    name: 'Túi Tote Graphic Cổ Điển',
    category: 'bags',
    isTraditional: false,
    description: 'Túi vải canvas in đồ họa tranh Đông Hồ hoặc typographic chữ Quốc ngữ thập niên 90.',
    iconName: 'Briefcase',
    matchStyles: ['street', 'modern-genz', 'minimal']
  },
  {
    id: 'tram-cai-toc',
    name: 'Trâm Bạc Cài Tóc Xà Cừ',
    category: 'jewelry',
    isTraditional: true,
    description: 'Trâm cài khắc hoa sen, khảm xà cừ óng ánh giúp búi tóc cao thanh thoát kiểu tiểu thư quý phái.',
    iconName: 'Gem',
    matchStyles: ['traditional', 'elegant', 'vintage']
  },
  {
    id: 'kieng-bac',
    name: 'Vòng Kiềng Bạc Chạm Hoa',
    category: 'jewelry',
    isTraditional: true,
    description: 'Chiếc kiềng bạc tròn ôm sát chân cổ truyền thống, điểm xuyết họa tiết mai lan cúc trúc.',
    iconName: 'Circle',
    matchStyles: ['traditional', 'elegant', 'modern-genz']
  },
  {
    id: 'kinh-mat-y2k',
    name: 'Kính Râm Cyber Y2K',
    category: 'modern',
    isTraditional: false,
    description: 'Kính râm gọng oval hoặc mắt mèo tráng gương tạo điểm nhấn thị giác phá cách, bất quy tắc.',
    iconName: 'Glasses',
    matchStyles: ['street', 'modern-genz']
  },
  {
    id: 'quat-lua-xep',
    name: 'Quạt Xếp Lụa Thủy Mặc',
    category: 'handheld',
    isTraditional: true,
    description: 'Chiếc quạt giấy lụa nan tre vẽ cành đào cúc hoặc viết thư pháp thanh tao khi cầm tay.',
    iconName: 'Wind',
    matchStyles: ['traditional', 'vintage', 'elegant']
  },
  {
    id: 'ngoc-trai-layer',
    name: 'Chuỗi Ngọc Trai Layering',
    category: 'jewelry',
    isTraditional: false,
    description: 'Chuỗi hạt ngọc trai nước ngọt xếp nhiều tầng kiểu Parisian Chic, tạo nét cổ điển tân thời.',
    iconName: 'Sparkles',
    matchStyles: ['elegant', 'vintage', 'cute']
  },
  {
    id: 'blazer-oversize',
    name: 'Áo Khoác Blazer Lửng / Oversize',
    category: 'modern',
    isTraditional: false,
    description: 'Khoác ngoài tà áo dài hoặc áo bà ba tạo cấu trúc layer hiện đại, đĩnh đạc và sành điệu.',
    iconName: 'Layers',
    matchStyles: ['modern-genz', 'street', 'minimal']
  },
  {
    id: 'khan-ran-nam-bo',
    name: 'Khăn Rằn Nam Bộ Cách Điệu',
    category: 'handheld',
    isTraditional: true,
    description: 'Khăn rằn caro đen trắng hoặc đỏ trắng đặc trưng, thắt nơ cổ hoặc vắt vai đậm chất hào sảng phương Nam.',
    iconName: 'Shirt',
    matchStyles: ['traditional', 'street', 'vintage']
  }
];
