import React from 'react';
import { STYLES } from '../../data/styles';
import { StyleGenZ } from '../../types/outfit';
import { Sparkles, Check } from 'lucide-react';

interface StepStyleProps {
  selectedId: string;
  onSelect: (style: StyleGenZ) => void;
}

export const StepStyle: React.FC<StepStyleProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-serif font-bold text-stone-900">Định hình phong cách</h3>
        <p className="text-xs text-stone-500 mt-1">
          Lựa chọn linh hồn phối đồ: từ Thuần Việt chuẩn mực đến High-Fashion Editorial hoặc Phá cách đường phố.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STYLES.map((st) => {
          const isSelected = selectedId === st.id;
          return (
            <button
              key={st.id}
              onClick={() => onSelect(st)}
              className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between group relative ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-heritage-gold/50'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-heritage-border/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isSelected ? 'bg-white/20 text-stone-200 border-white/30' : st.badgeColor
                    }`}
                  >
                    {st.tag}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-heritage-gold text-stone-900'
                        : 'border border-stone-300 text-transparent group-hover:border-stone-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <h4 className="font-bold text-sm tracking-tight">{st.name}</h4>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    isSelected ? 'text-stone-300' : 'text-stone-600'
                  }`}
                >
                  {st.description}
                </p>
              </div>

              <div
                className={`mt-3 pt-2.5 border-t text-[11px] font-medium flex items-center gap-1.5 ${
                  isSelected ? 'border-white/10 text-heritage-gold-light' : 'border-stone-100 text-stone-500'
                }`}
              >
                <Sparkles className="w-3 h-3 shrink-0" />
                <span className="truncate">{st.vibe}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
