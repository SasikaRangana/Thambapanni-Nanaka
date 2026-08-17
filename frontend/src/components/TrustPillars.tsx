"use client";

import React from "react";
import { ShieldCheck, Lock, MessageSquareQuote, Truck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function TrustPillars() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Bank-Verified Authenticity",
      desc: "Cross-checked against Central Bank and royal numismatic archives.",
    },
    {
      icon: Lock,
      title: "Secure Provenance",
      desc: "Verified item serial numbering with anti-tamper protective packaging.",
    },
    {
      icon: MessageSquareQuote,
      title: "1-on-1 Specialist Chat",
      desc: "Instant valuation, high-res photos and guidance directly on WhatsApp.",
    },
    {
      icon: Truck,
      title: "Insured Islandwide Delivery",
      desc: "Dispatched safely in acid-free numismatic sleeves across Sri Lanka.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <ScrollReveal key={idx} variant="up" delay={idx * 120}>
              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-[#14100c]/80 border border-[#d4af37]/15 hover:border-[#d4af37]/40 transition-all group shadow-lg hover:shadow-[#d4af37]/5 h-full">
                <div className="p-3 rounded-xl bg-[#241d14] text-[#d4af37] border border-[#d4af37]/25 group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#f8f6f0] group-hover:text-[#f3e5ab] transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-[#b8af9e] mt-1 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
