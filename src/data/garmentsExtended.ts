import type { Garment } from '../types/outfit';
import type { CuratedPaletteOption } from './colors';
import type { ClothingItemOption } from './modelsTryOn';
import { garmentIllustrationUrl, IllustratedGarmentId } from './garmentIllustrations';

// Bổ sung các dòng Việt phục gắn với phong tục: tế lễ, cưới hỏi, lễ hội và trang phục dân tộc.

export const EXTENDED_GARMENTS: Garment[] = [
  {
    id: 'ao-tac',
    name: 'Áo Tấc',
    subtitle: 'Lễ phục tay thụng trang nghiêm cho tế tự, cưới hỏi và lễ Tết',
    description: 'Áo dài tay rộng (tay thụng) dài quá gối, xẻ hai bên hông, là lễ phục phổ biến của cả nam và nữ thời Nguyễn, thường mặc ngoài áo dài lót cùng khăn vấn hoặc khăn xếp.',
    era: 'Thế kỷ 18 – đầu thế kỷ 20 (thời Chúa Nguyễn đến triều Nguyễn)',
    region: 'Toàn quốc',
    culturalNote: 'Áo tấc là trang phục của những dịp trang trọng nhất trong đời người: lễ gia tiên, cưới hỏi, tế đình, mừng thọ. Tay áo càng rộng thể hiện sự đĩnh đạc, khiêm cung khi vái lạy.',
    keyFeatures: [
      'Tay áo thụng rộng, cửa tay có thể rộng tới 40–60cm',
      'Thân áo dài quá gối, xẻ tà hai bên',
      'Cổ đứng thấp, cài khuy bên nách phải',
      'Thường mặc kèm khăn vấn (nữ) hoặc khăn xếp (nam)'
    ],
    modernRemixTips: [
      'Dùng gấm hoa văn chìm tông trầm để chụp ảnh lễ Tết, du xuân',
      'Mặc áo tấc làm lớp khoác ngoài áo dài trơn cho lễ ăn hỏi',
      'Phối quần ống suông cùng màu và giày vải đế bệt',
      'Với buổi chụp lookbook có thể phối túi xách mây tre đan'
    ],
    silhouette: 'regal',
    image: 'images/viet_phuc/ao_tac.jpg',
    defaultColorId: 'xanh-cham',
    formalityTier: 'scholarly_formal',
    inviolableFeatures: [
      'Giữ tay thụng rộng — không bó tay áo khi mặc trong nghi lễ',
      'Không phối giày thể thao hoặc phụ kiện street khi tham dự tế lễ, lễ gia tiên',
      'Áo dài quá gối, không cắt ngắn thành áo khoác lửng trong dịp thờ cúng'
    ],
    historyDetails: {
      origin: 'Phát triển từ hệ áo dài ngũ thân thời Chúa Nguyễn Phúc Khoát (1744), được định hình làm lễ phục dân gian và quan lại thời Nguyễn.',
      significance: 'Biểu tượng của lễ nghĩa gia đình — người Việt mặc áo tấc khi đứng trước bàn thờ tổ tiên, khi rước dâu và khi tế đình làng.',
      collarType: 'Cổ đứng thấp 2–3cm, cài khuy vải hoặc khuy đồng dọc nách phải.',
      flapStructure: 'Ngũ thân, vạt trước phải đè vạt trái, tay thụng rộng nối thân, xẻ tà hai bên từ hông.'
    }
  },
  {
    id: 'ao-giao-linh',
    name: 'Áo Giao Lĩnh',
    subtitle: 'Cổ chéo vạt phải đè trái — dáng áo cổ xưa nhất của người Việt',
    description: 'Áo cổ giao (hai vạt chéo nhau trước ngực), tay rộng, thắt đai lưng, mặc với váy hoặc quần. Phổ biến từ thời Lý – Trần đến hết thời Lê Trung Hưng.',
    era: 'Thời Lý – Trần – Lê (thế kỷ 11 – 18)',
    region: 'Bắc Bộ',
    culturalNote: 'Quy tắc "hữu nhậm" (vạt phải đè lên vạt trái) là nguyên tắc cốt lõi; mặc ngược "tả nhậm" theo phong tục chỉ dành cho người đã khuất, vì vậy là điều cấm kỵ khi mặc thường ngày.',
    keyFeatures: [
      'Cổ giao chéo hình chữ Y, có viền cổ khác màu',
      'Vạt phải phủ lên vạt trái (hữu nhậm)',
      'Thắt đai lưng vải hoặc dây lụa',
      'Phối với váy đụp/váy xòe hoặc quần ống rộng'
    ],
    modernRemixTips: [
      'Rút ngắn thành áo giao lĩnh lửng mặc cùng quần ống suông đi dạo phố',
      'Viền cổ tương phản (đỏ son/ chàm) giúp ảnh chụp nổi bật',
      'Phối đai lưng bản to bằng vải thô dệt tay',
      'Kết hợp trâm cài gỗ hoặc tóc búi thấp'
    ],
    silhouette: 'layered',
    image: 'images/viet_phuc/ao_giao_linh.jpg',
    defaultColorId: 'trang-lua-nga',
    formalityTier: 'folk_traditional',
    inviolableFeatures: [
      'Bắt buộc vạt phải đè vạt trái (hữu nhậm) — tả nhậm là áo liệm',
      'Giữ đường cổ chéo, không biến thành cổ tim khoét sâu',
      'Có đai lưng hoặc dây buộc cố định vạt áo'
    ],
    historyDetails: {
      origin: 'Xuất hiện trên tượng, phù điêu và tranh thời Lý – Trần; được ghi chép trong các lệnh định phục sức thời Lê sơ.',
      significance: 'Là cội nguồn của nhiều dáng áo về sau; được giới trẻ phục dựng mạnh mẽ trong phong trào cổ phục Việt.',
      collarType: 'Cổ giao (giao lĩnh) chéo trước ngực, viền cổ bản 4–8cm.',
      flapStructure: 'Hai vạt trước chéo nhau, vạt phải ở ngoài, buộc dây bên sườn phải và thắt đai ngang eo.'
    }
  },
  {
    id: 'ao-vien-linh',
    name: 'Áo Viên Lĩnh',
    subtitle: 'Cổ tròn bổ tử — phẩm phục quan lại thời Lê',
    description: 'Áo cổ tròn, tay rộng, thân dài, trước ngực và sau lưng có miếng bổ tử thêu hình. Được dùng làm triều phục, công phục của quan lại triều Lê và lễ phục thời Nguyễn.',
    era: 'Thời Lê sơ – Lê Trung Hưng – Nguyễn (thế kỷ 15 – 19)',
    region: 'Toàn quốc',
    culturalNote: 'Bổ tử là "phù hiệu" phẩm hàm: văn quan thêu chim, võ quan thêu thú. Khi remix hiện đại nên thay bằng hoa văn trang trí (hoa sen, mây) để không giả mạo phẩm trật.',
    keyFeatures: [
      'Cổ tròn ôm sát cổ (viên lĩnh)',
      'Bổ tử vuông thêu trước ngực và sau lưng',
      'Tay áo rộng, dài chấm gót',
      'Đai lưng cứng (đai ngọc / đai sừng) đeo ngang bụng'
    ],
    modernRemixTips: [
      'Chọn bổ tử hoa sen hoặc vân mây thay cho chim/thú phẩm hàm',
      'Phù hợp chụp ảnh kỷ yếu, lễ tốt nghiệp với tông vàng – lục',
      'Đai lưng có thể thay bằng đai da mảnh màu đồng',
      'Phối mũ cánh chuồn chỉ nên dùng trong biểu diễn, sân khấu'
    ],
    silhouette: 'structured',
    image: 'images/viet_phuc/ao_vien_linh.jpg',
    defaultColorId: 'xanh-ngoc-luc',
    formalityTier: 'court_regal',
    inviolableFeatures: [
      'Không tự thêu bổ tử chim/thú phẩm hàm khi không phải phục dựng nghiên cứu',
      'Giữ cổ tròn kín, không khoét cổ',
      'Không dùng tông vàng hoàng bào kèm rồng 5 móng (biểu tượng hoàng đế)'
    ],
    historyDetails: {
      origin: 'Được quy định trong các điển chế triều Lê (Hồng Đức thiện chính thư, Lê triều hội điển) và tiếp tục sử dụng thời Nguyễn.',
      significance: 'Đại diện cho trật tự lễ chế và tinh thần khoa bảng của Nho học Việt Nam.',
      collarType: 'Cổ tròn (viên lĩnh) ôm sát chân cổ, cài khuy bên vai phải.',
      flapStructure: 'Vạt phải đè vạt trái, xẻ hai bên, có "bãi" (vạt phụ) ở hông, tay rộng.'
    }
  },
  {
    id: 'ao-dai-cuoi',
    name: 'Áo Dài Cưới & Khăn Vấn',
    subtitle: 'Hỷ phục cô dâu chú rể trong lễ ăn hỏi, rước dâu, lễ gia tiên',
    description: 'Áo dài lụa/gấm màu hỷ (đỏ, vàng, hồng) thêu chữ Hỷ hoặc long – phụng, khoác ngoài áo choàng the mỏng, đội khăn vấn (cô dâu) hoặc khăn đóng (chú rể).',
    era: 'Đầu thế kỷ 20 – Nay',
    region: 'Toàn quốc',
    culturalNote: 'Trong cưới hỏi truyền thống, màu đỏ – vàng tượng trưng hỷ khí và thịnh vượng. Tránh trang phục toàn trắng hoặc toàn đen vì gắn với tang lễ trong phong tục Việt.',
    keyFeatures: [
      'Áo dài gấm/lụa màu hỷ, có thêu Song Hỷ, long – phụng hoặc hoa mẫu đơn',
      'Áo choàng the mỏng khoác ngoài (áo mấn)',
      'Khăn vấn vòng tròn cho cô dâu, khăn đóng cho chú rể',
      'Quần lụa trắng hoặc cùng tông'
    ],
    modernRemixTips: [
      'Cô dâu Gen Z có thể chọn hồng sen/đỏ son kết hợp áo choàng voan ánh nhũ',
      'Chú rể mặc áo dài the gấm cùng tông với cô dâu cho ảnh cưới đồng điệu',
      'Khăn vấn bản nhỏ giúp gọn gàng khi tiếp khách',
      'Trang sức vàng/ngọc trai thay cho phụ kiện bạc lạnh màu'
    ],
    silhouette: 'flowing',
    image: 'images/viet_phuc/ao_dai_cuoi.jpg',
    defaultColorId: 'do-son',
    formalityTier: 'modern_national',
    inviolableFeatures: [
      'Tránh tông trắng tuyền hoặc đen tuyền toàn thân trong lễ gia tiên, rước dâu',
      'Khăn vấn/khăn đóng đội ngay ngắn khi làm lễ trước bàn thờ',
      'Không phối kính râm, sneaker khi làm lễ gia tiên'
    ],
    historyDetails: {
      origin: 'Kế thừa lễ phục cưới thời Nguyễn (áo nhật bình, áo tấc) rồi giản lược thành áo dài hỷ phục từ thập niên 1930.',
      significance: 'Áo dài cưới là cầu nối giữa nghi lễ gia tiên truyền thống và đám cưới hiện đại, giữ tinh thần "lễ nghĩa trọn vẹn".',
      collarType: 'Cổ đứng 3–4cm, thường có viền kim tuyến.',
      flapStructure: 'Hai tà dài, áo choàng the mặc ngoài xẻ giữa, có thể buộc dây trước ngực.'
    }
  },
  {
    id: 'ao-mo-ba',
    name: 'Áo Mớ Ba Mớ Bảy',
    subtitle: 'Nhiều lớp áo khoe sắc cổ — đỉnh cao làm đẹp của liền chị Quan họ',
    description: 'Người con gái Kinh Bắc mặc chồng ba (mớ ba) hoặc bảy (mớ bảy) lớp áo dài tứ thân nhiều màu, để lộ các lớp cổ áo xếp lớp, thắt lưng bao và đội nón quai thao.',
    era: 'Thế kỷ 17 – đầu thế kỷ 20',
    region: 'Bắc Bộ',
    culturalNote: 'Mặc mớ ba mớ bảy là cách khoe sự khéo léo, sung túc trong ngày hội làng (hội Lim, hội đình). Thứ tự màu cổ áo thường từ nhạt bên trong ra đậm bên ngoài.',
    keyFeatures: [
      'Chồng nhiều lớp áo tứ thân, các lớp cổ áo lộ ra theo hình chữ V',
      'Thắt lưng bao nhiều màu (lưng xanh, lưng hoa đào)',
      'Yếm đào hoặc yếm cổ xây bên trong',
      'Váy đụp đen, nón quai thao, khăn mỏ quạ'
    ],
    modernRemixTips: [
      'Chỉ cần 3 lớp cổ áo khác màu là đủ hiệu ứng mớ ba cho ảnh chân dung',
      'Phối dải lưng bao màu tương phản để tạo điểm nhấn eo',
      'Chụp ở đình làng, hồ sen, phố cổ để khớp bối cảnh',
      'Giữ nón quai thao — món phụ kiện nhận diện của Quan họ'
    ],
    silhouette: 'layered',
    image: 'images/viet_phuc/ao_mo_ba.jpg',
    defaultColorId: 'nau-gu',
    formalityTier: 'folk_traditional',
    inviolableFeatures: [
      'Các lớp cổ áo phải lộ ra theo thứ tự rõ ràng (đặc trưng nhận diện)',
      'Giữ cấu trúc tứ thân, thắt lưng bao — không thay bằng thắt lưng da',
      'Yếm mặc bên trong, không mặc yếm thay áo ra ngoài nơi lễ hội đình chùa'
    ],
    historyDetails: {
      origin: 'Phát triển từ áo tứ thân vùng Kinh Bắc, gắn liền với sinh hoạt Quan họ Bắc Ninh – di sản văn hóa phi vật thể UNESCO (2009).',
      significance: 'Thể hiện vẻ đẹp nền nã, kín đáo mà rực rỡ của phụ nữ Bắc Bộ trong ngày hội.',
      collarType: 'Cổ xẻ chữ V chồng lớp, mỗi lớp lùi vào 1–1,5cm.',
      flapStructure: 'Bốn thân, hai vạt trước buộc thắt hoặc thả, lưng bao thắt ngang bụng.'
    }
  },
  {
    id: 'ao-com-thai',
    name: 'Áo Cóm & Váy Thái',
    subtitle: 'Trang phục thiếu nữ Thái Tây Bắc với hàng khuy bạc hình bướm',
    description: 'Áo cóm ngắn ôm sát người, hàng khuy bạc hình bướm/ve sầu dọc nẹp ngực; váy ống đen dài có cạp và chân váy dệt hoa văn; đội khăn piêu thêu tay.',
    era: 'Truyền thống lâu đời – Nay',
    region: 'Bắc Bộ',
    culturalNote: 'Đây là trang phục của đồng bào dân tộc Thái (Sơn La, Điện Biên, Lai Châu…). Khăn piêu là tín vật tình yêu, do cô gái tự thêu — khi remix cần ghi nhận nguồn gốc và tôn trọng ý nghĩa, không biến thành trang phục hóa trang.',
    keyFeatures: [
      'Áo cóm ngắn trên eo, ôm sát tôn dáng',
      'Hàng khuy bạc hình bướm, ve sầu, nhện dọc nẹp áo',
      'Váy ống đen dài chấm gót, chân váy dệt hoa văn',
      'Khăn piêu thêu tay, thắt lưng xanh lá/ tím'
    ],
    modernRemixTips: [
      'Áo cóm pastel phối váy ống dệt thổ cẩm cho ảnh du lịch Tây Bắc',
      'Có thể mặc áo cóm cùng chân váy midi thổ cẩm khi dạo phố',
      'Mua sản phẩm thổ cẩm trực tiếp từ hợp tác xã bản địa để ủng hộ nghệ nhân',
      'Ghi chú nguồn gốc dân tộc Thái khi đăng ảnh chia sẻ'
    ],
    silhouette: 'structured',
    image: 'images/viet_phuc/ao_com_thai.jpg',
    defaultColorId: 'hong-canh-sen',
    formalityTier: 'folk_traditional',
    inviolableFeatures: [
      'Ghi nhận đây là trang phục của dân tộc Thái, không gán sai dân tộc',
      'Không dùng khăn piêu làm khăn lau, khăn quấn tùy tiện',
      'Không hóa trang/ chế giễu trang phục dân tộc thiểu số'
    ],
    historyDetails: {
      origin: 'Gắn với cộng đồng người Thái ở Tây Bắc; kỹ thuật dệt váy và thêu khăn piêu được truyền qua nhiều thế hệ phụ nữ.',
      significance: 'Thể hiện sự khéo léo, đảm đang và bản sắc tộc người; là một phần của sự đa dạng văn hóa 54 dân tộc Việt Nam.',
      collarType: 'Cổ tròn đứng thấp hoặc cổ chữ V nông.',
      flapStructure: 'Xẻ ngực giữa, cài hàng khuy bạc; áo ngắn đến eo, váy ống quấn cạp.'
    }
  }
];

