"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface SeriesCarouselProps {
  onSelectCategory: (category: string, era?: string) => void;
}

export default function SeriesCarousel({ onSelectCategory }: SeriesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const series = [
    {
      title: "Ancient Ceylon Coins",
      period: "Anuradhapura & Polonnaruwa",
      category: "coin",
      era: "ancient",
      img: "/images/note_200_temple_tooth_1998.jpg",
      badge: "Gold Kahavanu & Copper",
    },
    {
      title: "Flora & Fauna Series",
      period: "1979 Central Bank of Ceylon",
      category: "banknote",
      era: "modern",
      img: "/images/note_2_ceylon_fauna_1979.jpg",
      badge: "Endemic Species",
    },
    {
      title: "Colonial British Ceylon",
      period: "1941 – 1954 King George & QEII",
      category: "banknote",
      era: "colonial",
      img: "/images/note_100_ceylon_qeii.jpg",
      badge: "Bradbury Wilkinson",
    },
    {
      title: "Temples & Heritage Series",
      period: "1982 – 1998 Commemorative",
      category: "banknote",
      era: "modern",
      img: "/images/note_10_ceylon_1982.jpg",
      badge: "Sri Dalada Maligawa",
    },
    {
      title: "Sigiriya Frescoes Edition",
      period: "1954 Classic Intaglio",
      category: "banknote",
      era: "colonial",
      img: "/images/note_100_sigiriya_frescoes.jpg",
      badge: "Cloud Maidens",
    },
    {
      title: "Modern Development Sets",
      period: "2010 – Present (UNC Bundles)",
      category: "banknote",
      era: "modern",
      img: "/images/note_modern_series_stack.jpg",
      badge: "Full Uncirculated Sets",
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="series" className="py-16 bg-[#0f0d0a] border-t border-[#d4af37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="up">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Historical Eras &amp; Numismatic Series</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f8f6f0] mt-1">
                Browse by Series &amp; Kingdoms
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll("left")}
                className="p-2.5 rounded-full bg-[#1c1711] border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-all"
                aria-label="Previous Series"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="p-2.5 rounded-full bg-[#1c1711] border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-all"
                aria-label="Next Series"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel Row */}
        <ScrollReveal variant="scale" delay={150}>
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            {series.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectCategory(item.category, item.era)}
                className="min-w-[280px] sm:min-w-[320px] rounded-2xl bg-[#17130e] border border-[#d4af37]/20 hover:border-[#d4af37]/60 overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-[#d4af37]/15 snap-start flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden bg-[#0c0a08]">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17130e] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm border border-[#d4af37]/40 text-[10px] font-mono text-[#f3e5ab] uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#f8f6f0] group-hover:text-[#f3e5ab] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#b8af9e] mt-1 font-mono">{item.period}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5 text-xs text-[#d4af37] font-medium">
                    <span>Explore Series</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
