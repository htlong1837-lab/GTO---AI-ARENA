import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { StudioPage } from './pages/StudioPage';
import { Studio3DPage } from './pages/Studio3DPage';
import { LookbookPage } from './pages/LookbookPage';
import { ComparePage } from './pages/ComparePage';
import { CulturePage } from './pages/CulturePage';
import { ProfilePage } from './pages/ProfilePage';
import { CommunityPage } from './pages/CommunityPage';
import { PostDraft } from './services/communityDrafts';
import { SharedLook } from './types/community';
import { ToastProvider } from './context/ToastContext';
import { StorageService } from './services/storageService';
import { Outfit, CuratedLook } from './types/outfit';

// Liên kết chia sẻ dạng #/community hoặc #/community/post/<id> (chạy được trên GitHub Pages)
const parseHash = (): { tab: string | null; postId: string | null } => {
  const m = window.location.hash.match(/^#\/community(?:\/post\/([\w-]+))?/);
  return m ? { tab: 'community', postId: m[1] || null } : { tab: null, postId: null };
};

const setHash = (hash: string) => {
  if (window.location.hash !== hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
  }
};

export function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => parseHash().tab || 'home');
  const [communityPostId, setCommunityPostId] = useState<string | null>(() => parseHash().postId);
  const [communityDraft, setCommunityDraft] = useState<PostDraft | null>(null);
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
    gender?: 'female' | 'male';
    weatherId?: string;
    aiGeneratedImage?: string;
  }>({});

  const refreshCompareCount = () => {
    setCompareCount(StorageService.getCompareList().length);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentTab !== 'community') setHash('');
    else setHash(communityPostId ? `#/community/post/${communityPostId}` : '#/community');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  useEffect(() => {
    const onHash = () => {
      const { tab, postId } = parseHash();
      if (tab) {
        setCurrentTab(tab);
        setCommunityPostId(postId);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleOpenPostChange = useCallback((postId: string | null) => {
    setCommunityPostId(postId);
    setHash(postId ? `#/community/post/${postId}` : '#/community');
  }, []);

  const handleShareToCommunity = (draft: PostDraft) => {
    setCommunityDraft(draft);
    setCommunityPostId(null);
    setCurrentTab('community');
  };

  const handleRemixSharedLook = (look: SharedLook) => {
    setStudioInitialParams({
      garmentId: look.garmentId,
      occasionId: look.occasionId,
      styleId: look.styleId,
      colorId: look.colorId,
      accessoryIds: look.accessoryIds,
      gender: look.gender
    });
    setCommunityPostId(null);
    setCurrentTab('studio');
  };

  const clearCommunityDraft = useCallback(() => setCommunityDraft(null), []);

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
      accessoryIds: look.accessoryIds,
      gender: 'female'
    });
    setCurrentTab('studio');
  };

  const handleRemixOutfit = (outfit: Outfit) => {
    setStudioInitialParams({
      garmentId: outfit.garmentId,
      occasionId: outfit.occasionId,
      styleId: outfit.styleId,
      colorId: outfit.colorId,
      accessoryIds: outfit.accessoryIds,
      gender: outfit.gender,
      weatherId: outfit.weatherId,
      aiGeneratedImage: outfit.aiGeneratedImage
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
            initialGender={studioInitialParams.gender}
            initialWeatherId={studioInitialParams.weatherId}
            initialAiImageUrl={studioInitialParams.aiGeneratedImage}
            onNavigate={handleNavigate}
            onRefreshCompareCount={refreshCompareCount}
            onShareToCommunity={handleShareToCommunity}
          />
        )}

        {currentTab === 'community' && (
          <CommunityPage
            initialPostId={communityPostId}
            draft={communityDraft}
            onDraftConsumed={clearCommunityDraft}
            onRemixLook={handleRemixSharedLook}
            onOpenPostChange={handleOpenPostChange}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'studio3d' && (
          <Studio3DPage />
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
            onShareToCommunity={handleShareToCommunity}
          />
        )}
      </MainLayout>
    </ToastProvider>
  );
}

export default App;
