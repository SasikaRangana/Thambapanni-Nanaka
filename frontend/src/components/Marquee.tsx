"use client";

import React from "react";
import { ShieldCheck, Truck, Sparkles, Award } from "lucide-react";

export default function Marquee() {
  const announcements = [
    { text: "Security Thread & Watermark Verified — Bank-Standard Authentication", icon: ShieldCheck },
    { text: "100% Genuine Provenance Guaranteed", icon: Award },
    { text: "Free Insured Islandwide Doorstep Delivery", icon: Truck },
    { text: "තම්බපණ්ණි නාණක • 1,500+ Ancient Coins & Vintage Banknotes Archived", icon: Sparkles },
    { text: "LKR Direct Quotations & Instant WhatsApp Ordering", icon: ShieldCheck },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#17130e] via-[#221b12] to-[#17130e] border-y border-[#d4af37]/20 py-2.5 overflow-hidden text-xs font-mono tracking-wider text-[#f3e5ab]">
      <div className="animate-marquee flex items-center space-x-10">
        {[...announcements, ...announcements].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2 shrink-0">
              <Icon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-medium text-[#fcfaf5]">{item.text}</span>
              <span className="text-[#d4af37]/40 px-3">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
