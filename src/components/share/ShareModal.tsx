import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Garment, ColorOption } from '../../types/outfit';
import { X, Copy, Check, Download, Sparkles } from 'lucide-react';
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

  return typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
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
          <h3 className="text-xl font-serif font-bold text-heritage-ink mt-0.5">
            Chia sẻ Việt phục của bạn
          </h3>
        </div>

        {/* Look Card Mockup */}
        <div className="rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#EFEAE1] border border-heritage-border p-4 mb-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl border border-white/60 shadow-xs shrink-0"
              style={{ backgroundColor: outfit.color.hex }}
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-serif font-bold text-sm text-heritage-ink truncate">
                {outfit.name}
              </h4>
              <p className="text-[11px] text-stone-500 truncate">
                {outfit.garment.name} • Sắc {outfit.color.vietnameseName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#E5DCC9] text-heritage-ink font-medium">
                  <Sparkles className="w-2.5 h-2.5 text-heritage-red" />
                  {outfit.styleName}
                </span>
                <span className="text-[10px] text-stone-400">• {outfit.occasionName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Link Share */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-heritage-ink mb-1.5 uppercase tracking-wider">
            Liên kết trực tiếp
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={mockShareUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-heritage-border bg-stone-50 text-xs text-stone-600 font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                copied
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white border-heritage-border text-heritage-ink hover:bg-stone-50'
              }`}
              title="Sao chép liên kết"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
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
    </div>,
    document.body
  ) : null;
};
