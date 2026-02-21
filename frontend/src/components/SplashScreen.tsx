"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  // 0 = text, 1 = logo, 2 = done
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => onComplete(), 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "var(--background)" }}
        >
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.h1
                key="text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: "36px",
                  letterSpacing: "-0.02em",
                  color: "var(--foreground)",
                }}
              >
                samā4
              </motion.h1>
            )}

            {phase === 1 && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 200,
                }}
                className="flex flex-col items-center gap-4"
              >
                <img
                  src="/sama4-logo.jpg"
                  alt="samā4"
                  className="w-24 h-24 object-contain"
                />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  News, understood
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
