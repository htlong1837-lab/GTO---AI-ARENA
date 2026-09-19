import React, { useState } from 'react';
import { Garment, ColorOption, Occasion, StyleGenZ, WeatherCondition } from '../../types/outfit';
import { ACCESSORIES } from '../../data/accessories';
import { OutfitMannequin } from './OutfitMannequin';
import { ColorHarmonyCard } from './ColorHarmonyCard';
import { CulturalWarningCard } from './CulturalWarningCard';
import { CulturalContextDrawer } from './CulturalContextDrawer';
import { calculateColorHarmony } from '../../services/colorHarmonyService';
import { evaluateCulturalOutfit } from '../../services/culturalAdviceService';
import { Bookmark, Share2, Scale, Check, Download, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

interface OutfitPreviewCardProps {
  garment: Garment;
  color: ColorOption;
  occasion: Occasion;
  style: StyleGenZ;
  accessoryIds: string[];
  gender?: 'female' | 'male';
  onToggleGender?: (gender: 'female' | 'male') => void;
  weather?: WeatherCondition;
  outfitName: string;
  onSaveOutfit: () => void;
  onAddToCompare: () => void;
  onOpenShare: () => void;
  isSaved?: boolean;
  aiImageUrl?: string;
  onAiImageGenerated?: (imageUrl: string, promptUsed: string) => void;
  onOpenKeyModal?: () => void;
}

export const OutfitPreviewCard: React.FC<OutfitPreviewCardProps> = ({
  garment,
  color,
  occasion,
  style,
  accessoryIds,
  gender = 'female',
  onToggleGender,
  weather,
  outfitName,
  onSaveOutfit,
  onAddToCompare,
  onOpenShare,
  isSaved = false,
  aiImageUrl,
  onAiImageGenerated,
  onOpenKeyModal
}) => {
  const [downloading, setDownloading] = useState(false);
  const [lookCode] = useState(() => `VP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  const { showToast } = useToast();

  // Calculate live harmony and cultural evaluation
  const harmony = calculateColorHarmony(color.id, style.id, accessoryIds);
  const advice = evaluateCulturalOutfit(garment.id, style.id, occasion.id, accessoryIds, color.id);

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

  // Real Canvas-to-PNG Look Card Generator
  const handleDownloadCard = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 750;
      canvas.height = 1020;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setDownloading(false);
        return;
      }

      // Background with subtle warm ivory tint
      ctx.fillStyle = '#FAF7F2';
      ctx.fillRect(0, 0, 750, 1020);

      // Outer Heritage Gold Border
      ctx.strokeStyle = '#DFB058';
      ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, 702, 972);

      // Inner Red Border
      ctx.strokeStyle = '#9B1D20';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(32, 32, 686, 956);

      // Decorative Corner Diamonds
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#C59338';
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x + 5, y);
        ctx.lineTo(x, y + 5);
        ctx.lineTo(x - 5, y);
        ctx.closePath();
        ctx.fill();
      };
      drawCorner(32, 32);
      drawCorner(718, 32);
      drawCorner(32, 988);
      drawCorner(718, 988);

      // Top Editorial Brand Banner
      ctx.fillStyle = '#9B1D20';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VIỆT PHỤC REMIX • BẢN PHỐI CỔ PHONG GEN Z', 375, 75);

      ctx.fillStyle = '#6B7280';
      ctx.font = 'italic 14px serif';
      ctx.fillText('"Mặc chất Gen Z — Giữ hồn Việt"', 375, 100);

      // Divider
      ctx.strokeStyle = '#E2D8C7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 118);
      ctx.lineTo(670, 118);
      ctx.stroke();

      // Outfit Title
      ctx.fillStyle = '#1A1C20';
      ctx.font = 'bold 24px serif';
      ctx.fillText(outfitName, 375, 155);

      // Badges Line
      const badges = [
        garment.name,
        color.vietnameseName,
        style.name,
        gender === 'male' ? 'Nam ♂' : 'Nữ ♀',
        weather ? `${weather.name}` : occasion.name
      ];

      let badgeStartX = 110;
      ctx.font = 'bold 11px sans-serif';
      badges.forEach((b, idx) => {
        const textWidth = ctx.measureText(b).width;
        const pillWidth = textWidth + 18;
        ctx.fillStyle = idx === 0 ? '#9B1D20' : idx === 1 ? '#C59338' : idx === 2 ? '#182747' : '#374151';
        ctx.beginPath();
        ctx.roundRect(badgeStartX, 175, pillWidth, 24, 12);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(b, badgeStartX + pillWidth / 2, 191);

        badgeStartX += pillWidth + 8;
      });

      // Central Fashion Visual Box
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E5E0D8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(70, 220, 610, 390, 16);
      ctx.fill();
      ctx.stroke();

      // Inside Central Box: Gradient Silk Card
      const grad = ctx.createLinearGradient(90, 240, 660, 590);
      grad.addColorStop(0, color.hex);
      grad.addColorStop(1, color.secondaryHex || '#1A1C20');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(90, 240, 570, 350, 12);
      ctx.fill();

      // Visual Title inside gradient
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = 'bold 36px serif';
      ctx.fillText(garment.name, 375, 395);

      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#FDF8EC';
      ctx.fillText(`${color.vietnameseName} • ${style.name}`, 375, 435);

      ctx.font = 'italic 14px serif';
      ctx.fillStyle = '#E5E7EB';
      ctx.fillText(`Dịp: ${occasion.name} (${occasion.tag})`, 375, 465);

      // Color Palette & Harmony Section
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E5E0D8';
      ctx.beginPath();
      ctx.roundRect(70, 630, 610, 150, 16);
      ctx.fill();
      ctx.stroke();

      // Palette Swatches
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1A1C20';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('BẢNG MÀU DI SẢN (HERITAGE PALETTE)', 95, 665);

      const swatches = [
        { hex: color.hex, label: 'Chính' },
        { hex: color.secondaryHex, label: 'Bổ trợ' },
        { hex: color.accentHex, label: 'Điểm nhấn' }
      ];

      swatches.forEach((sw, i) => {
        const swX = 95 + i * 85;
        ctx.fillStyle = sw.hex;
        ctx.beginPath();
        ctx.arc(swX + 16, 705, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#6B7280';
        ctx.font = '10px monospace';
        ctx.fillText(sw.hex, swX, 735);
      });

      // Harmony Score & Rating on Right
      ctx.textAlign = 'right';
      ctx.fillStyle = '#9B1D20';
      ctx.font = 'bold 34px serif';
      ctx.fillText(`${harmony.score}%`, 655, 685);

      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Hài hòa: ${harmony.rating}`, 655, 712);

      ctx.fillStyle = '#6B7280';
      ctx.font = '11px sans-serif';
      ctx.fillText(harmony.paletteType, 655, 732);

      // Accessories Footer Info
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E5E0D8';
      ctx.beginPath();
      ctx.roundRect(70, 795, 610, 85, 12);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#6B7280';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('PHỤ KIỆN PHỐI KÈM', 90, 822);

      const accNames = selectedAccessories.map((a) => a.name).join(' • ');
      ctx.fillStyle = '#1F2937';
      ctx.font = '12px sans-serif';
      ctx.fillText(accNames || 'Phong cách tối giản, thanh tao', 90, 850);

      // Bottom Cultural Certification
      ctx.textAlign = 'center';
      ctx.fillStyle = advice.status === 'taboo' ? '#DC2626' : advice.status === 'caution' ? '#D97706' : '#059669';
      ctx.font = 'bold 11px sans-serif';
      const statusLabel =
        advice.status === 'respectful'
          ? 'CHUẨN MỰC DI SẢN'
          : advice.status === 'innovative'
          ? 'GIAO THOA SÁNG TẠO'
          : advice.status === 'caution'
          ? 'LƯU Ý HOÀN CẢNH'
          : 'CẢNH BÁO SAI LỆCH';
      ctx.fillText(`✦ CHỨNG CHỈ DI SẢN: ${statusLabel} (${advice.heritageScore}%) ✦`, 375, 915);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px monospace';
      ctx.fillText(`Ngũ hành: ${color.element} • Thời tiết: ${weather ? weather.name + ' (' + weather.temperature + ')' : 'Mọi mùa'} • Mã Look: ${lookCode}`, 375, 940);

      setTimeout(() => {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `viet-phuc-remix-${garment.id}-${gender}.png`;
        link.href = dataUrl;
        link.click();
        setDownloading(false);
        showToast({
          type: 'success',
          title: 'Đã tải Thẻ Look Card PNG!',
          message: 'Tệp hình ảnh thiệp phối đồ thời trang đã được xuất về thiết bị của bạn.'
        });
      }, 400);
    } catch (err) {
      console.error('Canvas export error:', err);
      setDownloading(false);
      showToast({
        type: 'info',
        title: 'Thẻ Look Card',
        message: 'Hoàn tất khởi tạo bản phối.'
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2D8C7] shadow-editorial relative overflow-hidden flex flex-col gap-5 transition-all text-stone-900">
      {/* Editorial Header Ribbon */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-heritage-red animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            Look Result Preview • 2026
          </span>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2D8C7] text-stone-600">
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
          gender={gender}
          onToggleGender={onToggleGender}
          occasion={occasion}
          weather={weather}
          aiImageUrl={aiImageUrl}
          onAiImageGenerated={onAiImageGenerated}
          onOpenKeyModal={onOpenKeyModal}
        />
      </div>

      {/* Outfit Title & Meta Information */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-900 text-white">
            {garment.name}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            {color.name}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
            {style.name}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              gender === 'male'
                ? 'bg-sky-100 text-sky-900 border-sky-200'
                : 'bg-rose-100 text-rose-900 border-rose-200'
            }`}
          >
            {gender === 'male' ? 'Nam ♂' : 'Nữ ♀'}
          </span>
          {weather && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Compass className="w-3 h-3 text-emerald-600" />
              <span>{weather.name} ({weather.temperature})</span>
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight pt-1">
          {outfitName}
        </h3>

        <p className="text-xs text-stone-500 leading-relaxed font-sans">
          Bản phối dành riêng cho dịp <strong className="text-stone-800">{occasion.name}</strong> mang tinh thần <em className="text-heritage-red">{style.vibe}</em>.
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
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200"
              >
                <span>{acc.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Live Color Harmony Analysis */}
      <ColorHarmonyCard harmony={harmony} color={color} />

      {/* Intelligent Cultural Advisory / Warning */}
      <CulturalWarningCard advice={advice} />

      {/* In-depth Cultural Context Accordion */}
      <CulturalContextDrawer garment={garment} />

      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-100">
        <button
          onClick={handleSave}
          className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-full font-bold text-xs transition-all ${
            isSaved
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              : 'bg-stone-900 hover:bg-stone-800 text-white shadow-md'
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
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full font-bold text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
        >
          <Scale className="w-4 h-4 text-heritage-gold" />
          <span>So sánh</span>
        </button>

        <button
          onClick={onOpenShare}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full font-bold text-xs bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 transition-colors"
        >
          <Share2 className="w-4 h-4 text-rose-600" />
          <span>Chia sẻ</span>
        </button>

        <button
          onClick={handleDownloadCard}
          disabled={downloading}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
        >
          <Download className="w-4 h-4 text-amber-700" />
          <span>{downloading ? 'Đang xuất...' : 'Tải Look'}</span>
        </button>
      </div>
    </div>
  );
};
