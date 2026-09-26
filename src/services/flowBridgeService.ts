export interface FlowBridgeStatus {
  online: boolean;
  flowConnected: boolean;
}

export interface FlowGenerateResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  promptUsed?: string;
}

export class FlowBridgeService {
  private static wsUrl = 'ws://localhost:8080';
  private static statusUrl = 'http://localhost:8080/status';

  /**
   * Fast HTTP check to see if Relay server is running and Google Flow is connected
   */
  static async checkStatus(): Promise<FlowBridgeStatus> {
    try {
      const res = await fetch(this.statusUrl, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        const data = await res.json();
        return {
          online: true,
          flowConnected: Boolean(data.flowConnected)
        };
      }
    } catch {
      // Ignore if offline
    }
    return { online: false, flowConnected: false };
  }

  /**
   * Send prompt to Google Flow via WebSocket relay and await result
   */
  static async generateImage(prompt: string, aspectRatio: string = '3:4'): Promise<FlowGenerateResult> {
    return new Promise((resolve) => {
      let ws: WebSocket | null = null;
      let timeoutTimer: any = null;
      const reqId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

      try {
        ws = new WebSocket(this.wsUrl);

        const cleanup = () => {
          if (timeoutTimer) clearTimeout(timeoutTimer);
          if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            ws.close();
          }
        };

        // 65s safety timeout
        timeoutTimer = setTimeout(() => {
          cleanup();
          resolve({
            success: false,
            error: 'Hết thời gian chờ tạo ảnh từ Google Flow (Timeout 65s).'
          });
        }, 65000);

        ws.onopen = () => {
          ws?.send(
            JSON.stringify({
              type: 'STUDIO_GENERATE_REQUEST',
              requestId: reqId,
              prompt,
              aspectRatio
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'STUDIO_GENERATE_RESPONSE' && data.requestId === reqId) {
              cleanup();
              if (data.success && data.imageUrl) {
                resolve({
                  success: true,
                  imageUrl: data.imageUrl,
                  promptUsed: prompt
                });
              } else {
                resolve({
                  success: false,
                  error: data.error || 'Google Flow không tạo được ảnh'
                });
              }
            }
          } catch (e: any) {
            cleanup();
            resolve({
              success: false,
              error: e.message || 'Lỗi xử lý phản hồi từ Flow Bridge'
            });
          }
        };

        ws.onerror = () => {
          cleanup();
          resolve({
            success: false,
            error: 'Không thể kết nối đến Relay Server (ws://localhost:8080).'
          });
        };

        ws.onclose = () => {
          // If closed before resolving
        };

      } catch (err: any) {
        if (timeoutTimer) clearTimeout(timeoutTimer);
        resolve({
          success: false,
          error: err.message || 'Lỗi khởi tạo kết nối WebSocket'
        });
      }
    });
  }
}
