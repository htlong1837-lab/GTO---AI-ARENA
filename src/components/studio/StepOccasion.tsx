import React from 'react';
import { OCCASIONS } from '../../data/occasions';
import { WEATHER_CONDITIONS } from '../../data/weather';
import { Occasion, WeatherCondition } from '../../types/outfit';
import {
  Sparkles,
  PartyPopper,
  GraduationCap,
  Camera,
  Award,
  HeartHandshake,
  Globe,
  Coffee,
  Check,
  Sun,
  CloudSun,
  CloudRain,
  Wind,
  Compass
} from 'lucide-react';

interface StepOccasionProps {
  selectedId: string;
  onSelect: (occasion: Occasion) => void;
  selectedWeatherId?: string;
  onSelectWeather?: (weather: WeatherCondition) => void;
}

const WEATHER_ICONS: Record<string, React.ReactNode> = {
  CloudSun: <CloudSun className="w-4 h-4 text-amber-400" />,
  Sun: <Sun className="w-4 h-4 text-orange-400" />,
  CloudRain: <CloudRain className="w-4 h-4 text-sky-400" />,
  Wind: <Wind className="w-4 h-4 text-emerald-400" />
};

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

export const StepOccasion: React.FC<StepOccasionProps> = ({
  selectedId,
  onSelect,
  selectedWeatherId,
  onSelectWeather
}) => {
  const activeWeather = WEATHER_CONDITIONS.find((w) => w.id === selectedWeatherId) || WEATHER_CONDITIONS[0];

  return (
    <div className="space-y-6 text-stone-800">
      {/* Weather / Climate Selector Banner */}
      <div className="bg-gradient-to-r from-amber-50/80 via-rose-50/50 to-stone-50 p-4 rounded-2xl border border-[#E2D8C7] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#DFB058]/20 flex items-center justify-center text-[#DFB058]">
              <Compass className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono">
              Thời Tiết & Vùng Miền
            </span>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white text-stone-700 border border-[#E2D8C7] shadow-xs">
            {activeWeather.region} • {activeWeather.temperature}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WEATHER_CONDITIONS.map((w) => {
            const isSelected = (selectedWeatherId || WEATHER_CONDITIONS[0].id) === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onSelectWeather && onSelectWeather(w)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                    : 'bg-white/80 hover:bg-white border-[#E2D8C7] text-stone-700'
                }`}
              >
                <div className="shrink-0">{WEATHER_ICONS[w.icon] || <CloudSun className="w-4 h-4" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate leading-tight">{w.name}</div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {w.temperature}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fabric & Styling Tip for Weather */}
        <p className="text-[11px] text-stone-600 bg-white/70 p-2.5 rounded-xl border border-[#E2D8C7] leading-relaxed flex items-center gap-2 font-light">
          <span className="font-bold text-[#C59338] shrink-0">✦ Gợi ý chất liệu:</span>
          <span className="truncate">{activeWeather.fabricAdvice}</span>
        </p>
      </div>

      <div>
        <h3 className="text-xl font-serif font-bold text-stone-900">Bối cảnh & Dịp xuất hiện</h3>
        <p className="text-xs text-stone-500 mt-1 font-light">
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
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xl ring-2 ring-[#DFB058]'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-[#E2D8C7] hover:border-heritage-gold/50 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-white/15 text-[#DFB058]' : 'bg-stone-100 text-stone-700 group-hover:text-[#DFB058]'
                  }`}
                >
                  {ICON_MAP[occ.icon] || <Sparkles className="w-5 h-5" />}
                </div>

                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
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
                    <div className="w-5 h-5 rounded-full bg-[#DFB058] flex items-center justify-center text-stone-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 line-clamp-2 leading-relaxed font-light ${
                    isSelected ? 'text-stone-300 font-normal' : 'text-stone-500'
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
