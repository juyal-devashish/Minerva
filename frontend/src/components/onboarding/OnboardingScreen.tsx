"use client";

import { useState } from "react";
import { Lightbulb, Hand, Grid3X3 } from "lucide-react";

const CATEGORIES = ["General", "Tech", "Business", "Science", "World", "Health"];

interface OnboardingScreenProps {
  onComplete: (selectedCategories: string[]) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const steps = [
    {
      icon: Lightbulb,
      title: "Read smarter, not harder",
      subtitle:
        "samā4 highlights key terms and entities in news articles, making complex stories easy to understand.",
      illustration: "📰",
    },
    {
      icon: Hand,
      title: "Tap to understand",
      subtitle:
        "Simply tap any highlighted term to get instant AI-generated context. Like having a smart assistant while you read.",
      illustration: "👆",
    },
    {
      icon: Grid3X3,
      title: "Choose your interests",
      subtitle:
        "Select topics you care about to personalize your news feed.",
      illustration: null,
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(
        selectedCategories.length > 0 ? selectedCategories : ["All"]
      );
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Illustration */}
        <div className="mb-8">
          {currentStepData.illustration ? (
            <div className="text-8xl mb-4">{currentStepData.illustration}</div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className="px-4 py-3 rounded-xl transition-all transform active:scale-95"
                  style={{
                    backgroundColor: selectedCategories.includes(category)
                      ? "var(--accent-primary)"
                      : "var(--background-secondary)",
                    color: selectedCategories.includes(category)
                      ? "white"
                      : "var(--text-secondary)",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    border: selectedCategories.includes(category)
                      ? "none"
                      : "1px solid var(--border)",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-center mb-3"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            color: "var(--foreground)",
          }}
        >
          {currentStepData.title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-center mb-8 max-w-sm"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px",
            lineHeight: "1.5",
            color: "var(--text-secondary)",
          }}
        >
          {currentStepData.subtitle}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-8">
        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className="h-2 rounded-full transition-all"
              style={{
                width: currentStep === index ? "24px" : "8px",
                backgroundColor:
                  currentStep === index
                    ? "var(--accent-primary)"
                    : "var(--divider)",
              }}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "white",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          {currentStep === steps.length - 1 ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
}
