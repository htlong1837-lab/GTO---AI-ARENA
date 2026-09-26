/**
 * OAUTH TOKEN MANAGER (Google Generative AI / Vertex AI)
 * Tự động xoay vòng lấy Access Token mới mỗi khi hết hạn (vĩnh viễn không bao giờ văng phiên)
 */

export class GoogleOAuthManager {
  constructor(config = {}) {
    this.clientId = config.clientId || process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = config.clientSecret || process.env.GOOGLE_CLIENT_SECRET;
    this.refreshToken = config.refreshToken || process.env.GOOGLE_REFRESH_TOKEN;
    
    this.cachedAccessToken = null;
    this.tokenExpiryTime = 0;
  }

  /**
   * Lấy Access Token hợp lệ (tự động xin token mới nếu sắp hết hạn trong vòng 60s)
   */
  async getValidAccessToken() {
    const now = Date.now();
    if (this.cachedAccessToken && now < this.tokenExpiryTime - 60000) {
      return this.cachedAccessToken;
    }

    if (!this.refreshToken || !this.clientId || !this.clientSecret) {
      throw new Error('Thiếu cấu hình GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET hoặc GOOGLE_REFRESH_TOKEN.');
    }

    console.log('🔄 [OAuth Manager] Đang tự động làm mới Access Token bằng Refresh Token...');
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
      })
    });

    const data = await response.json();
    if (!response.ok || !data.access_token) {
      throw new Error(`Không thể làm mới Access Token: ${data.error_description || data.error || JSON.stringify(data)}`);
    }

    this.cachedAccessToken = data.access_token;
    this.tokenExpiryTime = Date.now() + (data.expires_in || 3600) * 1000;
    console.log(`✅ [OAuth Manager] Đã cấp Access Token mới thành công (Hạn sử dụng: ${data.expires_in}s)!`);
    return this.cachedAccessToken;
  }

  /**
   * Gửi yêu cầu tạo ảnh đến Google API bằng Access Token được ủy quyền
   */
  async generateImage(prompt, model = 'imagen-3.0-generate-002', aspectRatio = '3:4') {
    const accessToken = await this.getValidAccessToken();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google API Image Gen Error (${res.status}): ${errText}`);
    }

    const result = await res.json();
    const base64 = result?.predictions?.[0]?.bytesBase64Encoded;
    const mime = result?.predictions?.[0]?.mimeType || 'image/jpeg';

    if (!base64) {
      throw new Error('Không tìm thấy dữ liệu ảnh trong phản hồi từ Google.');
    }

    return `data:${mime};base64,${base64}`;
  }
}
