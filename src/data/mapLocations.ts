export interface LandmarkScenicPhoto {
  id: string;
  url: string;
  title: string;
  spotName: string;
  caption: string;
  suitableAttire?: string;
}

export interface MapLocation {
  id: string;
  name: string;
  region: 'Bắc Bộ' | 'Trung Bộ' | 'Nam Bộ' | 'Toàn quốc';
  provinceTitle: string;
  subtitle: string;
  coordinates: { x: number; y: number };
  geoCoords: string;
  kmPost: string;
  tag: string;
  signatureFabric: string;
  iconType: 'landmark' | 'mountain' | 'crown' | 'sparkles' | 'flame' | 'building' | 'compass';
  primaryLookId?: string;
  coverImage: string;
  isComingSoon?: boolean;
  scenicPhotos: LandmarkScenicPhoto[];
}

export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'loc-hanoi',
    name: 'Hà Nội',
    region: 'Bắc Bộ',
    provinceTitle: 'Kinh Đô Thăng Long',
    subtitle: 'Nét thanh lịch Tràng An trên tà áo Tứ thân Kinh Bắc hòa cùng nón quai thao duyên dáng bên hồ Gươm ngàn năm.',
    coordinates: { x: 491, y: 198 },
    geoCoords: "21°02'N, 105°51'E",
    kmPost: 'Km 00',
    tag: 'Kinh Đô Ngàn Năm',
    signatureFabric: 'Lụa Vạn Phúc, nón quai thao thêu tay',
    iconType: 'landmark',
    primaryLookId: 'look-hanoi-indochine',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Doan_Mon_Gate_1.jpg/1280px-Doan_Mon_Gate_1.jpg',
    scenicPhotos: [
      {
        id: 'hn-1',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Doan_Mon_Gate_1.jpg/1280px-Doan_Mon_Gate_1.jpg',
        title: 'Bậc Thềm Rồng Son & Tường Thành Ngàn Năm',
        spotName: 'Đoan Môn — Hoàng Thành Thăng Long',
        caption: 'Thánh địa cổ phục số 1 miền Bắc: bậc thềm rồng đá và tường gạch cổ kính tôn vinh uy nghiêm triều đình Đại Việt.',
        suitableAttire: 'Áo Giao Lĩnh, Áo Viên Lĩnh (Lý - Trần - Lê), Áo Tấc quý tộc'
      },
      {
        id: 'hn-2',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Khu%C3%AA_v%C4%83n_c%C3%A1c.jpg/1280px-Khu%C3%AA_v%C4%83n_c%C3%A1c.jpg',
        title: 'Biểu Tượng Nho Học & Trí Tuệ Văn Hiến',
        spotName: 'Khuê Văn Các — Văn Miếu Quốc Tử Giám',
        caption: 'Không gian tường son lầu gỗ tao nhã giữa vườn cây cổ thụ, bối cảnh kinh điển cho các sĩ tử thời xưa.',
        suitableAttire: 'Áo Tấc ngũ thân, Áo Dài thụng, Áo Đối Khâm nho sinh'
      },
      {
        id: 'hn-3',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/CongLangDuongLam.jpg/1280px-CongLangDuongLam.jpg',
        title: 'Hồn Xưa Bắc Bộ Dưới Tán Gốc Đa Cổ Thụ',
        spotName: 'Cổng Làng Mông Phụ — Làng Cổ Đường Lâm',
        caption: 'Cổng làng đá ong trăm tuổi, đường lát gạch nghiêng và giếng nước sân đình đậm chất đồng bằng Bắc Bộ.',
        suitableAttire: 'Áo Tứ Thân, Yếm Đào, Áo Giao Lĩnh dân gian, Nón Quai Thao'
      },
      {
        id: 'hn-4',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Thap_Rua_%28Tottoise%29_Tower%2C_Hoan_Kiem_Lake%2C_Hanoi_%282%29_%2838465802112%29.jpg/1280px-Thap_Rua_%28Tottoise%29_Tower%2C_Hoan_Kiem_Lake%2C_Hanoi_%282%29_%2838465802112%29.jpg',
        title: 'Trái Tim Thăng Long Soi Bóng Lục Thủy',
        spotName: 'Tháp Rùa — Hồ Hoàn Kiếm & Cầu Thê Húc',
        caption: 'Cầu Thê Húc son đỏ dẫn lối Đền Ngọc Sơn và tháp rêu phong giữa hồ, điểm chụp áo dài thanh lịch ngàn đời.',
        suitableAttire: 'Áo Dài truyền thống ngũ thân, Áo Dài lụa Hà Đông'
      }
    ]
  },
  {
    id: 'loc-ninhbinh',
    name: 'Ninh Bình',
    region: 'Bắc Bộ',
    provinceTitle: 'Cố Đô Hoa Lư',
    subtitle: 'Hào khí non sông đất cố đô ngưng tụ trên nếp áo đối khâm vương triều Đinh — Lê giữa trập trùng đá dựng kỳ vĩ.',
    coordinates: { x: 504, y: 247 },
    geoCoords: "20°15'N, 105°58'E",
    kmPost: 'Km 93',
    tag: 'Cố Đô Đệ Nhất',
    signatureFabric: 'Gấm chạm rồng phượng, tơ thô dệt mộc',
    iconType: 'mountain',
    primaryLookId: 'look-ninhbinh-king',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Bich_Dong_Pagoda%2C_Ninh_Binh%2C_Vietnam%2C_20240203_1132_5634.jpg/1280px-Bich_Dong_Pagoda%2C_Ninh_Binh%2C_Vietnam%2C_20240203_1132_5634.jpg',
    scenicPhotos: [
      {
        id: 'nb-1',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Bich_Dong_Pagoda%2C_Ninh_Binh%2C_Vietnam%2C_20240203_1132_5634.jpg/1280px-Bich_Dong_Pagoda%2C_Ninh_Binh%2C_Vietnam%2C_20240203_1132_5634.jpg',
        title: 'Cầu Đá Bắt Nhịp Cửa Động Sen Thơm',
        spotName: 'Cầu Đá & Tam Quan Chùa Bích Động',
        caption: 'Được mệnh danh "Nam thiên đệ nhị động", chiếc cầu đá cong bắc qua hồ sen rêu phong là góc check-in Việt phục kinh điển nhất Ninh Bình.',
        suitableAttire: 'Áo Tấc, Nhật Bình, Áo Giao Lĩnh cổ phong bay bổng'
      },
      {
        id: 'nb-2',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Ninh_Binh_-_NinhBinh1659.jpg/1280px-Ninh_Binh_-_NinhBinh1659.jpg',
        title: 'Dấu Ấn Vương Triều Đại Cồ Việt',
        spotName: 'Cố Đô Hoa Lư — Đền Vua Đinh Tiên Hoàng',
        caption: 'Bức tường rêu phong và sập đá rồng thế kỷ 17 giữa núi non Mã Yên, bối cảnh trang nghiêm bậc nhất cho cổ phục triều đại.',
        suitableAttire: 'Long Bào, Bào Phục thời Đinh - Tiền Lê - Lý, Áo Viên Lĩnh'
      },
      {
        id: 'nb-3',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Trang_An_Landscape_Complex%2C_Ninh_Binh_Province%2C_Vietnam%2C_20240202_1456_5313.jpg/1280px-Trang_An_Landscape_Complex%2C_Ninh_Binh_Province%2C_Vietnam%2C_20240202_1456_5313.jpg',
        title: 'Lướt Thuyền Nan Giữa Hùng Vĩ Non Sông',
        spotName: 'Thủy Trình Danh Thắng Tràng An',
        caption: 'Thuyền nan trôi nhẹ theo làn nước ngọc bích luồn qua hang động đá vôi nghìn năm, tạo nên những thước ảnh cổ trang thoát tục.',
        suitableAttire: 'Áo Tấc, Nhật Bình, Cổ phục tay thụng phối nón lá lụa'
      },
      {
        id: 'nb-4',
        url: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1600&q=80',
        title: 'Rồng Đá Canh Giữ Vùng Đất Thần Tiên',
        spotName: 'Đỉnh Ngọa Long — Hang Múa',
        caption: 'Góc ngắm toàn cảnh thung lũng Tam Cốc từ trên đỉnh núi đá tai mèo, nơi tạo nên những bức ảnh cổ phục phiêu lãng tựa phim ảnh.',
        suitableAttire: 'Việt phục cách tân đương đại, Áo Choàng Bào gấm'
      }
    ]
  },
  {
    id: 'loc-hue',
    name: 'Cố Đô Huế',
    region: 'Trung Bộ',
    provinceTitle: 'Kinh Đô Cung Đình',
    subtitle: 'Đỉnh cao vương giả với áo Nhật Bình thêu phụng lộng lẫy và áo Tấc trang trọng, đắm chìm trong trầm tích hoàng triều Nguyễn.',
    coordinates: { x: 597, y: 483 },
    geoCoords: "16°28'N, 107°35'E",
    kmPost: 'Km 658',
    tag: 'Di Sản Hoàng Cung',
    signatureFabric: 'Sa, đoạn tiến vua, chỉ tơ dát vàng ngũ sắc',
    iconType: 'crown',
    primaryLookId: 'look-hue-royal',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Hu%E1%BA%BF_%282024%29_-_%C4%90i%E1%BB%87n_Ki%E1%BA%BFn_Trung_-_Kien_Trung_Palace_-_img_01.jpg/1280px-Hu%E1%BA%BF_%282024%29_-_%C4%90i%E1%BB%87n_Ki%E1%BA%BFn_Trung_-_Kien_Trung_Palace_-_img_01.jpg',
    scenicPhotos: [
      {
        id: 'hue-1',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Hu%E1%BA%BF_%282024%29_-_%C4%90i%E1%BB%87n_Ki%E1%BA%BFn_Trung_-_Kien_Trung_Palace_-_img_01.jpg/1280px-Hu%E1%BA%BF_%282024%29_-_%C4%90i%E1%BB%87n_Ki%E1%BA%BFn_Trung_-_Kien_Trung_Palace_-_img_01.jpg',
        title: 'Kiệt Tác Cung Điện Khảm Sứ Vừa Phục Dựng',
        spotName: 'Điện Kiến Trung — Đại Nội Huế',
        caption: 'Cung điện lộng lẫy kết hợp kiến trúc Phục Hưng Pháp và mỹ thuật cung đình triều Nguyễn, nơi vua Khải Định và hoàng đế Bảo Đại từng ngự trị.',
        suitableAttire: 'Áo Nhật Bình hoàng gia, Áo Tấc ngũ thân quý tộc, Hoàng Bào'
      },
      {
        id: 'hue-2',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/An_Dinh_Palace_-_Cung_An_%C4%90%E1%BB%8Bnh_%282024%29_-_front_facade_-_img_02.jpg/1280px-An_Dinh_Palace_-_Cung_An_%C4%90%E1%BB%8Bnh_%282024%29_-_front_facade_-_img_02.jpg',
        title: 'Kiến Trúc Indochine Diễm Lệ Đầu Thế Kỷ 20',
        spotName: 'Cung An Định — Biệt Cung Nam Phương Hoàng Hậu',
        caption: 'Mệnh danh là "viên ngọc tân cổ điển", đây là bối cảnh chụp ảnh kinh điển từng xuất hiện trong MV Không Thể Cùng Nhau Suốt Kiếp.',
        suitableAttire: 'Áo Dài Tân Thời Lemur, Áo Ngũ Thân hoa quý phái, Áo Dài nhung'
      },
      {
        id: 'hue-3',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Ngo_Mon_Gate_for_entry_to_the_Imperial_Citadel%2C_Hue_%2831654316702%29.jpg/1280px-Ngo_Mon_Gate_for_entry_to_the_Imperial_Citadel%2C_Hue_%2831654316702%29.jpg',
        title: 'Cửa Chính Hoàng Cung Soi Bóng Hồ Kim Thủy',
        spotName: 'Ngọ Môn — Hoàng Thành Huế',
        caption: 'Lầu Ngũ Phụng mái ngói hoàng lưu ly và thanh lưu ly uy nghiêm, cửa son thếp vàng biểu tượng quyền lực đế vương.',
        suitableAttire: 'Áo Nhật Bình, Áo Tấc tay thụng, Khăn Vành Dây Triều Nguyễn'
      },
      {
        id: 'hue-4',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg/1280px-Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg',
        title: 'Tháp Phước Duyên Soi Bóng Dòng Hương Giang',
        spotName: 'Chùa Thiên Mụ & Bến Sông Hương',
        caption: 'Ngôi chùa cổ hơn 400 năm tựa lưng đồi Hà Khê soi bóng nước trong vắt, bối cảnh thi ca trầm mặc cho tà áo dài truyền thống.',
        suitableAttire: 'Áo Dài tím Huế, Áo Dài ngũ thân trắng, Nón Bài Thơ xứ Huế'
      }
    ]
  },
  {
    id: 'loc-danang',
    name: 'Đà Nẵng',
    region: 'Trung Bộ',
    provinceTitle: 'Cửa Biển Sơn Trà',
    subtitle: 'Ngã ba hội tụ của văn hóa biển đảo và di sản Chămpa bí ẩn, biến hóa linh hoạt trên chất liệu đũi thô cùng áo Giao Lĩnh cách tân.',
    coordinates: { x: 622, y: 520 },
    geoCoords: "16°04'N, 108°13'E",
    kmPost: 'Km 763',
    tag: 'Cửa Ngõ Miền Trung',
    signatureFabric: 'Lanh nhuộm chàm tự nhiên, thổ cẩm Tây Nguyên',
    iconType: 'sparkles',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Da_Nang_-_%C3%90%E1%BB%99ng_Huy%E1%BB%81n_Kh%C3%B4ng_%282024%29_-_img_05.jpg/1280px-Da_Nang_-_%C3%90%E1%BB%99ng_Huy%E1%BB%81n_Kh%C3%B4ng_%282024%29_-_img_05.jpg',
    scenicPhotos: [
      {
        id: 'dn-1',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Da_Nang_-_%C3%90%E1%BB%99ng_Huy%E1%BB%81n_Kh%C3%B4ng_%282024%29_-_img_05.jpg/1280px-Da_Nang_-_%C3%90%E1%BB%99ng_Huy%E1%BB%81n_Kh%C3%B4ng_%282024%29_-_img_05.jpg',
        title: 'Vòm Đá Giếng Trời Rọi Sáng Cõi Tiên Cảnh',
        spotName: 'Động Huyền Không — Danh Thắng Ngũ Hành Sơn',
        caption: 'Vòm đá lộ thiên đón luồng nắng tự nhiên rọi xuống điện thờ cổ, tạo nên hiệu ứng ánh sáng ma mị thoát tục bậc nhất miền Trung.',
        suitableAttire: 'Áo Giao Lĩnh, Áo Đối Khâm bay tà, Cổ phục thanh khiết'
      },
      {
        id: 'dn-2',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Lady_Buddha_Da_Nang.jpg/1280px-Lady_Buddha_Da_Nang.jpg',
        title: 'Tượng Phật Bà Hướng Biển Đón Gió Non Nước',
        spotName: 'Chùa Linh Ứng — Bán Đảo Sơn Trà',
        caption: 'Lưng tựa núi Sơn Trà hùng vĩ, mặt hướng trọn biển Đông xanh ngắt, góc chụp cổ phục tôn lên vẻ an yên thanh tịnh.',
        suitableAttire: 'Áo Dài ngũ thân trang nhã, Áo Tấc lụa tơ tằm'
      },
      {
        id: 'dn-3',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Golden_Bridge_Da_Nang.jpg/1280px-Golden_Bridge_Da_Nang.jpg',
        title: 'Dải Lụa Vàng Giữa Bàn Tay Khổng Lồ Mây Ngàn',
        spotName: 'Cầu Vàng — Sun World Bà Nà Hills',
        caption: 'Kiệt tác kiến trúc hiện đại vươn giữa mây trời, điểm hẹn ấn tượng cho các bộ sưu tập Việt phục cách tân đương đại (Modern Heritage).',
        suitableAttire: 'Việt phục cách tân dạ hội, Áo Dài Haute Couture'
      },
      {
        id: 'dn-4',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Da_Nang%2C_Vietnam.jpg/1280px-Da_Nang%2C_Vietnam.jpg',
        title: 'Rồng Thời Lý Vươn Mình Cùng Đô Thị Trẻ',
        spotName: 'Cầu Rồng & Dòng Sông Hàn',
        caption: 'Tái hiện hình tượng rồng thời Lý hùng cường uốn lượn qua sông Hàn, kết nối mỹ thuật cổ truyền vào nhịp thở tương lai.',
        suitableAttire: 'Việt phục thời trang đương đại, Áo Dài họa tiết cung đình'
      }
    ]
  },
  {
    id: 'loc-hoian',
    name: 'Hội An',
    region: 'Trung Bộ',
    provinceTitle: 'Thương Cảng Hoài Phố',
    subtitle: 'Sự giao thoa mỹ cảm phương Đông nơi phố cổ rêu phong, tôn vinh phom dáng áo ngũ thân tơ tằm mềm mại.',
    coordinates: { x: 627, y: 535 },
    geoCoords: "15°52'N, 108°19'E",
    kmPost: 'Km 795',
    tag: 'Thương Cảng Di Sản',
    signatureFabric: 'Tơ tằm dệt thủ công, nhuộm thảo mộc tự nhiên',
    iconType: 'flame',
    primaryLookId: 'look-tet-genz',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    scenicPhotos: [
      {
        id: 'ha-1',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
        title: 'Bức Tường Vàng Rêu Phong & Đèn Lồng Rực Sắc',
        spotName: 'Hẻm Vàng & Giàn Hoa Giấy Phố Cổ Hội An',
        caption: 'Màu vàng đất đặc trưng cùng giàn hoa giấy rủ bóng xuống con phố nhỏ, góc chụp ảnh cổ phục ngũ thân tay chẽn được yêu thích nhất.',
        suitableAttire: 'Áo Ngũ Thân tay chẽn, Áo Tấc, Áo Dài cổ đứng hoa văn cổ'
      },
      {
        id: 'ha-2',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/H%E1%BB%99i_An%2C_Ch%C3%B9a_C%E1%BA%A7u%2C_2020-01_CN-03.jpg/1280px-H%E1%BB%99i_An%2C_Ch%C3%B9a_C%E1%BA%A7u%2C_2020-01_CN-03.jpg',
        title: 'Cây Cầu Gỗ Ngói 400 Năm Lịch Sử Giao Thương',
        spotName: 'Chùa Cầu Lai Viễn Kiều',
        caption: 'Biểu tượng thương cảng cổ kính nối nhịp giao lưu văn hóa giữa ba dân tộc Việt - Nhật - Hoa từ thế kỷ 17.',
        suitableAttire: 'Áo Tấc gấm tơ tằm, Áo Đối Khâm thương nhân quý tộc'
      },
      {
        id: 'ha-3',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
        title: 'Hoa Đăng Thắp Sáng Dòng Nước Mộng Mơ',
        spotName: 'Bến Thuyền Sông Hoài Về Đêm',
        caption: 'Ngồi thuyền nan thả đèn hoa đăng lấp lánh trên dòng nước đêm tĩnh lặng, tạo hiệu ứng lung linh huyền ảo với tà áo cổ phục.',
        suitableAttire: 'Áo Tấc lụa mềm, Cổ phục phối quạt xếp và đèn lồng'
      },
      {
        id: 'ha-4',
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
        title: 'Kén Vàng Dệt Nên Tơ Lụa Thượng Uyển',
        spotName: 'Làng Lụa Mã Châu & Nhà Cổ Rêu Phong',
        caption: 'Nơi gìn giữ kỹ thuật ươm tơ dệt lụa trăm năm, cái nôi cung cấp chất liệu cao cấp nhất cho các bộ cổ phục quý phái.',
        suitableAttire: 'Áo Dài tơ tằm dệt tay, Áo Tấc nhuộm thảo mộc tự nhiên'
      }
    ]
  },
  {
    id: 'loc-saigon',
    name: 'Sài Gòn',
    region: 'Nam Bộ',
    provinceTitle: 'Gia Định Viễn Đông',
    subtitle: 'Nhịp đập đô thị bứt phá kết hợp tà áo bà ba lụa đen mực tàu cùng bốt da cao gót, kiến tạo phong cách Avant-Garde.',
    coordinates: { x: 553, y: 824 },
    geoCoords: "10°46'N, 106°40'E",
    kmPost: 'Km 1.730',
    tag: 'Đô Thị Đương Đại',
    signatureFabric: 'Lụa Tân Châu đen tuyền, da thuộc cao cấp',
    iconType: 'building',
    primaryLookId: 'look-saigon-baba',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/C%E1%BB%95ng_ch%C3%ADnh_L%C4%83ng_%C3%94ng_B%C3%A0_Chi%E1%BB%83u.jpg/1280px-C%E1%BB%95ng_ch%C3%ADnh_L%C4%83ng_%C3%94ng_B%C3%A0_Chi%E1%BB%83u.jpg',
    scenicPhotos: [
      {
        id: 'sg-1',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/C%E1%BB%95ng_ch%C3%ADnh_L%C4%83ng_%C3%94ng_B%C3%A0_Chi%E1%BB%83u.jpg/1280px-C%E1%BB%95ng_ch%C3%ADnh_L%C4%83ng_%C3%94ng_B%C3%A0_Chi%E1%BB%83u.jpg',
        title: 'Thánh Địa Chụp Việt Phục Số 1 Tại Sài Gòn',
        spotName: 'Lăng Ông Bà Chiểu (Lăng Tả Quân Lê Văn Duyệt)',
        caption: 'Bức tường gạch đỏ son, mái ngói âm dương chạm lăng và hàng cột gỗ lim cổ kính — nơi 90% bạn trẻ Sài Gòn tìm đến để chụp cổ phục.',
        suitableAttire: 'Áo Tấc, Nhật Bình Triều Nguyễn, Áo Ngũ Thân tay chẽn'
      },
      {
        id: 'sg-2',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Museum_of_Fine_Arts%2C_HCMC.jpg/1280px-Museum_of_Fine_Arts%2C_HCMC.jpg',
        title: 'Kiệt Tác Indochine & Cầu Thang Kính Màu',
        spotName: 'Bảo Tàng Mỹ Thuật TP.HCM (Dinh Thự Chú Hỏa)',
        caption: 'Tòa dinh thự lộng lẫy kết hợp phong cách Baroque Pháp và mỹ thuật Á Đông thế kỷ 20, góc chụp tôn vinh áo dài tân thời quý phái.',
        suitableAttire: 'Áo Dài Lemur Tân Thời, Áo Dài nhung quý tộc, Áo Ngũ Thân lụa'
      },
      {
        id: 'sg-3',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Oficina_Central_de_Correos%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_06.JPG/1280px-Oficina_Central_de_Correos%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_06.JPG',
        title: 'Mái Vòm Kiến Trúc Indochine Diễm Lệ',
        spotName: 'Bưu Điện Trung Tâm Sài Gòn',
        caption: 'Kiệt tác giao hòa Pháp - Việt với trần vòm sắt uốn lượn và bản đồ cổ kính, bối cảnh chụp áo dài phong cách Sài Gòn xưa (Retro Saigon).',
        suitableAttire: 'Áo Dài retro thập niên 60 - 70, Áo Dài tân thời phối găng ren'
      },
      {
        id: 'sg-4',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Saigon_Evening.jpg/1280px-Saigon_Evening.jpg',
        title: 'Bến Cảng Hoa Lệ Soi Bóng Sông Sài Gòn',
        spotName: 'Bến Bạch Đằng & Sông Sài Gòn',
        caption: 'Bến sông hoa lệ soi bóng các tòa tháp chọc trời, bối cảnh chụp các thiết kế áo bà ba lụa tân thời và Việt phục cách tân phá cách.',
        suitableAttire: 'Áo Bà Ba lụa đen Tân Châu, Việt phục Avant-Garde phối bốt da'
      }
    ]
  },
  {
    id: 'loc-mekong',
    name: 'Tây Đô Cần Thơ',
    region: 'Nam Bộ',
    provinceTitle: 'Sông Nước Cửu Long',
    subtitle: 'Nét mộc mạc hào sảng của phù sa châu thổ, khăn rằn đan xen cùng áo bà ba nâu đất và nụ cười phương Nam.',
    coordinates: { x: 487, y: 854 },
    geoCoords: "10°02'N, 105°47'E",
    kmPost: 'Km 1.890',
    tag: 'Trù Phú Phù Sa',
    signatureFabric: 'Vải đũi mộc, khăn rằn dệt tay Nam Bộ',
    iconType: 'compass',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Nh%C3%A0_c%E1%BB%95_B%C3%ACnh_Th%E1%BB%A7y.jpg/1280px-Nh%C3%A0_c%E1%BB%95_B%C3%ACnh_Th%E1%BB%A7y.jpg',
    isComingSoon: true,
    scenicPhotos: [
      {
        id: 'ct-1',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Nh%C3%A0_c%E1%BB%95_B%C3%ACnh_Th%E1%BB%A7y.jpg/1280px-Nh%C3%A0_c%E1%BB%95_B%C3%ACnh_Th%E1%BB%A7y.jpg',
        title: 'Thánh Địa Cổ Phục Nam Bộ — Bối Cảnh Phim Người Tình',
        spotName: 'Nhà Cổ Bình Thủy (Dinh Thự Họ Dương Cần Thơ)',
        caption: 'Ngôi nhà cổ 5 gian 2 mái hơn 150 năm tuổi giao thoa kiến trúc Pháp - Hoa - Việt lộng lẫy, thánh địa chụp Áo Dài xưa và cổ phục hoàng gia Nam Kỳ.',
        suitableAttire: 'Áo Dài Nam Bộ ngũ thân, Áo Tấc tơ tằm, Áo Bà Ba lụa quý bà'
      },
      {
        id: 'ct-2',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Ch%C3%B9a_%C3%94ng_C%E1%BA%A7n_Th%C6%A1.jpg/1280px-Ch%C3%B9a_%C3%94ng_C%E1%BA%A7n_Th%C6%A1.jpg',
        title: 'Sắc Đỏ Rực Rỡ & Nhang Vòng Trầm Mặc Phương Nam',
        spotName: 'Chùa Ông Cần Thơ (Quảng Triệu Hội Quán)',
        caption: 'Hội quán cổ kính trên 120 năm tuổi với mái ngói lưu ly, hoành phi câu đối chạm vàng và lồng đèn rực rỡ, bối cảnh chụp cổ phục huyền bí.',
        suitableAttire: 'Áo Tấc đỏ/vàng, Áo Ngũ Thân hoa văn gấm, Quạt trầm hương'
      },
      {
        id: 'ct-3',
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Can_Tho%2C_Vietnam%2C_Floating_Market%2C_Boats.jpg/1280px-Can_Tho%2C_Vietnam%2C_Floating_Market%2C_Boats.jpg',
        title: 'Hồn Sông Nước & Tiếng Mái Chèo Ghe Đò Nam Bộ',
        spotName: 'Chợ Nổi Cái Răng Trên Dòng Sông Hậu',
        caption: 'Cây bẹo treo nông sản và hàng trăm ghe đò rộn rã lúc bình minh, góc chụp tôn vinh trang phục áo bà ba mộc mạc của người phương Nam.',
        suitableAttire: 'Áo Bà Ba đũi / lụa, Khăn rằn Nam Bộ, Nón lá chèo xuồng'
      },
      {
        id: 'ct-4',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
        title: 'Cần Thơ Gạo Trắng Nước Trong',
        spotName: 'Bến Ninh Kiều & Miệt Vườn Cần Thơ',
        caption: 'Bến sông thơ mộng nhìn ra ngã ba sông Hậu hòa cùng những vườn cây trĩu quả, bối cảnh duyên dáng cho nét đẹp thiếu nữ sông nước.',
        suitableAttire: 'Áo Dài trắng nữ sinh Nam Bộ, Áo Bà Ba hoa nhí miệt vườn'
      }
    ]
  }
];

