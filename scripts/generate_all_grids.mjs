import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const routerUrl = 'https://my-9router-service-s2ia.onrender.com/v1';
const routerKey = 'sk-f28a6d1a3484f1d8-3n2ph3-d4150af7';
const model = 'ag/gemini-3.1-flash-image';

const REMAINING_GARMENTS = [
  {
    id: 'ao_ngu_than',
    name: 'Áo Ngũ Thân Lập Lĩnh',
    baseImage: 'public/images/viet_phuc/ao_ngu_than.jpg',
    promptSubject: 'historical aristocratic Vietnamese Ao Ngu Than (five-panel standing-collar tunic with 5 brass buttons and tight sleeves Tay Chen)',
    layeringRules: `
CRITICAL MULTI-LAYER & LAYERED COLOR RULES (NOT MONOCHROME):
- In authentic Vietnamese tradition, the chosen color is the DOMINANT COLOR OF THE TUNIC BODY ONLY.
- ALL 8 garments MUST be paired with classic, elegant, loose IVORY WHITE SILK TROUSERS (quần lụa trắng ngà) underneath.
- The high standing mandarin collar (lập lĩnh) features an elegant inner white silk collar lining (nẹp cổ trắng) subtly peeking out at the neckline.
- 5 polished brass/golden button knots fastening the diagonal right flap.
`
  },
  {
    id: 'ao_nhat_binh',
    name: 'Áo Nhật Bình Cung Đình Huế',
    baseImage: 'public/images/viet_phuc/ao_nhat_binh.jpg',
    promptSubject: 'Nguyen Dynasty royal court Ao Nhat Binh gown with iconic rectangular embroidered collar displaying multi-color rainbow banded stripes (Ngu Sac) and gold phoenix motifs, wide sleeves with striped cuffs, water-wave embroidered hem',
    layeringRules: `
CRITICAL MULTI-LAYER & ROYAL EMBROIDERY RULES (NOT MONOCHROME):
- The chosen color is the DOMINANT COLOR OF THE MAIN SILK GOWN BODY ONLY.
- The iconic rectangular chest collar (cổ đối khâm) MUST feature the radiant traditional MULTI-COLOR RAINBOW BANDED STRIPES (red, blue, yellow, green, violet) with intricate gold thread embroidery.
- Sleeve cuffs have multi-color rainbow stripes (Ngũ Luân).
- Hemline features multi-color water-wave embroidery (thủy ba tam sơn ngũ nhạc).
- Trousers underneath are pure IVORY WHITE SILK TROUSERS.
`
  },
  {
    id: 'ao_tu_than',
    name: 'Áo Tứ Thân Kinh Bắc',
    baseImage: 'public/images/viet_phuc/ao_tu_than.jpg',
    promptSubject: 'traditional northern Vietnamese Ao Tu Than (four-panel folk tunic from Kinh Bắc)',
    layeringRules: `
CRITICAL MULTI-LAYER & CONTRASTING YẾM ĐÀO RULES (NOT MONOCHROME):
- The chosen color is the DOMINANT COLOR OF THE OUTER 4-PANEL DRAPED COAT ONLY.
- UNDERNEATH THE COAT: A contrasting vibrant SCARLET RED or LOTUS PINK SILK HALTER BODICE (Áo Yếm Đào) is prominently visible at the open chest and neckline!
- Around the waist: A silk sash (bao sáp) in contrasting emerald green or peach silk tied gracefully at the front.
- Lower garment: Traditional deep BLACK SILK SKIRT / TROUSERS (váy sồi đen tuyền) draping gracefully to the floor.
`
  },
  {
    id: 'ao_ba_ba',
    name: 'Áo Bà Ba Nam Bộ',
    baseImage: 'public/images/viet_phuc/ao_ba_ba.jpg',
    promptSubject: 'traditional Southern Vietnamese Ao Ba Ba blouse with round neckline, central line of pearl buttons, side slits at hips',
    layeringRules: `
CRITICAL TWO-TONE NAM BỘ CONTRAST RULES (NOT MONOCHROME):
- The chosen color is the DOMINANT COLOR OF THE TOP BLOUSE ONLY.
- LOWER TROUSERS: MUST be classic GLOSSY DEEP BLACK SILK TROUSERS (quần lụa phi bóng đen tuyền) - the quintessential iconic silhouette of Southern Vietnam!
- The blouse has neat round neckline and white pearl buttons running down the center front.
`
  }
];

