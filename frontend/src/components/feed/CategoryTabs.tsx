"use client";

const CATEGORIES = ["all", "general", "tech", "business", "science", "world"];

interface CategoryTabsProps {
  active: string;
  onChange: (category: string) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 pb-1">
      {CATEGORIES.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all ${
              isActive
                ? "text-white"
                : "border hover:border-[var(--accent-secondary)]"
            }`}
            style={{
              backgroundColor: isActive ? "var(--accent-primary)" : "transparent",
              borderColor: isActive ? undefined : "var(--border)",
              color: isActive ? "white" : "var(--text-secondary)",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.005em",
              textTransform: "capitalize",
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
