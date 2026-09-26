// ==UserScript==
// @name         Google Flow / AI Studio Bridge for VietPhuc Studio
// @namespace    https://vietphuc-studio.local/
// @version      1.1
// @description  Tự động nhận prompt từ VietPhuc Studio và bấm Tạo ảnh trên Google Flow / ImageFX / AI Studio
// @author       VietPhuc Studio AI Team
// @match        https://labs.google/*
// @match        https://*.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://flow.google/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const WS_URL = 'ws://localhost:8080';
  let ws = null;
  let isConnecting = false;

  // Visual status badge in bottom-right corner of Google Flow
  function createStatusIndicator() {
    let indicator = document.getElementById('gto-flow-bridge-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'gto-flow-bridge-indicator';
      indicator.style.position = 'fixed';
      indicator.style.bottom = '16px';
      indicator.style.right = '16px';
      indicator.style.zIndex = '999999';
      indicator.style.padding = '8px 14px';
      indicator.style.borderRadius = '20px';
      indicator.style.fontSize = '12px';
      indicator.style.fontWeight = '600';
      indicator.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      indicator.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)';
      indicator.style.transition = 'all 0.3s ease';
      indicator.style.userSelect = 'none';
      document.body.appendChild(indicator);
    }
    return indicator;
  }

  function updateStatus(status, text) {
    const el = createStatusIndicator();
    if (status === 'connected') {
      el.style.backgroundColor = '#0F9D58';
      el.style.color = '#FFFFFF';
      el.innerHTML = `🟢 VietPhuc Bridge: Đã kết nối`;
    } else if (status === 'working') {
      el.style.backgroundColor = '#F4B400';
      el.style.color = '#202124';
      el.innerHTML = `⏳ Đang tạo ảnh: ${text || '...'}`;
    } else {
      el.style.backgroundColor = '#DB4437';
      el.style.color = '#FFFFFF';
      el.innerHTML = `🔴 VietPhuc Bridge: Đang chờ Relay (Port 8080)...`;
    }
  }

  function connectToRelay() {
    if (isConnecting) return;
    isConnecting = true;

    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        isConnecting = false;
        console.log('✅ [VietPhuc Bridge] Kết nối thành công đến Relay Server!');
        updateStatus('connected');
        ws.send(JSON.stringify({ type: 'REGISTER_FLOW' }));
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'EXECUTE_GENERATE') {
            console.log('🚀 [VietPhuc Bridge] Bắt đầu tạo ảnh cho Request ID:', data.requestId);
            updateStatus('working', 'Đang nhập prompt');
            await handleFlowGeneration(data.requestId, data.prompt);
          }
        } catch (e) {
          console.error('[VietPhuc Bridge] Lỗi phân tích lệnh:', e);
        }
      };

      ws.onerror = () => {
        updateStatus('disconnected');
      };

      ws.onclose = () => {
        isConnecting = false;
        updateStatus('disconnected');
        console.log('🔌 [VietPhuc Bridge] Mất kết nối, thử lại sau 3 giây...');
        setTimeout(connectToRelay, 3000);
      };
    } catch (err) {
      isConnecting = false;
      updateStatus('disconnected');
      setTimeout(connectToRelay, 3000);
    }
  }

  // Handle the DOM automation to generate image on Google Flow
  async function handleFlowGeneration(requestId, prompt) {
    try {
      // 1. Snapshot existing images on page so we can detect newly created image
      const existingImages = new Set(
        Array.from(document.querySelectorAll('img')).map((img) => img.src)
      );

      // 2. Find prompt input area
      const inputEl = document.querySelector(
        'textarea, input[type="text"], [contenteditable="true"], [aria-label*="prompt" i], [placeholder*="prompt" i]'
      );

      if (!inputEl) {
        throw new Error('Không tìm thấy ô nhập Prompt trên trang này. Hãy đảm bảo bạn đang ở giao diện tạo ảnh.');
      }

      // Input prompt
      if (inputEl.isContentEditable) {
        inputEl.innerText = prompt;
      } else {
        inputEl.value = prompt;
      }
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));

      await new Promise((r) => setTimeout(r, 600));

      // 3. Find and click the Generate button
      const allButtons = Array.from(document.querySelectorAll('button'));
      const generateBtn = allButtons.find((b) => {
        const text = (b.innerText || b.getAttribute('aria-label') || '').toLowerCase();
        return text.includes('generate') || text.includes('create') || text.includes('tạo') || text.includes('run');
      }) || document.querySelector('button[type="submit"]') || allButtons[allButtons.length - 1];

      if (!generateBtn) {
        throw new Error('Không tìm thấy nút Generate/Tạo ảnh trên trang.');
      }

      updateStatus('working', 'Đang render AI...');
      generateBtn.click();

      // 4. Poll for new image appearing on screen
      const startTime = Date.now();
      const pollInterval = setInterval(() => {
        const currentImgs = Array.from(document.querySelectorAll('img')).filter((img) => {
          if (!img.src || img.src.startsWith('blob:') || img.naturalWidth < 180) return false;
          // Ignore avatars, logos, icons
          if (img.src.includes('googleusercontent.com/a/') || img.src.includes('icon') || img.src.includes('logo')) return false;
          return true;
        });

        // Check if there is a new image not in existingImages
        const newImg = currentImgs.find((img) => !existingImages.has(img.src)) || currentImgs[currentImgs.length - 1];

        if (newImg && newImg.src && (newImg.complete || newImg.naturalWidth > 0)) {
          clearInterval(pollInterval);
          console.log('✨ [VietPhuc Bridge] Đã phát hiện ảnh mới tạo thành công:', newImg.src.slice(0, 80));
          updateStatus('connected');

          ws.send(JSON.stringify({
            type: 'FLOW_IMAGE_COMPLETED',
            requestId: requestId,
            imageUrl: newImg.src,
            prompt: prompt
          }));
        }

        // Timeout 50s
        if (Date.now() - startTime > 50000) {
          clearInterval(pollInterval);
          updateStatus('connected');
          ws.send(JSON.stringify({
            type: 'FLOW_IMAGE_ERROR',
            requestId: requestId,
            error: 'Quá thời gian chờ (50s) nhưng không thấy ảnh mới xuất hiện trên trang.'
          }));
        }
      }, 1500);

    } catch (err) {
      console.error('[VietPhuc Bridge] Lỗi:', err);
      updateStatus('connected');
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'FLOW_IMAGE_ERROR',
          requestId: requestId,
          error: err.message || 'Lỗi thao tác trên trang Google Flow'
        }));
      }
    }
  }

  // Start connection
  setTimeout(connectToRelay, 1000);
})();
