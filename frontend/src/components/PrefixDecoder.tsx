"use client";

import React, { useState } from "react";
import { Search, Crown, BookOpen, Calendar, Award } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const GOVERNOR_ERAS = [
  {
    era: "1950–1954",
    governor: "Sir John Kotelawala (Acting)",
    financeMinister: "J.R. Jayewardene",
    notes: "First CBSL issues. Queen Elizabeth II pictorial series. De La Rue print.",
    prefix: "A/1 – A/50",
  },
  {
    era: "1954–1959",
    governor: "N.U. Jayawardena",
    financeMinister: "M.D.H. Jayawardena",
    notes: "Transition from Royal portrait. Final colonial-style designs.",
    prefix: "A/51 – C/20",
  },
  {
    era: "1959–1967",
    governor: "H.S.S. Nissanka",
    financeMinister: "T.B. Illangaratne",
    notes: "S.W.R.D. Bandaranayake memorial series. Armorial Ensign issues.",
    prefix: "C/21 – F/50",
  },
  {
    era: "1967–1978",
    governor: "H.E. Tennekoon",
    financeMinister: "Felix R. Dias Bandaranaike",
    notes: "King Parakrama Bahu series. Denomination redesign with Buddhist motifs.",
    prefix: "F/51 – K/40",
  },
  {
    era: "1978–1988",
    governor: "W.M. Tilakaratna / H.B. Dissanayake",
    financeMinister: "Ronnie de Mel",
    notes: "Flora & Fauna series (1979). Historical & Archaeological series (1981–85). Butterfly & Skink notes.",
    prefix: "K/41 – P/90",
  },
  {
    era: "1988–1995",
    governor: "H.N.S. Karunatilake / A.S. Jayawardena",
    financeMinister: "D.B. Wijetunga",
    notes: "Heritage series begins. Historical & Development series (1987–90). Temple of the Tooth motifs.",
    prefix: "P/91 – W/40",
  },
  {
    era: "1995–2006",
    governor: "A.S. Jayawardena / Sunil Mendis",
    financeMinister: "Various",
    notes: "Sri Lankan Heritage series continues. Modern security features introduced.",
    prefix: "W/41 – AE/80",
  },
  {
    era: "2006–2017",
    governor: "Ajith Nivard Cabraal / Arjuna Mahendran",
    financeMinister: "Various",
    notes: "Development Prosperity series. Sri Lanka Dancers motif. Enhanced polymer elements.",
    prefix: "AE/81 – Current",
  },
];

export default function PrefixDecoder() {
  const [selectedEra, setSelectedEra] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredEras = GOVERNOR_ERAS.filter(
    (e) =>
      !search.trim() ||
      e.era.includes(search) ||
      e.governor.toLowerCase().includes(search.toLowerCase()) ||
      e.prefix.toLowerCase().includes(search.toLowerCase()) ||
      e.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="decoder" className="py-16 bg-[#0e0c09] relative overflow-hidden">
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="scale">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1710] border border-[#d4af37]/40 text-xs font-mono text-[#f3e5ab] mx-auto">
              <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Historical Reference Tool</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#f8f6f0]">
              Ceylon Prefix &amp; Governor Signature Decoder
            </h2>
            <p className="text-sm text-[#b8af9e] max-w-2xl mx-auto">
              Identify which Central Bank Governor and Finance Minister signatures appear on your banknote by matching the prefix letters or issue year range.
            </p>
          </div>
        </ScrollReveal>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6255]" />
            <input
              type="text"
              placeholder="Search by year, prefix (e.g. A/1), or governor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#14100c] border border-[#d4af37]/30 text-sm text-[#f8f6f0] placeholder-[#6b6255] focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>
        </div>

        {/* Era Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredEras.map((era, idx) => {
            const isSelected = selectedEra === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedEra(isSelected ? null : idx)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? "bg-[#1e1a12] border-[#d4af37] shadow-lg shadow-[#d4af37]/10 ring-1 ring-[#d4af37]/30"
                    : "bg-[#14100c] border-[#d4af37]/15 hover:border-[#d4af37]/40"
                }`}
              >
                {/* Era Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="text-xs font-mono font-bold text-[#f3e5ab]">{era.era}</span>
                </div>

                {/* Governor */}
                <div className="flex items-start gap-2 mb-2">
                  <Crown className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-[#a69d8d] uppercase block">Governor</span>
                    <span className="text-xs text-[#f8f6f0] font-semibold block">{era.governor}</span>
                  </div>
                </div>

                {/* Prefix */}
                <div className="flex items-start gap-2 mb-2">
                  <Award className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-[#a69d8d] uppercase block">Prefix Range</span>
                    <span className="text-xs text-[#e5c158] font-mono font-bold block">{era.prefix}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-[#d4af37]/20 space-y-2 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[10px] font-mono text-[#a69d8d] uppercase">Finance Minister</span>
                      <p className="text-xs text-[#f8f6f0]">{era.financeMinister}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#a69d8d] uppercase">Series Notes</span>
                      <p className="text-xs text-[#b8af9e] leading-relaxed">{era.notes}</p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {filteredEras.length === 0 && (
          <div className="text-center py-8 text-sm text-[#6b6255] font-mono">
            No matching era found. Try a different prefix or year.
          </div>
        )}
      </div>
    </section>
  );
}
