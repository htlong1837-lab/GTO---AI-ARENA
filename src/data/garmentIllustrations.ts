// Minh họa SVG cho các dòng Việt phục chưa có ảnh chụp studio.
// Trả về data URI nên dùng được trực tiếp trong <img src>, đổi màu theo bảng lụa đã chọn.

export type IllustratedGarmentId =
  | 'ao-tac'
  | 'ao-giao-linh'
  | 'ao-vien-linh'
  | 'ao-dai-cuoi'
  | 'ao-mo-ba'
  | 'ao-com-thai';

const shade = (hex: string, amount: number): string => {
  const n = parseInt(hex.replace('#', ''), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) + 255 * amount);
  const g = clamp(((n >> 8) & 255) + 255 * amount);
  const b = clamp((n & 255) + 255 * amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const isLight = (hex: string): boolean => {
  const n = parseInt(hex.replace('#', ''), 16);
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 170;
};

const frame = (body: string, label: string, ink: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="75%">
      <stop offset="0" stop-color="#FBF8F1"/>
      <stop offset="1" stop-color="#EDE4D3"/>
    </radialGradient>
    <pattern id="van" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M0 14h7v-7h14v14h-7" fill="none" stroke="#C59338" stroke-opacity=".13" stroke-width="1.2"/>
    </pattern>
    <linearGradient id="sheen" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".18"/>
      <stop offset=".45" stop-color="#fff" stop-opacity=".14"/>
      <stop offset="1" stop-color="#000" stop-opacity=".2"/>
    </linearGradient>
  </defs>
  <rect width="300" height="400" fill="url(#bg)"/>
  <rect width="300" height="400" fill="url(#van)"/>
  <rect x="10" y="10" width="280" height="380" fill="none" stroke="#C59338" stroke-opacity=".45"/>
  <ellipse cx="150" cy="372" rx="78" ry="7" fill="#000" fill-opacity=".08"/>
  ${body}
  <text x="150" y="392" text-anchor="middle" font-family="Georgia,serif" font-size="11" letter-spacing="2" fill="${ink}" fill-opacity=".55">${label}</text>
</svg>`;

const builders: Record<IllustratedGarmentId, (p: string, s: string) => string> = {
  // Áo Tấc: lễ phục tay thụng rộng, cổ đứng, dài chấm gót
  'ao-tac': (p, s) => {
    const dark = shade(p, -0.18);
    return `
    <path d="M150 58 L108 70 L40 120 L28 210 L70 214 L92 150 L88 360 L212 360 L208 150 L230 214 L272 210 L260 120 L192 70 Z" fill="${p}"/>
    <path d="M150 58 L108 70 L40 120 L28 210 L70 214 L92 150 L88 360 L212 360 L208 150 L230 214 L272 210 L260 120 L192 70 Z" fill="url(#sheen)"/>
    <path d="M28 210 L70 214 L74 196 L32 190 Z M272 210 L230 214 L226 196 L268 190 Z" fill="${dark}"/>
    <rect x="134" y="50" width="32" height="16" rx="3" fill="${s}"/>
    <path d="M150 66 L186 72 L186 360" fill="none" stroke="${dark}" stroke-width="2"/>
    <circle cx="160" cy="74" r="3" fill="#D4AF37"/><circle cx="178" cy="84" r="3" fill="#D4AF37"/><circle cx="186" cy="100" r="3" fill="#D4AF37"/>
    <path d="M100 330 L100 360 M200 330 L200 360" stroke="${dark}" stroke-width="2"/>
    <rect x="116" y="30" width="68" height="22" rx="6" fill="#1A1C20"/>
    <rect x="116" y="36" width="68" height="3" fill="#D4AF37" fill-opacity=".6"/>`;
  },
  // Áo Giao Lĩnh: cổ chéo vạt phải đè trái, tay rộng, thắt đai, mặc với váy/quần
  'ao-giao-linh': (p, s) => {
    const dark = shade(p, -0.2);
    return `
    <path d="M90 270 L70 362 L230 362 L210 270 Z" fill="${s}"/>
    <path d="M90 270 L70 362 L230 362 L210 270 Z" fill="url(#sheen)"/>
    <path d="M150 52 L110 64 L44 116 L34 200 L74 204 L94 148 L92 290 L208 290 L206 148 L226 204 L266 200 L256 116 L190 64 Z" fill="${p}"/>
    <path d="M150 52 L110 64 L44 116 L34 200 L74 204 L94 148 L92 290 L208 290 L206 148 L226 204 L266 200 L256 116 L190 64 Z" fill="url(#sheen)"/>
    <path d="M118 62 L184 170 L196 162 L132 58 Z" fill="${s}"/>
    <path d="M182 62 L150 116 L140 104 L168 58 Z" fill="${shade(s, -0.1)}"/>
    <rect x="92" y="196" width="116" height="16" fill="${dark}"/>
    <path d="M150 212 L144 262 M156 212 L162 262" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>
    <path d="M34 200 L74 204 L76 188 L38 184 Z M266 200 L226 204 L224 188 L262 184 Z" fill="${s}"/>`;
  },
  // Áo Viên Lĩnh: cổ tròn, tay rộng, bổ tử thêu trước ngực
  'ao-vien-linh': (p, s) => {
    const dark = shade(p, -0.2);
    return `
    <path d="M150 56 L108 68 L40 118 L30 206 L72 210 L92 150 L86 360 L214 360 L208 150 L228 210 L270 206 L260 118 L192 68 Z" fill="${p}"/>
    <path d="M150 56 L108 68 L40 118 L30 206 L72 210 L92 150 L86 360 L214 360 L208 150 L228 210 L270 206 L260 118 L192 68 Z" fill="url(#sheen)"/>
    <circle cx="150" cy="70" r="24" fill="none" stroke="${s}" stroke-width="9"/>
    <rect x="118" y="132" width="64" height="64" fill="${s}" stroke="#D4AF37" stroke-width="3"/>
    <path d="M132 176 C138 150 162 150 168 176 M140 160 l20 0 M150 146 v30" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
    <rect x="90" y="214" width="120" height="10" rx="5" fill="#D4AF37"/>
    <path d="M30 206 L72 210 L74 194 L34 190 Z M270 206 L228 210 L226 194 L266 190 Z" fill="${dark}"/>`;
  },
  // Áo Dài Cưới: áo dài hỷ phục + áo choàng the mỏng + khăn vấn
  'ao-dai-cuoi': (p, s) => {
    const dark = shade(p, -0.15);
    return `
    <path d="M118 210 L102 362 L198 362 L182 210 Z" fill="${s}"/>
    <path d="M150 64 L118 74 L72 120 L60 230 L82 232 L100 150 L104 218 L118 362 L182 362 L196 218 L200 150 L218 232 L240 230 L228 120 L182 74 Z" fill="${p}"/>
    <path d="M150 64 L118 74 L72 120 L60 230 L82 232 L100 150 L104 218 L118 362 L182 362 L196 218 L200 150 L218 232 L240 230 L228 120 L182 74 Z" fill="url(#sheen)"/>
    <path d="M150 64 L96 80 L34 136 L24 248 L76 252 L94 168 L80 362 L220 362 L206 168 L224 252 L276 248 L266 136 L204 80 Z" fill="#fff" fill-opacity=".18" stroke="#D4AF37" stroke-opacity=".7" stroke-width="1.5"/>
    <rect x="136" y="56" width="28" height="14" rx="3" fill="${dark}"/>
    <g fill="#D4AF37">
      <circle cx="150" cy="140" r="14" fill-opacity=".85"/>
      <circle cx="150" cy="140" r="7" fill="${p}"/>
      <path d="M150 170 c-12 18 -12 40 0 60 c12 -20 12 -42 0 -60 z" fill-opacity=".7"/>
    </g>
    <ellipse cx="150" cy="36" rx="40" ry="16" fill="${p}" stroke="#D4AF37" stroke-width="2"/>
    <path d="M114 36 Q150 18 186 36" fill="none" stroke="${dark}" stroke-width="4"/>`;
  },
  // Áo Mớ Ba Mớ Bảy: nhiều lớp áo tứ thân chồng cổ, thắt lưng bao
  'ao-mo-ba': (p, s) => {
    const l2 = shade(p, 0.18);
    const l3 = s;
    return `
    <path d="M100 250 L84 362 L216 362 L200 250 Z" fill="#1A1C20"/>
    <path d="M150 60 L112 70 L60 124 L54 230 L84 232 L100 160 L96 340 L146 340 L150 120 L154 340 L204 340 L200 160 L216 232 L246 230 L240 124 L188 70 Z" fill="${p}"/>
    <path d="M150 60 L112 70 L60 124 L54 230 L84 232 L100 160 L96 340 L146 340 L150 120 L154 340 L204 340 L200 160 L216 232 L246 230 L240 124 L188 70 Z" fill="url(#sheen)"/>
    <path d="M124 66 L150 140 L176 66" fill="none" stroke="${l3}" stroke-width="8"/>
    <path d="M132 64 L150 124 L168 64" fill="none" stroke="${l2}" stroke-width="7"/>
    <path d="M140 62 L150 104 L160 62" fill="none" stroke="#C83337" stroke-width="6"/>
    <rect x="100" y="206" width="100" height="14" fill="${l3}"/>
    <path d="M148 220 l-8 60 M152 220 l8 60" stroke="${l3}" stroke-width="6" stroke-linecap="round"/>
    <path d="M150 220 l-30 50 M150 220 l30 50" stroke="${l2}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="150" cy="36" rx="58" ry="10" fill="#3B2A1A"/>
    <path d="M100 36 L112 20 L188 20 L200 36" fill="#5B4126"/>`;
  },
  // Áo Cóm & Váy Thái: áo ngắn bó sát, hàng khuy bạc hình bướm, váy ống đen chân hoa văn
  'ao-com-thai': (p, s) => {
    const dark = shade(p, -0.2);
    const hem = isLight(s) ? '#9B1D20' : s;
    return `
    <path d="M106 176 L96 362 L204 362 L194 176 Z" fill="#141518"/>
    <path d="M106 176 L96 362 L204 362 L194 176 Z" fill="url(#sheen)"/>
    <rect x="98" y="322" width="104" height="22" fill="${hem}"/>
    <path d="M100 333 l8 -7 l8 7 l8 -7 l8 7 l8 -7 l8 7 l8 -7 l8 7 l8 -7 l8 7 l8 -7 l8 7" fill="none" stroke="#D4AF37" stroke-width="2"/>
    <rect x="100" y="176" width="100" height="10" fill="${hem}"/>
    <path d="M150 64 L118 72 L82 104 L64 216 L86 220 L104 132 L106 182 L194 182 L196 132 L214 220 L236 216 L218 104 L182 72 Z" fill="${p}"/>
    <path d="M150 64 L118 72 L82 104 L64 216 L86 220 L104 132 L106 182 L194 182 L196 132 L214 220 L236 216 L218 104 L182 72 Z" fill="url(#sheen)"/>
    <path d="M150 66 L150 182" stroke="${dark}" stroke-width="2"/>
    <g fill="#E8E8EC" stroke="#9AA0AA" stroke-width="1">
      ${[92, 110, 128, 146, 164].map((y) => `<path d="M144 ${y} l-7 -5 l0 10 z M156 ${y} l7 -5 l0 10 z"/>`).join('')}
    </g>
    <path d="M110 30 Q150 6 190 30 L184 48 Q150 34 116 48 Z" fill="#141518"/>
    <path d="M118 44 Q150 32 182 44" fill="none" stroke="${hem}" stroke-width="3"/>`;
  }
};

const LABELS: Record<IllustratedGarmentId, string> = {
  'ao-tac': 'ÁO TẤC',
  'ao-giao-linh': 'GIAO LĨNH',
  'ao-vien-linh': 'VIÊN LĨNH',
  'ao-dai-cuoi': 'ÁO DÀI CƯỚI',
  'ao-mo-ba': 'MỚ BA MỚ BẢY',
  'ao-com-thai': 'ÁO CÓM THÁI'
};

const cache = new Map<string, string>();

export function garmentIllustrationUrl(id: IllustratedGarmentId, primaryHex: string, secondaryHex = '#F4EFE6'): string {
  const key = `${id}|${primaryHex}|${secondaryHex}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const svg = frame(builders[id](primaryHex, secondaryHex), LABELS[id], '#111215');
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s{2,}/g, ' '))}`;
  cache.set(key, url);
  return url;
}

export const ILLUSTRATED_GARMENT_IDS = Object.keys(LABELS) as IllustratedGarmentId[];
