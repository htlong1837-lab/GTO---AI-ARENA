import React, { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { StudioPage } from './pages/StudioPage';
import { LookbookPage } from './pages/LookbookPage';
import { ComparePage } from './pages/ComparePage';
import { CulturePage } from './pages/CulturePage';
import { ProfilePage } from './pages/ProfilePage';
import { ToastProvider } from './context/ToastContext';
import { StorageService } from './services/storageService';
import { Outfit, CuratedLook } from './types/outfit';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [compareCount, setCompareCount] = useState<number>(() => {
    return StorageService.getCompareList().length;
  });

  // State to pass down when user wants to remix a specific garment, occasion, style, or look
  const [studioInitialParams, setStudioInitialParams] = useState<{
    garmentId?: string;
    occasionId?: string;
    styleId?: string;
    colorId?: string;
    accessoryIds?: string[];
  }>({});

  const refreshCompareCount = () => {
    setCompareCount(StorageService.getCompareList().length);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleNavigate = (tab: string, params?: any) => {
    if (params) {
      setStudioInitialParams(params);
    }
    setCurrentTab(tab);
  };

  const handleRemixLook = (look: CuratedLook) => {
    setStudioInitialParams({
      garmentId: look.garmentId,
      occasionId: look.occasionId,
      styleId: look.styleId,
      colorId: look.colorId,
      accessoryIds: look.accessoryIds
    });
    setCurrentTab('studio');
  };

  const handleRemixOutfit = (outfit: Outfit) => {
    setStudioInitialParams({
      garmentId: outfit.garmentId,
      occasionId: outfit.occasionId,
      styleId: outfit.styleId,
      colorId: outfit.colorId,
      accessoryIds: outfit.accessoryIds
    });
    setCurrentTab('studio');
  };

  return (
    <ToastProvider>
      <MainLayout
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        compareCount={compareCount}
      >
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectGarmentToRemix={(garmentId) => {
              setStudioInitialParams({ garmentId });
            }}
            onSelectOccasionToRemix={(occasionId) => {
              setStudioInitialParams({ occasionId });
            }}
            onSelectStyleToRemix={(styleId) => {
              setStudioInitialParams({ styleId });
            }}
            onRemixLook={handleRemixLook}
          />
        )}

        {currentTab === 'studio' && (
          <StudioPage
            key={JSON.stringify(studioInitialParams)}
            initialGarmentId={studioInitialParams.garmentId}
            initialOccasionId={studioInitialParams.occasionId}
            initialStyleId={studioInitialParams.styleId}
            initialColorId={studioInitialParams.colorId}
            initialAccessoryIds={studioInitialParams.accessoryIds}
            onNavigate={handleNavigate}
            onRefreshCompareCount={refreshCompareCount}
          />
        )}

        {currentTab === 'lookbook' && (
          <LookbookPage
            onRemixLook={handleRemixLook}
            onNavigate={handleNavigate}
            onRefreshCompareCount={refreshCompareCount}
          />
        )}

        {currentTab === 'compare' && (
          <ComparePage
            onNavigate={handleNavigate}
            onRemixOutfit={handleRemixOutfit}
            onRefreshCompareCount={refreshCompareCount}
          />
        )}

        {currentTab === 'culture' && (
          <CulturePage
            onNavigate={handleNavigate}
            onSelectGarmentToRemix={(garmentId) => {
              setStudioInitialParams({ garmentId });
            }}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            onNavigate={handleNavigate}
            onRemixOutfit={handleRemixOutfit}
            onRefreshCompareCount={refreshCompareCount}
          />
        )}
      </MainLayout>
    </ToastProvider>
  );
}

export default App;
