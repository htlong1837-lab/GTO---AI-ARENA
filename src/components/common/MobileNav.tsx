import React from 'react';
import { Home, PlusCircle, Compass, Scale, User } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  compareCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab, compareCount }) => {
  const tabs = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'lookbook', label: 'Lookbook', icon: Compass },
    { id: 'studio', label: 'Phối đồ', icon: PlusCircle, isMain: true },
    { id: 'compare', label: 'So sánh', icon: Scale, badge: compareCount > 0 ? compareCount : undefined },
    { id: 'profile', label: 'Tủ đồ', icon: User }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-heritage-border/80 px-2 py-2 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          if (tab.isMain) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="relative -top-5 flex flex-col items-center group focus:outline-hidden"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-heritage-red to-rose-500 text-white flex items-center justify-center shadow-red-glow border-4 border-white transform group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-heritage-red mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-heritage-red font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-heritage-red text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
