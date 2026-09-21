import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Garment, ColorOption, StyleGenZ, Occasion, WeatherCondition } from '../../types/outfit';
import { ACCESSORIES } from '../../data/accessories';
import { GeminiService } from '../../services/geminiService';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Eye, Image as ImageIcon, Wand2, Download, Maximize2, RotateCw } from 'lucide-react';

interface OutfitMannequinProps {
  garment: Garment;
  color: ColorOption;
  style: StyleGenZ;
  accessoryIds: string[];
  gender?: 'female' | 'male';
  onToggleGender?: (gender: 'female' | 'male') => void;
  occasion?: Occasion;
  weather?: WeatherCondition;
  aiImageUrl?: string;
  onAiImageGenerated?: (imageUrl: string, promptUsed: string) => void;
  onOpenKeyModal?: () => void;
}

export const OutfitMannequin: React.FC<OutfitMannequinProps> = ({
  garment,
  color,
  style,
  accessoryIds,
  gender = 'female',
  onToggleGender,
  occasion,
  weather,
  aiImageUrl,
  onAiImageGenerated,
  onOpenKeyModal
}) => {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'avatar' | 'photo' | 'ai'>('avatar');
  const [photoError, setPhotoError] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // AI Generation State
  const [currentAiImage, setCurrentAiImage] = useState<string | undefined>(aiImageUrl);
  const [prevPropAiImage, setPrevPropAiImage] = useState<string | undefined>(aiImageUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (aiImageUrl !== prevPropAiImage) {
    setPrevPropAiImage(aiImageUrl);
    setCurrentAiImage(aiImageUrl);
  }

  const currentGender = gender;
  const isMale = currentGender === 'male';

  const handleGenderChange = (newGender: 'female' | 'male') => {
    if (onToggleGender) onToggleGender(newGender);
  };

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    setViewMode('ai');
    setGenerationStep('Đang chuẩn bị thông số Việt phục di sản...');

    try {
      const selectedAccNames = ACCESSORIES.filter((a) => accessoryIds.includes(a.id)).map((a) => a.name);
      const prompt = GeminiService.buildHeritageFashionPrompt({
        garment,
        color,
        occasion: occasion || { id: 'thuong-ngay', name: 'Dạo phố & Thường nhật', description: 'Phong cách trẻ trung dạo phố', tag: 'Thường nhật', icon: '', recommendedGarments: [], recommendedStyles: [] },
        style,
        accessoryNames: selectedAccNames,
        gender: currentGender,
        weather
      });

      setGenerationStep('Gemini Imagen 3 đang kết xuất người mẫu thời trang...');
      const result = await GeminiService.generateOutfitImage(prompt);

      if (result.success && result.imageUrl) {
        setCurrentAiImage(result.imageUrl);
        if (onAiImageGenerated) {
          onAiImageGenerated(result.imageUrl, prompt);
        }
        showToast({
          type: 'success',
          title: 'Tạo ảnh Gemini thành công!',
          message: `Đã kết xuất ảnh người mẫu ${garment.name} phong cách ${style.name} (${currentGender === 'male' ? 'Nam' : 'Nữ'}).`
        });
      } else {
        if (result.error && result.error.includes('Chưa cấu hình GEMINI_API_KEY')) {
          if (onOpenKeyModal) onOpenKeyModal();
          showToast({
            type: 'warning',
            title: 'Cần cấu hình API Key',
            message: 'Vui lòng nhập API Key Gemini để sử dụng tính năng tạo ảnh AI.'
          });
        } else {
          showToast({
            type: 'error',
            title: 'Không thể tạo ảnh',
            message: result.error || 'Có lỗi xảy ra khi tạo ảnh với Gemini.'
          });
        }
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Lỗi phát sinh',
        message: err.message || 'Lỗi không xác định.'
      });
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleDownloadAiImage = () => {
    if (!currentAiImage) return;
    const link = document.createElement('a');
    link.href = currentAiImage;
    link.download = `viet-phuc-remix-ai-${garment.id}-${currentGender}-${Date.now()}.jpg`;
    link.click();
    showToast({
      type: 'success',
      title: 'Đã tải ảnh AI',
      message: 'Hình ảnh người mẫu thời trang đã được tải về thiết bị của bạn.'
    });
  };

  // Checks for specific accessories
  const hasKhanDong = accessoryIds.includes('khan-dong');
  const hasNonQuaiThao = accessoryIds.includes('non-quai-thao');
  const hasTramCai = accessoryIds.includes('tram-cai-toc');
  const hasKiengBac = accessoryIds.includes('kieng-bac');
  const hasKinhY2K = accessoryIds.includes('kinh-mat-y2k');
  const hasSneaker = accessoryIds.includes('sneaker-chunky');
  const hasBoots = accessoryIds.includes('boots-da');
  const hasGuocMoc = accessoryIds.includes('guoc-moc');
  const hasTuiCoi = accessoryIds.includes('tui-coi-theu');
  const hasTote = accessoryIds.includes('tote-typography');
  const hasQuatLua = accessoryIds.includes('quat-lua-xep');
  const hasBlazer = accessoryIds.includes('blazer-oversize');
  const hasKhanRan = accessoryIds.includes('khan-ran-nam-bo');
  const hasNgocTrai = accessoryIds.includes('ngoc-trai-layer');

  return (
    <div className="relative w-full h-[450px] sm:h-[500px] bg-gradient-to-b from-stone-100 via-stone-50 to-amber-50/50 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-heritage-border/70 shadow-inner group select-none">
      {/* Background Ambience & Soft Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl -top-12 -right-12 transition-colors duration-700"
          style={{ backgroundColor: `${color.hex}30` }}
        />
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl -bottom-12 -left-12 transition-colors duration-700"
          style={{ backgroundColor: `${color.secondaryHex}25` }}
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 subtle-grid opacity-25" />
      </div>

      {/* Top Header Overlay: Tags (Left) and Gender Toggle + AI Button (Right) */}
      <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-20 flex justify-between items-start gap-2.5 pointer-events-none">
        {/* Style & Color floating tags */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md border border-heritage-border/80 text-heritage-charcoal shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full shadow-xs ring-1 ring-black/10" style={{ backgroundColor: color.hex }} />
            {color.vietnameseName}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-heritage-red/10 text-heritage-red border border-heritage-red/20 w-fit backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            {style.name}
          </span>
        </div>

        {/* Right Controls: Quick AI Button + Gender Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleGenerateAi}
            disabled={isGenerating}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-[#9B1D20] via-rose-600 to-amber-600 hover:opacity-95 text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Tạo ảnh người mẫu thực tế bằng Gemini Imagen 3"
          >
            <Wand2 className="w-3 h-3 text-amber-200 animate-pulse" />
            <span>{isGenerating ? 'Đang tạo...' : 'Tạo ảnh AI'}</span>
          </button>

          {/* Gender Toggle Pill */}
          <div className="flex bg-white/95 backdrop-blur-md rounded-full p-1 border border-stone-200 shadow-sm text-xs font-semibold">
            <button
              onClick={() => handleGenderChange('female')}
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all flex items-center gap-1 text-[11px] ${
                !isMale
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Xem trên vóc dáng Nữ"
            >
              <span>Nữ ♀</span>
            </button>
            <button
              onClick={() => handleGenderChange('male')}
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all flex items-center gap-1 text-[11px] ${
                isMale
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Xem trên vóc dáng Nam"
            >
              <span>Nam ♂</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Right: View Switcher Button Pill (Editorial Croquis / Ảnh Mẫu / Ảnh AI) */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex bg-white/90 backdrop-blur-md rounded-full p-1 border border-stone-200 shadow-md text-xs font-medium">
        <button
          onClick={() => setViewMode('avatar')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            viewMode === 'avatar'
              ? 'bg-heritage-charcoal text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Editorial Croquis</span>
          <span className="sm:hidden">SVG</span>
        </button>
        <button
          onClick={() => setViewMode('photo')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            viewMode === 'photo'
              ? 'bg-heritage-charcoal text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Ảnh Mẫu</span>
        </button>
        <button
          onClick={() => setViewMode('ai')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            viewMode === 'ai'
              ? 'bg-gradient-to-r from-[#9B1D20] to-amber-600 text-white shadow-sm font-semibold'
              : 'text-rose-700 hover:text-rose-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Ảnh AI</span>
          {currentAiImage && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
        </button>
      </div>

      {/* Floating Hover Badge (Interactive Item Inspector) */}
      {hoveredItem && (
        <div className="absolute bottom-3 px-3.5 py-1.5 bg-stone-900/90 backdrop-blur-md text-amber-200 text-xs rounded-full border border-amber-500/40 shadow-xl pointer-events-none transition-all animate-in fade-in zoom-in-95 flex items-center gap-2 z-30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-medium tracking-wide">{hoveredItem}</span>
        </div>
      )}

      {/* MODE 1: High-Fashion Editorial Croquis (Interactive Layered SVG) */}
      {viewMode === 'avatar' ? (
        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
          <svg
            viewBox="0 0 320 440"
            className="h-full w-auto max-h-[415px] drop-shadow-2xl transition-all duration-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Garment Primary Linear Gradient — gentle fade preserving fabric color */}
              <linearGradient id="garmentGrad" x1="0.3" y1="0" x2="0.7" y2="1">
                <stop offset="0%" stopColor={color.hex} />
                <stop offset="75%" stopColor={color.hex} />
                <stop offset="100%" stopColor={color.secondaryHex} />
              </linearGradient>

              {/* Garment Shadow Tone — subtle depth without harsh black */}
              <linearGradient id="garmentShadowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color.secondaryHex} stopOpacity="0.65" />
                <stop offset="100%" stopColor={color.secondaryHex} stopOpacity="0.25" />
              </linearGradient>

              {/* Vertical silk reflection shimmer */}
              <linearGradient id="silkShimmer" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.0" />
                <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.28" />
                <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>

              {/* Horizontal silk sheen — soft band of light across the fabric */}
              <linearGradient id="silkHorizontalSheen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.0" />
                <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.18" />
                <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>

              {/* Imperial Royal Gold Trim */}
              <linearGradient id="goldTrim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F9E2A8" />
                <stop offset="35%" stopColor="#DFB058" />
                <stop offset="70%" stopColor="#C59338" />
                <stop offset="100%" stopColor="#875E14" />
              </linearGradient>

              {/* Specular Silver Trim & Torque Metal */}
              <linearGradient id="silverGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#E2E8F0" />
                <stop offset="70%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              {/* 3D Pearl Sphere Radial Gradient */}
              <radialGradient id="pearlShine" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FBF7F0" />
                <stop offset="75%" stopColor="#E5DFD5" />
                <stop offset="100%" stopColor="#B3AAA0" />
              </radialGradient>

              {/* Wooden Clog Gradient */}
              <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B07D3E" />
                <stop offset="50%" stopColor="#87531E" />
                <stop offset="100%" stopColor="#4F2E0D" />
              </linearGradient>

              {/* Cyber Y2K Glass Gradient */}
              <linearGradient id="cyberGlassGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.85" />
              </linearGradient>

              {/* Khăn Rằn Nam Bộ Checkered Pattern */}
              <pattern id="khanRanPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                <rect width="3" height="3" fill="#18181B" />
                <rect x="3" width="3" height="3" fill="#F4F4F5" />
                <rect y="3" width="3" height="3" fill="#F4F4F5" />
                <rect x="3" y="3" width="3" height="3" fill="#27272A" />
              </pattern>

              {/* Woven Straw Pattern for Nón Quai Thao & Túi Cói */}
              <pattern id="wovenStraw" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" fill="#E6D3B1" />
                <path d="M0 2 L4 2 M2 0 L2 4" stroke="#C9B187" strokeWidth="0.8" />
              </pattern>

              {/* Soft Drop Shadow Filter for Layering */}
              <filter id="croquisShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Mannequin Base Shadow */}
            <ellipse cx="160" cy="418" rx="68" ry="7" fill="#1C1917" fillOpacity="0.14" />
            <ellipse cx="160" cy="418" rx="42" ry="4" fill="#1C1917" fillOpacity="0.1" />

            {/* ======================================================== */}
            {/* LAYER 1: UNDERGARMENTS, LEGS & FOOTWEAR                 */}
            {/* ======================================================== */}

            {/* Pants / Trousers / Lower Silhouette */}
            <g
              id="croquis-legs"
              onMouseEnter={() => setHoveredItem(garment.id === 'ao-ba-ba' ? 'Quần lụa đen bóng' : 'Quần lụa suông bạch ngọc')}
              onMouseLeave={() => setHoveredItem(null)}
              className="cursor-pointer transition-opacity hover:opacity-95"
            >
              {garment.id === 'ao-ba-ba' ? (
                /* Áo Bà Ba: Quần lụa đen óng ả miền Nam */
                <>
                  {/* Left Leg */}
                  <path
                    d={isMale
                      ? "M144 230 L138 384 Q146 388 152 385 L157 230 Z"
                      : "M145 225 L140 384 Q146 388 152 385 L156 225 Z"}
                    fill="#1F242D"
                    stroke="#0F1318"
                    strokeWidth="0.8"
                  />
                  <path d="M142 245 L142 375" stroke="#333D4B" strokeWidth="0.6" strokeDasharray="4 2" />
                  {/* Right Leg */}
                  <path
                    d={isMale
                      ? "M163 230 L168 385 Q174 388 182 384 L176 230 Z"
                      : "M164 225 L168 385 Q174 388 180 384 L175 225 Z"}
                    fill="#1F242D"
                    stroke="#0F1318"
                    strokeWidth="0.8"
                  />
                  <path d="M174 245 L176 375" stroke="#333D4B" strokeWidth="0.6" strokeDasharray="4 2" />
                </>
              ) : garment.id === 'ao-tu-than' ? (
                /* Áo Tứ Thân: Chân váy đụp/quần lĩnh đen Bắc Bộ nhiều tầng */
                <>
                  <path
                    d="M138 180 L126 385 Q160 395 194 385 L182 180 Z"
                    fill="#1A181B"
                    stroke="#0B090C"
                    strokeWidth="0.8"
                  />
                  {/* Soft vertical pleated folds */}
                  <path d="M144 195 Q140 290 138 384" stroke="#2D2B30" strokeWidth="1" />
                  <path d="M152 195 Q150 290 148 386" stroke="#2D2B30" strokeWidth="1" />
                  <path d="M168 195 Q170 290 172 386" stroke="#2D2B30" strokeWidth="1" />
                  <path d="M176 195 Q180 290 182 384" stroke="#2D2B30" strokeWidth="1" />
                </>
              ) : (
                /* Áo Dài, Ngũ Thân, Nhật Bình: Quần lụa trắng ngà ống suông mềm mại */
                <>
                  {/* Left Leg Flowing Silk Pant */}
                  <path
                    d={isMale
                      ? "M143 170 L134 384 Q144 389 153 386 L158 170 Z"
                      : "M144 165 L132 384 Q142 389 152 386 L157 165 Z"}
                    fill="#FDFBF7"
                    stroke="#E5DEC9"
                    strokeWidth="0.8"
                  />
                  <path d="M140 180 L138 380" stroke="#EFE6D5" strokeWidth="1.2" />
                  <path d="M148 190 L146 382" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Right Leg Flowing Silk Pant */}
                  <path
                    d={isMale
                      ? "M162 170 L167 386 Q176 389 186 384 L177 170 Z"
                      : "M163 165 L168 386 Q178 389 188 384 L176 165 Z"}
                    fill="#FDFBF7"
                    stroke="#E5DEC9"
                    strokeWidth="0.8"
                  />
                  <path d="M180 180 L182 380" stroke="#EFE6D5" strokeWidth="1.2" />
                  <path d="M172 190 L174 382" stroke="#FFFFFF" strokeWidth="1.5" />
                </>
              )}
            </g>

            {/* Footwear Options with Rich Detailing */}
            <g id="croquis-shoes">
              {hasSneaker ? (
                /* Modern Chunky Runway Platform Sneakers */
                <g
                  id="sneakers-deluxe"
                  onMouseEnter={() => setHoveredItem('Sneaker Trắng Chunky')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]"
                >
                  {/* Left Sneaker */}
                  <path d="M129 388 Q135 383 148 384 L154 389 L154 403 L127 403 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
                  {/* Sculpted Multi-layer Lug Sole */}
                  <path d="M125 398 L156 398 L156 405 Q140 407 125 405 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
                  <path d="M127 402 L131 405 M135 402 L139 405 M143 402 L147 405 M151 402 L155 405" stroke="#64748B" strokeWidth="1" />
                  {/* Sneaker dynamic accent stripe */}
                  <path d="M133 391 Q141 388 149 392" stroke={color.hex} strokeWidth="2.5" strokeLinecap="round" />
                  {/* Laces */}
                  <line x1="139" y1="387" x2="145" y2="387" stroke="#94A3B8" strokeWidth="1.2" />
                  <line x1="140" y1="390" x2="146" y2="390" stroke="#94A3B8" strokeWidth="1.2" />

                  {/* Right Sneaker */}
                  <path d="M166 389 L172 384 Q185 383 191 388 L193 403 L166 403 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
                  {/* Sculpted Multi-layer Lug Sole */}
                  <path d="M164 398 L195 398 L195 405 Q180 407 164 405 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
                  <path d="M167 402 L171 405 M175 402 L179 405 M183 402 L187 405 M191 402 L195 405" stroke="#64748B" strokeWidth="1" />
                  {/* Sneaker dynamic accent stripe */}
                  <path d="M171 392 Q179 388 187 391" stroke={color.hex} strokeWidth="2.5" strokeLinecap="round" />
                  {/* Laces */}
                  <line x1="174" y1="387" x2="180" y2="387" stroke="#94A3B8" strokeWidth="1.2" />
                  <line x1="175" y1="390" x2="181" y2="390" stroke="#94A3B8" strokeWidth="1.2" />
                </g>
              ) : hasBoots ? (
                /* High-Fashion Square-Toe Polished Leather Ankle Boots */
                <g
                  id="boots-deluxe"
                  onMouseEnter={() => setHoveredItem('Boots Da Cổ Thấp Mũi Vuông')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_6px_rgba(223,176,88,0.6)]"
                >
                  {/* Left Boot */}
                  <path d="M136 360 L133 400 L154 400 L154 360 Z" fill="#18181B" stroke="#09090B" strokeWidth="0.8" />
                  {/* Square toe front welt */}
                  <rect x="130" y="398" width="25" height="6" rx="1.5" fill="#09090B" />
                  {/* Patent Leather Highlight Streak */}
                  <path d="M141 364 L139 397" stroke="#52525B" strokeWidth="1.2" strokeLinecap="round" />
                  {/* Block heel */}
                  <rect x="148" y="401" width="6" height="5" fill="#27272A" />

                  {/* Right Boot */}
                  <path d="M166 360 L166 400 L187 400 L184 360 Z" fill="#18181B" stroke="#09090B" strokeWidth="0.8" />
                  {/* Square toe front welt */}
                  <rect x="165" y="398" width="25" height="6" rx="1.5" fill="#09090B" />
                  {/* Patent Leather Highlight Streak */}
                  <path d="M179 364 L181 397" stroke="#52525B" strokeWidth="1.2" strokeLinecap="round" />
                  {/* Block heel */}
                  <rect x="166" y="401" width="6" height="5" fill="#27272A" />
                </g>
              ) : hasGuocMoc ? (
                /* Traditional Sculpted Wooden Clogs (Guốc Mộc Sơn Mài) */
                <g
                  id="guoc-moc-deluxe"
                  onMouseEnter={() => setHoveredItem('Guốc Mộc Sơn Mài')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_6px_rgba(217,119,6,0.6)]"
                >
                  {/* Left Guốc */}
                  <path
                    d="M134 397 Q144 394 154 396 L153 403 Q144 406 135 403 Z"
                    fill="url(#woodGrad)"
                    stroke="#5C3814"
                    strokeWidth="0.8"
                  />
                  {/* Velvet embroidered strap */}
                  <path d="M137 394 Q144 388 151 394" stroke={color.hex} strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M140 393 Q144 390 148 393" stroke="url(#goldTrim)" strokeWidth="1" fill="none" />
                  {/* Wooden heel elevation */}
                  <rect x="146" y="401" width="6" height="4" rx="1" fill="#45270B" />

                  {/* Right Guốc */}
                  <path
                    d="M166 396 Q176 394 186 397 L185 403 Q176 406 167 403 Z"
                    fill="url(#woodGrad)"
                    stroke="#5C3814"
                    strokeWidth="0.8"
                  />
                  {/* Velvet embroidered strap */}
                  <path d="M169 394 Q176 388 183 394" stroke={color.hex} strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M172 393 Q176 390 180 393" stroke="url(#goldTrim)" strokeWidth="1" fill="none" />
                  {/* Wooden heel elevation */}
                  <rect x="168" y="401" width="6" height="4" rx="1" fill="#45270B" />
                </g>
              ) : (
                /* Default Elegant Slip-On Loafers */
                <g id="minimal-loafers">
                  {/* Left Loafer */}
                  <path d="M132 394 Q140 390 152 393 L153 398 Q152 403 150 404 L134 404 Q131 403 130 398 Z" fill="#1C1917" />
                  <path d="M136 396 Q143 393 149 396" stroke="#44403C" strokeWidth="0.8" fill="none" />
                  <rect x="130" y="402" width="24" height="4" rx="1" fill="#0C0A09" />

                  {/* Right Loafer */}
                  <path d="M168 393 Q180 390 188 394 L190 398 Q189 403 186 404 L170 404 Q167 403 167 398 Z" fill="#1C1917" />
                  <path d="M171 396 Q178 393 185 396" stroke="#44403C" strokeWidth="0.8" fill="none" />
                  <rect x="166" y="402" width="24" height="4" rx="1" fill="#0C0A09" />
                </g>
              )}
            </g>

            {/* ======================================================== */}
            {/* LAYER 2: PRIMARY GARMENT SILHOUETTES                    */}
            {/* ======================================================== */}

            {/* --- 1. ÁO DÀI (FLOWING COUTURE CROQUIS) --- */}
            {garment.id === 'ao-dai' && (
              <g
                id="garment-ao-dai-deluxe"
                onMouseEnter={() => setHoveredItem('Áo Dài Truyền Thống')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group"
              >
                {/* Back flap (Tà sau) providing depth and wind flow */}
                <path
                  d={isMale
                    ? "M130 175 L120 375 Q160 385 200 375 L190 175 Z"
                    : "M134 165 L118 375 Q160 388 202 375 L186 165 Z"}
                  fill="url(#garmentShadowGrad)"
                  opacity="0.88"
                />

                {/* Front flowing flap (Tà trước mềm mại ôm eo lượn sóng) */}
                <path
                  d={isMale
                    ? "M136 100 L126 368 Q160 380 194 368 L184 100 Q160 102 136 100 Z"
                    : "M138 98 Q132 145 136 165 L124 370 Q160 382 196 370 L184 165 Q188 145 182 98 Q160 102 138 98 Z"}
                  fill="url(#garmentGrad)"
                  stroke="url(#goldTrim)"
                  strokeWidth="0.6"
                  filter="url(#croquisShadow)"
                />

                {/* Silk Sheen & Vertical Flow Creases */}
                <path
                  d={isMale
                    ? "M146 112 L138 365 Q152 372 162 370 L158 112 Z"
                    : "M146 106 Q141 148 143 168 L136 366 Q150 373 162 370 L158 106 Z"}
                  fill="url(#silkShimmer)"
                />
                {/* Dynamic Waist Slit (Đường xẻ tà eo thon) */}
                <path
                  d={isMale ? "M133 165 L126 260" : "M136 152 L128 260"}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                />
                <path
                  d={isMale ? "M187 165 L194 260" : "M184 152 L192 260"}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                />
                {/* Golden hemline piping */}
                <path
                  d={isMale ? "M126 368 Q160 380 194 368" : "M124 370 Q160 382 196 370"}
                  stroke="url(#goldTrim)"
                  strokeWidth="1.2"
                  fill="none"
                />
                {/* Horizontal silk sheen band across mid-body */}
                <path
                  d={isMale
                    ? "M132 160 L188 160 L192 260 L128 260 Z"
                    : "M130 155 L190 155 L194 260 L126 260 Z"}
                  fill="url(#silkHorizontalSheen)"
                />
                {/* Natural fabric fold creases — gentle Bézier curves */}
                <path
                  d={isMale ? "M148 140 Q146 220 144 360" : "M148 135 Q144 220 140 365"}
                  stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.12" fill="none"
                />
                <path
                  d={isMale ? "M172 140 Q174 220 176 360" : "M172 135 Q176 220 180 365"}
                  stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.12" fill="none"
                />
                <path
                  d={isMale ? "M156 150 Q154 250 152 365" : "M156 145 Q152 250 148 370"}
                  stroke="#000000" strokeWidth="0.8" strokeOpacity="0.06" fill="none"
                />
              </g>
            )}

            {/* --- 2. ÁO TỨ THÂN (AUTHENTIC KINH BẮC 4-PANEL) --- */}
            {garment.id === 'ao-tu-than' && (
              <g
                id="garment-ao-tu-than-deluxe"
                onMouseEnter={() => setHoveredItem('Áo Tứ Thân Kinh Bắc')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group"
              >
                {/* Inner Yếm Đào (Lotus Pink / Scarlet Halter Camisole) */}
                <path
                  d="M148 88 L172 88 L180 168 L140 168 Z"
                  fill="#D94067"
                  stroke="#B02549"
                  strokeWidth="0.8"
                />
                {/* Yếm neck strings */}
                <path d="M152 88 L152 74 M168 88 L168 74" stroke="#FDE2E4" strokeWidth="1" />
                {/* Delicate floral embroidery on yếm */}
                <circle cx="160" cy="120" r="3" fill="#FFEAA7" />
                <circle cx="156" cy="122" r="1.8" fill="#FFFFFF" />
                <circle cx="164" cy="122" r="1.8" fill="#FFFFFF" />

                {/* Back 2 flaps (Hai tà sau buông dài thẳng tắp) */}
                <path
                  d="M126 100 L112 360 L142 362 L145 100 Z"
                  fill="url(#garmentShadowGrad)"
                  opacity="0.9"
                />
                <path
                  d="M194 100 L208 360 L178 362 L175 100 Z"
                  fill="url(#garmentShadowGrad)"
                  opacity="0.9"
                />

                {/* Front 2 Flaps tied into a knot at belly (Hai vạt trước buộc nơ duyên dáng) */}
                <path
                  d="M132 98 L122 178 L150 184 L146 98 Z"
                  fill="url(#garmentGrad)"
                  stroke="url(#goldTrim)"
                  strokeWidth="0.5"
                />
                <path
                  d="M188 98 L198 178 L170 184 L174 98 Z"
                  fill="url(#garmentGrad)"
                  stroke="url(#goldTrim)"
                  strokeWidth="0.5"
                />

                {/* Wide Silk Waistband Sash (Dải Thắt Lưng Bao / Ruột Tượng xanh & hồng) */}
                <rect x="140" y="168" width="40" height="12" rx="3" fill="#15803D" />
                <line x1="140" y1="174" x2="180" y2="174" stroke="#4ADE80" strokeWidth="1" strokeDasharray="3 2" />

                {/* Tied knot bow in center */}
                <ellipse cx="160" cy="180" rx="8" ry="6" fill="#B91C1C" stroke="url(#goldTrim)" strokeWidth="1" />
                <circle cx="160" cy="180" r="2.5" fill="#FEF08A" />

                {/* Flowing Ribbon Ends (Dải lụa bay lượn trước bụng) */}
                {/* Green Silk Ribbon */}
                <path
                  d="M157 185 Q145 225 142 278 Q147 282 152 276 Q153 228 160 185 Z"
                  fill="#15803D"
                  stroke="#166534"
                  strokeWidth="0.6"
                />
                {/* Rose Pink Silk Ribbon */}
                <path
                  d="M163 185 Q175 225 178 278 Q173 282 168 276 Q167 228 160 185 Z"
                  fill="#E11D48"
                  stroke="#9F1239"
                  strokeWidth="0.6"
                />
                {/* Outer front flap cascade */}
                <path
                  d="M152 184 Q142 230 134 260 L142 262 Q150 228 156 186 Z"
                  fill="url(#garmentGrad)"
                  opacity="0.8"
                />
                <path
                  d="M168 184 Q178 230 186 260 L178 262 Q170 228 164 186 Z"
                  fill="url(#garmentGrad)"
                  opacity="0.8"
                />
                {/* Back panels fabric fold creases */}
                <path d="M134 110 Q128 230 126 360" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.1" fill="none" />
                <path d="M186 110 Q192 230 194 360" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.1" fill="none" />
                {/* Horizontal silk sheen on upper panels */}
                <path d="M124 105 L196 105 L194 165 L126 165 Z" fill="url(#silkHorizontalSheen)" />
              </g>
            )}

            {/* --- 3. ÁO NGŨ THÂN (STATELY 5-PANEL NGUYEN DYNASTY) --- */}
            {garment.id === 'ao-ngu-than' && (
              <g
                id="garment-ao-ngu-than-deluxe"
                onMouseEnter={() => setHoveredItem('Áo Ngũ Thân Lập Lĩnh')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group"
              >
                {/* Main 5-panel silhouette: Dignified, relaxed structured drape */}
                <path
                  d={isMale
                    ? "M124 96 L112 346 Q160 358 208 346 L196 96 Q160 108 124 96 Z"
                    : "M128 96 L116 348 Q160 358 204 348 L192 96 Q160 108 128 96 Z"}
                  fill="url(#garmentGrad)"
                  stroke="url(#goldTrim)"
                  strokeWidth="0.8"
                  filter="url(#croquisShadow)"
                />

                {/* Silk sheen highlight along spine and chest */}
                <path
                  d="M140 105 L132 342 Q150 350 156 348 L152 105 Z"
                  fill="url(#silkShimmer)"
                />

                {/* Lap-Linh Front Diagonal Opening — Shadow band showing fabric overlap depth */}
                <path
                  d="M160 92 Q174 110 186 130 L186 210 Q172 282 160 355 L156 350 Q168 278 182 208 L182 128 Q170 108 158 92 Z"
                  fill="#000000"
                  fillOpacity="0.12"
                />
                {/* Top edge highlight — creates raised fabric illusion */}
                <path
                  d="M158 92 Q170 108 182 126 L182 210 Q168 280 156 350"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeOpacity="0.35"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Gold trim along diagonal fold */}
                <path
                  d="M160 92 Q174 110 186 130 L186 210 Q172 282 160 355"
                  stroke="url(#goldTrim)"
                  strokeWidth="1.5"
                  fill="none"
                />

                {/* Five Signature Brass/Jade Buttons (Khuy Ngũ Thường đại diện Ngũ Thường) */}
                {/* Button 1: Collar */}
                <circle cx="162" cy="94" r="3" fill="url(#goldTrim)" stroke="#6B4D10" strokeWidth="0.7" />
                <circle cx="161.2" cy="93.2" r="1" fill="#FFFBEB" />
                {/* Button 2: Collarbone */}
                <circle cx="173" cy="108" r="3" fill="url(#goldTrim)" stroke="#6B4D10" strokeWidth="0.7" />
                <circle cx="172.2" cy="107.2" r="1" fill="#FFFBEB" />
                {/* Button 3: Armpit / Upper chest */}
                <circle cx="184" cy="126" r="3" fill="url(#goldTrim)" stroke="#6B4D10" strokeWidth="0.7" />
                <circle cx="183.2" cy="125.2" r="1" fill="#FFFBEB" />
                {/* Button 4: Rib */}
                <circle cx="184" cy="156" r="3" fill="url(#goldTrim)" stroke="#6B4D10" strokeWidth="0.7" />
                <circle cx="183.2" cy="155.2" r="1" fill="#FFFBEB" />
                {/* Button 5: Waist */}
                <circle cx="182" cy="188" r="3" fill="url(#goldTrim)" stroke="#6B4D10" strokeWidth="0.7" />
                <circle cx="181.2" cy="187.2" r="1" fill="#FFFBEB" />

                {/* Horizontal silk sheen band */}
                <path
                  d={isMale
                    ? "M118 150 L202 150 L206 260 L114 260 Z"
                    : "M122 150 L198 150 L202 260 L118 260 Z"}
                  fill="url(#silkHorizontalSheen)"
                />

                {/* Vertical fabric fold creases */}
                <path d="M140 110 Q138 220 136 345" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.1" fill="none" />
                <path d="M150 115 Q148 230 146 348" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.06" fill="none" />
                <path d="M195 110 Q197 220 198 345" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.08" fill="none" />

                {/* Subtle side slit vents */}
                <line x1="116" y1="260" x2="114" y2="345" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.3" />
                <line x1="204" y1="260" x2="206" y2="345" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.3" />
              </g>
            )}

            {/* --- 4. ÁO NHẬT BÌNH (IMPERIAL COURT ROBE WITH ĐỐI KHÂM) --- */}
            {garment.id === 'nhat-binh' && (
              <g
                id="garment-nhat-binh-deluxe"
                onMouseEnter={() => setHoveredItem('Áo Nhật Bình Hoàng Cung')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group"
              >
                {/* Imperial Robe Main Body */}
                <path
                  d="M118 96 L106 358 Q160 370 214 358 L202 96 Q160 110 118 96 Z"
                  fill="url(#garmentGrad)"
                  stroke="url(#goldTrim)"
                  strokeWidth="0.8"
                  filter="url(#croquisShadow)"
                />

                {/* Signature Rectangular Collar (Cổ Đối Khâm to bản trước ngực) */}
                <rect x="144" y="90" width="32" height="120" rx="3" fill="url(#goldTrim)" stroke="#875E14" strokeWidth="1" />
                <rect x="148" y="94" width="24" height="112" rx="2" fill="#991B1B" />

                {/* Imperial Phoenix / Lotus gold embroidery inside Đối Khâm */}
                <line x1="160" y1="90" x2="160" y2="214" stroke="url(#goldTrim)" strokeWidth="1.5" />
                <circle cx="160" cy="115" r="2.5" fill="#FEF08A" />
                <circle cx="160" cy="140" r="2.5" fill="#FEF08A" />
                <circle cx="160" cy="165" r="2.5" fill="#FEF08A" />
                <circle cx="160" cy="190" r="2.5" fill="#FEF08A" />

                {/* Signature Emerald/Gold Gem Button fastening at chest */}
                <circle cx="160" cy="145" r="5" fill="#047857" stroke="url(#goldTrim)" strokeWidth="1.5" />
                <circle cx="158.5" cy="143.5" r="1.5" fill="#A7F3D0" />

                {/* Bottom Hemline: Thủy Ba Sóng Nước (Imperial Wave Motifs) */}
                <path
                  d="M107 348 Q118 340 128 348 Q139 340 149 348 Q160 340 171 348 Q181 340 192 348 Q202 340 213 348"
                  stroke="url(#goldTrim)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M106 354 Q118 346 128 354 Q139 346 149 354 Q160 346 171 354 Q181 346 192 354 Q202 346 213 354"
                  stroke="#FEF08A"
                  strokeWidth="1"
                  fill="none"
                />
                {/* Horizontal silk sheen band */}
                <path d="M112 150 L208 150 L212 260 L108 260 Z" fill="url(#silkHorizontalSheen)" />
                {/* Vertical fabric fold creases */}
                <path d="M132 110 Q130 220 128 355" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.1" fill="none" />
                <path d="M188 110 Q190 220 192 355" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.1" fill="none" />
                <path d="M140 120 Q138 240 136 356" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.05" fill="none" />
              </g>
            )}

            {/* --- 5. ÁO BÀ BA (SOUTHERN CHARM WITH 2 POCKETS) --- */}
            {garment.id === 'ao-ba-ba' && (
              <g
                id="garment-ao-ba-ba-deluxe"
                onMouseEnter={() => setHoveredItem('Áo Bà Ba Nam Bộ')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group"
              >
                {/* Short top ending gracefully at hips */}
                <path
                  d={isMale
                    ? "M128 96 L120 248 Q160 256 200 248 L192 96 Q160 106 128 96 Z"
                    : "M130 96 Q122 150 124 246 Q160 256 196 246 Q198 150 190 96 Q160 106 130 96 Z"}
                  fill="url(#garmentGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="0.6"
                  strokeOpacity="0.4"
                  filter="url(#croquisShadow)"
                />

                {/* Silk sheen reflection */}
                <path
                  d="M142 108 L136 242 Q150 248 156 246 L150 108 Z"
                  fill="url(#silkShimmer)"
                />

                {/* Iconic Side Slits at hips (Xẻ tà hông duyên dáng) */}
                <line x1="124" y1="215" x2="120" y2="248" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
                <line x1="196" y1="215" x2="200" y2="248" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />

                {/* Center Front Button Placket (Nẹp khuy áo giữa ngực) */}
                <line x1="160" y1="102" x2="160" y2="252" stroke="#000000" strokeWidth="1" strokeOpacity="0.25" />
                {/* Pearl/Enamel Buttons */}
                <circle cx="160" cy="116" r="2.6" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="0.8" />
                <circle cx="160" cy="140" r="2.6" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="0.8" />
                <circle cx="160" cy="164" r="2.6" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="0.8" />
                <circle cx="160" cy="188" r="2.6" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="0.8" />
                <circle cx="160" cy="212" r="2.6" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="0.8" />
                <circle cx="160" cy="236" r="2.6" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="0.8" />

                {/* Two Signature Front Patch Pockets (Hai túi vát phía trước bụng) */}
                {/* Left Pocket */}
                <g>
                  <path d="M134 200 L150 200 L149 224 Q141 228 135 224 Z" fill="url(#garmentGrad)" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.5" />
                  <line x1="134" y1="204" x2="150" y2="204" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.6" />
                </g>
                {/* Right Pocket */}
                <g>
                  <path d="M170 200 L186 200 L185 224 Q179 228 171 224 Z" fill="url(#garmentGrad)" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.5" />
                  <line x1="170" y1="204" x2="186" y2="204" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.6" />
                </g>
                {/* Fabric fold creases */}
                <path d="M142 115 Q140 175 138 244" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.1" fill="none" />
                <path d="M178 115 Q180 175 182 244" stroke="#000000" strokeWidth="0.6" strokeOpacity="0.05" fill="none" />
              </g>
            )}

            {/* ======================================================== */}
            {/* LAYER 3: SLEEVES & ARMS (PROPORTIONATE NATURAL POSE)    */}
            {/* ======================================================== */}

            {garment.id === 'nhat-binh' ? (
              /* Áo Nhật Bình: Wide flowing sleeves draping downward naturally */
              <g id="nhat-binh-wide-sleeves">
                {/* Left Wide Sleeve — drapes down ~30° following gravity */}
                <path
                  d="M120 98 Q110 140 106 200 Q102 250 100 280 L130 280 Q130 250 132 200 Q134 140 138 125 Z"
                  fill="url(#garmentGrad)"
                  stroke="url(#goldTrim)"
                  strokeWidth="0.6"
                />
                {/* Left Cuff: 5-color imperial bands (Lục, Đỏ, Vàng, Trắng, Lam) */}
                <path d="M100 280 L130 280 L129 285 L99 285 Z" fill="#15803D" />
                <path d="M99 285 L129 285 L128 290 L98 290 Z" fill="#DC2626" />
                <path d="M98 290 L128 290 L127 295 L97 295 Z" fill="#EAB308" />
                <path d="M97 295 L127 295 L126 300 L96 300 Z" fill="#F8FAFC" />
                <path d="M96 300 L126 300 L125 305 L95 305 Z" fill="#2563EB" />

                {/* Right Wide Sleeve — drapes down ~30° following gravity */}
                <path
                  d="M200 98 Q210 140 214 200 Q218 250 220 280 L190 280 Q190 250 188 200 Q186 140 182 125 Z"
                  fill="url(#garmentGrad)"
                  stroke="url(#goldTrim)"
                  strokeWidth="0.6"
                />
                {/* Right Cuff: 5-color imperial bands */}
                <path d="M190 280 L220 280 L221 285 L191 285 Z" fill="#15803D" />
                <path d="M191 285 L221 285 L222 290 L192 290 Z" fill="#DC2626" />
                <path d="M192 290 L222 290 L223 295 L193 295 Z" fill="#EAB308" />
                <path d="M193 295 L223 295 L224 300 L194 300 Z" fill="#F8FAFC" />
                <path d="M194 300 L224 300 L225 305 L195 305 Z" fill="#2563EB" />

                {/* Natural Hand Tips peeking out from wide sleeves */}
                <path d="M110 300 Q108 308 112 312 Q116 310 114 304 Z" fill="#F5E5D5" stroke="#E2D0BC" strokeWidth="0.4" />
                <path d="M210 300 Q212 308 208 312 Q204 310 206 304 Z" fill="#F5E5D5" stroke="#E2D0BC" strokeWidth="0.4" />
              </g>
            ) : (
              /* Standard Sleeves: Arms hanging naturally along body */
              <g id="standard-sleeves">
                {/* Left Arm — hangs close to body, elbow slightly bent outward */}
                <path
                  d={isMale
                    ? "M136 100 Q124 100 116 128 Q110 180 112 260 L124 260 Q124 210 128 170 Q132 130 136 112 Z"
                    : "M138 98 Q126 98 118 126 Q112 180 114 255 L126 255 Q126 210 130 170 Q134 130 138 112 Z"}
                  fill={color.hex}
                  stroke={color.secondaryHex}
                  strokeWidth="0.5"
                />
                {/* Left Sleeve silk highlight */}
                <path
                  d={isMale
                    ? "M120 110 Q116 160 114 220"
                    : "M124 110 Q118 160 116 220"}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                  fill="none"
                />
                {/* Left Hand — 4 fingers gently closed, elegant pose */}
                <path
                  d={isMale
                    ? "M112 260 Q110 268 112 274 Q116 276 118 272 Q120 268 122 264 L124 260 Z"
                    : "M114 255 Q112 263 114 269 Q118 271 120 267 Q122 263 124 259 L126 255 Z"}
                  fill="#F5E5D5"
                  stroke="#E2D0BC"
                  strokeWidth="0.5"
                />
                {/* Left thumb hint */}
                <path
                  d={isMale
                    ? "M118 262 Q122 266 120 270"
                    : "M120 257 Q124 261 122 265"}
                  stroke="#DCC5AF"
                  strokeWidth="0.6"
                  fill="none"
                />

                {/* Right Arm — hangs close to body, elbow slightly bent outward */}
                <path
                  d={isMale
                    ? "M184 100 Q196 100 204 128 Q210 180 208 260 L196 260 Q196 210 192 170 Q188 130 184 112 Z"
                    : "M182 98 Q194 98 202 126 Q208 180 206 255 L194 255 Q194 210 190 170 Q186 130 182 112 Z"}
                  fill={color.hex}
                  stroke={color.secondaryHex}
                  strokeWidth="0.5"
                />
                {/* Right Sleeve silk highlight */}
                <path
                  d={isMale
                    ? "M200 110 Q204 160 206 220"
                    : "M196 110 Q202 160 204 220"}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                  fill="none"
                />
                {/* Right Hand — fingers resting lightly */}
                <path
                  d={isMale
                    ? "M208 260 Q210 268 208 274 Q204 276 202 272 Q200 268 198 264 L196 260 Z"
                    : "M206 255 Q208 263 206 269 Q202 271 200 267 Q198 263 196 259 L194 255 Z"}
                  fill="#F5E5D5"
                  stroke="#E2D0BC"
                  strokeWidth="0.5"
                />
                {/* Right thumb hint */}
                <path
                  d={isMale
                    ? "M202 262 Q198 266 200 270"
                    : "M200 257 Q196 261 198 265"}
                  stroke="#DCC5AF"
                  strokeWidth="0.6"
                  fill="none"
                />
              </g>
            )}

            {/* Layering: Blazer Oversize (Outer layer jacket) */}
            {hasBlazer && (
              <g
                id="blazer-overlay"
                onMouseEnter={() => setHoveredItem('Áo Khoác Blazer Oversize')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_8px_rgba(31,41,55,0.8)]"
              >
                {/* Left Structured Shoulder & Panel */}
                <path
                  d="M116 90 L88 238 L128 248 L142 142 Z"
                  fill="#1F2937"
                  stroke="#111827"
                  strokeWidth="1"
                />
                {/* Sharp Notched Lapel (Ve áo cổ bẻ sắc nét) */}
                <path d="M116 90 L140 162 L130 168 L114 116 Z" fill="#374151" stroke="#4B5563" strokeWidth="0.6" />
                {/* Pocket Welt */}
                <rect x="94" y="210" width="22" height="3" rx="0.5" fill="#111827" />

                {/* Right Structured Shoulder & Panel */}
                <path
                  d="M204 90 L232 238 L192 248 L178 142 Z"
                  fill="#1F2937"
                  stroke="#111827"
                  strokeWidth="1"
                />
                {/* Sharp Notched Lapel */}
                <path d="M204 90 L180 162 L190 168 L206 116 Z" fill="#374151" stroke="#4B5563" strokeWidth="0.6" />
                {/* Pocket Welt */}
                <rect x="204" y="210" width="22" height="3" rx="0.5" fill="#111827" />

                {/* Modern Horn Button */}
                <circle cx="160" cy="214" r="3.5" fill="#0F172A" stroke="#475569" strokeWidth="1" />
              </g>
            )}

            {/* ======================================================== */}
            {/* LAYER 4: NECK, COLLAR & MANNEQUIN HEAD                   */}
            {/* ======================================================== */}

            {/* Mannequin Neck & Collarbones */}
            <path
              d={isMale
                ? "M149 70 L148 96 L172 96 L171 70 Z"
                : "M152 70 L150 96 L170 96 L168 70 Z"}
              fill="#EAD9C8"
            />
            {/* Subtle collarbone lines */}
            {!isMale && (
              <path d="M148 94 Q160 98 172 94" stroke="#D3BFAD" strokeWidth="0.8" fill="none" />
            )}

            {/* Traditional Stand Collar (Cổ Đứng Lập Lĩnh — Chỉ hiển thị trên Áo Dài và Áo Ngũ Thân) */}
            {(garment.id === 'ao-dai' || garment.id === 'ao-ngu-than') && (
              <g id="traditional-stand-collar">
                {/* White inner lining peeking (Cổ lót trắng truyền thống) */}
                <path
                  d={isMale
                    ? "M145 84 Q160 88 175 84 L174 88 Q160 92 146 88 Z"
                    : "M147 85 Q160 88 173 85 L172 89 Q160 92 148 89 Z"}
                  fill="#FFFFFF"
                />
                {/* Outer Collar Fabric */}
                <path
                  d={isMale
                    ? "M146 87 Q160 92 174 87 L173 99 Q160 104 147 99 Z"
                    : "M148 88 Q160 92 172 88 L171 99 Q160 103 149 99 Z"}
                  fill="url(#garmentGrad)"
                  stroke="url(#goldTrim)"
                  strokeWidth="0.8"
                />
              </g>
            )}

            {/* Mannequin Head / Face Silhouette */}
            <ellipse
              cx="160"
              cy="56"
              rx={isMale ? 19 : 18}
              ry={isMale ? 24 : 23}
              fill="#F5E7DA"
              stroke="#E8D5C4"
              strokeWidth="0.5"
            />

            {/* Editorial Hair Rendering (Rendered before facial features to preserve face hints) */}
            {!isMale ? (
              <g id="female-chignon-hair">
                {/* Top Knot / Chignon Bun (Búi tóc cao kiêu kỳ đặt trang trọng trên đỉnh đầu) */}
                <ellipse cx="160" cy="23" rx="11" ry="8" fill="#1C1917" stroke="#292524" strokeWidth="1" />
                <circle cx="160" cy="23" r="3.5" fill="#292524" />
                <ellipse cx="160" cy="21" rx="7.5" ry="3.5" fill="#3D3835" />

                {/* Sleek Middle-Part Hair Flow wrapping the skull and framing temples */}
                <path
                  d="M141 54 C139 34 148 26 160 26 C172 26 181 34 179 54 Q182 66 178 72 Q173 54 160 42 Q147 54 142 72 Q138 66 141 54 Z"
                  fill="#1C1917"
                />
                {/* Hair Sheen Highlights */}
                <path d="M148 33 Q160 28 172 33" stroke="#57534E" strokeWidth="1.3" fill="none" />
                <path d="M144 48 Q147 56 145 64" stroke="#44403C" strokeWidth="1" fill="none" />
                <path d="M176 48 Q173 56 175 64" stroke="#44403C" strokeWidth="1" fill="none" />
              </g>
            ) : (
              <g id="male-textured-hair">
                {/* Male Stylish Textured Pompadour/Crop */}
                <path
                  d="M138 54 Q140 28 160 27 Q180 28 182 54 Q176 44 160 44 Q144 44 138 54 Z"
                  fill="#1C1917"
                />
                {/* Textured hair strands */}
                <path d="M144 38 Q158 32 174 37" stroke="#44403C" strokeWidth="1.2" fill="none" />
                <path d="M147 43 Q160 37 172 43" stroke="#57534E" strokeWidth="1" fill="none" />
                {/* Soft Tapered Sideburns */}
                <path d="M140 52 Q141 58 143 62 Q145 60 144 54 Z" fill="#1C1917" />
                <path d="M180 52 Q179 58 177 62 Q175 60 176 54 Z" fill="#1C1917" />
              </g>
            )}

            {/* Minimal Fashion Illustration Face Hints (Always clearly visible on top) */}
            {/* Eyebrows — thin elegant arches */}
            <path
              d={isMale ? "M151 50 Q155 48 159 50" : "M152 50 Q156 48 159 50"}
              stroke="#C4A78C"
              strokeWidth="0.9"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={isMale ? "M161 50 Q165 48 169 50" : "M161 50 Q164 48 168 50"}
              stroke="#C4A78C"
              strokeWidth="0.9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Nose bridge — barely there vertical hint */}
            <path
              d="M160 55 L160 62"
              stroke="#DCC5AF"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
            {/* Lip suggestion — soft rosy tint */}
            <path
              d={isMale ? "M156 67 Q160 69 164 67" : "M156 66 Q160 68 164 66"}
              stroke="#D4A59A"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* ======================================================== */}
            {/* LAYER 5: HIGH-DETAIL JEWELRY & HEADWEAR ACCESSORIES     */}
            {/* ======================================================== */}

            {/* 1. Trâm Bạc Cài Tóc (Silver Hairpin) */}
            {hasTramCai && (
              <g
                id="tram-cai-deluxe"
                onMouseEnter={() => setHoveredItem('Trâm Bạc Cài Tóc Xà Cừ')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_6px_rgba(226,232,240,0.9)]"
              >
                {/* Slender silver needle */}
                <line x1="168" y1="24" x2="192" y2="14" stroke="url(#silverGrad)" strokeWidth="2.8" strokeLinecap="round" />
                {/* Lotus Blossom head ornament */}
                <circle cx="193" cy="13" r="5.5" fill="#E2E8F0" stroke="url(#silverGrad)" strokeWidth="1" />
                <circle cx="193" cy="13" r="3.2" fill="#E11D48" />
                {/* Hanging pearl drop pendant */}
                <line x1="192" y1="18" x2="190" y2="28" stroke="url(#silverGrad)" strokeWidth="0.8" />
                <circle cx="190" cy="29" r="2.5" fill="url(#pearlShine)" />
              </g>
            )}

            {/* 2. Khăn Đóng (Khăn Xếp Truyền Thống) */}
            {hasKhanDong && (
              <g
                id="khan-dong-deluxe"
                onMouseEnter={() => setHoveredItem(isMale ? 'Khăn Đóng Nam Chữ Nhân' : 'Khăn Đóng Nữ Quấn Tầng')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_8px_rgba(223,176,88,0.7)]"
              >
                {/* Base Turban Wrap Ellipse */}
                <ellipse
                  cx="160"
                  cy={isMale ? 42 : 44}
                  rx={isMale ? 25 : 24}
                  ry={isMale ? 14 : 13}
                  fill="#111827"
                  stroke="url(#goldTrim)"
                  strokeWidth="1.2"
                />
                {/* Multiple Fabric Tier Folds (Nếp vấn đa tầng sắc sảo) */}
                <path
                  d={isMale ? "M137 42 Q160 32 183 42" : "M138 44 Q160 35 182 44"}
                  stroke="#1F2937"
                  strokeWidth="3.5"
                  fill="none"
                />
                <path
                  d={isMale ? "M139 39 Q160 30 181 39" : "M140 41 Q160 33 180 41"}
                  stroke="#374151"
                  strokeWidth="2"
                  fill="none"
                />
                {isMale ? (
                  /* Nếp chữ Nhân (人) góc cạnh đặc trưng của khăn nam thời Nguyễn */
                  <g>
                    <path
                      d="M152 38 L160 45 L168 38"
                      stroke="url(#goldTrim)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      d="M154 36 L160 42 L166 36"
                      stroke="#FBBF24"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </g>
                ) : (
                  /* Nếp vòng gấm đều đặn kiêu sa cho nữ */
                  <path
                    d="M140 45 Q160 37 180 45"
                    stroke="url(#goldTrim)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                )}
              </g>
            )}

            {/* 3. Nón Quai Thao (Nón Ba Tầm Kinh Bắc) */}
            {hasNonQuaiThao && (
              <g
                id="non-quai-thao-deluxe"
                onMouseEnter={() => setHoveredItem('Nón Quai Thao Kinh Bắc')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]"
              >
                {/* Wide Flat Palm-fiber Brim (Vành nón lá mây đan tròn phẳng) */}
                <ellipse cx="160" cy="30" rx="46" ry="12" fill="url(#wovenStraw)" stroke="#92400E" strokeWidth="1.5" />
                <ellipse cx="160" cy="29" rx="44" ry="10.5" fill="#FAF5EB" fillOpacity="0.8" />
                <ellipse cx="160" cy="28" rx="20" ry="5" fill="#D97706" fillOpacity="0.25" />

                {/* Long Cascading Peach Silk Ribbons (Quai thao dải lụa buông dài có tua rua) */}
                {/* Left Ribbon */}
                <path
                  d="M122 34 Q116 120 126 210"
                  stroke="#E11D48"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Left Tassel */}
                <path d="M125 210 L123 226 M126 210 L126 228 M127 210 L129 226" stroke="#BE123C" strokeWidth="1.2" />
                <circle cx="126" cy="210" r="2.5" fill="#FEF08A" />

                {/* Right Ribbon */}
                <path
                  d="M198 34 Q204 120 194 210"
                  stroke="#E11D48"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Right Tassel */}
                <path d="M193 210 L191 226 M194 210 L194 228 M195 210 L197 226" stroke="#BE123C" strokeWidth="1.2" />
                <circle cx="194" cy="210" r="2.5" fill="#FEF08A" />
              </g>
            )}

            {/* 4. Vòng Kiềng Bạc Chạm Hoa (Silver Floral Torque) */}
            {hasKiengBac && (
              <g
                id="kieng-bac-deluxe"
                onMouseEnter={() => setHoveredItem('Vòng Kiềng Bạc Chạm Hoa')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_8px_rgba(241,245,249,0.9)]"
              >
                {/* 3D Cast Silver Solid Ring */}
                <path
                  d="M147 92 Q160 106 173 92"
                  stroke="url(#silverGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#croquisShadow)"
                />
                {/* Specular Highlight along crest */}
                <path
                  d="M149 92.5 Q160 104.5 171 92.5"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Engraved floral relief dots */}
                <circle cx="155" cy="99" r="0.8" fill="#475569" />
                <circle cx="160" cy="101" r="0.8" fill="#475569" />
                <circle cx="165" cy="99" r="0.8" fill="#475569" />
              </g>
            )}

            {/* 5. Chuỗi Ngọc Trai Layering (Multi-Strand Luminous Pearls) */}
            {hasNgocTrai && (
              <g
                id="pearls-deluxe"
                onMouseEnter={() => setHoveredItem('Chuỗi Ngọc Trai Layering')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
              >
                {/* Strand 1 (Upper) */}
                {[
                  { cx: 148, cy: 96 }, { cx: 151, cy: 101 }, { cx: 155, cy: 105 },
                  { cx: 160, cy: 107 },
                  { cx: 165, cy: 105 }, { cx: 169, cy: 101 }, { cx: 172, cy: 96 }
                ].map((p, i) => (
                  <circle key={`p1-${i}`} cx={p.cx} cy={p.cy} r="2.2" fill="url(#pearlShine)" stroke="#E5E5E5" strokeWidth="0.4" />
                ))}
                {/* Strand 2 (Lower Drape) */}
                {[
                  { cx: 145, cy: 101 }, { cx: 148, cy: 108 }, { cx: 153, cy: 114 },
                  { cx: 160, cy: 117 },
                  { cx: 167, cy: 114 }, { cx: 172, cy: 108 }, { cx: 175, cy: 101 }
                ].map((p, i) => (
                  <circle key={`p2-${i}`} cx={p.cx} cy={p.cy} r="2.4" fill="url(#pearlShine)" stroke="#E5E5E5" strokeWidth="0.4" />
                ))}
              </g>
            )}

            {/* 6. Kính Mắt Cyber Y2K (Futuristic Aerodynamic Sunglasses) */}
            {hasKinhY2K && (
              <g
                id="cyber-y2k-glasses"
                onMouseEnter={() => setHoveredItem('Kính Râm Cyber Y2K')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]"
              >
                {/* Left Lens */}
                <path d="M143 51 Q150 49 157 52 L155 58 Q148 60 142 56 Z" fill="url(#cyberGlassGrad)" stroke="#E0F2FE" strokeWidth="0.8" />
                {/* Right Lens */}
                <path d="M163 52 Q170 49 177 51 L178 56 Q172 60 165 58 Z" fill="url(#cyberGlassGrad)" stroke="#E0F2FE" strokeWidth="0.8" />
                {/* Bridge */}
                <path d="M157 52 Q160 51 163 52" stroke="#38BDF8" strokeWidth="1.5" />
                {/* Chrome Glint / Specular Ray */}
                <line x1="145" y1="52" x2="152" y2="57" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                <line x1="168" y1="52" x2="175" y2="57" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
              </g>
            )}

            {/* 7. Khăn Rằn Nam Bộ (Southern Checkered Scarf) */}
            {hasKhanRan && (
              <g
                id="khan-ran-deluxe"
                onMouseEnter={() => setHoveredItem('Khăn Rằn Nam Bộ Cách Điệu')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]"
              >
                {/* Around the neck band */}
                <path d="M148 94 Q160 102 172 94 L170 98 Q160 107 150 98 Z" fill="url(#khanRanPattern)" stroke="#18181B" strokeWidth="0.5" />
                {/* Left draped tail */}
                <path
                  d="M142 98 Q138 160 136 225 L144 226 Q146 160 148 98 Z"
                  fill="url(#khanRanPattern)"
                  stroke="#18181B"
                  strokeWidth="0.8"
                />
                {/* Left Fringes (Tua rua chỉ may) */}
                <path d="M136 225 L135 233 M138 225 L138 234 M141 225 L141 233 M144 226 L144 234" stroke="#F4F4F5" strokeWidth="1" />

                {/* Right draped tail */}
                <path
                  d="M172 98 Q174 160 176 225 L184 226 Q182 160 178 98 Z"
                  fill="url(#khanRanPattern)"
                  stroke="#18181B"
                  strokeWidth="0.8"
                />
                {/* Right Fringes */}
                <path d="M176 225 L176 233 M179 225 L179 234 M181 225 L181 233 M184 226 L184 234" stroke="#F4F4F5" strokeWidth="1" />
              </g>
            )}

            {/* ======================================================== */}
            {/* LAYER 6: HANDHELD & BAG ACCESSORIES                     */}
            {/* ======================================================== */}

            {/* 8. Quạt Xếp Lụa Thủy Mặc (Silk Folding Fan) */}
            {hasQuatLua && (
              <g
                id="quat-lua-deluxe"
                onMouseEnter={() => setHoveredItem('Quạt Xếp Lụa Thủy Mặc')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_8px_rgba(225,29,72,0.6)]"
              >
                {/* Fan Silk Leaf Open Arc — held gracefully in right hand */}
                <path
                  d="M204 260 L238 232 Q249 254 232 274 Z"
                  fill="#FDF2F4"
                  stroke="url(#goldTrim)"
                  strokeWidth="1"
                />
                {/* Translucent silk tint */}
                <path d="M204 260 L238 232 Q249 254 232 274 Z" fill="#F43F5E" fillOpacity="0.25" />
                {/* Ink-wash painted branch motif */}
                <path d="M216 251 Q224 246 230 252" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <circle cx="226" cy="248" r="1.5" fill="#E11D48" />
                <circle cx="230" cy="252" r="1.2" fill="#E11D48" />
                {/* Radiating Bamboo Ribs (Nan quạt xòe đều) */}
                <line x1="204" y1="260" x2="238" y2="232" stroke="#92400E" strokeWidth="1.5" />
                <line x1="204" y1="260" x2="243" y2="244" stroke="#B45309" strokeWidth="0.8" />
                <line x1="204" y1="260" x2="240" y2="260" stroke="#B45309" strokeWidth="0.8" />
                <line x1="204" y1="260" x2="232" y2="274" stroke="#92400E" strokeWidth="1.5" />
                {/* Fan Pivot & Hanging Jade Tassel */}
                <circle cx="204" cy="260" r="2.5" fill="#047857" stroke="url(#goldTrim)" strokeWidth="0.8" />
                <path d="M204 262 Q202 272 205 284" stroke="#DC2626" strokeWidth="1.5" fill="none" />
                <circle cx="205" cy="284" r="2" fill="#FEF08A" />
              </g>
            )}

            {/* 9. Túi Cói Đan Tay & Khăn Lụa (Woven Straw Bag) */}
            {hasTuiCoi && (
              <g
                id="tui-coi-deluxe"
                onMouseEnter={() => setHoveredItem('Túi Cói Đan Tay & Khăn Lụa')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]"
              >
                {/* Circular Bamboo Handle held in left hand */}
                <circle cx="114" cy="264" r="7" fill="none" stroke="#92400E" strokeWidth="2" />
                {/* Tied decorative silk twilly scarf */}
                <path d="M108 263 Q102 270 105 280" stroke={color.hex} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="108" cy="264" r="2.5" fill="#FEF08A" />
                {/* Woven Bag Body */}
                <rect x="99" y="271" width="30" height="26" rx="4" fill="url(#wovenStraw)" stroke="#92400E" strokeWidth="1.2" />
                {/* Embroidered floral patch on wicker */}
                <circle cx="114" cy="284" r="4.5" fill="#FEF3C7" />
                <circle cx="114" cy="284" r="2" fill="#DC2626" />
              </g>
            )}

            {/* 10. Túi Tote Canvas Graphic Typography (Vintage Vietnam Canvas Tote) */}
            {hasTote && (
              <g
                id="tote-deluxe"
                onMouseEnter={() => setHoveredItem('Túi Tote Graphic Cổ Điển')}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group hover:filter hover:drop-shadow-[0_0_8px_rgba(15,23,42,0.5)]"
              >
                {/* Canvas drop handles over right wrist */}
                <path
                  d="M198 250 Q208 270 202 278 L210 278 Q216 270 208 250 Z"
                  fill="#475569"
                  stroke="#1E293B"
                  strokeWidth="0.8"
                />
                {/* Hand/Fingers gripping over handle for natural hold */}
                <path
                  d={isMale
                    ? "M204 260 Q208 264 204 270 Q200 272 198 268 Q197 264 200 260 Z"
                    : "M202 256 Q206 260 203 266 Q199 268 197 264 Q196 260 199 256 Z"}
                  fill="#F5E5D5"
                  stroke="#E2D0BC"
                  strokeWidth="0.5"
                />
                <line
                  x1={isMale ? "199" : "198"}
                  y1={isMale ? "265" : "261"}
                  x2={isMale ? "203" : "202"}
                  y2={isMale ? "265" : "261"}
                  stroke="#DCC5AF"
                  strokeWidth="0.6"
                />
                {/* Canvas Bag Body with fabric creases */}
                <rect x="192" y="278" width="30" height="38" rx="2" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.2" />
                <line x1="192" y1="281" x2="222" y2="281" stroke="#CBD5E1" strokeWidth="1" />
                {/* Vintage Graphic Stamp Print */}
                <rect x="198" y="288" width="18" height="17" rx="1.5" fill="#991B1B" />
                <text x="200" y="298" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
                  VIỆT
                </text>
                <text x="200" y="303" fill="#FEF08A" fontSize="4" fontWeight="semibold" fontFamily="sans-serif">
                  NAM
                </text>
              </g>
            )}
          </svg>
        </div>
      ) : viewMode === 'photo' ? (
        /* MODE 2: High-Fashion Lookbook Photography with graceful fallback */
        <div className="relative w-full h-full">
          {!photoError ? (
            <img
              src={garment.image}
              alt={garment.name}
              onError={() => setPhotoError(true)}
              className="w-full h-full object-cover object-center filter saturate-105 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-800">{garment.name}</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">{garment.subtitle}</p>
            </div>
          )}
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-stone-950/20 pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-36 sm:right-44 text-white z-10">
            <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
              Lookbook Editorial
            </p>
            <p className="font-serif text-lg font-bold drop-shadow-md">
              {garment.name} × {style.name} • {isMale ? 'Nam' : 'Nữ'}
            </p>
          </div>
        </div>
      ) : (
        /* MODE 3: Gemini AI Generated High-Fashion Lookbook Photography */
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {isGenerating ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-900 text-white relative overflow-hidden">
              {/* Pulsing aura */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-rose-600/30 to-amber-500/30 blur-3xl animate-pulse" />
              <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9B1D20] to-[#C59338] flex items-center justify-center shadow-lg shadow-amber-500/20 animate-spin">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-amber-200">
                    Google Gemini AI (Imagen 3)
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 font-mono">
                    {generationStep || 'Đang kết xuất người mẫu ảnh thực tế...'}
                  </p>
                </div>
                <div className="w-48 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 animate-pulse" />
                </div>
                <span className="text-[10px] text-stone-400">
                  {garment.name} • {color.name} • {style.name} ({isMale ? 'Nam' : 'Nữ'})
                </span>
              </div>
            </div>
          ) : currentAiImage ? (
            <div className="relative w-full h-full group/aimg overflow-hidden">
              <img
                src={currentAiImage}
                alt={`${garment.name} AI Generated`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/aimg:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30 pointer-events-none" />

              {/* Floating Action Buttons */}
              <div className="absolute top-14 right-3 z-20 flex flex-col gap-2">
                <button
                  onClick={() => setIsZoomOpen(true)}
                  className="p-2 bg-stone-900/80 hover:bg-stone-900 text-white rounded-full backdrop-blur-md shadow-md hover:scale-110 transition-all"
                  title="Phóng to xem chi tiết"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownloadAiImage}
                  className="p-2 bg-stone-900/80 hover:bg-stone-900 text-white rounded-full backdrop-blur-md shadow-md hover:scale-110 transition-all"
                  title="Tải ảnh về máy"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGenerateAi}
                  className="p-2 bg-rose-900/80 hover:bg-rose-900 text-white rounded-full backdrop-blur-md shadow-md hover:scale-110 transition-all"
                  title="Tạo lại bản phối khác"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-36 sm:right-44 text-white z-10">
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-500/30 backdrop-blur-xs mb-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Gemini Imagen 3 Editorial
                </span>
                <p className="font-serif text-lg font-bold drop-shadow-md">
                  {garment.name} × {style.name} • {isMale ? 'Nam' : 'Nữ'}
                </p>
                <p className="text-[11px] text-stone-300 line-clamp-1">
                  {color.vietnameseName} • Phụ kiện: {accessoryIds.length} món
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-900 text-stone-200 relative overflow-hidden">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#9B1D20] via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-xl mb-3 animate-bounce">
                <Wand2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">
                Tạo Ảnh Người Mẫu Thực Tế
              </h4>
              <p className="text-xs text-stone-400 mt-1 max-w-xs leading-relaxed">
                Tái hiện chân thực <strong>{garment.name}</strong> ({color.name}) phong cách <strong>{style.name}</strong> trên vóc dáng {isMale ? 'Nam' : 'Nữ'}.
              </p>
              <button
                onClick={handleGenerateAi}
                className="mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#9B1D20] to-[#C59338] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-rose-900/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Bắt đầu tạo ảnh với Gemini</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Zoom Modal mounted directly to document.body */}
      {isZoomOpen && currentAiImage && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentAiImage}
              alt="Zoomed AI Outfit"
              className="max-h-[80vh] w-auto rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] object-contain border border-stone-700"
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleDownloadAiImage}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 border border-stone-600 shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải ảnh gốc</span>
              </button>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="px-4 py-2 bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
              >
                Đóng (Esc)
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
