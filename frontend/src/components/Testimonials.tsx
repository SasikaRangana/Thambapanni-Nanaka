"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Award,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { FacebookIcon } from "./Header";
import { SOCIAL_LINKS } from "../data/mockCurrencies";

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [flipAnimation, setFlipAnimation] = useState<string>("");
  const isAnimatingRef = useRef(false);

  const reviews = [
    {
      serial: "REC-2026-DP",
      quote:
        "Highly recommended! A genuinely trustworthy, reliable, and friendly seller of old banknotes. Authentic items, honest dealings, prompt communication, and an absolute pleasure to transact with.",
      author: "Damith Pallewatte",
      role: "Verified Facebook Recommendation",
      avatar: "DP",
      watermarkImg: "/images/note_100_ceylon_qeii.jpg",
    },
    {
      serial: "REC-2026-KV",
      quote:
        "A very valuable service provider.. A friendly and reliable service provider.. This is a seller that anyone can highly recommend to those who collect old banknotes.. Congratulations!",
      author: "Kushan Vimukthi",
      role: "Verified Facebook Recommendation",
      avatar: "KV",
      watermarkImg: "/images/note_200_temple_tooth_1998.jpg",
    },
    {
      serial: "REC-2026-SR",
      quote:
        "Good understanding and communication. very reasonable price comparing to similar places. I am highly recommend to everyone.",
      author: "Sameera Rangajeewa Henda Hewa",
      role: "Verified Facebook Recommendation",
      avatar: "SR",
      watermarkImg: "/images/note_2_ceylon_fauna_1979.jpg",
    },
    {
      serial: "REC-2026-DB",
      quote:
        "Highly recommended. සාධාරණ ගනන් වලට ඉතාමත් විස්වාසනීය විදිහට ලස්සනට පැක් කරලා එවනවා.",
      author: "Dulinda Bandara",
      role: "Verified Facebook Recommendation",
      avatar: "DB",
      watermarkImg: "/images/note_10_ceylon_1982.jpg",
    },
    {
      serial: "REC-2026-IA",
      quote:
        "විශ්වාසයෙන් බය නැතිව මුදල් නොට්ටු ගන්න පුලුවන් තැනක්.❤️🙏 Highly Recommend ✌️",
      author: "Ishara Akila Sandaruwan",
      role: "Verified Facebook Recommendation",
      avatar: "IA",
      watermarkImg: "/images/note_100_sigiriya_frescoes.jpg",
    },
    {
      serial: "REC-2026-BS",
      quote:
        "Trusted seller. Highly recommended! Authentic notes and safe insured postal delivery.",
      author: "Buddika Sameera",
      role: "Verified Facebook Recommendation",
      avatar: "BS",
      watermarkImg: "/images/note_100_ceylon_qeii_color.jpg",
    },
    {
      serial: "REC-2026-KC",
      quote:
        "100% recommended for buying old coins and banknotes with confidence. Bank standard quality.",
      author: "Kushan Gayan Costa",
      role: "Verified Facebook Recommendation",
      avatar: "KC",
      watermarkImg: "/images/note_modern_series_stack.jpg",
    },
    {
      serial: "REC-2026-AK",
      quote:
        "Friendly and reliable, highly recommended. Genuine seller who knows the exact history behind each lot.",
      author: "Asanka Kasun",
      role: "Verified Facebook Recommendation",
      avatar: "AK",
      watermarkImg: "/images/note_2_ceylon_fauna_1979.jpg",
    },
  ];

  const triggerFlip = (nextIdx: number, direction: "next" | "prev") => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    setFlipAnimation(direction === "next" ? "banknote-flip-next" : "banknote-flip-prev");

    // Halfway through the 3D flip (when card is edge-on at 90deg), switch content
    setTimeout(() => {
      setActiveIdx(nextIdx);
    }, 260);

    // Complete animation reset
    setTimeout(() => {
      setFlipAnimation("");
      isAnimatingRef.current = false;
    }, 550);
  };

  const handleNext = () => {
    const next = (activeIdx + 1) % reviews.length;
    triggerFlip(next, "next");
  };

  const handlePrev = () => {
    const prev = activeIdx === 0 ? reviews.length - 1 : activeIdx - 1;
    triggerFlip(prev, "prev");
  };

  const handleSelectDot = (index: number) => {
    if (index === activeIdx || isAnimatingRef.current) return;
    const direction = index > activeIdx ? "next" : "prev";
    triggerFlip(index, direction);
  };

  // Auto-play feature with smooth 3D flip
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      const next = (activeIdx + 1) % reviews.length;
      triggerFlip(next, "next");
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeIdx, reviews.length]);

  const current = reviews[activeIdx];

  return (
    <section className="py-24 bg-[#0d0a08] border-t border-[#d4af37]/25 relative overflow-hidden">
      {/* Background Banknote Guilloche Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Header */}
        <ScrollReveal variant="up">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e1710] border border-[#d4af37]/35 text-xs font-mono text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest">From the Collectors&apos; Ledger</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f8f6f0]">
              Banknote-Grade Trust &amp; Reviews
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#b8af9e]">
              <span className="flex items-center gap-1 text-[#f3e5ab]">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>100% Genuine Provenance</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#60a5fa]">
                <FacebookIcon className="w-3.5 h-3.5 text-[#1877f2]" />
                <span>Verified Facebook Recommendations</span>
              </span>
              <span>•</span>
              <span className="text-[#e5c158] font-bold">5.0 ★★★★★ Collector Rating</span>
            </div>
          </div>
        </ScrollReveal>

        {/* 3D Perspective Card Wrapper with Flip Animation */}
        <ScrollReveal variant="scale" delay={150}>
          <div
            className="perspective-1000 relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Banknote-Themed Main Testimonial Card */}
            <div
              className={`relative rounded-3xl bg-[#14100c] border-2 border-[#d4af37]/50 shadow-[0_0_50px_rgba(212,175,55,0.08)] overflow-hidden ${flipAnimation}`}
            >
              {/* Intaglio Micro-line Corner Guilloche Accents */}
              <div className="absolute top-2 left-2 text-[#d4af37]/40 text-xs font-mono select-none pointer-events-none">
                ╔══════════
              </div>
              <div className="absolute top-2 right-2 text-[#d4af37]/40 text-xs font-mono select-none pointer-events-none">
                ══════════╗
              </div>
              <div className="absolute bottom-2 left-2 text-[#d4af37]/40 text-xs font-mono select-none pointer-events-none">
                ╚══════════
              </div>
              <div className="absolute bottom-2 right-2 text-[#d4af37]/40 text-xs font-mono select-none pointer-events-none">
                ══════════╝
              </div>

              {/* Subtle Banknote Watermark Texture in background */}
              <div className="absolute -right-10 -bottom-10 w-72 h-72 opacity-[0.06] rounded-full overflow-hidden pointer-events-none select-none blur-[1px]">
                <Image
                  src={current.watermarkImg}
                  alt="Banknote Watermark"
                  fill
                  className="object-cover grayscale"
                />
              </div>

              <div className="p-7 sm:p-12 relative z-10 space-y-6">
                {/* Top Banknote Header: Serial Number & Authenticated Stamp */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#d4af37]/20">
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded bg-[#201912] border border-[#d4af37]/30 text-[#e5c158] font-mono text-[11px] font-bold tracking-widest">
                      SERIAL: {current.serial}
                    </div>
                    <span className="text-[10px] uppercase font-mono text-[#8c8273]">
                      LEDGER VOL. 2026
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1877f2]/15 border border-[#1877f2]/40 text-[11px] font-mono text-[#60a5fa]">
                      <FacebookIcon className="w-3.5 h-3.5 text-[#1877f2]" />
                      <CheckCircle2 className="w-3 h-3 text-[#60a5fa]" />
                      <span>Facebook Recommendation</span>
                    </span>
                    <div className="flex text-[#d4af37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Testimonial Body */}
                <div className="relative py-2 sm:py-4">
                  <Quote className="absolute -top-3 -left-3 w-10 h-10 text-[#d4af37]/15 pointer-events-none" />
                  <blockquote className="font-serif text-lg sm:text-2xl text-[#f8f6f0] leading-relaxed italic relative z-10 min-h-[90px]">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Banknote Footer: Official Seal & Customer Signature Info */}
                <div className="pt-4 border-t border-[#d4af37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#2a2217] via-[#1a140f] to-[#0c0a08] border-2 border-[#d4af37] text-[#f3e5ab] font-bold text-sm flex items-center justify-center font-mono shadow-lg shrink-0">
                      {current.avatar}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-[8px]">
                        <FacebookIcon className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div>
                      <strong className="block text-base text-white font-sans font-bold">
                        {current.author}
                      </strong>
                      <span className="text-xs text-[#60a5fa] font-mono flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#60a5fa]" />
                        <span>{current.role}</span>
                      </span>
                    </div>
                  </div>

                  {/* Banknote Security Seal */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1b150f] border border-[#d4af37]/30 text-[11px] font-mono text-[#f3e5ab] shrink-0 self-start sm:self-auto">
                    <Award className="w-4 h-4 text-[#d4af37]" />
                    <span>AUTHENTICATED COLLECTOR</span>
                  </div>
                </div>
              </div>

              {/* Previous / Next Arrow Controls */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 rounded-full bg-black/80 hover:bg-[#d4af37] text-white hover:text-black border border-[#d4af37]/40 shadow-xl transition-all active:scale-95"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2.5 rounded-full bg-black/80 hover:bg-[#d4af37] text-white hover:text-black border border-[#d4af37]/40 shadow-xl transition-all active:scale-95"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Minimal Banknote Ledger Pagination Dots */}
        <div className="flex items-center justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSelectDot(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIdx === i
                  ? "bg-[#d4af37] w-8 shadow-sm shadow-[#d4af37]/50"
                  : "bg-white/20 hover:bg-white/40 w-2"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Facebook Link & Community CTAs */}
        <div className="text-center pt-2">
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14100c] border border-[#d4af37]/40 hover:border-[#d4af37] text-xs font-mono text-[#f3e5ab] hover:bg-[#d4af37] hover:text-black transition-all shadow-xl group"
          >
            <FacebookIcon className="w-4 h-4 text-[#1877f2] group-hover:text-black transition-colors" />
            <span>View All Reviews &amp; Recommendations on Facebook</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </section>
  );
}