export const EXTENDED_PALETTES: Record<string, CuratedPaletteOption[]> = {
  'ao-tac': [
    { id: 'xanh-cham', name: 'Chàm Lễ Gia Tiên', primaryColorHex: '#182747', secondaryColorHex: '#F4EFE6', primaryName: 'Áo tấc xanh chàm', secondaryName: 'Áo lót trắng ngà', context: 'Lễ gia tiên, Tế đình', description: 'Tông chàm trầm mặc thể hiện sự thành kính trước tổ tiên.', tag: 'Trang nghiêm' },
    { id: 'do-son', name: 'Đỏ Son Rước Dâu', primaryColorHex: '#9B1D20', secondaryColorHex: '#C59338', primaryName: 'Áo tấc đỏ son', secondaryName: 'Viền vàng hoàng cúc', context: 'Rước dâu, Mừng thọ', description: 'Hỷ sắc đỏ son điểm vàng cho ngày vui trọng đại.', tag: 'Hỷ sự' },
    { id: 'tim-hue', name: 'Tím Huế Mừng Thọ', primaryColorHex: '#6B3074', secondaryColorHex: '#F4EFE6', primaryName: 'Áo tấc tím Huế', secondaryName: 'Áo lót trắng ngà', context: 'Mừng thọ ông bà, Tết', description: 'Sắc tím cố đô tôn vinh sự trường thọ, đức độ.', tag: 'Cố đô' },
    { id: 'den-tuyen', name: 'Hắc Tuyền Khăn Xếp', primaryColorHex: '#1A1C20', secondaryColorHex: '#C59338', primaryName: 'Áo the đen', secondaryName: 'Khuy đồng', context: 'Tế lễ, Hội làng', description: 'Áo the đen kinh điển của các cụ chủ tế đình làng.', tag: 'Cổ điển' }
  ],
  'ao-giao-linh': [
    { id: 'trang-lua-nga', name: 'Bạch Ngọc Viền Son', primaryColorHex: '#F4EFE6', secondaryColorHex: '#9B1D20', primaryName: 'Áo trắng ngà', secondaryName: 'Viền cổ đỏ son', context: 'Chụp ảnh cổ phong, Lễ hội', description: 'Thân trắng ngà viền cổ đỏ son — phối kinh điển thời Trần.', tag: 'Kinh điển' },
    { id: 'xanh-cham', name: 'Chàm Viền Ngà', primaryColorHex: '#182747', secondaryColorHex: '#F4EFE6', primaryName: 'Áo chàm', secondaryName: 'Viền cổ trắng ngà', context: 'Dạo phố, Kỷ yếu', description: 'Tông chàm lạnh, viền ngà thanh nhã cho cả nam và nữ.', tag: 'Thanh lịch' },
    { id: 'nau-gu', name: 'Nâu Gụ Đồng Quê', primaryColorHex: '#5C3A21', secondaryColorHex: '#C59338', primaryName: 'Áo nâu gụ', secondaryName: 'Viền vàng nghệ', context: 'Hội làng, Chụp đồng lúa', description: 'Mộc mạc như sắc đất phù sa đồng bằng Bắc Bộ.', tag: 'Mộc mạc' }
  ],
  'ao-vien-linh': [
    { id: 'xanh-ngoc-luc', name: 'Lục Bảo Khoa Bảng', primaryColorHex: '#1D6246', secondaryColorHex: '#C59338', primaryName: 'Áo lục bảo', secondaryName: 'Bổ tử vàng', context: 'Lễ tốt nghiệp, Vinh danh', description: 'Sắc lục bảo của bậc khoa bảng, bổ tử vàng hoa sen.', tag: 'Khoa bảng' },
    { id: 'do-son', name: 'Đỏ Son Triều Phục', primaryColorHex: '#9B1D20', secondaryColorHex: '#C59338', primaryName: 'Áo đỏ son', secondaryName: 'Bổ tử vàng', context: 'Sân khấu, Lễ hội', description: 'Đỏ son uy nghi theo phong cách triều phục.', tag: 'Uy nghi' },
    { id: 'xanh-cham', name: 'Chàm Văn Nhân', primaryColorHex: '#182747', secondaryColorHex: '#F4EFE6', primaryName: 'Áo chàm', secondaryName: 'Bổ tử ngà', context: 'Văn miếu, Thư pháp', description: 'Tông chàm nho nhã của giới văn nhân.', tag: 'Nho nhã' }
  ],
  'ao-dai-cuoi': [
    { id: 'do-son', name: 'Song Hỷ Đỏ Son', primaryColorHex: '#9B1D20', secondaryColorHex: '#F4EFE6', primaryName: 'Áo dài cưới đỏ son', secondaryName: 'Quần lụa trắng ngà', context: 'Rước dâu, Lễ gia tiên', description: 'Đỏ son thêu song hỷ — lựa chọn may mắn nhất cho ngày cưới.', tag: 'Hỷ sự' },
    { id: 'vang-hoang-cuc', name: 'Hoàng Cúc Phú Quý', primaryColorHex: '#C59338', secondaryColorHex: '#9B1D20', primaryName: 'Áo dài cưới vàng', secondaryName: 'Khăn vấn đỏ', context: 'Lễ ăn hỏi, Lễ cưới', description: 'Vàng hoàng cúc tượng trưng phú quý, phối khăn vấn đỏ.', tag: 'Phú quý' },
    { id: 'hong-canh-sen', name: 'Hồng Sen Ăn Hỏi', primaryColorHex: '#CA4F76', secondaryColorHex: '#F4EFE6', primaryName: 'Áo dài hồng sen', secondaryName: 'Quần trắng ngà', context: 'Lễ dạm ngõ, Ăn hỏi', description: 'Hồng sen ngọt ngào cho cô dâu trẻ trung trong lễ ăn hỏi.', tag: 'Ngọt ngào' }
  ],
  'ao-mo-ba': [
    { id: 'nau-gu', name: 'Nâu Gụ Lưng Xanh', primaryColorHex: '#5C3A21', secondaryColorHex: '#1D6246', primaryName: 'Áo ngoài nâu gụ', secondaryName: 'Lưng bao xanh lục', context: 'Hội Lim, Quan họ', description: 'Bộ kinh điển của liền chị Quan họ: áo nâu gụ, lưng bao xanh.', tag: 'Quan họ' },
    { id: 'xanh-cham', name: 'Chàm Lưng Hoa Đào', primaryColorHex: '#182747', secondaryColorHex: '#CA4F76', primaryName: 'Áo ngoài chàm', secondaryName: 'Lưng bao hoa đào', context: 'Hội xuân, Đình làng', description: 'Chàm đậm phối dải lưng hoa đào duyên dáng.', tag: 'Hội xuân' },
    { id: 'den-tuyen', name: 'The Đen Cổ Ngũ Sắc', primaryColorHex: '#1A1C20', secondaryColorHex: '#C59338', primaryName: 'Áo the đen', secondaryName: 'Lưng bao vàng', context: 'Biểu diễn, Chụp ảnh', description: 'Nền đen làm nổi bật các lớp cổ áo nhiều màu bên trong.', tag: 'Nổi bật' }
  ],
  'ao-com-thai': [
    { id: 'hong-canh-sen', name: 'Hồng Ban Tây Bắc', primaryColorHex: '#CA4F76', secondaryColorHex: '#9B1D20', primaryName: 'Áo cóm hồng', secondaryName: 'Chân váy hoa văn đỏ', context: 'Lễ hội Xòe, Du lịch Tây Bắc', description: 'Sắc hồng tươi như hoa ban nở trên núi rừng Tây Bắc.', tag: 'Tươi tắn' },
    { id: 'xanh-ngoc-luc', name: 'Lục Núi Rừng', primaryColorHex: '#1D6246', secondaryColorHex: '#C59338', primaryName: 'Áo cóm xanh lục', secondaryName: 'Chân váy vàng', context: 'Chợ phiên, Ruộng bậc thang', description: 'Xanh lục mát mắt hòa vào ruộng bậc thang mùa nước đổ.', tag: 'Thiên nhiên' },
    { id: 'trang-lua-nga', name: 'Trắng Khăn Piêu', primaryColorHex: '#F4EFE6', secondaryColorHex: '#9B1D20', primaryName: 'Áo cóm trắng', secondaryName: 'Chân váy đỏ', context: 'Múa xòe, Chụp chân dung', description: 'Áo cóm trắng nổi hàng khuy bạc, chân váy đỏ rực rỡ.', tag: 'Tinh khôi' },
    { id: 'tim-hue', name: 'Tím Sim Đồi', primaryColorHex: '#6B3074', secondaryColorHex: '#C59338', primaryName: 'Áo cóm tím', secondaryName: 'Chân váy vàng', context: 'Dạo bản, Lễ hội', description: 'Tím hoa sim trên đồi, điểm chân váy vàng ấm.', tag: 'Thơ mộng' }
  ]
};

