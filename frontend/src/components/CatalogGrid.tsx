"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, SlidersHorizontal, ArrowUpDown, X, Award, ChevronDown, Check } from "lucide-react";
import { CurrencyItem, CategoryType } from "../lib/types";
import ProductCard from "./ProductCard";
import ScrollReveal from "./ScrollReveal";
import {
  useCurrency,
  CURRENCY_OPTIONS,
  FlagIcon,
  CurrencyCode,
} from "@/lib/CurrencyContext";

interface CatalogGridProps {
  items: CurrencyItem[];
  selectedCategory: CategoryType;
  stockFilter: "all" | "available" | "sold";
  onSelectStockFilter: (filter: "all" | "available" | "sold") => void;
  activeSeries?: string;
  onSelectCategory: (cat: CategoryType) => void;
  onClearSeries?: () => void;
  onOpenDetail: (item: CurrencyItem) => void;
  onOpenGradingGuide: () => void;
}

const CURRENCY_NAMES: Record<CurrencyCode, { name: string; symbol: string }> = {
  LKR: { name: "Sri Lankan Rupee (ශ්‍රී ලංකා රුපියල්)", symbol: "Rs." },
  USD: { name: "United States Dollar", symbol: "$" },
  GBP: { name: "British Pound Sterling", symbol: "£" },
  EUR: { name: "European Union Euro", symbol: "€" },
  AUD: { name: "Australian Dollar", symbol: "A$" },
};

