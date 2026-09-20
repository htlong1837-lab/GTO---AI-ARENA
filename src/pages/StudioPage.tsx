import React, { useState, useEffect } from 'react';
import {
  TryOnModel,
  ClothingItemOption,
  TryOnResultRecord,
  BASE_STUDIO_MODELS,
  PRESET_CLOTHING_ITEMS
} from '../data/modelsTryOn';
import { COLORS } from '../data/colors';
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
  Dices,
  Key,
  BookmarkPlus,
  Scale,
  Shirt,
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
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pb-20 sm:pb-12">
      {/* Top Navigation Bar */}
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-16 z-30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 flex items-center gap-2">
              <span>Phòng Thử Đồ & Studio 3D</span>
            </h1>
            <p className="text-[11px] text-stone-500 font-light hidden sm:block">
              Chọn trang phục & người mẫu bên trái • Xoay 360° và thử đồ trực quan bên phải
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border shadow-xs flex items-center gap-1.5 transition-all ${
              aiStatus.configured
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title="Cấu hình Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">{aiStatus.configured ? 'Gemini AI: Sẵn sàng' : 'Cấu hình Gemini AI'}</span>
          </button>

          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors shadow-xs"
            title="Gợi ý ngẫu nhiên một bản phối mới"
          >
            <Dices className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Gợi ý ngẫu nhiên</span>
          </button>

          <button
            onClick={handleSaveToWardrobe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 transition-colors shadow-xs"
            title="Lưu bản phối hiện tại vào Tủ đồ cá nhân"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-teal-700" />
            <span className="hidden md:inline">Lưu tủ đồ</span>
          </button>

          <button
            onClick={handleAddToCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 transition-colors shadow-xs"
            title="Thêm vào bảng so sánh"
          >
            <Scale className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden md:inline">So sánh</span>
          </button>
        </div>
      </header>

      {/* Main 2-Column Responsive Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Controls & Selections (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
            
            {/* Box 1: Select Clothes, Silk Colors, Accessories */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
              <FitRoomSelectClothes
                selectedClothes={selectedClothes}
                onSelectClothes={setSelectedClothes}
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

            {/* Box 3: AI Virtual Try-On Generation Action */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-stone-700/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Thử Đồ Chân Thực Với AI
                  </h4>
                </div>
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isHighQuality}
                    onChange={(e) => setIsHighQuality(e.target.checked)}
                    className="accent-teal-500 w-3.5 h-3.5 rounded"
                  />
                  <span>Độ nét cao (Ultra-HD)</span>
                </label>
              </div>

              <p className="text-xs text-stone-300 mb-4 font-light leading-relaxed">
                AI sẽ tổng hợp chính xác vóc dáng của <strong className="text-white font-medium">{selectedModel.name}</strong> mặc{' '}
                <strong className="text-teal-300 font-medium">{selectedClothes.name}</strong> với sắc lụa{' '}
                <strong className="text-amber-300 font-medium">{chosenColor.vietnameseName}</strong> và phụ kiện đã chọn.
              </p>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>AI Thử Đồ Ngay</span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D Model & Interactive Viewport (7 Cols) */}
          <div className="lg:col-span-7 sticky top-24 order-1 lg:order-2">
            <FitRoom3DCanvas
              selectedClothes={selectedClothes}
              selectedColorHex={chosenColor.hex}
              selectedColorName={chosenColor.vietnameseName}
              selectedModel={selectedModel}
              selectedAccessoryNames={accNames}
              aiResultImage={currentResult?.imageUrl}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onSaveToWardrobe={handleSaveToWardrobe}
              onAddToCompare={handleAddToCompare}
            />
          </div>

        </div>
      </main>

      {/* Loading Modal Overlay during AI Generation */}
      {isGenerating && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in">
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
        </div>
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
