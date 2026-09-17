import React, { useState, useEffect } from 'react';
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


  useEffect(() => {
    setProfile(StorageService.getProfile());
  }, []);

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
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-border/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* User Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-heritage-gold shadow-md shrink-0 bg-stone-100">
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
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                      {profile.name}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      aria-label="Chỉnh sửa thông tin"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-heritage-red uppercase tracking-wider">
                    {profile.title}
                  </p>
                  <p className="text-xs text-stone-500 max-w-md mt-1 leading-relaxed">
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
                    className="text-sm font-bold bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-300 w-full"
                    placeholder="Tên của bạn"
                  />
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-xs bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-300 w-full"
                    placeholder="Danh hiệu phong cách"
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={2}
                    className="text-xs bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-300 w-full"
                    placeholder="Giới thiệu bản thân..."
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSaveProfile}
                      className="px-3 py-1 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 rounded-lg bg-stone-100 text-stone-600 text-xs font-semibold"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Micro Stats Counter */}
          <div className="flex items-center gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-stone-100 w-full sm:w-auto justify-around sm:justify-start">
            <div className="text-center">
              <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                {profile.savedOutfits.length}
              </div>
              <div className="text-[11px] text-stone-400 font-medium">Look Đã Lưu</div>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div className="text-center">
              <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                {profile.history.length}
              </div>
              <div className="text-[11px] text-stone-400 font-medium">Lịch Sử Phối</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-between border-b border-heritage-border/70 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Tủ đồ đã lưu ({profile.savedOutfits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch sử phối đồ ({profile.history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'data'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Dữ liệu & Sao lưu</span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('studio')}
          className="px-4 py-2 rounded-full bg-heritage-red hover:bg-heritage-red-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>Tạo Look mới</span>
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
                    className="bg-white rounded-3xl p-5 border border-heritage-border/80 shadow-sm hover:shadow-editorial transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shadow-xs border border-black/10"
                            style={{ backgroundColor: color?.hex }}
                          />
                          <span className="text-xs font-bold text-stone-800">
                            {garment?.name}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style?.badgeColor}`}>
                          {style?.name}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-2 leading-snug">
                        {outfit.name}
                      </h3>

                      <div className="text-[11px] text-stone-400 mt-2">
                        Ngày tạo: {new Date(outfit.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 mt-4 border-t border-stone-100 grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => onRemixOutfit(outfit)}
                        className="col-span-2 py-2 rounded-xl bg-stone-900 hover:bg-heritage-red text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Phối lại</span>
                      </button>

                      <button
                        onClick={() => handleAddToCompare(outfit)}
                        className="py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors flex items-center justify-center"
                        title="Thêm vào so sánh"
                      >
                        <Scale className="w-3.5 h-3.5 text-heritage-gold" />
                      </button>

                      <button
                        onClick={() => handleDeleteOutfit(outfit.id)}
                        className="py-2 rounded-xl bg-stone-100 hover:bg-rose-100 hover:text-rose-700 text-stone-500 text-xs font-bold transition-colors flex items-center justify-center"
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
            <div className="bg-white rounded-3xl p-12 text-center border border-heritage-border max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-heritage-gold flex items-center justify-center mx-auto">
                <Bookmark className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Tủ đồ còn trống</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Bạn chưa lưu outfit nào. Hãy vào Studio để tự tay sáng tạo bản phối yêu thích của bạn!
              </p>
              <button
                onClick={() => onNavigate('studio')}
                className="px-6 py-2.5 rounded-full bg-heritage-red hover:bg-heritage-red-dark text-white font-bold text-xs shadow-red-glow transition-all"
              >
                Bắt đầu phối đồ ngay
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-heritage-border/80 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Lịch sử các phiên phối gần đây
          </h3>
          {profile.history.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {profile.history.map((h, i) => {
                const garment = GARMENTS.find((g) => g.id === h.garmentId);
                const color = COLORS.find((c) => c.id === h.colorId);
                return (
                  <div
                    key={i}
                    className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-stone-50/60 p-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                        style={{ backgroundColor: color?.hex }}
                      />
                      <div>
                        <h4 className="font-bold text-stone-800">{h.name}</h4>
                        <span className="text-[11px] text-stone-400">
                          {new Date(h.createdAt).toLocaleTimeString('vi-VN')} • {garment?.name}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemixOutfit(h)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 font-bold transition-colors"
                    >
                      Tải lại
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic">Chưa có lịch sử phiên làm việc nào.</p>
          )}
        </div>
      )}

      {/* TAB 3: DATA & BACKUP */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Export card */}
          <div className="bg-white rounded-3xl p-6 border border-heritage-border/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">Xuất dữ liệu Tủ đồ</h3>
                <p className="text-xs text-stone-500">Tải tệp JSON chứa tất cả look đã lưu</p>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Bạn có thể tải về máy tính để sao lưu hồ sơ, danh sách so sánh và toàn bộ trang phục đã sáng tạo.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Tải file JSON về máy</span>
            </button>
          </div>

          {/* Import card */}
          <div className="bg-white rounded-3xl p-6 border border-heritage-border/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">Nhập dữ liệu JSON</h3>
                <p className="text-xs text-stone-500">Khôi phục tủ đồ từ mã JSON đã xuất</p>
              </div>
            </div>
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Dán chuỗi JSON vào đây..."
              rows={3}
              className="w-full text-xs font-mono bg-stone-50 p-2.5 rounded-xl border border-stone-200 focus:outline-hidden"
            />
            {importError && (
              <p className="text-xs text-rose-600 font-medium">{importError}</p>
            )}
            <button
              onClick={handleImport}
              className="w-full py-2.5 rounded-xl bg-heritage-gold hover:bg-heritage-gold-light text-stone-950 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Khôi phục dữ liệu</span>
            </button>
          </div>

          {/* Reset card */}
          <div className="sm:col-span-2 bg-rose-50/50 rounded-3xl p-6 border border-rose-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-800">
                  Vùng nguy hiểm
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Đặt lại toàn bộ ứng dụng về trạng thái ban đầu của đề thi Audition.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Đặt lại mặc định</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
