import React from 'react';
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
  return (
    <div className="min-h-screen flex flex-col bg-heritage-ivory text-heritage-ink font-sans selection:bg-heritage-red selection:text-white">
      <Header
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        compareCount={compareCount}
      />

      <main className="flex-1 pb-16 lg:pb-0">{children}</main>

      <Footer onSelectTab={onSelectTab} />

      <MobileNav
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        compareCount={compareCount}
      />
    </div>
  );
};
