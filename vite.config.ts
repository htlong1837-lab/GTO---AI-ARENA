import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type ViteDevServer } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

// Disk cache for generated AI images, so identical requests don't burn provider quota
const AI_CACHE_DIR = path.resolve(process.cwd(), '.ai-cache');

function getImageCacheKey(prompt: string, baseImage?: string): string {
  return crypto.createHash('sha256').update(prompt).update('|').update(baseImage || '').digest('hex');
}

function readImageCache(key: string): any | null {
  const file = path.join(AI_CACHE_DIR, `${key}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
}

function writeImageCache(key: string, entry: object) {
  try {
    fs.mkdirSync(AI_CACHE_DIR, { recursive: true });
    fs.writeFileSync(path.join(AI_CACHE_DIR, `${key}.json`), JSON.stringify(entry), 'utf-8');
  } catch (e: any) {
    console.warn('[AI Cache] Could not write cache:', e.message);
  }
}

// Helper to get Gemini API Key from process.env, loadEnv, or directly from .env file
function getGeminiApiKey(rootPath: string): string {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY.trim();
  const envPath = path.resolve(rootPath, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(/^(?:GEMINI_API_KEY|VITE_GEMINI_API_KEY)\s*=\s*["']?([^"'\r\n]+)["']?/m);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

// Run the same API middlewares under `vite preview`, so the built app keeps AI features
type MiddlewareHost = Pick<ViteDevServer, 'middlewares'>;
function withPreviewServer<T extends { configureServer: (server: MiddlewareHost) => void }>(plugin: T) {
  return { ...plugin, configurePreviewServer: (server: MiddlewareHost) => plugin.configureServer(server) };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './',
    plugins: [
      react(),
      withPreviewServer({
        name: 'ai-and-model-middleware',
        configureServer(server: MiddlewareHost) {
          // 1. Model saving middleware
          server.middlewares.use('/api/save-model', (req, res) => {
            if (req.method === 'POST') {
              const parsedUrl = new URL(req.url || '', 'http://localhost');
              const fileName = parsedUrl.searchParams.get('name') || 'model.glb';
              const chunks: Buffer[] = [];
              req.on('data', (c) => chunks.push(c));
              req.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const targetPath = path.resolve(process.cwd(), 'public/models', fileName);
                fs.writeFileSync(targetPath, buffer);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, file: fileName, size: buffer.length }));
              });
            } else {
              res.statusCode = 404;
              res.end();
            }
          });

// Helper to get 9router configuration from process.env or .env file
function getRouterConfig(rootPath: string) {
  let url = process.env.ROUTER_URL || '';
  let key = process.env.ROUTER_API_KEY || '';
  let model = process.env.ROUTER_MODEL || 'free-combo';
  let imageModel = process.env.ROUTER_IMAGE_MODEL || 'ag/gemini-3.1-flash-image';

  const envPath = path.resolve(rootPath, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const uMatch = content.match(/^ROUTER_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
    if (uMatch) url = uMatch[1].trim();
    const kMatch = content.match(/^ROUTER_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/m);
    if (kMatch) key = kMatch[1].trim();
    const mMatch = content.match(/^ROUTER_MODEL\s*=\s*["']?([^"'\r\n]+)["']?/m);
    if (mMatch) model = mMatch[1].trim();
    const imMatch = content.match(/^ROUTER_IMAGE_MODEL\s*=\s*["']?([^"'\r\n]+)["']?/m);
    if (imMatch) imageModel = imMatch[1].trim();
  }
  return {
    url: url || 'http://127.0.0.1:20128/v1',
    key,
    model,
    imageModel
  };
}

          // 2. Check 9router & Gemini AI Configuration Status
          server.middlewares.use('/api/ai-status', async (req, res) => {
            if (req.method === 'GET') {
              const router = getRouterConfig(process.cwd());
              const geminiKey = getGeminiApiKey(process.cwd()) || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';

              // Check if 9router is reachable
              let routerActive = false;
              if (router.key && router.url) {
                try {
                  const checkRes = await fetch(`${router.url}/models`, {
                    headers: { 'Authorization': `Bearer ${router.key}` },
                    signal: AbortSignal.timeout(2500)
                  });
                  if (checkRes.ok) routerActive = true;
                } catch (e) {
                  routerActive = false;
                }
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;

              if (routerActive) {
                res.end(JSON.stringify({
                  configured: true,
                  provider: '9router',
                  url: router.url,
                  model: router.model,
                  preview: `${router.key.slice(0, 6)}...${router.key.slice(-4)}`
                }));
              } else if (geminiKey && geminiKey.length > 5) {
                res.end(JSON.stringify({
                  configured: true,
                  provider: 'gemini',
                  model: 'gemini-3.6-flash',
                  preview: `${geminiKey.slice(0, 6)}...${geminiKey.slice(-4)}`
                }));
              } else {
                res.end(JSON.stringify({
                  configured: false,
                  provider: null,
                  model: null,
                  preview: null
                }));
              }
            } else {
              res.statusCode = 404;
              res.end();
            }
          });

          // 3. Save 9router / Gemini API Key directly to .env
          server.middlewares.use('/api/save-ai-key', (req, res) => {
            if (req.method === 'POST') {
              const chunks: Buffer[] = [];
              req.on('data', (c) => chunks.push(c));
              req.on('end', () => {
                try {
                  const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
                  const newKey = (body.apiKey || '').trim();
                  const newUrl = (body.routerUrl || '').trim();
                  const envPath = path.resolve(process.cwd(), '.env');
                  let content = '';
                  if (fs.existsSync(envPath)) {
                    content = fs.readFileSync(envPath, 'utf-8');
                  }

                  if (newKey.startsWith('sk-') || newUrl) {
                    // Save 9router settings
                    if (newKey) {
                      content = /^ROUTER_API_KEY=.*/m.test(content)
                        ? content.replace(/^ROUTER_API_KEY=.*/m, `ROUTER_API_KEY=${newKey}`)
                        : `${content.trim()}\nROUTER_API_KEY=${newKey}\n`;
                    }
                    if (newUrl) {
                      content = /^ROUTER_URL=.*/m.test(content)
                        ? content.replace(/^ROUTER_URL=.*/m, `ROUTER_URL=${newUrl}`)
                        : `${content.trim()}\nROUTER_URL=${newUrl}\n`;
                    }
                  } else {
                    // Save Gemini API key
                    content = /^GEMINI_API_KEY=.*/m.test(content)
                      ? content.replace(/^GEMINI_API_KEY=.*/m, `GEMINI_API_KEY=${newKey}`)
                      : `${content.trim()}\nGEMINI_API_KEY=${newKey}\n`;
                  }

                  fs.writeFileSync(envPath, content.trim() + '\n', 'utf-8');

                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, message: 'Đã lưu cấu hình AI vào .env' }));
                } catch (e: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: e.message }));
                }
              });
            } else {
              res.statusCode = 404;
              res.end();
            }
          });

          // 4. Generate AI Image using 9router / Gemini
          server.middlewares.use('/api/generate-ai-image', (req, res) => {
            if (req.method === 'POST') {
              const chunks: Buffer[] = [];
              req.on('data', (c) => chunks.push(c));
              req.on('end', async () => {
                res.setHeader('Content-Type', 'application/json');
                try {
                  const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
                  const prompt = body.prompt;
                  const customKey = (body.apiKey || '').trim();
                  
                  const router = getRouterConfig(process.cwd());
                  const geminiKey = customKey || getGeminiApiKey(process.cwd()) || env.GEMINI_API_KEY || '';

                  if (!prompt) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({
                      success: false,
                      error: 'Thiếu nội dung prompt để tạo ảnh.'
                    }));
                    return;
                  }

                  // 0. Serve from cache unless the client explicitly asks to regenerate
                  const cacheKey = getImageCacheKey(prompt, typeof body.baseImage === 'string' ? body.baseImage : '');
                  if (!body.force) {
                    const cached = readImageCache(cacheKey);
                    if (cached?.imageUrl) {
                      console.log(`[AI Cache] Hit ${cacheKey.slice(0, 12)}`);
                      res.statusCode = 200;
                      res.end(JSON.stringify({ success: true, ...cached, promptUsed: prompt, cached: true }));
                      return;
                    }
                  }

                  let base64Image = '';
                  let mimeType = 'image/jpeg';
                  let modelUsed = router.imageModel || 'ag/gemini-3.1-flash-image';
                  let stylistCritique = '';
                  let routerErrorMessage = '';

                  // 1. Candidate 9router endpoints (configured endpoint first, then local fallback)
                  const candidateRouters: Array<{ url: string; key: string }> = [];
                  if (router.key && router.url) {
                    candidateRouters.push({ url: router.url.replace(/\/+$/, ''), key: router.key });
                  }
                  if (router.key && router.url && !router.url.includes('127.0.0.1') && !router.url.includes('localhost')) {
                    candidateRouters.push({ url: 'http://127.0.0.1:20128/v1', key: router.key });
                  }

                  for (const currentRouter of candidateRouters) {
                    if (base64Image) break;

                    const hasBaseImage = !!(body.baseImage && typeof body.baseImage === 'string' && body.baseImage.length > 50);

                    // CASE A: Virtual Try-On with Base Model Photo (Image-to-Image dressing)
                    if (hasBaseImage) {
                      try {
                        const cleanBase64 = body.baseImage.startsWith('data:')
                          ? body.baseImage
                          : `data:image/jpeg;base64,${body.baseImage}`;

                        const vtonPrompt = `You are an elite high-fashion Virtual Try-On AI.
DRESS the exact fashion model shown in this reference photo in the following outfit:
${prompt}

STRICT IDENTITY & POSE PRESERVATION:
1. Preserve the model's exact face, identity, hair, body shape, skin tone, hands, and standing pose from the input photo.
2. Keep the neutral studio grey background and professional studio lighting intact.
3. Seamlessly dress this exact model by replacing their existing underwear / basic outfit with the luxurious traditional Vietnamese heritage garment, rendering crisp silk folds, authentic collar tailoring, and embroidery details.
Output a photorealistic, seamless full-body high fashion photograph.`;

                        console.log(`[AI VTON] Trying 9router at ${currentRouter.url} (${router.imageModel})...`);

                        const chatRes = await fetch(`${currentRouter.url}/chat/completions`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${currentRouter.key}`
                          },
                          body: JSON.stringify({
                            model: router.imageModel || 'ag/gemini-3.1-flash-image',
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
                          signal: AbortSignal.timeout(35000)
                        });

                        if (chatRes.ok) {
                          const chatData = await chatRes.json() as any;
                          const msg = chatData?.choices?.[0]?.message;
                          const content = typeof msg?.content === 'string' ? msg.content : '';

                          const dataUriMatch = content.match(/data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/);
                          if (dataUriMatch) {
                            mimeType = dataUriMatch[1];
                            base64Image = dataUriMatch[2];
                            modelUsed = (router.imageModel || 'ag/gemini-3.1-flash-image') + ' (Virtual Try-On)';
                          } else {
                            const urlCandidate = content.match(/https?:\/\/[^\s"'\<\>]+\.(?:png|jpe?g|webp|gif)/i)?.[0];
                            if (urlCandidate) {
                              try {
                                const r = await fetch(urlCandidate);
                                if (r.ok) {
                                  const ab = await r.arrayBuffer();
                                  base64Image = Buffer.from(ab).toString('base64');
                                  mimeType = r.headers.get('content-type') || 'image/jpeg';
                                  modelUsed = (router.imageModel || 'ag/gemini-3.1-flash-image') + ' (Virtual Try-On)';
                                }
                              } catch {}
                            }
                          }
                          if (content && !content.startsWith('data:image')) {
                            stylistCritique = content.replace(/!\[.*?\]\(.*?\)/g, '').trim();
                          }
                        } else {
                          const errText = await chatRes.text();
                          console.warn(`[AI VTON] 9router at ${currentRouter.url} failed (${chatRes.status}):`, errText.slice(0, 200));
                          try {
                            const parsed = JSON.parse(errText);
                            routerErrorMessage = parsed?.error?.message || errText;
                          } catch {
                            routerErrorMessage = errText;
                          }
                        }
                      } catch (e: any) {
                        console.warn(`[AI VTON] Exception on ${currentRouter.url}:`, e.message);
                        routerErrorMessage = e.message;
                      }
                    }

                    // CASE B: Pure Text-to-Image if no base model photo OR fallback if VTON failed (only if quota wasn't exhausted)
                    const isQuotaExhausted = routerErrorMessage.includes('RESOURCE_EXHAUSTED') || routerErrorMessage.includes('capacity on this model') || routerErrorMessage.includes('QUOTA_EXHAUSTED');
                    if (!base64Image && !isQuotaExhausted) {
                      try {
                        const imagePayload = {
                          model: router.imageModel || 'ag/gemini-3.1-flash-image',
                          prompt,
                          n: 1,
                          size: 'auto',
                          quality: 'auto',
                          background: 'auto',
                          image_detail: 'high',
                          output_format: 'png'
                        };

                        console.log(`[AI Image] Calling 9router at ${currentRouter.url}/images/generations (${imagePayload.model})...`);

                        const imgRes = await fetch(`${currentRouter.url}/images/generations`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${currentRouter.key}`
                          },
                          body: JSON.stringify(imagePayload),
                          signal: AbortSignal.timeout(35000)
                        });

                        if (imgRes.ok) {
                          const imgData = await imgRes.json() as any;
                          const first = imgData?.data?.[0];
                          if (first?.b64_json) {
                            base64Image = first.b64_json;
                            mimeType = 'image/png';
                            modelUsed = imagePayload.model;
                          } else if (first?.url) {
                            if (first.url.startsWith('data:image')) {
                              const parts = first.url.split(';base64,');
                              mimeType = parts[0].replace('data:', '');
                              base64Image = parts[1];
                            } else {
                              const r = await fetch(first.url);
                              if (r.ok) {
                                const ab = await r.arrayBuffer();
                                base64Image = Buffer.from(ab).toString('base64');
                                mimeType = r.headers.get('content-type') || 'image/png';
                              }
                            }
                            modelUsed = imagePayload.model;
                          }
                        } else {
                          const errText = await imgRes.text();
                          console.warn(`[AI Image] 9router at ${currentRouter.url} failed (${imgRes.status}):`, errText.slice(0, 200));
                          try {
                            const parsed = JSON.parse(errText);
                            routerErrorMessage = parsed?.error?.message || errText;
                          } catch {
                            routerErrorMessage = errText;
                          }
                        }
                      } catch (e: any) {
                        console.warn(`[AI Image] 9router at ${currentRouter.url} exception:`, e.message);
                        routerErrorMessage = e.message;
                      }
                    }
                  }


                  // 2. If Gemini direct key exists and no image yet, attempt Google direct API call
                  if (!base64Image && geminiKey) {
                    try {
                      const googleEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${geminiKey}`;
                      const parts: any[] = [{ text: prompt }];
                      if (body.baseImage && typeof body.baseImage === 'string') {
                        const cleanBase64 = body.baseImage.replace(/^data:image\/\w+;base64,/, '');
                        if (cleanBase64.length > 50) {
                          parts.unshift({
                            inlineData: { mimeType: 'image/jpeg', data: cleanBase64 }
                          });
                        }
                      }

                      const apiResponse = await fetch(googleEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contents: [{ parts }],
                          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
                        }),
                        signal: AbortSignal.timeout(20000)
                      });

                      if (apiResponse.ok) {
                        const data = (await apiResponse.json()) as any;
                        const returnedParts = data?.candidates?.[0]?.content?.parts || [];
                        for (const part of returnedParts) {
                          if (part.inlineData?.data) {
                            base64Image = part.inlineData.data;
                            mimeType = part.inlineData.mimeType || 'image/jpeg';
                            modelUsed = 'gemini-2.5-flash-image';
                            break;
                          }
                        }
                      } else {
                        const errJson = await apiResponse.json().catch(() => null) as any;
                        console.warn('[AI Image] Direct Google API error:', errJson?.error?.message || apiResponse.status);
                      }
                    } catch (e: any) {
                      console.warn('Gemini direct image call skipped:', e.message);
                    }
                  }

                  // 3. Return response
                  if (base64Image) {
                    const imageUrl = `data:${mimeType};base64,${base64Image}`;
                    writeImageCache(cacheKey, { imageUrl, model: modelUsed, stylistCritique, createdAt: new Date().toISOString() });
                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      success: true,
                      imageUrl,
                      promptUsed: prompt,
                      model: modelUsed,
                      stylistCritique
                    }));
                  } else {
                    let userFriendlyMsg = 'Không nhận được dữ liệu ảnh từ model.';
                    if (routerErrorMessage.includes('timeout') || routerErrorMessage.includes('aborted')) {
                      userFriendlyMsg = 'Quá thời gian kết nối (Timeout). Máy chủ AI hoặc Render đang khởi động, vui lòng thử lại sau giây lát.';
                    } else if (routerErrorMessage.includes('RESOURCE_EXHAUSTED') || routerErrorMessage.includes('capacity on this model') || routerErrorMessage.includes('QUOTA_EXHAUSTED')) {
                      const match = routerErrorMessage.match(/reset after ([^"\\]+)/i);
                      const resetTime = match ? match[1] : '3 giờ';
                      userFriendlyMsg = `Tài khoản Google hiện tại đã dùng hết quota tạo ảnh (hệ thống sẽ tự reset sau ${resetTime}). Bạn có thể thêm tài khoản Google mới vào 9router để tiếp tục ngay.`;
                    } else if (routerErrorMessage) {
                      userFriendlyMsg = `9router phản hồi: ${routerErrorMessage}`;
                    }

                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      success: false,
                      needFallback: true,
                      promptUsed: prompt,
                      model: modelUsed,
                      stylistCritique,
                      routerError: routerErrorMessage,
                      message: userFriendlyMsg
                    }));
                  }
                } catch (err: any) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({
                    success: false,
                    error: err.message || 'Lỗi xử lý yêu cầu tạo ảnh trên máy chủ.'
                  }));
                }
              });
            } else {
              res.statusCode = 404;
              res.end();
            }
          });
        }
      })
    ]
  };
});


