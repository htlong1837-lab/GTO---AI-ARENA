export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const routerUrl = (process.env.ROUTER_URL || process.env.VITE_ROUTER_URL || 'https://my-9router-service-s2ia.onrender.com/v1').replace(/\/+$/, '');
  const routerKey = (process.env.ROUTER_API_KEY || process.env.VITE_ROUTER_API_KEY || 'sk-f28a6d1a3484f1d8-3n2ph3-d4150af7').trim();
  const routerModel = process.env.ROUTER_MODEL || process.env.VITE_ROUTER_IMAGE_MODEL || 'ag/gemini-3.1-flash-image';
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();

  let routerActive = false;
  if (routerKey && routerUrl) {
    try {
      const checkRes = await fetch(`${routerUrl}/models`, {
        headers: { 'Authorization': `Bearer ${routerKey}` },
        signal: AbortSignal.timeout(4000)
      });
      if (checkRes.ok) routerActive = true;
    } catch {
      routerActive = false;
    }
  }

  if (routerActive || (routerUrl && routerKey)) {
    return res.status(200).json({
      configured: true,
      provider: '9router',
      url: routerUrl,
      model: routerModel,
      preview: `${routerKey.slice(0, 6)}...${routerKey.slice(-4)}`
    });
  }

  if (geminiKey && geminiKey.length > 5) {
    return res.status(200).json({
      configured: true,
      provider: 'gemini',
      model: 'gemini-3.6-flash',
      preview: `${geminiKey.slice(0, 6)}...${geminiKey.slice(-4)}`
    });
  }

  return res.status(200).json({
    configured: false,
    provider: null,
    model: null,
    preview: null
  });
}
