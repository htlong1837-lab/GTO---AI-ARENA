import React, { useState } from 'react';
import { Outfit } from '../types/outfit';
import { GARMENTS } from '../data/garments';
import { OCCASIONS } from '../data/occasions';
import { COLORS } from '../data/colors';
import { ACCESSORIES } from '../data/accessories';
import { STYLES } from '../data/styles';
import { WEATHER_CONDITIONS } from '../data/weather';
import { StorageService } from '../services/storageService';
import { calculateColorHarmony } from '../services/colorHarmonyService';
import { evaluateCulturalOutfit } from '../services/culturalAdviceService';
import { useToast } from '../context/ToastContext';
import { Scale, Sparkles, Plus, X } from 'lucide-react';

interface ComparePageProps {
  onNavigate: (tab: string) => void;
  onRemixOutfit: (outfit: Outfit) => void;
  onRefreshCompareCount: () => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  onNavigate,
  onRemixOutfit,
  onRefreshCompareCount
}) => {
  const { showToast } = useToast();
  const [compareList, setCompareList] = useState<Outfit[]>(() => StorageService.getCompareList());

  const handleRemove = (outfitId: string) => {
    const updated = StorageService.removeFromCompare(outfitId);
    setCompareList(updated);
    onRefreshCompareCount();
    showToast({
      type: 'info',
      title: 'Đã xóa khỏi bảng so sánh'
    });
  };

  const handleClearAll = () => {
    StorageService.clearCompare();
    setCompareList([]);
    onRefreshCompareCount();
    showToast({
      type: 'info',
      title: 'Đã xóa toàn bộ bảng so sánh'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2D8C7] pb-6">
        <div>
          <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#A8282B]">
            MA TRẬN ĐỐI CHIẾU TRANG PHỤC
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#111215] mt-1.5">
            So Sánh Phẩm Phục ({compareList.length}/3)
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl font-sans">
            Đặt các bản phối cạnh nhau để phân tích sự tương phản, độ hòa sắc Ngũ Hành và tính trang trọng của từng thiết kế.
          </p>
        </div>

        {compareList.length > 0 && (
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-full text-stone-600 hover:text-stone-900 text-xs font-medium hover:bg-[#F4EFE6] transition-colors border border-[#E2D8C7]"
            >
              Xóa tất cả
            </button>
            <button
              onClick={() => onNavigate('studio')}
              className="px-4 py-2 rounded-full bg-[#18181B] hover:bg-[#A8282B] text-white text-xs font-medium tracking-wide flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#DFB058]" />
              <span>Thêm Look khác</span>
            </button>
          </div>
        )}
      </div>

      {compareList.length > 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-[#E2D8C7] shadow-sm overflow-x-auto">
          {/* Side by side Matrix Table */}
          <table className="w-full min-w-[720px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2D8C7]">
                <th className="py-4 px-4 w-44 font-serif font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                  Tiêu chí đối chiếu
                </th>
                {compareList.map((outfit, index) => (
                  <th key={outfit.id} className="py-4 px-4 w-64 align-top">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#18181B] text-[#DFB058] font-serif text-[10px] font-bold border border-[#D4AF37]/40">
                        Bản mẫu 0{index + 1}
                      </span>
                      <button
                        onClick={() => handleRemove(outfit.id)}
                        className="p-1 rounded-md text-stone-400 hover:text-[#A8282B] hover:bg-rose-50 transition-colors"
                        title="Xóa khỏi so sánh"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-2 leading-snug">
                      {outfit.name}
                    </h3>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F4EFE6]">
              {/* Row 1: Trang phục */}
              <tr>
                <td className="py-4 px-4 font-serif font-bold text-stone-700 bg-[#FAF7F2]/80">Dòng Cổ Phục</td>
                {compareList.map((outfit) => {
                  const garment = GARMENTS.find((g) => g.id === outfit.garmentId);
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <div className="font-serif font-bold text-stone-900 text-sm">{garment?.name}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{garment?.region} • {garment?.era}</div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Phong cách */}
              <tr>
                <td className="py-4 px-4 font-serif font-bold text-stone-700 bg-[#FAF7F2]/80">Phong cách</td>
                {compareList.map((outfit) => {
                  const style = STYLES.find((s) => s.id === outfit.styleId);
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${style?.badgeColor}`}>
                        {style?.name}
                      </span>
                      <p className="text-[11px] text-stone-500 mt-1 font-serif italic leading-tight">
                        {style?.vibe}
                      </p>
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Màu sắc & Harmony */}
              <tr>
                <td className="py-4 px-4 font-serif font-bold text-stone-700 bg-[#FAF7F2]/80">Ngũ Sắc & Hài Hòa</td>
                {compareList.map((outfit) => {
                  const color = COLORS.find((c) => c.id === outfit.colorId);
                  const harmony = calculateColorHarmony(outfit.colorId, outfit.styleId, outfit.accessoryIds);
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className="w-5 h-5 rounded-md shadow-xs border border-black/10 shrink-0"
                          style={{ backgroundColor: color?.hex }}
                        />
                        <span className="font-bold text-stone-800 font-serif">{color?.vietnameseName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-stone-800">
                          {harmony.score}%
                        </span>
                        <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {harmony.rating}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Sự kiện / Bối cảnh */}
              <tr>
                <td className="py-4 px-4 font-serif font-bold text-stone-700 bg-[#FAF7F2]/80">Bối cảnh xuất hiện</td>
                {compareList.map((outfit) => {
                  const occasion = OCCASIONS.find((o) => o.id === outfit.occasionId);
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <div className="font-bold text-stone-900">{occasion?.name}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{occasion?.tag}</div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Nhân vật & Khí hậu */}
              <tr>
                <td className="py-4 px-4 font-serif font-bold text-stone-700 bg-[#FAF7F2]/80">Đối tượng & Mùa</td>
                {compareList.map((outfit) => {
                  const weather = WEATHER_CONDITIONS.find((w) => w.id === outfit.weatherId);
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            outfit.gender === 'male' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {outfit.gender === 'male' ? 'Nam ♂' : 'Nữ ♀'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 font-medium border border-amber-200">
                          {weather ? weather.name : 'Mọi mùa'}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 6: Phụ kiện đi kèm */}
              <tr>
                <td className="py-4 px-4 font-serif font-bold text-stone-700 bg-[#FAF7F2]/80">Phụ kiện kết hợp</td>
                {compareList.map((outfit) => {
                  const accs = ACCESSORIES.filter((a) => outfit.accessoryIds.includes(a.id));
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {accs.map((a) => (
                          <span
                            key={a.id}
                            className="px-2 py-0.5 rounded-md bg-[#F4EFE6] text-stone-700 text-[10px] font-medium border border-[#E2D8C7]"
                          >
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 7: Đánh giá Di sản & Văn hóa */}
              <tr>
                <td className="py-4 px-4 font-serif font-bold text-stone-700 bg-[#FAF7F2]/80">Độ chuẩn Di sản</td>
                {compareList.map((outfit) => {
                  const advice = evaluateCulturalOutfit(outfit.garmentId, outfit.styleId, outfit.occasionId, outfit.accessoryIds, outfit.colorId);
                  const isTaboo = advice.status === 'taboo';
                  const isCaution = advice.status === 'caution';
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isTaboo
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : isCaution
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          {advice.heritageScore}% • {advice.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed font-sans">
                        {advice.description}
                      </p>
                    </td>
                  );
                })}
              </tr>

              {/* Row 8: Thao tác Remix */}
              <tr>
                <td className="py-4 px-4 font-serif font-bold text-stone-700 bg-[#FAF7F2]/80">Thao tác</td>
                {compareList.map((outfit) => (
                  <td key={outfit.id} className="py-4 px-4">
                    <button
                      onClick={() => onRemixOutfit(outfit)}
                      className="w-full py-2 px-3 rounded-lg bg-[#18181B] hover:bg-[#A8282B] text-white text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#DFB058]" />
                      <span>Phối lại Look này</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2D8C7] max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] text-[#A8282B] flex items-center justify-center mx-auto border border-[#D4AF37]/30">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Chưa có Look nào trong bảng so sánh
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed font-sans">
            Hãy vào Studio phối đồ hoặc thư viện Lookbook, bấm nút "So sánh" để đưa tối đa 3 bộ outfit vào ma trận đối chiếu.
          </p>
          <button
            onClick={() => onNavigate('studio')}
            className="px-5 py-2.5 rounded-full bg-[#18181B] text-white font-medium text-xs hover:bg-stone-800 transition-colors"
          >
            Vào Studio Phối Đồ
          </button>
        </div>
      )}
    </div>
  );
};
