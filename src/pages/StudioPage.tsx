import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  TryOnModel,
  ClothingItemOption,
  TryOnResultRecord,
  BASE_STUDIO_MODELS,
  PRESET_CLOTHING_ITEMS
} from '../data/modelsTryOn';
import { COLORS, getCuratedPalettesForGarment } from '../data/colors';
import { GARMENTS } from '../data/garments';
import { ACCESSORIES } from '../data/accessories';
import { Outfit } from '../types/outfit';
import { FitRoomSelectClothes } from '../components/studio/FitRoomSelectClothes';
import { FitRoomSelectModel } from '../components/studio/FitRoomSelectModel';
import { FitRoom3DCanvas } from '../components/studio/FitRoom3DCanvas';
import { ShareModal } from '../components/share/ShareModal';
import { GeminiKeyModal } from '../components/common/GeminiKeyModal';
import { VirtualTryOnService } from '../services/virtualTryOnService';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Wand2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudioPageProps {
  initialGarmentId?: string;
  initialOccasionId?: string;
  initialStyleId?: string;
  initialColorId?: string;
  initialAccessoryIds?: string[];
  initialGender?: 'female' | 'male';
  initialWeatherId?: string;
  initialAiImageUrl?: string;
  onNavigate: (_tab: string) => void;
  onRefreshCompareCount: () => void;
}

