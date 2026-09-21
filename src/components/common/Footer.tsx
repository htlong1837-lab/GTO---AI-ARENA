import React from 'react';
import { Sparkles, Heart, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="relative bg-[#111215] text-stone-300 pt-20 pb-28 lg:pb-16 border-t border-[#D4AF37]/30 overflow-hidden">
      {/* Massive Watermark Floria Background Text */}
      <div className="absolute inset-x-0 -bottom-6 pointer-events-none select-none flex justify-center overflow-hidden">
        <span className="text-[20vw] font-extrabold tracking-tighter text-white/[0.025] leading-none whitespace-nowrap font-sans">
          VIỆT PHỤC
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 mb-16">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <BrandLogo
                onClick={() => onSelectTab('home')}
                size="lg"
                textColor="light"
              />
              <span className="text-[9px] font-sans font-semibold tracking-widest text-[#DFB058] uppercase px-2 py-0.5 rounded-full border border-[#DFB058]/30 bg-[#DFB058]/10">
                ATELIER
              </span>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md leading-relaxed font-sans font-light">
              Nền tảng styling cổ phục tương tác giao thoa giữa điển chế hoàng triều, tơ lụa ba miền và tinh thần thẩm mỹ đương đại của thế hệ Gen Z. Không gian số tôn vinh chiều sâu di sản Việt Nam.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-[#DFB058] font-serif italic pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>"Mặc chất Gen Z — Thấm đẫm hồn Cội Nguồn."</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">
              Không Gian Trải Nghiệm
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400 font-medium">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Trang chủ Tạp chí</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('studio')}
                  className="hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Xưởng phối đồ Atelier 2D</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('studio3d')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>Phòng thử đồ 3D Canvas</span>
                  <span className="text-[8px] bg-[#C59338]/20 text-[#DFB058] px-1.5 py-0.5 rounded-full border border-[#C59338]/30 font-bold">
                    MỚI
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('lookbook')}
                  className="hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Bộ sưu tập Lookbook Ba Miền</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('compare')}
                  className="hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Ma trận So sánh Trang phục</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('culture')}
                  className="hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Chuyên khảo Văn hóa Việt phục</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Cultural Commitment */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">
              Tôn Chỉ Di Sản
            </h4>
            <div className="p-5 rounded-2xl bg-[#0E1015] border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#DFB058] font-serif font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Bảo Tồn Chuẩn Mực Văn Hóa</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Mọi quy chuẩn kết cấu vạt áo ngũ thân, nẹp đối khâm, lập lĩnh và triết lý hòa sắc Ngũ Hành đều được khảo cứu nghiêm cẩn dựa trên tư liệu mỹ thuật cổ truyền.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="tracking-wide">
            © 2026 VIỆT PHỤC REMIX. Nền tảng Styling Cổ phục Đương đại.
          </p>
          <div className="flex items-center gap-1.5 font-serif italic text-neutral-400">
            <span>Nuôi dưỡng bởi niềm tự hào di sản Việt Nam</span>
            <Heart className="w-3.5 h-3.5 text-heritage-red fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
