import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Key, CheckCircle2, AlertCircle, ExternalLink, X, Eye, EyeOff } from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { useToast } from '../../context/ToastContext';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState(() => GeminiService.getClientApiKey());
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ configured: boolean; preview?: string | null }>({ configured: false });
  const [saving, setSaving] = useState(false);
  const [saveTarget, setSaveTarget] = useState<'server' | 'browser'>(() => 
    GeminiService.getClientApiKey() ? 'browser' : 'server'
  );

  useEffect(() => {
    if (isOpen) {
      GeminiService.checkStatus().then((res) => {
        setStatus({
          configured: res.configured,
          preview: res.preview
        });
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      showToast({ type: 'warning', title: 'Chưa nhập API Key', message: 'Vui lòng dán khóa API của bạn.' });
      return;
    }

    setSaving(true);
    try {
      if (saveTarget === 'server') {
        const res = await GeminiService.saveServerKey(trimmed);
        if (res.success) {
          showToast({
            type: 'success',
            title: 'Đã cấu hình Gemini cho toàn hệ thống!',
            message: 'Mọi máy truy cập web này từ nay đều có thể tạo ảnh AI dùng chung tài khoản của bạn.'
          });
          setStatus({ configured: true, preview: `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}` });
          if (onKeySaved) onKeySaved();
          onClose();
        } else {
          showToast({ type: 'error', title: 'Lưu thất bại', message: res.error || 'Không thể ghi key vào máy chủ.' });
        }
      } else {
        GeminiService.setClientApiKey(trimmed);
        showToast({
          type: 'success',
          title: 'Đã lưu API Key trên trình duyệt này!',
          message: 'Khóa API của bạn được lưu an toàn trong máy hiện tại.'
        });
        setStatus({ configured: true, preview: `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}` });
        if (onKeySaved) onKeySaved();
        onClose();
      }
    } catch (e: any) {
      showToast({ type: 'error', title: 'Lỗi', message: e.message });
    } finally {
      setSaving(false);
    }
  };

  return typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-stone-800 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Cấu hình Gemini API Key
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 font-sans">
              Nhập mã khóa Google AI Studio cá nhân để kích hoạt tính năng tạo ảnh AI.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs ${
          status.configured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          {status.configured ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="block font-semibold">Cổng Gemini AI đang sẵn sàng!</strong>
                <span className="text-emerald-700">
                  Key: {status.preview || 'Đã cấu hình'}
                </span>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="block font-semibold">Chưa có API Key</strong>
                <span className="text-amber-700">Vui lòng dán Gemini API Key để tạo ảnh.</span>
              </div>
            </>
          )}
        </div>

        {/* Mode Selector Tab */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Phạm vi lưu trữ
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100/80 rounded-2xl border border-stone-200/60">
            <button
              type="button"
              onClick={() => setSaveTarget('server')}
              className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                saveTarget === 'server'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Lưu máy chủ (.env)
            </button>
            <button
              type="button"
              onClick={() => setSaveTarget('browser')}
              className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                saveTarget === 'browser'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Chỉ máy này (Browser)
            </button>
          </div>
          <p className="text-[11px] text-stone-400 italic">
            {saveTarget === 'server' 
              ? 'Khuyên dùng khi chạy local/server cá nhân để chia sẻ key cho tất cả phiên người dùng.'
              : 'Key sẽ được lưu trong bộ nhớ trình duyệt (localStorage), không gửi đi đâu khác.'}
          </p>
        </div>

        {/* Input Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Gemini API Key
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Key className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Dán AI Studio Key (AIzaSy...)"
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#9B1D20]/20 focus:border-[#9B1D20] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Guide link */}
        <div className="pt-1">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#9B1D20] hover:underline font-medium"
          >
            <span>Lấy API Key miễn phí tại Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#9B1D20] hover:bg-[#80181A] rounded-full shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Lưu cấu hình API</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;
};
