import http from 'node:http';
import { exec } from 'node:child_process';

/**
 * GOOGLE OAUTH 2.0 SETUP HELPER
 * Script này giúp bạn lấy GOOGLE_REFRESH_TOKEN vĩnh viễn một cách tự động và dễ dàng nhất.
 */

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

// Scopes required for Google Generative Language & Vertex AI
const SCOPES = [
  'https://www.googleapis.com/auth/generative-language',
  'https://www.googleapis.com/auth/cloud-platform'
].join(' ');

async function main() {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.argv[2];
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.argv[3];

  if (!clientId || !clientSecret) {
    console.log(`
================================================================================
🔑 HƯỚNG DẪN CHUẨN BỊ OAUTH 2.0 CLIENT ID
================================================================================

1. Truy cập: https://console.cloud.google.com/apis/credentials
2. Chọn dự án Google Cloud của bạn (hoặc bấm Tạo Dự Án Mới).
3. Bấm "+ CREATE CREDENTIALS" -> Chọn "OAuth client ID".
4. Chọn Application type: "Web application".
5. Tại mục "Authorized redirect URIs" (URI chuyển hướng), bấm ADD URI và dán:
   👉  ${REDIRECT_URI}
6. Bấm CREATE và copy CLIENT ID cùng CLIENT SECRET.

7. Sau đó chạy lệnh sau trong Terminal:
   👉  node scripts/google_oauth_helper.mjs <CLIENT_ID> <CLIENT_SECRET>
================================================================================
    `);
    process.exit(0);
  }

  // Build Authorization URL with access_type=offline & prompt=consent to ensure refresh_token is returned
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPES);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  console.log(`
================================================================================
🚀 ĐANG MỞ TRÌNH DUYỆT ĐỂ BẠN ĐĂNG NHẬP ỦY QUYỀN GOOGLE...
--------------------------------------------------------------------------------
Nếu trình duyệt không tự mở, hãy copy đường link sau và dán vào Chrome:
${authUrl.toString()}
================================================================================
  `);

  // Start local server to capture the authorization code
  const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
    if (reqUrl.pathname === '/oauth2callback') {
      const code = reqUrl.searchParams.get('code');
      const error = reqUrl.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h2>❌ Lỗi ủy quyền: ${error}</h2>`);
        console.error('Lỗi ủy quyền từ Google:', error);
        server.close();
        return;
      }

      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #0F9D58;">✅ Đăng nhập & Ủy quyền thành công!</h1>
            <p>Bạn có thể đóng tab này và quay lại cửa sổ Terminal để lấy mã <b>Refresh Token</b>.</p>
          </div>
        `);

        console.log('🔄 Đang đổi Authorization Code lấy Refresh Token...');
        try {
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: REDIRECT_URI,
              grant_type: 'authorization_code'
            })
          });

          const tokenData = await tokenRes.json();
          if (tokenData.refresh_token) {
            console.log(`
================================================================================
🎉 LẤY REFRESH TOKEN THÀNH CÔNG VĨNH VIỄN!
================================================================================
Hãy copy 3 dòng sau dán vào Environment Variables trên Render Dashboard:

GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_SECRET=${clientSecret}
GOOGLE_REFRESH_TOKEN=${tokenData.refresh_token}

(Thời hạn Access Token hiện tại: ${tokenData.expires_in} giây)
================================================================================
            `);
          } else {
            console.error('❌ Không nhận được refresh_token. Chi tiết phản hồi:', tokenData);
          }
        } catch (exchangeErr) {
          console.error('❌ Lỗi khi đổi token:', exchangeErr);
        }

        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1000);
      }
    }
  });

  server.listen(PORT, () => {
    // Attempt to open browser automatically
    const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${startCmd} "${authUrl.toString()}"`, () => {});
  });
}

main();
