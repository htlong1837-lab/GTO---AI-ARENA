import React, { useRef, useState, useEffect } from 'react';
import {
  ThreeCanvas,
  ThreeCanvasHandle,
  LightingMode,
  CameraPreset
} from '../studio3d/ThreeCanvas';
import {
  Slot3DType,
  ActiveSlotState,
  Item3D,
  STARTER_3D_ITEMS,
  DEFAULT_ACTIVE_SLOTS
} from '../../data/models3d';
import { ClothingItemOption, TryOnModel } from '../../data/modelsTryOn';
import {
  RotateCw,
  Camera,
  Maximize2,
  Sparkles,
  Download,
  Share2,
  Layers,
  Check,
  Eye,
  Sun
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

interface FitRoom3DCanvasProps {
  selectedClothes: ClothingItemOption;
  selectedColorHex: string;
  selectedColorName: string;
  selectedModel: TryOnModel;
  selectedAccessoryNames?: string[];
  aiResultImage?: string | null;
  onOpenShareModal?: () => void;
  onSaveToWardrobe?: () => void;
  onAddToCompare?: () => void;
}

// Map garment type to 3D starter item ID
const GARMENT_3D_ID_MAP: Record<string, string> = {
  'ao-dai': 'base-ao-dai',
  'ao-ngu-than': 'base-ao-ngu-than',
  'nhat-binh': 'base-ao-nhat-binh',
  'ao-tu-than': 'base-ao-tu-than',
  'ao-ba-ba': 'base-ao-ba-ba'
};

export const FitRoom3DCanvas: React.FC<FitRoom3DCanvasProps> = ({
  selectedClothes,
  selectedColorHex,
  selectedColorName,
  selectedModel,
  selectedAccessoryNames = [],
  aiResultImage,
  onOpenShareModal,
  onSaveToWardrobe,
  onAddToCompare
}) => {
  const { showToast } = useToast();
  const canvasRef = useRef<ThreeCanvasHandle>(null);

  // 3D Viewport Settings
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<LightingMode>('studio');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('all');
  const [viewMode, setViewMode] = useState<'3d' | 'ai' | 'photo'>('3d');

  // When AI result is generated, automatically switch to AI preview
  useEffect(() => {
    if (aiResultImage) {
      setViewMode('ai');
    }
  }, [aiResultImage]);

  // Active 3D Slots State
  const target3DItemId = GARMENT_3D_ID_MAP[selectedClothes.garmentType] || 'base-ao-dai';

  const [activeSlots, setActiveSlots] = useState<Record<Slot3DType, ActiveSlotState>>({
    base: {
      itemId: target3DItemId,
      visible: true,
      color: selectedColorHex,
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
    }
  });

  // Synchronize 3D model and color whenever selection changes
  useEffect(() => {
    const newItemId = GARMENT_3D_ID_MAP[selectedClothes.garmentType] || 'base-ao-dai';
    setActiveSlots({
      base: {
        itemId: newItemId,
        visible: true,
        color: selectedColorHex,
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
      }
    });
  }, [selectedClothes.garmentType, selectedColorHex]);

  // Capture Snapshot from 3D Viewport
  const handleCaptureSnapshot = () => {
    const dataUrl = canvasRef.current?.captureSnapshot();
    if (!dataUrl) {
      showToast({ type: 'error', title: 'Lỗi chụp ảnh', message: 'Không thể chụp ảnh từ khung 3D.' });
      return;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `viet-phuc-3d-${selectedClothes.garmentType}-${selectedModel.gender}-${Date.now()}.png`;
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
      title: 'Đã chụp ảnh 3D thành công!',
      message: 'Hình ảnh góc chụp 3D độ nét cao đã được tải về máy của bạn.'
    });
  };

  return (
    <div className="flex flex-col min-h-[640px] sm:min-h-[720px] bg-[#F3F4F6] rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-inner relative overflow-hidden text-stone-900">
      
      {/* Top Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between z-20 mb-3 gap-2">
        {/* Title & Tag */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur text-stone-800 border border-stone-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse shrink-0" />
            <span>{selectedClothes.name}</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100/90 text-amber-900 border border-amber-300/80">
            {selectedModel.gender === 'female' ? 'Dáng Nữ ♀' : 'Dáng Nam ♂'}
          </span>
        </div>

        {/* View Mode Switcher: 3D Model vs Ảnh AI vs Ảnh Mẫu */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-stone-200 shadow-sm text-xs">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-semibold ${
              viewMode === '3d'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mô hình 3D</span>
          </button>
          
          {aiResultImage && (
            <button
              onClick={() => setViewMode('ai')}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-semibold ${
                viewMode === 'ai'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ảnh AI Đã Thử</span>
            </button>
          )}

          <button
            onClick={() => setViewMode('photo')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-semibold ${
              viewMode === 'photo'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ảnh Mẫu</span>
          </button>
        </div>
      </div>

      {/* 3D Secondary Controls Toolbar (Camera Presets, Auto Rotate, Snapshot) */}
      {viewMode === '3d' && (
        <div className="flex flex-wrap items-center justify-between gap-2 z-20 mb-2 px-1 text-xs">
          {/* Camera Presets */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mr-1">Góc:</span>
            <button
              onClick={() => setCameraPreset('all')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                cameraPreset === 'all' ? 'bg-teal-600 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Toàn thân
            </button>
            <button
              onClick={() => setCameraPreset('collar')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                cameraPreset === 'collar' ? 'bg-teal-600 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Cổ áo
            </button>
            <button
              onClick={() => setCameraPreset('hem')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                cameraPreset === 'hem' ? 'bg-teal-600 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Tà áo
            </button>
          </div>

          {/* Actions: Auto Rotate, Light Mode, Capture Snapshot */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-medium transition-all ${
                autoRotate
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
              title="Bật/tắt tự động xoay 360 độ"
            >
              <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>Xoay 360°</span>
            </button>

            <button
              onClick={() => {
                const nextLight: Record<LightingMode, LightingMode> = {
                  studio: 'cyber',
                  cyber: 'natural',
                  natural: 'studio',
                  minimal: 'studio'
                };
                setLightingMode(nextLight[lightingMode]);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-[11px] font-medium transition-all shadow-xs"
              title="Đổi ánh sáng: Studio / Cyber / Tự nhiên"
            >
              <Sun className="w-3 h-3 text-amber-600" />
              <span className="capitalize">{lightingMode}</span>
            </button>

            <button
              onClick={handleCaptureSnapshot}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-stone-900 hover:bg-teal-700 text-white text-[11px] font-bold transition-all shadow-xs"
              title="Chụp ảnh góc 3D hiện tại tải về máy"
            >
              <Camera className="w-3 h-3" />
              <span>Chụp 3D</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="relative w-full h-[520px] sm:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-100 via-white to-stone-100 border border-stone-200/80 shadow-xs group">
        
        {viewMode === '3d' ? (
          /* 3D INTERACTIVE VIEWPORT */
          <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <ThreeCanvas
              ref={canvasRef}
              slots={activeSlots}
              items={STARTER_3D_ITEMS}
              lightingMode={lightingMode}
              autoRotate={autoRotate}
              cameraPreset={cameraPreset}
            />

            {/* Bottom 3D Helper Hint */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-medium bg-stone-900/75 text-stone-200 backdrop-blur-md shadow-md flex items-center gap-1.5">
                <RotateCw className="w-3 h-3 text-teal-400" />
                <span>Dùng chuột hoặc chạm để xoay 360° và cuộn phóng to</span>
              </span>
            </div>
          </div>
        ) : viewMode === 'ai' && aiResultImage ? (
          /* AI TRY-ON PHOTO VIEWPORT */
          <div className="relative w-full h-full flex items-center justify-center p-4 bg-stone-900/5">
            <img
              src={aiResultImage}
              alt="AI Try-On Result"
              className="max-h-[500px] max-w-full object-contain object-center rounded-xl drop-shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {onSaveToWardrobe && (
                <button
                  onClick={onSaveToWardrobe}
                  className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-stone-800 text-xs font-semibold shadow-md border border-stone-200 transition-all flex items-center gap-1"
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
            <div className="absolute bottom-3 right-3 text-teal-900 font-medium text-[11px] bg-teal-50/90 border border-teal-200/80 px-2.5 py-1 rounded-lg backdrop-blur">
              ✨ KẾT QUẢ AI THỬ ĐỒ CHÂN THỰC
            </div>
          </div>
        ) : (
          /* PHOTO / EDITORIAL VIEWPORT */
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={selectedClothes.defaultModelLookUrl[selectedModel.id] || selectedClothes.thumbnailUrl}
              alt={selectedClothes.name}
              className="max-h-full max-w-full object-contain object-center drop-shadow-xl transition-all duration-500"
            />
            <div className="absolute bottom-3 right-3 text-stone-400 font-mono text-[10px] opacity-75">
              LOOKBOOK STUDIO • {selectedClothes.era}
            </div>
          </div>
        )}

        {/* Floating Brand & Silk Tag (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-stone-900 backdrop-blur-md border border-stone-200 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedColorHex }} />
            <span>Sắc lụa: {selectedColorName}</span>
          </span>
          {selectedAccessoryNames.length > 0 && (
            <span className="text-[10px] text-stone-600 bg-white/80 backdrop-blur px-2 py-0.5 rounded-md w-fit border border-stone-200 shadow-xs">
              Kèm: {selectedAccessoryNames.join(' • ')}
            </span>
          )}
        </div>

      </div>

      {/* Bottom Footer Information */}
      <div className="mt-3 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Mô hình 3D chuẩn PBR kết hợp ánh sáng đa hướng</span>
        </div>
        <div>
          <span>Định dạng: <strong className="text-stone-700 font-mono">GLTF / GLB</strong></span>
        </div>
      </div>

    </div>
  );
};
