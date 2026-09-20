import React, { useRef, useState } from 'react';
import { TryOnModel, STUDIO_MODELS } from '../../data/modelsTryOn';
import { Plus, Info, Check, SlidersHorizontal, User, Sparkles, X } from 'lucide-react';

interface FitRoomSelectModelProps {
  selectedModel: TryOnModel;
  onSelectModel: (model: TryOnModel) => void;
  customModelImage: string | null;
  onUploadCustomModel: (dataUrl: string | null) => void;
}

export const FitRoomSelectModel: React.FC<FitRoomSelectModelProps> = ({
  selectedModel,
  onSelectModel,
  customModelImage,
  onUploadCustomModel
}) => {
  const [modelTab, setModelTab] = useState<'our_models' | 'your_models'>('our_models');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUploadCustomModel(result);
        setModelTab('your_models');
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredModels = STUDIO_MODELS.filter((m) => {
    if (genderFilter === 'all') return true;
    return m.gender === genderFilter;
  });

  return (
    <div className="space-y-3.5 text-stone-900 pt-3 border-t border-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold tracking-tight text-stone-900">Người mẫu thử đồ</h3>
          <p className="text-[11px] text-stone-500 font-light">
            Dàn người mẫu Việt Phục hoặc tải ảnh chính bạn lên để ướm thử
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-stone-500">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as 'all' | 'female' | 'male')}
            className="bg-transparent font-medium text-stone-700 cursor-pointer focus:outline-none"
          >
            <option value="all">Tất cả</option>
            <option value="female">Nữ ♀</option>
            <option value="male">Nam ♂</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
        <button
          onClick={() => setModelTab('our_models')}
          className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
            modelTab === 'our_models'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Người mẫu Studio ({filteredModels.length})
        </button>
        <button
          onClick={() => setModelTab('your_models')}
          className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
            modelTab === 'your_models'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Ảnh người mẫu của bạn
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Custom User Model Preview */}
      {modelTab === 'your_models' && (
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
          {customModelImage ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 shadow-xs shrink-0">
                  <img src={customModelImage} alt="Custom model" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                    Ảnh của bạn
                  </span>
                  <p className="text-xs font-semibold text-stone-800">Đã sẵn sàng người mẫu cá nhân</p>
                  <span className="text-[10px] text-stone-500">Trang phục sẽ được ướm vừa khít vào dáng của bạn</span>
                </div>
              </div>
              <button
                onClick={() => onUploadCustomModel(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-rose-600 transition-colors"
                title="Gỡ ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-teal-600 rounded-xl p-4 text-center cursor-pointer bg-white transition-all flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-xs font-bold text-stone-800">Tải ảnh toàn thân của bạn lên</span>
              <span className="text-[10px] text-stone-400">Khuyến nghị ảnh chụp rõ dáng đứng để kết quả chuẩn nhất</span>
            </div>
          )}
        </div>
      )}

      {/* Models Grid */}
      {modelTab === 'our_models' && (
        <div className="grid grid-cols-2 gap-3">
          {filteredModels.map((m) => {
            const isSelected = !customModelImage && selectedModel.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onUploadCustomModel(null);
                  onSelectModel(m);
                }}
                className={`relative rounded-2xl overflow-hidden border text-left transition-all aspect-[3/4] group ${
                  isSelected
                    ? 'border-teal-600 ring-2 ring-teal-600/30 shadow-md scale-[1.01]'
                    : 'border-stone-200 hover:border-stone-400 bg-stone-100'
                }`}
                title={`${m.name} • ${m.description}`}
              >
                <img
                  src={m.avatarUrl}
                  alt={m.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute bottom-2.5 inset-x-2.5 text-white z-10">
                  <span className="text-xs font-bold block truncate">{m.name}</span>
                  <span className="text-[10px] text-stone-300 block font-light mt-0.5">{m.tag}</span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md z-10">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
