"use client";

import React from "react";
import { X, ShieldCheck, Award, Sparkles, CheckCircle2, HelpCircle } from "lucide-react";

interface GradingGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const GRADES = [
  {
    grade: "UNC (Uncirculated)",
    sub: "Grade 70 / Mint State",
    badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/50",
    desc: "A note strictly as issued by the Central Bank. Crisp, full original paper luster, sharp square corners, zero folds, and no signs of handling or discoloration.",
    rarity: "Highest Collector Premium",
  },
  {
    grade: "Choice UNC (Gem Uncirculated)",
    sub: "Grade 65–68",
    badgeColor: "bg-emerald-950/70 text-emerald-200 border-emerald-400/40",
    desc: "Exceptional centering, vibrant intaglio inks, and zero pinholes. Preserved in archival capsules since initial bank vault issue.",
    rarity: "Museum & Investment Quality",
  },
  {
    grade: "About Uncirculated (AU)",
    sub: "Grade 50–58",
    badgeColor: "bg-[#251d14] text-[#f3e5ab] border-[#d4af37]/50",
    desc: "Crisp note with only one or two minor handling marks or faint counting corner folds. Retains over 95% of original bank crispness.",
    rarity: "High Collector Value",
  },
  {
    grade: "Extremely Fine (XF / EF)",
    sub: "Grade 40–45",
    badgeColor: "bg-[#201912] text-[#e5c158] border-[#d4af37]/35",
    desc: "Lightly circulated with a few light folds or minor creasing. Clean paper body with no heavy stains, tears, or paper thinning.",
    rarity: "Popular Historical Grade",
  },
  {
    grade: "Very Fine (VF / VF+)",
    sub: "Grade 20–35",
    badgeColor: "bg-[#18130e] text-[#d4cdbf] border-white/20",
    desc: "Shows honest historical circulation with multiple horizontal/vertical folds, but retains clear design details, legible serial numbers, and firm paper body.",
    rarity: "Accessible Antique Entry",
  },
];

export default function GradingGuideModal({ open, onClose }: GradingGuideModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#14100c] border-2 border-[#d4af37]/40 shadow-[0_25px_70px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-[#f8f6f0]">
        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6914] via-[#d4af37] to-[#8b6914] rounded-t-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-[#201912] border border-[#d4af37]/30 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-colors z-20"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#221a11] border border-[#d4af37]/40 text-xs font-mono text-[#f3e5ab]">
            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>International Numismatic Standards</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f8f6f0]">
            Banknote Condition &amp; Grading Guide
          </h2>
          <p className="text-xs sm:text-sm text-[#b8af9e] leading-relaxed">
            Every item in the Thambapanni Nanaka vault is graded under strict international numismatic conventions (Sheldon Scale adapted). Learn how each grade affects preservation and valuation.
          </p>
        </div>

        {/* Grades List */}
        <div className="space-y-3.5">
          {GRADES.map((g, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#19140f] border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${g.badgeColor}`}>
                    {g.grade}
                  </span>
                  <span className="text-[11px] font-mono text-[#8c8273]">
                    {g.sub}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] bg-[#221b13] px-2.5 py-0.5 rounded-md border border-[#d4af37]/25">
                  {g.rarity}
                </span>
              </div>
              <p className="text-xs text-[#d4cdbf] leading-relaxed pl-1">
                {g.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-[#1c1610] border border-[#d4af37]/30 flex items-start gap-3 text-xs text-[#f3e5ab]">
          <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Authenticity Guarantee:</strong> If any note purchased from our archive fails independent third-party bank verification against our specified grade, we offer a 100% full refund guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
