import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const routerUrl = 'https://my-9router-service-s2ia.onrender.com/v1';
const routerKey = 'sk-f28a6d1a3484f1d8-3n2ph3-d4150af7';
const model = 'ag/gemini-3.1-flash-image';

const GARMENTS_CONFIG = [
  {
    id: 'ao_dai',
    name: 'Áo Dài Truyền Thống Tân Thời',
    baseImage: 'public/images/viet_phuc/ao_dai.jpg',
    subject: 'traditional Vietnamese Ao Dai silk tunic with high standing collar, form-fitting cut, and long split flowing front and back panels',
    layeringRules: `
CRITICAL MULTI-LAYER STYLING RULES:
- The chosen color is the DOMINANT COLOR OF THE TUNIC BODY ONLY.
- Each tunic is paired with flowing, elegant IVORY WHITE MULBERRY SILK TROUSERS (quần lụa trắng ngà) underneath (for the white tunic, paired with contrasting black/white silk trousers).
`,
    colorIds: [
      'ao_dai_do-son',
      'ao_dai_trang-lua-nga',
      'ao_dai_hong-canh-sen',
      'ao_dai_xanh-ngoc-luc'
    ],
    colorSpec: `
EXACT 4 COLORWAYS ACROSS THE 4 COLUMNS (from left to right):
1. Column 1 (Leftmost): Imperial Vermilion Red silk (Đỏ Son Cát Tường, hex #9B1D20) dominant tunic + ivory white trousers.
2. Column 2 (Center-Left): Pure Ivory White silk (Bạch Ngọc Nữ Sinh, hex #F4EFE6) dominant tunic + pure white/black trousers.
3. Column 3 (Center-Right): Delicate Lotus Pink silk (Hồng Sen Thanh Lịch, hex #CA4F76) dominant tunic + ivory white trousers.
4. Column 4 (Rightmost): Royal Emerald Jade Green silk (Ngọc Bích Quý Phái, hex #1D6246) dominant tunic + ivory white trousers.
`
  },
  {
    id: 'ao_nhat_binh',
    name: 'Áo Nhật Bình Cung Đình Huế',
    baseImage: 'public/images/viet_phuc/ao_nhat_binh.jpg',
    subject: 'Nguyen Dynasty royal court Ao Nhat Binh gown with iconic rectangular embroidered chest collar (co doi kham) displaying vibrant multi-color rainbow banded stripes (Ngu Sac) and intricate gold thread embroidery, wide sleeves with striped cuffs, water-wave embroidered hem',
    layeringRules: `
CRITICAL ROYAL MULTI-LAYER RULES:
- The chosen color is the DOMINANT COLOR OF THE MAIN SILK GOWN BODY ONLY.
- ALL 4 gowns MUST display the iconic rectangular chest collar with radiant MULTI-COLOR RAINBOW BANDED STRIPES and gold embroidery.
- Sleeve cuffs have multi-color rainbow stripes.
- Hemline features multi-color water-wave embroidery (thủy ba).
- Underneath: Pure IVORY WHITE SILK TROUSERS.
`,
    colorIds: [
      'ao_nhat_binh_vang-hoang-cuc',
      'ao_nhat_binh_do-son',
      'ao_nhat_binh_tim-hue',
      'ao_nhat_binh_xanh-ngoc-luc'
    ],
    colorSpec: `
EXACT 4 COLORWAYS ACROSS THE 4 COLUMNS (from left to right):
1. Column 1 (Leftmost): Imperial Golden Chrysanthemum Yellow gown (Vàng Chính Hoàng Triều Nguyễn, hex #C59338) dominant body (Empress / Queen rank) + rainbow collar + white trousers.
2. Column 2 (Center-Left): Imperial Vermilion Crimson gown (Đỏ Xích Đào Cung Đình, hex #9B1D20) dominant body (Princess rank) + rainbow collar + white trousers.
3. Column 3 (Center-Right): Imperial Hue Violet gown (Tím Cố Đô Sông Hương, hex #6B3074) dominant body (First-rank noble lady) + rainbow collar + white trousers.
4. Column 4 (Rightmost): Royal Emerald Jade Green gown (Thanh Ngọc Bát Bảo, hex #1D6246) dominant body (Consort rank) + rainbow collar + white trousers.
`
  },
  {
    id: 'ao_ngu_than',
    name: 'Áo Ngũ Thân Lập Lĩnh',
    baseImage: 'public/images/viet_phuc/ao_ngu_than.jpg',
    subject: 'historical aristocratic Vietnamese Ao Ngu Than (five-panel standing-collar tunic with 5 brass buttons and tight sleeves Tay Chen)',
    layeringRules: `
CRITICAL ARISTOCRATIC MULTI-LAYER RULES:
- The chosen color is the DOMINANT COLOR OF THE TUNIC BODY ONLY.
- ALL 4 tunics MUST be paired with classic, loose IVORY WHITE SILK TROUSERS (quần lụa trắng ngà) underneath.
- High standing mandarin collar (lập lĩnh) features an elegant inner WHITE SILK COLLAR LINING (nẹp cổ trắng) subtly peeking out at the neckline.
- 5 polished brass/golden button knots fastening the diagonal right flap.
`,
    colorIds: [
      'ao_ngu_than_xanh-cham',
      'ao_ngu_than_vang-hoang-cuc',
      'ao_ngu_than_den-tuyen',
      'ao_ngu_than_do-son'
    ],
    colorSpec: `
EXACT 4 COLORWAYS ACROSS THE 4 COLUMNS (from left to right):
1. Column 1 (Leftmost): Deep Heritage Indigo Blue tunic (Xanh Chàm Nho Sinh, hex #182747) dominant body + white collar lining + white trousers.
2. Column 2 (Center-Left): Imperial Golden Ochre tunic (Vàng Cúc Vương Giả, hex #C59338) dominant body + white collar lining + white trousers.
3. Column 3 (Center-Right): Refined Deep Ink Black tunic (Hắc Tuyền Trầm Mặc, hex #1A1C20) dominant body + crisp white collar lining + white trousers.
4. Column 4 (Rightmost): Imperial Vermilion Red silk tunic (Đỏ Son Hỷ Sự, hex #9B1D20) dominant body + white collar lining + white trousers.
`
  },
  {
    id: 'ao_tu_than',
    name: 'Áo Tứ Thân Kinh Bắc',
    baseImage: 'public/images/viet_phuc/ao_tu_than.jpg',
    subject: 'traditional northern Vietnamese Ao Tu Than (four-panel folk tunic from Kinh Bắc folk culture)',
    layeringRules: `
CRITICAL MULTI-LAYER & CONTRASTING YẾM ĐÀO BODICE RULES:
- The chosen color is the DOMINANT COLOR OF THE OUTER 4-PANEL DRAPED COAT ONLY.
- UNDERNEATH THE COAT: A contrasting vibrant SCARLET RED or LOTUS PINK SILK HALTER BODICE (Áo Yếm Đào) is prominently visible at the open chest and neckline!
- Around the waist: A contrasting silk sash (bao sáp) tied gracefully at the front.
- Lower garment: Traditional deep BLACK SILK SKIRT / TROUSERS (váy sồi đen tuyền) draping gracefully to the floor.
`,
    colorIds: [
      'ao_tu_than_nau-gu',
      'ao_tu_than_vang-hoang-cuc',
      'ao_tu_than_hong-canh-sen',
      'ao_tu_than_xanh-cham'
    ],
    colorSpec: `
EXACT 4 COLORWAYS ACROSS THE 4 COLUMNS (from left to right):
1. Column 1 (Leftmost): Heritage Chestnut Brown silk coat (Nâu Gụ Hạt Dẻ Kinh Bắc, hex #5C3A21 - the most iconic Quan Họ folk color!) + vibrant Scarlet Red Halter Bodice (Yếm Đào Đỏ Son #9B1D20) at chest + green sash + deep black skirt.
2. Column 2 (Center-Left): Warm Golden Chrysanthemum Yellow coat (Vàng Tơ Cúc Yếm Đào, hex #C59338) + lotus pink bodice + green sash + deep black skirt.
3. Column 3 (Center-Right): Delicate Lotus Pink coat (Hồng Sen Trẩy Hội, hex #CA4F76) + scarlet red bodice + pink sash + deep black skirt.
4. Column 4 (Rightmost): Deep Heritage Indigo Blue coat (Chàm Then Cổ Truyền, hex #182747) + lotus pink bodice + green sash + deep black skirt.
`
  },
  {
    id: 'ao_ba_ba',
    name: 'Áo Bà Ba Nam Bộ',
    baseImage: 'public/images/viet_phuc/ao_ba_ba.jpg',
    subject: 'traditional Southern Vietnamese Ao Ba Ba blouse with round neckline, central line of pearl buttons, side hip slits',
    layeringRules: `
CRITICAL TWO-TONE NAM BỘ CONTRAST RULES:
- The chosen color is the DOMINANT COLOR OF THE TOP BLOUSE ONLY.
- LOWER TROUSERS: ALL 4 MUST be paired with quintessential GLOSSY DEEP BLACK SILK TROUSERS (quần lụa phi bóng đen tuyền)!
- The blouse has neat round neckline and white pearl buttons running down the center front.
`,
    colorIds: [
      'ao_ba_ba_nau-song',
      'ao_ba_ba_hong-canh-sen',
      'ao_ba_ba_xanh-ngoc-luc',
      'ao_ba_ba_trang-lua-nga'
    ],
    colorSpec: `
EXACT 4 COLORWAYS ACROSS THE 4 COLUMNS (from left to right):
1. Column 1 (Leftmost): Heritage Earthy Brown blouse (Nâu Sồng Đất Phù Sa Nam Bộ, hex #664228 - the iconic rustic Southern look!) + pearl buttons + glossy deep black silk trousers.
2. Column 2 (Center-Left): Delicate Lotus Pink blouse (Hồng Sen Miệt Vườn, hex #CA4F76) + pearl buttons + glossy deep black silk trousers.
3. Column 3 (Center-Right): Fresh Emerald Green blouse (Xanh Ngọc Phù Sa, hex #1D6246) + pearl buttons + glossy deep black silk trousers.
4. Column 4 (Rightmost): Pure Ivory White blouse (Trắng Khôi Nguyên, hex #F4EFE6) + pearl buttons + glossy deep black silk trousers.
`
  }
];

