export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Chỉ chấp nhận POST request' });
  }

  try {
    const { prompt, apiKey, baseImage } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Thiếu nội dung prompt để tạo ảnh.' });
    }

    const routerUrl = (process.env.ROUTER_URL || process.env.VITE_ROUTER_URL || 'https://my-9router-service-s2ia.onrender.com/v1').replace(/\/+$/, '');
    const routerKey = (apiKey || process.env.ROUTER_API_KEY || process.env.VITE_ROUTER_API_KEY || 'sk-f28a6d1a3484f1d8-3n2ph3-d4150af7').trim();
    const routerModel = process.env.ROUTER_MODEL || process.env.VITE_ROUTER_IMAGE_MODEL || 'ag/gemini-3.1-flash-image';

    let base64Image = null;
    let mimeType = 'image/jpeg';
    let modelUsed = routerModel;
    let stylistCritique = '';

    const hasBaseImage = !!(baseImage && typeof baseImage === 'string' && baseImage.length > 50);

    // Call 9router
    if (hasBaseImage) {
      const cleanBase64 = baseImage.startsWith('data:') ? baseImage : `data:image/jpeg;base64,${baseImage}`;
      const vtonPrompt = `You are an elite high-fashion Virtual Try-On AI.
DRESS the exact fashion model shown in this reference photo in the following outfit:
${prompt}

STRICT IDENTITY & POSE PRESERVATION:
1. Preserve the model's exact face, identity, hair, body shape, skin tone, hands, and standing pose from the input photo.
2. Keep the neutral studio grey background and professional studio lighting intact.
3. Seamlessly dress this exact model by replacing their existing underwear / basic outfit with the luxurious traditional Vietnamese heritage garment, rendering crisp silk folds, authentic collar tailoring, and embroidery details.
Output a photorealistic, seamless full-body high fashion photograph.`;

      const chatRes = await fetch(`${routerUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${routerKey}`
        },
        body: JSON.stringify({
          model: routerModel,
          stream: false,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: vtonPrompt },
                { type: 'image_url', image_url: { url: cleanBase64 } }
              ]
            }
          ]
        }),
        signal: AbortSignal.timeout(75000)
      });

      if (chatRes.ok) {
        const chatData = await chatRes.json();
        const msg = chatData?.choices?.[0]?.message;
        const content = typeof msg?.content === 'string' ? msg.content : '';

        const dataUriMatch = content.match(/data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/);
        if (dataUriMatch) {
          mimeType = dataUriMatch[1];
          base64Image = dataUriMatch[2];
        } else {
          const urlCandidate = content.match(/https?:\/\/[^\s"'\<\>]+\.(?:png|jpe?g|webp|gif)/i)?.[0];
          if (urlCandidate) {
            const r = await fetch(urlCandidate);
            if (r.ok) {
              const ab = await r.arrayBuffer();
              base64Image = Buffer.from(ab).toString('base64');
              mimeType = r.headers.get('content-type') || 'image/jpeg';
            }
          }
        }
        if (content && !content.startsWith('data:image')) {
          stylistCritique = content.replace(/!\[.*?\]\(.*?\)/g, '').trim();
        }
      }
    } else {
      // Text to image
      const chatRes = await fetch(`${routerUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${routerKey}`
        },
        body: JSON.stringify({
          model: routerModel,
          stream: false,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }),
        signal: AbortSignal.timeout(75000)
      });

      if (chatRes.ok) {
        const chatData = await chatRes.json();
        const msg = chatData?.choices?.[0]?.message;
        const content = typeof msg?.content === 'string' ? msg.content : '';

        const dataUriMatch = content.match(/data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/);
        if (dataUriMatch) {
          mimeType = dataUriMatch[1];
          base64Image = dataUriMatch[2];
        }
      }
    }

    if (base64Image) {
      return res.status(200).json({
        success: true,
        imageUrl: `data:${mimeType};base64,${base64Image}`,
        promptUsed: prompt,
        modelUsed,
        stylistCritique: stylistCritique || undefined
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Không thể tạo ảnh từ Render Gateway. Vui lòng kiểm tra lại dịch vụ.',
      promptUsed: prompt
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Lỗi xử lý yêu cầu tạo ảnh',
      promptUsed: req.body?.prompt
    });
  }
}
