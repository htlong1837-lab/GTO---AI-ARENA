import React, { useState } from 'react';
import { GARMENTS } from '../data/garments';
import { OCCASIONS } from '../data/occasions';
import {
  Sparkles,
  ArrowRight,
  Compass,
  ChevronRight,
  Box,
  CheckCircle2,
  BookOpen,
  Send,
  Quote,
  Star
} from 'lucide-react';

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
  _onRemixLook
}: HomePageProps & { _onRemixLook?: any }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  // Garment lookups to ensure 100% bug-free data & image alignment
  const aoNguThan = GARMENTS.find((g) => g.id === 'ao-ngu-than') || GARMENTS[2];
  const aoNhatBinh = GARMENTS.find((g) => g.id === 'nhat-binh') || GARMENTS[3];
  const aoTuThan = GARMENTS.find((g) => g.id === 'ao-tu-than') || GARMENTS[1];
  const aoDai = GARMENTS.find((g) => g.id === 'ao-dai') || GARMENTS[0];
  const aoBaBa = GARMENTS.find((g) => g.id === 'ao-ba-ba') || GARMENTS[4];

  // 3 Curated Assemblages matching Floria Staggered Gallery with AI Generated Looks
  const assemblages = [
    {
      id: 'look-ao-dai-tet',
      name: 'Du Xuân Phố Cổ • Tân Thời Kỷ',
      garmentName: aoDai.name,
      garmentId: aoDai.id,
      colorPair: 'Đỏ Son × Sneaker Da Trắng',
      harmonyScore: '96%',
      element: 'Hỏa',
      staggerClass: 'md:mt-0',
      imageAspectClass: 'aspect-[3/4]',
      image: '/images/looks/look_aodai_duxuan.jpg',
      tag: 'BẢN PHỐI #01',
      price: 'Look Tiêu Điểm',
      vibe: 'Minimal Chic',
      description: 'Áo Dài đỏ son tơ tằm dạo phố cổ Hà Nội đương đại'
    },
    {
      id: 'look-nhat-binh-gala',
      name: 'Dạ Tiệc Hoàng Triều • Vương Giả',
      garmentName: aoNhatBinh.name,
      garmentId: aoNhatBinh.id,
      colorPair: 'Vàng Hoàng Yến × Kiềng Bạc',
      harmonyScore: '98%',
      element: 'Thổ',
      staggerClass: 'md:mt-24',
      imageAspectClass: 'aspect-square',
      image: '/images/looks/look_nhatbinh_hoangtrieu.jpg',
      tag: 'BẢN PHỐI #02',
      price: 'Hoàng Cung Huế',
      vibe: 'Quý Phái',
      description: 'Nhật Bình cổ bản ngũ sắc kết hợp kiềng bạc chạm lọng'
    },
    {
      id: 'look-ngu-than-nam',
      name: 'Trà Chiều & Thư Quán Tao Nhã',
      garmentName: aoNguThan.name,
      garmentId: aoNguThan.id,
      colorPair: 'Chàm Indigo × Kính Cổ Điển',
      harmonyScore: '94%',
      element: 'Thủy',
      staggerClass: 'md:mt-12',
      imageAspectClass: 'aspect-[3/4]',
      image: '/images/looks/look_nguthan_trachieu.jpg',
      tag: 'BẢN PHỐI #03',
      price: 'Nho Nhã Đĩnh Đạc',
      vibe: 'Thư Sinh',
      description: 'Ngũ Thân lam chàm ngũ luân trong không gian thư họa'
    }
  ];

  return (
    <div className="space-y-28 md:space-y-36 pb-24 text-stone-800">
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. FLORIA EDITORIAL HERO SECTION (ORIGINAL ARTWORK) */}
      {/* ========================================================================= */}
      <section 
        className="relative min-h-[90vh] lg:min-h-[86vh] w-full flex items-center overflow-hidden bg-[#FAF7F2] pt-4 pb-14 select-none"
      >
        {/* Ambient Warm Heritage Glows */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#A8282B]/8 rounded-full blur-[140px] pointer-events-none" />

        {/* ═══ LAYER 1: ANCIENT IMPERIAL PALACE COLONNADE (QUÁ KHỨ • 1802) ═══ */}
        {/* Placed on the far left, dissolving softly into the cream canvas behind text */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-[42%] sm:w-[32%] lg:w-[26%] xl:w-[22%] pointer-events-none overflow-hidden z-0 opacity-40 transition-opacity duration-1000"
        >
          <div className="relative w-full h-full">
            <img
              src="/images/hero_palace_alpha.png"
              alt="Cung Điện Cổ Kính Triều Nguyễn"
              className="w-full h-full object-cover object-left filter brightness-95 contrast-95 scale-105"
            />
            {/* Multi-stop Dissolve Scrims from Right to Left */}
            <div className="absolute inset-y-0 right-0 w-full sm:w-[80%] bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/90 via-35% to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FAF7F2] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ═══ LAYER 2: EMBEDDED SEAMLESS MODERN HAUTE-COUTURE MODEL (HIỆN ĐẠI • 2026) ═══ */}
        {/* Only elevating when hovering directly over the female model zone */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-full lg:w-[64%] xl:w-[59%] pointer-events-auto overflow-hidden z-0 group/model cursor-pointer"
        >
          <div className="relative w-full h-full">
            {/* Interactive Model Glow on hover */}
            <div className="absolute top-1/3 right-1/4 w-[380px] h-[480px] bg-[#A8282B]/0 group-hover/model:bg-[#A8282B]/16 rounded-full blur-[100px] transition-all duration-700 pointer-events-none" />

            {/* High-Fashion Editorial Model in Nhật Bình + Modern Accessories */}
            <img
              src="/images/hero_floria_seamless.jpg"
              alt="Kiệt Tác Cổ Phục Đương Đại"
              className="w-full h-full object-cover object-right-bottom sm:object-right transform scale-100 group-hover/model:scale-[1.035] group-hover/model:-translate-y-2.5 transition-transform duration-700 ease-out"
            />

            {/* Ultra-smooth Multi-layer Silk Gradient Scrim: feather dissolve from left */}
            <div className="absolute inset-y-0 left-0 w-full sm:w-[85%] lg:w-[78%] bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/95 via-25% to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-full sm:w-[65%] lg:w-[50%] bg-gradient-to-r from-[#FAF7F2]/80 via-[#FAF7F2]/40 via-45% to-transparent pointer-events-none" />

            {/* Top and Bottom soft fades */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2]/70 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent pointer-events-none" />

            {/* Subtle warmth tone overlay */}
            <div className="absolute inset-0 bg-[#FAF7F2]/6 mix-blend-multiply pointer-events-none" />
          </div>
        </div>

        {/* ═══ FOREGROUND CONTENT CONTAINER (Z-10) ═══ */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pointer-events-none pt-4">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Floria Architectural Typography & Double Pill CTAs */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-8 text-left pointer-events-auto">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md border border-[#D4AF37]/50 text-stone-800 text-xs tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C59338]" />
                <span className="font-semibold">Nền tảng Styling Cổ Phục Tương Tác Đầu Tiên</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[#111215] leading-[0.95]">
                  CỔ PHỤC. <br />
                  <span className="text-vermilion-gradient font-serif italic font-normal pr-2">
                    Đương Đại.
                  </span>
                </h1>
                <p className="font-serif text-lg sm:text-2xl text-stone-700 font-normal italic tracking-wide pt-1">
                  "Mặc chất Gen Z — Thấm đẫm hồn Cội Nguồn."
                </p>
              </div>

              <p className="text-stone-600 text-sm sm:text-base max-w-xl leading-relaxed font-sans font-normal">
                Tái định nghĩa vẻ đẹp vượt thời gian của Áo Dài, Ngũ Thân, Tứ Thân, Nhật Bình và Bà Ba. Hòa nhịp phụ kiện đương đại, cân bằng độ hòa sắc Ngũ Hành và lưu giữ trọn vẹn tinh hoa quy thức cổ truyền.
              </p>

              {/* Floria Double Pill Buttons with Heritage Crimson & Gold */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('studio')}
                  className="h-14 px-8 rounded-full bg-[#A8282B] hover:bg-[#8D1E21] text-white font-semibold text-sm tracking-wide shadow-editorial transition-all flex items-center justify-center gap-2.5 group border border-[#D4AF37]/30 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#DFB058]" />
                  <span>Bước Vào Xưởng Phối Đồ</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#DFB058]" />
                </button>

                <button
                  onClick={() => onNavigate('studio3d')}
                  className="h-14 px-7 rounded-full bg-[#18181B] hover:bg-black text-white font-medium text-sm border border-[#D4AF37]/40 shadow-xs transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
                >
                  <Box className="w-4 h-4 text-[#DFB058] group-hover:rotate-12 transition-transform" />
                  <span>Thử Đồ 3D Canvas</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#C59338]/30 text-[#DFB058] text-[9px] font-bold tracking-widest uppercase border border-[#C59338]/40">
                    MỚI
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('lookbook')}
                  className="h-14 px-6 rounded-full bg-white/90 backdrop-blur-sm hover:bg-stone-50 text-stone-800 font-medium text-sm border border-[#E2D8C7] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <Compass className="w-4 h-4 text-[#C59338]" />
                  <span>Lookbook Ba Miền</span>
                </button>
              </div>

              {/* Editorial Highlights Stats Counter */}
              <div className="grid grid-cols-4 gap-4 pt-8 border-t border-[#E2D8C7] max-w-xl">
                <div>
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">05</div>
                  <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider font-semibold mt-1">
                    Dòng Phục Trang
                  </div>
                </div>
                <div>
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">08</div>
                  <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider font-semibold mt-1">
                    Bối Cảnh Lễ Tết
                  </div>
                </div>
                <div>
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">16+</div>
                  <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider font-semibold mt-1">
                    Phụ Kiện Gen Z
                  </div>
                </div>
                <div>
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-[#A8282B] tracking-tight">100%</div>
                  <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider font-semibold mt-1">
                    Chuẩn Quy Thức
                  </div>
                </div>
              </div>
            </div>

            {/* Empty spacer for grid column on desktop to let image breathe underneath */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-6 min-h-[460px] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FLORIA CURATED ASSEMBLAGES (STAGGERED 3-COLUMN CARDS WITH SLIDE-UP PILLS) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6 border-b border-[#E2D8C7] pb-6">
          <div>
            <span className="text-xs font-serif font-bold tracking-[0.2em] uppercase text-[#A8282B]">
              CURATED ASSEMBLAGES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#111215] mt-2">
              Tuyển Tập Phối Phục Tiêu Biểu
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 font-sans max-w-xl">
              3 bản phối định hình phong cách: sự giao thoa chuẩn mực giữa kết cấu vạt áo cổ truyền và phụ kiện streetwear đương đại.
            </p>
          </div>
          <button
            onClick={() => onNavigate('lookbook')}
            className="group flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A8282B] hover:text-stone-900 uppercase transition-colors self-start md:self-auto"
          >
            <span>Mở toàn bộ Lookbook</span>
            <div className="p-2 bg-stone-100 rounded-full group-hover:bg-[#C59338] group-hover:text-stone-950 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* 3 Staggered Columns matching Floria exact aspect ratios & mt offsets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {assemblages.map((item) => (
            <div
              key={item.id}
              className={`group cursor-pointer ${item.staggerClass} transition-transform duration-500`}
            >
              <div className="w-full relative overflow-hidden rounded-[2.5rem] mb-5 bg-white border border-[#E2D8C7] hover:border-[#D4AF37] p-3 shadow-xs hover:shadow-editorial floria-card-hover transition-all duration-500">
                <div className={`relative w-full ${item.imageAspectClass} rounded-[2rem] overflow-hidden bg-[#F4EFE6]`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-stone-950/15 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FAF7F2]/95 backdrop-blur-md text-stone-900 border border-[#E2D8C7] shadow-xs">
                      {item.tag}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#111215]/80 text-[#DFB058] border border-[#D4AF37]/40 backdrop-blur-md shadow-xs">
                      Hành {item.element} • {item.harmonyScore}
                    </span>
                  </div>

                  {/* Bottom Information (Smoothly fades on hover so the slide-up pill takes full focus) */}
                  <div className="absolute bottom-4 left-4 right-4 text-white z-10 transition-all duration-400 group-hover:opacity-0 group-hover:translate-y-3 pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB058] block mb-1 drop-shadow-sm">
                      {item.colorPair}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
                      {item.name}
                    </h3>
                  </div>

                  {/* Floria Signature Slide-up Quick Add / Action Pill */}
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex justify-center z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectGarmentToRemix) onSelectGarmentToRemix(item.garmentId);
                        onNavigate('studio');
                      }}
                      className="bg-[#FAF7F2]/95 backdrop-blur-md text-stone-900 border border-[#D4AF37]/60 text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-editorial flex items-center gap-2.5 hover:bg-[#A8282B] hover:text-white hover:border-[#A8282B] transition-all group/btn"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C59338] group-hover/btn:text-[#DFB058]" />
                      <span>Phối Bản Này Ngay</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#A8282B] group-hover/btn:text-white group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Caption Under Card */}
              <div className="flex justify-between items-start px-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#A8282B] transition-colors">
                      {item.garmentName}
                    </h4>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A8282B]" />
                    <span className="text-xs text-stone-500 font-sans">{item.vibe}</span>
                  </div>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs font-semibold text-stone-800 px-3 py-1 rounded-full bg-[#F4EFE6] border border-[#E2D8C7] shadow-2xs whitespace-nowrap">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FLORIA STICKY BOTANICAL PROCESS (THE ARCHITECTURE OF HERITAGE) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Sticky Process Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 self-start space-y-6">
            <span className="text-xs font-serif font-bold tracking-[0.2em] uppercase text-[#A8282B]">
              THE ARCHITECTURE OF HERITAGE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#111215] leading-[1.05]">
              Kiến Trúc Cổ Phục.<br />
              <span className="text-[#C59338] italic font-normal">Hồn Cốt Nghìn Năm.</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans max-w-[42ch]">
              Mỗi tác phẩm tại Việt Phục Remix là một sự phản chiếu nghiêm cẩn của lịch sử, bảo toàn nguyên bản cấu trúc vạt áo nhưng thở cùng nhịp điệu của thời đại số.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('culture')}
                className="h-12 px-7 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs tracking-wider uppercase border border-[#E2D8C7] transition-all flex items-center gap-2 shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-[#C59338]" />
                <span>Đọc Chuyên Khảo Điển Chế</span>
              </button>
            </div>
          </div>

          {/* Right Column: Vertical Timeline matching Floria exact border-l & md:ml-24 indent */}
          <div className="lg:col-span-7 flex flex-col gap-12 md:gap-20">
            {/* Step 01 */}
            <div className="relative pl-8 md:pl-16 border-l border-[#E2D8C7] group">
              <div className="absolute top-0 -left-[18px] md:-left-[24px]">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-white border border-[#A8282B] flex items-center justify-center text-xs md:text-sm font-serif font-bold text-[#A8282B] shadow-xs">
                  01
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-3 text-[#111215]">
                Khảo Cứu Điển Chế & Phom Dáng Cổ
              </h3>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-[45ch]">
                Xác định cấu trúc vạt áo nghiêm cẩn: Lập lĩnh ngũ thân (5 thân, thường 5 cúc, dân gian gắn với Ngũ Thường), Nhật bình (nẹp cổ chữ nhật ngũ sắc hoàng cung), Tứ thân (yếm đào thắt lưng Kinh Bắc). Tôn trọng tuyệt đối tỷ lệ nguyên bản.
              </p>
            </div>

            {/* Step 02 with Floria Signature md:ml-24 indent */}
            <div className="relative pl-8 md:pl-16 border-l border-[#E2D8C7] md:ml-24 group">
              <div className="absolute top-0 -left-[18px] md:-left-[24px]">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-white border border-[#C59338] flex items-center justify-center text-xs md:text-sm font-serif font-bold text-[#C59338] shadow-xs">
                  02
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-3 text-[#111215]">
                Ngũ Hành Hòa Sắc Tương Sinh
              </h3>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-[45ch]">
                Ứng dụng thuật ngũ sắc triều Nguyễn: Kim (trắng/bạc), Mộc (xanh lục), Thủy (chàm lam), Hỏa (đỏ son), Thổ (vàng hoàng yến). Thuật toán tự động tính toán tỷ lệ tương sinh và cảnh báo xung khắc màu.
              </p>
            </div>

            {/* Step 03 */}
            <div className="relative pl-8 md:pl-16 border-l border-[#E2D8C7] group">
              <div className="absolute top-0 -left-[18px] md:-left-[24px]">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-white border border-stone-800 flex items-center justify-center text-xs md:text-sm font-serif font-bold text-stone-800 shadow-xs">
                  03
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-3 text-[#111215]">
                Giao Hòa Phụ Kiện & Thử Đồ 3D
              </h3>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-[45ch]">
                Phá cách tinh tế với sneakers chunky, kính mát gọng mỏng, kiềng bạc mỹ nghệ, túi tote vải thô. Mô phỏng 3D Canvas xoay 360 độ kiểm tra chất liệu lụa tơ tằm theo thời gian thực.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FLORIA THE ARCHIVES (GAPLESS 5-GARMENT BENTO GRID WITH VERIFIED IMAGES) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-[#E2D8C7] pb-6">
          <div>
            <span className="text-xs font-serif font-bold tracking-[0.2em] uppercase text-[#A8282B]">
              THE ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#111215] mt-2">
              Ngũ Đại Phẩm Phục Bách Khoa
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 font-sans">
              Khám phá cấu trúc, niên đại và ý nghĩa lịch sử sâu sắc của 5 hệ phục trang cội nguồn Việt Nam.
            </p>
          </div>
          <button
            onClick={() => onNavigate('culture')}
            className="text-xs font-semibold tracking-wider text-[#A8282B] hover:text-stone-900 flex items-center gap-2 self-start md:self-auto uppercase transition-colors"
          >
            <span>Tra cứu Bách khoa Cổ phục</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5-Garment Vertical Portrait Showcase: 100% Full-length View without Cropping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {[
            { garment: aoNguThan, index: '01', color: '#C59338' },
            { garment: aoNhatBinh, index: '02', color: '#6B3074' },
            { garment: aoTuThan, index: '03', color: '#182747' },
            { garment: aoDai, index: '04', color: '#A8282B' },
            { garment: aoBaBa, index: '05', color: '#1D6246' }
          ].map(({ garment, index, color }) => (
            <div
              key={garment.id}
              onClick={() => {
                if (onSelectGarmentToRemix) onSelectGarmentToRemix(garment.id);
                onNavigate('studio');
              }}
              className="relative overflow-hidden rounded-[2rem] group cursor-pointer bg-white border border-[#E2D8C7] shadow-sm hover:border-[#D4AF37] hover:shadow-xl transition-all duration-500 min-h-[480px] lg:min-h-[530px] flex flex-col justify-between"
            >
              {/* Full-length Portrait Image Container */}
              <div className="absolute inset-0 bg-[#F4EFE6] overflow-hidden">
                <img
                  src={garment.image}
                  alt={garment.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/25 via-45% to-transparent pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[inherit] pointer-events-none" />
              </div>

              {/* Top Meta Badges */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#FAF7F2]/95 backdrop-blur-md text-stone-900 border border-[#E2D8C7]">
                  {garment.region}
                </span>
                <span 
                  className="w-7 h-7 rounded-full text-white flex items-center justify-center font-serif font-bold text-xs shadow-sm border border-white/20"
                  style={{ backgroundColor: color }}
                >
                  {index}
                </span>
              </div>

              {/* Bottom Content with Smooth Reveal */}
              <div className="relative z-10 p-5 lg:p-6 w-full flex flex-col justify-end text-white">
                <span className="text-[10px] font-sans font-semibold tracking-wider text-[#DFB058] uppercase mb-1">
                  {garment.era.split('(')[0].trim()}
                </span>
                <h3 className="text-xl lg:text-2xl font-serif font-bold tracking-tight text-white group-hover:text-[#DFB058] transition-colors duration-300">
                  {garment.name}
                </h3>
                <p className="text-stone-300 text-xs line-clamp-2 mt-1.5 leading-relaxed font-sans">
                  {garment.subtitle || garment.description}
                </p>
                <div className="pt-3 flex items-center gap-1.5 text-xs font-semibold text-[#DFB058] group-hover:translate-x-1 transition-transform">
                  <span>Phối {garment.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FLORIA CLARITY & PRAISE (ASYMMETRIC TESTIMONIALS) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-4xl sm:text-6xl font-serif italic text-[#111215] mb-4">
            Thanh Âm.
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-sans tracking-wide">
            Cảm nhận từ những người trẻ đam mê nghệ thuật và văn hóa cội nguồn
          </p>
        </div>

        {/* Floria Exact Staggered Asymmetric Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Card 1: Col-span-4 md:mt-10 */}
          <div className="relative p-8 rounded-3xl bg-white border border-[#E2D8C7] hover:border-[#D4AF37] transition-all group flex flex-col justify-between md:col-span-4 md:mt-10 shadow-xs">
            <Quote className="w-8 h-8 text-[#C59338]/30 mb-6" />
            <div className="flex flex-col h-full">
              <div className="flex gap-1 mb-4 text-[#C59338]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 text-sm md:text-base leading-relaxed mb-8 font-normal">
                "Ấn tượng nhất là thuật toán Ngũ Hành. Phối áo ngũ thân với sneaker nhưng màu sắc vẫn tương sinh theo ngũ thường, tạo cảm giác vô cùng tinh tế."
              </p>
              <div className="flex items-center mt-auto gap-3 pt-4 border-t border-[#F4EFE6]">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-xs font-bold shrink-0">
                  MH
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-stone-900">Minh Hoàng</span>
                  <span className="text-xs text-stone-500 font-serif italic">Gen Z Stylist, Hà Nội</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Col-span-5 md:-mt-6 */}
          <div className="relative p-8 rounded-3xl bg-white border border-[#E2D8C7] hover:border-[#D4AF37] transition-all group flex flex-col justify-between md:col-span-5 md:-mt-6 shadow-xs">
            <Quote className="w-8 h-8 text-[#C59338]/30 mb-6" />
            <div className="flex flex-col h-full">
              <div className="flex gap-1 mb-4 text-[#C59338]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 text-sm md:text-base leading-relaxed mb-8 font-normal">
                "Phần 3D Canvas xoay 360 độ giúp hình dung rõ lớp tà trước tà sau của áo tứ thân và nón quai thao. Một dự án văn hóa công nghệ thực sự đáng tự hào."
              </p>
              <div className="flex items-center mt-auto gap-3 pt-4 border-t border-[#F4EFE6]">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-900 border border-rose-300 flex items-center justify-center text-xs font-bold shrink-0">
                  TM
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-stone-900">Lê Thảo My</span>
                  <span className="text-xs text-stone-500 font-serif italic">Nhiếp ảnh gia Di sản</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Col-span-5 md:col-start-2 md:mt-2 */}
          <div className="relative p-8 rounded-3xl bg-white border border-[#E2D8C7] hover:border-[#D4AF37] transition-all group flex flex-col justify-between md:col-span-5 md:col-start-2 md:mt-2 shadow-xs">
            <Quote className="w-8 h-8 text-[#C59338]/30 mb-6" />
            <div className="flex flex-col h-full">
              <div className="flex gap-1 mb-4 text-[#C59338]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 text-sm md:text-base leading-relaxed mb-8 font-normal">
                "Bảo tồn văn hóa nhưng không khô cứng. Cách trình bày bách khoa điển chế kết hợp cùng giao diện editorial khiến người trẻ muốn khám phá ngay."
              </p>
              <div className="flex items-center mt-auto gap-3 pt-4 border-t border-[#F4EFE6]">
                <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-800 border border-stone-300 flex items-center justify-center text-xs font-bold shrink-0">
                  QB
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-stone-900">Trần Quốc Bảo</span>
                  <span className="text-xs text-stone-500 font-serif italic">Nhà thiết kế Đồ họa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Col-span-5 md:col-start-8 md:-mt-10 */}
          <div className="relative p-8 rounded-3xl bg-white border border-[#E2D8C7] hover:border-[#D4AF37] transition-all group flex flex-col justify-between md:col-span-5 md:col-start-8 md:-mt-10 shadow-xs">
            <Quote className="w-8 h-8 text-[#C59338]/30 mb-6" />
            <div className="flex flex-col h-full">
              <div className="flex gap-1 mb-4 text-[#C59338]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 text-sm md:text-base leading-relaxed mb-8 font-normal">
                "Việt Phục Remix đã mở ra hướng đi mới: biến di sản thành phong cách sống thường nhật, vừa chuẩn chỉ vừa giàu tính thẩm mỹ thị giác đương đại."
              </p>
              <div className="flex items-center mt-auto gap-3 pt-4 border-t border-[#F4EFE6]">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                  AN
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-stone-900">Hoàng An Nhiên</span>
                  <span className="text-xs text-stone-500 font-serif italic">Curator Triển lãm Văn hóa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FLORIA MANIFESTO STATEMENT SECTION (JOURNAL INSPIRATION) */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] border-y border-[#E2D8C7] relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center relative z-10">
          <div className="mb-6 w-14 h-14 rounded-full bg-white border border-[#D4AF37]/40 flex items-center justify-center text-[#C59338] shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111215] max-w-[22ch] leading-tight mb-6">
            Không bao giờ là phục trang rập khuôn.
          </h2>
          <p className="text-base sm:text-lg text-stone-600 w-full max-w-[50ch] leading-relaxed mx-auto font-sans font-normal">
            Mỗi bản phối tại Việt Phục Remix là một cuộc đối thoại văn minh giữa quy chuẩn nghiêm cẩn nghìn xưa và bản lĩnh thời trang cá nhân của thế hệ trẻ.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. OCCASIONS GRID (BỐI CẢNH LỄ HỘI - DARK SILK SALON) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#111215] via-[#1A181B] to-[#111215] text-white p-8 sm:p-12 relative overflow-hidden border border-[#D4AF37]/30 shadow-editorial-xl">
          <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-[#A8282B]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mb-8">
            <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#DFB058]">
              KHÔNG GIAN DIỆN PHỤC
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-1.5">
              Bạn chọn cổ phục cho khoảnh khắc nào?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed font-sans">
              Mỗi không gian mang một tinh thần và độ trang trọng riêng biệt. Chọn bối cảnh để hệ thống tự động cân chỉnh độ hòa sắc ngũ hành tương thích.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
            {OCCASIONS.map((occ) => (
              <button
                key={occ.id}
                onClick={() => {
                  if (onSelectOccasionToRemix) onSelectOccasionToRemix(occ.id);
                  onNavigate('studio');
                }}
                className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 hover:bg-[#A8282B]/90 border border-stone-800 hover:border-[#D4AF37]/60 transition-all text-left flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/10 text-stone-300 mb-3 inline-block">
                    {occ.tag}
                  </span>
                  <h4 className="font-serif font-bold text-base text-white transition-colors">
                    {occ.name}
                  </h4>
                </div>
                <div className="flex items-center justify-between mt-6 text-[11px] text-[#DFB058] group-hover:text-white font-medium">
                  <span className="font-sans">Chọn bối cảnh</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FLORIA STUDIO ARCHIVE NEWSLETTER CAPSULE */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[3rem] p-8 sm:p-16 bg-gradient-to-r from-[#111215] via-[#241416] to-[#111215] border border-[#D4AF37]/30 text-white text-center overflow-hidden shadow-editorial-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C59338]/[0.08] rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#DFB058]">
              JOIN THE STUDIO ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Cộng Đồng Stylist Cổ Phục Đương Đại
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-sans font-light">
              Đăng ký để nhận định kỳ các bản tin khảo cứu điển chế hoàng gia, Lookbook ba miền tuyển chọn và cập nhật phụ kiện remix mới nhất mỗi mùa lễ hội.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 inline-flex items-center gap-2 text-sm text-white">
                <CheckCircle2 className="w-5 h-5 text-[#DFB058]" />
                <span>Cảm ơn bạn! Chúng tôi đã ghi nhận đăng ký của bạn vào Studio Archive.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="pt-4 max-w-md mx-auto">
                <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl focus-within:border-[#DFB058] transition-colors shadow-xl">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Nhập địa chỉ email của bạn..."
                    className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="h-10 px-5 rounded-full bg-[#C59338] hover:bg-[#DFB058] text-stone-950 font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <span>Tham Gia</span>
                    <Send className="w-3 h-3 text-stone-950" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