// Fallback scenic collections for macro-regions when hovering general provinces
export const REGIONAL_FALLBACK_PHOTOS: Record<string, LandmarkScenicPhoto[]> = {
  'Bắc Bộ': [
    {
      id: 'reg-bb-1',
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Doan_Mon_Gate_1.jpg/1280px-Doan_Mon_Gate_1.jpg',
      title: 'Hoàng Thành Thăng Long & Cố Đô Ngàn Năm',
      spotName: 'Vùng Đất Bắc Bộ Văn Hiến',
      caption: 'Cái nôi văn minh sông Hồng với những di sản kiến trúc rêu phong nghìn năm lịch sử.',
      suitableAttire: 'Áo Giao Lĩnh, Áo Tứ Thân, Áo Tấc quý tộc'
    }
  ],
  'Trung Bộ': [
    {
      id: 'reg-tb-1',
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Hu%E1%BA%BF_%282024%29_-_%C4%90i%E1%BB%87n_Ki%E1%BA%BFn_Trung_-_Kien_Trung_Palace_-_img_01.jpg/1280px-Hu%E1%BA%BF_%282024%29_-_%C4%90i%E1%BB%87n_Ki%E1%BA%BFn_Trung_-_Kien_Trung_Palace_-_img_01.jpg',
      title: 'Điện Kiến Trung & Cung Đình Huế Vàng Son',
      spotName: 'Miền Trung Di Sản Hoàng Triều',
      caption: 'Dải đất hội tụ cung đình vàng son triều Nguyễn và thương cảng rêu phong Hội An.',
      suitableAttire: 'Áo Nhật Bình hoàng triều, Áo Tấc, Áo Dài ngũ thân'
    }
  ],
  'Nam Bộ': [
    {
      id: 'reg-nb-1',
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/C%E1%BB%95ng_ch%C3%ADnh_L%C4%83ng_%C3%94ng_B%C3%A0_Chi%E1%BB%83u.jpg/1280px-C%E1%BB%95ng_ch%C3%ADnh_L%C4%83ng_%C3%94ng_B%C3%A0_Chi%E1%BB%83u.jpg',
      title: 'Lăng Ông Bà Chiểu & Dinh Thự Phương Nam',
      spotName: 'Phương Nam Trù Phú Hào Sảng',
      caption: 'Vùng đất mở phóng khoáng tràn trề sức sống của sông Tiền, sông Hậu và phố thị Gia Định xưa.',
      suitableAttire: 'Áo Dài Lemur Tân Thời, Áo Bà Ba lụa, Áo Ngũ Thân Nam Bộ'
    }
  ]
};
