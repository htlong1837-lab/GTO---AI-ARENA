import React from 'react';
import { CulturalAdvice } from '../../types/outfit';
import { ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface CulturalWarningCardProps {
  advice: CulturalAdvice;
}

export const CulturalWarningCard: React.FC<CulturalWarningCardProps> = ({ advice }) => {
  const isCaution = advice.status === 'caution';
  const isInnovative = advice.status === 'innovative';

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isCaution
          ? 'bg-amber-50/90 border-amber-300/80 text-amber-950'
          : isInnovative
          ? 'bg-rose-50/80 border-rose-200 text-rose-950'
          : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
            isCaution
              ? 'bg-amber-500 text-white'
              : isInnovative
              ? 'bg-rose-500 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {isCaution ? (
            <ShieldAlert className="w-4 h-4" />
          ) : isInnovative ? (
            <Sparkles className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isCaution
                  ? 'bg-amber-200/80 text-amber-900'
                  : isInnovative
                  ? 'bg-rose-200/80 text-rose-900'
                  : 'bg-emerald-200/80 text-emerald-900'
              }`}
            >
              {isCaution ? 'Lưu ý văn hóa' : isInnovative ? 'Giao thoa Gen Z' : 'Chuẩn mực di sản'}
            </span>
            <h4 className="font-bold text-sm leading-tight">{advice.title}</h4>
          </div>
          <p className="text-xs mt-1.5 leading-relaxed opacity-90">{advice.description}</p>
        </div>
      </div>

      {/* Cultural Distinction: Truyền Thống vs Cách Điệu Hiện Đại */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-black/10 mt-2 text-xs">
        <div className="bg-white/60 p-2.5 rounded-xl border border-black/5">
          <span className="font-bold text-[10px] uppercase tracking-wider text-stone-700 block mb-1">
            🧵 Yếu tố Truyền Thống
          </span>
          <ul className="space-y-1 text-stone-700">
            {advice.traditionalFeatures.map((feat, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-heritage-gold shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/60 p-2.5 rounded-xl border border-black/5">
          <span className="font-bold text-[10px] uppercase tracking-wider text-stone-700 block mb-1">
            ⚡ Điểm Cách Điệu Hiện Đại
          </span>
          <ul className="space-y-1 text-stone-700">
            {advice.modernTwistNotes.map((note, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
