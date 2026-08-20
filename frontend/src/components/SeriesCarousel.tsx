"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface SeriesCarouselProps {
  onSelectSeries: (series: string) => void;
}

const SERIES = [
  {
    key: "Government of Ceylon",
    title: "Government of Ceylon",
    period: "Pre-Central Bank Issue",
    badge: "Rare Treasury Note",
    img: "/images/note_100_ceylon_qeii.jpg",
  },
  {
    key: "Emergency WWII Fractional Uniface",
    title: "Emergency WWII Fractional Uniface",
    period: "1942 — Wartime Issue",
    badge: "WWII Emergency",
    img: "/images/note_10_ceylon_1982.jpg",
  },
  {
    key: "George VI Pictorial",
    title: "George VI Pictorial Series",
    period: "King George VI Era",
    badge: "British Intaglio",
    img: "/images/note_100_sigiriya_frescoes.jpg",
  },
  {
    key: "Queen Elizabeth II",
    title: "Queen Elizabeth II Series",
    period: "1952 – 1954",
    badge: "Royal Portrait",
    img: "/images/note_100_ceylon_qeii.jpg",
  },
  {
    key: "Ceylon Armorial Ensign",
    title: "Ceylon Armorial Ensign Series",
    period: "1956 – 1977",
    badge: "National Crest",
    img: "/images/note_200_temple_tooth_1998.jpg",
  },
  {
    key: "S.W.R.D Bandaranayake",
    title: "S.W.R.D Bandaranayake Series",
    period: "1961 – 1975",
    badge: "Prime Minister",
    img: "/images/note_modern_series_stack.jpg",
  },
  {
    key: "King Parakrama Bahu",
    title: "King Parakrama Bahu Series",
    period: "1965 – 1977",
    badge: "Ancient Kingdom",
    img: "/images/note_100_sigiriya_frescoes.jpg",
  },
  {
    key: "Sri Lankan Flora and Fauna",
    title: "Sri Lankan Flora and Fauna Series",
    period: "1979",
    badge: "Endemic Species",
    img: "/images/note_2_ceylon_fauna_1979.jpg",
  },
  {
    key: "Sri Lanka Historical and Archaeological",
    title: "Sri Lanka Historical & Archaeological Series",
    period: "1981 – 1985",
    badge: "Heritage Sites",
    img: "/images/note_200_temple_tooth_1998.jpg",
  },
  {
    key: "Sri Lanka Historical and Development",
    title: "Sri Lanka Historical & Development Series",
    period: "1987 – 1990",
    badge: "Development Era",
    img: "/images/note_modern_series_stack.jpg",
  },
  {
    key: "Sri Lankan Heritage",
    title: "Sri Lankan Heritage Series",
    period: "1991 – 2006",
    badge: "Cultural Icons",
    img: "/images/note_10_ceylon_1982.jpg",
  },
  {
    key: "Development Prosperity and Sri Lanka Dancers",
    title: "Development, Prosperity & Dancers",
    period: "2010 – 2017",
    badge: "Modern Issue",
    img: "/images/note_modern_series_stack.jpg",
  },
  {
    key: "Commemorative Notes",
    title: "Commemorative Notes",
    period: "Special Editions",
    badge: "Commemorative",
    img: "/images/note_200_temple_tooth_1998.jpg",
  },
  {
    key: "Reproductions",
    title: "Reproductions",
    period: "Collector Reprints",
    badge: "Collector Grade",
    img: "/images/note_100_ceylon_qeii_color.jpg",
  },
  {
    key: "Coins",
    title: "Coins",
    period: "Ancient to Modern",
    badge: "Numismatic",
    img: "/images/note_200_temple_tooth_1998.jpg",
  },
];

export default function SeriesCarousel({ onSelectSeries }: SeriesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
                Browse by Series
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
            {SERIES.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectSeries(item.key);
                  const el = document.getElementById("collection");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="min-w-[260px] sm:min-w-[300px] rounded-2xl bg-[#17130e] border border-[#d4af37]/20 hover:border-[#d4af37]/60 overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-[#d4af37]/15 snap-start flex flex-col"
              >
                <div className="relative h-40 w-full overflow-hidden bg-[#0c0a08]">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17130e] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm border border-[#d4af37]/40 text-[10px] font-mono text-[#f3e5ab] uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#f8f6f0] group-hover:text-[#f3e5ab] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#b8af9e] mt-1 font-mono">{item.period}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/5 text-xs text-[#d4af37] font-medium">
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
