import { CulturalAdvice, CulturalFinding } from '../types/outfit';
import { GARMENTS } from '../data/garments';
import { COLORS } from '../data/colors';

// -------------------------------------------------------------
// Nguồn tham khảo dùng chung. Chỉ ghi nguồn có thật, cụ thể;
// nhận định xu hướng được ghi rõ là nhận định của nhóm phát triển.
// -------------------------------------------------------------
export const SOURCES = {
  nganNamAoMu: 'Trần Quang Đức, "Ngàn năm áo mũ", NXB Thế Giới (2013)',
  hoiDien: 'Quốc sử quán triều Nguyễn, "Khâm định Đại Nam hội điển sự lệ" (phần Lễ bộ – Quan phục)',
  danGian: 'Quan niệm dân gian, được lưu truyền rộng rãi (chưa có văn bản gốc thống nhất)',
  nhomPhatTrien: 'Nhận định thẩm mỹ của nhóm phát triển, không phải tư liệu lịch sử'
} as const;

const MODERN_ACCESSORIES = ['sneaker-chunky', 'kinh-mat-y2k', 'boots-da', 'blazer-oversize', 'tote-typography'];
const TRADITIONAL_ACCESSORIES = ['khan-dong', 'kieng-bac', 'non-quai-thao', 'guoc-moc', 'tram-cai-toc', 'quat-lua-xep', 'tui-coi-theu'];

// Điểm trừ theo mức độ. Công thức: 100 − tổng điểm trừ (tối thiểu 0).
// Hiển thị công khai cho người dùng để điểm số không phải "hộp đen".
export const SEVERITY_PENALTY: Record<CulturalFinding['severity'], number> = {
  taboo: 40,
  caution: 12,
  creative: 4,
  info: 0
};

interface RuleContext {
  garmentId: string;
  styleId: string;
  occasionId: string;
  colorId: string;
  accessoryIds: string[];
  has: (id: string) => boolean;
  modernCount: number;
  traditionalCount: number;
}

interface CulturalRule {
  id: string;
  when: (c: RuleContext) => boolean;
  finding: CulturalFinding;
}

