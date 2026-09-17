import React, { useState, useEffect } from 'react';
import { Garment, ColorOption, StyleGenZ } from '../../types/outfit';
import { Sparkles, Eye, Image as ImageIcon } from 'lucide-react';

interface OutfitMannequinProps {
  garment: Garment;
  color: ColorOption;
  style: StyleGenZ;
  accessoryIds: string[];
}

export const OutfitMannequin: React.FC<OutfitMannequinProps> = ({
  garment,
  color,
  style,
  accessoryIds
}) => {
  const [viewMode, setViewMode] = useState<'avatar' | 'photo'>('avatar');
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    setPhotoError(false);
  }, [garment.id]);

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
    <div className="relative w-full h-[420px] sm:h-[480px] bg-gradient-to-b from-stone-100 via-stone-50 to-amber-50/40 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-heritage-border/60 shadow-inner group">
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl -top-10 -right-10 transition-colors duration-700"
          style={{ backgroundColor: `${color.hex}25` }}
        />
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl -bottom-10 -left-10 transition-colors duration-700"
          style={{ backgroundColor: `${color.secondaryHex}20` }}
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 subtle-grid opacity-30" />
      </div>

      {/* View Switcher Button Pill */}
      <div className="absolute top-4 right-4 z-20 flex bg-white/90 backdrop-blur-md rounded-full p-1 border border-stone-200 shadow-sm text-xs font-medium">
        <button
          onClick={() => setViewMode('avatar')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            viewMode === 'avatar'
              ? 'bg-heritage-charcoal text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Layered Silhouette</span>
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
      </div>

      {/* Style badge floating tag */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md border border-heritage-border/80 text-heritage-charcoal shadow-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.hex }} />
          {color.vietnameseName}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-heritage-red/10 text-heritage-red border border-heritage-red/20 w-fit backdrop-blur-sm">
          <Sparkles className="w-3 h-3" />
          {style.name}
        </span>
      </div>

      {/* MODE 1: Interactive Layered SVG Fashion Silhouette */}
      {viewMode === 'avatar' ? (
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <svg
            viewBox="0 0 320 440"
            className="h-full w-auto max-h-[390px] drop-shadow-xl transition-all duration-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Primary garment linear gradient */}
              <linearGradient id="garmentGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color.hex} />
                <stop offset="100%" stopColor={color.secondaryHex} />
              </linearGradient>

              {/* Silk reflection shimmer */}
              <linearGradient id="silkShimmer" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
              </linearGradient>

              {/* Gold trim pattern */}
              <linearGradient id="goldTrim" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#DFB058" />
                <stop offset="50%" stopColor="#C59338" />
                <stop offset="100%" stopColor="#9A6E20" />
              </linearGradient>
            </defs>

            {/* Mannequin Base Shadow */}
            <ellipse cx="160" cy="416" rx="65" ry="8" fill="#1A1C20" fillOpacity="0.12" />

            {/* --- LEGS / FOOTWEAR LAYER --- */}
            {/* Trousers under garment */}
            <path
              d="M145 280 L142 385 Q142 390 148 390 L154 390 L157 280 Z"
              fill={garment.id === 'ao-ba-ba' ? '#1F2937' : '#F4EFE6'}
              stroke="#E2D8C7"
              strokeWidth="0.8"
            />
            <path
              d="M163 280 L166 390 L172 390 Q178 390 178 385 L175 280 Z"
              fill={garment.id === 'ao-ba-ba' ? '#1F2937' : '#F4EFE6'}
              stroke="#E2D8C7"
              strokeWidth="0.8"
            />

            {/* Shoes logic */}
            {hasSneaker ? (
              /* Chunky white sneakers with dynamic accent */
              <g id="sneakers">
                {/* Left Shoe */}
                <rect x="133" y="386" width="22" height="18" rx="5" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
                <path d="M131 398 L157 398 L157 404 L131 404 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M136 390 L146 390" stroke={color.hex} strokeWidth="2" strokeLinecap="round" />
                <circle cx="138" cy="394" r="1.5" fill="#6B7280" />
                {/* Right Shoe */}
                <rect x="165" y="386" width="22" height="18" rx="5" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
                <path d="M163 398 L189 398 L189 404 L163 404 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M174 390 L184 390" stroke={color.hex} strokeWidth="2" strokeLinecap="round" />
                <circle cx="182" cy="394" r="1.5" fill="#6B7280" />
              </g>
            ) : hasBoots ? (
              /* High black fashion boots */
              <g id="boots">
                <path d="M138 355 L138 402 L155 402 L155 355 Z" fill="#18181B" />
                <rect x="135" y="398" width="22" height="6" rx="2" fill="#09090B" />
                <path d="M165 355 L165 402 L182 402 L182 355 Z" fill="#18181B" />
                <rect x="163" y="398" width="22" height="6" rx="2" fill="#09090B" />
              </g>
            ) : hasGuocMoc ? (
              /* Traditional wooden clogs (Guốc mộc) */
              <g id="guoc-moc">
                <path d="M137 396 L154 396 L153 402 L138 402 Z" fill="#9A6E20" />
                <path d="M139 392 Q145 388 152 392" stroke={color.hex} strokeWidth="2.5" fill="none" />
                <path d="M166 396 L183 396 L182 402 L167 402 Z" fill="#9A6E20" />
                <path d="M168 392 Q174 388 181 392" stroke={color.hex} strokeWidth="2.5" fill="none" />
              </g>
            ) : (
              /* Minimal modern leather loafers */
              <g id="minimal-shoes">
                <ellipse cx="145" cy="398" rx="9" ry="4" fill="#292524" />
                <ellipse cx="175" cy="398" rx="9" ry="4" fill="#292524" />
              </g>
            )}

            {/* --- GARMENT SILHOUETTES --- */}

            {/* 1. ÁO DÀI */}
            {garment.id === 'ao-dai' && (
              <g id="garment-ao-dai">
                {/* Back flap shadow */}
                <path
                  d="M132 180 L124 370 Q160 380 196 370 L188 180 Z"
                  fill={color.hex}
                  opacity="0.85"
                />
                {/* Front flowing flap */}
                <path
                  d="M136 125 L128 365 Q160 375 192 365 L184 125 Q160 140 136 125 Z"
                  fill="url(#garmentGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
                {/* Silk sheen reflection */}
                <path
                  d="M142 135 L136 360 Q150 366 160 365 L158 135 Z"
                  fill="url(#silkShimmer)"
                />
                {/* Side slits */}
                <line x1="136" y1="180" x2="132" y2="280" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.3" />
                <line x1="184" y1="180" x2="188" y2="280" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.3" />
              </g>
            )}

            {/* 2. ÁO TỨ THÂN */}
            {garment.id === 'ao-tu-than' && (
              <g id="garment-ao-tu-than">
                {/* Inner Yếm đào */}
                <path d="M145 95 L175 95 L180 170 L140 170 Z" fill="#CA4F76" />
                {/* Outer 4 flaps */}
                <path d="M125 105 L110 360 L140 365 L145 105 Z" fill="url(#garmentGrad)" />
                <path d="M195 105 L210 360 L180 365 L175 105 Z" fill="url(#garmentGrad)" />
                {/* Front tied bow / Knot at belly */}
                <path d="M145 170 Q160 185 175 170 L170 240 Q160 250 150 240 Z" fill="#C59338" />
                <circle cx="160" cy="180" r="6" fill="#9B1D20" />
                {/* Ribbon ties */}
                <path d="M158 185 Q152 230 146 270" stroke="#CA4F76" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M162 185 Q168 230 174 270" stroke="#1D6246" strokeWidth="3" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* 3. ÁO NGŨ THÂN */}
            {garment.id === 'ao-ngu-than' && (
              <g id="garment-ao-ngu-than">
                {/* Main 5-panel silhouette: loose, structured */}
                <path
                  d="M128 100 L118 340 Q160 350 202 340 L192 100 Q160 110 128 100 Z"
                  fill="url(#garmentGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                />
                {/* Lap-linh right-closing flap */}
                <path
                  d="M160 92 L185 125 L185 240 L160 345"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  fill="none"
                />
                {/* 5 Traditional buttons (Ngũ thường buttons) */}
                <circle cx="163" cy="95" r="2.5" fill="#DFB058" />
                <circle cx="172" cy="108" r="2.5" fill="#DFB058" />
                <circle cx="182" cy="122" r="2.5" fill="#DFB058" />
                <circle cx="184" cy="150" r="2.5" fill="#DFB058" />
                <circle cx="183" cy="180" r="2.5" fill="#DFB058" />
              </g>
            )}

            {/* 4. ÁO NHẬT BÌNH */}
            {garment.id === 'nhat-binh' && (
              <g id="garment-nhat-binh">
                {/* Main imperial robe */}
                <path
                  d="M120 100 L110 355 Q160 365 210 355 L200 100 Q160 112 120 100 Z"
                  fill="url(#garmentGrad)"
                />
                {/* Signature Rectangular Collar (Đối Khâm) */}
                <rect x="146" y="92" width="28" height="105" rx="3" fill="url(#goldTrim)" />
                <rect x="150" y="96" width="20" height="97" rx="2" fill="#9B1D20" />
                {/* Center opening line */}
                <line x1="160" y1="92" x2="160" y2="197" stroke="#DFB058" strokeWidth="1.5" />
                <circle cx="160" cy="140" r="3.5" fill="#F4EFE6" stroke="#C59338" strokeWidth="1" />
                {/* Imperial 5-color sleeves trim */}
                <path d="M102 210 L118 210 L118 225 L102 225 Z" fill="#CA4F76" />
                <path d="M102 225 L118 225 L118 235 L102 235 Z" fill="#1D6246" />
                <path d="M102 235 L118 235 L118 245 L102 245 Z" fill="#DFB058" />
                <path d="M202 210 L218 210 L218 225 L202 225 Z" fill="#CA4F76" />
                <path d="M202 225 L218 225 L218 235 L202 235 Z" fill="#1D6246" />
                <path d="M202 235 L218 235 L218 245 L202 245 Z" fill="#DFB058" />
              </g>
            )}

            {/* 5. ÁO BÀ BA */}
            {garment.id === 'ao-ba-ba' && (
              <g id="garment-ao-ba-ba">
                {/* Short top ending at hip */}
                <path
                  d="M130 98 L124 240 Q160 248 196 240 L190 98 Q160 108 130 98 Z"
                  fill="url(#garmentGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                />
                {/* Side slits */}
                <line x1="126" y1="210" x2="124" y2="240" stroke="#FFFFFF" strokeWidth="1.5" />
                <line x1="194" y1="210" x2="196" y2="240" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Center front button line */}
                <line x1="160" y1="108" x2="160" y2="240" stroke="#111827" strokeWidth="1" strokeOpacity="0.3" />
                <circle cx="160" cy="125" r="2.5" fill="#E5E7EB" />
                <circle cx="160" cy="148" r="2.5" fill="#E5E7EB" />
                <circle cx="160" cy="172" r="2.5" fill="#E5E7EB" />
                <circle cx="160" cy="196" r="2.5" fill="#E5E7EB" />
                {/* Front two pockets */}
                <rect x="136" y="195" width="16" height="18" rx="2" fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1" />
                <rect x="168" y="195" width="16" height="18" rx="2" fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1" />
              </g>
            )}

            {/* Sleeves (Arms) */}
            <path
              d="M130 100 L104 205 Q110 215 118 208 L138 130 Z"
              fill={color.hex}
            />
            <path
              d="M190 100 L216 205 Q210 215 202 208 L182 130 Z"
              fill={color.hex}
            />

            {/* Layering: Blazer Oversize (if selected) */}
            {hasBlazer && (
              <g id="blazer-overlay">
                <path
                  d="M120 95 L95 240 L130 250 L140 140 Z"
                  fill="#1F2937"
                  opacity="0.9"
                />
                <path
                  d="M200 95 L225 240 L190 250 L180 140 Z"
                  fill="#1F2937"
                  opacity="0.9"
                />
                {/* Lapel collar */}
                <path d="M120 95 L140 160 L132 165 Z" fill="#374151" />
                <path d="M200 95 L180 160 L188 165 Z" fill="#374151" />
              </g>
            )}

            {/* Mannequin Neck & Collar */}
            <path d="M152 75 L152 98 L168 98 L168 75 Z" fill="#E7D8C9" />

            {/* Traditional Stand Collar (Lập Lĩnh) */}
            {garment.id !== 'ao-ba-ba' && (
              <path
                d="M148 88 Q160 92 172 88 L171 98 Q160 102 149 98 Z"
                fill="url(#garmentGrad)"
                stroke="#DFB058"
                strokeWidth="0.8"
              />
            )}

            {/* Mannequin Head / Face Silhouette */}
            <ellipse cx="160" cy="58" rx="19" ry="24" fill="#F1E4D6" />

            {/* Hair bun / Sleek Hair */}
            <path
              d="M141 52 Q160 34 179 52 Q183 68 178 72 Q160 76 142 72 Q137 68 141 52 Z"
              fill="#18181B"
            />
            {/* Top knot */}
            <circle cx="160" cy="35" r="9" fill="#18181B" />

            {/* --- HEADWEAR ACCESSORIES --- */}
            {hasKhanDong && (
              /* Traditional Folded Turban (Khăn Đóng) */
              <g id="khan-dong-accessory">
                <ellipse cx="160" cy="46" rx="23" ry="12" fill="#182747" stroke="#DFB058" strokeWidth="1" />
                <path d="M137 46 Q160 38 183 46" stroke="#2A3F6D" strokeWidth="2.5" fill="none" />
                <path d="M138 43 Q160 35 182 43" stroke="#DFB058" strokeWidth="1" fill="none" />
              </g>
            )}

            {hasNonQuaiThao && (
              /* Flat conical hat with silken ribbons (Nón Quai Thao) */
              <g id="non-quai-thao-accessory">
                <ellipse cx="160" cy="32" rx="42" ry="10" fill="#EEDCC1" stroke="#C59338" strokeWidth="1.2" />
                <ellipse cx="160" cy="30" rx="40" ry="8" fill="#F9F4EB" />
                {/* Ribbons hanging down */}
                <path d="M125 35 Q120 90 128 150" stroke="#CA4F76" strokeWidth="2" fill="none" />
                <path d="M195 35 Q200 90 192 150" stroke="#CA4F76" strokeWidth="2" fill="none" />
              </g>
            )}

            {hasTramCai && (
              /* Silver Hairpin (Trâm Cài Tóc) */
              <g id="tram-cai-accessory">
                <line x1="168" y1="26" x2="186" y2="18" stroke="#E5E7EB" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="187" cy="17" r="4" fill="#CA4F76" stroke="#FFFFFF" strokeWidth="1" />
              </g>
            )}

            {/* --- JEWELRY ACCESSORIES --- */}
            {hasKiengBac && (
              /* Silver Torque (Vòng Kiềng Bạc) */
              <path
                d="M149 92 Q160 102 171 92"
                stroke="#E5E7EB"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {hasNgocTrai && (
              /* Layered Pearls */
              <g id="pearls">
                <path d="M147 94 Q160 108 173 94" stroke="#FAF7F0" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                <path d="M144 98 Q160 116 176 98" stroke="#FAF7F0" strokeWidth="2" strokeDasharray="3 3" fill="none" />
              </g>
            )}

            {/* --- EYEWEAR --- */}
            {hasKinhY2K && (
              /* Cyber Y2K Sunglasses */
              <g id="cyber-glasses">
                <rect x="145" y="52" width="13" height="7" rx="3.5" fill="#111827" stroke="#38BDF8" strokeWidth="1" />
                <rect x="162" y="52" width="13" height="7" rx="3.5" fill="#111827" stroke="#38BDF8" strokeWidth="1" />
                <line x1="158" y1="55" x2="162" y2="55" stroke="#38BDF8" strokeWidth="1" />
              </g>
            )}

            {/* --- HANDHELD & BAG ACCESSORIES --- */}
            {hasTuiCoi && (
              /* Woven Straw Bag */
              <g id="tui-coi">
                <path d="M102 210 Q98 230 104 235 L96 235 Q90 230 96 210 Z" stroke="#9A6E20" strokeWidth="1.5" fill="none" />
                <rect x="85" y="235" width="26" height="24" rx="4" fill="#D4B483" stroke="#9A6E20" strokeWidth="1" />
                <line x1="85" y1="243" x2="111" y2="243" stroke="#B89758" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="85" y1="251" x2="111" y2="251" stroke="#B89758" strokeWidth="1" strokeDasharray="2 2" />
              </g>
            )}

            {hasTote && (
              /* Graphic Canvas Tote Bag */
              <g id="tote-bag">
                <path d="M210 205 Q218 225 212 230 L220 230 Q226 225 218 205 Z" stroke="#374151" strokeWidth="1.5" fill="none" />
                <rect x="204" y="230" width="28" height="34" rx="2" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1" />
                <rect x="210" y="240" width="16" height="14" rx="1" fill="#9B1D20" />
                <text x="212" y="250" fill="#FFFFFF" fontSize="6" fontWeight="bold">VIỆT</text>
              </g>
            )}

            {hasQuatLua && (
              /* Silk Fan (Quạt Xếp) */
              <g id="quat-lua">
                <path d="M208 200 L232 178 Q240 195 228 210 Z" fill="#CA4F76" stroke="#DFB058" strokeWidth="1" />
                <line x1="208" y1="200" x2="232" y2="178" stroke="#9A6E20" strokeWidth="1.5" />
                <line x1="208" y1="200" x2="228" y2="210" stroke="#9A6E20" strokeWidth="1.5" />
              </g>
            )}

            {hasKhanRan && (
              /* Southern Scarf (Khăn Rằn Nam Bộ) */
              <g id="khan-ran">
                <path d="M142 98 Q140 160 138 210" stroke="#1F2937" strokeWidth="4" strokeDasharray="2 2" fill="none" />
                <path d="M178 98 Q180 160 182 210" stroke="#1F2937" strokeWidth="4" strokeDasharray="2 2" fill="none" />
              </g>
            )}
          </svg>
        </div>
      ) : (
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
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20 pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
              Lookbook Editorial
            </p>
            <p className="font-serif text-lg font-bold drop-shadow-md">
              {garment.name} × {style.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
