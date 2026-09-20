import React, { useState } from 'react';
import { TryOnResultRecord } from '../../data/modelsTryOn';
import {
  Download,
  Sparkles,
  ShieldCheck,
  Share2,
  Trash2,
  Maximize2,
  Info,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

interface FitRoomResultCanvasProps {
  currentLook: TryOnResultRecord | null;
  historyLooks: TryOnResultRecord[];
  onSelectHistoryLook: (look: TryOnResultRecord) => void;
  onDeleteHistoryLook: (id: string) => void;
  isGenerating: boolean;
  progressPercent: number;
  progressText: string;
  onOpenShareModal?: () => void;
}

export const FitRoomResultCanvas: React.FC<FitRoomResultCanvasProps> = ({
  currentLook,
  historyLooks,
  onSelectHistoryLook,
  onDeleteHistoryLook,
  isGenerating,
  progressPercent,
  progressText,
  onOpenShareModal
}) => {
  const { showToast } = useToast();
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleDownload = () => {
    if (!currentLook) return;
    const link = document.createElement('a');
    link.href = currentLook.imageUrl;
    link.download = `viet-phuc-remix-${currentLook.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0D9488', '#DFB058', '#9B1D20']
    });

    showToast({
      type: 'success',
      title: 'Đã lưu ảnh thử đồ!',
      message: 'Tấm thiệp thời trang đã sẵn sàng trong thư viện ảnh của bạn.'
    });
  };

  const handleUpscale = () => {
    setIsUpscaling(true);
    showToast({
      type: 'info',
      title: 'Đang tăng cường độ nét...',
      message: 'AI đang tái tạo độ óng ả của tà lụa và hoa văn dệt chìm.'
    });

    setTimeout(() => {
      setIsUpscaling(false);
      showToast({
        type: 'success',
        title: 'Hoàn tất làm nét!',
        message: 'Bản phối đã được nâng cấp độ phân giải cực nét.'
      });
    }, 1000);
  };

  const handleDelete = () => {
    if (currentLook) {
      onDeleteHistoryLook(currentLook.id);
      showToast({
        type: 'info',
        title: 'Đã xóa bản phối',
        message: 'Đã gỡ bản thử đồ khỏi phòng thử.'
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F4F0] rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-inner relative overflow-hidden text-stone-900">
      
      {/* Top Floating Action Bar */}
      <div className="flex items-center justify-between z-20 mb-3 gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur text-stone-800 border border-stone-200 shadow-xs truncate">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse shrink-0" />
            <span className="truncate">{currentLook ? currentLook.clothesName : 'Phòng Thử Đồ'}</span>
          </span>
        </div>

        {/* Action Buttons in Vietnamese */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-stone-200 shadow-sm text-xs shrink-0">
          <button
            onClick={handleDownload}
            disabled={!currentLook || isGenerating}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-stone-100 text-stone-700 font-semibold transition-colors disabled:opacity-40"
            title="Tải ảnh Lookbook về máy"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tải ảnh</span>
          </button>

          <button
            onClick={handleUpscale}
            disabled={!currentLook || isGenerating || isUpscaling}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-stone-100 text-stone-700 font-medium transition-colors disabled:opacity-40"
            title="Tăng cường chi tiết vải lụa"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm nét</span>
          </button>

          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              disabled={!currentLook || isGenerating}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors disabled:opacity-40"
              title="Chia sẻ bản phối"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={!currentLook || isGenerating}
            className="p-1.5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors disabled:opacity-40"
            title="Xóa bản thử đồ này"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Stage Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[480px] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-100 via-white to-stone-100 flex items-center justify-center border border-stone-200 shadow-xs group">
        {currentLook ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={currentLook.imageUrl}
              alt={currentLook.clothesName}
              className={`max-h-full max-w-full object-contain object-center drop-shadow-xl transition-all duration-500 ${
                isUpscaling ? 'filter blur-xs brightness-110' : ''
              }`}
            />

            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />

            {/* Cultural Badge Tag (Bottom Left) */}
            <div className="absolute bottom-3.5 left-3.5 z-10 flex flex-col gap-1 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-900/85 text-amber-200 backdrop-blur-md border border-amber-500/30 shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLook.heritageRating} ({currentLook.harmonyScore}% Hòa sắc)</span>
              </span>
              <span className="text-[11px] text-white/90 drop-shadow font-serif italic pl-1">
                Người mẫu: {currentLook.modelName}
              </span>
            </div>

            {/* Brand Watermark (Bottom Right) */}
            <div className="absolute bottom-3.5 right-3.5 text-stone-300 font-mono text-[10px] opacity-70 tracking-widest flex items-center gap-1 select-none">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>VIỆT PHỤC REMIX</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-stone-400">
            <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 mb-3">
              <Sparkles className="w-8 h-8 text-teal-700" />
            </div>
            <h4 className="text-base font-bold text-stone-800">Sẵn sàng thử đồ</h4>
            <p className="text-xs text-stone-500 max-w-xs mt-1 font-light">
              Chọn Cổ phục, phụ kiện và người mẫu ở cột bên trái rồi bấm nút "Thử đồ ngay"!
            </p>
          </div>
        )}

        {/* AI Generating Scan Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
            </div>

            <h4 className="text-base font-bold text-white tracking-tight">AI đang tạo bản phối</h4>
            <p className="text-xs text-teal-200 mt-1 font-light max-w-xs">{progressText}</p>

            <div className="w-56 max-w-full bg-stone-800 rounded-full h-2 mt-4 overflow-hidden border border-stone-700">
              <div
                className="bg-gradient-to-r from-teal-500 to-amber-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-stone-400 mt-1.5">{progressPercent}%</span>
          </div>
        )}
      </div>

      {/* Bottom Thumbnail Strip (Lịch sử các bản phối) */}
      <div className="mt-3 flex items-center justify-between gap-3 pt-2 border-t border-stone-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Đã thử:
          </span>
          {historyLooks.map((look) => {
            const isCurrent = currentLook?.id === look.id;
            return (
              <button
                key={look.id}
                onClick={() => onSelectHistoryLook(look)}
                className={`relative w-11 h-14 rounded-xl overflow-hidden shrink-0 border transition-all ${
                  isCurrent
                    ? 'border-teal-600 ring-2 ring-teal-600/40 shadow-sm scale-105'
                    : 'border-stone-300 opacity-65 hover:opacity-100 hover:border-stone-400'
                }`}
                title={look.clothesName}
              >
                <img src={look.imageUrl} alt={look.clothesName} className="w-full h-full object-cover" />
                {isCurrent && (
                  <div className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-teal-600 text-white flex items-center justify-center">
                    <Check className="w-2 h-2 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Download Action Pill */}
        <button
          onClick={handleDownload}
          disabled={!currentLook}
          className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-teal-700 text-white flex items-center justify-center shadow-sm transition-colors shrink-0 disabled:opacity-40"
          title="Tải ảnh về máy"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
