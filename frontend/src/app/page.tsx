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

import { CurrencyItem, CategoryType } from "../lib/types";
import { fetchCurrencies } from "../lib/api";
import { DEFAULT_CURRENCIES } from "../data/mockCurrencies";

export default function StorefrontPage() {
  const [items, setItems] = useState<CurrencyItem[]>(DEFAULT_CURRENCIES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [activeDetailItem, setActiveDetailItem] = useState<CurrencyItem | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async (cat?: CategoryType, era?: string, search?: string) => {
    setLoading(true);
    const res = await fetchCurrencies({
      category: cat || selectedCategory,
      era: era as any,
      search: search,
    });
    setItems(res.items);
    setLoading(false);
  };

  useEffect(() => {
    loadData(selectedCategory);
  }, [selectedCategory]);

  const handleHeroSearch = (query: string, category: string, era: string) => {
    setSelectedCategory(category as CategoryType);
    loadData(category as CategoryType, era, query);
  };

  const handleSelectSeries = (category: string, era?: string) => {
    setSelectedCategory(category as CategoryType);
    loadData(category as CategoryType, era);
    const el = document.getElementById("collection");
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
        <SeriesCarousel onSelectCategory={handleSelectSeries} />
        <CatalogGrid
          items={items}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
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
