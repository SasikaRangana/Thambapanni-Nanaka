"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { CurrencyItem, CategoryType } from "../lib/types";
import ProductCard from "./ProductCard";
import ScrollReveal from "./ScrollReveal";

interface CatalogGridProps {
  items: CurrencyItem[];
  selectedCategory: CategoryType;
  activeSeries?: string;
  onSelectCategory: (cat: CategoryType) => void;
  onClearSeries?: () => void;
  onOpenDetail: (item: CurrencyItem) => void;
}

export default function CatalogGrid({
  items,
  selectedCategory,
  activeSeries,
  onSelectCategory,
  onClearSeries,
  onOpenDetail,
}: CatalogGridProps) {
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "year_desc" | "year_asc">("default");
  const [gradeFilter, setGradeFilter] = useState("all");

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (gradeFilter !== "all") {
      result = result.filter((it) => it.condition_grade.toLowerCase().includes(gradeFilter.toLowerCase()));
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "year_desc") {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === "year_asc") {
      result.sort((a, b) => a.year - b.year);
    }

    return result;
  }, [items, gradeFilter, sortBy]);

  return (
    <section id="collection" className="py-16 bg-[#0c0a08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal variant="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#d4af37]/20">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hand-Catalogued Numismatic Archive</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f8f6f0] mt-1.5">
                Verified Historical Collection
              </h2>
              {activeSeries && activeSeries !== "all" ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-[#f3e5ab] font-mono bg-[#d4af37]/15 border border-[#d4af37]/40 px-3 py-1 rounded-full">
                    Series: {activeSeries}
                  </span>
                  <button
                    onClick={onClearSeries}
                    className="text-[#a69d8d] hover:text-[#d4af37] transition-colors"
                    title="Clear series filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-[#b8af9e] mt-1 font-mono">
                  Displaying {filteredItems.length} authenticated Ceylon banknotes and ancient coins
                </p>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onSelectCategory("all")}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#d4af37] text-[#0c0a08] shadow-lg shadow-[#d4af37]/20 scale-105"
                    : "bg-[#18130e] text-[#d4cdbf] border border-[#d4af37]/20 hover:border-[#d4af37]/50"
                }`}
              >
                All Items (සියල්ල)
              </button>
              <button
                onClick={() => onSelectCategory("banknote")}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === "banknote"
                    ? "bg-[#d4af37] text-[#0c0a08] shadow-lg shadow-[#d4af37]/20 scale-105"
                    : "bg-[#18130e] text-[#d4cdbf] border border-[#d4af37]/20 hover:border-[#d4af37]/50"
                }`}
              >
                💵 Banknotes (නෝට්ටු)
              </button>
              <button
                onClick={() => onSelectCategory("coin")}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === "coin"
                    ? "bg-[#d4af37] text-[#0c0a08] shadow-lg shadow-[#d4af37]/20 scale-105"
                    : "bg-[#18130e] text-[#d4cdbf] border border-[#d4af37]/20 hover:border-[#d4af37]/50"
                }`}
              >
                🪙 Coins (කාසි)
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Secondary Sorting and Condition Filter Bar */}
        <ScrollReveal variant="up" delay={100}>
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-xs font-mono">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#a69d8d]">Condition Grade:</span>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#14100c] border border-[#d4af37]/25 text-[#f8f6f0] focus:outline-none focus:border-[#d4af37]"
              >
                <option value="all">All Grades</option>
                <option value="UNC">UNC (Uncirculated)</option>
                <option value="XF">XF (Extremely Fine)</option>
                <option value="VF">VF (Very Fine)</option>
                <option value="AU">AU (About Uncirculated)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <ArrowUpDown className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#a69d8d]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg bg-[#14100c] border border-[#d4af37]/25 text-[#f8f6f0] focus:outline-none focus:border-[#d4af37]"
              >
                <option value="default">Default Catalog Order</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest to Oldest</option>
                <option value="year_asc">Year: Oldest / Ancient First</option>
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* Products Grid with Staggered Scroll Reveal */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {filteredItems.map((item, idx) => (
              <ScrollReveal key={item.id || item.itemCode} variant="scale" delay={(idx % 4) * 100}>
                <ProductCard
                  item={item}
                  onOpenDetail={onOpenDetail}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-[#14100c] border border-[#d4af37]/20 p-8">
            <p className="font-serif text-xl text-[#f3e5ab]">No currency items matched your filters.</p>
            <p className="text-xs text-[#a69d8d] font-mono mt-2">
              Try adjusting your category selection or clearing the search terms.
            </p>
            <button
              onClick={() => {
                onSelectCategory("all");
                setGradeFilter("all");
                setSortBy("default");
                onClearSeries?.();
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#d4af37] text-[#0c0a08] text-xs font-semibold uppercase tracking-wider"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
