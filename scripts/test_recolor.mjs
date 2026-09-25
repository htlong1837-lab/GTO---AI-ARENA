import fs from 'fs';
import path from 'path';

const routerUrl = 'https://my-9router-service-s2ia.onrender.com/v1';
const routerKey = process.env.ROUTER_API_KEY || (fs.readFileSync('.env', 'utf-8').match(/^ROUTER_API_KEY=(.+)$/m) || [])[1]?.trim();
const model = 'ag/gemini-3.1-flash-image';

// Read reference image (white Ao Dai)
const refImgBuf = fs.readFileSync('public/images/viet_phuc/ao_dai.jpg');
const base64Ref = `data:image/jpeg;base64,${refImgBuf.toString('base64')}`;

const prompt = `You are an expert Vietnamese cultural fashion photographer and digital colorist.
Task: RECOLOR the traditional Vietnamese Ao Dai shown in this reference photo to:
COLOR: Đỏ Son Cung Đình (Imperial Vermilion Red, Deep Crimson Silk, hex #9B1D20).

STRICT PRESERVATION RULES:
1. NO HUMAN MODEL, NO PERSON, NO HEAD, NO FACE: Keep the exact isolated ghost-mannequin / invisible mannequin product presentation from the reference image.
2. PRESERVE THE SILHOUETTE & CUT: Retain the identical flowing split-panel cut, high mandarin collar, diagonal buttons, and delicate silk folds of this exact Ao Dai.
3. FABRIC TEXTURE: Render rich Vietnamese brocade / smooth mulberry silk with subtle woven floral patterns (hoa văn gấm mai lan cúc trúc) reflecting natural studio light.
4. BACKGROUND: Pure neutral clean studio background with soft natural floor shadow, identical to the reference image.
5. High resolution, ultra-crisp studio product catalog photograph for luxury Vietnamese heritage fashion.`;

console.log('Sending request to 9router...');

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
    console.log('Content preview:', typeof content === 'string' ? content.slice(0, 200) : content);

    const match = content?.match(/data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/);
    if (match) {
      const outBuf = Buffer.from(match[2], 'base64');
      fs.writeFileSync('public/images/viet_phuc/ao_dai_do-son.jpg', outBuf);
      console.log('SUCCESS! Saved ao_dai_do-son.jpg, size:', outBuf.length);
    } else {
      const urlMatch = content?.match(/https?:\/\/[^\s"'\<\>]+\.(?:png|jpe?g|webp|gif)/i)?.[0];
      if (urlMatch) {
        console.log('Found URL:', urlMatch);
        const r = await fetch(urlMatch);
        const ab = await r.arrayBuffer();
        fs.writeFileSync('public/images/viet_phuc/ao_dai_do-son.jpg', Buffer.from(ab));
        console.log('Saved from URL, size:', ab.byteLength);
      } else {
        console.log('No image found in response:', content);
      }
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

run();
