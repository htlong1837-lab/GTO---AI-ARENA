import React, { useRef, useState } from 'react';
import { ClothingItemOption, PRESET_CLOTHING_ITEMS } from '../../data/modelsTryOn';
import { ACCESSORIES } from '../../data/accessories';
import { COLORS } from '../../data/colors';
import { Plus, Info, Check, Sparkles, X, Layers } from 'lucide-react';

interface FitRoomSelectClothesProps {
  selectedClothes: ClothingItemOption;
  onSelectClothes: (item: ClothingItemOption) => void;
  customClothesImage: string | null;
  onUploadCustomClothes: (dataUrl: string | null) => void;
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
  selectedAccessoryIds: string[];
  onToggleAccessory: (id: string) => void;
}

export const FitRoomSelectClothes: React.FC<FitRoomSelectClothesProps> = ({
  selectedClothes,
  onSelectClothes,
  customClothesImage,
  onUploadCustomClothes,
  selectedColorId,
  onSelectColor,
  selectedAccessoryIds,
  onToggleAccessory
}) => {
  const [activeSection, setActiveSection] = useState<'garment' | 'accessories'>('garment');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUploadCustomClothes(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUploadCustomClothes(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 text-stone-900">
      {/* Header: Title and Tips */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold tracking-tight text-stone-900 flex items-center gap-2">
          <span>Y phục & Phụ kiện phối kèm</span>
        </h3>
        <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Cổ Phong Remix
        </span>
      </div>

      {/* Tabs: Chọn Cổ phục vs Phụ kiện Gen Z */}
      <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
        <button
          onClick={() => setActiveSection('garment')}
          className={`flex-1 py-2 rounded-lg transition-all text-center ${
            activeSection === 'garment'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Dòng Cổ Phục ({PRESET_CLOTHING_ITEMS.length})
        </button>
        <button
          onClick={() => setActiveSection('accessories')}
          className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
            activeSection === 'accessories'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Phụ kiện ({selectedAccessoryIds.length})</span>
          {selectedAccessoryIds.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-teal-600" />
          )}
        </button>
      </div>

      {activeSection === 'garment' ? (
        <>
          {/* Drag and Drop / Add Item Box */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {customClothesImage ? (
            <div className="relative rounded-2xl border-2 border-teal-600/60 bg-teal-50/40 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 shadow-xs shrink-0">
                  <img src={customClothesImage} alt="Custom clothes" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                    Trang phục tự tải lên
                  </span>
                  <p className="text-xs font-semibold text-stone-800 line-clamp-1">Ảnh trang phục cá nhân của bạn</p>
                  <span className="text-[10px] text-stone-500 mt-0.5 block">Đã sẵn sàng để ướm thử</span>
                </div>
              </div>
              <button
                onClick={() => onUploadCustomClothes(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-rose-600 transition-colors"
                title="Gỡ ảnh tải lên"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                isDragOver
                  ? 'border-teal-600 bg-teal-50/50 scale-[0.99]'
                  : 'border-stone-300 hover:border-teal-600 bg-white/80 hover:bg-stone-50 shadow-xs'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 block">Tải ảnh trang phục cá nhân lên</span>
                <span className="text-[10px] text-stone-400">Kéo thả hoặc bấm để chọn ảnh áo/váy của bạn</span>
              </div>
            </div>
          )}

          {/* Thư viện Cổ Phục Di Sản */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700">5 dòng Cổ phục biểu tượng</span>
              <span className="text-[11px] text-stone-400 font-light">Bấm để đổi áo</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {PRESET_CLOTHING_ITEMS.map((item) => {
                const isSelected = !customClothesImage && selectedClothes.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onUploadCustomClothes(null);
                      onSelectClothes(item);
                    }}
                    className={`group relative rounded-xl overflow-hidden border text-left transition-all aspect-[3/4] flex flex-col justify-end p-1.5 ${
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-600/30 shadow-md scale-[1.02]'
                        : 'border-stone-200 hover:border-stone-400 bg-stone-100'
                    }`}
                    title={`${item.name} • ${item.era}`}
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    
                    <span className="relative z-10 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white w-fit">
                      {item.garmentType.replace('ao-', '').toUpperCase()}
                    </span>

                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm z-10">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bảng màu lụa & gấm truyền thống */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700">Sắc lụa di sản</span>
              <span className="text-[11px] text-teal-800 font-semibold">
                {COLORS.find((c) => c.id === selectedColorId)?.vietnameseName || 'Mặc định'}
              </span>
            </div>
            {/* Flex-wrap with adequate padding to prevent clipping of outer rings */}
            <div className="flex flex-wrap items-center gap-2.5 py-2 px-1">
              {COLORS.map((c) => {
                const isColorActive = selectedColorId === c.id;
                const isLight = c.id === 'trang-lua-nga';
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectColor(c.id)}
                    className={`w-7 h-7 rounded-full shrink-0 transition-all flex items-center justify-center relative border ${
                      isLight ? 'border-stone-300' : 'border-black/10'
                    } ${
                      isColorActive
                        ? 'ring-2 ring-offset-2 ring-stone-900 shadow-md scale-105'
                        : 'hover:scale-105 opacity-85 hover:opacity-100 hover:shadow-xs'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={`${c.vietnameseName} (${c.element})`}
                  >
                    {isColorActive && (
                      <Check
                        className={`w-3.5 h-3.5 stroke-[3] ${
                          isLight ? 'text-stone-900' : 'text-white drop-shadow-sm'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Danh sách Phụ kiện Remix */
        <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
          <p className="text-[11px] text-stone-500 font-light mb-2">
            Chọn phụ kiện truyền thống hoặc hiện đại để tạo nên phong cách Cổ Phong Gen Z:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ACCESSORIES.map((acc) => {
              const isSelected = selectedAccessoryIds.includes(acc.id);
              return (
                <button
                  key={acc.id}
                  onClick={() => onToggleAccessory(acc.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-600 text-teal-950 font-semibold shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-stone-600">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    <div>
                      <span className="text-xs block leading-tight">{acc.name}</span>
                      <span className="text-[9px] text-stone-400 font-normal">
                        {acc.isTraditional ? 'Di sản' : 'Gen Z'}
                      </span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-stone-300'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