// -------------------------------------------------------------
// BẢNG LUẬT VĂN HÓA — mỗi luật độc lập, nhiều luật có thể cùng bật
// -------------------------------------------------------------
const RULES: CulturalRule[] = [
  // ---------- Áo Nhật Bình (lễ/thường phục cung đình) ----------
  {
    id: 'nhat-binh-street-overload',
    when: (c) => c.garmentId === 'nhat-binh' && c.styleId === 'street' && c.modernCount >= 2,
    finding: {
      severity: 'taboo',
      title: 'Nhật Bình bị "đường phố hóa" quá mức',
      detail:
        'Áo Nhật Bình là trang phục của nữ giới hoàng tộc triều Nguyễn, nhận diện bởi cổ đối khâm hình chữ nhật và dải viền thêu. Phong cách Street Hypebeast cộng từ 2 phụ kiện hiện đại trở lên khiến bộ trang phục mất tính trang trọng vốn là cốt lõi của áo.',
      fix: 'Giữ tối đa 1 phụ kiện hiện đại, hoặc chuyển sang phong cách Elegant / Vintage.',
      source: SOURCES.nganNamAoMu
    }
  },
  {
    id: 'nhat-binh-street',
    when: (c) => c.garmentId === 'nhat-binh' && c.styleId === 'street' && c.modernCount < 2,
    finding: {
      severity: 'caution',
      title: 'Nhật Bình với phong cách Street',
      detail: 'Street Hypebeast đối lập với tính trang trọng của trang phục cung đình. Một phụ kiện hiện đại vẫn chấp nhận được, nhưng cần giữ nguyên cổ đối khâm, tay áo và chiều dài áo.',
      fix: 'Cân nhắc phong cách Elegant hoặc Vintage để bản phối nhất quán hơn.',
      source: SOURCES.nhomPhatTrien
    }
  },
  {
    id: 'nhat-binh-cyber',
    when: (c) => c.garmentId === 'nhat-binh' && c.has('kinh-mat-y2k'),
    finding: {
      severity: 'caution',
      title: 'Kính Cyber Y2K đặt cạnh phẩm phục cung đình',
      detail: 'Kính râm cyber tạo tương phản quá gắt với cổ đối khâm và dải thêu — người xem dễ đọc thành trang phục hóa trang.',
      fix: 'Thay bằng trâm cài tóc hoặc quạt lụa để giữ sự đồng bộ.',
      source: SOURCES.nhomPhatTrien
    }
  },
  {
    id: 'nhat-binh-blazer',
    when: (c) => c.garmentId === 'nhat-binh' && c.has('blazer-oversize'),
    finding: {
      severity: 'caution',
      title: 'Blazer che mất cổ đối khâm',
      detail: 'Cổ áo hình chữ nhật trước ngực là đặc điểm nhận diện của Nhật Bình. Khoác blazer bên ngoài che mất chi tiết này.',
      fix: 'Bỏ blazer; nếu cần lớp khoác, chọn áo choàng mỏng mở phía trước.',
      source: SOURCES.nganNamAoMu
    }
  },
  {
    id: 'nhat-binh-school',
    when: (c) => c.garmentId === 'nhat-binh' && c.occasionId === 'di-hoc',
    finding: {
      severity: 'caution',
      title: 'Nhật Bình không hợp sinh hoạt học đường hằng ngày',
      detail: 'Tay áo rộng, nhiều lớp và mức trang trọng cao gây bất tiện khi học. Phù hợp hơn cho ngày hội văn hóa, thuyết trình lịch sử, diễn kịch.',
      fix: 'Chọn Áo Dài hoặc Ngũ Thân tay chẽn cho ngày học bình thường.',
      source: SOURCES.nhomPhatTrien
    }
  },
  {
    id: 'nhat-binh-non-quai-thao',
    when: (c) => c.garmentId === 'nhat-binh' && c.has('non-quai-thao'),
    finding: {
      severity: 'caution',
      title: 'Lệch tầng lớp & vùng miền: Nón quai thao với Nhật Bình',
      detail: 'Nón quai thao gắn với phụ nữ bình dân Bắc Bộ (Kinh Bắc, quan họ), còn Nhật Bình là trang phục cung đình Huế. Kết hợp hai thứ tạo ra hình ảnh không có trong lịch sử.',
      fix: 'Dùng trâm cài tóc hoặc khăn vấn cho Nhật Bình; để nón quai thao cho Áo Tứ Thân.',
      source: SOURCES.nganNamAoMu
    }
  },

  // ---------- Áo Tứ Thân ----------
  {
    id: 'tu-than-khan-ran',
    when: (c) => c.garmentId === 'ao-tu-than' && c.has('khan-ran-nam-bo'),
    finding: {
      severity: 'info',
      title: 'Pha trộn vùng miền: Khăn rằn Nam Bộ với Tứ Thân Bắc Bộ',
      detail: 'Không sai, nhưng nên biết đây là phối "liên vùng" — khi giới thiệu bản phối, hãy nói rõ để tránh hiểu nhầm nguồn gốc.',
      source: SOURCES.nhomPhatTrien
    }
  },
  {
    id: 'tu-than-street',
    when: (c) => c.garmentId === 'ao-tu-than' && (c.styleId === 'street' || c.styleId === 'modern-genz' || c.has('boots-da')),
    finding: {
      severity: 'creative',
      title: 'Biến tấu Kinh Bắc đương đại',
      detail: 'Thả buông hai vạt trước như áo khoác mỏng, yếm được giữ làm lớp trong. Hợp lệ khi yếm kín đáo và vẫn nhận ra bốn thân áo.',
      fix: 'Đảm bảo yếm lót vừa vặn, không dùng chất liệu xuyên thấu.',
      source: SOURCES.nhomPhatTrien
    }
  },

  // ---------- Dân gian ở bối cảnh trang trọng ----------
  {
    id: 'folk-formal-event',
    when: (c) =>
      (c.garmentId === 'ao-ba-ba' || c.garmentId === 'ao-tu-than') &&
      (c.occasionId === 'su-kien-van-hoa' || c.occasionId === 'tot-nghiep') &&
      c.traditionalCount === 0 &&
      !c.has('blazer-oversize'),
    finding: {
      severity: 'caution',
      title: 'Trang phục dân gian ở sự kiện trang trọng cần nâng chất liệu',
      detail: 'Áo Bà Ba và Tứ Thân vốn là trang phục thường ngày của người lao động. Ở sự kiện giao lưu / lễ tốt nghiệp, bản phối dễ trông xuề xòa nếu không có điểm nhấn.',
      fix: 'Chọn lụa tơ tằm hoặc gấm, thêm kiềng bạc / ngọc trai, hoặc khoác blazer.',
      source: SOURCES.nhomPhatTrien
    }
  },

  // ---------- Áo Ngũ Thân ----------
  {
    id: 'ngu-than-fusion',
    when: (c) =>
      c.garmentId === 'ao-ngu-than' &&
      (c.has('boots-da') || c.has('blazer-oversize') || c.styleId === 'street' || c.styleId === 'modern-genz'),
    finding: {
      severity: 'creative',
      title: 'Giao thoa Đông – Tây với Ngũ Thân',
      detail: 'Ngũ Thân tay chẽn có phom đứng, dễ kết hợp với boots hoặc blazer mà không mất cấu trúc cổ đứng và vạt con.',
      fix: 'Cài kín khuy cổ khi dự nghi lễ; chọn tay chẽn khi phối đồ hiện đại.',
      source: SOURCES.nhomPhatTrien
    }
  },

  // ---------- Áo Dài ----------
  {
    id: 'ao-dai-genz',
    when: (c) => c.garmentId === 'ao-dai' && (c.has('sneaker-chunky') || c.has('tote-typography') || c.styleId === 'modern-genz'),
    finding: {
      severity: 'creative',
      title: 'Áo Dài phối sneaker / phụ kiện Gen Z',
      detail: 'Phối phổ biến trong giới trẻ dịp Tết và chụp ảnh ngoài trời. Hợp lệ khi giữ tà áo dài qua gối và quần dài.',
      fix: 'Không mặc áo dài với quần soóc hoặc váy ngắn.',
      source: SOURCES.nhomPhatTrien
    }
  },

  // ---------- Áo Bà Ba ----------
  {
    id: 'ba-ba-modern',
    when: (c) => c.garmentId === 'ao-ba-ba' && (c.has('boots-da') || c.has('sneaker-chunky') || c.styleId === 'modern-genz'),
    finding: {
      severity: 'creative',
      title: 'Bà Ba phong cách đương đại',
      detail: 'Áo Bà Ba thân ngắn, xẻ hông vốn đã tiện vận động nên phối giày hiện đại khá tự nhiên.',
      fix: 'Khăn rằn vắt vai giúp giữ nhận diện Nam Bộ.',
      source: SOURCES.nhomPhatTrien
    }
  },

  // ---------- Màu sắc theo dịp (phong tục) ----------
  {
    id: 'tet-dark-color',
    when: (c) => c.occasionId === 'tet' && (c.colorId === 'den-tuyen' || c.colorId === 'trang-lua-nga'),
    finding: {
      severity: 'caution',
      title: 'Màu đen / trắng trong dịp Tết',
      detail: 'Nhiều gia đình Việt kiêng mặc toàn đen hoặc toàn trắng ngày đầu năm vì gắn với tang lễ. Không phải quy tắc tuyệt đối nhưng dễ gây phật ý khi đi chúc Tết.',
      fix: 'Thêm phụ kiện đỏ, vàng hoặc chọn màu ấm như Đỏ Son, Vàng Hoàng Cúc.',
      source: SOURCES.danGian
    }
  },
  {
    id: 'wedding-black',
    when: (c) => c.occasionId === 'cuoi-hoi' && c.colorId === 'den-tuyen',
    finding: {
      severity: 'caution',
      title: 'Màu đen trong đám cưới / ăn hỏi',
      detail: 'Trong phong tục cưới hỏi Việt, khách thường tránh màu đen tuyền vì gợi không khí tang.',
      fix: 'Chọn Hồng Cánh Sen, Đỏ Son hoặc màu pastel.',
      source: SOURCES.danGian
    }
  },

  // ---------- Mâu thuẫn phong cách ----------
  {
    id: 'traditional-style-modern-overload',
    when: (c) => c.styleId === 'traditional' && c.modernCount >= 2,
    finding: {
      severity: 'caution',
      title: 'Phong cách "Traditional Authentic" nhưng phụ kiện hiện đại',
      detail: 'Bạn chọn phong cách nguyên bản nhưng dùng từ 2 phụ kiện hiện đại trở lên — thông điệp của bản phối bị mâu thuẫn.',
      fix: 'Đổi phong cách sang Modern Gen Z, hoặc thay bằng phụ kiện truyền thống.',
      source: SOURCES.nhomPhatTrien
    }
  },
  {
    id: 'modern-overload',
    when: (c) => c.modernCount >= 4,
    finding: {
      severity: 'caution',
      title: 'Quá nhiều phụ kiện hiện đại',
      detail: 'Khi 4 món hiện đại cùng xuất hiện, trang phục truyền thống trở thành phông nền thay vì nhân vật chính.',
      fix: 'Giữ 1–2 điểm nhấn hiện đại là đủ.',
      source: SOURCES.nhomPhatTrien
    }
  }
];

