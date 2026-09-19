import React from 'react';
import { CulturalAdvice } from '../../types/outfit';
import { ShieldAlert, Sparkles, CheckCircle2, AlertOctagon, BookOpen, Compass } from 'lucide-react';

interface CulturalWarningCardProps {
  advice: CulturalAdvice;
}

export const CulturalWarningCard: React.FC<CulturalWarningCardProps> = ({ advice }) => {
  const isTaboo = advice.status === 'taboo';
  const isCaution = advice.status === 'caution';
  const isInnovative = advice.status === 'innovative';

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-100/80 border-emerald-300';
    if (score >= 75) return 'text-purple-700 bg-purple-100/80 border-purple-300';
    if (score >= 60) return 'text-amber-700 bg-amber-100/80 border-amber-300';
    return 'text-rose-700 bg-rose-100/80 border-rose-300';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-purple-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isTaboo
          ? 'bg-rose-50 border-rose-200 text-rose-950 shadow-xs'
          : isCaution
          ? 'bg-amber-50 border-amber-200 text-amber-950 shadow-xs'
          : isInnovative
          ? 'bg-purple-50 border-purple-200 text-purple-950 shadow-xs'
          : 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-xs'
      }`}
    >
      {/* Top Header: Badge, Title & Heritage Score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
              isTaboo
                ? 'bg-rose-600 text-white'
                : isCaution
                ? 'bg-amber-500 text-stone-950'
                : isInnovative
                ? 'bg-purple-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isTaboo ? (
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            ) : isCaution ? (
              <ShieldAlert className="w-5 h-5" />
            ) : isInnovative ? (
              <Sparkles className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[9px] font-serif font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full shadow-xs ${
                  isTaboo
                    ? 'bg-rose-600 text-white'
                    : isCaution
                    ? 'bg-amber-400 text-stone-950'
                    : isInnovative
                    ? 'bg-purple-500 text-white'
                    : 'bg-emerald-500 text-stone-950'
                }`}
              >
                {isTaboo
                  ? 'Cảnh báo sai lệch di sản (Taboo)'
                  : isCaution
                  ? 'Lưu ý bối cảnh & phụ kiện'
                  : isInnovative
                  ? 'Giao thoa Đương đại (Creative Fusion)'
                  : 'Chuẩn mực di sản (Heritage Preserved)'}
              </span>
            </div>
            <h4 className="font-serif font-bold text-base leading-snug mt-1 text-stone-900">{advice.title}</h4>
          </div>
        </div>

        {/* Heritage Alignment Score Badge */}
        <div
          className={`shrink-0 flex flex-col items-center px-3 py-1.5 rounded-xl border text-center ${getScoreColor(
            advice.heritageScore
          )}`}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider">Độ chuẩn di sản</span>
          <span className="text-base font-extrabold leading-none mt-0.5">{advice.heritageScore}%</span>
        </div>
      </div>

      {/* Heritage Score Bar */}
      <div className="w-full bg-stone-200/80 rounded-full h-1.5 mb-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-700 rounded-full ${getProgressBarColor(advice.heritageScore)}`}
          style={{ width: `${advice.heritageScore}%` }}
        />
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed text-stone-700 font-light">{advice.description}</p>

      {/* Taboo Violation Alert Callout (If taboo) */}
      {advice.tabooAlert && (
        <div className="mt-3 p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-950">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Quy tắc di sản bất khả xâm phạm:</span>
          </div>
          <p className="leading-relaxed">{advice.tabooAlert}</p>
        </div>
      )}

      {/* Ngũ Hành Wisdom Pill */}
      {advice.nguHanhNote && (
        <div className="mt-3 p-2.5 rounded-xl bg-stone-100/80 border border-[#E2D8C7] text-xs flex items-start gap-2 text-stone-700">
          <Compass className="w-4 h-4 text-[#C59338] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[10px] uppercase tracking-wider text-stone-900 block mb-0.5">
              Triết lý Ngũ Sắc & Ngũ Hành:
            </span>
            <p className="leading-relaxed text-[11px] font-light">{advice.nguHanhNote}</p>
          </div>
        </div>
      )}

      {/* Traditional vs Modern Features Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[#E2D8C7] mt-3 text-xs">
        <div className="bg-white/80 p-3 rounded-xl border border-[#E2D8C7] shadow-2xs">
          <span className="font-bold text-[10px] uppercase tracking-wider text-stone-900 block mb-1.5">
            🧵 Yếu tố Cổ truyền Giữ gìn
          </span>
          <ul className="space-y-1.5 text-stone-700">
            {advice.traditionalFeatures.map((feat, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C59338] shrink-0 mt-1.5" />
                <span className="leading-snug font-light">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/80 p-3 rounded-xl border border-[#E2D8C7] shadow-2xs">
          <span className="font-bold text-[10px] uppercase tracking-wider text-stone-900 block mb-1.5">
            ⚡ Điểm Cách Điệu & Đương đại
          </span>
          <ul className="space-y-1.5 text-stone-700">
            {advice.modernTwistNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                <span className="leading-snug font-light">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Boundary Guide (Do & Don't) */}
      {advice.boundaryGuide && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
          <div className="bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300/60">
            <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-800 block mb-1">
              ✓ Nên áp dụng (Do)
            </span>
            <ul className="space-y-1 text-emerald-900 text-[11px]">
              {advice.boundaryGuide.doList.map((d, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="font-light">{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-rose-100/70 p-2.5 rounded-xl border border-rose-300/60">
            <span className="font-bold text-[10px] uppercase tracking-wider text-rose-800 block mb-1">
              ✕ Tuyệt đối tránh (Don't)
            </span>
            <ul className="space-y-1 text-rose-900 text-[11px]">
              {advice.boundaryGuide.dontList.map((d, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span className="font-light">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Citation Footer */}
      {advice.sourceCitation && (
        <div className="mt-3 pt-2 border-t border-stone-200 flex items-center gap-1.5 text-[10px] text-stone-500">
          <BookOpen className="w-3 h-3 text-[#C59338]" />
          <span>Căn cứ lịch sử: <strong className="font-semibold text-stone-800">{advice.sourceCitation}</strong></span>
        </div>
      )}
    </div>
  );
};
