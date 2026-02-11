"use client";

import { Button } from "@/components/ui/button";

const CATEGORIES = ["all", "general", "tech", "business", "science", "world"];

interface CategoryTabsProps {
  active: string;
  onChange: (category: string) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={active === category ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(category)}
          className="capitalize whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
