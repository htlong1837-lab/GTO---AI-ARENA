import React, { useState, useEffect } from 'react';
import { Garment, Occasion, ColorOption, StyleGenZ, Outfit, WeatherCondition } from '../types/outfit';
import { GARMENTS } from '../data/garments';
import { OCCASIONS } from '../data/occasions';
import { COLORS } from '../data/colors';
import { ACCESSORIES } from '../data/accessories';
import { STYLES } from '../data/styles';
import { WEATHER_CONDITIONS } from '../data/weather';
import { StepOccasion } from '../components/studio/StepOccasion';
import { StepGarment } from '../components/studio/StepGarment';
import { StepColor } from '../components/studio/StepColor';
import { StepAccessories } from '../components/studio/StepAccessories';
import { StepStyle } from '../components/studio/StepStyle';
import { OutfitPreviewCard } from '../components/studio/OutfitPreviewCard';
import { ShareModal } from '../components/share/ShareModal';
import { GeminiKeyModal } from '../components/common/GeminiKeyModal';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { useToast } from '../context/ToastContext';
import { Sparkles, Dices, ArrowLeft, ArrowRight, Check, Compass, Box, Key } from 'lucide-react';

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
  initialOccasionId,
  initialStyleId,
  initialColorId,
  initialAccessoryIds,
  initialGender,
  initialWeatherId,
  initialAiImageUrl,
  onNavigate,
  onRefreshCompareCount
}) => {
  const { showToast } = useToast();

  // Active step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Styling state
  const [selectedGender, setSelectedGender] = useState<'female' | 'male'>(initialGender || 'female');
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition>(
    WEATHER_CONDITIONS.find((w) => w.id === initialWeatherId) || WEATHER_CONDITIONS[0]
  );
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>(
    OCCASIONS.find((o) => o.id === initialOccasionId) || OCCASIONS[0]
  );
  const [selectedGarment, setSelectedGarment] = useState<Garment>(
    GARMENTS.find((g) => g.id === initialGarmentId) || GARMENTS[0]
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    COLORS.find((c) => c.id === initialColorId) || COLORS[0]
  );
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
    initialAccessoryIds || ['sneaker-chunky', 'kieng-bac', 'tote-typography']
  );
  const [selectedStyle, setSelectedStyle] = useState<StyleGenZ>(
    STYLES.find((s) => s.id === initialStyleId) || STYLES[1] // Default Modern Gen Z
  );

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | undefined>(initialAiImageUrl);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>();
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; preview?: string | null }>({ configured: false });

  const [savedOutfitIds, setSavedOutfitIds] = useState<string[]>(() => {
    return StorageService.getSavedOutfits().map((o) => o.id);
  });

  useEffect(() => {
    GeminiService.checkStatus().then(setAiStatus);
  }, []);

  // Dynamic Outfit Name with gender tag
  const outfitName = `${selectedGarment.name} ${selectedColor.name} (${selectedGender === 'male' ? 'Nam' : 'Nữ'}) × ${
    selectedAccessoryIds.includes('sneaker-chunky')
      ? 'Sneaker Trắng'
      : selectedAccessoryIds.includes('boots-da')
      ? 'Boots Da'
      : selectedAccessoryIds.includes('guoc-moc')
      ? 'Guốc Mộc Sơn Mài'
      : 'Phụ Kiện Tinh Giản'
  }`;

  const currentOutfitId = `outfit-${selectedGarment.id}-${selectedColor.id}-${selectedStyle.id}-${selectedOccasion.id}`;
  const isSaved = savedOutfitIds.includes(currentOutfitId);

  // Toggle accessories
  const handleToggleAccessory = (accId: string) => {
    setSelectedAccessoryIds((prev) => {
      if (prev.includes(accId)) {
        return prev.filter((id) => id !== accId);
      } else {
        if (prev.length >= 5) {
          showToast({
            type: 'warning',
            title: 'Tối đa 5 phụ kiện',
            message: 'Để giữ nét thanh tao cho tà áo, nên tiết chế phụ kiện vừa phải.'
          });
          return prev;
        }
        return [...prev, accId];
      }
    });
  };

  // Randomize styling (Surprise Me / AI Stylist)
  const handleRandomize = () => {
    const randomOccasion = OCCASIONS[Math.floor(Math.random() * OCCASIONS.length)];
    const randomGarment = GARMENTS[Math.floor(Math.random() * GARMENTS.length)];
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];

    // Pick 2-3 random accessories
    const shuffledAcc = [...ACCESSORIES].sort(() => 0.5 - Math.random());
    const randomAccessories = shuffledAcc.slice(0, 3).map((a) => a.id);

    setSelectedOccasion(randomOccasion);
    setSelectedGarment(randomGarment);
    setSelectedColor(randomColor);
    setSelectedStyle(randomStyle);
    setSelectedAccessoryIds(randomAccessories);

    showToast({
      type: 'info',
      title: 'Stylist AI gợi ý Look mới!',
      message: `${randomGarment.name} ${randomColor.name} (${selectedGender === 'male' ? 'Nam' : 'Nữ'}) phong cách ${randomStyle.name}`
    });
  };

  // Smart weather stylist recommendation
  const handleWeatherRecommend = () => {
    const suitableGarments = GARMENTS.filter((g) => selectedWeather.recommendedGarments.includes(g.id));
    const newGarment = suitableGarments.length > 0
      ? suitableGarments[Math.floor(Math.random() * suitableGarments.length)]
      : GARMENTS[0];

    const suitableAccs = ACCESSORIES.filter((a) => selectedWeather.recommendedAccessories.includes(a.id)).map((a) => a.id);
    const chosenAccs = suitableAccs.length > 0 ? suitableAccs.slice(0, 3) : ['sneaker-chunky', 'kieng-bac'];
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    setSelectedGarment(newGarment);
    setSelectedColor(randomColor);
    setSelectedAccessoryIds(chosenAccs);

    showToast({
      type: 'info',
      title: `Stylist thời tiết: ${selectedWeather.name}`,
      message: `${newGarment.name} tối ưu cho nhiệt độ ${selectedWeather.temperature} (${selectedWeather.region}).`
    });
  };

  // Save outfit to LocalStorage
  const handleSaveOutfit = () => {
    const newOutfit: Outfit = {
      id: currentOutfitId,
      name: outfitName,
      garmentId: selectedGarment.id,
      occasionId: selectedOccasion.id,
      colorId: selectedColor.id,
      accessoryIds: selectedAccessoryIds,
      styleId: selectedStyle.id,
      gender: selectedGender,
      weatherId: selectedWeather.id,
      createdAt: new Date().toISOString(),
      isFavorite: true,
      aiGeneratedImage,
      aiPrompt
    };

    StorageService.saveOutfit(newOutfit);
    setSavedOutfitIds((prev) => [...prev.filter((id) => id !== currentOutfitId), currentOutfitId]);

    showToast({
      type: 'success',
      title: 'Đã lưu Outfit vào tủ đồ!',
      message: aiGeneratedImage
        ? 'Bản phối cùng ảnh người mẫu AI độc bản đã được lưu trữ an toàn.'
        : 'Bạn có thể xem lại tại mục Tủ đồ & Hồ sơ bất kỳ lúc nào.'
    });
  };

  // Add to Compare list
  const handleAddToCompare = () => {
    const newOutfit: Outfit = {
      id: currentOutfitId,
      name: outfitName,
      garmentId: selectedGarment.id,
      occasionId: selectedOccasion.id,
      colorId: selectedColor.id,
      accessoryIds: selectedAccessoryIds,
      styleId: selectedStyle.id,
      gender: selectedGender,
      weatherId: selectedWeather.id,
      createdAt: new Date().toISOString(),
      aiGeneratedImage,
      aiPrompt
    };

    const res = StorageService.addToCompare(newOutfit);
    onRefreshCompareCount();

    if (res.success) {
      showToast({
        type: 'success',
        title: 'Đã thêm vào bảng so sánh!',
        message: 'Chuyển sang tab "So sánh Look" để xem ma trận khác biệt.'
      });
    } else {
      showToast({
        type: 'warning',
        title: 'Thông báo so sánh',
        message: res.message
      });
    }
  };

  const stepsList = [
    { num: 1, roman: 'I', label: 'Bối cảnh', summary: selectedOccasion.name },
    { num: 2, roman: 'II', label: 'Việt phục', summary: selectedGarment.name },
    { num: 3, roman: 'III', label: 'Ngũ Sắc', summary: selectedColor.vietnameseName },
    { num: 4, roman: 'IV', label: 'Phụ kiện', summary: `${selectedAccessoryIds.length} món` },
    { num: 5, roman: 'V', label: 'Phong cách', summary: selectedStyle.name }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-stone-800">
      {/* Studio Header Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D8C7] pb-5">
        <div>
          <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#A8282B]">
            ATELIER PHỐI PHỤC TRANG
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111215] mt-1">
            Xưởng May Di Sản
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-sans">
            5 bước tương tác trực quan tái hiện chuẩn mực cổ truyền cùng hơi thở Gen Z.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => onNavigate('studio3d')}
            className="px-4 py-2 rounded-full bg-[#18181B] hover:bg-stone-800 text-white text-xs font-medium border border-[#D4AF37]/50 shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Box className="w-3.5 h-3.5 text-[#DFB058]" />
            <span>Mở Xưởng 3D Canvas</span>
          </button>

          <button
            onClick={handleWeatherRecommend}
            className="px-3.5 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] text-stone-800 text-xs font-medium border border-[#E2D8C7] shadow-xs flex items-center gap-1.5 transition-all"
            title="Tự động gợi ý bản phối phù hợp với thời tiết đã chọn"
          >
            <Compass className="w-3.5 h-3.5 text-[#C59338]" />
            <span>Stylist Thời Tiết</span>
          </button>

          <button
            onClick={() => setIsKeyModalOpen(true)}
            className={`px-3.5 py-2 rounded-full text-xs font-medium border shadow-xs flex items-center gap-1.5 transition-all ${
              aiStatus.configured
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
            }`}
            title="Cấu hình Google Gemini API Key để tạo ảnh AI dùng chung"
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>{aiStatus.configured ? 'Gemini AI: Sẵn sàng' : 'Cấu hình Gemini AI'}</span>
          </button>

          <button
            onClick={handleRandomize}
            className="px-3.5 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] text-stone-800 text-xs font-medium border border-[#E2D8C7] shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Dices className="w-4 h-4 text-[#A8282B]" />
            <span>Gợi Ý Ngẫu Nhiên</span>
          </button>
        </div>
      </div>

      {/* 5-Step Progress Stepper Bar with Roman Numerals */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#E2D8C7] shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[560px] gap-2">
          {stepsList.map((st) => {
            const isActive = currentStep === st.num;
            const isPassed = currentStep > st.num;
            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`flex-1 p-2.5 rounded-xl text-left transition-all flex items-center gap-3 relative group ${
                  isActive
                    ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm border border-[#D4AF37]/40'
                    : isPassed
                    ? 'bg-[#FAF7F2] text-stone-800 hover:bg-[#F4EFE6] border border-[#E2D8C7]'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-serif font-bold shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#D4AF37] text-stone-950'
                      : isPassed
                      ? 'bg-[#1D6246] text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.roman}
                </div>

                <div className="min-w-0">
                  <div className="text-[9px] font-bold tracking-wider uppercase opacity-75">
                    Giai đoạn {st.roman}
                  </div>
                  <div className="text-xs font-serif font-bold truncate leading-tight">{st.label}</div>
                  <div className="text-[11px] opacity-80 truncate hidden sm:block font-sans">
                    {st.summary}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Atelier: Left Stepper Selection + Right Dynamic Look Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Steps (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2D8C7] shadow-sm min-h-[480px] flex flex-col justify-between">
            {/* Render Current Step Component */}
            <div>
              {currentStep === 1 && (
                <StepOccasion
                  selectedId={selectedOccasion.id}
                  onSelect={(occ) => {
                    setSelectedOccasion(occ);
                  }}
                  selectedWeatherId={selectedWeather.id}
                  onSelectWeather={(w) => {
                    setSelectedWeather(w);
                  }}
                />
              )}

              {currentStep === 2 && (
                <StepGarment
                  selectedId={selectedGarment.id}
                  onSelect={(g) => {
                    setSelectedGarment(g);
                  }}
                />
              )}

              {currentStep === 3 && (
                <StepColor
                  selectedId={selectedColor.id}
                  onSelect={(c) => {
                    setSelectedColor(c);
                  }}
                />
              )}

              {currentStep === 4 && (
                <StepAccessories
                  selectedIds={selectedAccessoryIds}
                  onToggle={handleToggleAccessory}
                />
              )}

              {currentStep === 5 && (
                <StepStyle
                  selectedId={selectedStyle.id}
                  onSelect={(st) => {
                    setSelectedStyle(st);
                  }}
                />
              )}
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-8 mt-6 border-t border-[#F4EFE6]">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="px-4 py-2.5 rounded-full border border-[#E2D8C7] text-stone-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F2] flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>

              <div className="text-xs font-serif font-bold text-stone-500 tracking-wider">
                GIAI ĐOẠN <strong>{stepsList[currentStep - 1].roman}</strong> / V
              </div>

              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                  className="px-6 py-2.5 rounded-full bg-[#18181B] hover:bg-[#A8282B] text-white text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSaveOutfit}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A8282B] to-[#741416] hover:from-[#741416] hover:to-[#A8282B] text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm transition-all border border-[#D4AF37]/30"
                >
                  <Sparkles className="w-4 h-4 text-[#DFB058]" />
                  <span>Hoàn Tất & Lưu Look</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Look Preview Card (5 Cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <OutfitPreviewCard
            garment={selectedGarment}
            color={selectedColor}
            occasion={selectedOccasion}
            style={selectedStyle}
            accessoryIds={selectedAccessoryIds}
            gender={selectedGender}
            onToggleGender={(g) => setSelectedGender(g)}
            weather={selectedWeather}
            outfitName={outfitName}
            onSaveOutfit={handleSaveOutfit}
            onAddToCompare={handleAddToCompare}
            onOpenShare={() => setIsShareModalOpen(true)}
            isSaved={isSaved}
            aiImageUrl={aiGeneratedImage}
            onAiImageGenerated={(img, prompt) => {
              setAiGeneratedImage(img);
              setAiPrompt(prompt);
            }}
            onOpenKeyModal={() => setIsKeyModalOpen(true)}
          />
        </div>
      </div>

      {/* Share Lookbook Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        outfit={{
          name: outfitName,
          garment: selectedGarment,
          color: selectedColor,
          styleName: selectedStyle.name,
          occasionName: selectedOccasion.name
        }}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Gemini AI API Configuration Modal */}
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
