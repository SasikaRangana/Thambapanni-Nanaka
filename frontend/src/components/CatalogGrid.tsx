"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Sparkles, SlidersHorizontal, ArrowUpDown, X, Award, ChevronDown } from "lucide-react";
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
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const { currency, setCurrency } = useCurrency();
  const currencyPickerRef = useRef<HTMLDivElement>(null);

  // Click-outside listener for Currency Picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currencyPickerRef.current &&
        !currencyPickerRef.current.contains(event.target as Node)
      ) {
        setShowCurrencyPicker(false);
      }
    };
    if (showCurrencyPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCurrencyPicker]);

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
    <section id="collection" className="py-12 sm:py-16 bg-[#0c0a08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Main Category Tabs */}
        <ScrollReveal variant="up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#d4af37]/20">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hand-Catalogued Numismatic Archive</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f8f6f0] mt-1">
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

            {/* Category Filter Pills (Banknote, Coin, All) */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => onSelectCategory("all")}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#d4af37] text-[#0c0a08] shadow-lg shadow-[#d4af37]/20 font-bold"
                    : "bg-[#18130e] text-[#d4cdbf] border border-[#d4af37]/25 hover:border-[#d4af37]/60"
                }`}
              >
                All Collectibles
              </button>
              <button
                onClick={() => onSelectCategory("banknote")}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === "banknote"
                    ? "bg-[#d4af37] text-[#0c0a08] shadow-lg shadow-[#d4af37]/20 font-bold"
                    : "bg-[#18130e] text-[#d4cdbf] border border-[#d4af37]/25 hover:border-[#d4af37]/60"
                }`}
              >
                💵 Banknotes (නෝට්ටු)
              </button>
              <button
                onClick={() => onSelectCategory("coin")}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === "coin"
                    ? "bg-[#d4af37] text-[#0c0a08] shadow-lg shadow-[#d4af37]/20 font-bold"
                    : "bg-[#18130e] text-[#d4cdbf] border border-[#d4af37]/25 hover:border-[#d4af37]/60"
                }`}
              >
                🪙 Coins (කාසි)
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Unified Luxury Control Bar — Stock Status, Sort, Grades, & Currency */}
        <ScrollReveal variant="up" delay={50}>
          <div className="my-6 p-2.5 sm:p-3 rounded-2xl bg-[#14100c] border border-[#d4af37]/25 shadow-xl relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            {/* Left: Stock Status Segmented Switcher */}
            <div className="flex items-center rounded-xl bg-[#0a0806] border border-[#d4af37]/20 p-1 w-full md:w-auto">
              {(["all", "available", "sold"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => onSelectStockFilter(f)}
                  className={`flex-1 md:flex-none px-3 sm:px-4 py-1.5 rounded-lg font-semibold transition-all text-center whitespace-nowrap ${
                    stockFilter === f
                      ? "bg-[#d4af37] text-[#0c0a08] shadow-sm font-bold"
                      : "text-[#a69d8d] hover:text-[#f3e5ab]"
                  }`}
                >
                  {f === "all" ? "All Lots" : f === "available" ? "● In Vault" : "🏛️ Sold Archive"}
                </button>
              ))}
            </div>

            {/* Right: Sort, Condition Grade & Currency controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 justify-end">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0a0806] border border-[#d4af37]/25 text-[#f3e5ab]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-[#f8f6f0] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="default" className="bg-[#14100c]">Default Order</option>
                  <option value="price_asc" className="bg-[#14100c]">Price: Low to High</option>
                  <option value="price_desc" className="bg-[#14100c]">Price: High to Low</option>
                  <option value="year_desc" className="bg-[#14100c]">Year: Newest First</option>
                  <option value="year_asc" className="bg-[#14100c]">Year: Ancient First</option>
                </select>
              </div>

              {/* Grade Filter Dropdown */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0a0806] border border-[#d4af37]/25 text-[#f3e5ab]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="bg-transparent text-xs text-[#f8f6f0] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="all" className="bg-[#14100c]">All Grades</option>
                  <option value="UNC" className="bg-[#14100c]">UNC (Uncirculated)</option>
                  <option value="AU" className="bg-[#14100c]">AU (About Unc)</option>
                  <option value="XF" className="bg-[#14100c]">XF (Extremely Fine)</option>
                  <option value="VF" className="bg-[#14100c]">VF (Very Fine)</option>
                </select>
              </div>

              {/* Grading Guide Trigger */}
              <button
                onClick={onOpenGradingGuide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a0806] border border-[#d4af37]/25 text-xs text-[#f3e5ab] hover:border-[#d4af37] hover:bg-[#1a140e] transition-all shadow-sm"
                title="Learn about UNC, AU, XF, VF grading terms"
              >
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline">Guide</span>
              </button>

              {/* Currency Picker Dropdown */}
              <div ref={currencyPickerRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowCurrencyPicker((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0a0806] border border-[#d4af37]/25 text-xs text-[#f3e5ab] hover:border-[#d4af37] transition-all shadow-sm"
                >
                  <FlagIcon code={currency} className="w-4 h-3 rounded-[2px]" />
                  <span className="font-bold">{currency}</span>
                  <ChevronDown className="w-3 h-3 text-[#d4af37]" />
                </button>

                {showCurrencyPicker && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-[#18130e] border border-[#d4af37]/40 shadow-2xl z-50 overflow-hidden py-1">
                    {CURRENCY_OPTIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setShowCurrencyPicker(false);
                        }}
                        className={`w-full px-3 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                          currency === c
                            ? "bg-[#d4af37]/20 text-[#f3e5ab] font-bold"
                            : "text-[#b8af9e] hover:bg-[#221b14] hover:text-[#f3e5ab]"
                        }`}
                      >
                        <FlagIcon code={c} className="w-4 h-3 rounded-[2px]" />
                        <span>{c}</span>
                        {currency === c && <span className="ml-auto text-[#d4af37] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
    </section>
  );
}
