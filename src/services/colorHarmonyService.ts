import { ColorHarmonyReport, ColorOption } from '../types/outfit';
import { COLORS } from '../data/colors';

export function calculateColorHarmony(
  primaryColorId: string,
  styleId: string,
  accessoryIds: string[]
): ColorHarmonyReport {
  const color = COLORS.find((c) => c.id === primaryColorId) || COLORS[0];
  const { h, s, l } = color.hsl;

  // Base harmony score calculation based on HSL attributes & complementary physics
  let score = 80;
  let paletteType = 'Tương đồng (Analogous)';
  let rating: ColorHarmonyReport['rating'] = 'Hài hòa cao';
  let feedback = '';

  // Calculate based on style synergy
  if (styleId === 'minimal') {
    if (color.id === 'trang-lua-nga' || color.id === 'den-tuyen') {
      score = 96;
      paletteType = 'Đơn sắc (Monochrome) Tinh Tế';
      rating = 'Tuyệt mỹ';
      feedback = 'Sự kết hợp đơn sắc mang lại vẻ đẹp tĩnh lặng, tinh khôi và đậm chất Quiet Luxury hiện đại.';
    } else {
      score = 86;
      paletteType = 'Tối giản thuần khiết';
      rating = 'Cân bằng êm dịu';
      feedback = 'Gam màu ấm dịu tạo phong thái nhẹ nhàng, không gây rối mắt thị giác.';
    }
  } else if (styleId === 'traditional') {
    if (color.id === 'do-son' || color.id === 'vang-hoang-cuc' || color.id === 'tim-hue') {
      score = 98;
      paletteType = 'Ngũ Hành Cung Đình (Royal Heritage)';
      rating = 'Tuyệt mỹ';
      feedback = 'Sắc màu chuẩn mực cung đình Việt Nam, toát lên vẻ vương giả, đoan trang và tôn nghiêm.';
    } else {
      score = 88;
      paletteType = 'Dân gian mộc mạc';
      rating = 'Hài hòa cao';
      feedback = 'Màu sắc gợi nhắc những nếp nhà ngói đỏ, lũy tre xanh và chiếu chèo Kinh Bắc xưa.';
    }
  } else if (styleId === 'street') {
    if (color.id === 'den-tuyen' || color.id === 'do-son') {
      score = 94;
      paletteType = 'Tương phản mạnh (High Contrast)';
      rating = 'Tương phản ấn tượng';
      feedback = 'Độ tương phản cao giữa màu nền và các phụ kiện hiện đại tạo nên năng lượng bùng nổ, nổi loạn.';
    } else {
      score = 84;
      paletteType = 'Urban Heritage Blend';
      rating = 'Cân bằng êm dịu';
      feedback = 'Sự đối lập giữa nét truyền thống và chất đường phố tạo điểm nhấn thị giác thú vị.';
    }
  } else if (styleId === 'cute') {
    if (color.id === 'hong-canh-sen' || color.id === 'pastel-thanh-thien' || color.id === 'trang-lua-nga') {
      score = 95;
      paletteType = 'Pastel Kẹo Ngọt (Sweet Pastel)';
      rating = 'Tuyệt mỹ';
      feedback = 'Sắc thái ngọt ngào, tươi trẻ tôn lên sự trong trẻo, rạng rỡ của lứa tuổi học sinh sinh viên.';
    } else {
      score = 82;
      paletteType = 'Nữ tính duyên dáng';
      rating = 'Cân bằng êm dịu';
      feedback = 'Màu sắc ấm áp, tạo thiện cảm nhẹ nhàng khi gặp gỡ bạn bè.';
    }
  } else {
    // Default dynamic formula
    const hueModifier = Math.sin((h * Math.PI) / 180) * 8;
    const satModifier = s > 40 && s < 75 ? 6 : -3;
    const lightModifier = l > 20 && l < 85 ? 5 : 0;
    const accBonus = accessoryIds.length >= 2 && accessoryIds.length <= 4 ? 4 : 0;

    score = Math.min(99, Math.max(72, Math.round(score + hueModifier + satModifier + lightModifier + accBonus)));

    if (score >= 93) {
      rating = 'Tuyệt mỹ';
      paletteType = 'Tam giác màu Hoàng gia (Triadic)';
      feedback = 'Tỷ lệ phối màu hoàn hảo giữa màu chính, màu bổ trợ và điểm xuyết phụ kiện.';
    } else if (score >= 86) {
      rating = 'Hài hòa cao';
      paletteType = 'Bổ túc thanh lịch (Complementary)';
      feedback = 'Bảng màu có độ cân bằng sáng - tối tốt, tôn da và giữ nét sang trọng của tơ lụa Việt.';
    } else {
      rating = 'Cân bằng êm dịu';
      paletteType = 'Tương đồng tự nhiên (Natural Analogous)';
      feedback = 'Phối màu an toàn, dễ ứng dụng trong nhiều hoàn cảnh dạo phố và sinh hoạt thường nhật.';
    }
  }

  // Calculate contrast ratio estimation
  const contrastScore = Math.round(((100 - l) / 100) * 85 + (s / 100) * 15);

  return {
    score,
    rating,
    primaryColorHex: color.hex,
    secondaryColorHex: color.secondaryHex,
    accentColorHex: color.accentHex,
    paletteType,
    feedback,
    contrastScore
  };
}
