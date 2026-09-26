import React, { useState, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MobileNav } from '../components/common/MobileNav';

interface MainLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  compareCount: number;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentTab,
  onSelectTab,
  compareCount
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-heritage-ink font-sans selection:bg-heritage-red selection:text-white relative overflow-x-hidden">
      {/* Luxury Heritage Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9B1D20] via-[#DFB058] to-[#9B1D20] z-[100] transition-[width] duration-150 ease-out origin-left pointer-events-none"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: scrollProgress > 0 ? '0 0 10px rgba(223, 176, 88, 0.7)' : 'none'
        }}
      />

      <Header
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        compareCount={compareCount}
      />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 lg:pb-0 overflow-x-hidden w-full max-w-full">
        {children}
      </main>

      <Footer onSelectTab={onSelectTab} />

      <MobileNav
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        compareCount={compareCount}
      />
    </div>
  );
};

