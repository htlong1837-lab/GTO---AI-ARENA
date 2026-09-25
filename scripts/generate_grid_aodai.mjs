import fs from 'fs';
import path from 'path';

const routerUrl = 'https://my-9router-service-s2ia.onrender.com/v1';
const routerKey = process.env.ROUTER_API_KEY || (fs.readFileSync('.env', 'utf-8').match(/^ROUTER_API_KEY=(.+)$/m) || [])[1]?.trim();
const model = 'ag/gemini-3.1-flash-image';

// Read reference image (original white Ao Dai)
const refImgBuf = fs.readFileSync('public/images/viet_phuc/ao_dai.jpg');
const base64Ref = `data:image/jpeg;base64,${refImgBuf.toString('base64')}`;

const prompt = `You are an elite fashion catalog photographer and digital colorist.
TASK: Create a luxury fashion catalog collection grid displaying the EXACT SAME traditional Vietnamese Ao Dai from the reference photo in 8 distinct heritage silk colors.

CRITICAL MULTI-LAYER & TWO-TONE COLOR RULE (NOT MONOCHROME):
- In authentic Vietnamese fashion, the chosen color is the DOMINANT COLOR OF THE TUNIC BODY ONLY.
- It is NOT a single solid monochrome color from top to bottom!
- ALL 8 garments MUST be paired with classic, elegant, flowing IVORY WHITE MULBERRY SILK TROUSERS (quần lụa trắng ngà) underneath the split panels (except the all-white tunic which is paired with black or crimson silk trousers for contrast).
- High mandarin collar has delicate inner white silk lining trim and pearl/golden buttons.

COMPOSITION & GRID LAYOUT:
- Form an evenly spaced, perfectly symmetrical 2-row by 4-column rectangular grid (2 rows, 4 columns, exactly 8 garments) on a seamless neutral light-grey studio cyclorama backdrop.
- Each of the 8 garments is identical in silhouette, cut, proportions, high mandarin collar, diagonal buttons, fluttering split panels extending over the wide flowing trousers as shown in the reference photo.
- ABSOLUTELY NO HUMAN WEARER: Each garment is shown in clean ghost-mannequin / invisible mannequin presentation, fully visible from collar to trouser hem, floating upright with natural floor drop shadows.

EXACT DOMINANT TUNIC COLOR ASSIGNMENT FOR THE 8 POSITIONS (All with flowing white silk trousers):
Row 1 (Top, 4 garments from left to right):
1. Top-Left: Imperial Vermilion Red tunic (Đỏ Son Cung Đình #9B1D20) over flowing ivory white silk trousers.
2. Top-Center-Left: Pure Ivory White tunic (Bạch Ngọc Tơ Tằm #F4EFE6) over sleek black silk trousers.
3. Top-Center-Right: Delicate Lotus Blossom Pink tunic (Hồng Cánh Sen #CA4F76) over flowing ivory white silk trousers.
4. Top-Right: Imperial Golden Chrysanthemum Yellow tunic (Vàng Hoàng Cúc #C59338) over flowing ivory white silk trousers.

Row 2 (Bottom, 4 garments from left to right):
5. Bottom-Left: Luxurious Deep Emerald Jade Green tunic (Ngọc Lục Bảo #1D6246) over flowing ivory white silk trousers.
6. Bottom-Center-Left: Imperial Hue Lavender Violet tunic (Tím Cố Đô Sông Hương #6B3074) over flowing ivory white silk trousers.
7. Bottom-Center-Right: Deep Heritage Indigo Blue tunic (Xanh Chàm Cổ #182747) over flowing ivory white silk trousers.
8. Bottom-Right: Refined Deep Ink Black tunic (Hắc Tuyền Trầm Mặc #1A1C20) over flowing ivory white silk trousers.

QUALITY & DETAIL:
- Clear separation between the vibrant silk tunic body and the flowing ivory white trousers beneath.
- Subtle woven floral damask patterns on the rich silk fabrics, authentic Vietnamese tailoring, masterwork studio catalog photography.`;

console.log('Sending multi-layer grid request to 9router...');

async function run() {
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
      })
    });

    console.log('Status:', res.status);
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;

    const match = content?.match(/data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/);
    if (match) {
      const outBuf = Buffer.from(match[2], 'base64');
      const outFile = 'public/images/viet_phuc/ao_dai_grid_2x4.jpg';
      fs.writeFileSync(outFile, outBuf);
      console.log(`SUCCESS! Saved ${outFile} (${outBuf.length} bytes)`);
    } else {
      const urlMatch = content?.match(/https?:\/\/[^\s"'\<\>]+\.(?:png|jpe?g|webp|gif)/i)?.[0];
      if (urlMatch) {
        const r = await fetch(urlMatch);
        const ab = await r.arrayBuffer();
        const outFile = 'public/images/viet_phuc/ao_dai_grid_2x4.jpg';
        fs.writeFileSync(outFile, Buffer.from(ab));
        console.log(`SUCCESS! Downloaded and saved ${outFile} (${ab.byteLength} bytes)`);
      } else {
        console.log('No image found in response:', content?.slice(0, 300));
      }
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

run();
