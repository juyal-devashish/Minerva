import React, { useState } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { CategoryChip } from './category-chip';
import { ArticleCard } from './article-card';
import { mockArticles, categories } from '../data/mock-articles';
import type { Article } from '../data/mock-articles';

interface FeedScreenProps {
  onArticleClick: (article: Article) => void;
}

export function FeedScreen({ onArticleClick }: FeedScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredArticles = selectedCategory === 'All'
    ? mockArticles
    : mockArticles.filter(article => article.category === selectedCategory);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-1 pb-2">
        <h1
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: '20px',
            letterSpacing: '-0.01em',
            color: 'var(--foreground)'
          }}
        >
          Minerva
        </h1>
        <button className="p-2 hover:bg-[var(--background-secondary)] rounded-full transition-colors">
          <Bell size={20} style={{ color: 'var(--foreground)' }} />
        </button>
      </div>

      {/* Greeting */}
      <div className="px-4 pb-3">
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            fontSize: '16px',
            color: 'var(--text-secondary)'
          }}
        >
          Good morning, Devashish
        </p>
      </div>

      {/* Category Chips */}
      <div className="px-4 pb-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 pb-1">
          {categories.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* Article Feed */}
      <div className="flex-1 overflow-y-auto pb-20 px-4">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 mx-auto mb-4 px-4 py-2 rounded-full hover:bg-[var(--background-secondary)] transition-colors"
        >
          <RefreshCw
            size={16}
            className={isRefreshing ? 'animate-spin' : ''}
            style={{ color: 'var(--accent-primary)' }}
          />
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: 'var(--accent-primary)'
            }}
          >
            Pull to refresh
          </span>
        </button>

        {filteredArticles.length > 0 ? (
          <>
            {/* Hero Card (First Article) */}
            <ArticleCard
              article={filteredArticles[0]}
              variant="hero"
              onClick={() => onArticleClick(filteredArticles[0])}
            />

            {/* Standard Cards */}
            <div className="space-y-3">
              {filteredArticles.slice(1).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="standard"
                  onClick={() => onArticleClick(article)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <p
              className="text-center"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                color: 'var(--foreground)'
              }}
            >
              No articles yet.
            </p>
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}
            >
              Check back soon.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}