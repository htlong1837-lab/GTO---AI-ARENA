import { ColorHarmonyReport } from '../types/outfit';
import { COLORS } from '../data/colors';

// Màu đại diện của từng phụ kiện (màu phổ biến nhất của món đồ đó)
const ACCESSORY_COLORS: Record<string, string> = {
  'khan-dong': '#1F1F1F',
  'non-quai-thao': '#C9A66B',
  'guoc-moc': '#6B3A1E',
  'sneaker-chunky': '#F5F5F0',
  'boots-da': '#2A1E17',
  'tui-coi-theu': '#C8A874',
  'tote-typography': '#E9E2D0',
  'tram-cai-toc': '#C0C0C0',
  'kieng-bac': '#C0C0C0',
  'kinh-mat-y2k': '#3B4A6B',
  'quat-lua-xep': '#E8DCC0',
  'ngoc-trai-layer': '#F2EDE4',
  'blazer-oversize': '#3A3A3A',
  'khan-ran-nam-bo': '#2B2B2B'
};

// Màu tông gam hợp với từng phong cách (dùng để cộng điểm phù hợp phong cách)
const STYLE_PREFERRED: Record<string, string[]> = {
  minimal: ['trang-lua-nga', 'den-tuyen', 'nau-gu'],
  traditional: ['do-son', 'vang-hoang-cuc', 'tim-hue', 'xanh-cham'],
  street: ['den-tuyen', 'do-son'],
  cute: ['hong-canh-sen', 'pastel-thanh-thien', 'trang-lua-nga'],
  elegant: ['tim-hue', 'xanh-ngoc-luc', 'do-son'],
  vintage: ['nau-song', 'nau-gu', 'vang-hoang-cuc']
};

function hexToHsl(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
}

function relativeLuminance(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

// Màu trung tính (đen, trắng, xám, be nhạt, bạc) phối với mọi màu
const isNeutral = (hex: string) => {
  const { s, l } = hexToHsl(hex);
  return s < 18 || l < 15 || l > 90;
};

/**
 * Chấm điểm hài hòa dựa trên quan hệ sắc độ (hue) giữa màu áo, màu phối
 * và màu thật của từng phụ kiện đã chọn. Công thức được trả về trong feedback.
 */
export function calculateColorHarmony(
  primaryColorId: string,
  styleId: string,
  accessoryIds: string[]
): ColorHarmonyReport {
  const color = COLORS.find((c) => c.id === primaryColorId) || COLORS[0];
  const base = hexToHsl(color.hex);

  // Các màu có sắc độ rõ (không trung tính) trong bộ trang phục
  const accessoryHexes = accessoryIds.map((id) => ACCESSORY_COLORS[id]).filter(Boolean);
  const chromatic = [color.secondaryHex, color.accentHex, ...accessoryHexes].filter((hex) => !isNeutral(hex));

  let score = 85;
  const reasons: string[] = [];

  // 1. Quan hệ sắc độ giữa màu chính và từng màu có sắc
  let clashes = 0;
  let analogous = 0;
  let complementary = 0;
  for (const hex of chromatic) {
    const d = hueDistance(base.h, hexToHsl(hex).h);
    if (d <= 40) analogous++;
    else if (d >= 150) complementary++;
    else if (d > 60 && d < 110) clashes++; // khoảng "lệch nửa vời" dễ gây chỏi mắt
  }
  if (clashes) {
    score -= clashes * 7;
    reasons.push(`−${clashes * 7}: ${clashes} màu lệch sắc độ 60–110° so với màu chính`);
  }
  if (complementary) {
    score += 4;
    reasons.push('+4: có cặp màu bổ túc tạo điểm nhấn');
  }

  // 2. Quá nhiều màu có sắc cùng lúc
  if (chromatic.length > 3) {
    const p = (chromatic.length - 3) * 5;
    score -= p;
    reasons.push(`−${p}: ${chromatic.length} màu có sắc độ cùng xuất hiện (nên ≤ 3)`);
  }

  // 3. Độ tương phản giữa màu áo và màu phụ kiện chủ đạo
  const L1 = relativeLuminance(color.hex);
  const contrasts = accessoryHexes.map((hex) => {
    const L2 = relativeLuminance(hex);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  });
  const maxContrast = contrasts.length ? Math.max(...contrasts) : 1;
  if (accessoryHexes.length && maxContrast < 1.5) {
    score -= 5;
    reasons.push('−5: phụ kiện gần như cùng độ sáng với áo, bị chìm');
  }

  // 4. Phù hợp phong cách
  if (STYLE_PREFERRED[styleId]?.includes(color.id)) {
    score += 6;
    reasons.push('+6: màu nằm trong gam đặc trưng của phong cách đã chọn');
  }

  score = Math.max(40, Math.min(100, Math.round(score)));

  let rating: ColorHarmonyReport['rating'];
  if (score >= 93) rating = 'Tuyệt mỹ';
  else if (score >= 85) rating = 'Hài hòa cao';
  else if (score >= 75) rating = complementary ? 'Tương phản ấn tượng' : 'Cân bằng êm dịu';
  else rating = 'Cần tiết chế';

  const paletteType =
    chromatic.length === 0
      ? 'Đơn sắc + trung tính (Monochrome)'
      : complementary && !clashes
      ? 'Bổ túc (Complementary)'
      : analogous === chromatic.length
      ? 'Tương đồng (Analogous)'
      : clashes
      ? 'Đa sắc chưa thống nhất'
      : 'Phối nhiều sắc độ';

  const feedback =
    `Điểm gốc 85. ${reasons.length ? reasons.join('; ') : 'Không có điểm cộng/trừ'}. ` +
    (clashes
      ? 'Gợi ý: thay phụ kiện có màu lệch bằng phụ kiện trung tính (bạc, đen, trắng ngà).'
      : chromatic.length === 0
      ? 'Bảng màu an toàn; có thể thêm một điểm nhấn màu bổ túc nếu muốn nổi bật hơn.'
      : 'Bảng màu cân bằng.');

  return {
    score,
    rating,
    primaryColorHex: color.hex,
    secondaryColorHex: color.secondaryHex,
    accentColorHex: color.accentHex,
    paletteType,
    feedback,
    contrastScore: Math.round(Math.min(21, maxContrast) / 21 * 100)
  };
}
