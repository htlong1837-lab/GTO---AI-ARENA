import React, { useState } from 'react';
import { ACCESSORIES } from '../../data/accessories';
import {
  Crown,
  SunMedium,
  Footprints,
  Zap,
  Sparkles,
  ShoppingBag,
  Briefcase,
  Gem,
  Circle,
  Glasses,
  Wind,
  Layers,
  Shirt,
  Check
} from 'lucide-react';

interface StepAccessoriesProps {
  selectedIds: string[];
  onToggle: (accessoryId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Crown: <Crown className="w-4 h-4" />,
  SunMedium: <SunMedium className="w-4 h-4" />,
  Footprints: <Footprints className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  Gem: <Gem className="w-4 h-4" />,
  Circle: <Circle className="w-4 h-4" />,
  Glasses: <Glasses className="w-4 h-4" />,
  Wind: <Wind className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />
};

export const StepAccessories: React.FC<StepAccessoriesProps> = ({ selectedIds, onToggle }) => {
  const [filterType, setFilterType] = useState<'all' | 'traditional' | 'modern'>('all');

  const filtered = filterType === 'all'
    ? ACCESSORIES
    : filterType === 'traditional'
    ? ACCESSORIES.filter((a) => a.isTraditional)
    : ACCESSORIES.filter((a) => !a.isTraditional);

  return (
    <div className="space-y-5 text-stone-800">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-xl font-serif font-bold text-stone-900">Phụ kiện & Điểm xuyết</h3>
          <p className="text-xs text-stone-500 mt-1 font-light">
            Chọn một hoặc nhiều phụ kiện để tạo nét chấm phá giữa truyền thống và Gen Z.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-stone-700 border border-[#E2D8C7] shadow-xs">
          Đã chọn: <strong className="text-[#C59338]">{selectedIds.length}</strong> món
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
            filterType === 'all'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-[#E2D8C7]'
          }`}
        >
          Tất cả ({ACCESSORIES.length})
        </button>
        <button
          onClick={() => setFilterType('traditional')}
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
            filterType === 'traditional'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-[#E2D8C7]'
          }`}
        >
          Thuần Việt cổ phong
        </button>
        <button
          onClick={() => setFilterType('modern')}
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
            filterType === 'modern'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-[#E2D8C7]'
          }`}
        >
          Gen Z & Streetwear
        </button>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((acc) => {
          const isSelected = selectedIds.includes(acc.id);
          return (
            <button
              key={acc.id}
              onClick={() => onToggle(acc.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 relative group ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xl ring-2 ring-[#DFB058]'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-[#E2D8C7] hover:border-heritage-gold/50 shadow-xs'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-white/15 text-[#DFB058]'
                    : 'bg-stone-100 text-stone-700 group-hover:text-stone-900'
                }`}
              >
                {ICON_MAP[acc.iconName] || <Sparkles className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className={`font-bold text-xs leading-tight ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {acc.name}
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      acc.isTraditional
                        ? isSelected ? 'bg-amber-100 text-amber-950' : 'bg-amber-100/70 text-amber-800'
                        : isSelected ? 'bg-rose-100 text-rose-950' : 'bg-rose-100/70 text-rose-800'
                    }`}
                  >
                    {acc.isTraditional ? 'Cổ phong' : 'Gen Z'}
                  </span>
                </div>
                <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed font-light ${isSelected ? 'text-stone-300 font-normal' : 'text-stone-500'}`}>
                  {acc.description}
                </p>
              </div>

              {/* Checkbox indicator */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center absolute top-3.5 right-3.5 transition-colors ${
                  isSelected
                    ? 'bg-[#DFB058] text-stone-950'
                    : 'border border-stone-300 group-hover:border-stone-400'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
