import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 8080;

// HTTP server for health checking & status
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/status' || req.url === '/api/status') {
    const isFlowActive = !!flowSocket && flowSocket.readyState === WebSocket.OPEN;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      flowConnected: isFlowActive,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Google Flow WebSocket Bridge is running on port ' + PORT);
});

const wss = new WebSocketServer({ server });

let flowSocket = null;
const pendingRequests = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString('utf-8'));

      // 1. Google Flow UserScript registration
      if (data.type === 'REGISTER_FLOW') {
        flowSocket = ws;
        console.log('✅ [Flow Bridge] Tab Google Flow trên trình duyệt đã kết nối thành công!');
        ws.send(JSON.stringify({ type: 'FLOW_ACK', status: 'ready' }));
        return;
      }

      // 2. Query status from Studio
      if (data.type === 'CHECK_STATUS') {
        const isFlowActive = !!flowSocket && flowSocket.readyState === WebSocket.OPEN;
        ws.send(JSON.stringify({
          type: 'STATUS_RESPONSE',
          flowConnected: isFlowActive
        }));
        return;
      }

      // 3. Studio App submits an image generation prompt
      if (data.type === 'STUDIO_GENERATE_REQUEST') {
        const reqId = data.requestId || `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        console.log(`\n🚀 [Studio -> Flow] Nhận prompt tạo ảnh (ID: ${reqId}):`);
        console.log(`"${data.prompt.slice(0, 100)}..."`);

        if (!flowSocket || flowSocket.readyState !== WebSocket.OPEN) {
          console.warn('⚠️ [Flow Bridge] Tab Google Flow chưa mở hoặc bị ngắt kết nối.');
          ws.send(JSON.stringify({
            type: 'STUDIO_GENERATE_RESPONSE',
            requestId: reqId,
            success: false,
            error: 'Tab Google Flow chưa được mở trên trình duyệt (hoặc chưa bật Tampermonkey script).'
          }));
          return;
        }

        // Store studio client to reply back
        pendingRequests.set(reqId, {
          socket: ws,
          timer: setTimeout(() => {
            if (pendingRequests.has(reqId)) {
              console.warn(`⏱️ [Timeout] Yêu cầu ${reqId} quá hạn (60s).`);
              ws.send(JSON.stringify({
                type: 'STUDIO_GENERATE_RESPONSE',
                requestId: reqId,
                success: false,
                error: 'Hết thời gian chờ tạo ảnh từ Google Flow (Timeout 60s).'
              }));
              pendingRequests.delete(reqId);
            }
          }, 60000)
        });

        // Forward to Google Flow tab
        flowSocket.send(JSON.stringify({
          type: 'EXECUTE_GENERATE',
          requestId: reqId,
          prompt: data.prompt,
          aspectRatio: data.aspectRatio || '3:4'
        }));
      }

      // 4. Google Flow tab finishes generating and sends back the image
      if (data.type === 'FLOW_IMAGE_COMPLETED') {
        const reqId = data.requestId;
        console.log(`✨ [Flow -> Studio] Đã nhận ảnh tạo thành công cho yêu cầu: ${reqId}`);

        const entry = pendingRequests.get(reqId);
        if (entry) {
          clearTimeout(entry.timer);
          if (entry.socket.readyState === WebSocket.OPEN) {
            entry.socket.send(JSON.stringify({
              type: 'STUDIO_GENERATE_RESPONSE',
              requestId: reqId,
              success: true,
              imageUrl: data.imageUrl,
              promptUsed: data.prompt
            }));
          }
          pendingRequests.delete(reqId);
        }
      }

      // 5. Google Flow tab reports an error
      if (data.type === 'FLOW_IMAGE_ERROR') {
        const reqId = data.requestId;
        console.error(`❌ [Flow Error] Lỗi từ tab Google Flow cho yêu cầu ${reqId}:`, data.error);
        const entry = pendingRequests.get(reqId);
        if (entry) {
          clearTimeout(entry.timer);
          if (entry.socket.readyState === WebSocket.OPEN) {
            entry.socket.send(JSON.stringify({
              type: 'STUDIO_GENERATE_RESPONSE',
              requestId: reqId,
              success: false,
              error: data.error || 'Lỗi không xác định từ Google Flow'
            }));
          }
          pendingRequests.delete(reqId);
        }
      }

    } catch (err) {
      console.error('Lỗi phân tích cú pháp tin nhắn WebSocket:', err);
    }
  });

  ws.on('close', () => {
    if (ws === flowSocket) {
      console.log('🔌 [Flow Bridge] Tab Google Flow đã đóng kết nối.');
      flowSocket = null;
    }
  });
});

server.listen(PORT, () => {
  console.log(`
===========================================================
📡 GOOGLE FLOW WEBSOCKET BRIDGE ĐANG CHẠY
-----------------------------------------------------------
- WebSocket URL : ws://localhost:${PORT}
- HTTP Status   : http://localhost:${PORT}/status
===========================================================
👉 Hãy mở tab Google Flow trên Chrome có cài Tampermonkey Script!
  `);
});
