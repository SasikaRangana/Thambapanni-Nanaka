"use client";

import React from "react";
import { Search, ZoomIn, MessageCircle, PackageCheck, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Explore Vault",
      desc: "Browse authentic Ceylon banknotes & ancient coins by era, denomination, or reign.",
    },
    {
      num: "02",
      icon: ZoomIn,
      title: "Inspect Security",
      desc: "Use our interactive loupe to examine intaglio details, watermarks, and condition grades.",
    },
    {
      num: "03",
      icon: MessageCircle,
      title: "Inquire on WhatsApp",
      desc: "Click to generate pre-filled quotation in LKR and chat with our numismatists directly.",
    },
    {
      num: "04",
      icon: PackageCheck,
      title: "Secure Delivery",
      desc: "Dispatched in tamper-proof, acid-free numismatic capsules with insured islandwide tracking.",
    },
  ];

  return (
    <section id="how" className="py-20 bg-[#0c0a08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="up">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>From Ancient Vaults to Your Hands</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f8f6f0]">
              How Ordering &amp; Curation Works
            </h2>
            <p className="text-sm text-[#b8af9e]">
              A seamless collector experience built on provenance, transparency, and personal consultation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={idx} variant="up" delay={idx * 140}>
                <div className="relative p-6 rounded-2xl bg-[#14100c] border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all flex flex-col justify-between group shadow-lg h-full hover:-translate-y-2 hover:shadow-[#d4af37]/10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold text-[#d4af37]/40 group-hover:text-[#d4af37] transition-colors">
                        {step.num}
                      </span>
                      <div className="p-3 rounded-xl bg-[#201912] text-[#d4af37] border border-[#d4af37]/30 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#f8f6f0] group-hover:text-[#f3e5ab] transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-xs text-[#b8af9e] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
