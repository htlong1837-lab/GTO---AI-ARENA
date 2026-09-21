import React, { useState, useRef } from 'react';
import { CURATED_LOOKBOOKS } from '../data/curatedLookbooks';
import { GARMENTS } from '../data/garments';
import { OCCASIONS } from '../data/occasions';
import { STYLES } from '../data/styles';
import { CuratedLook } from '../types/outfit';
import { StorageService } from '../services/storageService';
import { useToast } from '../context/ToastContext';
import { VietnamMapExplorer } from '../components/lookbook/VietnamMapExplorer';
import {
  Search,
  Sparkles,
  Scale,
  Heart,
  X,
  Compass,
  ArrowRight,
  Filter,
  Palette
} from 'lucide-react';

interface LookbookPageProps {
  onRemixLook: (look: CuratedLook) => void;
  onNavigate: (tab: string) => void;
  onRefreshCompareCount: () => void;
}

export const LookbookPage: React.FC<LookbookPageProps> = ({
  onRemixLook,
  onNavigate,
  onRefreshCompareCount
}) => {
  const { showToast } = useToast();
  const galleryRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('all');
  const [likedLookIds, setLikedLookIds] = useState<string[]>([]);

  const handleToggleLike = (lookId: string) => {
    setLikedLookIds((prev) =>
      prev.includes(lookId) ? prev.filter((id) => id !== lookId) : [...prev, lookId]
    );
  };

  const handleAddToCompare = (look: CuratedLook) => {
    const outfit = {
      id: look.id,
      name: look.name,
      garmentId: look.garmentId,
      occasionId: look.occasionId,
      colorId: look.colorId,
      accessoryIds: look.accessoryIds,
      styleId: look.styleId,
      createdAt: new Date().toISOString()
    };

    const res = StorageService.addToCompare(outfit);
    onRefreshCompareCount();

    if (res.success) {
      showToast({
        type: 'success',
        title: 'Đã thêm vào bảng so sánh',
        message: `${look.name} đã sẵn sàng trên ma trận đối chiếu.`
      });
    } else {
      showToast({
        type: 'warning',
        title: 'Bảng so sánh',
        message: res.message
      });
    }
  };

  const scrollToGallery = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMapSelectRegion = (region: string) => {
    setSelectedRegion(region);
  };

  const filteredLooks = CURATED_LOOKBOOKS.filter((look) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const garment = GARMENTS.find((g) => g.id === look.garmentId);
      const style = STYLES.find((s) => s.id === look.styleId);
      const matchName = look.name.toLowerCase().includes(q);
      const matchTagline = look.tagline.toLowerCase().includes(q);
      const matchGarment = garment?.name.toLowerCase().includes(q);
      const matchStyle = style?.name.toLowerCase().includes(q);
      if (!matchName && !matchTagline && !matchGarment && !matchStyle) {
        return false;
      }
    }

    if (selectedRegion !== 'all' && look.region !== selectedRegion && look.region !== 'Toàn quốc') {
      return false;
    }

    if (selectedStyleFilter !== 'all' && look.styleId !== selectedStyleFilter) {
      return false;
    }

    return true;
  });

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedStyleFilter('all');
  };

  return (
    <main className="overflow-x-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-20">
        {/* ATTENTION (HERO): Cinematic Center Layout with Ultra-wide 2-line Heading */}
        <section className="text-center space-y-8 max-w-5xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2D8C7] shadow-xs text-xs font-semibold tracking-widest text-[#741416] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C59338]" />
            <span>Bộ Sưu Tập Di Sản Việt Phục</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#111215] tracking-tight leading-[1.15] max-w-5xl mx-auto">
            Giao thoa cổ phục ba miền
            <span
              className="inline-block w-14 sm:w-20 h-7 sm:h-10 rounded-full align-middle bg-cover bg-center mx-2.5 border border-[#DFB058]/60 shadow-xs"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80")'
              }}
            />
            cùng nhịp sống đương đại
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Khám phá các bản phối cách tân từ Bắc Bộ, Trung Bộ đến Nam Bộ. Tương tác trực tiếp trên bản đồ chữ S để cảm nhận phong vị văn hóa từng miền đất.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('studio')}
              className="px-6 py-3.5 rounded-full bg-[#111215] hover:bg-[#9B1D20] text-[#FAF7F2] font-medium text-xs tracking-wider transition-colors duration-300 flex items-center gap-2.5 shadow-silk"
            >
              <Sparkles className="w-4 h-4 text-[#DFB058]" />
              <span>Tự Sáng Tạo Look Mùa Lễ Hội</span>
            </button>

            <button
              onClick={scrollToGallery}
              className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F4EFE6] text-stone-800 font-medium text-xs tracking-wider transition-colors duration-300 flex items-center gap-2 border border-[#E2D8C7]"
            >
              <span>Xem Thư Viện Lookbook</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C59338]" />
            </button>
          </div>
        </section>

        {/* INTEREST: S-Curve Vietnam Map Explorer Section */}
        <section className="w-full">
          <VietnamMapExplorer
            activeRegion={selectedRegion}
            onSelectRegion={handleMapSelectRegion}
            onScrollToGallery={scrollToGallery}
            onSelectLook={onRemixLook}
          />
        </section>

        {/* DESIRE: Curated Looks Filtering and Gapless Bento Grid */}
        <section ref={galleryRef} className="space-y-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E2D8C7]">
            <div>
              <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#9B1D20]">
                Thư Viện Phục Trang
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111215] mt-1">
                Bản Phối Tiêu Biểu
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl font-sans">
                Chọn lọc từ những thiết kế thời trang sáng tạo, kết hợp giữa chất liệu truyền thống và tư duy phối đồ thế hệ mới.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-stone-500 bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E2D8C7]">
                Hiển thị {filteredLooks.length} tác phẩm
              </span>
            </div>
          </div>

          {/* Search & Style Filter Bar */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2D8C7] shadow-xs space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên look, trang phục (áo dài, ngũ thân...), sự kiện hoặc phong cách..."
                className="w-full text-xs bg-[#FAF7F2] pl-11 pr-10 py-3 rounded-xl border border-[#E2D8C7] focus:outline-none focus:border-[#DFB058] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="font-serif font-bold text-stone-500 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#C59338]" />
                  <span>Vùng miền:</span>
                </span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'Bắc Bộ', label: 'Bắc Bộ' },
                  { id: 'Trung Bộ', label: 'Trung Bộ' },
                  { id: 'Nam Bộ', label: 'Nam Bộ' }
                ].map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                      selectedRegion === reg.id
                        ? 'bg-[#111215] text-[#FAF7F2] font-semibold shadow-xs'
                        : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EDE6D8]'
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="font-serif font-bold text-stone-500 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-[#C59338]" />
                  <span>Phong cách:</span>
                </span>
                <button
                  onClick={() => setSelectedStyleFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                    selectedStyleFilter === 'all'
                      ? 'bg-[#111215] text-[#FAF7F2] font-semibold shadow-xs'
                      : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EDE6D8]'
                  }`}
                >
                  Tất cả phong cách
                </button>
                {STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStyleFilter(st.id)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                      selectedStyleFilter === st.id
                        ? 'bg-[#111215] text-[#FAF7F2] font-semibold shadow-xs'
                        : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EDE6D8]'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gapless Bento Grid with grid-flow-dense */}
          {filteredLooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-dense">
              {filteredLooks.map((look, index) => {
                const garment = GARMENTS.find((g) => g.id === look.garmentId);
                const style = STYLES.find((s) => s.id === look.styleId);
                const occasion = OCCASIONS.find((o) => o.id === look.occasionId);
                const isLiked = likedLookIds.includes(look.id);
                const isFeatured = index === 0 && filteredLooks.length > 2;

                return (
                  <div
                    key={look.id}
                    className={`bg-white rounded-2xl overflow-hidden border border-[#E2D8C7] hover:border-[#DFB058] shadow-xs hover:shadow-editorial transition-all duration-500 group flex flex-col justify-between ${
                      isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
                    }`}
                  >
                    <div>
                      {/* Media Card */}
                      <div
                        className={`relative overflow-hidden bg-stone-900 ${
                          isFeatured ? 'h-80 sm:h-96' : 'h-72'
                        }`}
                      >
                        <img
                          src={look.imageUrl}
                          alt={look.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FAF7F2]/95 backdrop-blur-md text-stone-900 border border-[#E2D8C7] shadow-xs">
                            {look.region}
                          </span>
                          <span className="px-3 py-1 rounded-full text-[10px] font-medium bg-[#111215]/80 backdrop-blur-md text-[#FAF7F2]">
                            {occasion?.name}
                          </span>
                        </div>

                        {/* Favorite button */}
                        <button
                          onClick={() => handleToggleLike(look.id)}
                          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-800 hover:text-[#9B1D20] shadow-xs transition-colors"
                          aria-label="Yêu thích bản phối"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isLiked ? 'text-[#9B1D20] fill-current' : 'text-stone-700'
                            }`}
                          />
                        </button>

                        {/* Bottom Overlay Info */}
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB058]">
                            {garment?.name} | {style?.name}
                          </span>
                          <h3
                            className={`font-serif font-bold line-clamp-1 mt-1 leading-snug ${
                              isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl'
                            }`}
                          >
                            {look.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed font-sans">
                          {look.culturalStory}
                        </p>

                        <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-[#F4EFE6] font-sans">
                          <span className="font-serif italic">
                            Biên tập: <strong className="text-stone-800 font-serif not-italic">{look.author}</strong>
                          </span>
                          <span>{look.likes + (isLiked ? 1 : 0)} lượt yêu thích</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => onRemixLook(look)}
                        className="py-2.5 px-3 rounded-xl bg-[#111215] hover:bg-[#9B1D20] text-white text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#DFB058]" />
                        <span>Phối Lại Look</span>
                      </button>

                      <button
                        onClick={() => handleAddToCompare(look)}
                        className="py-2.5 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] text-stone-800 text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-[#E2D8C7]"
                      >
                        <Scale className="w-3.5 h-3.5 text-[#C59338]" />
                        <span>So Sánh</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E2D8C7] max-w-lg mx-auto space-y-5 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#9B1D20] flex items-center justify-center mx-auto border border-[#E2D8C7]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Không Tìm Thấy Bản Phối Phù Hợp
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Không có kết quả nào khớp với bộ lọc hoặc từ khóa tìm kiếm hiện tại.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#111215] text-[#FAF7F2] font-medium text-xs hover:bg-stone-800 transition-colors"
              >
                Xóa Tất Cả Bộ Lọc
              </button>
            </div>
          )}
        </section>

        {/* ACTION: High-contrast Call to Action Banner */}
        <section className="rounded-3xl bg-[#111215] text-white p-8 sm:p-12 relative overflow-hidden border border-white/10 shadow-editorial-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C59338]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-serif font-bold uppercase tracking-[0.25em] text-[#DFB058]">
                Khởi Nguồn Sáng Tạo
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Bạn muốn tạo lookbook mang dấu ấn cá nhân của riêng mình?
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                Trải nghiệm Studio Phối Đồ Thông Minh với kho phục trang cổ điển và phụ kiện phong phú, ứng dụng công nghệ Gemini AI tạo ảnh editorial chuyên nghiệp.
              </p>
            </div>

            <button
              onClick={() => onNavigate('studio')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#DFB058] to-[#C59338] hover:from-[#C59338] hover:to-[#DFB058] text-[#111215] font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-gold-glow shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#741416]" />
              <span>Mở Studio Phối Đồ</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
