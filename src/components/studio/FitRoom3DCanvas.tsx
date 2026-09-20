import React, { useState, useEffect } from 'react';
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
  Info,
  Layers,
  ZoomIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

import { POPULAR_COLORS } from '../../data/colors';

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
  onToggleAccessory
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
    <div className="flex flex-col min-h-[640px] sm:min-h-[720px] bg-[#F7F7F8] rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-inner relative overflow-hidden text-stone-900">
      
      {/* Top Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between z-20 mb-3 gap-2">
        {/* Title & Heritage Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-stone-800 border border-stone-200 shadow-xs">
            <Shirt className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{selectedClothes.name}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80">
            {selectedClothes.era}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            {selectedModel.gender === 'female' ? 'Form Nữ ♀' : 'Form Nam ♂'}
          </span>
        </div>

        {/* View Mode Switcher: Y Phục Độc Bản vs Ảnh AI */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-stone-200 shadow-xs text-xs">
          <button
            onClick={() => setViewMode('garment')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-semibold ${
              viewMode === 'garment'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Ảnh Trang Phục</span>
          </button>
          
          {aiResultImage && (
            <button
              onClick={() => setViewMode('ai')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-semibold ${
                viewMode === 'ai'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ảnh Mẫu Đã Thử AI</span>
            </button>
          )}

          {/* Zoom Lightbox Trigger */}
          <button
            onClick={() => setIsZoomModalOpen(true)}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Xem ảnh cỡ lớn"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Download Trigger */}
          <button
            onClick={handleDownloadPhoto}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Tải ảnh về máy"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Showcase Viewport */}
      <div className="relative w-full flex-1 min-h-[480px] sm:min-h-[540px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#F9F9FA] via-white to-[#F0F0F4] border border-stone-200 shadow-xs flex flex-col justify-between p-4 group">
        
        {/* Subtle Luxury Pattern Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="relative z-10 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-stone-700 backdrop-blur-md border border-stone-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              {viewMode === 'ai' && aiResultImage
                ? '✨ KẾT QUẢ AI ƯỚM LÊN MẪU STUDIO'
                : 'Y PHỤC ĐỘC BẢN • KHÔNG CÓ NGƯỜI MẶC'}
            </span>
          </div>

          {/* Actions in AI View Mode */}
          {viewMode === 'ai' && aiResultImage && (
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {onSaveToWardrobe && (
                <button
                  onClick={onSaveToWardrobe}
                  className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-stone-800 text-xs font-semibold shadow-md border border-stone-200 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>Lưu Tủ Đồ</span>
                </button>
              )}
              {onOpenShareModal && (
                <button
                  onClick={onOpenShareModal}
                  className="p-2 rounded-xl bg-white/95 hover:bg-white text-stone-800 shadow-md border border-stone-200 transition-all"
                  title="Chia sẻ kết quả"
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-700" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Central Display Image */}
        <div className="relative flex-1 flex items-center justify-center my-2 overflow-hidden">
          {viewMode === 'ai' && aiResultImage ? (
            /* AI TRY-ON PHOTO */
            <div className="relative max-h-[460px] sm:max-h-[500px] w-full h-full flex items-center justify-center">
              <img
                src={aiResultImage}
                alt="AI Try-On Result"
                className="max-h-[460px] sm:max-h-[500px] max-w-full object-contain object-center rounded-2xl drop-shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 cursor-zoom-in"
                onClick={() => setIsZoomModalOpen(true)}
              />
            </div>
          ) : (
            /* CLEAN GARMENT PRODUCT PHOTO (NO HUMAN WEARER) */
            <div className="relative max-h-[460px] sm:max-h-[500px] w-full h-full flex items-center justify-center">
              <img
                key={garmentImageUrl}
                src={garmentImageUrl}
                alt={selectedClothes.name}
                className="max-h-[460px] sm:max-h-[500px] max-w-full object-contain object-center drop-shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 group-hover:scale-[1.02] cursor-zoom-in"
                onClick={() => setIsZoomModalOpen(true)}
              />
              
              {/* Subtle Zoom Hint on Hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/75 text-white text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur pointer-events-none flex items-center gap-1">
                <ZoomIn className="w-3 h-3" />
                <span>Bấm để phóng to</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Floating Info & Selected Accessories Showcase Tray */}
        <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-stone-200/60 bg-white/70 backdrop-blur-md -mx-4 -mb-4 p-4 rounded-b-2xl">
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Color Tag & Quick Swatches */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-stone-800 border border-stone-200 shadow-xs">
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-black/10 shadow-xs transition-colors duration-300"
                  style={{ backgroundColor: selectedColorHex }}
                />
                <span>Sắc lụa: {selectedColorName}</span>
              </span>

              {/* Quick Interactive Color Swatches on Canvas */}
              {onSelectColor && !customClothesImage && (
                <div className="flex items-center gap-1.5 bg-stone-100/90 px-2 py-0.5 rounded-full border border-stone-200 shadow-2xs">
                  {POPULAR_COLORS.map((c) => {
                    const isActive = selectedColorId === c.id;
                    const isLight = c.id === 'trang-lua-nga';
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onSelectColor(c.id)}
                        className={`w-4 h-4 rounded-full transition-all border ${
                          isLight ? 'border-stone-300' : 'border-black/15'
                        } ${
                          isActive
                            ? 'ring-2 ring-stone-900 scale-125 shadow-xs z-10'
                            : 'hover:scale-110 opacity-75 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={`${c.vietnameseName} (${c.element})`}
                      />
                    );
                  })}
                </div>
              )}

              <span className="text-[11px] text-stone-500 font-light hidden lg:inline">
                {selectedClothes.description}
              </span>
            </div>

            {/* Accessory Count Tag */}
            <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
              Phụ kiện phối kèm: <strong className="text-teal-700 font-bold">{activeAccessories.length}</strong>/4
            </span>
          </div>

          {/* Selected Accessories Strip */}
          {activeAccessories.length > 0 ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 pt-1">
              {activeAccessories.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => setInspectingAccessory(acc)}
                  className="group/acc flex items-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 hover:border-teal-500/80 rounded-xl p-1.5 pr-2.5 transition-all shadow-xs cursor-pointer shrink-0"
                  title="Bấm để xem chi tiết phụ kiện"
                >
                  {acc.thumbnailUrl ? (
                    <img
                      src={acc.thumbnailUrl}
                      alt={acc.name}
                      className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-100">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className="text-left">
                    <span className="text-xs font-bold text-stone-800 block line-clamp-1 group-hover/acc:text-teal-700 transition-colors">
                      {acc.name}
                    </span>
                    <span className="text-[9px] text-stone-400">
                      {acc.isTraditional ? 'Thuần Việt Cổ Phong' : 'Gen Z Remix'}
                    </span>
                  </div>

                  {onToggleAccessory && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAccessory(acc.id);
                      }}
                      className="opacity-60 hover:opacity-100 p-0.5 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all ml-1"
                      title="Bỏ phụ kiện này"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-stone-400 font-light italic">
              Chưa chọn phụ kiện phối kèm nào. Bạn có thể chọn thêm khăn đóng, kiềng bạc, nón quai thao... ở cột bên trái.
            </p>
          )}

        </div>

      </div>

      {/* Bottom Footer Information */}
      <div className="mt-3 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
        <div className="flex items-center gap-1.5">
          <Shirt className="w-3.5 h-3.5 text-teal-600" />
          <span>Hình ảnh y phục nguyên bản không người mặc • Tôn vinh nét tinh xảo của cổ phục Việt</span>
        </div>
        <div>
          <span>Định dạng ảnh: <strong className="text-stone-700 font-mono">Ultra HD Studio</strong></span>
        </div>
      </div>

      {/* Fullscreen Zoom Lightbox Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Đóng xem lớn"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center justify-center">
            <img
              src={viewMode === 'ai' && aiResultImage ? aiResultImage : garmentImageUrl}
              alt={selectedClothes.name}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl drop-shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <h4 className="text-lg font-bold font-serif">{selectedClothes.name}</h4>
              <p className="text-xs text-stone-300 mt-0.5">
                {viewMode === 'ai' && aiResultImage
                  ? `AI Try-on • Người mẫu ${selectedModel.name} • Sắc lụa: ${selectedColorName}`
                  : `Ảnh sản phẩm không người mặc • ${selectedClothes.era} • Sắc lụa: ${selectedColorName}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Accessory Inspection Modal */}
      {inspectingAccessory && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
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
        </div>
      )}

    </div>
  );
};
