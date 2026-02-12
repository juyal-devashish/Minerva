import React from 'react';
import { Newspaper, Search, Bookmark, TrendingUp, User } from 'lucide-react';

export type TabType = 'feed' | 'search' | 'bookmarks' | 'trending' | 'profile';

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabConfig[] = [
  { id: 'feed', label: 'Feed', icon: Newspaper },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2 border-t"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        maxWidth: '393px',
        margin: '0 auto',
        zIndex: 50
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-[60px] transition-colors"
          >
            <Icon
              size={22}
              style={{
                color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                strokeWidth: isActive ? 2.5 : 2
              }}
            />
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.005em',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
