import React, { useState } from 'react';
import { Sparkles, Scale, Compass, BookOpen, User, Menu, X, PlusCircle, Box } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  compareCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, compareCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Sparkles },
    { id: 'studio', label: 'Studio', icon: PlusCircle, highlight: true },
    { id: 'studio3d', label: 'Xưởng 3D', icon: Box, tag: '3D' },
    { id: 'lookbook', label: 'Lookbook', icon: Compass },
    {
      id: 'compare',
      label: 'So sánh',
      icon: Scale,
      badge: compareCount > 0 ? compareCount : undefined
    },
    { id: 'culture', label: 'Văn hóa', icon: BookOpen },
    { id: 'profile', label: 'Tủ đồ', icon: User }
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-6xl flex items-center justify-between gap-3 md:gap-6 rounded-full border border-[#E2D8C7] bg-[#FAF7F2]/90 px-4 sm:px-6 py-2.5 backdrop-blur-2xl shadow-editorial">
        {/* Brand Logo & Monogram */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 group focus:outline-none shrink-0"
        >
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-b from-[#A8282B] to-[#741416] text-[#FAF7F0] flex items-center justify-center font-serif text-sm font-bold shadow-md border border-[#D4AF37]/50 group-hover:border-[#D4AF37] transition-all">
            <span className="font-serif tracking-tighter">VP</span>
            <div className="absolute -inset-0.5 rounded-full border border-[#D4AF37]/30 pointer-events-none group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base sm:text-lg font-bold tracking-wider text-heritage-ink group-hover:text-heritage-red transition-colors">
                VIỆT PHỤC
              </span>
              <span className="font-sans text-[10px] font-bold tracking-widest text-heritage-red uppercase">
                REMIX
              </span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#18181B] text-[#FAF7F2] font-semibold shadow-xs'
                    : item.highlight
                    ? 'text-heritage-red hover:bg-white/80 font-semibold'
                    : 'text-stone-700 hover:text-heritage-ink hover:bg-white/80'
                }`}
              >
                <span>{item.label}</span>
                {item.tag && (
                  <span className="px-1.5 py-0.2 text-[8px] font-bold tracking-widest uppercase rounded-full bg-[#C59338] text-white">
                    {item.tag}
                  </span>
                )}
                {item.badge !== undefined && (
                  <span className="w-4 h-4 rounded-full bg-heritage-red text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Action CTAs (Floria Pill Styling with Heritage Colors) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('studio3d')}
            className="px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-[#F4EFE6] text-stone-800 font-medium text-xs border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Box className="w-3.5 h-3.5 text-[#C59338]" />
            <span>Xưởng 3D</span>
          </button>

          <button
            onClick={() => onSelectTab('studio')}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-heritage-red to-heritage-red-dark hover:from-heritage-red-dark hover:to-heritage-red text-white font-semibold text-xs tracking-wide shadow-silk hover:shadow-gold-fine transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DFB058]" />
            <span>Phối Đồ Ngay</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 transition-colors"
          aria-label="Mở menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Floating Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-16 inset-x-4 max-w-md mx-auto rounded-3xl bg-[#FAF7F2]/98 border border-[#E2D8C7] p-4 shadow-editorial-xl backdrop-blur-2xl space-y-1 animate-in fade-in slide-in-from-top-3 duration-200 lg:hidden">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full p-3 rounded-2xl text-xs tracking-wide font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#18181B] text-[#FAF7F2] font-semibold'
                    : 'text-stone-700 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#DFB058]' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                  {item.tag && (
                    <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-wider rounded-full bg-[#C59338] text-white">
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

          <div className="pt-2 mt-2 border-t border-[#E2D8C7] grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('studio3d')}
              className="w-full py-2.5 px-3 rounded-xl bg-white text-stone-800 text-xs font-medium border border-[#D4AF37]/50 flex items-center justify-center gap-1.5"
            >
              <Box className="w-3.5 h-3.5 text-[#C59338]" />
              <span>Xưởng 3D</span>
            </button>
            <button
              onClick={() => handleNavClick('studio')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-heritage-red to-heritage-red-dark text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#DFB058]" />
              <span>Phối Đồ</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
