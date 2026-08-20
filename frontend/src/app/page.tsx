"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Marquee from "../components/Marquee";
import Hero from "../components/Hero";
import TrustPillars from "../components/TrustPillars";
import SeriesCarousel from "../components/SeriesCarousel";
import CatalogGrid from "../components/CatalogGrid";
import VerifyBanner from "../components/VerifyBanner";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import StatsBand from "../components/StatsBand";
import ItemDetailModal from "../components/ItemDetailModal";
import Footer from "../components/Footer";
import PrefixDecoder from "../components/PrefixDecoder";
import WishlistDrawer from "../components/WishlistDrawer";
import GradingGuideModal from "../components/GradingGuideModal";
import { ScrollProgressBar, BackToTop } from "../components/ScrollFeatures";
import { Heart, Award, HelpCircle } from "lucide-react";

import { CurrencyItem, CategoryType } from "@/lib/types";
import { fetchCurrencies, getLocalCurrencies } from "@/lib/api";
import { DEFAULT_CURRENCIES } from "@/data/mockCurrencies";
import { useWishlist } from "@/lib/WishlistContext";
import {
  useCurrency,
  CURRENCY_OPTIONS,
  FlagIcon,
  CurrencyCode,
} from "@/lib/CurrencyContext";

export default function StorefrontPage() {
  const [items, setItems] = useState<CurrencyItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [activeSeries, setActiveSeries] = useState<string>("");
  const [activeDetailItem, setActiveDetailItem] = useState<CurrencyItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [stockFilter, setStockFilter] = useState<"all" | "available" | "sold">("all");
  const [showGradingGuide, setShowGradingGuide] = useState(false);

  const { count } = useWishlist();
  const { currency, setCurrency } = useCurrency();

  const loadData = async (cat?: CategoryType, era?: string, search?: string, series?: string) => {
    setLoading(true);
    const res = await fetchCurrencies({
      category: cat || selectedCategory,
      era: era as any,
      search: search,
      series: series,
    });
    setItems(res.items);
    setLoading(false);
  };

  useEffect(() => {
    // 1. Instant local load on mount
    const cached = getLocalCurrencies();
    setItems(cached);

    // 2. Fetch/filter
    loadData(selectedCategory, undefined, undefined, activeSeries || undefined);

    const handleCatalogUpdate = () => {
      loadData(selectedCategory, undefined, undefined, activeSeries || undefined);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("thambapanni_catalog_updated", handleCatalogUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("thambapanni_catalog_updated", handleCatalogUpdate);
      }
    };
  }, [selectedCategory, activeSeries]);

  // Deep-link: auto-open modal if ?item=SKU in URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const itemParam = params.get("item");
    if (!itemParam) return;

    const tryOpen = () => {
      const allItems = getLocalCurrencies();
      const q = itemParam.toLowerCase().trim();
      const found = allItems.find(
        (it) =>
          it.itemCode.toLowerCase() === q ||
          it.id.toLowerCase() === q ||
          it.title.toLowerCase().includes(q)
      );
      if (found) {
        setActiveDetailItem(found);
        // Scroll to collection
        setTimeout(() => {
          document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    };

    // Try immediately and after data loads
    tryOpen();
    const timer = setTimeout(tryOpen, 1500);
    return () => clearTimeout(timer);
  }, [items]);

  const handleHeroSearch = (query: string, category: string, era: string) => {
    setActiveSeries("");
    setSelectedCategory(category as CategoryType);
    loadData(category as CategoryType, era, query, undefined);
  };

  const handleSelectSeries = (series: string) => {
    setActiveSeries(series);
    setSelectedCategory("all");
    loadData("all", undefined, undefined, series);
  };

  const handleClearSeries = () => {
    setActiveSeries("");
    loadData(selectedCategory, undefined, undefined, undefined);
  };

  // Apply stock filter
  const filteredByStock =
    stockFilter === "all"
      ? items
      : stockFilter === "available"
      ? items.filter((it) => !it.is_sold)
      : items.filter((it) => it.is_sold);

  // Clear URL param when modal closes
  const handleCloseModal = () => {
    setActiveDetailItem(null);
    if (typeof window !== "undefined" && window.location.search.includes("item=")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a08] flex flex-col selection:bg-[#d4af37]/30 selection:text-[#f3e5ab] relative">
      {/* Gilded Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      <Header />
      <Marquee />

      <main className="flex-1">
        <Hero onSearch={handleHeroSearch} />
        <TrustPillars />
        <SeriesCarousel onSelectSeries={handleSelectSeries} />

        {/* Stock Filter Toggle + Currency Selector — above catalog */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#120f0c]/60 p-2 sm:p-2.5 rounded-2xl border border-[#d4af37]/20 backdrop-blur-sm">
            {/* Available / Sold Toggle */}
            <div className="flex items-center w-full sm:w-auto rounded-xl bg-[#0e0c09] border border-[#d4af37]/20 p-1">
              {(["all", "available", "sold"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setStockFilter(f)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono font-semibold rounded-lg transition-all text-center ${
                    stockFilter === f
                      ? "bg-[#d4af37] text-[#0c0a08] shadow-md font-bold"
                      : "text-[#b8af9e] hover:text-[#f3e5ab]"
                  }`}
                >
                  {f === "all" ? "All Items" : f === "available" ? "● Available" : "🏛️ Sold Archive"}
                </button>
              ))}
            </div>

            {/* Currency Selector & Grading Guide */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setShowGradingGuide(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-[#0e0c09] border border-[#d4af37]/25 text-xs font-mono text-[#f3e5ab] hover:border-[#d4af37] hover:bg-[#1a140e] transition-all shadow-sm"
                title="View Banknote Condition & Grading Guide"
              >
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline">Grading Guide</span>
                <span className="sm:hidden">Grades</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowCurrencyPicker((v) => !v)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0e0c09] border border-[#d4af37]/25 text-xs font-mono text-[#f3e5ab] hover:border-[#d4af37] transition-all shadow-sm"
                >
                  <FlagIcon code={currency} className="w-5 h-3.5 rounded-[2px] shadow-sm" />
                  <span className="font-semibold">{currency}</span>
                  <svg className="w-3 h-3 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showCurrencyPicker && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#16120d] border border-[#d4af37]/35 shadow-2xl z-50 overflow-hidden py-1">
                    {CURRENCY_OPTIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setShowCurrencyPicker(false);
                        }}
                        className={`w-full px-3.5 py-2.5 text-xs font-mono flex items-center gap-2.5 transition-colors ${
                          currency === c
                            ? "bg-[#d4af37]/20 text-[#f3e5ab] font-bold"
                            : "text-[#b8af9e] hover:bg-[#201912] hover:text-[#f3e5ab]"
                        }`}
                      >
                        <FlagIcon code={c} className="w-5 h-3.5 rounded-[2px] shadow-sm" />
                        <span>{c}</span>
                        {currency === c && <span className="ml-auto text-[#d4af37] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <CatalogGrid
          items={filteredByStock}
          selectedCategory={selectedCategory}
          activeSeries={activeSeries}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setActiveSeries("");
          }}
          onClearSeries={handleClearSeries}
          onOpenDetail={(item) => setActiveDetailItem(item)}
        />
        <VerifyBanner onOpenDetail={(item) => setActiveDetailItem(item)} />
        <PrefixDecoder />
        <HowItWorks />
        <Testimonials />
        <StatsBand />
      </main>

      <Footer />

      {/* Floating Wishlist Badge */}
      <button
        onClick={() => setWishlistOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-br from-[#1e1710] to-[#14100c] border border-[#d4af37]/40 shadow-2xl hover:border-[#d4af37] transition-all group"
        title="Open inquiry list"
      >
        <Heart className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" fill={count > 0 ? "currentColor" : "none"} />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
            {count}
          </span>
        )}
      </button>

      {/* Floating Back to Top Action */}
      <BackToTop />

      {/* Wishlist Drawer */}
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />

      {/* Global Detail & High-Res Loupe Inspection Modal */}
      <ItemDetailModal
        item={activeDetailItem}
        onClose={handleCloseModal}
      />

      {/* Global Banknote Condition & Grading Guide Modal */}
      <GradingGuideModal
        open={showGradingGuide}
        onClose={() => setShowGradingGuide(false)}
      />

      {/* Close currency picker on outside click */}
      {showCurrencyPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCurrencyPicker(false)}
        />
      )}
    </div>
  );
}