export const StudioPage: React.FC<StudioPageProps> = ({
  initialGarmentId,
  initialColorId,
  initialAccessoryIds,
  initialGender = 'female',
  onRefreshCompareCount
}) => {
  const { showToast } = useToast();

  // Model Selection State (Male / Female or Custom Upload)
  const [selectedModel, setSelectedModel] = useState<TryOnModel>(() => {
    const match = BASE_STUDIO_MODELS.find((m) => m.gender === initialGender);
    return match || BASE_STUDIO_MODELS[0];
  });
  const [customModelImage, setCustomModelImage] = useState<string | null>(null);

  // Clothes Selection State (Garment + Silk Color + Accessories)
  const [selectedClothes, setSelectedClothes] = useState<ClothingItemOption>(() => {
    if (initialGarmentId) {
      const match = PRESET_CLOTHING_ITEMS.find((c) => c.garmentType === initialGarmentId);
      if (match) return match;
    }
    return PRESET_CLOTHING_ITEMS[0];
  });
  const [customClothesImage, setCustomClothesImage] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string>(initialColorId || 'do-son');
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
    initialAccessoryIds || []
  );
  const [isHighQuality, setIsHighQuality] = useState<boolean>(true);

  // Generation & Progress State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>('');

  // Latest Generated AI Result
  const [currentResult, setCurrentResult] = useState<TryOnResultRecord | null>(null);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; preview?: string | null }>({ configured: false });

  useEffect(() => {
    GeminiService.checkStatus().then(setAiStatus);
  }, []);

  // Selected Color details
  const chosenColor = COLORS.find((c) => c.id === selectedColorId) || COLORS[0];
  const accNames = ACCESSORIES.filter((a) => selectedAccessoryIds.includes(a.id)).map((a) => a.name);

  // Handle clothes selection with auto-switch to valid curated palette
  const handleSelectClothes = (item: ClothingItemOption) => {
    setSelectedClothes(item);
    const curated = getCuratedPalettesForGarment(item.garmentType);
    const exists = curated.some((p) => p.id === selectedColorId);
    if (!exists && curated.length > 0) {
      setSelectedColorId(curated[0].id);
    }
  };

  // Toggle accessories
  const handleToggleAccessory = (accId: string) => {
    setSelectedAccessoryIds((prev) => {
      if (prev.includes(accId)) {
        return prev.filter((id) => id !== accId);
      } else {
        if (prev.length >= 4) {
          showToast({
            type: 'warning',
            title: 'Tối đa 4 phụ kiện',
            message: 'Để giữ nét thanh tao cho tà áo, nên tiết chế phụ kiện vừa phải.'
          });
          return prev;
        }
        return [...prev, accId];
      }
    });
  };

  // Generate AI Try-On
  const handleGenerate = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setProgressPercent(10);
    setProgressText('Đang kết nối phòng thử đồ AI...');

    try {
      const result = await VirtualTryOnService.generateTryOn({
        model: selectedModel,
        customModelImage,
        clothes: selectedClothes,
        selectedColorHex: chosenColor.hex,
        selectedColorName: chosenColor.vietnameseName,
        accessoryNames: accNames,
        isHighQuality,
        onProgress: (p, text) => {
          setProgressPercent(p);
          setProgressText(text);
        }
      });

      setCurrentResult(result);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0D9488', '#DFB058', '#9B1D20']
      });

      showToast({
        type: 'success',
        title: 'AI đã tạo ảnh thành công!',
        message: `${result.clothesName} trên ${result.modelName}.`
      });
    } catch (err) {
      console.error('Try-on error:', err);
      showToast({
        type: 'error',
        title: 'Lỗi tạo ảnh',
        message: 'Có lỗi xảy ra khi gọi AI thử đồ. Vui lòng thử lại.'
      });
    } finally {
      setIsGenerating(false);
      setProgressPercent(0);
      setProgressText('');
    }
  };

  // Randomize styling
  const handleRandomize = () => {
    const randomClothes = PRESET_CLOTHING_ITEMS[Math.floor(Math.random() * PRESET_CLOTHING_ITEMS.length)];
    const randomModel = BASE_STUDIO_MODELS[Math.floor(Math.random() * BASE_STUDIO_MODELS.length)];
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    const shuffledAcc = [...ACCESSORIES].sort(() => 0.5 - Math.random());
    const randomAccs = shuffledAcc.slice(0, 2).map((a) => a.id);

    setSelectedClothes(randomClothes);
    setSelectedModel(randomModel);
    setSelectedColorId(randomColor.id);
    setSelectedAccessoryIds(randomAccs);
    setCustomClothesImage(null);
    setCustomModelImage(null);

    showToast({
      type: 'info',
      title: 'Stylist AI gợi ý bản phối mới!',
      message: `${randomClothes.name} × ${randomModel.name}`
    });
  };

  // Save current styling to wardrobe
  const handleSaveToWardrobe = () => {
    const outfitToSave: Outfit = {
      id: `fit-${Date.now()}`,
      name: `${selectedClothes.name} • ${chosenColor.vietnameseName}`,
      garmentId: selectedClothes.garmentType,
      occasionId: 'chup-anh',
      colorId: selectedColorId,
      accessoryIds: selectedAccessoryIds,
      styleId: 'modern-genz',
      gender: selectedModel.gender,
      createdAt: new Date().toISOString(),
      isFavorite: true,
      aiGeneratedImage: currentResult?.imageUrl
    };
    StorageService.saveOutfit(outfitToSave);
    showToast({
      type: 'success',
      title: 'Đã lưu vào Tủ đồ cá nhân!',
      message: 'Bạn có thể xem lại tại mục Hồ sơ & Tủ đồ.'
    });
  };

  // Add current styling to compare
  const handleAddToCompare = () => {
    const outfitToCompare: Outfit = {
      id: `fit-${Date.now()}`,
      name: `${selectedClothes.name} • ${chosenColor.vietnameseName}`,
      garmentId: selectedClothes.garmentType,
      occasionId: 'chup-anh',
      colorId: selectedColorId,
      accessoryIds: selectedAccessoryIds,
      styleId: 'modern-genz',
      gender: selectedModel.gender,
      createdAt: new Date().toISOString(),
      aiGeneratedImage: currentResult?.imageUrl
    };
    const res = StorageService.addToCompare(outfitToCompare);
    onRefreshCompareCount();
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Đã thêm vào bảng so sánh!',
        message: 'Chuyển sang mục So sánh để đối chiếu các bản phối.'
      });
    } else {
      showToast({
        type: 'warning',
        title: 'Bảng so sánh đã đầy',
        message: res.message
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pb-20 sm:pb-6">
      {/* Main 2-Column Responsive Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:h-[calc(100vh-6rem)] lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:h-full">
          
          {/* LEFT COLUMN: Controls & Selections (5 Cols - Scrollable independently) */}
          <div className="lg:col-span-5 flex flex-col order-2 lg:order-1 lg:h-full relative overflow-hidden">
            
            {/* Scrollable container for selecting clothes & models */}
            <div className="flex-1 lg:overflow-y-auto pr-1 lg:pr-2.5 pb-2 space-y-5 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
              {/* Box 1: Select Clothes, Silk Colors, Accessories */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
                <FitRoomSelectClothes
                  selectedClothes={selectedClothes}
                  onSelectClothes={handleSelectClothes}
                  customClothesImage={customClothesImage}
                  onUploadCustomClothes={setCustomClothesImage}
                  selectedColorId={selectedColorId}
                  onSelectColor={setSelectedColorId}
                  selectedAccessoryIds={selectedAccessoryIds}
                  onToggleAccessory={handleToggleAccessory}
                />
              </div>

              {/* Box 2: Select Model (Nam / Nữ) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
                <FitRoomSelectModel
                  selectedModel={selectedModel}
                  onSelectModel={setSelectedModel}
                  customModelImage={customModelImage}
                  onUploadCustomModel={setCustomModelImage}
                />
              </div>
            </div>

            {/* Pinned Bottom Action Bar at the base of Left Column */}
            <div className="shrink-0 pt-3 z-20">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-4.5 border border-stone-200/90 shadow-xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={isHighQuality}
                        onChange={(e) => setIsHighQuality(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-teal-600" />
                    </div>
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <span>High quality mode</span>
                      <span className="px-1.5 py-0.2 rounded bg-teal-500 text-white text-[9px] font-extrabold">HD</span>
                    </span>
                  </label>

                  <span className="text-[11px] text-stone-500 font-medium">
                    {selectedModel.gender === 'female' ? 'Mẫu Nữ' : 'Mẫu Nam'} • {chosenColor.vietnameseName}
                  </span>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-teal-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
                >
                  <Wand2 className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="tracking-wide">{isGenerating ? 'AI đang ướm thử...' : 'Generate (AI Thử Đồ)'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Garment Showcase & AI Viewport (7 Cols - Fixed / Static) */}
          <div className="lg:col-span-7 order-1 lg:order-2 lg:h-full flex flex-col">
            <FitRoom3DCanvas
              selectedClothes={selectedClothes}
              customClothesImage={customClothesImage}
              selectedColorId={selectedColorId}
              onSelectColor={setSelectedColorId}
              selectedColorHex={chosenColor.hex}
              selectedColorName={chosenColor.vietnameseName}
              selectedModel={selectedModel}
              selectedAccessoryIds={selectedAccessoryIds}
              selectedAccessoryNames={accNames}
              aiResultImage={currentResult?.imageUrl}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onSaveToWardrobe={handleSaveToWardrobe}
              onAddToCompare={handleAddToCompare}
              onToggleAccessory={handleToggleAccessory}
              onClearAiResult={() => setCurrentResult(null)}
            />
          </div>

        </div>
      </main>

      {/* Loading Modal Overlay during AI Generation mounted directly to document.body */}
      {isGenerating && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[99999] flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-200 select-none">
          <div className="relative w-20 h-20 mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-serif font-bold text-white tracking-tight">
            AI đang ướm trang phục lên mẫu ảnh
          </h3>
          <p className="text-xs text-teal-200 mt-1 font-light max-w-sm">
            {progressText}
          </p>

          <div className="w-64 max-w-full bg-stone-800 rounded-full h-2.5 mt-5 overflow-hidden border border-stone-700">
            <div
              className="bg-gradient-to-r from-teal-500 to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-stone-400 mt-2">{progressPercent}%</span>
        </div>,
        document.body
      )}

      {/* Share Modal Dialog */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          outfit={{
            name: currentResult ? currentResult.clothesName : `${selectedClothes.name} • ${chosenColor.vietnameseName}`,
            garment: GARMENTS.find((g) => g.id === selectedClothes.garmentType) || GARMENTS[0],
            color: chosenColor,
            styleName: 'Cổ Phong Gen Z',
            occasionName: 'Chụp ảnh & Dạo phố'
          }}
        />
      )}

      {/* Gemini AI Key Modal */}
      <GeminiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeySaved={() => {
          GeminiService.checkStatus().then(setAiStatus);
        }}
      />
    </div>
  );
};
