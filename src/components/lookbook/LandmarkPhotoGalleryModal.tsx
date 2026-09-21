import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Camera,
  Scissors,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { MapLocation, LandmarkScenicPhoto } from '../../data/mapLocations';

interface LandmarkPhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: MapLocation;
  initialPhotoIndex?: number;
  onSelectRegionAndScroll?: (region: string) => void;
}

export const LandmarkPhotoGalleryModal: React.FC<LandmarkPhotoGalleryModalProps> = ({
  isOpen,
  onClose,
  location,
  initialPhotoIndex = 0,
  onSelectRegionAndScroll
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(initialPhotoIndex);

  // Sync index when modal opens
  useEffect(() => {
    if (isOpen) {
      setActivePhotoIdx(initialPhotoIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialPhotoIndex]);

  const photos: LandmarkScenicPhoto[] = location.scenicPhotos && location.scenicPhotos.length > 0
    ? location.scenicPhotos
    : [
        {
          id: 'def-1',
          url: location.coverImage,
          title: location.provinceTitle,
          spotName: location.name,
          caption: location.subtitle
        }
      ];

  const currentPhoto = photos[activePhotoIdx] || photos[0];

  const handleNext = useCallback(() => {
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen) return null;

  return typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial from-[#9B1D20]/15 via-transparent to-black pointer-events-none" />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#111215] border border-[#DFB058]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#9B1D20] text-white">
              <Camera className="w-4 h-4 text-[#DFB058]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#DFB058]">
                  Album Thắng Cảnh & Di Sản
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-stone-300 font-mono">
                  {location.region}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#FAF7F2]">
                {location.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Large Photo Display + Meta */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Photo Viewport */}
          <div className="flex-1 bg-black/60 relative flex items-center justify-center p-4 min-h-[300px] sm:min-h-[420px]">
            <img
              key={currentPhoto.url}
              src={currentPhoto.url}
              alt={currentPhoto.spotName}
              className="w-full h-full max-h-[55vh] sm:max-h-[62vh] object-cover object-center transition-all duration-500 animate-in fade-in zoom-in-95"
            />

            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110 active:scale-95"
                  title="Ảnh trước (Phím mũi tên trái)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110 active:scale-95"
                  title="Ảnh tiếp theo (Phím mũi tên phải)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Counter Badge */}
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono border border-white/10">
              {activePhotoIdx + 1} / {photos.length}
            </div>
          </div>

          {/* Photo Context & Recommendation Sidebar */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 bg-[#15161A] p-5 flex flex-col justify-between overflow-y-auto max-h-[35vh] md:max-h-none">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#DFB058] uppercase tracking-wider block">
                  Điểm check-in nổi bật
                </span>
                <h4 className="font-serif font-bold text-base text-white mt-0.5">
                  {currentPhoto.spotName || currentPhoto.title}
                </h4>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  {currentPhoto.caption}
                </p>
              </div>

              {/* Attire match recommendation */}
              {currentPhoto.suitableAttire && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#9B1D20]/20 to-black/40 border border-[#DFB058]/30">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#DFB058]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gợi ý cổ phục phù hợp</span>
                  </div>
                  <p className="text-xs text-stone-200 mt-1.5 leading-snug">
                    {currentPhoto.suitableAttire}
                  </p>
                </div>
              )}

              {/* General location info */}
              <div className="text-xs text-stone-400 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#DFB058] shrink-0 mt-0.5" />
                <span>{location.subtitle}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ' ' + location.provinceTitle)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/15"
              >
                <span>Mở Google Maps chỉ đường</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Thumbnail Filmstrip at Bottom */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/70 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
            {photos.map((photo, idx) => {
              const isSelected = idx === activePhotoIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all group ${
                    isSelected
                      ? 'border-[#DFB058] shadow-[0_0_12px_rgba(223,176,88,0.5)] scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.spotName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#DFB058]/20 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;
};
