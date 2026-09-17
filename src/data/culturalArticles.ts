export interface CulturalArticle {
  id: string;
  title: string;
  garmentId?: string;
  category: 'knowledge' | 'guide' | 'warning' | 'story';
  readingTime: string;
  summary: string;
  content: {
    heading: string;
    body: string;
  }[];
}

export const CULTURAL_ARTICLES: CulturalArticle[] = [
  {
    id: 'hieu-dung-ao-ngu-than',
    title: 'Áo Ngũ Thân: Nguồn cội của Áo Dài và Triết lý Ngũ Thường',
    garmentId: 'ao-ngu-than',
    category: 'knowledge',
    readingTime: '4 phút',
    summary: 'Rất nhiều người lầm tưởng Áo Dài có sẵn từ ngàn năm trước, nhưng thực tế Áo Dài chính là bản tinh giản của Áo Ngũ Thân thời Chúa Nguyễn và Vua Minh Mạng.',
    content: [
      {
        heading: 'Tại sao lại gọi là "Ngũ Thân"?',
        body: 'Áo được may ghép từ 5 mảnh vải (thân): 2 thân trước, 2 thân sau và 1 thân con bên trong (vạt con). Thân con tượng trưng cho bản thân người mặc, được 4 thân ngoài (tượng trưng cho cha mẹ hai bên) ôm ấp, chở che.'
      },
      {
        heading: 'Ý nghĩa 5 chiếc cúc',
        body: 'Năm hạt cúc cài bên sườn phải tượng trưng cho Ngũ thường của Nho giáo: Nhân - Lễ - Nghĩa - Trí - Tín, nhắc nhở người mặc luôn giữ gìn cốt cách đạo đức và cách ứng xử hòa nhã.'
      },
      {
        heading: 'Gợi ý Gen Z Remix',
        body: 'Khi phối đồ hiện đại với Ngũ Thân tay chẽn, bạn có thể kết hợp cùng sneaker cổ điển hoặc quần tây cạp cao. Tuyệt đối giữ đúng nếp cổ đứng (lập lĩnh) kín đáo, không khoét cổ sâu.'
      }
    ]
  },
  {
    id: 'hieu-dung-nhat-binh',
    title: 'Áo Nhật Bình: Quy thức Hoàng Triều và Ranh Giới Cách Tân',
    garmentId: 'nhat-binh',
    category: 'warning',
    readingTime: '5 phút',
    summary: 'Nhật Bình là phẩm phục cao quý của bậc Mẫu nghi thiên hạ và cung tần triều Nguyễn. Việc phối đồ cần có điểm dừng để tôn trọng tính tôn nghiêm lịch sử.',
    content: [
      {
        heading: 'Đặc trưng đối khâm và ngũ hành',
        body: 'Cổ áo hình chữ nhật viền thêu hoa văn tinh xảo, dải viền tay áo ngũ sắc tượng trưng cho ngũ hành tương sinh: Kim, Mộc, Thủy, Hỏa, Thổ. Đây là áo thường phục nhưng thuộc cấp độ hoàng gia.'
      },
      {
        heading: 'Lưu ý tối thượng khi Remix',
        body: 'Không nên cắt xén vạt áo Nhật Bình thành crop-top ngắn hoặc phối cùng trang phục quá hở hang phản cảm. Khi muốn mang chất Gen Z, hãy biến tấu theo hướng áo khoác Haori/Kimono sang trọng đi kèm quần ống suông và phụ kiện tối giản.'
      }
    ]
  },
  {
    id: 'hieu-dung-ao-tu-than',
    title: 'Áo Tứ Thân & Nét Mộc Duyên Vùng Dân Ca Quan Họ',
    garmentId: 'ao-tu-than',
    category: 'knowledge',
    readingTime: '3 phút',
    summary: 'Tượng trưng cho sự tần tảo, duyên thầm và đức hy sinh của người phụ nữ đồng bằng Bắc Bộ.',
    content: [
      {
        heading: 'Cấu trúc 4 tà và dải thắt lưng xanh',
        body: 'Bốn vạt áo tượng trưng cho tứ thân phụ mẫu. Hai vạt trước không cài cúc mà để buộc vạt trước bụng, tạo hình ảnh chiếc nơ thắm đượm tình nghĩa vợ chồng son sắt.'
      },
      {
        heading: 'Cách tân thế hệ mới',
        body: 'Chiếc áo yếm bên trong có thể biến tấu thành yếm lụa cao cấp phối cùng blazer hoặc áo tứ thân thả buông như một chiếc trench coat mỏng nhẹ thời thượng.'
      }
    ]
  },
  {
    id: 'quy-tac-remix-van-minh',
    title: '4 Quy Tắc Vàng Khi Gen Z Phối Việt Phục',
    category: 'guide',
    readingTime: '3 phút',
    summary: 'Sáng tạo là không giới hạn, nhưng văn hóa có cội nguồn. Nắm chắc 4 nguyên tắc để vừa mặc đẹp, vừa tự hào.',
    content: [
      {
        heading: '1. Giữ trọn phom dáng cốt lõi',
        body: 'Mỗi loại cổ áo (lập lĩnh, đối khâm, giao lĩnh) và kết cấu tà áo là linh hồn của bộ trang phục. Đừng biến dạng cấu trúc cơ bản khiến người nhìn không còn nhận ra bản sắc Việt.'
      },
      {
        heading: '2. Phối phụ kiện có tính đối thoại',
        body: 'Đôi chunky sneaker, chiếc kính Y2K hay túi canvas in typo có thể tạo nên sự đối thoại thú vị giữa quá khứ và hiện đại nếu màu sắc và tỷ lệ thị giác được cân nhắc kỹ càng.'
      },
      {
        heading: '3. Phù hợp bối cảnh không gian',
        body: 'Khi đến đền chùa, lễ hội truyền thống tôn nghiêm: hãy ưu tiên phối đồ chuẩn mực. Khi dạo phố, chụp ảnh lookbook, đi học hay biểu diễn nghệ thuật: bạn hoàn toàn có thể tự do phóng khoáng hơn.'
      },
      {
        heading: '4. Hiểu câu chuyện đằng sau trang phục',
        body: 'Mặc đẹp nhất là khi bạn có thể tự tin kể cho bạn bè trong nước và quốc tế nghe về nguồn gốc tà áo mình đang khoác trên vai.'
      }
    ]
  }
];

