import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Landmark,
  Mountain,
  Crown,
  Sparkles,
  Flame,
  Building2,
  Compass,
  ArrowRight,
  Sparkle,
  ChevronLeft,
  ChevronRight,
  Layers,
  Scissors,
  Eye,
  CheckCircle2,
  Navigation,
  Camera,
  ZoomIn,
  Images
} from 'lucide-react';
import { VIETNAM_PROVINCES, ProvinceSvgData } from '../../data/vietnamProvincesSvg';
import { MAP_LOCATIONS, MapLocation } from '../../data/mapLocations';
import { CURATED_LOOKBOOKS } from '../../data/curatedLookbooks';
import { CuratedLook } from '../../types/outfit';
import { LandmarkPhotoGalleryModal } from './LandmarkPhotoGalleryModal';
import gsap from 'gsap';

interface VietnamMapExplorerProps {
  activeRegion: string;
  onSelectRegion: (region: string) => void;
  onScrollToGallery: () => void;
  onSelectLook?: (look: CuratedLook) => void;
}

const PROVINCE_TO_LANDMARK: Record<string, string> = {
  VNHN: 'loc-hanoi',
  VN18: 'loc-ninhbinh',
  VN26: 'loc-hue',
  VNDN: 'loc-danang',
  VN27: 'loc-hoian',
  VNSG: 'loc-saigon',
  VNCT: 'loc-mekong'
};