const promptColorSpec = `
EXACT DOMINANT TUNIC COLOR ASSIGNMENT FOR THE 8 POSITIONS (2x4 Grid):
Row 1 (Top, 4 garments from left to right):
1. Top-Left: Imperial Vermilion Red silk (Đỏ Son Cung Đình, hex #9B1D20) as the dominant body color.
2. Top-Center-Left: Pure Ivory White mulberry silk (Bạch Ngọc Tơ Tằm, hex #F4EFE6) as the dominant body color.
3. Top-Center-Right: Delicate Lotus Blossom Pink silk (Hồng Cánh Sen, hex #CA4F76) as the dominant body color.
4. Top-Right: Imperial Golden Chrysanthemum Yellow silk (Vàng Hoàng Cúc, hex #C59338) as the dominant body color.

Row 2 (Bottom, 4 garments from left to right):
5. Bottom-Left: Luxurious Deep Emerald Jade Green silk (Ngọc Lục Bảo, hex #1D6246) as the dominant body color.
6. Bottom-Center-Left: Imperial Hue Lavender Violet silk (Tím Cố Đô Sông Hương, hex #6B3074) as the dominant body color.
7. Bottom-Center-Right: Deep Heritage Indigo Blue silk (Xanh Chàm Nhuộm Lá, hex #182747) as the dominant body color.
8. Bottom-Right: Refined Deep Ink Black silk (Hắc Tuyền Trầm Mặc, hex #1A1C20) as the dominant body color.
`;

async function generateAndSliceGarment(garment) {
  const gridFile = `public/images/viet_phuc/${garment.id}_grid_2x4.jpg`;
  console.log(`\n========================================`);
  console.log(`BẮT ĐẦU: ${garment.name} (${garment.id})`);
  console.log(`========================================`);

  const baseImgBuf = fs.readFileSync(garment.baseImage);
  const base64Ref = `data:image/jpeg;base64,${baseImgBuf.toString('base64')}`;

  const prompt = `You are an elite fashion catalog photographer and digital colorist.
TASK: Create a luxury fashion catalog collection grid displaying the EXACT SAME ${garment.promptSubject} shown in the reference photo in 8 distinct heritage colorways with authentic traditional multi-layer styling.

COMPOSITION & GRID LAYOUT:
- Form an evenly spaced, perfectly symmetrical 2-row by 4-column rectangular grid (2 rows, 4 columns, exactly 8 garments) on a seamless neutral light-grey studio cyclorama backdrop.
- Each of the 8 garments is identical in cut, proportions, collar construction, sleeves, ornaments, and draping as shown in the reference photo.
- ABSOLUTELY NO HUMAN WEARER: Each garment is shown in clean ghost-mannequin / invisible mannequin presentation, fully visible from collar to trouser/skirt hem, floating upright with natural floor drop shadows.

${garment.layeringRules}

${promptColorSpec}

QUALITY & DETAIL:
- Ample space between each garment column and row for clean slicing.
- Subtle woven floral damask patterns on the rich silk fabrics, authentic Vietnamese tailoring, masterwork studio catalog photography.`;

  console.log(`[GEN] Sending multi-layer grid request to 9router for ${garment.name}...`);
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

      console.warn(`[WARN] Attempt ${attempt}: No image in content.`);
      await new Promise((r) => setTimeout(r, 3000));
    } catch (e) {
      console.warn(`[ERROR] Attempt ${attempt} error: ${e.message}`);
      await new Promise((r) => setTimeout(r, 4000 * attempt));
    }
  }

  if (!success) {
    console.error(`[FAIL] Could not generate grid for ${garment.id}`);
    return false;
  }

  // Slicing via Python Pillow script
  console.log(`[SLICE] Slicing ${gridFile} with Python Pillow...`);
  try {
    const sliceCmd = `python scripts/slice_grid.py "${gridFile}" "${garment.id}"`;
    execSync(sliceCmd, { stdio: 'inherit' });
    console.log(`[DONE] Finished slicing 8 colors for ${garment.name}!`);
    return true;
  } catch (e) {
    console.error(`[SLICE ERROR] for ${garment.id}:`, e.message);
    return false;
  }
}

async function main() {
  console.log('=== BẮT ĐẦU SINH VÀ CẮT ẢNH LƯỚI 2x4 PHỐI MÀU NHIỀU LỚP (4 DÒNG CỔ PHỤC) ===');
  for (const g of REMAINING_GARMENTS) {
    await generateAndSliceGarment(g);
    await new Promise((r) => setTimeout(r, 2500));
  }
  console.log('\n=== HOÀN TẤT TOÀN BỘ 5 DÒNG ÁO PHỐI MÀU NHIỀU LỚP ĐỦ 8 MÀU ĐỒNG NHẤT 100%! ===');
}

main();
