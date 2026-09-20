import fs from 'fs';
import path from 'path';

const routerUrl = 'https://my-9router-service-s2ia.onrender.com/v1';
const routerKey = 'sk-f28a6d1a3484f1d8-3n2ph3-d4150af7';
const model = 'ag/gemini-3.1-flash-image';

// 7 Popular Heritage Silk Colors
const COLORS = [
  {
    id: 'do-son',
    name: 'Đỏ Son Cung Đình',
    enName: 'Imperial Vermilion Red / Deep Crimson Silk',
    hex: '#9B1D20',
    promptColor: 'rich royal crimson / deep vermilion red silk (Đỏ Son Cung Đình, hex #9B1D20)'
  },
  {
    id: 'trang-lua-nga',
    name: 'Bạch Ngọc Tơ Tằm',
    enName: 'Ivory White Mulberry Silk',
    hex: '#F4EFE6',
    promptColor: 'pure elegant ivory pearl white mulberry silk (Bạch Ngọc Tơ Tằm, hex #F4EFE6)'
  },
  {
    id: 'hong-canh-sen',
    name: 'Hồng Quốc Hoa Liên Hoa',
    enName: 'Lotus Blossom Pink Silk',
    hex: '#CA4F76',
    promptColor: 'graceful pastel lotus blossom pink silk (Hồng Cánh Sen, hex #CA4F76)'
  },
  {
    id: 'vang-hoang-cuc',
    name: 'Vàng Hoàng Cúc Triều Nguyễn',
    enName: 'Imperial Chrysanthemum Gold / Golden Yellow Silk',
    hex: '#C59338',
    promptColor: 'regal imperial golden chrysanthemum yellow silk (Vàng Hoàng Cúc, hex #C59338)'
  },
  {
    id: 'xanh-ngoc-luc',
    name: 'Ngọc Lục Bảo Trân Quý',
    enName: 'Emerald Jade Green Silk',
    hex: '#1D6246',
    promptColor: 'luxurious deep emerald jade green silk (Xanh Ngọc Lục Bảo, hex #1D6246)'
  },
  {
    id: 'tim-hue',
    name: 'Tím Hoa Cà Sông Hương',
    enName: 'Imperial Hue Lavender Violet Silk',
    hex: '#6B3074',
    promptColor: 'romantic imperial Hue royal violet / lavender purple silk (Tím Cố Đô Huế, hex #6B3074)'
  },
  {
    id: 'xanh-cham',
    name: 'Xanh Chàm Nhuộm Lá Tự Nhiên',
    enName: 'Deep Natural Indigo Blue Silk',
    hex: '#182747',
    promptColor: 'heritage deep natural indigo blue silk (Xanh Chàm Cổ, hex #182747)'
  }
];

// 5 Garments & their base images + default color matching
const GARMENTS = [
  {
    id: 'ao_dai',
    name: 'Áo Dài Truyền Thống',
    baseImage: 'public/images/viet_phuc/ao_dai.jpg',
    defaultColorId: 'trang-lua-nga',
    culturalPrompt: 'traditional Vietnamese Ao Dai tunic and matching silk trousers'
  },
  {
    id: 'ao_ngu_than',
    name: 'Áo Ngũ Thân Lập Lĩnh',
    baseImage: 'public/images/viet_phuc/ao_ngu_than.jpg',
    defaultColorId: 'vang-hoang-cuc',
    culturalPrompt: 'historical aristocratic Vietnamese Ao Ngu Than (five-panel standing-collar tunic)'
  },
  {
    id: 'ao_nhat_binh',
    name: 'Áo Nhật Bình Cung Đình',
    baseImage: 'public/images/viet_phuc/ao_nhat_binh.jpg',
    defaultColorId: 'tim-hue',
    culturalPrompt: 'Nguyen Dynasty royal court Ao Nhat Binh gown with iconic rectangular embroidered collar displaying multi-color banded ribbons'
  },
  {
    id: 'ao_tu_than',
    name: 'Áo Tứ Thân Kinh Bắc',
    baseImage: 'public/images/viet_phuc/ao_tu_than.jpg',
    defaultColorId: 'xanh-cham',
    culturalPrompt: 'traditional northern Vietnamese Ao Tu Than (four-panel tunic layered over silk yếm halter bodice and waist sash)'
  },
  {
    id: 'ao_ba_ba',
    name: 'Áo Bà Ba Nam Bộ',
    baseImage: 'public/images/viet_phuc/ao_ba_ba.jpg',
    defaultColorId: 'do-son',
    culturalPrompt: 'traditional Southern Vietnamese Ao Ba Ba blouse and flowing pants'
  }
];

