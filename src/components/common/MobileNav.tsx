import React from 'react';
import { Home, PlusCircle, Compass, User, Box } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  compareCount: number;
}

interface NavTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isMain?: boolean;
  badge?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: NavTab[] = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'studio', label: 'Phối 2D', icon: PlusCircle, isMain: true },
    { id: 'studio3d', label: 'Phối 3D', icon: Box },
    { id: 'lookbook', label: 'Lookbook', icon: Compass },
    { id: 'profile', label: 'Tủ đồ', icon: User }
  ];

  return (
    <div className="lg:hidden fixed bottom-3 inset-x-4 z-40 bg-[#FAF7F2]/95 backdrop-blur-2xl border border-[#E2D8C7] rounded-full px-4 py-2 shadow-editorial-xl max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          if (tab.isMain) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="relative -top-4 flex flex-col items-center group focus:outline-none"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-b from-[#A8282B] to-[#741416] text-[#FAF7F0] flex items-center justify-center shadow-lg border-2 border-[#D4AF37] transform group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-[#DFB058]" />
                </div>
                <span className="text-[9px] font-serif font-bold text-heritage-red mt-0.5 tracking-wide">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all relative ${
                isActive ? 'text-heritage-red font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5] text-heritage-red' : 'stroke-[1.7]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-heritage-red text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] mt-1 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
