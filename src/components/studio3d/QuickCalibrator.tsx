import React from 'react';
import { Slot3DType, Transform3D } from '../../data/models3d';
import { Sliders, RotateCcw, X, Move, Maximize, RotateCw } from 'lucide-react';

interface QuickCalibratorProps {
  slotType: Slot3DType;
  slotName: string;
  transform: Transform3D;
  defaultTransform: Transform3D;
  onChange: (newTransform: Transform3D) => void;
  onReset: () => void;
  onClose: () => void;
}

export const QuickCalibrator: React.FC<QuickCalibratorProps> = ({
  slotName,
  transform,
  onChange,
  onReset,
  onClose
}) => {
  const updatePos = (index: number, val: number) => {
    const newPos: [number, number, number] = [...transform.position];
    newPos[index] = val;
    onChange({
      ...transform,
      position: newPos
    });
  };

  const updateScale = (val: number) => {
    onChange({
      ...transform,
      scale: [val, val, val]
    });
  };

  const updateRot = (index: number, degVal: number) => {
    const radVal = (degVal * Math.PI) / 180;
    const newRot: [number, number, number] = [...transform.rotation];
    newRot[index] = radVal;
    onChange({
      ...transform,
      rotation: newRot
    });
  };

  const toDeg = (rad: number) => Math.round((rad * 180) / Math.PI);

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900">
          <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200 text-heritage-red">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm">Cân Chỉnh Vị Trí & Tỉ Lệ</h4>
            <p className="text-[10px] text-stone-500">{slotName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1 text-[11px]"
            title="Khôi phục mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Position Controls */}
        <div className="space-y-2">
          <span className="font-semibold text-stone-700 flex items-center gap-1.5 text-[11px]">
            <Move className="w-3 h-3 text-stone-400" />
            Tọa độ dịch chuyển (Mét)
          </span>

          {/* X: Trái - Phải */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-[11px] text-stone-500">Trái / Phải:</span>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.005"
              value={transform.position[0]}
              onChange={(e) => updatePos(0, parseFloat(e.target.value))}
              className="flex-1 accent-heritage-red h-1.5 bg-stone-100 rounded-lg cursor-pointer"
            />
            <span className="w-10 text-[10px] font-mono text-right text-stone-600">
              {transform.position[0].toFixed(2)}
            </span>
          </div>

          {/* Y: Cao - Thấp */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-[11px] text-stone-500">Cao / Thấp:</span>
            <input
              type="range"
              min="-0.5"
              max="2.2"
              step="0.01"
              value={transform.position[1]}
              onChange={(e) => updatePos(1, parseFloat(e.target.value))}
              className="flex-1 accent-heritage-red h-1.5 bg-stone-100 rounded-lg cursor-pointer"
            />
            <span className="w-10 text-[10px] font-mono text-right text-stone-600">
              {transform.position[1].toFixed(2)}
            </span>
          </div>

          {/* Z: Trước - Sau */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-[11px] text-stone-500">Trước / Sau:</span>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.005"
              value={transform.position[2]}
              onChange={(e) => updatePos(2, parseFloat(e.target.value))}
              className="flex-1 accent-heritage-red h-1.5 bg-stone-100 rounded-lg cursor-pointer"
            />
            <span className="w-10 text-[10px] font-mono text-right text-stone-600">
              {transform.position[2].toFixed(2)}
            </span>
          </div>
        </div>

        {/* Scale Control */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <span className="font-semibold text-stone-700 flex items-center gap-1.5 text-[11px]">
            <Maximize className="w-3 h-3 text-stone-400" />
            Độ phóng to / Thu nhỏ (Scale)
          </span>
          <div className="flex items-center gap-3">
            <span className="w-16 text-[11px] text-stone-500">Kích thước:</span>
            <input
              type="range"
              min="0.1"
              max="2.5"
              step="0.02"
              value={transform.scale[0]}
              onChange={(e) => updateScale(parseFloat(e.target.value))}
              className="flex-1 accent-amber-600 h-1.5 bg-stone-100 rounded-lg cursor-pointer"
            />
            <span className="w-10 text-[10px] font-mono text-right text-stone-600">
              {transform.scale[0].toFixed(2)}x
            </span>
          </div>
        </div>

        {/* Rotation Control */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <span className="font-semibold text-stone-700 flex items-center gap-1.5 text-[11px]">
            <RotateCw className="w-3 h-3 text-stone-400" />
            Góc nghiêng (Độ)
          </span>
          <div className="flex items-center gap-3">
            <span className="w-16 text-[11px] text-stone-500">Nghiêng:</span>
            <input
              type="range"
              min="-90"
              max="90"
              step="1"
              value={toDeg(transform.rotation[0])}
              onChange={(e) => updateRot(0, parseFloat(e.target.value))}
              className="flex-1 accent-stone-800 h-1.5 bg-stone-100 rounded-lg cursor-pointer"
            />
            <span className="w-10 text-[10px] font-mono text-right text-stone-600">
              {toDeg(transform.rotation[0])}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
