import React, { useState, useEffect } from 'react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
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
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Cấu hình Google Gemini API
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 font-sans">
              Kết nối mô hình Imagen 3 để tự động sinh ảnh người mẫu thời trang Việt Phục.
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
                <strong className="block font-semibold">Gemini AI đang sẵn sàng!</strong>
                <span className="text-emerald-700">Khóa hiện tại: {status.preview || 'Đã cấu hình'} (Imagen 3)</span>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="block font-semibold">Chưa có API Key</strong>
                <span className="text-amber-700">Vui lòng nhập API Key để các máy truy cập có thể tạo ảnh tự động.</span>
              </div>
            </>
          )}
        </div>

        {/* Target selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Phạm vi áp dụng
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSaveTarget('server')}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                saveTarget === 'server'
                  ? 'border-[#9B1D20] bg-rose-50/60 font-semibold text-[#9B1D20] shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 text-stone-600'
              }`}
            >
              <span className="block font-bold">Dùng chung cho cả web</span>
              <span className="text-[10px] text-stone-500">Lưu vào .env, mọi máy khác vào web đều tạo được ảnh</span>
            </button>
            <button
              type="button"
              onClick={() => setSaveTarget('browser')}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                saveTarget === 'browser'
                  ? 'border-[#9B1D20] bg-rose-50/60 font-semibold text-[#9B1D20] shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 text-stone-600'
              }`}
            >
              <span className="block font-bold">Chỉ máy này</span>
              <span className="text-[10px] text-stone-500">Chỉ lưu cục bộ trên trình duyệt máy bạn</span>
            </button>
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center justify-between">
            <span>Google Gemini API Key</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-amber-700 hover:underline flex items-center gap-1 normal-case font-normal"
            >
              <span>Lấy key miễn phí tại Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Key className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Dán mã khóa AIzaSy..."
              className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-stone-900 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Steps guide */}
        <div className="bg-stone-50 rounded-2xl p-3 text-[11px] text-stone-600 space-y-1">
          <p className="font-semibold text-stone-800">💡 Hướng dẫn lấy key miễn phí trong 30 giây:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-stone-600">
            <li>Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-rose-700 font-medium hover:underline">Google AI Studio</a>.</li>
            <li>Đăng nhập tài khoản Google của bạn và bấm <strong>"Create API Key"</strong>.</li>
            <li>Sao chép mã API Key và dán vào ô bên trên, sau đó bấm <strong>Lưu cấu hình</strong>.</li>
          </ol>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
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
    </div>
  );
};

