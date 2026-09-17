import { Garment } from '../types/outfit';

export const GARMENTS: Garment[] = [
  {
    id: 'ao-dai',
    name: 'Áo Dài',
    subtitle: 'Biểu tượng quốc hồn quốc túy tôn vinh đường nét thanh thoát',
    description: 'Trang phục truyền thống phổ biến nhất của Việt Nam, với cấu trúc hai tà áo trước sau buông dài thướt tha, mặc cùng quần lụa suông rộng.',
    era: 'Thế kỷ 18 đến nay (Phát triển qua các thời kỳ Lemur, Lê Phổ)',
    region: 'Toàn quốc',
    culturalNote: 'Áo dài mang ý nghĩa về vẻ đẹp thanh lịch, kín đáo nhưng uyển chuyển tự nhiên. Tà áo dài là sự kế thừa trực tiếp từ áo ngũ thân, được tinh giản để tạo nên dáng vóc đương đại.',
    keyFeatures: [
      'Cổ áo đứng (cổ trụ hoặc cổ tròn cách điệu)',
      'Hai tà áo xẻ sâu từ eo xuống gót chân',
      'Phom áo ôm nhẹ tôn dáng tự nhiên',
      'Mặc kèm quần lụa suông dài ống rộng'
    ],
    modernRemixTips: [
      'Mix cùng sneaker trắng đế chunky hoặc bốt da cổ thấp',
      'Chọn chất liệu lanh thô, taffeta hoặc gấm dệt hiện đại',
      'Tà áo cắt ngắn ngang bắp chân (midi) để năng động di chuyển',
      'Phối cùng túi tote canvas in đồ họa typographic chữ Nôm / Quốc ngữ'
    ],
    silhouette: 'flowing',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    defaultColorId: 'do-son',
    historyDetails: {
      origin: 'Kế thừa từ áo ngũ thân lập lĩnh thời chúa Nguyễn Phúc Khoát (1744) và phong trào cách tân mỹ thuật Đông Dương thập niên 1930.',
      significance: 'Đại diện cho bản sắc văn hóa Việt Nam trên trường quốc tế, gắn liền với hình ảnh người phụ nữ và giới trí thức trẻ.',
      collarType: 'Cổ đứng lập lĩnh cao 2.5 - 4cm, cài khuy bấm bên mép nách hữu.',
      flapStructure: 'Thân áo gồm 2 tà lớn trước và sau, xẻ tà ngang eo tạo cảm giác uyển chuyển khi bước đi.'
    }
  },
  {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân',
    subtitle: 'Hồn cốt văn hóa Kinh Bắc mộc mạc và phóng khoáng',
    description: 'Trang phục truyền thống phụ nữ Bắc Bộ, gồm 4 thân áo (2 thân sau may liền sống lưng, 2 thân trước để buông hoặc thắt vạt duyên dáng).',
    era: 'Thế kỷ 12 - đầu thế kỷ 20',
    region: 'Bắc Bộ',
    culturalNote: 'Bốn tà áo tượng trưng cho tứ thân phụ mẫu (cha mẹ chồng và cha mẹ đẻ). Vạt áo buộc trước bụng thể hiện tình nghĩa vợ chồng son sắt, đùm bọc yêu thương.',
    keyFeatures: [
      'Bốn thân áo riêng biệt, hai vạt trước buộc nút mềm mại',
      'Mặc cùng yếm hoa đào hoặc yếm nâu bên trong',
      'Thắt lưng dải lụa xanh hoặc hồng xao xuyến',
      'Thường đi cùng nón quai thao và khăn mỏ quạ'
    ],
    modernRemixTips: [
      'Thả buông hai tà trước như một chiếc duster jacket thời thượng',
      'Phối áo yếm hiện đại bên trong với quần cạp cao ống đứng',
      'Biến tấu dải thắt lưng thành thắt lưng utility belt cá tính',
      'Kết hợp cùng chunky boots hoặc guốc sơn mài đế cao'
    ],
    silhouette: 'layered',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    defaultColorId: 'xanh-cham',
    historyDetails: {
      origin: 'Trang phục phổ biến của người dân lao động và các liền chị vùng Kinh Bắc từ thời nhà Lý, Trần đến đầu thế kỷ 20.',
      significance: 'Tượng trưng cho sự tần tảo, duyên dáng và gắn kết gia đình truyền thống làng quê Việt.',
      collarType: 'Áo không có cổ cao, cổ khoét vát để lộ bờ yếm yểu điệu bên trong.',
      flapStructure: 'Hai vạt sau may khâu kín, hai vạt trước tách rời để buộc nơ hoặc buông thõng khi hội hè.'
    }
  },
  {
    id: 'ao-ngu-than',
    name: 'Áo Ngũ Thân',
    subtitle: 'Nguồn gốc đích thực của Áo Dài với triết lý Ngũ thường',
    description: 'Trang phục được định hình vào thời Chúa Nguyễn Phúc Khoát và Vua Minh Mạng, gồm 5 thân áo ghép lại với hàng khuy cài kín đáo bên phải.',
    era: 'Thế kỷ 18 đến đầu thế kỷ 20 (Đặc biệt thời nhà Nguyễn)',
    region: 'Toàn quốc',
    culturalNote: 'Năm thân áo tượng trưng cho Ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín) và bốn thân ngoài che chở cho thân thứ năm bên trong, thể hiện đạo làm người khiêm nhường.',
    keyFeatures: [
      'Năm thân vải (4 vạt ngoài ghép 2 trước 2 sau, 1 thân con bên trong ngực)',
      'Cổ đứng vuông góc, ôm khít cổ đĩnh đạc',
      'Năm chiếc cúc (thường bằng đồng, ngọc hoặc gỗ quý)',
      'Phom áo suông thụng (tay chẽn năng động hoặc tay thụng trang trọng)'
    ],
    modernRemixTips: [
      'Áo ngũ thân tay chẽn phối cùng quần tây relaxed fit hoặc quần jeans raw',
      'Mặc khoác ngoài áo thun basic cổ tròn tạo layer street style thú vị',
      'Đi cùng sneaker retro (như Samba, Gazelle) hoặc loafer da',
      'Sử dụng phụ kiện kính râm đen gọng dày và vòng bạc xích bản nhỏ'
    ],
    silhouette: 'structured',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    defaultColorId: 'vang-hoang-cuc',
    historyDetails: {
      origin: 'Năm 1744, Chúa Nguyễn Phúc Khoát ban hành cải cách trang phục Đàng Trong, sau đó vua Minh Mạng chuẩn hóa thành quốc phục toàn cõi.',
      significance: 'Chuẩn mực văn hóa nam giới và nữ giới thời Nguyễn, đề cao phong thái đĩnh đạc, mực thước.',
      collarType: 'Lập lĩnh (cổ đứng) may thẳng đứng, khép kín tôn dáng đầu và cổ.',
      flapStructure: 'Gồm vạt tả, vạt hữu, sống áo phía sau và vạt con (thân thứ 5) bảo hộ lồng ngực.'
    }
  },
  {
    id: 'nhat-binh',
    name: 'Áo Nhật Bình',
    subtitle: 'Tuyệt tác hoàng cung triều Nguyễn với họa tiết đối khâm lộng lẫy',
    description: 'Áo thường phục của bậc Hoàng hậu, Hoàng quý phi, Công chúa thời nhà Nguyễn; đặc trưng bởi cổ áo hình chữ nhật to bản trước ngực.',
    era: 'Thời nhà Nguyễn (1802 - 1945)',
    region: 'Trung Bộ',
    culturalNote: 'Cổ áo hình chữ nhật nằm ngang trên ngực gọi là Nhật Bình. Dải viền cổ áo và hai tay áo được thêu ngũ sắc tượng trưng cho ngũ hành tương sinh, toát lên khí chất quyền quý.',
    keyFeatures: [
      'Cổ áo viền chữ nhật đối xứng (đối khâm) cài cúc ngọc trước ngực',
      'Dải hoa văn thêu tinh xảo ở cổ áo và hai bên nẹp',
      'Tay áo có dải ngũ sắc (xanh, đỏ, trắng, vàng, lục)',
      'Dáng áo thụng rộng, tay áo buông xòe quý phái'
    ],
    modernRemixTips: [
      'Mặc như một chiếc áo khoác Kimono / Haori sang trọng khi đi sự kiện gala',
      'Tiết chế màu phụ, chọn tông đơn sắc (monochrome) để làm nổi bật dải cổ áo',
      'Phối cùng trang sức tối giản như hoa tai ngọc trai đơn hoặc kiềng mảnh',
      'Tránh phối đồ quá hầm hố phá vỡ tính lễ nghi tôn nghiêm của trang phục'
    ],
    silhouette: 'regal',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    defaultColorId: 'do-son',
    historyDetails: {
      origin: 'Chế độ triều phục và thường phục hoàng tộc triều Nguyễn, phân định cấp bậc qua màu sắc (Hoàng hậu dùng vàng, Công chúa dùng đỏ, phi tần dùng lam/tím).',
      significance: 'Đỉnh cao của nghệ thuật thêu tay cung đình Huế và biểu tượng quyền lực quý phái của phụ nữ hoàng gia.',
      collarType: 'Đối khâm bản lớn hình chữ nhật kéo dài từ vai xuống giữa ngực cài dây xà tích hoặc cúc ngọc.',
      flapStructure: 'Thân áo xẻ tà hai bên hông, tay áo dài thụng phủ qua bàn tay.'
    }
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba',
    subtitle: 'Nét duyên miền sông nước mộc mạc, tự do và phóng khoáng',
    description: 'Trang phục bình dị gắn liền với người dân Nam Bộ, thân áo ngắn xẻ hai bên hông, cổ tròn hoặc cổ tim thoáng đãng.',
    era: 'Thế kỷ 19 đến nay',
    region: 'Nam Bộ',
    culturalNote: 'Áo bà ba phản ánh tính cách hào sảng, chân chất và tự do của con người đồng bằng sông Cửu Long. Dù giản dị, tà áo vẫn tôn lên đường cong tự nhiên và sự năng động.',
    keyFeatures: [
      'Thân áo ngắn ngang mông, xẻ hai bên hông nhẹ nhàng',
      'Hai túi vuông phía trước vạt áo tiện dụng',
      'Hàng cúc cài thẳng tắp chính giữa ngực',
      'Cổ tròn không chân hoặc cổ tim mềm mại'
    ],
    modernRemixTips: [
      'Phối cùng quần shorts cạp cao hoặc chân váy xếp ly hiện đại',
      'Dùng chất liệu lụa satin bóng hoặc linen dệt mộc thời thượng',
      'Layer với áo hai dây ren bên trong, mở 2-3 cúc trên tạo vẻ phóng khoáng',
      'Đi cùng dép cói, sandal quai mảnh hoặc sneaker năng động'
    ],
    silhouette: 'casual',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    defaultColorId: 'den-tuyen',
    historyDetails: {
      origin: 'Xuất hiện vào thế kỷ 19 ở Nam Bộ, có thể chịu ảnh hưởng từ giao lưu thương mại văn hóa Mã Lai - Nam Đảo nhưng đã được Việt hóa triệt để.',
      significance: 'Biểu tượng của tinh thần quật khởi và nét đẹp bình dị của người dân miền Tây sông nước.',
      collarType: 'Cổ tròn khoét nông hoặc cổ thìa thoang thoảng, không dựng cổ, mặc thoáng mát phù hợp khí hậu nhiệt đới.',
      flapStructure: 'Thân trước chia hai vạt cài cúc chính giữa, xẻ hông khoảng 10-15cm giúp cử động thoải mái.'
    }
  }
];
