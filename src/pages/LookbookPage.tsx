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
  const [selectedOccasionFilter, setSelectedOccasionFilter] = useState<string>('all');
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
    // Search query match
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

    // Region filter
    if (selectedRegion !== 'all') {
      if (look.region !== selectedRegion) return false;
    }

    // Style filter
    if (selectedStyleFilter !== 'all') {
      if (look.styleId !== selectedStyleFilter) return false;
    }

    // Occasion filter
    if (selectedOccasionFilter !== 'all') {
      if (look.occasionId !== selectedOccasionFilter) return false;
    }

    return true;
  });

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedStyleFilter('all');
    setSelectedOccasionFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Title Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-heritage-border/70 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-red font-mono">
            Heritage Gallery
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            Lookbook Việt
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Bộ sưu tập các outfit Việt phục cách tân được tuyển chọn từ các bạn trẻ yêu cổ phục khắp ba miền Bắc — Trung — Nam.
          </p>
        </div>

        <button
          onClick={() => onNavigate('studio')}
          className="px-5 py-2.5 rounded-full bg-heritage-red hover:bg-heritage-red-dark text-white font-bold text-xs tracking-wide shadow-red-glow flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tự phối Look mới</span>
        </button>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white rounded-3xl p-5 border border-heritage-border/80 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên look, loại trang phục (áo dài, ngũ thân...), phong cách, sự kiện..."
            className="w-full text-xs bg-stone-50 pl-11 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-hidden focus:border-stone-900 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills Rows */}
        <div className="space-y-3 pt-1">
          {/* Region Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] shrink-0">
              Vùng miền:
            </span>
            {[
              { id: 'all', label: 'Tất cả vùng' },
              { id: 'Bắc Bộ', label: 'Miền Bắc' },
              { id: 'Trung Bộ', label: 'Miền Trung' },
              { id: 'Nam Bộ', label: 'Miền Nam' },
              { id: 'Toàn quốc', label: 'Toàn quốc' }
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-heritage-charcoal text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Style Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] shrink-0">
              Phong cách:
            </span>
            <button
              onClick={() => setSelectedStyleFilter('all')}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedStyleFilter === 'all'
                  ? 'bg-heritage-charcoal text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              Tất cả Style
            </button>
            {STYLES.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStyleFilter(st.id)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedStyleFilter === st.id
                    ? 'bg-heritage-charcoal text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
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
                className="bg-white rounded-3xl overflow-hidden border border-heritage-border/80 shadow-sm hover:shadow-editorial transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Photo cover */}
                  <div className="relative h-72 overflow-hidden bg-stone-100">
                    <img
                      src={look.imageUrl}
                      alt={look.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Top badging */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-stone-900 shadow-sm">
                        {look.region}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-900/80 backdrop-blur-md text-white">
                        {occasion?.name}
                      </span>
                    </div>

                    {/* Heart button */}
                    <button
                      onClick={() => handleToggleLike(look.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-md text-stone-800 hover:text-rose-500 shadow-sm transition-colors"
                      aria-label="Thích look"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked ? 'text-rose-500 fill-current' : 'text-stone-700'
                        }`}
                      />
                    </button>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        {garment?.name} • {style?.name}
                      </span>
                      <h3 className="font-serif text-lg font-bold line-clamp-1 mt-0.5 leading-snug">
                        {look.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {look.culturalStory}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                      <span>Người phối: <strong className="text-stone-700">{look.author}</strong></span>
                      <span>{look.likes + (isLiked ? 1 : 0)} lượt yêu thích</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onRemixLook(look)}
                    className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-heritage-red text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-heritage-gold" />
                    <span>Phối lại Look</span>
                  </button>

                  <button
                    onClick={() => handleAddToCompare(look)}
                    className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-stone-200"
                  >
                    <Scale className="w-3.5 h-3.5 text-heritage-gold" />
                    <span>So sánh</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Search / Filter State */
        <div className="bg-white rounded-3xl p-12 text-center border border-heritage-border max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Không tìm thấy Look phù hợp
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Không có kết quả nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn. Hãy thử đổi từ khóa hoặc xóa bộ lọc.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-full bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};
