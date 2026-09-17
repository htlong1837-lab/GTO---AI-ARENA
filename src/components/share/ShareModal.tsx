import React, { useState } from 'react';
import { Outfit, Garment, ColorOption } from '../../types/outfit';
import { X, Copy, Check, Download, Share2, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: {
    name: string;
    garment: Garment;
    color: ColorOption;
    styleName: string;
    occasionName: string;
  };
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, outfit }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const mockShareUrl = `https://vietphucremix.vn/look/${encodeURIComponent(
    outfit.name.toLowerCase().replace(/\s+/g, '-')
  )}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(mockShareUrl);
      }
      setCopied(true);
      showToast({
        type: 'success',
        title: 'Đã sao chép liên kết!',
        message: 'Bạn có thể gửi link cho bạn bè hoặc chia sẻ lên Story/Threads.'
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      showToast({
        type: 'success',
        title: 'Đã xuất Look Card PNG!',
        message: 'Tấm thiệp phong cách thời trang đã sẵn sàng để đăng tải.'
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-heritage-border relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-heritage-red font-mono">
            Việt Phục Remix • Sharing
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            Chia sẻ Việt phục của bạn
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Lan tỏa nét đẹp tà áo Việt phối chất Gen Z đến cộng đồng
          </p>
        </div>

        {/* Look Card Mini Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-heritage-ivory to-amber-50 border border-amber-200/60 shadow-inner mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-stone-300 flex items-center justify-center text-white"
              style={{ backgroundColor: outfit.color.hex }}
            >
              <Sparkles className="w-6 h-6 text-amber-200" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-900 text-white inline-block mb-1">
                {outfit.garment.name} • {outfit.styleName}
              </span>
              <h4 className="font-bold text-sm text-stone-900 truncate leading-snug">
                {outfit.name}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Dịp: <strong>{outfit.occasionName}</strong> | Sắc màu:{' '}
                <span className="inline-block w-2 h-2 rounded-full align-middle mx-1" style={{ backgroundColor: outfit.color.hex }} />
                {outfit.color.vietnameseName}
              </p>
            </div>
          </div>
        </div>

        {/* Share Link Input Box */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-stone-600 block mb-1.5 uppercase tracking-wider">
            Đường dẫn liên kết look
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={mockShareUrl}
              className="flex-1 text-xs bg-stone-100 text-stone-700 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden font-mono select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-heritage-gold" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã chép' : 'Copy link'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Badges */}
        <div className="mb-6">
          <span className="text-[11px] font-medium text-stone-400 block mb-2 text-center">
            Hoặc chia sẻ nhanh qua:
          </span>
          <div className="flex items-center justify-center gap-2">
            {['Facebook', 'TikTok', 'Instagram', 'Threads', 'Zalo'].map((platform) => (
              <button
                key={platform}
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 py-3 px-4 rounded-xl bg-heritage-red hover:bg-heritage-red-dark text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Đang xuất file...' : 'Tải ảnh Look Card'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
