"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["all", "general", "tech", "business", "science", "world"];

export function CategoryTabs() {
  const [active, setActive] = useState("all");

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={active === category ? "default" : "outline"}
          size="sm"
          onClick={() => setActive(category)}
          className="capitalize whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
