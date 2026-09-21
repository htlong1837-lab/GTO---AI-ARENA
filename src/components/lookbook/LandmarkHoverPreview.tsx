import React from 'react';
import { Camera, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';
import { LandmarkScenicPhoto } from '../../data/mapLocations';

interface LandmarkHoverPreviewProps {
  visible: boolean;
  provinceName: string;
  region: string;
  isLandmark: boolean;
  scenicPhoto?: LandmarkScenicPhoto;
  totalPhotosCount?: number;
  position: { x: number; y: number };
}

export const LandmarkHoverPreview: React.FC<LandmarkHoverPreviewProps> = ({
  visible,
  provinceName,
  region,
  isLandmark,
  scenicPhoto,
  totalPhotosCount = 4,
  position
}) => {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute z-30 transition-all duration-150 ease-out transform -translate-x-1/2 -translate-y-full pb-3"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '280px'
      }}
    >
      <div className="bg-[#111215]/95 text-[#FAF7F2] rounded-2xl border border-[#DFB058]/80 shadow-2xl p-2.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
        {/* Scenic Image Preview */}
        {scenicPhoto && (
          <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2 bg-stone-900">
            <img
              src={scenicPhoto.url}
              alt={scenicPhoto.spotName}
              className="w-full h-full object-cover brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#111215]/80 backdrop-blur-sm border border-[#DFB058]/40 text-[9px] font-mono text-[#DFB058]">
              <MapPin className="w-2.5 h-2.5" />
              <span>{region}</span>
            </div>
            {isLandmark && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#9B1D20] text-white text-[9px] font-bold tracking-wider uppercase">
                <Sparkles className="w-2.5 h-2.5 text-[#DFB058]" />
                <span>Di San</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 right-2 text-left">
              <p className="text-[11px] font-bold text-white leading-tight drop-shadow-sm truncate">
                {scenicPhoto.spotName}
              </p>
            </div>
          </div>
        )}

        {/* Info Strip */}
        <div className="px-1 text-left space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-serif text-sm font-bold text-[#DFB058] tracking-tight">
              {provinceName}
            </h4>
            {isLandmark && totalPhotosCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
                <Camera className="w-3 h-3 text-[#DFB058]" />
                <span>{totalPhotosCount} anh dep</span>
              </span>
            )}
          </div>

          <p className="text-[10px] text-stone-300 line-clamp-1">
            {scenicPhoto?.title || `Kham pha thang canh & phuc trang ${provinceName}`}
          </p>

          <div className="pt-1 flex items-center justify-between text-[9px] text-[#C59338] font-semibold">
            <span className="flex items-center gap-1">
              <span>Nhan de xem album anh dep</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
