import React, { useState, useEffect } from 'react';
import { Outfit } from '../types/outfit';
import { GARMENTS } from '../data/garments';
import { OCCASIONS } from '../data/occasions';
import { COLORS } from '../data/colors';
import { ACCESSORIES } from '../data/accessories';
import { STYLES } from '../data/styles';
import { StorageService } from '../services/storageService';
import { calculateColorHarmony } from '../services/colorHarmonyService';
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

  useEffect(() => {
    setCompareList(StorageService.getCompareList());
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-heritage-border/70 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-red font-mono">
            Outfit Matrix
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            So Sánh Look ({compareList.length}/3)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Đặt các bản phối cạnh nhau để phân tích sự tương phản, độ hài hòa màu sắc và hoàn cảnh sử dụng.
          </p>
        </div>

        {compareList.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors"
            >
              Xóa tất cả
            </button>
            <button
              onClick={() => onNavigate('studio')}
              className="px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Look khác</span>
            </button>
          </div>
        )}
      </div>

      {compareList.length > 0 ? (
        <div className="bg-white rounded-3xl p-6 border border-heritage-border/80 shadow-sm overflow-x-auto">
          {/* Side by side Matrix Table */}
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="py-4 px-4 w-40 font-bold uppercase tracking-wider text-stone-400 text-[10px]">
                  Tiêu chí so sánh
                </th>
                {compareList.map((outfit, index) => (
                  <th key={outfit.id} className="py-4 px-4 w-64 align-top">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">
                        Look 0{index + 1}
                      </span>
                      <button
                        onClick={() => handleRemove(outfit.id)}
                        className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

            <tbody className="divide-y divide-stone-100">
              {/* Row 1: Trang phục */}
              <tr>
                <td className="py-4 px-4 font-bold text-stone-700 bg-stone-50/50">Trang phục</td>
                {compareList.map((outfit) => {
                  const garment = GARMENTS.find((g) => g.id === outfit.garmentId);
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <div className="font-bold text-stone-900 text-sm">{garment?.name}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{garment?.region}</div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Phong cách */}
              <tr>
                <td className="py-4 px-4 font-bold text-stone-700 bg-stone-50/50">Phong cách</td>
                {compareList.map((outfit) => {
                  const style = STYLES.find((s) => s.id === outfit.styleId);
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${style?.badgeColor}`}>
                        {style?.name}
                      </span>
                      <p className="text-[11px] text-stone-500 mt-1 italic leading-tight">
                        {style?.vibe}
                      </p>
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Màu sắc & Harmony */}
              <tr>
                <td className="py-4 px-4 font-bold text-stone-700 bg-stone-50/50">Màu sắc & Hài hòa</td>
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
                        <span className="font-bold text-stone-800">{color?.vietnameseName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-stone-700">
                          {harmony.score}%
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {harmony.rating}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Sự kiện / Bối cảnh */}
              <tr>
                <td className="py-4 px-4 font-bold text-stone-700 bg-stone-50/50">Sự kiện thích hợp</td>
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

              {/* Row 5: Phụ kiện đi kèm */}
              <tr>
                <td className="py-4 px-4 font-bold text-stone-700 bg-stone-50/50">Phụ kiện</td>
                {compareList.map((outfit) => {
                  const accs = ACCESSORIES.filter((a) => outfit.accessoryIds.includes(a.id));
                  return (
                    <td key={outfit.id} className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {accs.map((a) => (
                          <span
                            key={a.id}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium"
                          >
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 6: Đánh giá cá nhân & Thao tác */}
              <tr>
                <td className="py-4 px-4 font-bold text-stone-700 bg-stone-50/50">Thao tác</td>
                {compareList.map((outfit) => (
                  <td key={outfit.id} className="py-4 px-4">
                    <button
                      onClick={() => onRemixOutfit(outfit)}
                      className="w-full py-2.5 px-3 rounded-xl bg-heritage-red hover:bg-heritage-red-dark text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
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
        <div className="bg-white rounded-3xl p-12 text-center border border-heritage-border max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-heritage-gold flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Chưa có Look nào trong bảng so sánh
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Bạn có thể chọn tối đa 3 bộ trang phục từ <strong>Studio Phối Đồ</strong> hoặc <strong>Lookbook Việt</strong> để so sánh sự khác biệt chi tiết.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('studio')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-heritage-red hover:bg-heritage-red-dark text-white font-bold text-xs shadow-red-glow transition-all"
            >
              Vào Studio phối đồ
            </button>
            <button
              onClick={() => onNavigate('lookbook')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
            >
              Khám phá Lookbook
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
