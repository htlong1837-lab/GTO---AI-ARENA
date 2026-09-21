import React, { useState } from 'react';
import { Sparkles, Scale, Compass, BookOpen, User, Menu, X, Box } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  compareCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, compareCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'studio', label: 'Studio Phối Đồ' },
    { id: 'studio3d', label: 'Xưởng 3D', tag: '3D' },
    { id: 'lookbook', label: 'Lookbook' },
    {
      id: 'compare',
      label: 'So sánh',
      badge: compareCount > 0 ? compareCount : undefined
    },
    { id: 'culture', label: 'Văn hóa' },
    { id: 'profile', label: 'Tủ đồ' }
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div className="pointer-events-auto w-full max-w-6xl flex items-center justify-between gap-2 sm:gap-4 rounded-full border border-stone-200/70 bg-white/80 backdrop-blur-2xl px-3.5 sm:px-5 py-2 shadow-[0_12px_40px_-10px_rgba(24,39,71,0.08),0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-white/70 transition-all duration-300 hover:border-stone-300/80 hover:shadow-[0_16px_48px_-10px_rgba(24,39,71,0.12)]">
        {/* Brand Insignia & Monogram */}
        <BrandLogo
          onClick={() => onSelectTab('home')}
          size="md"
          textColor="dark"
        />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-100/70 p-1 rounded-full border border-stone-200/50">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 select-none ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-white/80'
                }`}
              >
                <span>{item.label}</span>
                {item.tag && (
                  <span
                    className={`px-1.5 py-0.2 text-[8px] font-extrabold tracking-wider rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#C59338] text-white'
                        : 'bg-amber-100/80 text-amber-900 border border-amber-300/40'
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
                {item.badge !== undefined && (
                  <span
                    className={`min-w-4 h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#C59338] text-white'
                        : 'bg-heritage-red text-white shadow-2xs'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Singular Luxury Action CTA (No Duplication) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('studio')}
            className="group relative px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#9B1D20] to-[#741416] hover:from-[#A8282B] hover:to-[#8E1A1D] text-white font-semibold text-xs tracking-wide shadow-[0_4px_16px_rgba(155,29,32,0.28)] hover:shadow-[0_6px_22px_rgba(155,29,32,0.38)] active:scale-95 transition-all duration-300 flex items-center gap-2 border border-[#DFB058]/30 hover:border-[#DFB058]/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DFB058] group-hover:rotate-12 transition-transform duration-300" />
            <span className="drop-shadow-2xs">Phối Đồ Ngay</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none"
          aria-label="Mở danh mục điều hướng"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Glassmorphism Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-16 inset-x-4 max-w-md mx-auto rounded-3xl bg-white/95 border border-stone-200/80 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-2xl space-y-1 animate-in fade-in slide-in-from-top-3 duration-200 lg:hidden">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs tracking-wide font-medium flex items-center justify-between transition-all duration-150 ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 font-semibold shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100/80 hover:text-stone-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span>{item.label}</span>
                  {item.tag && (
                    <span className="px-1.5 py-0.5 text-[8px] font-extrabold tracking-wider rounded-full bg-[#C59338] text-white">
                      {item.tag}
                    </span>
                  )}
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-heritage-red text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2.5 mt-2 border-t border-stone-100">
            <button
              onClick={() => handleNavClick('studio')}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#9B1D20] to-[#741416] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#DFB058]" />
              <span>Phối Đồ Ngay</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

