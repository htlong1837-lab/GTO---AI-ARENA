import React, { useState } from 'react';
import { Sparkles, Scale, Compass, BookOpen, User, Menu, X, PlusCircle } from 'lucide-react';
import { Outfit } from '../../types/outfit';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  compareCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, compareCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Sparkles },
    { id: 'studio', label: 'Studio Phối Đồ', icon: PlusCircle, highlight: true },
    { id: 'lookbook', label: 'Lookbook Việt', icon: Compass },
    {
      id: 'compare',
      label: 'So sánh Look',
      icon: Scale,
      badge: compareCount > 0 ? compareCount : undefined
    },
    { id: 'culture', label: 'Hiểu đúng Việt phục', icon: BookOpen },
    { id: 'profile', label: 'Tủ đồ & Hồ sơ', icon: User }
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-heritage-border/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Editorial Tagline */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-left flex items-center gap-3 group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-heritage-red to-heritage-red-dark text-white flex items-center justify-center font-serif text-xl font-bold shadow-silk border border-white/20 group-hover:scale-105 transition-transform">
            VP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg sm:text-xl font-extrabold tracking-tight text-heritage-ink group-hover:text-heritage-red transition-colors">
                VIỆT PHỤC REMIX
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-heritage-red border border-rose-200">
                Gen Z Edition
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium tracking-tight">
              Mặc chất Gen Z — Giữ hồn Việt
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-stone-100/70 p-1.5 rounded-full border border-stone-200/80">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-heritage-charcoal text-white shadow-sm'
                    : item.highlight
                    ? 'text-heritage-red hover:bg-rose-50'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="w-4 h-4 rounded-full bg-heritage-red text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action button CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onSelectTab('studio')}
            className="px-4 py-2.5 rounded-full bg-heritage-red hover:bg-heritage-red-dark text-white font-bold text-xs tracking-wide shadow-red-glow hover:shadow-silk transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bắt đầu phối đồ</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          aria-label="Mở menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-heritage-border px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-heritage-charcoal text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-heritage-red text-white text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
