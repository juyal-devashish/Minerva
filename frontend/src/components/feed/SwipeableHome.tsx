"use client";

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { CardSwiper } from "./CardSwiper";
import { FeedList } from "./FeedList";

interface SwipeableHomeProps {
  category?: string;
  onArticleClick: (articleId: string) => void;
}

export function SwipeableHome({ category, onArticleClick }: SwipeableHomeProps) {
  // 0 = FeedList (traditional), 1 = CardSwiper (landing default)
  const [viewIndex, setViewIndex] = useState(1);

  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (viewIndex === 1) setViewIndex(0);
    },
    onSwipedLeft: () => {
      if (viewIndex === 0) setViewIndex(1);
    },
    trackMouse: false,
    delta: 50,
    preventScrollOnSwipe: false,
  });

  return (
    <div className="relative h-full overflow-hidden" {...handlers}>
      <AnimatePresence mode="wait" initial={false}>
        {viewIndex === 1 ? (
          <motion.div
            key="swiper"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-0"
          >
            <CardSwiper category={category} onArticleClick={onArticleClick} />
          </motion.div>
        ) : (
          <motion.div
            key="feed"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-0 overflow-y-auto pb-4 px-4"
          >
            <FeedList category={category} onArticleClick={onArticleClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* View indicator dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        <div
          className="rounded-full transition-all duration-200"
          style={{
            width: viewIndex === 0 ? "16px" : "6px",
            height: "6px",
            backgroundColor:
              viewIndex === 0 ? "var(--accent-primary)" : "var(--text-tertiary)",
            opacity: viewIndex === 0 ? 1 : 0.4,
          }}
        />
        <div
          className="rounded-full transition-all duration-200"
          style={{
            width: viewIndex === 1 ? "16px" : "6px",
            height: "6px",
            backgroundColor:
              viewIndex === 1 ? "var(--accent-primary)" : "var(--text-tertiary)",
            opacity: viewIndex === 1 ? 1 : 0.4,
          }}
        />
      </div>
    </div>
  );
}