const outDir = 'public/images/viet_phuc';

async function generateRecolor(garment, color) {
  const targetFile = path.join(outDir, `${garment.id}_${color.id}.jpg`);

  // Check if target file already exists and is non-empty
  if (fs.existsSync(targetFile)) {
    const stat = fs.statSync(targetFile);
    if (stat.size > 20000) {
      console.log(`[SKIP] Already exists: ${targetFile} (${stat.size} bytes)`);
      return true;
    }
  }

  // If this color matches the default color of the base image, copy directly!
  if (color.id === garment.defaultColorId && fs.existsSync(garment.baseImage)) {
    fs.copyFileSync(garment.baseImage, targetFile);
    console.log(`[COPY] Copied base image for ${garment.id} (${color.id}): ${targetFile}`);
    return true;
  }

  // Read base image
  const baseImgBuf = fs.readFileSync(garment.baseImage);
  const base64Ref = `data:image/jpeg;base64,${baseImgBuf.toString('base64')}`;

  const prompt = `You are a world-class fashion product photographer and cultural colorist specializing in Vietnamese heritage attire.
TASK: RECOLOR the ${garment.culturalPrompt} shown in this reference photo to:
COLOR: ${color.promptColor}.

CRITICAL REQUIREMENTS:
1. ABSOLUTELY NO HUMAN WEARER: Keep the exact ghost-mannequin / invisible mannequin isolated product look from the reference photo. Do NOT add any human head, face, neck, legs, hands, or skin.
2. PRESERVE ORIGINAL TAILORING & SHAPE: Maintain the identical silhouette, collar, buttons, lapels, sleeves, draping folds, and proportions of this specific Vietnamese garment.
3. PRESERVE SPECIAL ORNAMENTS: If this is Ao Nhat Binh, keep the iconic multi-color rainbow banded stripes and embroidery around the rectangular collar while recoloring the main body fabric.
4. SILK & BROCADE REALISM: Render rich Vietnamese mulberry silk / satin / brocade with exquisite subtle woven textures (hoa văn chìm) responding naturally to clean studio lighting.
5. CLEAN STUDIO BACKGROUND: Pure bright neutral grey/white studio backdrop with soft ambient floor shadow matching the reference photo.
Output an ultra-high resolution catalog product photograph.`;

  console.log(`[GEN] Generating ${garment.name} -> ${color.name}...`);

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
        signal: AbortSignal.timeout(45000)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[WARN] Attempt ${attempt} failed (${res.status}): ${errText.slice(0, 150)}`);
        await new Promise((r) => setTimeout(r, 3000 * attempt));
        continue;
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      const match = content?.match(/data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/);
      if (match) {
        const outBuf = Buffer.from(match[2], 'base64');
        fs.writeFileSync(targetFile, outBuf);
        console.log(`[SUCCESS] Saved ${targetFile} (${outBuf.length} bytes)`);
        return true;
      }

      const urlMatch = content?.match(/https?:\/\/[^\s"'\<\>]+\.(?:png|jpe?g|webp|gif)/i)?.[0];
      if (urlMatch) {
        const r = await fetch(urlMatch);
        if (r.ok) {
          const ab = await r.arrayBuffer();
          fs.writeFileSync(targetFile, Buffer.from(ab));
          console.log(`[SUCCESS] Downloaded and saved ${targetFile} (${ab.byteLength} bytes)`);
          return true;
        }
      }

      console.warn(`[WARN] Attempt ${attempt}: No image found in response.`);
      await new Promise((r) => setTimeout(r, 2000));
    } catch (e) {
      console.warn(`[ERROR] Attempt ${attempt} exception: ${e.message}`);
      await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }

  return false;
}

async function main() {
  console.log('=== BẮT ĐẦU SINH BIẾN THỂ MÀU CỔ PHỤC (5 ÁO × 7 MÀU) ===');
  let successCount = 0;
  let totalTasks = GARMENTS.length * COLORS.length;

  for (const garment of GARMENTS) {
    console.log(`\n--- Dòng áo: ${garment.name} ---`);
    for (const color of COLORS) {
      const ok = await generateRecolor(garment, color);
      if (ok) successCount++;
      // Polite delay between API calls to avoid rate limits
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log(`\n=== HOÀN TẤT: ${successCount}/${totalTasks} ảnh biến thể màu sắc đã sẵn sàng! ===`);
}

main();
