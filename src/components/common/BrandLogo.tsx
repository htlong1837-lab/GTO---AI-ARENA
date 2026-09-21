import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'dark',
  className = '',
  onClick
}) => {
  // Dimensions for the insignia seal
  const dimensionMap = {
    sm: { box: 'w-7 h-7', textTitle: 'text-xs sm:text-sm', textSub: 'text-[7.5px]' },
    md: { box: 'w-9 h-9', textTitle: 'text-sm sm:text-base', textSub: 'text-[9px]' },
    lg: { box: 'w-11 h-11', textTitle: 'text-base sm:text-lg', textSub: 'text-[10px]' }
  };

  const dim = dimensionMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none group cursor-pointer ${className}`}
    >
      {/* Imperial Seal Insignia: Interlocking V & P Cross-Collar (Giao Lĩnh & Tà Áo) */}
      <div
        className={`relative ${dim.box} rounded-full shrink-0 shadow-md ring-1 ring-[#DFB058]/60 group-hover:ring-[#DFB058] group-hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center`}
        style={{
          background: 'radial-gradient(circle at 35% 30%, #A8282B 0%, #8E1A1D 50%, #520D0E 100%)'
        }}
      >
        {/* Subtle silk watermark / inner reflection */}
        <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/25 pointer-events-none" />

        {/* Masterwork Vector SVG Monogram */}
        <svg
          viewBox="0 0 44 44"
          className="w-full h-full p-1 relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gold foil metallic gradient */}
            <linearGradient id="vpGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D4" />
              <stop offset="35%" stopColor="#DFB058" />
              <stop offset="70%" stopColor="#C59338" />
              <stop offset="100%" stopColor="#9A6E20" />
            </linearGradient>

            {/* Subtle inner gold glow */}
            <linearGradient id="vpGoldAccent" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#DFB058" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Outer Royal Golden Filigree Border */}
          <circle
            cx="22"
            cy="22"
            r="19.5"
            stroke="url(#vpGoldFoil)"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            opacity="0.85"
          />
          <circle
            cx="22"
            cy="22"
            r="17.8"
            stroke="url(#vpGoldFoil)"
            strokeWidth="0.5"
            opacity="0.5"
          />

          {/* 4 Cardinal Heritage Dots (Tứ Thân Phụ Mẫu Symbolism) */}
          <circle cx="22" cy="3.5" r="0.8" fill="url(#vpGoldFoil)" />
          <circle cx="22" cy="40.5" r="0.8" fill="url(#vpGoldFoil)" />
          <circle cx="3.5" cy="22" r="0.8" fill="url(#vpGoldFoil)" />
          <circle cx="40.5" cy="22" r="0.8" fill="url(#vpGoldFoil)" />

          {/* The "V" Collar Stroke (Left Giao Lĩnh Collar draped downward) */}
          <path
            d="M13 13.5 C15.5 19 19 26 21 31"
            stroke="url(#vpGoldFoil)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Inner collar lining (nẹp cổ trắng thanh tao peeking through) */}
          <path
            d="M14.8 13.2 C17 18 19.5 24 21.2 28.5"
            stroke="#FAF7F0"
            strokeWidth="0.75"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* The "P" Flap Stroke (Right Collar overlapping over left, looping to form "P" and draping down) */}
          <path
            d="M20.5 31 L20.5 13.5 C20.5 13.5 23 11 27 12 C30.5 13 31.5 17.5 29 20.5 C26.5 23 21 22.5 21 22.5"
            stroke="url(#vpGoldFoil)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Flowing silk ribbon tail extending from the knot */}
          <path
            d="M21 23 C23.5 25.5 26.5 28 29.5 30.5"
            stroke="url(#vpGoldFoil)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="3 1.5"
            opacity="0.8"
          />

          {/* Traditional pearl button knot (Khuy Cúc Ngọc Cung Đình) at collar clasp */}
          <circle
            cx="20.8"
            cy="22.5"
            r="1.7"
            fill="#FFF9E6"
            stroke="#8E1A1D"
            strokeWidth="0.75"
          />
          <circle cx="20.4" cy="22.1" r="0.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typographic Text */}
      {showText && (
        <div className="text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif ${dim.textTitle} font-bold tracking-wider transition-colors duration-200 ${
                textColor === 'dark'
                  ? 'text-stone-900 group-hover:text-heritage-red'
                  : 'text-white group-hover:text-[#DFB058]'
              }`}
            >
              VIỆT PHỤC
            </span>
            <span className={`font-sans ${dim.textSub} font-extrabold tracking-[0.24em] text-[#C59338] uppercase`}>
              REMIX
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
