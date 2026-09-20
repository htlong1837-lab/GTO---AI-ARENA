import React from 'react';
import { ClothingItemOption, PRESET_CLOTHING_ITEMS, TryOnModel } from '../../data/modelsTryOn';
import { ACCESSORIES } from '../../data/accessories';
import { COLORS, POPULAR_COLORS, getCuratedPalettesForGarment } from '../../data/colors';
import { Check, Sparkles, ArrowLeft, Zap, ArrowRight, User } from 'lucide-react';

interface StepGarmentCustomizeProps {
  selectedModel: TryOnModel;
  customModelImage: string | null;
  selectedClothes: ClothingItemOption;
  onSelectClothes: (item: ClothingItemOption) => void;
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
  selectedAccessoryIds: string[];
  onToggleAccessory: (id: string) => void;
  isHighQuality: boolean;
  onToggleHighQuality: (val: boolean) => void;
  isGenerating: boolean;
  onBackStep: () => void;
  onGenerate: () => void;
}

export const StepGarmentCustomize: React.FC<StepGarmentCustomizeProps> = ({
  selectedModel,
  customModelImage,
  selectedClothes,
  onSelectClothes,
  selectedColorId,
  onSelectColor,
  selectedAccessoryIds,
  onToggleAccessory,
  isHighQuality,
  onToggleHighQuality,
  isGenerating,
  onBackStep,
  onGenerate
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header & Target Model Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            Bước 2 / 3 • Phối Cổ Phục & Phụ Kiện
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2 tracking-tight">
            Tùy biến y phục & phụ kiện
          </h2>
        </div>

        {/* Selected Model Target Chip */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 shadow-xs">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-200 border border-stone-300">
            <img
              src={customModelImage || selectedModel.avatarUrl}
              alt="Mẫu đang chọn"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="text-left text-xs">
            <span className="text-[10px] text-stone-500 block">Đang phối cho mẫu:</span>
            <strong className="text-stone-800 font-bold">
              {customModelImage ? 'Người mẫu của bạn' : selectedModel.name}
            </strong>
          </div>
          <button
            onClick={onBackStep}
            className="text-[11px] text-teal-700 hover:underline font-semibold pl-1"
          >
            Đổi
          </button>
        </div>
      </div>

      {/* 1. CHỌN DÒNG CỔ PHỤC CHÍNH (5 Iconic Garments) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>1. Chọn dòng Cổ Phục di sản</span>
          </h3>
          <span className="text-xs text-stone-500 font-light">5 kiểu dáng tiêu biểu</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PRESET_CLOTHING_ITEMS.map((item) => {
            const isSelected = selectedClothes.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectClothes(item)}
                className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all p-2 bg-white flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 ring-2 ring-teal-600/30 shadow-lg scale-[1.02]'
                    : 'border-stone-200 hover:border-teal-400 shadow-xs'
                }`}
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-stone-100">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                    {item.era.split(' ')[0]}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-teal-800 transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-stone-500 line-clamp-1">
                    {item.era}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CHỌN BẢN PHỐI KINH ĐIỂN CHUẨN DI SẢN */}
      <div className="space-y-3 bg-stone-50/80 p-4 rounded-2xl border border-stone-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" />
            <span>2. Chọn bản phối màu kinh điển (Chuẩn di sản)</span>
          </h3>
          <span className="text-xs font-semibold text-teal-800 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
            {getCuratedPalettesForGarment(selectedClothes.garmentType).find((p) => p.id === selectedColorId)?.name || 'Bản phối gốc'}
          </span>
        </div>

        {/* Grid 4 Card bản phối */}
        <div className="grid grid-cols-2 gap-2.5 py-1">
          {getCuratedPalettesForGarment(selectedClothes.garmentType).map((palette) => {
            const isActive = selectedColorId === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => onSelectColor(palette.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                  isActive
                    ? 'border-teal-700 bg-teal-50/70 shadow-xs ring-1 ring-teal-700'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {/* Header card: Cặp chấm màu kép + Tag */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center relative pl-0.5">
                    {/* Chấm màu áo */}
                    <div
                      className="w-6 h-6 rounded-full border border-black/15 shadow-2xs shrink-0 z-10"
                      style={{ backgroundColor: palette.primaryColorHex }}
                      title={palette.primaryName}
                    />
                    {/* Chấm màu quần / yếm / nẹp gối đè */}
                    <div
                      className="-ml-2.5 w-5 h-5 rounded-full border-2 border-white shadow-2xs shrink-0 z-20"
                      style={{ backgroundColor: palette.secondaryColorHex }}
                      title={palette.secondaryName}
                    />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-teal-700 text-white'
                        : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                    }`}
                  >
                    {palette.tag}
                  </span>
                </div>

                {/* Tên bản phối mỹ miều */}
                <div>
                  <h5
                    className={`text-xs font-bold leading-tight ${
                      isActive ? 'text-teal-900' : 'text-stone-800'
                    }`}
                  >
                    {palette.name}
                  </h5>
                  <p className="text-[11px] text-stone-600 font-medium leading-tight mt-0.5">
                    {palette.secondaryName}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1 line-clamp-1">
                    {palette.context}
                  </p>
                </div>

                {/* Active check icon */}
                {isActive && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-teal-700 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CHỌN PHỤ KIỆN REMIX (Accessories) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>3. Phụ kiện phối kèm (Tối đa 4 món)</span>
          </h3>
          <span className="text-xs text-stone-500 font-light">
            Đã chọn {selectedAccessoryIds.length}/4 món
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ACCESSORIES.map((acc) => {
            const isSelected = selectedAccessoryIds.includes(acc.id);
            return (
              <button
                key={acc.id}
                onClick={() => onToggleAccessory(acc.id)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-teal-50 border-teal-600 text-teal-950 font-semibold shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div>
                    <span className="text-xs block leading-tight font-medium">{acc.name}</span>
                    <span className="text-[9px] text-stone-400 font-normal">
                      {acc.isTraditional ? 'Di sản' : 'Gen Z'}
                    </span>
                  </div>
                </div>

                <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                  isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-stone-300'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer: Back and Generate CTA */}
      <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackStep}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chọn mẫu ảnh</span>
        </button>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* High Quality Mode Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-stone-700">
            <input
              type="checkbox"
              checked={isHighQuality}
              onChange={(e) => onToggleHighQuality(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Độ nét Studio HD</span>
          </label>

          {/* Big CTA Generate Button */}
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className={`flex-1 sm:flex-none py-4 px-8 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              isGenerating
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.99] shadow-teal-600/25'
            }`}
          >
            <Zap className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'AI đang tạo ảnh...' : '✨ AI Thử Đồ Ngay'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
