"use client";

import React, { useState } from "react";
import { ShieldCheck, Search, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { verifyItemProvenance } from "../lib/api";
import { CurrencyItem } from "../lib/types";
import ScrollReveal from "./ScrollReveal";

interface VerifyBannerProps {
  onOpenDetail: (item: CurrencyItem) => void;
}

export default function VerifyBanner({ onOpenDetail }: VerifyBannerProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CurrencyItem | null | "not_found">(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const item = await verifyItemProvenance(query);
    setLoading(false);

    if (item) {
      setResult(item);
    } else {
      setResult("not_found");
    }
  };

  return (
    <section id="verify" className="py-16 bg-[#110e0b] border-y border-[#d4af37]/20 relative overflow-hidden">
      {/* Background Decorative Crest Accent */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="scale">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1b150f] via-[#16120d] to-[#120f0c] border-2 border-[#d4af37]/30 shadow-2xl relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Info */}
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#261e14] border border-[#d4af37]/40 text-xs font-mono text-[#f3e5ab]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Central Authentication Ledger</span>
                </div>

                <h2 className="font-serif text-3xl font-bold text-[#f8f6f0]">
                  Verify Your Note or Item
                </h2>

                <p className="text-sm text-[#b8af9e] leading-relaxed">
                  Enter your catalog item SKU code, note serial number, or historical issue year to instantly verify its registration in our verified archival registry.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[#e5c158]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Bank-Standard Verification
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Instant Provenance Search
                  </span>
                </div>
              </div>

              {/* Right Search Box & Result */}
              <div className="lg:col-span-6 space-y-4">
                <form onSubmit={handleVerify} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. CEY-1979-2R, SL-1998-200R, 1954, or ta-001"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#0d0b09] border border-[#d4af37]/40 text-sm text-[#f8f6f0] placeholder-[#6b6255] focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-[#d4af37] text-[#0c0a08] font-semibold text-sm hover:bg-[#e5c158] transition-colors flex items-center gap-2 shrink-0"
                  >
                    <Search className="w-4 h-4" />
                    <span>{loading ? "Checking…" : "Verify"}</span>
                  </button>
                </form>

                {/* Result Preview */}
                {result && result !== "not_found" && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-start justify-between gap-4 animate-in fade-in">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>AUTHENTICITY CONFIRMED</span>
                      </div>
                      <p className="mt-1 text-white font-serif text-sm font-semibold">{result.title}</p>
                      <p className="text-[11px] text-emerald-300/80 mt-0.5">
                        Code: {result.itemCode} • Grade: {result.condition_grade} • Country: {result.country} ({result.year})
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenDetail(result)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold shrink-0"
                    >
                      View Details
                    </button>
                  </div>
                )}

                {result === "not_found" && (
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-3 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <p className="font-bold">Item not found in current active registry</p>
                      <p className="text-[11px] text-rose-300/80">
                        Double check the item code or contact our specialists on WhatsApp for manual registry lookup.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