const SEVERITY_ORDER: CulturalFinding['severity'][] = ['taboo', 'caution', 'creative', 'info'];

function buildNguHanhNote(colorId: string, occasionId: string): string {
  const color = COLORS.find((c) => c.id === colorId) || COLORS[0];
  let note = `${color.name}: ${color.elementMeaning}`;
  if (color.element === 'Hỏa' && (occasionId === 'tet' || occasionId === 'cuoi-hoi')) {
    note += ' Trong dịp Tết và cưới hỏi, sắc đỏ/hồng được xem là màu may mắn, hỷ sự.';
  } else if (color.element === 'Thủy' && occasionId === 'tet') {
    note += ' Dịp Tết nên điểm thêm phụ kiện màu ấm để bớt trầm.';
  }
  return note + ' (Liên hệ Ngũ hành mang tính tham khảo văn hóa, không phải quy tắc bắt buộc.)';
}

export function evaluateCulturalOutfit(
  garmentId: string,
  styleId: string,
  occasionId: string,
  accessoryIds: string[],
  colorId?: string
): CulturalAdvice {
  const garment = GARMENTS.find((g) => g.id === garmentId) || GARMENTS[0];
  const resolvedColorId = colorId || COLORS[0].id;

  const ctx: RuleContext = {
    garmentId: garment.id,
    styleId,
    occasionId,
    colorId: resolvedColorId,
    accessoryIds,
    has: (id) => accessoryIds.includes(id),
    modernCount: accessoryIds.filter((id) => MODERN_ACCESSORIES.includes(id)).length,
    traditionalCount: accessoryIds.filter((id) => TRADITIONAL_ACCESSORIES.includes(id)).length
  };

  const matched = RULES.filter((r) => r.when(ctx)).map((r) => r.finding);

  // Bản phối có yếu tố hiện đại nhưng không khớp luật cụ thể nào vẫn là cách tân, không phải "nguyên bản"
  const hasModernTouch = ctx.modernCount > 0 || ['street', 'modern-genz', 'cute'].includes(styleId);
  if (hasModernTouch && !matched.some((f) => f.severity !== 'info')) {
    matched.push({
      severity: 'creative',
      title: `${garment.name} có yếu tố cách tân`,
      detail: 'Bản phối có phụ kiện hoặc phong cách hiện đại. Không phát hiện điểm lệch nghiêm trọng, miễn là giữ các đặc điểm nhận diện của áo.',
      fix: `Giữ nguyên: ${garment.inviolableFeatures[0]}.`,
      source: SOURCES.nhomPhatTrien
    });
  }

  const findings = matched
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));

  const penalty = findings.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0);
  const heritageScore = Math.max(0, 100 - penalty);

  const worst = findings[0]?.severity;
  const status: CulturalAdvice['status'] =
    worst === 'taboo' ? 'taboo' : worst === 'caution' ? 'caution' : worst === 'creative' ? 'innovative' : 'respectful';

  const issues = findings.filter((f) => f.severity === 'taboo' || f.severity === 'caution');
  const creatives = findings.filter((f) => f.severity === 'creative');

  const title =
    status === 'respectful'
      ? `Bản phối giữ nét nguyên bản của ${garment.name}`
      : issues.length > 1
      ? `${issues.length} điểm cần lưu ý: ${issues[0].title}`
      : findings[0].title;

  const description =
    status === 'respectful'
      ? `Không phát hiện điểm lệch nào so với các đặc trưng của ${garment.name} trong bộ luật hiện có.`
      : findings[0].detail;

  const tabooFinding = findings.find((f) => f.severity === 'taboo');

  return {
    status,
    heritageScore,
    title,
    description,
    tabooAlert: tabooFinding ? `${tabooFinding.detail} Cách sửa: ${tabooFinding.fix}` : undefined,
    traditionalFeatures: garment.inviolableFeatures,
    modernTwistNotes: creatives.length
      ? creatives.map((f) => f.title)
      : issues.length
      ? issues.map((f) => f.fix || f.title)
      : ['Bản phối tiết chế, không có điểm cách điệu mạnh'],
    boundaryGuide: {
      doList: [
        ...findings.map((f) => f.fix).filter((x): x is string => !!x),
        `Giữ các đặc điểm nhận diện của ${garment.name}`
      ].slice(0, 4),
      dontList: garment.inviolableFeatures.map((feat) => `Không làm mất: ${feat.charAt(0).toLowerCase()}${feat.slice(1)}`).slice(0, 3)
    },
    nguHanhNote: buildNguHanhNote(resolvedColorId, occasionId),
    sourceCitation: findings.find((f) => f.source !== SOURCES.nhomPhatTrien)?.source || SOURCES.nganNamAoMu,
    findings,
    scoreFormula: findings.length
      ? `100 − ${findings.map((f) => `${SEVERITY_PENALTY[f.severity]} (${f.title})`).join(' − ')} = ${heritageScore}`
      : '100 − 0 = 100 (không có điểm trừ)'
  };
}
