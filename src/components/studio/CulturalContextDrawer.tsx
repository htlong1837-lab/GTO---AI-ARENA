import React, { useState } from 'react';
import { Garment } from '../../types/outfit';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, History, Compass } from 'lucide-react';

interface CulturalContextDrawerProps {
  garment: Garment;
}

export const CulturalContextDrawer: React.FC<CulturalContextDrawerProps> = ({ garment }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-heritage-border/80 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-heritage-indigo/10 text-heritage-indigo flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 leading-tight">
              Hiểu Đúng Về {garment.name}
            </h4>
            <p className="text-xs text-stone-500">Đặc điểm, lịch sử và gợi ý phối hiện đại</p>
          </div>
        </div>
        <div className="text-stone-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-0 border-t border-stone-100 space-y-4 text-xs">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
              <div className="flex items-center gap-1.5 text-stone-500 font-medium mb-1">
                <Compass className="w-3.5 h-3.5 text-heritage-gold" />
                <span>Không gian văn hóa</span>
              </div>
              <p className="font-semibold text-stone-800">{garment.region}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
              <div className="flex items-center gap-1.5 text-stone-500 font-medium mb-1">
                <History className="w-3.5 h-3.5 text-heritage-red" />
                <span>Niên đại lịch sử</span>
              </div>
              <p className="font-semibold text-stone-800 truncate">{garment.era}</p>
            </div>
          </div>

          {/* Section: Đặc Điểm */}
          <div>
            <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-heritage-red rounded-full" />
              Đặc điểm kết cấu
            </h5>
            <ul className="space-y-1 text-stone-600 pl-1">
              {garment.keyFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-heritage-gold mt-0.5">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Giá trị Văn Hóa */}
          <div>
            <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-heritage-gold rounded-full" />
              Giá trị văn hóa
            </h5>
            <p className="text-stone-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-200/40">
              {garment.culturalNote}
            </p>
          </div>

          {/* Section: Gợi ý phối Gen Z */}
          <div>
            <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Gợi ý phối hiện đại văn minh
            </h5>
            <ul className="space-y-1 text-stone-600 pl-1">
              {garment.modernRemixTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 mt-0.5">✦</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
