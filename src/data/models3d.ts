export type Slot3DType = 'base';

export interface Transform3D {
  position: [number, number, number];
  rotation: [number, number, number]; // in radians
  scale: [number, number, number];
}

export interface Item3D {
  id: string;
  name: string;
  category: 'garment' | 'accessory';
  slot: Slot3DType;
  type: 'glb';
  url?: string;
  thumbnail?: string;
  description: string;
  culturalNote: string;
  tags: string[];
  colorable: boolean;
  defaultColor?: string;
  defaultTransform: Transform3D;
  dynasty?: string;
  heritageEra?: string;
}

export interface ActiveSlotState {
  itemId: string | null;
  visible: boolean;
  color?: string;
  transform: Transform3D;
  customFile?: {
    name: string;
    url: string;
  };
}

// 5 BẢO VẬT CỔ PHỤC VIỆT NAM (NGŨ ĐẠI VIỆT PHỤC) & 8 PHỤ KIỆN CỔ TRUYỀN 3D PBR
export const STARTER_3D_ITEMS: Item3D[] = [
  // --- PHẦN 1: NGŨ ĐẠI VIỆT PHỤC (5 BỘ Y PHỤC DI SẢN) ---
  {
    id: 'base-ao-nhat-binh',
    name: 'Áo Nhật Bình Triều Nguyễn (PBR)',
    category: 'garment',
    slot: 'base',
    type: 'glb',
    url: '/models/ao_nhat_binh.glb',
    thumbnail: '/images/viet_phuc/ao_nhat_binh.jpg',
    dynasty: 'Triều Nguyễn (1802 - 1945)',
    heritageEra: 'Cung Đình Huế',
    description: 'Mô hình 3D nguyên bản Áo Nhật Bình Cung Đình Huế thời Nguyễn với hoa văn thêu dệt nổi PBR lộng lẫy và dải viền ngũ sắc trang trọng.',
    culturalNote: 'Y phục tôn quý bậc nhất của Hoàng thái hậu, Hoàng hậu, Công chúa và Cung tần triều Nguyễn. Cổ áo hình chữ nhật đặc trưng biểu trưng cho sự đoan chính, phẩm hạnh của bậc mẫu nghi thiên hạ.',
    tags: ['Áo Nhật Bình', 'Triều Nguyễn', 'Cung Đình Huế', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'base-ao-ngu-than',
    name: 'Áo Ngũ Thân Truyền Thống (PBR)',
    category: 'garment',
    slot: 'base',
    type: 'glb',
    url: '/models/ao_ngu_than.glb',
    thumbnail: '/images/viet_phuc/ao_ngu_than.jpg',
    dynasty: 'Thời Chúa Nguyễn & Triều Nguyễn',
    heritageEra: 'Toàn Quốc (Đại Nam)',
    description: 'Mô hình 3D Áo Ngũ Thân truyền thống Việt Nam chuẩn PBR, phom dáng cổ đứng, 5 khuy cài chuẩn mực, tôn nghiêm và thanh tao.',
    culturalNote: 'Y phục truyền thống với 5 thân áo (theo cách diễn giải phổ biến) biểu trưng cho ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín), 4 thân ngoài tượng trưng cho tứ thân phụ mẫu và 1 thân con bên trong biểu trưng cho sự chở che hiếu đạo.',
    tags: ['Áo Ngũ Thân', 'Cổ Phục', 'Di Sản Dân Tộc', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'base-ao-tu-than',
    name: 'Áo Tứ Thân Kinh Bắc (PBR)',
    category: 'garment',
    slot: 'base',
    type: 'glb',
    url: '/models/ao_tu_than.glb',
    thumbnail: '/images/viet_phuc/ao_tu_than.jpg',
    dynasty: 'Thế kỷ 12 - 20',
    heritageEra: 'Vùng Kinh Bắc (Bắc Bộ)',
    description: 'Mô hình 3D Áo Tứ Thân Bắc Bộ với yếm đào duyên dáng, tà áo thướt tha và dải thắt lưng ngũ sắc mềm mại.',
    culturalNote: 'Trang phục gắn liền với nền văn minh lúa nước đồng bằng Bắc Bộ, các làn điệu Dân ca Quan họ và lễ hội mùa xuân. Biểu trưng cho vẻ đẹp lao động, khéo léo và mộc mạc của người phụ nữ Việt xưa.',
    tags: ['Áo Tứ Thân', 'Kinh Bắc', 'Dân ca Quan Họ', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'base-ao-dai',
    name: 'Áo Dài Truyền Thống Việt Nam (PBR)',
    category: 'garment',
    slot: 'base',
    type: 'glb',
    url: '/models/ao_dai.glb',
    thumbnail: '/images/viet_phuc/ao_dai.jpg',
    dynasty: 'Thế kỷ 18 - Nay',
    heritageEra: 'Quốc Phục Việt Nam',
    description: 'Mô hình 3D Áo Dài truyền thống Việt Nam với phom dáng tà đôi thướt tha, cổ đứng thanh lịch, tay raglan ôm gọn phối quần lụa.',
    culturalNote: 'Quốc phục của dân tộc Việt Nam, kết tinh từ quá trình biến chuyển lịch sử từ Áo Ngũ Thân thành biểu tượng của sự đoan trang, duyên dáng và thanh lịch được công nhận khắp năm châu.',
    tags: ['Áo Dài', 'Quốc Phục', 'Di Sản Văn Hóa', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'base-ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ (PBR)',
    category: 'garment',
    slot: 'base',
    type: 'glb',
    url: '/models/ao_ba_ba.glb',
    thumbnail: '/images/viet_phuc/ao_ba_ba.jpg',
    dynasty: 'Thế kỷ 19 - Nay',
    heritageEra: 'Đồng Bằng Sông Cửu Long',
    description: 'Mô hình 3D Áo Bà Ba Nam Bộ với cổ tròn thanh thoát, hàng cúc ngọc trai, hai túi trước và tà xẻ hông kết hợp quần lụa đen.',
    culturalNote: 'Trang phục đặc trưng gắn liền với con người và vùng đất trù phú phương Nam. Biểu trưng cho vẻ đẹp hồn hậu, chân chất, chịu thương chịu khó và phóng khoáng của người miền Tây sông nước.',
    tags: ['Áo Bà Ba', 'Nam Bộ', 'Sông Nước Cửu Long', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  // --- PHẦN 2: 8 TRANG PHỤC KÈM THEO & PHỤ KIỆN CỔ TRUYỀN (CẮT TỪ 8_PHU_KIEN.GLB) ---
  {
    id: 'acc-chuoi-ngoc-boi',
    name: 'Chuỗi Ngọc Bội Cung Đình (PBR)',
    category: 'accessory',
    slot: 'base',
    type: 'glb',
    url: '/models/phu_kien_1.glb',
    thumbnail: '/images/viet_phuc/phu_kien_1.jpg',
    dynasty: 'Triều Nguyễn & Lê Trung Hưng',
    heritageEra: 'Hoàng Tộc & Quý Tộc',
    description: 'Chuỗi ngọc bội ngọc thạch kết hợp dây tơ ngũ sắc và tua rua vàng kim quý phái, chế tác thủ công tinh xảo.',
    culturalNote: 'Vật phẩm tượng trưng cho đức hạnh và tôn ti trật tự của giới quý tộc xưa, thường được đeo trang trọng bên hông tà áo Nhật Bình hoặc Áo Ngũ Thân để tạo tiếng ngọc va leng keng thanh tao khi bước đi.',
    tags: ['Ngọc Bội', 'Cung Đình', 'Dây Treo Hoàng Cung', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'acc-tram-cai-toc',
    name: 'Trâm Phượng Cài Tóc Hoàng Gia (PBR)',
    category: 'accessory',
    slot: 'base',
    type: 'glb',
    url: '/models/phu_kien_2.glb',
    thumbnail: '/images/viet_phuc/phu_kien_2.jpg',
    dynasty: 'Cung Đình Huế (Triều Nguyễn)',
    heritageEra: 'Cung Vi Cấm Thành',
    description: 'Trâm vàng chạm hình chim phượng uốn lượn, đính ngọc trai thiên nhiên và tua rua xà cừ rủ nhẹ quý phái.',
    culturalNote: 'Biểu trưng cho địa vị mẫu nghi và vẻ đoan trang của hoàng hậu, phi tần và công chúa triều Nguyễn, giúp cố định búi tóc cao thanh tú và tôn lên khí chất đài các.',
    tags: ['Trâm Cài Tóc', 'Trâm Phượng', 'Trang Sức Cung Đình', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'acc-non-quai-thao',
    name: 'Nón Quai Thao Kinh Bắc (PBR)',
    category: 'accessory',
    slot: 'base',
    type: 'glb',
    url: '/models/phu_kien_3.glb',
    thumbnail: '/images/viet_phuc/phu_kien_3.jpg',
    dynasty: 'Thế kỷ 12 - 20',
    heritageEra: 'Vùng Đất Kinh Bắc',
    description: 'Mô hình 3D Nón Ba Tầm (Nón Quai Thao) tròn dẹt vành phẳng đan lá gồi, gắn quai thao ngũ sắc buông dài thướt tha.',
    culturalNote: 'Biểu tượng kinh điển của thiếu nữ và liền chị Dân ca Quan họ vùng Kinh Bắc khi phối cùng Áo Tứ Thân, mang vẻ đẹp e ấp, duyên dáng và đậm đà hồn quê đất Việt.',
    tags: ['Nón Quai Thao', 'Nón Ba Tầm', 'Kinh Bắc', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'acc-guoc-moc',
    name: 'Guốc Mộc Sơn Mài Quai Nhung (PBR)',
    category: 'accessory',
    slot: 'base',
    type: 'glb',
    url: '/models/phu_kien_4.glb',
    thumbnail: '/images/viet_phuc/phu_kien_4.jpg',
    dynasty: 'Đồng bằng Bắc Bộ & Huế',
    heritageEra: 'Văn Hóa Cổ Truyền',
    description: 'Đôi guốc gỗ mít đẽo gọt dáng cong thanh nhã, phủ sơn mài bóng bẩy và quai nhung thêu hoa văn mỹ nghệ.',
    culturalNote: 'Đôi guốc mộc mạc gắn liền với bước chân thanh lịch của người phụ nữ Việt xưa từ chốn làng quê đồng bằng đến cung đình Huế mộng mơ, vang lên thanh âm lách cách thân thương.',
    tags: ['Guốc Mộc', 'Sơn Mài', 'Hài Guốc', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'acc-quat-xep',
    name: 'Quạt Xếp Lụa Thủy Mặc (PBR)',
    category: 'accessory',
    slot: 'base',
    type: 'glb',
    url: '/models/phu_kien_5.glb',
    thumbnail: '/images/viet_phuc/phu_kien_5.jpg',
    dynasty: 'Thời Lê - Nguyễn',
    heritageEra: 'Giới Nho Sĩ & Phong Lưu',
    description: 'Mô hình 3D Quạt nan tre vót mảnh bồi giấy điệp và lụa dệt hoa văn, có thể mở rộng xòe duyên dáng.',
    culturalNote: 'Vật bất ly thân của các bậc nho sĩ và tài tử giai nhân, dùng để phe phẩy thanh lương, đề thơ ngâm vịnh hoặc che nghiêng nửa nụ cười e ấp trong các dịp dạ hội lễ tiết.',
    tags: ['Quạt Xếp', 'Lụa Thủy Mặc', 'Cầm Tay', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'acc-khan-dong',
    name: 'Khăn Đóng (Khăn Xếp Hoàng Cung) (PBR)',
    category: 'accessory',
    slot: 'base',
    type: 'glb',
    url: '/models/phu_kien_6.glb',
    thumbnail: '/images/viet_phuc/phu_kien_6.jpg',
    dynasty: 'Triều Nguyễn (Huế)',
    heritageEra: 'Quốc Phục & Đại Lễ',
    description: 'Khăn vấn bằng gấm the hoàng gia quấn nhiều nếp đều tăm tắp, kết cấu phom tròn đĩnh đạc và tôn nghiêm.',
    culturalNote: 'Phụ kiện đầu truyền thống quan trọng nhất khi diện cùng Áo Ngũ Thân hoặc Áo Tứ Thân, biểu trưng cho nề nếp gia phong, sự tề chỉnh và chuẩn mực lễ nghi dân tộc.',
    tags: ['Khăn Đóng', 'Khăn Xếp', 'Mũ Mão', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'acc-non-la',
    name: 'Nón Lá Truyền Thống Việt Nam (PBR)',
    category: 'accessory',
    slot: 'base',
    type: 'glb',
    url: '/models/phu_kien_7.glb',
    thumbnail: '/images/viet_phuc/phu_kien_7.jpg',
    dynasty: 'Cổ truyền đến Hiện đại',
    heritageEra: 'Biểu Tượng Dân Tộc',
    description: 'Chiếc nón chóp đan từ lá nón non phơi sương, uốn trên 16 nan tre chuốt mỏng và chằm chỉ tơ bóng mượt.',
    culturalNote: 'Biểu tượng văn hóa nổi tiếng nhất của phụ nữ Việt Nam trên toàn thế giới, đồng hành cùng tà Áo Dài và Áo Bà Ba, vừa che chở nắng mưa vừa làm duyên kín đáo cho người mặc.',
    tags: ['Nón Lá', 'Biểu Tượng Việt Nam', 'Dân Gian', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'acc-sao-truc',
    name: 'Sáo Trúc Cổ Phong Việt Nam (PBR)',
    category: 'accessory',
    slot: 'base',
    type: 'glb',
    url: '/models/phu_kien_8.glb',
    thumbnail: '/images/viet_phuc/phu_kien_8.jpg',
    dynasty: 'Cổ truyền dân tộc',
    heritageEra: 'Nhã Nhạc & Dân Nhạc Cổ',
    description: 'Cây sáo trúc chế tác từ gióng trúc già phơi kỹ, đục lỗ bấm ngọc ngà, tỏa ra khí chất thanh cao.',
    culturalNote: 'Nhạc cụ mộc mạc mang âm sắc trong trẻo tha thiết, thường xuất hiện trong thi ca cổ phong, tượng trưng cho tâm hồn tự tại, gắn bó tha thiết với đất trời non sông.',
    tags: ['Sáo Trúc', 'Nhạc Cụ Cổ Truyền', 'Cổ Phong', '3D PBR'],
    colorable: true,
    defaultTransform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  }
];

export const DEFAULT_ACTIVE_SLOTS: Record<Slot3DType, ActiveSlotState> = {
  base: {
    itemId: 'base-ao-nhat-binh',
    visible: true,
    transform: { ...STARTER_3D_ITEMS[0].defaultTransform }
  }
};
