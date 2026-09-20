import React, { useRef } from 'react';
import { TryOnModel, BASE_STUDIO_MODELS } from '../../data/modelsTryOn';
import { Check, Upload, User, Sparkles, ArrowRight, X } from 'lucide-react';

interface StepModelSelectProps {
  selectedModel: TryOnModel;
  onSelectModel: (model: TryOnModel) => void;
  customModelImage: string | null;
  onUploadCustomModel: (dataUrl: string | null) => void;
  onNextStep: () => void;
}

export const StepModelSelect: React.FC<StepModelSelectProps> = ({
  selectedModel,
  onSelectModel,
  customModelImage,
  onUploadCustomModel,
  onNextStep
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUploadCustomModel(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Introduction */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
          Bước 1 / 3 • Chọn Mẫu Ảnh
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2.5 tracking-tight">
          Chọn mẫu ảnh để AI ướm Việt Phục
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light leading-relaxed">
          Chọn mẫu ảnh chuẩn Studio (Nam hoặc Nữ) hoặc tải ảnh cá nhân của bạn lên. AI sẽ giữ trọn diện mạo của mẫu ảnh này để mặc bộ trang phục bạn chọn ở bước tiếp theo.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Models Selection Grid: 2 Standard Base Studio Models + 1 Upload Tile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {/* MODEL 1: FEMALE */}
        {BASE_STUDIO_MODELS.filter((m) => m.gender === 'female').map((model) => {
          const isSelected = !customModelImage && selectedModel.id === model.id;
          return (
            <div
              key={model.id}
              onClick={() => {
                onUploadCustomModel(null);
                onSelectModel(model);
              }}
              className={`relative rounded-3xl overflow-hidden border-2 cursor-pointer transition-all duration-300 bg-white flex flex-col group ${
                isSelected
                  ? 'border-teal-600 ring-4 ring-teal-600/20 shadow-xl scale-[1.02]'
                  : 'border-stone-200 hover:border-teal-400 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Photo Area */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-stone-100">
                <img
                  src={model.basePhotoUrl}
                  alt={model.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge Tag */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-stone-900 shadow-sm">
                    {model.gender === 'female' ? 'Mẫu Nữ ♀' : 'Mẫu Nam ♂'}
                  </span>
                </div>

                {/* Active Checkmark */}
                {isSelected && (
                  <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md z-10">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 inset-x-4 text-white z-10">
                  <h3 className="text-base font-bold drop-shadow">{model.name}</h3>
                  <p className="text-xs text-stone-200 line-clamp-2 mt-0.5 font-light">
                    {model.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-3.5 text-center bg-stone-50 border-t border-stone-100">
                <span className={`text-xs font-bold ${isSelected ? 'text-teal-700' : 'text-stone-600'}`}>
                  {isSelected ? '✓ Đang chọn mẫu này' : 'Bấm để chọn mẫu Nữ'}
                </span>
              </div>
            </div>
          );
        })}

        {/* MODEL 2: MALE */}
        {BASE_STUDIO_MODELS.filter((m) => m.gender === 'male').map((model) => {
          const isSelected = !customModelImage && selectedModel.id === model.id;
          return (
            <div
              key={model.id}
              onClick={() => {
                onUploadCustomModel(null);
                onSelectModel(model);
              }}
              className={`relative rounded-3xl overflow-hidden border-2 cursor-pointer transition-all duration-300 bg-white flex flex-col group ${
                isSelected
                  ? 'border-teal-600 ring-4 ring-teal-600/20 shadow-xl scale-[1.02]'
                  : 'border-stone-200 hover:border-teal-400 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Photo Area */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-stone-100">
                <img
                  src={model.basePhotoUrl}
                  alt={model.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge Tag */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-stone-900 shadow-sm">
                    {model.gender === 'female' ? 'Mẫu Nữ ♀' : 'Mẫu Nam ♂'}
                  </span>
                </div>

                {/* Active Checkmark */}
                {isSelected && (
                  <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md z-10">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 inset-x-4 text-white z-10">
                  <h3 className="text-base font-bold drop-shadow">{model.name}</h3>
                  <p className="text-xs text-stone-200 line-clamp-2 mt-0.5 font-light">
                    {model.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-3.5 text-center bg-stone-50 border-t border-stone-100">
                <span className={`text-xs font-bold ${isSelected ? 'text-teal-700' : 'text-stone-600'}`}>
                  {isSelected ? '✓ Đang chọn mẫu này' : 'Bấm để chọn mẫu Nam'}
                </span>
              </div>
            </div>
          );
        })}

        {/* OPTION 3: UPLOAD CUSTOM USER PHOTO */}
        <div
          className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 bg-white flex flex-col justify-between ${
            customModelImage
              ? 'border-teal-600 ring-4 ring-teal-600/20 shadow-xl'
              : 'border-dashed border-stone-300 hover:border-teal-500 bg-stone-50/50'
          }`}
        >
          {customModelImage ? (
            <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-stone-100 group">
              <img
                src={customModelImage}
                alt="Người mẫu của bạn"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white shadow-sm">
                  Ảnh của bạn
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUploadCustomModel(null);
                }}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors z-10"
                title="Gỡ ảnh này"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 inset-x-4 text-white z-10">
                <h3 className="text-base font-bold drop-shadow">Người mẫu cá nhân</h3>
                <p className="text-xs text-stone-200 mt-0.5 font-light">
                  AI sẽ ướm trang phục trực tiếp lên dáng của bạn
                </p>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-80 sm:h-96 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-teal-50/20 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3 shadow-xs">
                <Upload className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-stone-800">Tải ảnh của bạn</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-[200px] leading-relaxed">
                Tải ảnh chân dung hoặc toàn thân của bạn để thử đồ lên chính mình
              </p>
              <span className="mt-4 px-3 py-1 rounded-full text-xs font-semibold bg-stone-200 text-stone-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                Chọn tệp ảnh
              </span>
            </div>
          )}

          <div className="p-3.5 text-center bg-stone-50 border-t border-stone-100">
            <span className={`text-xs font-bold ${customModelImage ? 'text-teal-700' : 'text-stone-400'}`}>
              {customModelImage ? '✓ Sẵn sàng với ảnh của bạn' : 'Tùy chọn tải ảnh riêng'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button: Proceed to Step 2 */}
      <div className="flex justify-center pt-3">
        <button
          onClick={onNextStep}
          className="py-3.5 px-8 rounded-full font-bold text-sm bg-stone-900 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
        >
          <span>Tiếp tục: Chọn trang phục</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