export default function CatalogGrid({
  items,
  selectedCategory,
  stockFilter,
  onSelectStockFilter,
  activeSeries,
  onSelectCategory,
  onClearSeries,
  onOpenDetail,
  onOpenGradingGuide,
}: CatalogGridProps) {
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "year_desc" | "year_asc">("default");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const { currency, setCurrency } = useCurrency();

  const filteredItems = useMemo(() => {
    let result = [...items];

    // 1. Stock filter
    if (stockFilter === "available") {
      result = result.filter((it) => !it.is_sold);
    } else if (stockFilter === "sold") {
      result = result.filter((it) => it.is_sold);
    }

    // 2. Grade filter
    if (gradeFilter !== "all") {
      result = result.filter((it) => it.condition_grade.toLowerCase().includes(gradeFilter.toLowerCase()));
    }

    // 3. Sorting
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
  }, [items, stockFilter, gradeFilter, sortBy]);

  return (
    <section id="collection" className="py-10 sm:py-16 bg-[#0c0a08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal variant="up">
          <div className="space-y-3 pb-6 border-b border-[#d4af37]/20">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hand-Catalogued Numismatic Archive</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f8f6f0]">
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
                    Displaying {filteredItems.length} authenticated Ceylon banknotes &amp; ancient coins
                  </p>
                )}
              </div>

              {/* Category Pills (Banknote, Coin, All) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => onSelectCategory("all")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation min-h-[40px] ${
                    selectedCategory === "all"
                      ? "bg-[#d4af37] text-[#0c0a08] shadow-lg shadow-[#d4af37]/20 font-bold"
                      : "bg-[#18130e] text-[#d4cdbf] border border-[#d4af37]/25 hover:border-[#d4af37]/60 active:scale-95"
                  }`}
                >
                  All Collectibles
                </button>
                <button
                  onClick={() => onSelectCategory("banknote")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation min-h-[40px] ${
                    selectedCategory === "banknote"
                      ? "bg-[#d4af37] text-[#0c0a08] shadow-lg shadow-[#d4af37]/20 font-bold"
                      : "bg-[#18130e] text-[#d4cdbf] border border-[#d4af37]/25 hover:border-[#d4af37]/60 active:scale-95"
                  }`}
                >
                  💵 Banknotes (නෝට්ටු)
                </button>
                <button
                  onClick={() => onSelectCategory("coin")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation min-h-[40px] ${
                    selectedCategory === "coin"
                      ? "bg-[#d4af37] text-[#0c0a08] shadow-lg shadow-[#d4af37]/20 font-bold"
                      : "bg-[#18130e] text-[#d4cdbf] border border-[#d4af37]/25 hover:border-[#d4af37]/60 active:scale-95"
                  }`}
                >
                  🪙 Coins (කාසි)
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile & Desktop Responsive Controls Card */}
        <ScrollReveal variant="up" delay={50}>
          <div className="my-5 p-3 rounded-2xl bg-[#14100c] border border-[#d4af37]/25 shadow-xl space-y-3">
            {/* Top Row: Stock Status Segmented Bar (Full width on mobile) */}
            <div className="flex items-center rounded-xl bg-[#0a0806] border border-[#d4af37]/20 p-1 w-full">
              {(["all", "available", "sold"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => onSelectStockFilter(f)}
                  className={`flex-1 py-2 sm:py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all text-center whitespace-nowrap min-h-[38px] flex items-center justify-center ${
                    stockFilter === f
                      ? "bg-[#d4af37] text-[#0c0a08] shadow-md font-bold"
                      : "text-[#a69d8d] hover:text-[#f3e5ab]"
                  }`}
                >
                  {f === "all" ? "All Lots" : f === "available" ? "● In Vault" : "🏛️ Sold Archive"}
                </button>
              ))}
            </div>

            {/* Bottom Row: Sort, Grade, Guide, Currency (Grid on mobile, flex on desktop) */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2 text-xs font-mono">
              {/* Sort Dropdown */}
              <div className="relative flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0a0806] border border-[#d4af37]/25 text-[#f3e5ab] min-h-[42px]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-transparent text-xs text-[#f8f6f0] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="default" className="bg-[#14100c]">Sort: Default</option>
                  <option value="price_asc" className="bg-[#14100c]">Price: Low → High</option>
                  <option value="price_desc" className="bg-[#14100c]">Price: High → Low</option>
                  <option value="year_desc" className="bg-[#14100c]">Year: Newest First</option>
                  <option value="year_asc" className="bg-[#14100c]">Year: Ancient First</option>
                </select>
              </div>

              {/* Grade Filter Dropdown */}
              <div className="relative flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0a0806] border border-[#d4af37]/25 text-[#f3e5ab] min-h-[42px]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#f8f6f0] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="all" className="bg-[#14100c]">Grade: All</option>
                  <option value="UNC" className="bg-[#14100c]">UNC (Uncirculated)</option>
                  <option value="AU" className="bg-[#14100c]">AU (About Unc)</option>
                  <option value="XF" className="bg-[#14100c]">XF (Extremely Fine)</option>
                  <option value="VF" className="bg-[#14100c]">VF (Very Fine)</option>
                </select>
              </div>

              {/* Grading Guide Button */}
              <button
                type="button"
                onClick={onOpenGradingGuide}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a0806] border border-[#d4af37]/25 text-[#f3e5ab] hover:border-[#d4af37] hover:bg-[#1a140e] transition-all min-h-[42px]"
                title="Learn about UNC, AU, XF, VF grading terms"
              >
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Grading Guide</span>
              </button>

              {/* Currency Picker Button (Opens Finger-Friendly Mobile Bottom Sheet) */}
              <button
                type="button"
                onClick={() => setShowCurrencyModal(true)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#0a0806] border border-[#d4af37]/25 text-[#f3e5ab] hover:border-[#d4af37] hover:bg-[#1a140e] transition-all min-h-[42px] font-bold"
                title="Change display currency"
              >
                <FlagIcon code={currency} className="w-5 h-3.5 rounded-[2px]" />
                <span>{currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Products Grid with Staggered Scroll Reveal */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {filteredItems.map((item, idx) => (
              <ScrollReveal key={item.id || item.itemCode} variant="scale" delay={(idx % 4) * 80}>
                <ProductCard
                  item={item}
                  onOpenDetail={onOpenDetail}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-3xl bg-[#14100c] border border-[#d4af37]/20 p-8 my-6">
            <p className="font-serif text-xl text-[#f3e5ab]">No currency items matched your filters.</p>
            <p className="text-xs text-[#a69d8d] font-mono mt-2">
              Try adjusting your category selection, stock status, or clearing the search terms.
            </p>
            <button
              onClick={() => {
                onSelectCategory("all");
                onSelectStockFilter("all");
                setGradeFilter("all");
                setSortBy("default");
                onClearSeries?.();
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#d4af37] text-[#0c0a08] text-xs font-semibold uppercase tracking-wider hover:bg-[#e5c158] transition-colors shadow-lg"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile-Friendly Currency Selector Bottom Sheet / Modal */}
      {showCurrencyModal && (
        <div
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setShowCurrencyModal(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#14100c] border border-[#d4af37]/40 p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#f8f6f0]">
                  Select Currency (මුදල් ඒකකය)
                </h3>
                <p className="text-[11px] font-mono text-[#a69d8d]">
                  Prices will convert automatically at live approximate bank rates.
                </p>
              </div>
              <button
                onClick={() => setShowCurrencyModal(false)}
                className="p-2 rounded-full bg-[#201912] border border-[#d4af37]/30 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Currency Options List */}
            <div className="space-y-2">
              {CURRENCY_OPTIONS.map((c) => {
                const info = CURRENCY_NAMES[c];
                const isSelected = currency === c;
                return (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setShowCurrencyModal(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between text-left min-h-[52px] ${
                      isSelected
                        ? "bg-[#d4af37]/20 border-[#d4af37] shadow-lg shadow-[#d4af37]/10 ring-1 ring-[#d4af37]/50"
                        : "bg-[#18130e] border-[#d4af37]/15 hover:border-[#d4af37]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <FlagIcon code={c} className="w-7 h-5 rounded-[3px] shadow-md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-mono text-[#f8f6f0]">{c}</span>
                          <span className="text-xs font-mono text-[#d4af37]">({info.symbol})</span>
                        </div>
                        <span className="text-[11px] text-[#a69d8d] block">{info.name}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
