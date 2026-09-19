import React, { useState, useRef } from 'react';
import {
  ThreeCanvas,
  ThreeCanvasHandle,
  LightingMode,
  CameraPreset
} from '../components/studio3d/ThreeCanvas';
import { QuickCalibrator } from '../components/studio3d/QuickCalibrator';
import {
  Slot3DType,
  ActiveSlotState,
  Item3D,
  STARTER_3D_ITEMS,
  DEFAULT_ACTIVE_SLOTS,
  Transform3D
} from '../data/models3d';
import { COLORS } from '../data/colors';
import {
  RotateCw,
  Upload,
  Eye,
  EyeOff,
  Sliders,
  Camera,
  Download,
  Bookmark,
  ShieldCheck,
  Layers,
  FolderDown
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Studio3DPage: React.FC = () => {
  const { showToast } = useToast();
  const canvasRef = useRef<ThreeCanvasHandle>(null);

  // Tab Category: Cổ phục vs Trang phục kèm theo
  type TabCategory = 'garment' | 'accessory';
  const [activeTab, setActiveTab] = useState<TabCategory>('garment');

  // Active Garment State
  const [activeSlots, setActiveSlots] = useState<Record<Slot3DType, ActiveSlotState>>(DEFAULT_ACTIVE_SLOTS);
  const [itemsList, setItemsList] = useState<Item3D[]>(STARTER_3D_ITEMS);

  // Viewport Settings
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<LightingMode>('studio');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('all');

  // Calibration Drawer Target & Model Stats
  const [calibratingSlot, setCalibratingSlot] = useState<Slot3DType | null>(null);
  const [modelStats, setModelStats] = useState<{ polyCount: number; meshCount: number } | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeItem = itemsList.find((i) => i.id === activeSlots.base.itemId) || itemsList[0];
  const garmentItems = itemsList.filter((i) => i.category === 'garment');
  const accessoryItems = itemsList.filter((i) => i.category === 'accessory');
  const currentCategoryItems = activeTab === 'garment' ? garmentItems : accessoryItems;

  // Switch tab and ensure active item belongs to the selected tab
  const handleTabChange = (tab: TabCategory) => {
    setActiveTab(tab);
    const targetItems = tab === 'garment' ? garmentItems : accessoryItems;
    if (targetItems.length > 0 && !targetItems.some((i) => i.id === activeSlots.base.itemId)) {
      handleSelectItem('base', targetItems[0].id);
    }
  };

  // Toggle Garment Visibility
  const handleToggleSlot = (slot: Slot3DType) => {
    setActiveSlots((prev) => ({
      ...prev,
      [slot]: {
        ...prev[slot],
        visible: !prev[slot].visible
      }
    }));
  };

  // Switch Garment Model
  const handleSelectItem = (slot: Slot3DType, itemId: string) => {
    const item = itemsList.find((i) => i.id === itemId);
    if (!item) return;

    setActiveSlots((prev) => ({
      ...prev,
      [slot]: {
        ...prev[slot],
        itemId,
        visible: true,
        color: item.defaultColor,
        transform: { ...item.defaultTransform }
      }
    }));
    showToast({ type: 'info', title: 'Đã chuyển trang phục', message: `Đang hiển thị "${item.name}"!` });
  };

  // Change Color Tint
  const handleSlotColor = (slot: Slot3DType, hex?: string) => {
    setActiveSlots((prev) => ({
      ...prev,
      [slot]: {
        ...prev[slot],
        color: hex
      }
    }));
  };

  // Update Slot Transform from Quick Calibrator
  const handleTransformChange = (slot: Slot3DType, newTransform: Transform3D) => {
    setActiveSlots((prev) => ({
      ...prev,
      [slot]: {
        ...prev[slot],
        transform: newTransform
      }
    }));
  };

  // Reset Slot Transform to default
  const handleResetTransform = (slot: Slot3DType) => {
    const currentItemId = activeSlots[slot].itemId;
    const item = itemsList.find((i) => i.id === currentItemId);
    if (item) {
      handleTransformChange(slot, { ...item.defaultTransform });
    }
  };

  // Upload custom .GLB Garment
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.glb')) {
        showToast({ type: 'error', title: 'Định dạng không hỗ trợ', message: 'Vui lòng chọn file định dạng .glb!' });
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const customId = `custom-base-${Date.now()}`;
      const newItem: Item3D = {
        id: customId,
        name: file.name.replace('.glb', ''),
        category: activeTab,
        slot: 'base',
        type: 'glb',
        url: objectUrl,
        dynasty: 'Tùy chỉnh',
        heritageEra: 'Tải lên bởi người dùng',
        description: `Mô hình 3D ${activeTab === 'accessory' ? 'trang phục kèm theo' : 'cổ phục'} tự nạp từ thiết bị.`,
        culturalNote: 'Mô hình 3D tùy chỉnh của bạn được dựng và hiển thị trong không gian bảo tồn di sản cổ phục Việt Nam.',
        tags: ['Custom .GLB', 'Tự nạp', '3D PBR'],
        colorable: true,
        defaultTransform: {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1]
        }
      };

      setItemsList((prev) => [...prev, newItem]);
      handleSelectItem('base', customId);
      showToast({ type: 'success', title: 'Nạp model thành công', message: `Đã nạp "${newItem.name}" thành công!` });
      setCalibratingSlot('base');
    }
  };

  // Helper to trigger file download
  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  // Action: Export / Download active item's GLB file
  const handleDownloadActiveGLB = () => {
    if (activeItem.url && activeItem.url.endsWith('.glb')) {
      const fileName = activeItem.url.split('/').pop() || `${activeItem.id}.glb`;
      downloadFile(activeItem.url, fileName);
      showToast({
        type: 'success',
        title: 'Đang tải file 3D',
        message: `Đang tải ${activeItem.name} (${fileName})...`
      });
    } else if (canvasRef.current) {
      canvasRef.current.exportMergedGLB('vietphuc-custom-3d.glb');
    }
  };

  // Action: Download batch GLB files for the current tab
  const handleDownloadBatch = () => {
    const targets = currentCategoryItems;
    targets.forEach((p, idx) => {
      if (p.url) {
        setTimeout(() => {
          downloadFile(p.url!, p.url!.split('/').pop()!);
        }, idx * 400);
      }
    });
    showToast({
      type: 'success',
      title: activeTab === 'garment' ? 'Đang tải 5 Cổ Phục' : 'Đang tải 8 Phụ Kiện Kèm Theo',
      message: activeTab === 'garment'
        ? 'Đang tải toàn bộ 5 file .GLB Cổ Phục Việt Nam chuẩn PBR về máy!'
        : 'Đang tải toàn bộ 8 file .GLB Trang Phục Kèm Theo chuẩn PBR về máy!'
    });
  };

  // Action: Capture HD Lookbook Card
  const handleTakeSnapshot = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.captureSnapshot();
    if (!dataUrl) {
      showToast({ type: 'error', title: 'Lỗi', message: 'Không thể chụp ảnh màn hình 3D.' });
      return;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${activeItem.id}-lookbook.png`;
    link.click();
    showToast({ type: 'success', title: 'Đã lưu ảnh Lookbook', message: 'Đã lưu ảnh Lookbook 3D HD về máy!' });
  };

  // Action: Save to Wardrobe (LocalStorage)
  const handleSaveToWardrobe = () => {
    try {
      const wardrobe = JSON.parse(localStorage.getItem('vietphuc_3d_wardrobe') || '[]');
      const savedOutfit = {
        id: `outfit-3d-${Date.now()}`,
        savedAt: new Date().toISOString(),
        itemId: activeSlots.base.itemId,
        color: activeSlots.base.color
      };
      wardrobe.unshift(savedOutfit);
      localStorage.setItem('vietphuc_3d_wardrobe', JSON.stringify(wardrobe));
      showToast({ type: 'success', title: 'Đã lưu Tủ đồ', message: 'Đã lưu mẫu y phục 3D vào Bộ sưu tập!' });
    } catch {
      showToast({ type: 'error', title: 'Lỗi lưu trữ', message: 'Không thể lưu vào Tủ đồ.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-stone-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-heritage-red border border-rose-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Không Gian Bảo Tồn Cổ Phục 3D
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                Chuẩn PBR Siêu Thực
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                5 Cổ Phục & 8 Phụ Kiện
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Phòng Trưng Bày Cổ Phục & Phụ Kiện 3D
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Chiêm ngưỡng và tương tác 360° với 5 trang phục di sản tiêu biểu và 8 trang phục kèm theo / phụ kiện cổ truyền Việt Nam chuẩn PBR siêu thực.
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleTakeSnapshot}
              className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all hover:scale-[1.02]"
              title="Chụp ảnh Lookbook HD"
            >
              <Camera className="w-4 h-4 text-heritage-gold" />
              <span>Chụp Lookbook</span>
            </button>

            <button
              onClick={handleDownloadActiveGLB}
              className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all hover:scale-[1.02]"
              title={`Tải file .GLB ${activeItem.name}`}
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Tải file .GLB</span>
            </button>

            <button
              onClick={handleDownloadBatch}
              className="px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-heritage-red text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all hover:scale-[1.02]"
              title={activeTab === 'garment' ? 'Tải trọn bộ 5 file .GLB Cổ Phục' : 'Tải trọn bộ 8 file .GLB Phụ Kiện Kèm Theo'}
            >
              <FolderDown className="w-4 h-4 text-heritage-red" />
              <span>{activeTab === 'garment' ? 'Tải 5 Cổ Phục' : 'Tải 8 Phụ Kiện'}</span>
            </button>

            <button
              onClick={handleSaveToWardrobe}
              className="px-4 py-2.5 rounded-2xl bg-heritage-red hover:bg-heritage-red-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-red-glow transition-all hover:scale-[1.02]"
            >
              <Bookmark className="w-4 h-4 text-white" />
              <span>Lưu Tủ Đồ</span>
            </button>
          </div>
        </div>

        {/* Main Grid: 3D Canvas (Left) + Garment Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 3D Viewport & Toolbars (7-8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col gap-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 text-xs">
              {/* Lighting Mood Switcher */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setLightingMode('studio')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    lightingMode === 'studio' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🏛️ Hoàng Cung
                </button>
                <button
                  onClick={() => setLightingMode('cyber')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    lightingMode === 'cyber' ? 'bg-stone-900 text-fuchsia-400 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  ⚡ Cyber Neon
                </button>
                <button
                  onClick={() => setLightingMode('natural')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    lightingMode === 'natural' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  ☀️ Tự Nhiên
                </button>
                <button
                  onClick={() => setLightingMode('minimal')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    lightingMode === 'minimal' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  ⚪ Tối Giản
                </button>
              </div>

              {/* Display Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 border transition-all ${
                    autoRotate
                      ? 'bg-rose-50 text-heritage-red border-rose-200 font-bold'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                  <span>Xoay 360°</span>
                </button>

                <button
                  onClick={() => setIsWireframe(!isWireframe)}
                  className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 border transition-all ${
                    isWireframe
                      ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lưới</span>
                </button>
              </div>
            </div>

            {/* 3D Canvas Element */}
            <div className="w-full h-[540px] sm:h-[600px] bg-stone-100 rounded-2xl overflow-hidden relative border border-stone-200/60">
              <ThreeCanvas
                ref={canvasRef}
                slots={activeSlots}
                items={itemsList}
                lightingMode={lightingMode}
                autoRotate={autoRotate}
                isWireframe={isWireframe}
                cameraPreset={cameraPreset}
                onStatsUpdated={(stats) => setModelStats(stats)}
              />

              {/* Quick Calibrator Floating Drawer */}
              {calibratingSlot && (
                <div className="absolute top-3 right-3 max-w-sm w-full z-20">
                  <QuickCalibrator
                    slotType={calibratingSlot}
                    slotName={activeItem ? activeItem.name : 'Cổ Phục 3D'}
                    transform={activeSlots[calibratingSlot].transform}
                    defaultTransform={
                      itemsList.find((i) => i.id === activeSlots[calibratingSlot].itemId)?.defaultTransform || {
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1]
                      }
                    }
                    onChange={(newTrans) => handleTransformChange(calibratingSlot, newTrans)}
                    onReset={() => handleResetTransform(calibratingSlot)}
                    onClose={() => setCalibratingSlot(null)}
                  />
                </div>
              )}
            </div>

            {/* Bottom Camera Focus Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <span className="text-stone-500 font-medium">Góc nhìn chi tiết:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCameraPreset('all')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    cameraPreset === 'all'
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  👘 Toàn cảnh
                </button>
                <button
                  onClick={() => setCameraPreset('collar')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    cameraPreset === 'collar'
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  🔍 Cận cảnh / Hoa văn
                </button>
                <button
                  onClick={() => setCameraPreset('hem')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    cameraPreset === 'hem'
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  📜 Chi tiết dưới
                </button>
              </div>
            </div>
          </div>

          {/* Right: Selection & Cultural Info Panel (4-5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-heritage-red" />
                  Kho Mẫu 3D Cổ Phục
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {currentCategoryItems.length} mẫu
                </span>
              </div>

              {/* Tab Switcher inside Right Panel */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-2xl">
                <button
                  onClick={() => handleTabChange('garment')}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'garment'
                      ? 'bg-white text-heritage-red shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>👘 Cổ Phục ({garmentItems.length})</span>
                </button>
                <button
                  onClick={() => handleTabChange('accessory')}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'accessory'
                      ? 'bg-white text-heritage-red shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>💎 Kèm Theo ({accessoryItems.length})</span>
                </button>
              </div>

              {/* Hidden File Input for GLB upload */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".glb"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Items Selector Cards */}
              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                {currentCategoryItems.map((item, index) => {
                  const isSelected = activeSlots.base.itemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem('base', item.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-heritage-red bg-rose-50/70 shadow-xs ring-1 ring-heritage-red/30'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className="w-11 h-11 rounded-xl object-cover border border-stone-200 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-lg shrink-0">
                              {item.category === 'accessory' ? '💎' : '👘'}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                                #{index + 1}
                              </span>
                              <h4 className={`text-xs font-bold ${isSelected ? 'text-heritage-red' : 'text-stone-900'}`}>
                                {item.name}
                              </h4>
                            </div>
                            {item.dynasty && (
                              <p className="text-[10px] font-medium text-amber-800 mt-0.5">
                                {item.dynasty}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-heritage-red text-white font-bold shrink-0">
                            Đang xem
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectItem('base', item.id);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium shrink-0"
                          >
                            Chọn
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Color Tinting Bar */}
              <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">Màu sắc hiển thị:</span>
                  <button
                    onClick={() => handleSlotColor('base', undefined)}
                    className="px-2.5 py-1 text-[10px] rounded-lg border border-stone-200 bg-white text-stone-700 font-semibold hover:bg-stone-100 shadow-2xs"
                  >
                    Màu PBR gốc
                  </button>
                </div>
                <div className="flex items-center justify-between gap-1 pt-1">
                  {COLORS.slice(0, 6).map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleSlotColor('base', col.hex)}
                      className="w-6 h-6 rounded-full border border-stone-300 transition-transform hover:scale-110 shadow-2xs"
                      style={{ backgroundColor: col.hex }}
                      title={`Ám màu ${col.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Position & Calibration Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCalibratingSlot(calibratingSlot === 'base' ? null : 'base')}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    calibratingSlot === 'base'
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Cân chỉnh vị trí / Tỉ lệ</span>
                </button>
                <button
                  onClick={() => handleToggleSlot('base')}
                  className={`p-2 rounded-xl border transition-colors ${
                    activeSlots.base.visible
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-stone-200/70 border-stone-300 text-stone-500'
                  }`}
                  title={activeSlots.base.visible ? 'Đang hiển thị' : 'Đã ẩn'}
                >
                  {activeSlots.base.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Upload GLB Custom Model */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-stone-500" />
                  <span>{activeTab === 'garment' ? 'Nạp thêm file 3D .GLB cổ phục của bạn' : 'Nạp thêm file 3D .GLB phụ kiện của bạn'}</span>
                </button>
              </div>
            </div>

            {/* Cultural Context Card for active item */}
            {activeItem && (
              <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center gap-2 text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-serif font-bold text-sm">Điển Tích Văn Hóa Di Sản</h4>
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  {activeItem.culturalNote}
                </p>
                {modelStats && (
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                    <span>Đa giác 3D: {modelStats.polyCount.toLocaleString()} tris</span>
                    <span>{modelStats.meshCount} meshes PBR</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
