"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function StatsBand() {
  const [counted, setCounted] = useState(false);
  const [counts, setCounts] = useState({ collectors: 0, archived: 0, auth: 0, years: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          setCounted(true);

          const duration = 1600;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounts({
              collectors: Math.round(easeOut * 2500),
              archived: Math.round(easeOut * 1500),
              auth: Math.round(easeOut * 100),
              years: Math.round(easeOut * 6),
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [counted]);

  const stats = [
    { num: `${counts.collectors.toLocaleString()}+`, label: "Satisfied Collectors" },
    { num: `${counts.archived.toLocaleString()}+`, label: "Archived Numismatic Items" },
    { num: `${counts.auth}%`, label: "Bank-Standard Authenticated" },
    { num: `${counts.years}+`, label: "Years Curated Experience" },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-[#16110c] border-y border-[#d4af37]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preserving Sri Lankan Numismatic Pride</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f8f6f0] mt-1">
              Why Numismatists Choose Thambapanni Nanaka
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} variant="scale" delay={idx * 120}>
              <div className="p-6 rounded-2xl bg-[#110e0b] border border-[#d4af37]/20 shadow-md hover:border-[#d4af37]/50 transition-all hover:scale-105">
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#e5c158]">
                  {stat.num}
                </div>
                <p className="text-xs sm:text-sm text-[#b8af9e] font-mono mt-2">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
