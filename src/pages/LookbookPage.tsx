import React, { useState } from 'react';
import { CURATED_LOOKBOOKS } from '../data/curatedLookbooks';
import { GARMENTS } from '../data/garments';
import { OCCASIONS } from '../data/occasions';
import { STYLES } from '../data/styles';
import { CuratedLook } from '../types/outfit';
import { StorageService } from '../services/storageService';
import { useToast } from '../context/ToastContext';
import { Search, Sparkles, Scale, Heart, X, Compass } from 'lucide-react';

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
        title: 'Đã thêm vào bảng so sánh!',
        message: `${look.name} đã sẵn sàng trên ma trận so sánh.`
      });
    } else {
      showToast({
        type: 'warning',
        title: 'Bảng so sánh',
        message: res.message
      });
    }
  };

  // Filter logic
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

    if (selectedRegion !== 'all' && look.region !== selectedRegion) return false;
    if (selectedStyleFilter !== 'all' && look.styleId !== selectedStyleFilter) return false;

    return true;
  });

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedStyleFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Title Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2D8C7] pb-6">
        <div>
          <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#A8282B]">
            BỘ SƯU TẬP DI SẢN BA MIỀN
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#111215] mt-1.5">
            Lookbook Việt Phục
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl font-sans">
            Tuyển tập các bản phối cổ phục cách tân mang dấu ấn văn hóa ba miền Bắc — Trung — Nam, giao thoa giữa hồn xưa và cá tính đương đại.
          </p>
        </div>

        <button
          onClick={() => onNavigate('studio')}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#A8282B] to-[#741416] hover:from-[#741416] hover:to-[#A8282B] text-white font-medium text-xs tracking-wide shadow-silk flex items-center gap-2 self-start md:self-auto transition-all border border-[#D4AF37]/30"
        >
          <Sparkles className="w-4 h-4 text-[#DFB058]" />
          <span>Tự Sáng Tạo Look Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2D8C7] shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên look, loại trang phục (áo dài, ngũ thân...), phong cách, sự kiện..."
            className="w-full text-xs bg-[#FAF7F2] pl-11 pr-4 py-3 rounded-xl border border-[#E2D8C7] focus:outline-none focus:border-[#D4AF37] transition-colors"
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

        {/* Filter Pills Rows */}
        <div className="space-y-3 pt-1">
          {/* Region Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-serif font-bold text-stone-500 uppercase tracking-wider text-[10px] shrink-0">
              Vùng miền:
            </span>
            {[
              { id: 'all', label: 'Tất cả vùng' },
              { id: 'Bắc Bộ', label: 'Bắc Bộ' },
              { id: 'Trung Bộ', label: 'Trung Bộ' },
              { id: 'Nam Bộ', label: 'Nam Bộ' },
              { id: 'Toàn quốc', label: 'Toàn quốc' }
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  selectedRegion === reg.id
                    ? 'bg-[#18181B] text-[#FAF7F2] font-semibold shadow-xs'
                    : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EDE6D8]'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Style Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-serif font-bold text-stone-500 uppercase tracking-wider text-[10px] shrink-0">
              Phong cách:
            </span>
            <button
              onClick={() => setSelectedStyleFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                selectedStyleFilter === 'all'
                  ? 'bg-[#18181B] text-[#FAF7F2] font-semibold shadow-xs'
                  : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EDE6D8]'
              }`}
            >
              Tất cả Style
            </button>
            {STYLES.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStyleFilter(st.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  selectedStyleFilter === st.id
                    ? 'bg-[#18181B] text-[#FAF7F2] font-semibold shadow-xs'
                    : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EDE6D8]'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredLooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLooks.map((look) => {
            const garment = GARMENTS.find((g) => g.id === look.garmentId);
            const style = STYLES.find((s) => s.id === look.styleId);
            const occasion = OCCASIONS.find((o) => o.id === look.occasionId);
            const isLiked = likedLookIds.includes(look.id);

            return (
              <div
                key={look.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E2D8C7] hover:border-[#D4AF37] shadow-xs hover:shadow-editorial transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Photo cover */}
                  <div className="relative h-72 overflow-hidden bg-[#F4EFE6]">
                    <img
                      src={look.imageUrl}
                      alt={look.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-black/20 pointer-events-none" />

                    {/* Top badging */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FAF7F2]/95 backdrop-blur-md text-stone-900 border border-[#E2D8C7] shadow-xs">
                        {look.region}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#111215]/80 backdrop-blur-md text-[#FAF7F2]">
                        {occasion?.name}
                      </span>
                    </div>

                    {/* Heart button */}
                    <button
                      onClick={() => handleToggleLike(look.id)}
                      className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 backdrop-blur-md text-stone-800 hover:text-[#A8282B] shadow-xs transition-colors"
                      aria-label="Thích look"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked ? 'text-[#A8282B] fill-current' : 'text-stone-700'
                        }`}
                      />
                    </button>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB058]">
                        {garment?.name} • {style?.name}
                      </span>
                      <h3 className="font-serif text-xl font-bold line-clamp-1 mt-0.5 leading-snug">
                        {look.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans">
                      {look.culturalStory}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-[#F4EFE6] font-sans">
                      <span className="font-serif italic">Biên tập: <strong className="text-stone-800 font-serif not-italic">{look.author}</strong></span>
                      <span>{look.likes + (isLiked ? 1 : 0)} lượt yêu thích</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onRemixLook(look)}
                    className="py-2.5 px-3 rounded-lg bg-[#18181B] hover:bg-[#A8282B] text-white text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#DFB058]" />
                    <span>Phối lại Look</span>
                  </button>

                  <button
                    onClick={() => handleAddToCompare(look)}
                    className="py-2.5 px-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] text-stone-800 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-[#E2D8C7]"
                  >
                    <Scale className="w-3.5 h-3.5 text-[#C59338]" />
                    <span>So sánh</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Search / Filter State */
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2D8C7] max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] text-[#A8282B] flex items-center justify-center mx-auto border border-[#D4AF37]/30">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Không tìm thấy Look phù hợp
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed font-sans">
            Không có kết quả nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn. Hãy thử thay đổi bộ lọc.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-full bg-[#18181B] text-white font-medium text-xs hover:bg-stone-800 transition-colors"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};
