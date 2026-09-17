import React, { useState } from 'react';
import { ACCESSORIES } from '../../data/accessories';
import { Accessory } from '../../types/outfit';
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
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-xl font-serif font-bold text-stone-900">Phụ kiện & Điểm xuyết</h3>
          <p className="text-xs text-stone-500 mt-1">
            Chọn một hoặc nhiều phụ kiện để tạo nét chấm phá giữa truyền thống và Gen Z.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
          Đã chọn: <strong className="text-heritage-red">{selectedIds.length}</strong> món
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setFilterType('all')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            filterType === 'all'
              ? 'bg-heritage-charcoal text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          Tất cả ({ACCESSORIES.length})
        </button>
        <button
          onClick={() => setFilterType('traditional')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            filterType === 'traditional'
              ? 'bg-heritage-charcoal text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          Thuần Việt cổ phong
        </button>
        <button
          onClick={() => setFilterType('modern')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            filterType === 'modern'
              ? 'bg-heritage-charcoal text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          Gen Z & Streetwear
        </button>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filtered.map((acc) => {
          const isSelected = selectedIds.includes(acc.id);
          return (
            <button
              key={acc.id}
              onClick={() => onToggle(acc.id)}
              className={`text-left p-3 rounded-2xl border transition-all flex items-start gap-3 relative group ${
                isSelected
                  ? 'bg-amber-50/70 border-heritage-gold shadow-xs ring-1 ring-heritage-gold'
                  : 'bg-white hover:bg-stone-50 border-heritage-border/80'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-heritage-gold text-white'
                    : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                }`}
              >
                {ICON_MAP[acc.iconName] || <Sparkles className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-bold text-xs text-stone-900 leading-tight">{acc.name}</h4>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      acc.isTraditional
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-rose-100 text-rose-900'
                    }`}
                  >
                    {acc.isTraditional ? 'Cổ phong' : 'Gen Z'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {acc.description}
                </p>
              </div>

              {/* Checkbox indicator */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center absolute top-3 right-3 transition-colors ${
                  isSelected
                    ? 'bg-heritage-gold text-white'
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
