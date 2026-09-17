import React from 'react';
import { ColorHarmonyReport } from '../../types/outfit';
import { Palette, CheckCircle, Flame } from 'lucide-react';

interface ColorHarmonyCardProps {
  harmony: ColorHarmonyReport;
}

export const ColorHarmonyCard: React.FC<ColorHarmonyCardProps> = ({ harmony }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-heritage-border/80 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 leading-tight">Kiểm Tra Màu Sắc</h4>
            <p className="text-[11px] text-stone-500">{harmony.paletteType}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800">
          {harmony.score >= 90 ? (
            <Flame className="w-3.5 h-3.5 text-rose-500" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span>{harmony.rating}</span>
        </div>
      </div>

      {/* Harmony Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-stone-600">Độ hài hòa màu sắc</span>
          <span className="text-stone-900 font-bold font-mono text-sm">{harmony.score}%</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-heritage-gold via-heritage-red to-heritage-jade"
            style={{ width: `${harmony.score}%` }}
          />
        </div>
      </div>

      {/* Color Palette Swatches */}
      <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-stone-100">
        <div>
          <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider block mb-1">
            Màu chính
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md shadow-xs border border-black/10 shrink-0"
              style={{ backgroundColor: harmony.primaryColorHex }}
            />
            <span className="text-[11px] font-mono text-stone-700 truncate">{harmony.primaryColorHex}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider block mb-1">
            Màu phụ
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md shadow-xs border border-black/10 shrink-0"
              style={{ backgroundColor: harmony.secondaryColorHex }}
            />
            <span className="text-[11px] font-mono text-stone-700 truncate">{harmony.secondaryColorHex}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider block mb-1">
            Accent
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md shadow-xs border border-black/10 shrink-0"
              style={{ backgroundColor: harmony.accentColorHex }}
            />
            <span className="text-[11px] font-mono text-stone-700 truncate">{harmony.accentColorHex}</span>
          </div>
        </div>
      </div>

      {/* Harmony Feedback Text */}
      <p className="text-xs text-stone-600 mt-3 pt-2.5 border-t border-stone-100 leading-relaxed italic">
        "{harmony.feedback}"
      </p>
    </div>
  );
};
