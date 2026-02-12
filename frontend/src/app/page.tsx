"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, RefreshCw } from "lucide-react";
import { BottomTabBar, type TabType } from "@/components/navigation/BottomTabBar";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { FeedList } from "@/components/feed/FeedList";
import { SearchScreen } from "@/components/search/SearchScreen";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [category, setCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onboarded = localStorage.getItem("minerva_onboarded");
    if (!onboarded) {
      setShowOnboarding(true);
    }
    const savedDark = localStorage.getItem("minerva_dark_mode");
    if (savedDark === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("minerva_dark_mode", String(next));
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleOnboardingComplete = (selectedCategories: string[]) => {
    localStorage.setItem("minerva_onboarded", "true");
    localStorage.setItem(
      "minerva_categories",
      JSON.stringify(selectedCategories)
    );
    setShowOnboarding(false);
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (!mounted) return null;

  if (showOnboarding) {
    return (
      <div className="max-w-[393px] mx-auto h-screen overflow-hidden">
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="max-w-[393px] mx-auto h-screen flex flex-col overflow-hidden">
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "feed" && (
          <div
            className="flex flex-col h-full"
            style={{ backgroundColor: "var(--background)" }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: "20px",
                  letterSpacing: "-0.01em",
                  color: "var(--foreground)",
                }}
              >
                Minerva
              </h1>
              <button className="p-2 hover:bg-[var(--background-secondary)] rounded-full transition-colors">
                <Bell size={20} style={{ color: "var(--foreground)" }} />
              </button>
            </div>

            {/* Greeting */}
            <div className="px-4 pb-3">
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                }}
              >
                {getGreeting()}
              </p>
            </div>

            {/* Category Chips */}
            <div className="px-4 pb-4 overflow-x-auto hide-scrollbar">
              <CategoryTabs active={category} onChange={setCategory} />
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto pb-20 px-4">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 mx-auto mb-4 px-4 py-2 rounded-full hover:bg-[var(--background-secondary)] transition-colors"
              >
                <RefreshCw
                  size={16}
                  className={isRefreshing ? "animate-spin" : ""}
                  style={{ color: "var(--accent-primary)" }}
                />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "var(--accent-primary)",
                  }}
                >
                  Pull to refresh
                </span>
              </button>

              <FeedList
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
          <PlaceholderScreen
            icon="📈"
            title="Trending"
            message="Discover what's trending. Popular stories will appear here."
          />
        )}

        {activeTab === "profile" && (
          <ProfileScreen
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        )}
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
