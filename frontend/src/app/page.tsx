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
import { Heart } from "lucide-react";

import { CurrencyItem, CategoryType } from "@/lib/types";
import { fetchCurrencies, getLocalCurrencies } from "@/lib/api";
import { useWishlist } from "@/lib/WishlistContext";

export default function StorefrontPage() {
  const [items, setItems] = useState<CurrencyItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [activeSeries, setActiveSeries] = useState<string>("");
  const [activeDetailItem, setActiveDetailItem] = useState<CurrencyItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState<"all" | "available" | "sold">("all");
  const [showGradingGuide, setShowGradingGuide] = useState(false);

  const { count } = useWishlist();

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
        setTimeout(() => {
          document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    };

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

  // Intercept Mobile Back Button (Swipe back / Hardware back button) to close open modals
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isAnyModalOpen = Boolean(activeDetailItem || wishlistOpen || showGradingGuide);

    if (isAnyModalOpen) {
      window.history.pushState({ tn_modal_open: true }, "");
    }

    const handlePopState = () => {
      setActiveDetailItem(null);
      setWishlistOpen(false);
      setShowGradingGuide(false);
      if (window.location.search.includes("item=")) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeDetailItem, wishlistOpen, showGradingGuide]);

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

        {/* Unified Clean Catalog Grid with Integrated Controls */}
        <CatalogGrid
          items={items}
          selectedCategory={selectedCategory}
          stockFilter={stockFilter}
          onSelectStockFilter={setStockFilter}
          activeSeries={activeSeries}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setActiveSeries("");
          }}
          onClearSeries={handleClearSeries}
          onOpenDetail={(item) => setActiveDetailItem(item)}
          onOpenGradingGuide={() => setShowGradingGuide(true)}
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
    </div>
  );
}
