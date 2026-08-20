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
import { ScrollProgressBar, BackToTop } from "../components/ScrollFeatures";

import { CurrencyItem, CategoryType } from "@/lib/types";
import { fetchCurrencies, getLocalCurrencies } from "@/lib/api";
import { DEFAULT_CURRENCIES } from "@/data/mockCurrencies";

export default function StorefrontPage() {
  const [items, setItems] = useState<CurrencyItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [activeSeries, setActiveSeries] = useState<string>("");
  const [activeDetailItem, setActiveDetailItem] = useState<CurrencyItem | null>(null);
  const [loading, setLoading] = useState(false);

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
        <CatalogGrid
          items={items}
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
        <HowItWorks />
        <Testimonials />
        <StatsBand />
      </main>

      <Footer />

      {/* Floating Back to Top Action */}
      <BackToTop />

      {/* Global Detail & High-Res Loupe Inspection Modal */}
      <ItemDetailModal
        item={activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
      />
    </div>
  );
}
