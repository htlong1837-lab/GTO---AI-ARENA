import React from 'react';
import { GARMENTS } from '../data/garments';
import { OCCASIONS } from '../data/occasions';
import { STYLES } from '../data/styles';
import { CURATED_LOOKBOOKS } from '../data/curatedLookbooks';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Heart, Flame, ChevronRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, params?: any) => void;
  onSelectGarmentToRemix?: (garmentId: string) => void;
  onSelectOccasionToRemix?: (occasionId: string) => void;
  onSelectStyleToRemix?: (styleId: string) => void;
  onRemixLook?: (look: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectGarmentToRemix,
  onSelectOccasionToRemix,
  onSelectStyleToRemix,
  onRemixLook
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-14 bg-gradient-to-b from-amber-50/60 via-heritage-ivory to-transparent border-b border-heritage-border/50">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-heritage-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-heritage-red/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-heritage-red text-xs font-bold border border-rose-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nền tảng Styling Cổ phục Gen Z đầu tiên tại Việt Nam</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-stone-900 tracking-tight leading-[1.08]">
                VIỆT PHỤC <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-red via-heritage-gold to-heritage-red-light">
                  REMIX
                </span>
              </h1>

              <p className="text-xl sm:text-2xl font-serif text-heritage-red font-semibold italic">
                "Mặc chất Gen Z — Giữ hồn Việt."
              </p>

              <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Khám phá bản sắc Áo Dài, Áo Ngũ Thân, Tứ Thân, Nhật Bình và Áo Bà Ba. Tự tay phối màu, chọn phụ kiện đương đại và tạo nên lookbook mang dấu ấn riêng mà vẫn trân trọng chuẩn mực văn hóa.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('studio')}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-heritage-red hover:bg-heritage-red-dark text-white font-bold text-sm tracking-wide shadow-red-glow hover:shadow-silk transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Bắt đầu phối đồ ngay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('lookbook')}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm border border-stone-300 transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-heritage-gold" />
                  <span>Khám phá Lookbook</span>
                </button>
              </div>

              {/* Key Features Counter */}
              <div className="grid grid-cols-4 gap-3 pt-6 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">05</div>
                  <div className="text-[11px] text-stone-500 font-medium">Dòng Việt phục</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">08</div>
                  <div className="text-[11px] text-stone-500 font-medium">Bối cảnh dịp lễ</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">14+</div>
                  <div className="text-[11px] text-stone-500 font-medium">Phụ kiện phối</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">100%</div>
                  <div className="text-[11px] text-stone-500 font-medium">Chuẩn văn hóa</div>
                </div>
              </div>
            </div>

            {/* Right Visual Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <div className="relative h-96 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
                    alt="Áo dài Gen Z"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Floating badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-stone-900 shadow-sm flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-heritage-red" />
                      Trending Look #01
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block mb-1">
                      Áo Dài Đỏ Son × Sneaker Trắng
                    </span>
                    <h3 className="font-serif text-xl font-bold leading-tight drop-shadow-md">
                      Tết Cổ Truyền • Modern Gen Z
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-stone-300">
                      <span>🎨 Hài hòa màu: 96%</span>
                      <span>•</span>
                      <span>🏮 Du xuân phố hoa</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
                  <span className="text-xs text-stone-300">Thử phối phong cách này ngay?</span>
                  <button
                    onClick={() => {
                      if (onSelectGarmentToRemix) onSelectGarmentToRemix('ao-dai');
                      onNavigate('studio');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-heritage-gold hover:bg-heritage-gold-light text-stone-950 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Thử ngay</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: KHÁM PHÁ 5 DÒNG VIỆT PHỤC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-red font-mono">
              Di Sản Ngàn Năm
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Khám phá 5 dòng Việt phục biểu tượng
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Hiểu đúng về phom dáng, nguồn gốc và tinh hoa từng kiểu trang phục trước khi bắt đầu phối đồ.
            </p>
          </div>
          <button
            onClick={() => onNavigate('culture')}
            className="text-xs font-bold text-heritage-red hover:text-heritage-red-dark flex items-center gap-1 self-start md:self-auto"
          >
            <span>Tìm hiểu chi tiết văn hóa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {GARMENTS.map((garment) => (
            <div
              key={garment.id}
              className="bg-white rounded-2xl p-4 border border-heritage-border/80 hover:border-heritage-gold shadow-sm hover:shadow-editorial transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-3.5 bg-stone-100">
                  <img
                    src={garment.image}
                    alt={garment.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-stone-900 backdrop-blur-xs">
                    {garment.region}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-heritage-red transition-colors">
                  {garment.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                  {garment.subtitle}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100">
                <button
                  onClick={() => {
                    if (onSelectGarmentToRemix) onSelectGarmentToRemix(garment.id);
                    onNavigate('studio');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-heritage-gold" />
                  <span>Phối {garment.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION: PHỐI THEO BỐI CẢNH / SỰ KIỆN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-heritage-red/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-gold font-mono">
              Bối Cảnh Xuất Hiện
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
              Bạn muốn diện Việt phục trong dịp nào?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              Mỗi không gian có một quy ước thẩm mỹ riêng. Chọn sự kiện để chúng tôi gợi ý outfit chuẩn mực nhất cho bạn.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
            {OCCASIONS.map((occ) => (
              <button
                key={occ.id}
                onClick={() => {
                  if (onSelectOccasionToRemix) onSelectOccasionToRemix(occ.id);
                  onNavigate('studio');
                }}
                className="p-4 rounded-2xl bg-stone-800/80 hover:bg-heritage-red/90 border border-stone-700/80 hover:border-heritage-red transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-stone-300 mb-2 inline-block">
                    {occ.tag}
                  </span>
                  <h4 className="font-bold text-sm group-hover:text-white transition-colors">
                    {occ.name}
                  </h4>
                </div>
                <div className="flex items-center justify-between mt-4 text-[11px] text-heritage-gold group-hover:text-white font-medium">
                  <span>Phối ngay</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION: PHỐI THEO PHONG CÁCH GEN Z */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-red font-mono">
            Đa Dạng Cá Tính
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            7 Phong Cách Phối Đồ Đột Phá
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Từ truyền thống mực thước đến Street Hypebeast, Quiet Luxury hay Y2K ngọt ngào.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STYLES.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-2xl p-5 border border-heritage-border/80 hover:border-heritage-charcoal shadow-sm hover:shadow-editorial transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badgeColor}`}>
                    {st.tag}
                  </span>
                  <Sparkles className="w-4 h-4 text-heritage-gold" />
                </div>

                <h3 className="font-serif font-bold text-lg text-stone-900">{st.name}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{st.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-medium italic truncate max-w-[170px]">
                  {st.vibe}
                </span>
                <button
                  onClick={() => {
                    if (onSelectStyleToRemix) onSelectStyleToRemix(st.id);
                    onNavigate('studio');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-heritage-red text-white text-xs font-bold transition-colors"
                >
                  Chọn Style
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SECTION: LOOKBOOK NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-red font-mono">
              Cảm Hứng Sáng Tạo
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Lookbook Tiêu Điểm
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Các bản phối được cộng đồng trẻ yêu thích nhất, sẵn sàng để bạn thử nghiệm lại.
            </p>
          </div>
          <button
            onClick={() => onNavigate('lookbook')}
            className="text-xs font-bold text-stone-900 hover:text-heritage-red flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Xem tất cả 7+ Look</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURATED_LOOKBOOKS.slice(0, 3).map((look) => (
            <div
              key={look.id}
              className="bg-white rounded-3xl overflow-hidden border border-heritage-border/80 shadow-sm hover:shadow-editorial transition-all group flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <img
                  src={look.imageUrl}
                  alt={look.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-stone-900 shadow-sm flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <span>{look.likes}</span>
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {look.region}
                  </span>
                  <h4 className="font-serif font-bold text-base line-clamp-1">{look.name}</h4>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                  {look.culturalStory}
                </p>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-medium">
                    By {look.author}
                  </span>
                  <button
                    onClick={() => {
                      if (onRemixLook) onRemixLook(look);
                      onNavigate('studio');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-heritage-red text-white text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Phối lại</span>
                    <Sparkles className="w-3 h-3 text-heritage-gold" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SECTION: HIỂU ĐÚNG VỀ VIỆT PHỤC (MANIFESTO BANNER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white relative overflow-hidden border border-amber-900/50">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Tuyên ngôn Văn hóa & Trách nhiệm</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Sáng tạo bứt phá nhưng không quên cội nguồn
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Việt Phục Remix chủ trương khuyến khích thế hệ trẻ tự do thể hiện phong cách cá nhân, nhưng luôn phân định rõ ràng giữa <strong>Trang phục quy chuẩn cổ xưa</strong> và <strong>Biến thể cách tân đương đại</strong>. Không tùy tiện biến dạng các chi tiết mang tính nghi thức, cùng nhau giữ gìn tà áo Việt đẹp bền vững.
            </p>

            <div className="pt-3 flex items-center gap-4">
              <button
                onClick={() => onNavigate('culture')}
                className="px-6 py-3 rounded-full bg-heritage-gold hover:bg-heritage-gold-light text-stone-950 font-bold text-xs tracking-wide shadow-gold-glow transition-all"
              >
                Đọc 4 quy tắc vàng khi Remix
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
