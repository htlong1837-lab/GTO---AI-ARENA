import { Occasion } from '../types/outfit';

export const OCCASIONS: Occasion[] = [
  {
    id: 'tet',
    name: 'Tết Cổ Truyền',
    tag: 'Đầu năm sum vầy',
    icon: 'Sparkles',
    description: 'Du xuân chúc Tết, đi lễ chùa, tụ họp gia đình đầu năm với sắc màu may mắn, tươi vui và rạng rỡ.',
    recommendedGarments: ['ao-dai', 'ao-ngu-than', 'nhat-binh'],
    recommendedStyles: ['traditional', 'modern-genz', 'cute', 'elegant']
  },
  {
    id: 'le-hoi',
    name: 'Lễ Hội & Sự Kiện Văn Hóa',
    tag: 'Tôn vinh cội nguồn',
    icon: 'PartyPopper',
    description: 'Hội Lim, Đền Hùng, Festival Huế, diễu hành bách hoa cổ phục tôn vinh truyền thống dân tộc.',
    recommendedGarments: ['ao-tu-than', 'nhat-binh', 'ao-ngu-than'],
    recommendedStyles: ['traditional', 'vintage', 'elegant']
  },
  {
    id: 'di-hoc',
    name: 'Đi Học & Giảng Đường',
    tag: 'Năng động học đường',
    icon: 'GraduationCap',
    description: 'Phong cách nữ sinh, sinh viên thanh lịch, thoải mái di chuyển giữa các tiết học và sinh hoạt câu lạc bộ.',
    recommendedGarments: ['ao-dai', 'ao-ba-ba', 'ao-ngu-than'],
    recommendedStyles: ['minimal', 'cute', 'modern-genz']
  },
  {
    id: 'chup-anh',
    name: 'Chụp Ảnh Lookbook & Street Style',
    tag: 'Nghệ thuật & Sáng tạo',
    icon: 'Camera',
    description: 'Sáng tạo nội dung ảnh, dạo phố phường cổ Hà Nội, phố người Hoa Chợ Lớn hay sông Hương thơ mộng.',
    recommendedGarments: ['ao-dai', 'ao-tu-than', 'ao-ngu-than', 'nhat-binh', 'ao-ba-ba'],
    recommendedStyles: ['street', 'vintage', 'modern-genz', 'elegant']
  },
  {
    id: 'tot-nghiep',
    name: 'Lễ Tốt Nghiệp',
    tag: 'Khoảnh khắc dấu ấn',
    icon: 'Award',
    description: 'Ngày trọng đại vinh quy bái tổ thời 4.0, kết hợp nét trang trọng tri thức với cá tính thanh xuân.',
    recommendedGarments: ['ao-dai', 'ao-ngu-than'],
    recommendedStyles: ['elegant', 'minimal', 'modern-genz']
  },
  {
    id: 'cuoi-hoi',
    name: 'Cưới Hỏi & Ăn Hỏi',
    tag: 'Hỷ sự trang trọng',
    icon: 'HeartHandshake',
    description: 'Lễ dạm ngõ, ăn hỏi, bưng quả hoặc dự tiệc cưới người thân với diện mạo tao nhã, chuẩn mực.',
    recommendedGarments: ['ao-dai', 'nhat-binh', 'ao-ngu-than'],
    recommendedStyles: ['traditional', 'elegant']
  },
  {
    id: 'su-kien-van-hoa',
    name: 'Giao Lưu Quốc Tế & Ngoại Giao Trẻ',
    tag: 'Tự hào Việt Nam',
    icon: 'Globe',
    description: 'Đại diện giới trẻ Việt Nam tại các diễn đàn quốc tế, hội nghị thượng đỉnh thanh niên thế giới.',
    recommendedGarments: ['ao-ngu-than', 'ao-dai', 'nhat-binh'],
    recommendedStyles: ['elegant', 'modern-genz', 'minimal']
  },
  {
    id: 'di-choi',
    name: 'Dạo Phố & Cafe Chill Cuối Tuần',
    tag: 'Thư giãn thường nhật',
    icon: 'Coffee',
    description: 'Gặp gỡ bạn bè, dạo phố đi bộ, uống cafe chiều trong bộ trang phục thoải mái mang đậm bản sắc.',
    recommendedGarments: ['ao-ba-ba', 'ao-dai', 'ao-tu-than'],
    recommendedStyles: ['street', 'cute', 'minimal', 'modern-genz']
  }
];
