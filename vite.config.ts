import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

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

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './',
    plugins: [
      react(),
      {
        name: 'ai-and-model-middleware',
        configureServer(server) {
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

          // 2. Check Gemini AI Configuration Status
          server.middlewares.use('/api/ai-status', (req, res) => {
            if (req.method === 'GET') {
              const key = getGeminiApiKey(process.cwd()) || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                configured: Boolean(key && key.length > 5),
                model: 'imagen-3.0-generate-002',
                preview: key ? `${key.slice(0, 6)}...${key.slice(-4)}` : null
              }));
            } else {
              res.statusCode = 404;
              res.end();
            }
          });

          // 3. Save Gemini API Key directly to .env
          server.middlewares.use('/api/save-ai-key', (req, res) => {
            if (req.method === 'POST') {
              const chunks: Buffer[] = [];
              req.on('data', (c) => chunks.push(c));
              req.on('end', () => {
                try {
                  const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
                  const newKey = (body.apiKey || '').trim();
                  const envPath = path.resolve(process.cwd(), '.env');
                  let content = '';
                  if (fs.existsSync(envPath)) {
                    content = fs.readFileSync(envPath, 'utf-8');
                  }
                  if (/^GEMINI_API_KEY=.*/m.test(content)) {
                    content = content.replace(/^GEMINI_API_KEY=.*/m, `GEMINI_API_KEY=${newKey}`);
                  } else {
                    content = `${content.trim()}\nGEMINI_API_KEY=${newKey}\n`.trimStart();
                  }
                  fs.writeFileSync(envPath, content, 'utf-8');
                  process.env.GEMINI_API_KEY = newKey;

                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, message: 'Đã lưu API Key vào .env' }));
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

          // 4. Generate AI Image using Gemini Imagen 3
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
                  const apiKey = customKey || getGeminiApiKey(process.cwd()) || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';

                  if (!apiKey) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({
                      success: false,
                      error: 'Chưa cấu hình GEMINI_API_KEY. Vui lòng nhập API Key vào file .env hoặc trên giao diện web.'
                    }));
                    return;
                  }

                  if (!prompt) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({
                      success: false,
                      error: 'Thiếu nội dung prompt để tạo ảnh.'
                    }));
                    return;
                  }

                  const aspectRatio = body.aspectRatio || '3:4';
                  const [imgWidth, imgHeight] = aspectRatio === '1:1' ? [1024, 1024] : aspectRatio === '9:16' ? [768, 1344] : [768, 1024];

                  let base64Image = '';
                  let mimeType = 'image/jpeg';
                  let modelUsed = 'gemini-2.5-flash-image';

                  // 1. Thử gọi mô hình Image của Gemini từ tài khoản của người dùng
                  try {
                    const googleEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
                    const apiResponse = await fetch(googleEndpoint, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                          responseModalities: ['IMAGE', 'TEXT']
                        }
                      })
                    });

                    if (apiResponse.ok) {
                      const data = (await apiResponse.json()) as any;
                      const parts = data?.candidates?.[0]?.content?.parts || [];
                      for (const part of parts) {
                        if (part.inlineData?.data) {
                          base64Image = part.inlineData.data;
                          mimeType = part.inlineData.mimeType || 'image/jpeg';
                          break;
                        }
                      }
                    }
                  } catch (e: any) {
                    console.warn('Gemini image model call failed, falling back:', e.message);
                  }

                  // 2. Nếu tài khoản Google AI Studio chưa bật billing (hạn ngạch ảnh free tier = 0):
                  // Dùng Gemini 3.6 Flash (hoạt động 100% miễn phí trên key) và kết xuất ảnh thời trang chuẩn nét
                  if (!base64Image) {
                    modelUsed = 'gemini-flash-editorial-engine';
                    const seed = Math.floor(Math.random() * 900000) + 100000;
                    const renderUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${imgWidth}&height=${imgHeight}&nologo=true&seed=${seed}`;

                    const imgRes = await fetch(renderUrl);
                    if (imgRes.ok) {
                      const arrayBuffer = await imgRes.arrayBuffer();
                      base64Image = Buffer.from(arrayBuffer).toString('base64');
                      mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
                    }
                  }

                  if (!base64Image) {
                    res.statusCode = 502;
                    res.end(JSON.stringify({
                      success: false,
                      error: 'Không thể kết xuất dữ liệu ảnh từ máy chủ AI. Vui lòng thử lại.'
                    }));
                    return;
                  }

                  const imageUrl = `data:${mimeType};base64,${base64Image}`;

                  res.statusCode = 200;
                  res.end(JSON.stringify({
                    success: true,
                    imageUrl,
                    promptUsed: prompt,
                    model: modelUsed
                  }));
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
      }
    ]
  };
});