export const VietnamMapExplorer: React.FC<VietnamMapExplorerProps> = ({
  activeRegion,
  onSelectRegion,
  onScrollToGallery,
  onSelectLook
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceSvgData | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isHoveringCard, setIsHoveringCard] = useState<boolean>(false);
  const [isHoveringMap, setIsHoveringMap] = useState<boolean>(false);

  const selectedLocation = MAP_LOCATIONS[currentIndex];
  const activeLoc = hoveredLocation || selectedLocation;

  // Reset selected photo when active location changes
  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [activeLoc.id]);

  const activePhotos = activeLoc.scenicPhotos && activeLoc.scenicPhotos.length > 0
    ? activeLoc.scenicPhotos
    : [
        {
          id: 'def',
          url: activeLoc.coverImage,
          title: activeLoc.provinceTitle,
          spotName: activeLoc.name,
          caption: activeLoc.subtitle
        }
      ];

  // Auto-play scenic photos when mouse is over landmark or card
  const isAutoPlaying = Boolean(hoveredLocation) || isHoveringMap || isHoveringCard;

  useEffect(() => {
    if (!isAutoPlaying || activePhotos.length <= 1) return;

    const timer = setInterval(() => {
      setSelectedPhotoIndex((prev) => (prev + 1) % activePhotos.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, activePhotos.length]);

  const currentShowcasePhoto = activePhotos[selectedPhotoIndex] || activePhotos[0];

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);

  const activeLook: CuratedLook | undefined = activeLoc.primaryLookId
    ? CURATED_LOOKBOOKS.find((l) => l.id === activeLoc.primaryLookId)
    : CURATED_LOOKBOOKS.find((l) => l.region === activeLoc.region);

  const regionalLookCount = CURATED_LOOKBOOKS.filter(
    (l) => l.region === activeLoc.region || l.region === 'Toàn quốc'
  ).length;

  // Stagger entrance for landmark provinces
  useEffect(() => {
    if (mapContainerRef.current) {
      const landmarks = mapContainerRef.current.querySelectorAll('.landmark-province');
      gsap.fromTo(
        landmarks,
        { opacity: 0.5 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          delay: 0.2,
          ease: 'power2.out'
        }
      );
    }
  }, []);

  // Card reveal animation on location change
  useEffect(() => {
    if (cardContentRef.current) {
      gsap.fromTo(
        cardContentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeLoc.id]);

  const handleSelectLocationIndex = useCallback((idx: number) => {
    setCurrentIndex(idx);
    onSelectRegion(MAP_LOCATIONS[idx].region);
  }, [onSelectRegion]);

  const handleNextLocation = () => {
    const nextIdx = (currentIndex + 1) % MAP_LOCATIONS.length;
    handleSelectLocationIndex(nextIdx);
  };

  const handlePrevLocation = () => {
    const prevIdx = (currentIndex - 1 + MAP_LOCATIONS.length) % MAP_LOCATIONS.length;
    handleSelectLocationIndex(prevIdx);
  };

  const renderIcon = (type: MapLocation['iconType']) => {
    switch (type) {
      case 'landmark':
        return <Landmark className="w-3.5 h-3.5" />;
      case 'mountain':
        return <Mountain className="w-3.5 h-3.5" />;
      case 'crown':
        return <Crown className="w-3.5 h-3.5" />;
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'flame':
        return <Flame className="w-3.5 h-3.5" />;
      case 'building':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'compass':
        return <Compass className="w-3.5 h-3.5" />;
      default:
        return <Sparkle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] border border-[#E2D8C7] rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
      {/* Subtle cartographic grid background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(#C59338 0.75px, transparent 0.75px), radial-gradient(#111215 0.5px, transparent 0.5px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }}
      />
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-gradient-to-bl from-[#DFB058]/12 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-gradient-to-tr from-[#9B1D20]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* Header Control Strip */}
      <div className="relative z-10 pb-8 border-b border-[#E2D8C7]">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#9B1D20]">
            <Compass className="w-4 h-4 text-[#C59338] animate-spin-slow" />
            <span>Bản Đồ Di Sản & 63 Tỉnh Thành</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111215] tracking-tight">
            Hải Đồ Địa Lý & Phục Trang Việt Nam
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
            Hiển thị chuẩn xác 63 tỉnh thành trên không gian bản đồ dân tộc. Khám phá văn hóa phục trang đặc sắc từ Bắc chí Nam qua từng địa danh di sản.
          </p>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-stretch">
        {/* Left Column (5 Cols): Genuine 63-Province Map */}
        <div
          ref={mapContainerRef}
          onMouseEnter={() => setIsHoveringMap(true)}
          onMouseLeave={() => {
            setIsHoveringMap(false);
            setHoveredProvince(null);
            setHoveredLocation(null);
          }}
          className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 bg-white/95 backdrop-blur-md rounded-3xl border border-[#E2D8C7] shadow-xs relative overflow-hidden min-h-[620px]"
        >
          {/* Top Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-stone-500 pb-3 border-b border-[#F4EFE6]">
            <div className="flex items-center gap-1.5 text-[#741416] font-bold">
              <Navigation className="w-3.5 h-3.5 text-[#C59338]" />
              <span>Hải Đồ 63 Tỉnh Thành</span>
            </div>
            <div className="flex items-center gap-2">
              {hoveredProvince ? (
                <span className="text-[#9B1D20] font-bold font-sans normal-case">
                  {hoveredProvince.name} ({hoveredProvince.region})
                </span>
              ) : (
                <span>{currentIndex + 1} / {MAP_LOCATIONS.length} Trạm Di Sản</span>
              )}
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[540/940] max-w-[420px] mx-auto my-auto py-2">
            <svg
              viewBox="250 30 540 940"
              className="w-full h-full overflow-visible drop-shadow-sm select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Parallels & Meridians Latitude Grid */}
              <g className="opacity-25" stroke="#C59338" strokeWidth="0.5" strokeDasharray="3 4">
                <line x1="260" y1="198" x2="780" y2="198" />
                <line x1="260" y1="483" x2="780" y2="483" />
                <line x1="260" y1="824" x2="780" y2="824" />
                <line x1="491" y1="50" x2="491" y2="950" />
                <line x1="608" y1="50" x2="608" y2="950" />
              </g>

              {/* Geographic Coordinate Annotations */}
              <g fill="#A89F91" fontSize="9" fontFamily="monospace" letterSpacing="0.05em">
                <text x="265" y="193">21°N (Bắc Bộ)</text>
                <text x="265" y="478">16°N (Trung Bộ)</text>
                <text x="265" y="819">10°N (Nam Bộ)</text>
                <text x="710" y="70">108°E</text>
              </g>

              {/* 63 Provinces of Vietnam Group */}
              <g id="vietnam-provinces-layer">
                {VIETNAM_PROVINCES.map((prov) => {
                  const landmarkId = PROVINCE_TO_LANDMARK[prov.id];
                  const isLandmark = !!landmarkId;
                  const isLandmarkActive = activeLoc.id === landmarkId;
                  const isHovered = hoveredProvince?.id === prov.id;

                  // Styling
                  let fill = '#FAF7F2';
                  let stroke = '#E2D8C7';
                  let strokeWidth = 0.65;

                  if (isLandmark) {
                    // Distinctive heritage silk highlight for the 7 landmark provinces
                    fill = '#F3E5D0';
                    stroke = '#C59338';
                    strokeWidth = 1.3;
                  }

                  if (isLandmarkActive) {
                    // Selected active landmark province glows in imperial lacquer vermilion
                    fill = '#9B1D20';
                    stroke = '#DFB058';
                    strokeWidth = 2.2;
                  } else if (isHovered) {
                    fill = '#DFB058';
                    stroke = '#741416';
                    strokeWidth = 1.6;
                  }

                  return (
                    <path
                      key={prov.id}
                      d={prov.d}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className={`transition-colors duration-200 cursor-pointer ${
                        isLandmark ? 'landmark-province' : ''
                      }`}
                      onMouseEnter={() => {
                        setHoveredProvince(prov);
                        if (landmarkId) {
                          const match = MAP_LOCATIONS.find((l) => l.id === landmarkId);
                          if (match) setHoveredLocation(match);
                        } else {
                          const match = MAP_LOCATIONS.find((l) => l.region === prov.region);
                          if (match) setHoveredLocation(match);
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredProvince(null);
                        setHoveredLocation(null);
                      }}
                      onClick={() => {
                        if (landmarkId) {
                          const idx = MAP_LOCATIONS.findIndex((l) => l.id === landmarkId);
                          if (idx >= 0) handleSelectLocationIndex(idx);
                        } else {
                          onSelectRegion(prov.region);
                          const match = MAP_LOCATIONS.find((l) => l.region === prov.region);
                          if (match) {
                            const idx = MAP_LOCATIONS.findIndex((l) => l.id === match.id);
                            if (idx >= 0) handleSelectLocationIndex(idx);
                          }
                        }
                      }}
                    >
                      <title>{prov.name} ({prov.region})</title>
                    </path>
                  );
                })}
              </g>

              {/* National Sovereign Islands Group */}
              <g id="national-islands-layer">
                {/* Paracel Islands (Hoang Sa) */}
                <g className="cursor-pointer">
                  <path d="M 735 465 q 3 -2 6 0 q 2 4 -2 5 q -4 1 -4 -5 Z" fill="#C59338" />
                  <path d="M 748 458 q 4 -1 5 3 q 1 4 -3 3 q -3 -2 -2 -6 Z" fill="#C59338" />
                  <path d="M 755 472 q 2 -3 4 1 q 1 4 -3 3 Z" fill="#C59338" />
                  <path d="M 740 482 q 3 -1 4 2 q 0 3 -3 2 Z" fill="#C59338" />
                  <text
                    x="715"
                    y="445"
                    fill="#741416"
                    fontSize="9.5"
                    fontWeight="800"
                    fontFamily="sans-serif"
                    letterSpacing="0.1em"
                  >
                    Q.Đ HOÀNG SA
                  </text>
                  <text x="715" y="456" fill="#8C827A" fontSize="7.5" fontFamily="monospace">
                    16°30&apos;N 112°00&apos;E
                  </text>
                </g>

                {/* Spratly Islands (Truong Sa) */}
                <g className="cursor-pointer">
                  <path d="M 720 830 q 4 -2 6 2 q 0 4 -4 3 Z" fill="#C59338" />
                  <path d="M 735 842 q 3 -3 5 1 q 1 4 -3 3 Z" fill="#C59338" />
                  <path d="M 748 832 q 2 -2 4 1 q 0 3 -3 2 Z" fill="#C59338" />
                  <path d="M 732 858 q 3 -2 5 2 q -1 4 -4 2 Z" fill="#C59338" />
                  <text
                    x="690"
                    y="815"
                    fill="#741416"
                    fontSize="9.5"
                    fontWeight="800"
                    fontFamily="sans-serif"
                    letterSpacing="0.1em"
                  >
                    Q.Đ TRƯỜNG SA
                  </text>
                  <text x="690" y="826" fill="#8C827A" fontSize="7.5" fontFamily="monospace">
                    08°38&apos;N 111°55&apos;E
                  </text>
                </g>

                {/* Phu Quoc Island */}
                <g>
                  <text x="340" y="858" fill="#57534E" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                    Phú Quốc
                  </text>
                </g>

                {/* Con Dao Island */}
                <g>
                  <path d="M 563 918 q 3 -3 6 1 q 1 4 -4 3 Z" fill="#C59338" opacity="0.9" />
                  <text x="578" y="924" fill="#57534E" fontSize="8" fontWeight="600" fontFamily="sans-serif">
                    Côn Đảo
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Map Footer Stepper Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#F4EFE6] text-xs">
            <button
              onClick={handlePrevLocation}
              className="p-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E2D8C7] text-stone-700 transition-colors flex items-center gap-1.5 text-[11px] font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-[#C59338]" />
              <span>Điểm Trước</span>
            </button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {MAP_LOCATIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectLocationIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-6 bg-[#9B1D20]'
                      : 'w-1.5 bg-[#E2D8C7] hover:bg-[#C59338]'
                  }`}
                  aria-label={`Chọn điểm ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextLocation}
              className="p-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E2D8C7] text-stone-700 transition-colors flex items-center gap-1.5 text-[11px] font-semibold"
            >
              <span>Điểm Tiếp</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C59338]" />
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): High-Fashion Editorial Showcase Card */}
        <div
          onMouseEnter={() => setIsHoveringCard(true)}
          onMouseLeave={() => setIsHoveringCard(false)}
          className="lg:col-span-7 flex flex-col justify-between"
        >
          <div
            ref={cardContentRef}
            className="bg-white rounded-3xl border border-[#E2D8C7] overflow-hidden shadow-editorial hover:border-[#C59338]/80 transition-all duration-500 flex flex-col h-full justify-between"
          >
            {/* Top Media Banner - Click to View Fullscreen Gallery */}
            <div
              onClick={() => setIsGalleryModalOpen(true)}
              className="relative h-72 sm:h-80 overflow-hidden bg-stone-950 group cursor-pointer"
              title="Nhấp để mở bộ sưu tập ảnh đẹp"
            >
              <img
                key={`${activeLoc.id}-${currentShowcasePhoto.id}`}
                src={currentShowcasePhoto.url}
                alt={currentShowcasePhoto.title || activeLoc.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out brightness-95 animate-in fade-in duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" />

              {/* Bottom Overlay Title on Banner */}
              <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#DFB058]">
                    {renderIcon(activeLoc.iconType)}
                    <span>{activeLoc.provinceTitle} ({activeLoc.kmPost})</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-300">
                    {activeLoc.geoCoords}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                    {activeLoc.name}
                  </h3>
                  <span
                    key={currentShowcasePhoto.spotName}
                    className="text-xs font-serif text-[#DFB058] drop-shadow-sm truncate max-w-[200px] sm:max-w-xs animate-in fade-in duration-300"
                  >
                    {currentShowcasePhoto.spotName}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenic Photos Thumbnail Strip */}
            <div className="px-5 sm:px-6 py-2.5 bg-[#FAF7F2] border-b border-[#E2D8C7]/70 flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#9B1D20] shrink-0">
                <Images className="w-3.5 h-3.5 text-[#C59338]" />
                <span>Góc Cảnh:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                {activePhotos.map((photo, pIdx) => {
                  const isSelected = pIdx === selectedPhotoIndex;
                  return (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhotoIndex(pIdx)}
                      onMouseEnter={() => setSelectedPhotoIndex(pIdx)}
                      className={`relative w-12 sm:w-14 h-9 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        isSelected
                          ? 'border-[#9B1D20] scale-105 shadow-sm ring-2 ring-[#DFB058]/60'
                          : 'border-[#E2D8C7] opacity-65 hover:opacity-100'
                      }`}
                      title={photo.spotName}
                    >
                      <img
                        src={photo.url}
                        alt={photo.spotName}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F4EFE6] border border-[#E2D8C7] text-[#741416] text-[10px] font-bold tracking-wider shrink-0 transition-colors flex items-center gap-1"
              >
                <ZoomIn className="w-3 h-3 text-[#C59338]" />
                <span>Xem Toàn Cảnh</span>
              </button>
            </div>

            {/* Editorial Body Content */}
            <div className="p-5 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <p
                  key={currentShowcasePhoto.caption || activeLoc.subtitle}
                  className="text-xs sm:text-sm text-stone-700 font-sans leading-relaxed animate-in fade-in duration-300"
                >
                  {currentShowcasePhoto.caption || activeLoc.subtitle}
                </p>

                {/* Việt Phục Attire Recommendation Badge */}
                {currentShowcasePhoto.suitableAttire && (
                  <div
                    key={`attire-${currentShowcasePhoto.id}`}
                    className="p-3 rounded-2xl bg-gradient-to-r from-[#9B1D20]/10 via-[#DFB058]/10 to-transparent border border-[#DFB058]/35 flex items-center gap-2.5 animate-in fade-in duration-300"
                  >
                    <div className="p-1.5 rounded-xl bg-[#9B1D20] text-[#DFB058] shrink-0 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9B1D20] block">
                        Gợi Ý Chụp Việt Phục
                      </span>
                      <span className="text-xs font-semibold text-stone-800 line-clamp-1">
                        {currentShowcasePhoto.suitableAttire}
                      </span>
                    </div>
                  </div>
                )}

                {/* Material & Fabric Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E2D8C7]/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#9B1D20]">
                      <Scissors className="w-3.5 h-3.5 text-[#C59338]" />
                      <span>Chất Liệu Tiêu Biểu</span>
                    </div>
                    <div className="text-xs font-semibold text-stone-800">
                      {activeLoc.signatureFabric}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E2D8C7]/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#9B1D20]">
                      <Layers className="w-3.5 h-3.5 text-[#C59338]" />
                      <span>Quy Mô Bộ Sưu Tập</span>
                    </div>
                    <div className="text-xs font-semibold text-stone-800">
                      {regionalLookCount} bản phối sẵn sàng thưởng lãm
                    </div>
                  </div>
                </div>

                {/* Active Curated Look Preview */}
                {activeLook && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#C59338]/40 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#741416]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#DFB058]" />
                        <span>Bản Phối Tiêu Biểu: {activeLook.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 line-clamp-1">
                        {activeLook.tagline}
                      </p>
                    </div>

                    {onSelectLook && (
                      <button
                        onClick={() => onSelectLook(activeLook)}
                        className="p-2.5 rounded-xl bg-white hover:bg-[#F4EFE6] border border-[#E2D8C7] text-stone-800 transition-colors shrink-0"
                        title="Chi tiết bản phối"
                      >
                        <Eye className="w-4 h-4 text-[#741416]" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Strip */}
              <div className="pt-4 border-t border-[#F4EFE6] flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setIsGalleryModalOpen(true)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-[#F4EFE6] border border-[#C59338] text-[#741416] font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-xs"
                >
                  <Camera className="w-4 h-4 text-[#C59338]" />
                  <span>Xem Album Ảnh {activeLoc.name}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectRegion(activeLoc.region);
                    onScrollToGallery();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#111215] hover:bg-[#9B1D20] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2 shadow-silk"
                >
                  <span>Xem Lookbook {activeLoc.region}</span>
                  <ArrowRight className="w-4 h-4 text-[#DFB058]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Heritage Photo Lightbox Exhibition Modal */}
      <LandmarkPhotoGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        location={activeLoc}
        initialPhotoIndex={selectedPhotoIndex}
        onSelectRegionAndScroll={(reg) => {
          onSelectRegion(reg);
          onScrollToGallery();
        }}
      />
    </div>
  );
};
