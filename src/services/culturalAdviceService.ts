import { CulturalAdvice } from '../types/outfit';

export function evaluateCulturalOutfit(
  garmentId: string,
  styleId: string,
  occasionId: string,
  accessoryIds: string[]
): CulturalAdvice {
  const hasModernSneaker = accessoryIds.includes('sneaker-chunky');
  const hasCyberGlasses = accessoryIds.includes('kinh-mat-y2k');
  const hasBoots = accessoryIds.includes('boots-da');
  const hasTraditionalHeadwear = accessoryIds.includes('khan-dong') || accessoryIds.includes('non-quai-thao');
  const hasTraditionalJewelry = accessoryIds.includes('kieng-bac') || accessoryIds.includes('tram-cai-toc');

  // Case 1: Nhật Bình (Regal attire) with high street / rebellious styles
  if (garmentId === 'nhat-binh') {
    if (styleId === 'street' || (hasCyberGlasses && hasModernSneaker)) {
      return {
        status: 'caution',
        title: 'Lưu ý văn hóa: Giữ gìn phẩm thức Áo Nhật Bình',
        description: 'Áo Nhật Bình vốn là thường phục tôn nghiêm của bậc Hoàng hậu, Phi tần và Công chúa triều Nguyễn với quy chế khắt khe. Khi đưa vào phong cách đường phố (Street Hypebeast) hoặc kết hợp phụ kiện nổi loạn, cần giữ nguyên độ dài thân áo và dải đối khâm trước ngực, tránh cắt ngắn làm mất đi tính trang nghiêm của phẩm phục triều đình.',
        traditionalFeatures: ['Cổ áo chữ nhật đối xứng (đối khâm)', 'Dải thêu hoa văn ngũ hành cung đình'],
        modernTwistNotes: ['Cách điệu thành áo khoác ngoài Haori/Kimono', 'Phối cùng phụ kiện đương đại']
      };
    }

    if (occasionId === 'di-hoc') {
      return {
        status: 'caution',
        title: 'Cân nhắc hoàn cảnh: Phẩm phục hoàng cung nơi giảng đường',
        description: 'Áo Nhật Bình có độ trang trọng rất cao và hoa văn cầu kỳ. Trong môi trường học đường thường nhật, tà áo có thể gây vướng víu khi cử động. Nếu mặc trong ngày hội văn hóa sinh viên hoặc thuyết trình lịch sử thì lại là lựa chọn xuất sắc!',
        traditionalFeatures: ['Cổ áo chữ nhật đối xứng', 'Hoa văn thêu tinh xảo'],
        modernTwistNotes: ['Tiết chế màu sắc tà lót bên trong']
      };
    }

    return {
      status: 'respectful',
      title: 'Khí chất Hoàng gia sang trọng',
      description: 'Sự kết hợp tôn vinh trọn vẹn vẻ đài các của mỹ thuật cung đình Huế. Phom dáng đối khâm nghiêm cẩn toát lên nét đẹp uy nghiêm mà trang nhã.',
      traditionalFeatures: ['Cổ đối khâm Nhật Bình', 'Họa tiết ngũ hành', 'Tay áo thụng quý phái'],
      modernTwistNotes: ['Phụ kiện tối giản làm nổi bật hoa văn thêu']
    };
  }

  // Case 2: Áo Dài with Modern Gen Z elements (e.g. Sneaker for Tet / School)
  if (garmentId === 'ao-dai') {
    if (hasModernSneaker || styleId === 'modern-genz') {
      return {
        status: 'innovative',
        title: 'Cảm hứng Gen Z: Năng động du xuân & Dạo phố',
        description: 'Sự kết hợp giữa tà áo dài thanh thoát và đôi sneaker năng động là trào lưu cực kỳ thịnh hành trong giới trẻ Việt Nam mỗi dịp Tết. Bản phối này giữ trọn nét duyên của tà áo đồng thời giúp bạn tự do sải bước mà không lo đau mỏi chân.',
        traditionalFeatures: ['Cổ áo lập lĩnh / cổ thuyền', 'Hai tà áo bay bổng thướt tha'],
        modernTwistNotes: ['Đôi sneaker chunky trắng giải phóng đôi chân', 'Túi tote canvas tiện lợi']
      };
    }

    if (styleId === 'traditional') {
      return {
        status: 'respectful',
        title: 'Quốc phục thanh tân thuần khiết',
        description: 'Bản phối gìn giữ nguyên vẹn tinh thần thanh lịch, kín đáo của Áo Dài truyền thống. Rất chuẩn mực cho các dịp lễ tết, tốt nghiệp và sự kiện trọng đại.',
        traditionalFeatures: ['Cổ đứng cao thanh nhã', 'Quần lụa dài suông mềm', 'Guốc mộc hoặc kiềng bạc'],
        modernTwistNotes: ['Chất liệu dệt đương đại thoáng mát']
      };
    }
  }

  // Case 3: Áo Ngũ Thân (Tiền thân Áo Dài)
  if (garmentId === 'ao-ngu-than') {
    if (hasBoots || accessoryIds.includes('blazer-oversize')) {
      return {
        status: 'innovative',
        title: 'Giao thoa Đông - Tây: Bản sắc Cổ phong thời thượng',
        description: 'Áo ngũ thân lập lĩnh tay chẽn phối cùng bốt da hoặc áo blazer khoác ngoài là một trong những thử nghiệm thời trang thú vị nhất của giới trẻ. Kết cấu 5 thân vững chãi tượng trưng cho đạo lý làm người kết hợp hoàn hảo cùng cấu trúc tailoring phương Tây.',
        traditionalFeatures: ['Cổ đứng lập lĩnh ôm khít', 'Năm thân áo ngũ thường', 'Hàng khuy cài nách hữu'],
        modernTwistNotes: ['Layer cùng bốt da mũi vuông hoặc blazer oversize']
      };
    }

    return {
      status: 'respectful',
      title: 'Đĩnh đạc & Chuẩn mực Cổ nhân',
      description: 'Lựa chọn đậm chất tri thức và văn hiến. Tôn vinh cội nguồn trực tiếp của Áo Dài với chiều sâu văn hóa thời Nguyễn.',
      traditionalFeatures: ['Khăn đóng quấn nếp ngay ngắn', 'Phom áo suông mực thước', 'Năm chiếc cúc ý nghĩa'],
      modernTwistNotes: ['Màu sắc tươi trẻ phù hợp thanh xuân']
    };
  }

  // Case 4: Áo Tứ Thân
  if (garmentId === 'ao-tu-than') {
    if (styleId === 'street') {
      return {
        status: 'innovative',
        title: 'Biến tấu Kinh Bắc đương đại',
        description: 'Áo tứ thân được thả buông hai vạt tựa như một chiếc áo khoác cardigan thời thượng. Chiếc áo yếm bên trong được tôn lên như một item crop-top cao cấp, vừa giữ được nét mộc mạc dân gian vừa phá cách ấn tượng.',
        traditionalFeatures: ['Bốn thân áo tượng trưng tứ thân phụ mẫu', 'Nét duyên dáng hội làng Quan họ'],
        modernTwistNotes: ['Buông vạt tự do phối cùng quần cạp cao thời trang']
      };
    }

    return {
      status: 'respectful',
      title: 'Hồn quê Kinh Bắc đằm thắm',
      description: 'Sự kết hợp mộc mạc đưa ta về với không gian lễ hội vùng Kinh Bắc, tiếng hát Quan họ trao duyên và nét duyên dáng thắt đáy lưng ong.',
      traditionalFeatures: ['Vạt áo buộc trước bụng', 'Nón quai thao ba tầm', 'Dải yếm hoa đào'],
      modernTwistNotes: ['Phối màu hiện đại, hài hòa']
    };
  }

  // Case 5: Áo Bà Ba
  if (garmentId === 'ao-ba-ba') {
    if (hasBoots || hasCyberGlasses) {
      return {
        status: 'innovative',
        title: 'Avant-Garde Phương Nam: Tự do & Hào sảng',
        description: 'Chiếc áo bà ba dân dã bước vào thế giới thời trang cao cấp khi được phối cùng phụ kiện da đen và kính mắt thời thượng. Một minh chứng sống động rằng trang phục truyền thống không bao giờ bị đóng khung trong quá khứ.',
        traditionalFeatures: ['Thân áo ngắn xẻ hông linh hoạt', 'Hàng cúc chính giữa ngực'],
        modernTwistNotes: ['Phối phụ kiện monochrome sắc sảo']
      };
    }

    return {
      status: 'respectful',
      title: 'Duyên dáng Nam Bộ chân chất',
      description: 'Đơn sơ mà phóng khoáng, chiếc áo bà ba mang lại cảm giác gần gũi, dịu dàng và đầy sức sống miền sông nước.',
      traditionalFeatures: ['Khăn rằn vắt vai', 'Dáng áo thoải mái', 'Nét đẹp lao động'],
      modernTwistNotes: ['Chất liệu lụa bóng mềm mại']
    };
  }

  // Fallback
  return {
    status: 'respectful',
    title: 'Bản sắc Việt đan cài nhịp sống trẻ',
    description: 'Trang phục kết hợp hài hòa giữa cấu trúc truyền thống và tinh thần phóng khoáng của thế hệ trẻ.',
    traditionalFeatures: ['Phom dáng trang phục được giữ gìn'],
    modernTwistNotes: ['Điểm xuyết phụ kiện đương đại phù hợp']
  };
}