const variantsFor = (id: IllustratedGarmentId): Record<string, string> =>
  Object.fromEntries(
    (EXTENDED_PALETTES[id] || []).map((p) => [p.id, garmentIllustrationUrl(id, p.primaryColorHex, p.secondaryColorHex)])
  );

const item = (
  id: IllustratedGarmentId,
  name: string,
  description: string,
  era: string
): ClothingItemOption => {
  const first = EXTENDED_PALETTES[id][0];
  const thumb = garmentIllustrationUrl(id, first.primaryColorHex, first.secondaryColorHex);
  return {
    id: `clothes-${id}`,
    name,
    garmentType: id,
    colorHex: first.primaryColorHex,
    colorName: first.primaryName,
    thumbnailUrl: thumb,
    colorVariants: variantsFor(id),
    defaultModelLookUrl: {},
    description,
    era
  };
};

export const EXTENDED_CLOTHING_ITEMS: ClothingItemOption[] = [
  item('ao-tac', 'Áo Tấc Lễ Phục Tay Thụng', 'Tay thụng rộng, dài quá gối, mặc trong lễ gia tiên, rước dâu, tế đình.', 'Thế kỷ 18 – 20'),
  item('ao-giao-linh', 'Áo Giao Lĩnh Cổ Chéo', 'Cổ giao vạt phải đè trái, thắt đai lưng — dáng áo cổ xưa thời Lý Trần Lê.', 'Thế kỷ 11 – 18'),
  item('ao-vien-linh', 'Áo Viên Lĩnh Bổ Tử', 'Cổ tròn, bổ tử hoa sen trước ngực, phẩm phục khoa bảng thời Lê.', 'Thế kỷ 15 – 19'),
  item('ao-dai-cuoi', 'Áo Dài Cưới & Khăn Vấn', 'Áo dài hỷ phục thêu song hỷ, áo choàng the và khăn vấn cô dâu.', 'Thế kỷ 20 – Nay'),
  item('ao-mo-ba', 'Áo Mớ Ba Mớ Bảy Quan Họ', 'Nhiều lớp áo tứ thân lộ cổ nhiều màu, lưng bao, nón quai thao.', 'Thế kỷ 17 – 20'),
  item('ao-com-thai', 'Áo Cóm & Váy Thái Tây Bắc', 'Áo cóm khuy bạc hình bướm, váy ống đen chân hoa văn, khăn piêu.', 'Truyền thống – Nay')
];