export const CULTURAL_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Khi dạo phố cuối tuần cùng bạn bè, bạn thích cảm giác nào nhất?',
    options: [
      { label: 'Thoải mái, phóng khoáng, mộc mạc và năng động', garmentId: 'ao-ba-ba', styleId: 'street' },
      { label: 'Thanh lịch, thướt tha, duyên dáng và bắt mắt', garmentId: 'ao-dai', styleId: 'modern-genz' },
      { label: 'Đĩnh đạc, trầm ổn, yêu chuộng chiều sâu tri thức', garmentId: 'ao-ngu-than', styleId: 'traditional' },
      { label: 'Sang trọng, quý phái, nổi bật như tâm điểm lễ hội', garmentId: 'nhat-binh', styleId: 'elegant' }
    ]
  },
  {
    id: 2,
    question: 'Phụ kiện nào bạn cảm thấy không thể thiếu khi ra đường?',
    options: [
      { label: 'Đôi chunky sneaker hoặc bốt da cá tính', garmentId: 'ao-dai', styleId: 'modern-genz' },
      { label: 'Chiếc nón lá quai thao hoặc túi cói thêu tay mộc mạc', garmentId: 'ao-tu-than', styleId: 'vintage' },
      { label: 'Trâm cài tóc xà cừ hoặc kiềng bạc hoa mai cổ kính', garmentId: 'nhat-binh', styleId: 'elegant' },
      { label: 'Chiếc khăn rằn hoặc túi tote in graphic nghệ thuật', garmentId: 'ao-ba-ba', styleId: 'street' }
    ]
  },
  {
    id: 3,
    question: 'Bảng màu nào mô tả đúng nhất gu thẩm mỹ của bạn?',
    options: [
      { label: 'Đỏ son cung đình và vàng hoàng cúc rạng rỡ', garmentId: 'nhat-binh', styleId: 'traditional' },
      { label: 'Trắng lụa ngà và pastel thanh thiên nhẹ nhàng', garmentId: 'ao-dai', styleId: 'minimal' },
      { label: 'Xanh chàm cổ và đen mực tàu hoài niệm', garmentId: 'ao-ngu-than', styleId: 'vintage' },
      { label: 'Đen tuyền sắc sảo kết hợp phụ kiện nổi bật', garmentId: 'ao-ba-ba', styleId: 'street' }
    ]
  }
];
