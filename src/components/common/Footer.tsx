import React from 'react';
import { Sparkles, Heart, Compass, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-24 lg:pb-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-heritage-red text-white flex items-center justify-center font-serif text-xl font-bold">
                VP
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                VIỆT PHỤC REMIX
              </span>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Nền tảng thời trang tương tác dành cho thế hệ trẻ Việt Nam. Chúng tôi tin rằng trang phục truyền thống không chỉ nằm trong bảo tàng hay sách sử, mà luôn sống động, hơi thở đương đại cùng tinh thần Gen Z.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300/90 font-medium">
              <Sparkles className="w-4 h-4 text-heritage-gold" />
              <span>"Mặc chất Gen Z — Giữ hồn Việt."</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Khám Phá
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-white transition-colors">
                  Trang chủ
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('studio')} className="hover:text-white transition-colors">
                  Studio phối đồ trực quan
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('lookbook')} className="hover:text-white transition-colors">
                  Lookbook di sản Việt
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('compare')} className="hover:text-white transition-colors">
                  Bảng so sánh Look
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('culture')} className="hover:text-white transition-colors">
                  Hiểu đúng về Việt phục
                </button>
              </li>
            </ul>
          </div>

          {/* Cultural Commitment */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Cam Kết Văn Hóa
            </h4>
            <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-heritage-gold font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Tôn Trọng Di Sản</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Mọi thông tin lịch sử, kết cấu cổ áo, hàng cúc và nẹp đối khâm đều được tham chiếu tài liệu mỹ thuật & cổ trang học nghiêm túc.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Việt Phục Remix. Thiết kế & Phát triển cho Đề thi Audition.</p>
          <div className="flex items-center gap-1">
            <span>Được thực hiện với</span>
            <Heart className="w-3.5 h-3.5 text-heritage-red fill-current" />
            <span>cho văn hóa truyền thống Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
