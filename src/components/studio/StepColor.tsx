import React, { useState } from 'react';
import { COLORS } from '../../data/colors';
import { ColorOption } from '../../types/outfit';
import { Check, Sparkles } from 'lucide-react';

interface StepColorProps {
  selectedId: string;
  onSelect: (color: ColorOption) => void;
}

export const StepColor: React.FC<StepColorProps> = ({ selectedId, onSelect }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'royal' | 'heritage' | 'pastel' | 'modern'>('all');

  const filteredColors = filterCategory === 'all'
    ? COLORS
    : COLORS.filter((c) => c.category === filterCategory);

  const selectedColor = COLORS.find((c) => c.id === selectedId) || COLORS[0];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-serif font-bold text-stone-900">Bảng màu Di sản & Đương đại</h3>
        <p className="text-xs text-stone-500 mt-1">
          Mỗi sắc màu đều gắn liền với triết lý Ngũ hành, tự nhiên và phong vị thẩm mỹ của người Việt.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Tất cả sắc độ' },
          { id: 'royal', label: 'Cung đình & Quý phái' },
          { id: 'heritage', label: 'Cổ phong trầm mặc' },
          { id: 'pastel', label: 'Pastel thanh xuân' },
          { id: 'modern', label: 'Sắc thái hiện đại' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id as any)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              filterCategory === tab.id
                ? 'bg-heritage-charcoal text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Color Swatches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {filteredColors.map((col) => {
          const isSelected = selectedId === col.id;
          return (
            <button
              key={col.id}
              onClick={() => onSelect(col)}
              className={`text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-white border-heritage-charcoal shadow-md ring-2 ring-heritage-gold/50'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-heritage-border/80'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {/* Big Color Swatch */}
                <div
                  className="w-9 h-9 rounded-xl shadow-inner border border-black/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-5 h-5 stroke-[3] ${
                        col.id === 'trang-lua-nga' || col.id === 'pastel-thanh-thien'
                          ? 'text-stone-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-stone-900 truncate">{col.vietnameseName}</h4>
                  <p className="text-[10px] font-mono text-stone-400">{col.hex}</p>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                {col.culturalMeaning}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Color Spotlight Box */}
      {selectedColor && (
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-heritage-gold" />
            <span className="font-bold text-stone-900">{selectedColor.vietnameseName}</span>
          </div>
          <p className="text-stone-600 leading-relaxed italic">{selectedColor.mood}</p>
        </div>
      )}
    </div>
  );
};
