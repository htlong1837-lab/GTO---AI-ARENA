import React, { useState } from 'react';
import { UserProfile, Outfit } from '../types/outfit';
import { GARMENTS } from '../data/garments';
import { COLORS } from '../data/colors';
import { STYLES } from '../data/styles';
import { StorageService } from '../services/storageService';
import { useToast } from '../context/ToastContext';
import {
  Bookmark,
  History,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Trash2,
  Scale,
  Edit2,
  Check
} from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (tab: string) => void;
  onRemixOutfit: (outfit: Outfit) => void;
  onRefreshCompareCount: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigate,
  onRemixOutfit,
  onRefreshCompareCount
}) => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [activeTab, setActiveTab] = useState<'saved' | 'history' | 'data'>('saved');

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editTitle, setEditTitle] = useState(profile.title);
  const [editBio, setEditBio] = useState(profile.bio);

  // Import JSON Modal
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      showToast({ type: 'warning', title: 'Tên không được để trống' });
      return;
    }
    const updated = {
      ...profile,
      name: editName.trim(),
      title: editTitle.trim(),
      bio: editBio.trim()
    };
    StorageService.saveProfile(updated);
    setProfile(updated);
    setIsEditing(false);
    showToast({ type: 'success', title: 'Đã cập nhật hồ sơ cá nhân!' });
  };

  const handleDeleteOutfit = (outfitId: string) => {
    const updated = StorageService.deleteOutfit(outfitId);
    setProfile((prev) => ({ ...prev, savedOutfits: updated }));
    onRefreshCompareCount();
    showToast({ type: 'info', title: 'Đã xóa Look khỏi tủ đồ' });
  };

  const handleAddToCompare = (outfit: Outfit) => {
    const res = StorageService.addToCompare(outfit);
    onRefreshCompareCount();
    if (res.success) {
      showToast({ type: 'success', title: 'Đã thêm vào bảng so sánh!' });
    } else {
      showToast({ type: 'warning', title: res.message });
    }
  };

  const handleExport = () => {
    const jsonStr = StorageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `viet-phuc-remix-profile-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({ type: 'success', title: 'Đã xuất dữ liệu tủ đồ JSON thành công!' });
  };

  const handleImport = () => {
    setImportError(null);
    if (!importJsonText.trim()) {
      setImportError('Vui lòng dán chuỗi JSON hợp lệ.');
      return;
    }

    const res = StorageService.importData(importJsonText);
    if (res.success) {
      setProfile(StorageService.getProfile());
      setImportJsonText('');
      onRefreshCompareCount();
      showToast({ type: 'success', title: 'Đã nhập dữ liệu thành công!' });
    } else {
      setImportError(res.error || 'Lỗi dữ liệu JSON');
    }
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu và đặt lại mặc định?')) {
      StorageService.resetAll();
      setProfile(StorageService.getProfile());
      onRefreshCompareCount();
      showToast({ type: 'info', title: 'Đã đặt lại dữ liệu mặc định.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card: Editorial Fashion Passport */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2D8C7] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* User Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-md shrink-0 bg-[#F4EFE6]">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* User Info */}
            <div className="space-y-1">
              {!isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111215]">
                      {profile.name}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-[#FAF7F2] transition-colors"
                      aria-label="Chỉnh sửa thông tin"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-serif font-bold text-[#A8282B] uppercase tracking-[0.2em]">
                    {profile.title}
                  </p>
                  <p className="text-xs text-stone-600 max-w-md mt-1 leading-relaxed font-sans">
                    {profile.bio}
                  </p>
                </>
              ) : (
                /* Inline Edit form */
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-sm font-bold bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E2D8C7] w-full"
                    placeholder="Tên của bạn"
                  />
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-xs bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E2D8C7] w-full"
                    placeholder="Danh hiệu phong cách"
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={2}
                    className="text-xs bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E2D8C7] w-full font-sans"
                    placeholder="Giới thiệu bản thân..."
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSaveProfile}
                      className="px-3.5 py-1 rounded-lg bg-[#18181B] text-white text-xs font-medium flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 text-[#DFB058]" />
                      <span>Lưu</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3.5 py-1 rounded-lg bg-[#FAF7F2] text-stone-700 text-xs font-medium border border-[#E2D8C7]"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Micro Stats Counter */}
          <div className="flex items-center gap-5 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#F4EFE6] w-full sm:w-auto justify-around sm:justify-start">
            <div className="text-center">
              <div className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
                {profile.savedOutfits.length}
              </div>
              <div className="text-[10px] text-stone-500 font-serif uppercase tracking-wider mt-0.5">Look Đã Lưu</div>
            </div>
            <div className="h-8 w-px bg-[#E2D8C7]" />
            <div className="text-center">
              <div className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
                {profile.history.length}
              </div>
              <div className="text-[10px] text-stone-500 font-serif uppercase tracking-wider mt-0.5">Lịch Sử Phối</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-between border-b border-[#E2D8C7] pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-[#18181B] text-[#FAF7F2] font-semibold shadow-xs'
                : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EDE6D8]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Tủ đồ lưu trữ ({profile.savedOutfits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#18181B] text-[#FAF7F2] font-semibold shadow-xs'
                : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EDE6D8]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch sử phối ({profile.history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'data'
                ? 'bg-[#18181B] text-[#FAF7F2] font-semibold shadow-xs'
                : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EDE6D8]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Dữ liệu & Sao lưu</span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('studio')}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-[#A8282B] to-[#741416] hover:from-[#741416] hover:to-[#A8282B] text-white text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-silk transition-all border border-[#D4AF37]/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#DFB058]" />
          <span>Tạo Look Mới</span>
        </button>
      </div>

      {/* TAB 1: SAVED OUTFITS */}
      {activeTab === 'saved' && (
        <div>
          {profile.savedOutfits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.savedOutfits.map((outfit) => {
                const garment = GARMENTS.find((g) => g.id === outfit.garmentId);
                const color = COLORS.find((c) => c.id === outfit.colorId);
                const style = STYLES.find((s) => s.id === outfit.styleId);

                return (
                  <div
                    key={outfit.id}
                    className="bg-white rounded-2xl p-5 border border-[#E2D8C7] hover:border-[#D4AF37] shadow-xs hover:shadow-editorial transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shadow-xs border border-black/10"
                            style={{ backgroundColor: color?.hex }}
                          />
                          <span className="text-xs font-serif font-bold text-stone-900">
                            {garment?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {outfit.gender && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                outfit.gender === 'male'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              {outfit.gender === 'male' ? 'Nam ♂' : 'Nữ ♀'}
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style?.badgeColor}`}>
                            {style?.name}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-2 leading-snug">
                        {outfit.name}
                      </h3>

                      <div className="text-[11px] text-stone-400 mt-2 font-mono">
                        Ngày tạo: {new Date(outfit.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 mt-4 border-t border-[#F4EFE6] grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => onRemixOutfit(outfit)}
                        className="col-span-2 py-2 rounded-lg bg-[#18181B] hover:bg-[#A8282B] text-white text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#DFB058]" />
                        <span>Phối lại</span>
                      </button>

                      <button
                        onClick={() => handleAddToCompare(outfit)}
                        className="py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] text-stone-700 text-xs font-medium transition-colors flex items-center justify-center border border-[#E2D8C7]"
                        title="Thêm vào so sánh"
                      >
                        <Scale className="w-3.5 h-3.5 text-[#C59338]" />
                      </button>

                      <button
                        onClick={() => handleDeleteOutfit(outfit.id)}
                        className="py-2 rounded-lg bg-[#FAF7F2] hover:bg-rose-50 hover:text-[#A8282B] text-stone-500 text-xs font-medium transition-colors flex items-center justify-center border border-[#E2D8C7]"
                        title="Xóa outfit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E2D8C7] max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] text-[#C59338] flex items-center justify-center mx-auto border border-[#D4AF37]/30">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Tủ đồ còn trống</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">
                Bạn chưa lưu outfit nào. Hãy vào Xưởng may để tự tay sáng tạo bản phối yêu thích của bạn!
              </p>
              <button
                onClick={() => onNavigate('studio')}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A8282B] to-[#741416] hover:from-[#741416] hover:to-[#A8282B] text-white font-medium text-xs shadow-silk transition-all border border-[#D4AF37]/30"
              >
                Bắt đầu phối đồ ngay
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E2D8C7] shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Lịch sử các phiên phối gần đây
          </h3>
          {profile.history.length > 0 ? (
            <div className="divide-y divide-[#F4EFE6]">
              {profile.history.map((h, i) => {
                const garment = GARMENTS.find((g) => g.id === h.garmentId);
                const color = COLORS.find((c) => c.id === h.colorId);
                return (
                  <div
                    key={i}
                    className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-[#FAF7F2] p-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                        style={{ backgroundColor: color?.hex }}
                      />
                      <div>
                        <div className="font-serif font-bold text-stone-900 text-sm">{garment?.name}</div>
                        <div className="text-[11px] text-stone-500 font-sans">
                          {color?.vietnameseName} • {new Date(h.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, {new Date(h.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-400 font-serif italic">
              Chưa có lịch sử phiên phối nào.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DATA & BACKUP */}
      {activeTab === 'data' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E2D8C7] shadow-xs space-y-6 max-w-2xl">
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Sao Lưu & Khôi Phục Dữ Liệu Tủ Đồ
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Toàn bộ dữ liệu outfit, bộ sưu tập cá nhân và điểm số hài hòa được lưu trữ an toàn trong LocalStorage trình duyệt của bạn. Bạn có thể xuất file JSON để lưu giữ hoặc chuyển sang thiết bị khác.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleExport}
              className="p-4 rounded-xl border border-[#E2D8C7] bg-[#FAF7F2] hover:bg-[#F4EFE6] hover:border-[#D4AF37] transition-all text-left flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif font-bold text-stone-900 text-xs">Xuất Dữ Liệu (.JSON)</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Tải file lưu trữ về máy</div>
              </div>
            </button>

            <button
              onClick={handleReset}
              className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition-all text-left flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-[#A8282B] flex items-center justify-center shrink-0 border border-rose-200">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif font-bold text-[#A8282B] text-xs">Đặt Lại Mặc Định</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Xóa sạch toàn bộ dữ liệu</div>
              </div>
            </button>
          </div>

          {/* Import JSON Form */}
          <div className="pt-4 border-t border-[#F4EFE6] space-y-3">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-stone-800">
              Nhập Dữ Liệu Từ File JSON
            </h4>
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Dán nội dung chuỗi JSON dữ liệu đã sao lưu vào đây..."
              rows={4}
              className="w-full text-xs font-mono p-3 rounded-xl border border-[#E2D8C7] bg-[#FAF7F2] focus:outline-none focus:border-[#D4AF37]"
            />
            {importError && (
              <div className="text-xs text-[#A8282B] font-medium">{importError}</div>
            )}
            <button
              onClick={handleImport}
              className="px-5 py-2.5 rounded-full bg-[#18181B] hover:bg-[#A8282B] text-white text-xs font-medium tracking-wide transition-colors shadow-xs"
            >
              Nhập & Khôi Phục Dữ Liệu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
