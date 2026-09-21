import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ClothingItemOption, TryOnModel } from '../../data/modelsTryOn';
import { ACCESSORIES } from '../../data/accessories';
import { Accessory } from '../../types/outfit';
import {
  Sparkles,
  Download,
  Share2,
  Check,
  Maximize2,
  X,
  Shirt,
  ZoomIn,
  Wand2,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

import { getCuratedPalettesForGarment } from '../../data/colors';

interface FitRoom3DCanvasProps {
  selectedClothes: ClothingItemOption;
  customClothesImage?: string | null;
  selectedColorId?: string;
  onSelectColor?: (colorId: string) => void;
  selectedColorHex: string;
  selectedColorName: string;
  selectedModel: TryOnModel;
  selectedAccessoryIds?: string[];
  selectedAccessoryNames?: string[];
  aiResultImage?: string | null;
  onOpenShareModal?: () => void;
  onSaveToWardrobe?: () => void;
  onAddToCompare?: () => void;
  onToggleAccessory?: (id: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  isHighQuality?: boolean;
  onToggleHighQuality?: (value: boolean) => void;
  onClearAiResult?: () => void;
}

export const FitRoom3DCanvas: React.FC<FitRoom3DCanvasProps> = ({
  selectedClothes,
  customClothesImage,
  selectedColorId,
  onSelectColor,
  selectedColorHex,
  selectedColorName,
  selectedModel,
  selectedAccessoryIds = [],
  selectedAccessoryNames = [],
  aiResultImage,
  onOpenShareModal,
  onSaveToWardrobe,
  onAddToCompare,
  onToggleAccessory,
  onGenerate,
  isGenerating = false,
  isHighQuality = true,
  onToggleHighQuality,
  onClearAiResult
}) => {
  const { showToast } = useToast();

  // View Mode: 'garment' (Trang phục độc bản không người mặc) vs 'ai' (Ảnh AI đã thử có mẫu mặc)
  const [viewMode, setViewMode] = useState<'garment' | 'ai'>('garment');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [inspectingAccessory, setInspectingAccessory] = useState<Accessory | null>(null);

  // When AI result is generated, automatically switch to AI preview
  useEffect(() => {
    if (aiResultImage) {
      setViewMode('ai');
    }
  }, [aiResultImage]);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!isZoomModalOpen && !inspectingAccessory) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomModalOpen(false);
        setInspectingAccessory(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomModalOpen, inspectingAccessory]);

  // The active garment image (custom uploaded or clean ghost-mannequin product photo of the exact selected color)
  const garmentImageUrl =
    customClothesImage ||
    (selectedColorId && selectedClothes.colorVariants?.[selectedColorId]) ||
    selectedClothes.thumbnailUrl;

  // Selected accessory objects
  const activeAccessories: Accessory[] = ACCESSORIES.filter((acc) =>
    selectedAccessoryIds.includes(acc.id) || selectedAccessoryNames.includes(acc.name)
  );

  // Download the current view photo
  const handleDownloadPhoto = () => {
    const isAi = viewMode === 'ai' && aiResultImage;
    const downloadUrl = isAi ? aiResultImage : garmentImageUrl;
    if (!downloadUrl) return;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = isAi
      ? `viet-phuc-ai-${selectedClothes.garmentType}-${selectedModel.gender}-${Date.now()}.jpg`
      : `viet-phuc-san-pham-${selectedClothes.garmentType}-${Date.now()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 70,
      spread: 55,
      origin: { y: 0.8 },
      colors: ['#0D9488', '#DFB058', '#9B1D20']
    });

    showToast({
      type: 'success',
      title: isAi ? 'Đã tải ảnh thử đồ AI!' : 'Đã tải ảnh trang phục!',
      message: 'Ảnh chất lượng cao đã được lưu về thiết bị của bạn.'
    });
  };

  return (
    <div className="relative w-full flex flex-col justify-between h-[640px] sm:h-[720px] lg:h-[calc(100vh-6.5rem)] bg-[#F2F3F6] rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-sm overflow-hidden text-stone-900 select-none group">
      
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Top Action Toolbar (ONLY displayed when an AI image has been generated) */}
      {aiResultImage && (
        <div className="absolute top-4 left-4 sm:left-6 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="pointer-events-auto inline-flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-2xl px-2 py-1.5 border border-stone-200/90 shadow-md text-xs font-semibold text-stone-700">
            <button
              onClick={handleDownloadPhoto}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              title="Tải ảnh AI về máy"
            >
              <Download className="w-3.5 h-3.5 text-stone-700" />
              <span>Download</span>
            </button>
            <div className="w-[1px] h-4 bg-stone-200 mx-0.5" />
            <button
              onClick={() => setIsZoomModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              title="Xem ảnh cỡ lớn (Upscale / Zoom)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-stone-700" />
              <span>Upscale</span>
            </button>
            {onOpenShareModal && (
              <>
                <div className="w-[1px] h-4 bg-stone-200 mx-0.5" />
                <button
                  onClick={onOpenShareModal}
                  className="p-2 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition-colors text-stone-600 cursor-pointer"
                  title="Chia sẻ kết quả"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            {onClearAiResult && (
              <>
                <div className="w-[1px] h-4 bg-stone-200 mx-0.5" />
                <button
                  onClick={() => {
                    setViewMode('garment');
                    onClearAiResult();
                  }}
                  className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors text-red-500 cursor-pointer"
                  title="Xóa kết quả AI này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Central Showcase Display Stage */}
      <div className="relative flex-1 flex items-center justify-center my-auto overflow-hidden py-2">
        {viewMode === 'ai' && aiResultImage ? (
          /* AI TRY-ON PHOTO */
          <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">
            <img
              src={aiResultImage}
              alt="AI Try-On Result"
              className="max-h-full max-w-full object-contain object-center rounded-2xl drop-shadow-[0_20px_45px_rgba(0,0,0,0.2)] transition-all duration-500 animate-in fade-in zoom-in-95 cursor-zoom-in"
              onClick={() => setIsZoomModalOpen(true)}
            />
          </div>
        ) : (
          /* CLEAN GARMENT PRODUCT PHOTO (NO HUMAN WEARER) */
          <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">
            <img
              key={garmentImageUrl}
              src={garmentImageUrl}
              alt={selectedClothes.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = selectedClothes.thumbnailUrl;
              }}
              className="max-h-full max-w-full object-contain object-center drop-shadow-[0_20px_45px_rgba(0,0,0,0.18)] transition-all duration-500 animate-in fade-in zoom-in-95 group-hover:scale-[1.01] cursor-zoom-in"
              onClick={() => setIsZoomModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Bottom Floating Bar: Switcher Thumbnails (Only when AI Result exists) */}
      {aiResultImage && (
        <div className="relative z-10 flex items-center justify-end gap-2 pt-2">
          {/* Garment Thumbnail */}
          <button
            onClick={() => setViewMode('garment')}
            className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white cursor-pointer ${
              viewMode === 'garment'
                ? 'border-teal-600 ring-2 ring-teal-500/30 shadow-md scale-105'
                : 'border-stone-200 opacity-70 hover:opacity-100'
            }`}
            title="Xem ảnh trang phục nguyên bản"
          >
            <img
              src={garmentImageUrl}
              alt={selectedClothes.name}
              className="w-full h-full object-contain"
            />
          </button>

          {/* AI Result Thumbnail */}
          <button
            onClick={() => setViewMode('ai')}
            className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white cursor-pointer ${
              viewMode === 'ai'
                ? 'border-teal-600 ring-2 ring-teal-500/30 shadow-md scale-105'
                : 'border-stone-200 opacity-70 hover:opacity-100'
            }`}
            title="Xem ảnh người mẫu đã thử đồ AI"
          >
            <img
              src={aiResultImage}
              alt="AI Try-On"
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-0 inset-x-0 bg-teal-600 text-white text-[8px] font-bold text-center leading-tight">
              AI
            </span>
          </button>
        </div>
      )}

      {/* Fullscreen Zoom Lightbox Modal mounted directly to document.body */}
      {isZoomModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsZoomModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          {/* Top Bar with Title & Close Button */}
          <div className="w-full max-w-5xl flex items-center justify-between z-10 px-2 sm:px-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-medium border border-white/15 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{viewMode === 'ai' && aiResultImage ? '✨ Ảnh AI Đã Thử Lên Mẫu' : 'Y Phục Nguyên Bản (Ultra HD)'}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDownloadPhoto}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shadow-lg hover:scale-105 active:scale-95 border border-white/10 flex items-center gap-1.5 px-3.5 text-xs font-medium"
                title="Tải ảnh về máy"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Tải ảnh</span>
              </button>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="p-2.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all shadow-lg hover:scale-105 active:scale-95 border border-white/20"
                title="Đóng (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Image Viewport */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-1 w-full max-w-5xl flex items-center justify-center my-2 p-2 relative"
          >
            <img
              src={viewMode === 'ai' && aiResultImage ? aiResultImage : garmentImageUrl}
              alt={selectedClothes.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = selectedClothes.thumbnailUrl;
              }}
              className="max-h-[72vh] sm:max-h-[76vh] w-auto max-w-full object-contain rounded-2xl drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/10"
            />
          </div>

          {/* Bottom Info Bar */}
          <div className="w-full max-w-3xl text-center pb-2 z-10">
            <h4 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide">{selectedClothes.name}</h4>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 font-light">
              {viewMode === 'ai' && aiResultImage
                ? `AI Try-on • Người mẫu ${selectedModel.name} • Sắc lụa: ${selectedColorName}`
                : `Ảnh sản phẩm không người mặc • ${selectedClothes.era} • Sắc lụa: ${selectedColorName}`}
            </p>
          </div>
        </div>,
        document.body
      )}

      {/* Accessory Inspection Modal mounted directly to document.body */}
      {inspectingAccessory && typeof document !== 'undefined' && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setInspectingAccessory(null);
          }}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-stone-200 shadow-2xl relative">
            <button
              onClick={() => setInspectingAccessory(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              {inspectingAccessory.thumbnailUrl ? (
                <img
                  src={inspectingAccessory.thumbnailUrl}
                  alt={inspectingAccessory.name}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                  <Sparkles className="w-8 h-8" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {inspectingAccessory.isTraditional ? 'Phụ Kiện Cổ Phong' : 'Phụ Kiện Gen Z'}
                </span>
                <h4 className="text-base font-bold text-stone-900 mt-1">{inspectingAccessory.name}</h4>
                <span className="text-xs text-stone-500 capitalize">Phân loại: {inspectingAccessory.category}</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/80">
              {inspectingAccessory.description}
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectingAccessory(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Đóng
              </button>
              {onToggleAccessory && (
                <button
                  onClick={() => {
                    onToggleAccessory(inspectingAccessory.id);
                    setInspectingAccessory(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                >
                  Bỏ phụ kiện này
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
