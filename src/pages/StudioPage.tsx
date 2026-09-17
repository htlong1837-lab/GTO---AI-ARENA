import React, { useState } from 'react';
import { Garment, Occasion, ColorOption, StyleGenZ, Outfit } from '../types/outfit';
import { GARMENTS } from '../data/garments';
import { OCCASIONS } from '../data/occasions';
import { COLORS } from '../data/colors';
import { ACCESSORIES } from '../data/accessories';
import { STYLES } from '../data/styles';
import { StepOccasion } from '../components/studio/StepOccasion';
import { StepGarment } from '../components/studio/StepGarment';
import { StepColor } from '../components/studio/StepColor';
import { StepAccessories } from '../components/studio/StepAccessories';
import { StepStyle } from '../components/studio/StepStyle';
import { OutfitPreviewCard } from '../components/studio/OutfitPreviewCard';
import { ShareModal } from '../components/share/ShareModal';
import { StorageService } from '../services/storageService';
import { useToast } from '../context/ToastContext';
import { Sparkles, Dices, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface StudioPageProps {
  initialGarmentId?: string;
  initialOccasionId?: string;
  initialStyleId?: string;
  initialColorId?: string;
  initialAccessoryIds?: string[];
  onNavigate: (tab: string) => void;
  onRefreshCompareCount: () => void;
}

export const StudioPage: React.FC<StudioPageProps> = ({
  initialGarmentId,
  initialOccasionId,
  initialStyleId,
  initialColorId,
  initialAccessoryIds,
  onNavigate,
  onRefreshCompareCount
}) => {
  const { showToast } = useToast();

  // Active step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Styling state
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
  const [savedOutfitIds, setSavedOutfitIds] = useState<string[]>(() => {
    return StorageService.getSavedOutfits().map((o) => o.id);
  });

  // Dynamic Outfit Name
  const outfitName = `${selectedGarment.name} ${selectedColor.name} × ${
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
            message: 'Để giữ nét tinh tế cho trang phục, nên tiết chế phụ kiện vừa phải.'
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
      message: `${randomGarment.name} ${randomColor.name} theo phong cách ${randomStyle.name}`
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
      createdAt: new Date().toISOString(),
      isFavorite: true
    };

    StorageService.saveOutfit(newOutfit);
    setSavedOutfitIds((prev) => [...prev.filter((id) => id !== currentOutfitId), currentOutfitId]);

    showToast({
      type: 'success',
      title: 'Đã lưu Outfit vào tủ đồ!',
      message: 'Bạn có thể xem lại tại mục Tủ đồ & Hồ sơ bất kỳ lúc nào.'
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
      createdAt: new Date().toISOString()
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
    { num: 1, label: 'Bối cảnh', summary: selectedOccasion.name },
    { num: 2, label: 'Việt phục', summary: selectedGarment.name },
    { num: 3, label: 'Màu sắc', summary: selectedColor.vietnameseName },
    { num: 4, label: 'Phụ kiện', summary: `${selectedAccessoryIds.length} món` },
    { num: 5, label: 'Phong cách', summary: selectedStyle.name }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-heritage-border/70 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-red font-mono">
            Mix & Match Workshop
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            Studio Phối Đồ Việt Phục
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            5 bước tương tác trực quan để tạo outfit thời thượng cho riêng bạn.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRandomize}
            className="px-4 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold border border-stone-300 shadow-xs flex items-center gap-2 transition-all"
          >
            <Dices className="w-4 h-4 text-heritage-red" />
            <span>Phối ngẫu nhiên (AI)</span>
          </button>
        </div>
      </div>

      {/* 5-Step Progress Stepper Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-heritage-border/80 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[540px] gap-2">
          {stepsList.map((st) => {
            const isActive = currentStep === st.num;
            const isPassed = currentStep > st.num;
            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`flex-1 p-2.5 rounded-xl text-left transition-all flex items-center gap-3 relative group ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : isPassed
                    ? 'bg-stone-50 text-stone-800 hover:bg-stone-100'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isActive
                      ? 'bg-heritage-gold text-stone-900'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                    Bước {st.num}
                  </div>
                  <div className="text-xs font-bold truncate leading-tight">{st.label}</div>
                  <div className="text-[11px] opacity-80 truncate hidden sm:block">
                    {st.summary}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid: Left Stepper Selection + Right Dynamic Look Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Steps (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-heritage-border/80 shadow-sm min-h-[460px] flex flex-col justify-between">
            {/* Render Current Step Component */}
            <div>
              {currentStep === 1 && (
                <StepOccasion
                  selectedId={selectedOccasion.id}
                  onSelect={(occ) => {
                    setSelectedOccasion(occ);
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
            <div className="flex items-center justify-between pt-8 mt-6 border-t border-stone-100">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>

              <div className="text-xs font-semibold text-stone-400">
                Bước <strong>{currentStep}</strong> / 5
              </div>

              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSaveOutfit}
                  className="px-6 py-2.5 rounded-xl bg-heritage-red hover:bg-heritage-red-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-red-glow transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Hoàn tất & Lưu Look</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Look Result Card & Styling Preview (5 Cols Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <OutfitPreviewCard
            garment={selectedGarment}
            color={selectedColor}
            occasion={selectedOccasion}
            style={selectedStyle}
            accessoryIds={selectedAccessoryIds}
            outfitName={outfitName}
            onSaveOutfit={handleSaveOutfit}
            onAddToCompare={handleAddToCompare}
            onOpenShare={() => setIsShareModalOpen(true)}
            isSaved={isSaved}
          />
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        outfit={{
          name: outfitName,
          garment: selectedGarment,
          color: selectedColor,
          styleName: selectedStyle.name,
          occasionName: selectedOccasion.name
        }}
      />
    </div>
  );
};
