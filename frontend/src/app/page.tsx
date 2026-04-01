"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { BottomTabBar, type TabType } from "@/components/navigation/BottomTabBar";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { SwipeableHome } from "@/components/feed/SwipeableHome";
import { SearchScreen } from "@/components/search/SearchScreen";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { SplashScreen } from "@/components/SplashScreen";
import { TrendingScreen } from "@/components/prediction/TrendingScreen";

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [category, setCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onboarded = localStorage.getItem("sama4_onboarded");
    if (!onboarded) {
      setShowOnboarding(true);
    }
    const savedDark = localStorage.getItem("sama4_dark_mode");
    if (savedDark === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("sama4_dark_mode", String(next));
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleOnboardingComplete = (selectedCategories: string[]) => {
    localStorage.setItem("sama4_onboarded", "true");
    localStorage.setItem(
      "sama4_categories",
      JSON.stringify(selectedCategories)
    );
    setShowOnboarding(false);
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-[393px] mx-auto h-screen flex flex-col overflow-hidden">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Onboarding (after splash) */}
      {!showSplash && showOnboarding && (
        <div className="flex-1 overflow-hidden">
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </div>
      )}

      {/* Main App */}
      {!showSplash && !showOnboarding && (
        <>
          <div className="flex-1 overflow-hidden">
            {activeTab === "feed" && (
              <div
                className="flex flex-col h-full"
                style={{ backgroundColor: "var(--background)" }}
              >
                {/* Top Bar */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <img
                      src="/sama4-logo.jpg"
                      alt="samā4"
                      className="w-7 h-7 object-contain"
                    />
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        fontSize: "18px",
                        letterSpacing: "-0.01em",
                        color: "var(--foreground)",
                      }}
                    >
                      samā4
                    </span>
                  </div>
                  <button className="p-2 hover:bg-[var(--background-secondary)] rounded-full transition-colors">
                    <Bell size={20} style={{ color: "var(--foreground)" }} />
                  </button>
                </div>

                {/* Category Tabs */}
                <div className="flex-shrink-0 overflow-x-auto hide-scrollbar">
                  <div className="px-4 pb-2">
                    <CategoryTabs active={category} onChange={setCategory} />
                  </div>
                </div>

                {/* Swipeable Feed Area */}
                <div className="flex-1 overflow-hidden">
                  <SwipeableHome
                    category={category}
                    onArticleClick={handleArticleClick}
                  />
                </div>
              </div>
            )}

            {activeTab === "search" && (
              <SearchScreen onArticleClick={handleArticleClick} />
            )}

            {activeTab === "bookmarks" && (
              <PlaceholderScreen
                icon="🔖"
                title="Bookmarks"
                message="Save articles to read later. Your bookmarks will appear here."
              />
            )}

            {activeTab === "trending" && (
              <TrendingScreen />
            )}

            {activeTab === "profile" && (
              <ProfileScreen
                darkMode={darkMode}
                onToggleDarkMode={handleToggleDarkMode}
              />
            )}
          </div>

          <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  );
}