async function generateAndSlice1x4(garment) {
  const gridFile = `public/images/viet_phuc/${garment.id}_grid_1x4.jpg`;
  console.log(`\n======================================================`);
  console.log(`BẮT ĐẦU SINH LƯỚI 1x4: ${garment.name} (${garment.id})`);
  console.log(`======================================================`);

  const baseImgBuf = fs.readFileSync(garment.baseImage);
  const base64Ref = `data:image/jpeg;base64,${baseImgBuf.toString('base64')}`;

  const prompt = `You are a world-class Vietnamese fashion catalog photographer and digital colorist.
TASK: Create a museum-grade luxury fashion catalog lineup displaying the EXACT SAME ${garment.subject} shown in the reference photo in EXACTLY 4 ICONIC HERITAGE COLORWAYS arranged in a single horizontal row.

COMPOSITION & 1x4 HORIZONTAL LINEUP:
- Form an evenly spaced horizontal line of EXACTLY 4 GARMENTS (1 row, 4 columns) side-by-side standing on the same level ground against a clean, neutral seamless light-grey studio cyclorama backdrop.
- Each of the 4 garments is IDENTICAL in cut, proportions, collar construction, sleeves, ornaments, and draping as shown in the reference photo.
- ABSOLUTELY NO HUMAN WEARERS: Each outfit is shown in clean invisible ghost-mannequin presentation, floating upright with natural soft floor drop shadows, fully visible from neckline down to trouser/skirt hem.
- Leave comfortable spacing between adjacent garments so they never overlap.

${garment.layeringRules}

${garment.colorSpec}

QUALITY & FINISH:
- Subtle authentic silk weaves (gấm hoa, lụa Hà Đông, lụa tơ tằm), crisp tailored seams, flawless studio lighting. Masterwork catalog photograph.`;

  console.log(`[GEN] Sending 1x4 grid request to 9router for ${garment.name}...`);
  let success = false;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${routerUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${routerKey}`
        },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: base64Ref } }
              ]
            }
          ]
        }),
        signal: AbortSignal.timeout(60000)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[WARN] Attempt ${attempt} failed (${res.status}): ${errText.slice(0, 150)}`);
        await new Promise((r) => setTimeout(r, 4000 * attempt));
        continue;
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      const match = content?.match(/data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/);
      if (match) {
        const outBuf = Buffer.from(match[2], 'base64');
        fs.writeFileSync(gridFile, outBuf);
        console.log(`[SUCCESS] Saved ${gridFile} (${outBuf.length} bytes)`);
        success = true;
        break;
      }

      const urlMatch = content?.match(/https?:\/\/[^\s"'\<\>]+\.(?:png|jpe?g|webp|gif)/i)?.[0];
      if (urlMatch) {
        const r = await fetch(urlMatch);
        const ab = await r.arrayBuffer();
        fs.writeFileSync(gridFile, Buffer.from(ab));
        console.log(`[SUCCESS] Downloaded and saved ${gridFile} (${ab.byteLength} bytes)`);
        success = true;
        break;
      }

      console.warn(`[WARN] Attempt ${attempt}: No image found in response.`);
      await new Promise((r) => setTimeout(r, 3000));
    } catch (e) {
      console.warn(`[ERROR] Attempt ${attempt} error: ${e.message}`);
      await new Promise((r) => setTimeout(r, 4000 * attempt));
    }
  }

  if (!success) {
    console.error(`[FAIL] Could not generate 1x4 grid for ${garment.id}`);
    return false;
  }

  // Slicing via Python Pillow script
  console.log(`[SLICE] Slicing ${gridFile} into 4 square 1024x1024 images...`);
  try {
    const cidsArg = garment.colorIds.join(',');
    const sliceCmd = `python scripts/slice_grid_1x4.py "${gridFile}" "public/images/viet_phuc" "${cidsArg}"`;
    execSync(sliceCmd, { stdio: 'inherit' });
    console.log(`[DONE] Sliced all 4 curated colors for ${garment.name}!`);
    return true;
  } catch (e) {
    console.error(`[SLICE ERROR] for ${garment.id}:`, e.message);
    return false;
  }
}

async function main() {
  console.log('=== BẮT ĐẦU SINH MỚI HOÀN TOÀN 5 BỘ LƯỚI 1x4 CHO 5 DÒNG CỔ PHỤC ===');
  for (const g of GARMENTS_CONFIG) {
    await generateAndSlice1x4(g);
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log('\n=== HOÀN TẤT SINH MỚI TOÀN BỘ 20 ẢNH 4 BẢN PHỐI KINH ĐIỂN CHO 5 DÒNG ÁO! ===');
}

main();
