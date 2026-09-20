import React, { useState } from 'react';
import { TryOnResultRecord } from '../../data/modelsTryOn';
import {
  Download,
  Share2,
  Bookmark,
  Scale,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Split,
  Eye,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

interface StepResultShowcaseProps {
  result: TryOnResultRecord;
  onResetStep: () => void;
  onSaveToWardrobe: () => void;
  onAddToCompare: () => void;
  onOpenShareModal: () => void;
}

export const StepResultShowcase: React.FC<StepResultShowcaseProps> = ({
  result,
  onResetStep,
  onSaveToWardrobe,
  onAddToCompare,
  onOpenShareModal
}) => {
  const { showToast } = useToast();
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100
  const [compareMode, setCompareMode] = useState<'slider' | 'side_by_side'>('slider');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `viet-phuc-ai-${result.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0D9488', '#DFB058', '#9B1D20']
    });

    showToast({
      type: 'success',
      title: 'Đã tải ảnh về thiết bị!',
      message: 'Tấm ảnh người mẫu mặc Việt Phục sắc nét đã được lưu trữ an toàn.'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300 text-stone-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Bước 3 / 3 • Kết Quả Thử Đồ AI
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2 tracking-tight">
            {result.clothesName}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            AI đã ướm trang phục vừa vặn lên vóc dáng của <strong className="text-stone-800">{result.modelName}</strong>
          </p>
        </div>

        {/* View Mode Switcher (Slider vs Side by Side) */}
        <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setCompareMode('slider')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              compareMode === 'slider'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Thanh trượt Trước & Sau</span>
          </button>
          <button
            onClick={() => setCompareMode('side_by_side')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              compareMode === 'side_by_side'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Đặt cạnh nhau</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Stage */}
      {compareMode === 'slider' ? (
        /* BEFORE & AFTER SLIDER COMPONENT */
        <div className="relative w-full max-w-2xl mx-auto h-[480px] sm:h-[540px] rounded-3xl overflow-hidden border-2 border-stone-200 shadow-xl select-none bg-stone-100 group">
          {/* Layer 1: AFTER Image (AI Generated Outfit) - Base Layer */}
          <img
            src={result.imageUrl}
            alt="Sau khi mặc Việt Phục"
            className="absolute inset-0 w-full h-full object-contain object-center bg-stone-100"
          />

          {/* Layer 2: BEFORE Image (Original Model) - Clipped by Slider */}
          <div
            className="absolute inset-0 overflow-hidden bg-stone-100"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={result.baseModelImageUrl}
              alt="Mẫu ảnh gốc"
              className="absolute inset-0 w-full h-full object-contain object-center max-w-none"
              style={{ width: '100%', minWidth: '100%' }}
            />
            {/* Tag Before */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-900/80 text-white backdrop-blur shadow-md">
                Mẫu ảnh gốc
              </span>
            </div>
          </div>

          {/* Tag After */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white backdrop-blur shadow-md">
              ✨ AI Mặc Việt Phục
            </span>
          </div>

          {/* Divider Line & Slider Thumb */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-white text-stone-900 shadow-lg border-2 border-teal-600 flex items-center justify-center text-xs font-bold">
              ⇄
            </div>
          </div>

          {/* Hidden Range Input over image for effortless touch/mouse dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />

          {/* Bottom Hint */}
          <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none z-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-black/60 text-white backdrop-blur">
              Kéo thanh trượt để so sánh Trước và Sau khi mặc đồ
            </span>
          </div>
        </div>
      ) : (
        /* SIDE BY SIDE MODE */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Card 1: Before */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 flex flex-col">
            <div className="relative h-[360px] sm:h-[420px] w-full">
              <img
                src={result.baseModelImageUrl}
                alt="Mẫu ảnh ban đầu"
                className="w-full h-full object-contain object-center"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-stone-900/80 text-white shadow-sm">
                Trước: Mẫu ảnh gốc
              </span>
            </div>
            <div className="p-3 text-center bg-white border-t border-stone-100 text-xs font-medium text-stone-600">
              {result.modelName}
            </div>
          </div>

          {/* Card 2: After */}
          <div className="rounded-2xl overflow-hidden border-2 border-teal-600 bg-stone-100 flex flex-col shadow-md">
            <div className="relative h-[360px] sm:h-[420px] w-full">
              <img
                src={result.imageUrl}
                alt="AI kết xuất"
                className="w-full h-full object-contain object-center"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white shadow-sm">
                Sau: AI Mặc Việt Phục
              </span>
            </div>
            <div className="p-3 text-center bg-white border-t border-stone-100 text-xs font-bold text-teal-800">
              {result.clothesName}
            </div>
          </div>
        </div>
      )}

      {/* Cultural Heritage & Accessories Info Card */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong className="text-stone-900 font-bold block">{result.heritageRating} ({result.harmonyScore}% Hòa sắc)</strong>
            <span className="text-stone-500">Bảo toàn nét tôn nghiêm của y phục cổ truyền phối cùng tinh thần hiện đại.</span>
          </div>
        </div>

        {result.accessoryNames && result.accessoryNames.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {result.accessoryNames.map((acc, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white border border-stone-200 text-stone-700 text-[10px] font-medium">
                {acc}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onResetStep}
          className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thử trang phục khác</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Tải ảnh HD về máy</span>
        </button>

        <button
          onClick={onSaveToWardrobe}
          className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition-colors"
        >
          <Bookmark className="w-4 h-4" />
          <span>Lưu vào tủ đồ</span>
        </button>

        <button
          onClick={onAddToCompare}
          className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 transition-colors"
        >
          <Scale className="w-4 h-4 text-teal-700" />
          <span>So sánh</span>
        </button>

        <button
          onClick={onOpenShareModal}
          className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 transition-colors"
        >
          <Share2 className="w-4 h-4 text-rose-600" />
          <span>Chia sẻ</span>
        </button>
      </div>
    </div>
  );
};
