import React, { useState } from 'react';
import { Garment } from '../../types/outfit';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, History, Compass, ShieldCheck, AlertCircle } from 'lucide-react';

interface CulturalContextDrawerProps {
  garment: Garment;
}

export const CulturalContextDrawer: React.FC<CulturalContextDrawerProps> = ({ garment }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getTierBadge = (tier: Garment['formalityTier']) => {
    switch (tier) {
      case 'court_regal':
        return {
          label: 'Phẩm phục Cung đình Hoàng thất',
          style: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'scholarly_formal':
        return {
          label: 'Lễ phục Đĩnh đạc Cổ phong',
          style: 'bg-indigo-100 text-indigo-900 border-indigo-300'
        };
      case 'folk_traditional':
        return {
          label: 'Dân gian Truyền thống Thân thuộc',
          style: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        };
      case 'modern_national':
      default:
        return {
          label: 'Quốc phục Thanh tân Đương đại',
          style: 'bg-rose-100 text-rose-900 border-rose-300'
        };
    }
  };

  const tier = getTierBadge(garment.formalityTier);

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
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-stone-900 leading-tight">
                Hồ Sơ Di Sản: {garment.name}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.style}`}>
                {tier.label}
              </span>
            </div>
            <p className="text-xs text-stone-500">Cội nguồn, đặc điểm cấu trúc và ranh giới sáng tạo văn minh</p>
          </div>
        </div>
        <div className="text-stone-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-0 border-t border-stone-100 space-y-4 text-xs">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
              <div className="flex items-center gap-1.5 text-stone-500 font-medium mb-1">
                <Compass className="w-3.5 h-3.5 text-heritage-gold" />
                <span>Không gian địa phương</span>
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
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-stone-500 font-medium mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Cấp bậc nghi lễ</span>
              </div>
              <p className="font-semibold text-stone-800">{tier.label.split(' ')[0]} {tier.label.split(' ')[1]}</p>
            </div>
          </div>

          {/* Quy chuẩn di sản bất khả xâm phạm */}
          {garment.inviolableFeatures && garment.inviolableFeatures.length > 0 && (
            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/60 text-amber-950">
              <div className="flex items-center gap-1.5 font-bold mb-1.5 text-[11px] text-amber-900 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Ranh giới gìn giữ cốt lõi khi Remix</span>
              </div>
              <ul className="space-y-1 text-[11px]">
                {garment.inviolableFeatures.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: Kết cấu Lập lĩnh / Đối khâm / Vạt áo */}
          <div className="bg-stone-50/80 p-3 rounded-xl border border-stone-200/70 space-y-1.5">
            <h5 className="font-bold text-stone-800 text-[11px] uppercase tracking-wider">
              Cấu trúc Cổ áo & Thân áo
            </h5>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              <strong>Cổ áo:</strong> {garment.historyDetails.collarType}
            </p>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              <strong>Thân vạt:</strong> {garment.historyDetails.flapStructure}
            </p>
          </div>

          {/* Section: Đặc Điểm */}
          <div>
            <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-heritage-red rounded-full" />
              Đặc điểm kết cấu nhận diện
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
              Triết lý & Giá trị văn hóa
            </h5>
            <p className="text-stone-600 leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-200/30">
              {garment.culturalNote}
            </p>
          </div>

          {/* Section: Gợi ý phối Gen Z */}
          <div>
            <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Gợi ý phối hiện đại văn minh (Creative Twists)
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
