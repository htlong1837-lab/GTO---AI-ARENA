import { CulturalAdvice, CulturalStatus } from '../types/outfit';
import { GARMENTS } from '../data/garments';
import { COLORS } from '../data/colors';

export function evaluateCulturalOutfit(
  garmentId: string,
  styleId: string,
  occasionId: string,
  accessoryIds: string[],
  colorId?: string
): CulturalAdvice {
  const garment = GARMENTS.find((g) => g.id === garmentId) || GARMENTS[0];
  const color = COLORS.find((c) => c.id === colorId) || COLORS[0];

  const hasModernSneaker = accessoryIds.includes('sneaker-chunky');
  const hasCyberGlasses = accessoryIds.includes('kinh-mat-y2k');
  const hasBoots = accessoryIds.includes('boots-da');
  const hasBlazer = accessoryIds.includes('blazer-oversize');
  const hasTote = accessoryIds.includes('tote-typography');
  const hasKhanDong = accessoryIds.includes('khan-dong');
  const hasKiengBac = accessoryIds.includes('kieng-bac');
  const hasNonQuaiThao = accessoryIds.includes('non-quai-thao');
  const hasGuocMoc = accessoryIds.includes('guoc-moc');

  // Multi-accessory modern intensity check
  const modernCount = [hasModernSneaker, hasCyberGlasses, hasBoots, hasBlazer, hasTote].filter(Boolean).length;
  const traditionalCount = [hasKhanDong, hasKiengBac, hasNonQuaiThao, hasGuocMoc].filter(Boolean).length;

  // -------------------------------------------------------------
  // NGŨ HÀNH & TRIẾT LÝ MÀU SẮC
  // -------------------------------------------------------------
  let nguHanhNote = `Màu sắc ${color.name} mang năng lượng ${color.elementMeaning}`;
  if (color.element === 'Hỏa' && (occasionId === 'du-xuan-tet' || occasionId === 'dam-cuoi')) {
    nguHanhNote += ' Trong hỷ sự và ngày đầu xuân, sắc Đỏ/Hồng thuộc Hỏa mang lại vượng khí may mắn, xua đuổi điều xui rủi theo quan niệm phương Đông.';
  } else if (color.element === 'Thổ') {
    nguHanhNote += ' Sắc Hoàng Cúc tượng trưng cho thổ nhưỡng trung tâm, sự ổn định phú quý và đĩnh đạc.';
  } else if (color.element === 'Thủy' && occasionId === 'du-xuan-tet') {
    nguHanhNote += ' Sắc Chàm/Đen thuộc Thủy trầm mặc; vào dịp Tết truyền thống nên điểm xuyết phụ kiện ánh kim hoặc hoa văn tươi sáng để tăng sinh khí.';
  }

  // -------------------------------------------------------------
  // CASE 1: CẢNH BÁO SAI LỆCH / ĐẠI KỴ VĂN HÓA (TABOO - Cực kỳ nghiêm trọng)
  // -------------------------------------------------------------

  // Áo Nhật Bình: Phẩm phục hoàng cung bị biến tướng theo phong cách đường phố nổi loạn kết hợp phụ kiện cyber/quá hầm hố
  if (garment.id === 'nhat-binh' && styleId === 'street' && (hasCyberGlasses || hasModernSneaker) && modernCount >= 2) {
    return {
      status: 'taboo',
      heritageScore: 35,
      title: 'Cảnh báo nghiêm trọng: Sai lệch phẩm thức Áo Nhật Bình triều Nguyễn',
      description:
        'Áo Nhật Bình là phẩm phục cao quý của bậc Hoàng thái hậu, Hoàng hậu, Phi tần và Công chúa triều Nguyễn với điển chế thêu hoa văn ngũ hành vô cùng nghiêm cẩn. Việc kết hợp phong cách đường phố nổi loạn (Hypebeast) cùng kính Cyberpunk và giày hầm hố phá vỡ hoàn toàn sự trang nghiêm, tao nhã của lễ phục cung đình.',
      tabooAlert:
        'Quy chế Y quan triều Nguyễn (Đại Nam Thực Lục) nghiêm cấm biến dạng phẩm phục cung đình. Dải đối khâm hình chữ nhật trên ngực là biểu trưng tôn nghiêm, không được phép cắt ngắn, xé rách hay mặc hở hang.',
      traditionalFeatures: [
        'Cổ áo chữ nhật đối xứng (đối khâm) cài cúc ngọc',
        'Dải ngũ sắc tượng trưng Ngũ hành cung đình',
        'Tay thụng quý phái dài che kín cổ tay'
      ],
      modernTwistNotes: [
        'Nếu muốn cách tân, chỉ nên mặc như áo khoác ngoài (Haori/Duster)',
        'Giữ nguyên cấu trúc dải đối khâm trước ngực và vạt áo dài'
      ],
      boundaryGuide: {
        doList: [
          'Giữ nguyên vẹn độ dài tà áo và dải thêu đối khâm nguyên bản',
          'Tiết chế màu sắc bên trong, dùng tông đơn sắc tôn vinh áo chính'
        ],
        dontList: [
          'Không cắt ngắn tà áo hoặc mặc hở ngực làm mất vẻ tôn nghiêm',
          'Không kết hợp phụ kiện đinh tán gồ ghề hay kính cyberpunk quá dị biệt'
        ]
      },
      nguHanhNote,
      sourceCitation: 'Khâm Định Đại Nam Hội Điển Sự Lệ & Ngàn Năm Áo Mũ (Trần Quang Đức)'
    };
  }

  // -------------------------------------------------------------
  // CASE 2: LƯU Ý HOÀN CẢNH & PHỤ KIỆN (CAUTION)
  // -------------------------------------------------------------

  // Áo Nhật Bình mặc ở bối cảnh học đường thường nhật
  if (garment.id === 'nhat-binh' && occasionId === 'di-hoc') {
    return {
      status: 'caution',
      heritageScore: 65,
      title: 'Lưu ý hoàn cảnh: Phẩm phục hoàng cung nơi giảng đường',
      description:
        'Áo Nhật Bình có độ trang trọng tột bậc và tay áo thụng lớn. Trong sinh hoạt học đường thường nhật, dáng áo cồng kềnh có thể gây bất tiện khi viết bài, di chuyển. Nếu bạn tham gia ngày hội văn hóa, thuyết trình lịch sử hoặc diễn kịch thì đây lại là lựa chọn xuất sắc!',
      traditionalFeatures: ['Cổ đối khâm hình chữ nhật trang trọng', 'Tay thụng quý phái'],
      modernTwistNotes: ['Tiết chế phụ kiện rườm rà', 'Nên mặc trong sự kiện văn hóa thay vì lớp học hàng ngày'],
      boundaryGuide: {
        doList: ['Chọn phiên bản chất liệu lụa nhẹ nếu mặc thuyết trình văn hóa', 'Kết hợp giày đế bệt êm ái'],
        dontList: ['Tránh mặc vào giờ học thể dục hoặc các tiết thực hành thí nghiệm']
      },
      nguHanhNote,
      sourceCitation: 'Quy chế Thường phục Nội đình thời Nguyễn'
    };
  }

  // Áo Bà Ba hoặc Tứ Thân trong dạ tiệc ngoại giao / sự kiện sang trọng bậc nhất
  if ((garment.id === 'ao-ba-ba' || garment.id === 'ao-tu-than') && occasionId === 'tiec-toi' && traditionalCount === 0 && !hasBlazer) {
    return {
      status: 'caution',
      heritageScore: 70,
      title: 'Cần nâng tầm chất liệu: Trang phục dân gian nơi dạ tiệc sang trọng',
      description:
        `Chiếc ${garment.name} mang vẻ đẹp mộc mạc của đời sống lao động. Để tỏa sáng trong không gian dạ tiệc sang trọng, hãy nâng cấp chất liệu bằng lụa tơ tằm thượng hạng, gấm dệt bóng hoặc phối thêm trang sức ngọc trai/kiềng bạc để tạo thần thái quý phái.`,
      traditionalFeatures: garment.keyFeatures.slice(0, 2),
      modernTwistNotes: ['Sử dụng chất liệu lụa satin cao cấp', 'Điểm xuyết trang sức ngọc trai thanh lịch'],
      boundaryGuide: {
        doList: ['Chọn tông màu hoàng gia hoặc đơn sắc sang trọng', 'Phối cùng clutch cầm tay hoặc giày gót thanh mảnh'],
        dontList: ['Tránh mặc chất liệu vải thô đũi xơ cứng trong tiệc tối cao cấp']
      },
      nguHanhNote,
      sourceCitation: 'Mỹ thuật Thời trang Ứng dụng Việt Nam'
    };
  }

  // -------------------------------------------------------------
  // CASE 3: GIAO THOA GEN Z HỢP LỆ (INNOVATIVE - Điểm sáng sáng tạo)
  // -------------------------------------------------------------

  // Áo Dài + Sneaker / Phụ kiện Gen Z
  if (garment.id === 'ao-dai' && (hasModernSneaker || hasTote || styleId === 'modern-genz')) {
    return {
      status: 'innovative',
      heritageScore: 88,
      title: 'Cảm hứng Gen Z: Năng động du xuân & Dạo phố',
      description:
        'Sự kết hợp giữa tà áo dài thanh thoát và đôi sneaker năng động là trào lưu cực kỳ thịnh hành trong giới trẻ Việt Nam mỗi dịp Tết. Bản phối này giữ trọn nét duyên của tà áo đồng thời giúp bạn tự do sải bước mà không lo đau mỏi chân, thể hiện một thế hệ trẻ vừa yêu di sản vừa tràn đầy năng lượng.',
      traditionalFeatures: [
        'Cổ áo lập lĩnh / cổ thìa thanh nhã',
        'Hai tà áo bay bổng thướt tha xẻ eo tinh tế',
        'Quần dài lụa suông giữ trọn nét kín đáo'
      ],
      modernTwistNotes: [
        'Đôi sneaker chunky trắng giải phóng đôi chân khi chụp ảnh ngoại cảnh',
        'Túi tote canvas in typographic tôn vinh ngôn ngữ Việt'
      ],
      boundaryGuide: {
        doList: ['Giữ nguyên chiều dài tà áo qua đầu gối', 'Luôn mặc kèm quần dài ống suông lịch sự'],
        dontList: ['Tuyệt đối không mặc áo dài với quần soóc ngắn hoặc váy hở cũn cỡn']
      },
      nguHanhNote,
      sourceCitation: 'Xu hướng Thời trang Giới trẻ & Việt phục Đương đại'
    };
  }

  // Áo Ngũ Thân + Bốt da / Blazer
  if (garment.id === 'ao-ngu-than' && (hasBoots || hasBlazer || styleId === 'street' || styleId === 'modern-genz')) {
    return {
      status: 'innovative',
      heritageScore: 90,
      title: 'Giao thoa Đông - Tây: Bản sắc Cổ phong thời thượng',
      description:
        'Áo ngũ thân lập lĩnh tay chẽn phối cùng bốt da mũi vuông hoặc áo blazer oversize là một trong những thử nghiệm thời trang thú vị nhất của giới trẻ. Kết cấu 5 thân vững chãi tượng trưng cho đạo lý ngũ thường kết hợp hoàn hảo cùng cấu trúc tailoring phương Tây, tạo nên diện mạo vừa đĩnh đạc vừa phong cách.',
      traditionalFeatures: [
        'Cổ đứng lập lĩnh ôm khít cổ mực thước',
        'Năm thân áo tượng trưng Ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín)',
        'Hàng khuy cài nách hữu kín đáo'
      ],
      modernTwistNotes: [
        'Layer cùng blazer oversize tạo phong thái menswear thanh lịch',
        'Bốt da đen tôn dáng đứng thẳng thớm của áo cổ phục'
      ],
      boundaryGuide: {
        doList: ['Cài kín khuy cổ khi dự các nghi lễ trang nghiêm', 'Chọn phom tay chẽn gọn gàng khi mặc với đồ hiện đại'],
        dontList: ['Không bung toàn bộ khuy áo để lộ cơ thể luộm thuộm']
      },
      nguHanhNote,
      sourceCitation: 'Sách "Ngàn Năm Áo Mũ" - Khảo cứu trang phục triều Nguyễn'
    };
  }

  // Áo Tứ Thân + Phong cách Hiện đại
  if (garment.id === 'ao-tu-than' && (styleId === 'street' || hasBoots || styleId === 'modern-genz')) {
    return {
      status: 'innovative',
      heritageScore: 86,
      title: 'Biến tấu Kinh Bắc đương đại',
      description:
        'Áo tứ thân được thả buông hai vạt tựa như một chiếc áo khoác cardigan thời thượng. Chiếc áo yếm bên trong được tôn lên như một item crop-top cao cấp, vừa giữ được nét mộc mạc dân gian miền Quan họ vừa phá cách ấn tượng giữa phố thị.',
      traditionalFeatures: [
        'Bốn thân áo tượng trưng tứ thân phụ mẫu',
        'Yếm hoa đào e ấp',
        'Dải thắt lưng mềm mại'
      ],
      modernTwistNotes: [
        'Buông vạt tự do phối cùng quần ống rộng cạp cao thời thượng',
        'Đi cùng guốc mộc đế cao hoặc bốt da cá tính'
      ],
      boundaryGuide: {
        doList: ['Đảm bảo yếm lót bên trong kín đáo, vừa vặn', 'Tận dụng dải lụa thắt lưng tạo điểm nhấn eo duyên dáng'],
        dontList: ['Tránh để áo yếm xộc xệch hoặc chất liệu quá mỏng manh xuyên thấu']
      },
      nguHanhNote,
      sourceCitation: 'Văn hóa Dân gian Vùng Kinh Bắc & Lễ hội Quan họ'
    };
  }

  // Áo Bà Ba + Phụ kiện Nam Bộ đương đại
  if (garment.id === 'ao-ba-ba' && (hasBoots || hasModernSneaker || styleId === 'modern-genz')) {
    return {
      status: 'innovative',
      heritageScore: 87,
      title: 'Avant-Garde Phương Nam: Hào sảng & Phóng khoáng',
      description:
        'Chiếc áo bà ba dân dã bước vào thế giới thời trang trẻ khi được phối cùng sneaker hiện đại hoặc bốt da cá tính. Minh chứng sống động rằng trang phục truyền thống của miền Tây sông nước luôn tràn đầy hơi thở thời đại và tính ứng dụng linh hoạt.',
      traditionalFeatures: [
        'Thân áo ngắn xẻ hông linh hoạt cử động',
        'Hàng cúc giữa ngay ngắn',
        'Hai túi vuông bình dị'
      ],
      modernTwistNotes: [
        'Phối cùng quần tây suông hoặc chân váy midi xếp ly',
        'Khăn rằn vắt chéo vai như một dải khăn quàng thời trang'
      ],
      boundaryGuide: {
        doList: ['Tận dụng tính phóng khoáng tự nhiên của chất liệu đũi, lụa', 'Phối thêm khăn rằn tạo chất Nam Bộ rõ rệt'],
        dontList: ['Tránh cài lệch cúc hoặc phối đồ quá rườm rà làm mất nét thanh thoát mộc mạc']
      },
      nguHanhNote,
      sourceCitation: 'Lịch sử Trang phục Nam Bộ & Văn hóa Đồng bằng Sông Cửu Long'
    };
  }

  // -------------------------------------------------------------
  // CASE 4: CHUẨN MỰC DI SẢN (RESPECTFUL - Giữ gìn nguyên bản)
  // -------------------------------------------------------------
  return {
    status: 'respectful',
    heritageScore: 98,
    title: `Chuẩn mực Di sản: Nét đẹp ${garment.name} nguyên bản`,
    description: `Bản phối tôn vinh trọn vẹn vẻ đẹp thanh nhã và tinh thần của ${garment.name}. Giữ gìn chuẩn mực về phom dáng, màu sắc và đạo lý người xưa gửi gắm trong từng đường kim mũi chỉ.`,
    traditionalFeatures: garment.keyFeatures,
    modernTwistNotes: ['Màu sắc và phụ kiện được tiết chế tinh tế làm tôn vinh hồn cốt di sản'],
    boundaryGuide: {
      doList: [
        `Gìn giữ trọn vẹn phom dáng ${garment.name}`,
        'Phối phụ kiện truyền thống (khăn vấn, kiềng bạc, guốc mộc) để đạt độ trang trọng cao nhất'
      ],
      dontList: [
        'Hạn chế phối quá nhiều item phong cách Tây phương phá vỡ không gian cổ phong tĩnh tại'
      ]
    },
    nguHanhNote,
    sourceCitation: garment.historyDetails.origin
  };
}
