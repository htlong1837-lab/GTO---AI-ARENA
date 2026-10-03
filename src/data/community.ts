import { CommunityComment, CommunityPost, PostCategory } from '../types/community';
import { garmentIllustrationUrl } from './garmentIllustrations';

export const CATEGORIES: { id: PostCategory; name: string; short: string; description: string }[] = [
  { id: 'showcase', name: 'Phối Đồ & OOTD', short: 'Phối đồ', description: 'Khoe bản phối từ Studio AI hoặc ảnh mặc thật.' },
  { id: 'qa', name: 'Hỏi Đáp Phối Màu', short: 'Hỏi đáp', description: 'Xin góp ý phối màu, phụ kiện, chọn dáng áo theo dịp.' },
  { id: 'culture', name: 'Tàng Thư Văn Hóa', short: 'Văn hóa', description: 'Kiến thức lịch sử, quy tắc mặc cổ phục, phong tục.' },
  { id: 'events', name: 'Sự Kiện & Hội Họp', short: 'Sự kiện', description: 'Lễ hội, buổi chụp nhóm, triển lãm cổ phục.' }
];

// Tước hiệu theo khoa bảng — tính theo tổng lượt "Sen" nhận được
export const TITLES = [
  { min: 0, name: 'Tân Khách', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  { min: 10, name: 'Tú Tài', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  { min: 50, name: 'Cử Nhân', color: 'bg-sky-50 text-sky-800 border-sky-200' },
  { min: 150, name: 'Tiến Sĩ', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { min: 400, name: 'Bảng Nhãn', color: 'bg-amber-50 text-amber-900 border-amber-300' },
  { min: 1000, name: 'Trạng Nguyên', color: 'bg-red-50 text-heritage-red border-red-300' }
];

export const titleForLikes = (likes: number) => [...TITLES].reverse().find((t) => likes >= t.min) || TITLES[0];

export const WEEKLY_CHALLENGE = {
  tag: 'NhatBinhCyber',
  title: 'Remix Áo Nhật Bình phong cách Cyberpunk',
  description: 'Giữ nguyên cổ đối khâm và dải viền ngũ sắc, thử nghiệm ánh neon & chất liệu tương lai. Đăng kèm #NhatBinhCyber.',
  garmentId: 'nhat-binh',
  endsAt: '2026-10-11T23:59:00+07:00'
};

export const GUIDELINES = [
  'Tôn trọng giá trị cốt lõi của trang phục truyền thống và trang phục các dân tộc.',
  'Không xuyên tạc lịch sử; dẫn nguồn khi chia sẻ kiến thức.',
  'Góp ý bản phối bằng lời lẽ xây dựng — không công kích cá nhân, ngoại hình.',
  'Chỉ đăng ảnh của bạn hoặc ảnh AI do bạn tạo; ghi nguồn khi dùng ảnh người khác.',
  'Không spam quảng cáo, không mua bán đồ giả, đồ nhái thương hiệu nghệ nhân.'
];

const HOUR = 3600_000;
const ago = (h: number) => new Date(Date.now() - h * HOUR).toISOString();

const A = {
  linh: { id: 'seed-linhdan', name: 'Khách 101', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
  minh: { id: 'seed-minh', name: 'Khách 102', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
  thao: { id: 'seed-thao', name: 'Khách 103', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
  nam: { id: 'seed-nam', name: 'Khách 104', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  admin: { id: 'seed-admin', name: 'Ban Quản Trị Việt Phục Remix', avatar: 'favicon.svg' }
};

export const SEED_POSTS: CommunityPost[] = [
  {
    id: 'seed-p1',
    author: A.admin,
    category: 'events',
    title: 'Thử thách tuần: Remix Áo Nhật Bình phong cách Cyberpunk',
    content:
      'Chào cả nhà! Tuần này mình cùng thử **giữ cổ đối khâm & dải viền ngũ sắc** nhưng đưa Nhật Bình vào thế giới neon.\n\nCách tham gia:\n1. Vào Studio, chọn Áo Nhật Bình\n2. Tạo ảnh AI và bấm **Đăng lên Cộng đồng**\n3. Gắn tag #NhatBinhCyber\n\nBài nhiều Sen nhất sẽ được ghim trang chủ và nhận huy hiệu "Phượng Neon".',
    images: ['images/looks/look_nhatbinh_hoangtrieu.jpg'],
    tags: ['NhatBinhCyber', 'ThuThach'],
    likesCount: 87,
    commentsCount: 2,
    reportsCount: 0,
    createdAt: ago(20),
    isSeed: true
  },
  {
    id: 'seed-p2',
    author: A.linh,
    category: 'showcase',
    title: 'Áo dài đỏ son × sneaker trắng đi chúc Tết',
    content: 'Bản phối mình tạo trên Studio, mặc thật đi chúc Tết ông bà mà ai cũng khen. Tà áo vẫn giữ qua gối nên vẫn đủ trang trọng nha!',
    images: ['images/looks/look_aodai_duxuan.jpg'],
    tags: ['AoDai', 'Tet2027', 'GenZRemix'],
    look: { garmentId: 'ao-dai', colorId: 'do-son', accessoryIds: ['sneaker-chunky', 'kieng-bac'], styleId: 'modern-genz', occasionId: 'tet', gender: 'female' },
    likesCount: 142,
    commentsCount: 3,
    reportsCount: 0,
    createdAt: ago(5),
    isSeed: true
  },
  {
    id: 'seed-p3',
    author: A.minh,
    category: 'showcase',
    title: 'Ngũ thân vàng hoàng cúc cho ngày tốt nghiệp',
    content: 'Phối khăn đóng + boots da. Mọi người thấy boots có bị "lệch tông" với ngũ thân không?',
    images: ['images/looks/look_nguthan_trachieu.jpg'],
    tags: ['NguThan', 'TotNghiep'],
    look: { garmentId: 'ao-ngu-than', colorId: 'vang-hoang-cuc', accessoryIds: ['khan-dong', 'boots-da'], styleId: 'elegant', occasionId: 'tot-nghiep', gender: 'male' },
    likesCount: 98,
    commentsCount: 2,
    reportsCount: 0,
    createdAt: ago(9),
    isSeed: true
  },
  {
    id: 'seed-p4',
    author: A.thao,
    category: 'culture',
    title: 'Vì sao áo giao lĩnh phải "vạt phải đè vạt trái"?',
    content:
      'Quy tắc **hữu nhậm** (vạt phải phủ lên vạt trái) xuất hiện trong hầu hết tư liệu tranh tượng thời Lý – Trần – Lê. Mặc ngược (tả nhậm) theo phong tục là cách khâm liệm người đã khuất.\n\nTham khảo: Trần Quang Đức, *Ngàn năm áo mũ* (2013).\n\nMẹo nhớ: nhìn vào gương, vạt áo ngoài cùng chạy từ vai **phải** của bạn xuống hông trái.',
    images: ['images/community/look_giaolinh_huunham.jpg'],
    tags: ['GiaoLinh', 'KienThuc'],
    look: { garmentId: 'ao-giao-linh', colorId: 'trang-lua-nga', accessoryIds: ['tram-cai-toc'], styleId: 'traditional' },
    likesCount: 211,
    commentsCount: 1,
    reportsCount: 0,
    createdAt: ago(30),
    isSeed: true
  },
  {
    id: 'seed-p5',
    author: A.nam,
    category: 'qa',
    title: 'Chụp ảnh cưới với áo tấc: chú rể nên chọn màu gì?',
    content: 'Cô dâu mặc áo dài cưới đỏ son. Mình phân vân giữa áo tấc xanh chàm và đỏ son đồng bộ. Nhờ mọi người góp ý!',
    images: ['images/community/look_aotac_cuoihoi.jpg', 'images/community/look_aodaicuoi_songhy.jpg'],
    tags: ['AoTac', 'CuoiHoi', 'HoiDap'],
    look: { garmentId: 'ao-tac', colorId: 'xanh-cham', accessoryIds: ['khan-dong'], styleId: 'traditional', occasionId: 'cuoi-hoi', gender: 'male' },
    likesCount: 34,
    commentsCount: 2,
    reportsCount: 0,
    createdAt: ago(3),
    isSeed: true
  },
  {
    id: 'seed-p6',
    author: A.thao,
    category: 'showcase',
    title: 'Mớ ba mớ bảy đi hội Lim',
    content: 'Lần đầu thử mặc 3 lớp cổ áo, lưng bao xanh và nón quai thao. Đúng là phải tập cả buổi mới chỉnh được các lớp cổ lộ đều!',
    images: ['images/community/look_moba_hoilim.jpg'],
    tags: ['QuanHo', 'HoiLim', 'MoBaMoBay'],
    look: { garmentId: 'ao-mo-ba', colorId: 'nau-gu', accessoryIds: ['non-quai-thao'], styleId: 'traditional', occasionId: 'le-hoi', gender: 'female' },
    likesCount: 76,
    commentsCount: 0,
    reportsCount: 0,
    createdAt: ago(48),
    isSeed: true
  },
  {
    id: 'seed-p7',
    author: A.linh,
    category: 'culture',
    title: 'Áo cóm Thái: hàng khuy bạc hình bướm có ý nghĩa gì?',
    content:
      'Hàng khuy bạc trên áo cóm của phụ nữ Thái thường mang hình bướm, ve sầu, nhện — những hình ảnh gắn với thiên nhiên và sự sinh sôi.\n\nNếu remix áo cóm, nhớ **ghi nguồn gốc dân tộc Thái** và ưu tiên mua thổ cẩm từ hợp tác xã bản địa nha.',
    images: ['images/community/look_comthai_taybac.jpg'],
    tags: ['AoComThai', 'DanTocThai', 'KienThuc'],
    look: { garmentId: 'ao-com-thai', colorId: 'hong-canh-sen', accessoryIds: [], styleId: 'traditional' },
    likesCount: 58,
    commentsCount: 0,
    reportsCount: 0,
    createdAt: ago(70),
    isSeed: true
  },
  {
    id: 'seed-p8',
    author: A.minh,
    category: 'showcase',
    title: 'Viên lĩnh lục bảo bổ tử hoa sen — kỷ yếu lớp 12',
    content: 'Cả lớp đặt may viên lĩnh, thay bổ tử chim hạc bằng hoa sen để không "giả" phẩm hàm. Kết quả rất ưng!',
    images: ['images/community/look_vienlinh_kyyeu.jpg'],
    tags: ['VienLinh', 'KyYeu', 'TotNghiep'],
    look: { garmentId: 'ao-vien-linh', colorId: 'xanh-ngoc-luc', accessoryIds: [], styleId: 'elegant', occasionId: 'tot-nghiep', gender: 'male' },
    likesCount: 120,
    commentsCount: 0,
    reportsCount: 0,
    createdAt: ago(26),
    isSeed: true
  }
];

export const SEED_COMMENTS: CommunityComment[] = [
  { id: 'seed-c1', postId: 'seed-p1', parentId: null, author: A.minh, content: 'Hóng quá! Có giới hạn số bài mỗi người không ad?', likesCount: 4, createdAt: ago(18) },
  { id: 'seed-c2', postId: 'seed-p1', parentId: 'seed-c1', author: A.admin, content: 'Không giới hạn nhé, nhưng mỗi bài nên là một bản phối khác nhau.', likesCount: 6, createdAt: ago(17) },
  { id: 'seed-c3', postId: 'seed-p2', parentId: null, author: A.thao, content: 'Đỏ son với sneaker trắng sạch sẽ ghê! Kiềng bạc là điểm nhấn xịn.', likesCount: 9, createdAt: ago(4) },
  { id: 'seed-c4', postId: 'seed-p2', parentId: null, author: A.nam, content: 'Đi lễ chùa thì nhớ thay guốc mộc nha bạn, còn chúc Tết thì quá ổn.', likesCount: 12, createdAt: ago(4) },
  { id: 'seed-c5', postId: 'seed-p2', parentId: 'seed-c4', author: A.linh, content: 'Chuẩn luôn, mình có mang guốc theo để vào chùa 😄', likesCount: 3, createdAt: ago(3) },
  { id: 'seed-c6', postId: 'seed-p3', parentId: null, author: A.linh, content: 'Boots da nâu sẽ hợp hơn boots đen vì gần tông vàng hoàng cúc.', likesCount: 7, createdAt: ago(8) },
  { id: 'seed-c7', postId: 'seed-p3', parentId: 'seed-c6', author: A.minh, content: 'Ý hay, để mình thử lại!', likesCount: 1, createdAt: ago(7) },
  { id: 'seed-c8', postId: 'seed-p4', parentId: null, author: A.nam, content: 'Bài rất hữu ích, nhiều bạn chụp ảnh vẫn mặc ngược mà không biết.', likesCount: 15, createdAt: ago(28) },
  { id: 'seed-c9', postId: 'seed-p5', parentId: null, author: A.thao, content: 'Xanh chàm sẽ làm nổi bật cô dâu đỏ son, lại trang nghiêm khi lễ gia tiên.', likesCount: 5, createdAt: ago(2) },
  { id: 'seed-c10', postId: 'seed-p5', parentId: null, author: A.linh, content: 'Đồng bộ đỏ son cũng đẹp nhưng ảnh dễ bị "chìm" vào nhau á.', likesCount: 2, createdAt: ago(1) }
];
