import React, { useState } from 'react';
import { Outfit, Garment, ColorOption, Occasion, StyleGenZ } from '../../types/outfit';
import { ACCESSORIES } from '../../data/accessories';
import { OutfitMannequin } from './OutfitMannequin';
import { ColorHarmonyCard } from './ColorHarmonyCard';
import { CulturalWarningCard } from './CulturalWarningCard';
import { CulturalContextDrawer } from './CulturalContextDrawer';
import { calculateColorHarmony } from '../../services/colorHarmonyService';
import { evaluateCulturalOutfit } from '../../services/culturalAdviceService';
import { Bookmark, Share2, Scale, Check, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

interface OutfitPreviewCardProps {
  garment: Garment;
  color: ColorOption;
  occasion: Occasion;
  style: StyleGenZ;
  accessoryIds: string[];
  outfitName: string;
  onSaveOutfit: () => void;
  onAddToCompare: () => void;
  onOpenShare: () => void;
  isSaved?: boolean;
}

export const OutfitPreviewCard: React.FC<OutfitPreviewCardProps> = ({
  garment,
  color,
  occasion,
  style,
  accessoryIds,
  outfitName,
  onSaveOutfit,
  onAddToCompare,
  onOpenShare,
  isSaved = false
}) => {
  const [downloading, setDownloading] = useState(false);
  const { showToast } = useToast();

  // Calculate live harmony and cultural evaluation
  const harmony = calculateColorHarmony(color.id, style.id, accessoryIds);
  const advice = evaluateCulturalOutfit(garment.id, style.id, occasion.id, accessoryIds);

  const selectedAccessories = ACCESSORIES.filter((a) => accessoryIds.includes(a.id));

  const handleSave = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#9B1D20', '#C59338', '#1D6246', '#CA4F76']
    });
    onSaveOutfit();
  };

  const handleDownloadCard = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      showToast({
        type: 'success',
        title: 'Đã xuất Look Card PNG!',
        message: 'Thẻ phối đồ phong cách thời trang đã sẵn sàng để lưu trữ hoặc chia sẻ.'
      });
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-heritage-border/90 shadow-editorial relative overflow-hidden flex flex-col gap-5 transition-all">
      {/* Editorial Header Ribbon */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-heritage-red animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            Look Result Preview • 2026
          </span>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-heritage-ivory border border-heritage-border text-stone-600">
          {occasion.name}
        </span>
      </div>

      {/* Visual Mannequin / Mockup System */}
      <div className="w-full">
        <OutfitMannequin
          garment={garment}
          color={color}
          style={style}
          accessoryIds={accessoryIds}
        />
      </div>

      {/* Outfit Title & Meta Information */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-900 text-white">
            {garment.name}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
            {color.name}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-200">
            {style.name}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight pt-1">
          {outfitName}
        </h3>

        <p className="text-xs text-stone-500 leading-relaxed">
          Bản phối dành riêng cho dịp <strong>{occasion.name}</strong> mang tinh thần <em>{style.vibe}</em>.
        </p>
      </div>

      {/* Selected Accessories Pills */}
      {selectedAccessories.length > 0 && (
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
            Phụ kiện phối kèm ({selectedAccessories.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedAccessories.map((acc) => (
              <span
                key={acc.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200"
              >
                <span>{acc.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Live Color Harmony Analysis */}
      <ColorHarmonyCard harmony={harmony} />

      {/* Intelligent Cultural Advisory / Warning */}
      <CulturalWarningCard advice={advice} />

      {/* In-depth Cultural Context Accordion */}
      <CulturalContextDrawer garment={garment} />

      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-100">
        <button
          onClick={handleSave}
          className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-bold text-xs transition-all ${
            isSaved
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              : 'bg-stone-900 hover:bg-stone-800 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Đã lưu Look</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>Lưu vào tủ</span>
            </>
          )}
        </button>

        <button
          onClick={onAddToCompare}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-bold text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
        >
          <Scale className="w-4 h-4 text-heritage-gold" />
          <span>So sánh</span>
        </button>

        <button
          onClick={onOpenShare}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-bold text-xs bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 transition-colors"
        >
          <Share2 className="w-4 h-4 text-rose-600" />
          <span>Chia sẻ</span>
        </button>

        <button
          onClick={handleDownloadCard}
          disabled={downloading}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
        >
          <Download className="w-4 h-4 text-amber-700" />
          <span>{downloading ? 'Đang xuất...' : 'Tải Look'}</span>
        </button>
      </div>
    </div>
  );
};
