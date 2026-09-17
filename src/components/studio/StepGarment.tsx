import React from 'react';
import { GARMENTS } from '../../data/garments';
import { Garment } from '../../types/outfit';
import { MapPin, Clock, Check } from 'lucide-react';

interface StepGarmentProps {
  selectedId: string;
  onSelect: (garment: Garment) => void;
}

export const StepGarment: React.FC<StepGarmentProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-serif font-bold text-stone-900">Chọn dòng Việt phục</h3>
        <p className="text-xs text-stone-500 mt-1">
          Khám phá 5 kiểu trang phục mang tính biểu tượng văn hóa qua các thời kỳ lịch sử.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {GARMENTS.map((g) => {
          const isSelected = selectedId === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onSelect(g)}
              className={`text-left p-4 rounded-2xl border transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-heritage-gold/50'
                  : 'bg-white hover:bg-stone-50/90 text-stone-800 border-heritage-border/80 hover:border-heritage-gold/50'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Thumbnail image with fallback */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-stone-200 border border-stone-300/40">
                  <img
                    src={g.image}
                    alt={g.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback colored block
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-serif font-bold text-base sm:text-lg">{g.name}</h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isSelected ? 'bg-white/20 text-stone-200' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <MapPin className="w-2.5 h-2.5" />
                      {g.region}
                    </span>
                  </div>

                  <p
                    className={`text-xs line-clamp-2 leading-relaxed mb-2 ${
                      isSelected ? 'text-stone-300' : 'text-stone-600'
                    }`}
                  >
                    {g.subtitle}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] opacity-75">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-heritage-gold" />
                      <span className="truncate max-w-[200px]">{g.era}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/40 gap-2">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                    isSelected ? 'bg-heritage-gold text-stone-900' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {g.silhouette}
                </span>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-heritage-gold text-stone-900 shadow-sm'
                      : 'border border-stone-300 text-transparent group-hover:border-heritage-gold'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
