import React from 'react';
import { OCCASIONS } from '../../data/occasions';
import { Occasion } from '../../types/outfit';
import { Sparkles, PartyPopper, GraduationCap, Camera, Award, HeartHandshake, Globe, Coffee, Check } from 'lucide-react';

interface StepOccasionProps {
  selectedId: string;
  onSelect: (occasion: Occasion) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  PartyPopper: <PartyPopper className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />
};

export const StepOccasion: React.FC<StepOccasionProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-serif font-bold text-stone-900">Bối cảnh & Dịp xuất hiện</h3>
        <p className="text-xs text-stone-500 mt-1">
          Chọn dịp bạn muốn diện Việt phục để hệ thống gợi ý phom dáng và phong cách phù hợp nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OCCASIONS.map((occ) => {
          const isSelected = selectedId === occ.id;
          return (
            <button
              key={occ.id}
              onClick={() => onSelect(occ)}
              className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-heritage-gold/50'
                  : 'bg-white hover:bg-stone-50/90 text-stone-800 border-heritage-border/80 hover:border-heritage-gold/50'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-white/10 text-heritage-gold-light' : 'bg-stone-100 text-stone-700 group-hover:text-heritage-red'
                  }`}
                >
                  {ICON_MAP[occ.icon] || <Sparkles className="w-5 h-5" />}
                </div>

                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-stone-200'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {occ.tag}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm tracking-tight">{occ.name}</h4>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-heritage-gold flex items-center justify-center text-stone-900">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                    isSelected ? 'text-stone-300' : 'text-stone-500'
                  }`}
                >
                  {occ.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
