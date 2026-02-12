import React, { useState } from 'react';
import { FeedScreen } from './components/feed-screen';
import { SearchScreen } from './components/search-screen';
import { ProfileScreen } from './components/profile-screen';
import { PlaceholderScreen } from './components/placeholder-screen';
import { ArticleDetailScreen } from './components/article-detail-screen';
import { EntityContextCard } from './components/entity-context-card';
import { ReferencePage } from './components/reference-page';
import { OnboardingScreen } from './components/onboarding-screen';
import { BottomTabBar, TabType } from './components/bottom-tab-bar';
import type { Article, ArticleEntity } from './data/mock-articles';

type Screen = 'onboarding' | 'feed' | 'article' | 'references';

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<ArticleEntity | null>(null);
  const [isEntityCardOpen, setIsEntityCardOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setCurrentScreen('feed');
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentScreen('article');
  };

  const handleEntityClick = (entity: ArticleEntity) => {
    setSelectedEntity(entity);
    setIsEntityCardOpen(true);
  };

  const handleViewReferences = () => {
    setCurrentScreen('references');
    setIsEntityCardOpen(false);
  };

  const handleBackToFeed = () => {
    setCurrentScreen('feed');
    setSelectedArticle(null);
    setIsEntityCardOpen(false);
  };

  const handleBackToArticle = () => {
    setCurrentScreen('article');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentScreen('feed');
    setSelectedArticle(null);
    setIsEntityCardOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const renderContent = () => {
    // Onboarding
    if (!hasCompletedOnboarding && currentScreen === 'onboarding') {
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    // Article Detail Screen
    if (currentScreen === 'article' && selectedArticle) {
      return (
        <>
          <ArticleDetailScreen
            article={selectedArticle}
            onBack={handleBackToFeed}
            onEntityClick={handleEntityClick}
            onViewReferences={handleViewReferences}
          />
          <EntityContextCard
            entity={selectedEntity}
            isOpen={isEntityCardOpen}
            onClose={() => setIsEntityCardOpen(false)}
            onViewReferences={handleViewReferences}
          />
        </>
      );
    }

    // Reference Page
    if (currentScreen === 'references' && selectedArticle) {
      return (
        <ReferencePage
          article={selectedArticle}
          onBack={handleBackToArticle}
        />
      );
    }

    // Tab-based screens
    switch (activeTab) {
      case 'feed':
        return <FeedScreen onArticleClick={handleArticleClick} />;
      
      case 'search':
        return <SearchScreen onArticleClick={handleArticleClick} />;
      
      case 'bookmarks':
        return (
          <PlaceholderScreen
            title="Bookmarks"
            icon="🔖"
            message="Save articles to read later. Coming soon!"
          />
        );
      
      case 'trending':
        return (
          <PlaceholderScreen
            title="Trending"
            icon="🔥"
            message="See what topics are trending. Coming soon!"
          />
        );
      
      case 'profile':
        return (
          <ProfileScreen
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );
      
      default:
        return <FeedScreen onArticleClick={handleArticleClick} />;
    }
  };

  return (
    <div 
      className="relative mx-auto h-screen overflow-hidden"
      style={{
        maxWidth: '393px',
        width: '100%',
        backgroundColor: 'var(--background)'
      }}
    >
      {/* Status Bar Simulation */}
      <div 
        className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 z-50"
        style={{
          backgroundColor: 'var(--background)',
        }}
      >
        <span style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--foreground)'
        }}>
          9:41
        </span>
        <div className="flex items-center gap-1.5">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
            <rect x="0.5" y="0.5" width="15" height="10" rx="2" stroke="currentColor" opacity="0.35"/>
            <rect x="1.5" y="1.5" width="13" height="8" rx="1" fill="currentColor"/>
            <rect x="16.5" y="3.5" width="1" height="4" rx="0.5" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      </div>

      <div className="pt-11 h-full">
        {renderContent()}
      </div>
      
      {/* Show Bottom Tab Bar only when not in onboarding, article detail, or reference page */}
      {hasCompletedOnboarding && 
       currentScreen !== 'article' && 
       currentScreen !== 'references' && (
        <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}