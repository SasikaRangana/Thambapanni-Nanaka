"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Search, ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onSearch: (query: string, category: string, era: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [era, setEra] = useState("all");

  const [lensActive, setLensActive] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const heroArtRef = useRef<HTMLDivElement>(null);

  const LENS_SIZE = 132;
  const ZOOM = 1.75;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only activate magnifying lens on hover-capable pointer devices (mouse/desktop)
    if (e.pointerType === "touch") return;
    if (!heroArtRef.current) return;
    const rect = heroArtRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setLensActive(false);
      return;
    }

    setLensActive(true);
    setLensPos({ x, y });
  };

  const handlePointerLeave = () => {
    setLensActive(false);
  };


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, category, era);
    const collectionEl = document.getElementById("collection");
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative pt-10 pb-16 overflow-hidden guilloche-bg">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hero Copy with Animated Shimmer Typography */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1710]/90 border border-[#d4af37]/35 text-xs font-mono text-[#f3e5ab] shadow-lg shadow-black/40 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
              <span>A Curated Numismatic Archive — Since 2019</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f8f6f0] leading-[1.12]">
              <span>Sri Lanka&apos;s</span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-serif italic gold-text-shimmer py-1 drop-shadow-[0_0_35px_rgba(212,175,55,0.35)]">
                Heritage
              </span>
              <span className="flex items-center gap-2">
                <span>in Your Hands</span>
                <span className="inline-block text-[#d4af37] text-2xl font-serif animate-pulse">✦</span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#b8af9e] max-w-xl leading-relaxed">
              Every coin and banknote in our archive has travelled decades to reach you — verified under strict bank standards, catalogued in LKR, and preserved to tell Ceylon&apos;s rich historical story.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#collection"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c59e2b] text-[#0c0a08] hover:shadow-xl hover:shadow-[#d4af37]/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Search className="w-4 h-4 text-[#0c0a08]" />
                <span>Explore Collection</span>
              </a>

              <a
                href="#how"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-[#f8f6f0] bg-[#1a1510] border border-[#d4af37]/30 hover:border-[#d4af37]/70 hover:bg-[#241c14] transition-all"
              >
                <span>How It Works</span>
                <ArrowRight className="w-4 h-4 text-[#d4af37]" />
              </a>
            </div>

            <div className="flex items-center gap-6 pt-3 text-xs font-mono text-[#a69d8d]">
              <div>
                <span className="text-[#f3e5ab] font-bold text-sm block">1,500+</span>
                <span>Archived Notes</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-[#f3e5ab] font-bold text-sm block">100%</span>
                <span>Bank Authenticated</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-[#f3e5ab] font-bold text-sm block">24h</span>
                <span>Islandwide Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Rich Interactive 3D Banknote & Numismatic Showcase with Floating Badges */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            {/* Ambient Radial Golden Glow behind visual */}
            <div className="absolute inset-0 bg-radial from-[#d4af37]/15 via-transparent to-transparent blur-2xl pointer-events-none -z-10" />

            <div
              ref={heroArtRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              className="hero-art-container relative w-full max-w-[500px] h-[360px] sm:h-[420px] md:cursor-crosshair group select-none"
            >
              {/* Floating Badge 1 (Top-Left): 100% Bank Authentication Seal */}
              <div className="absolute -top-3 -left-2 sm:-left-4 z-40 animate-float-slow pointer-events-none">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#14100c]/90 border border-[#d4af37]/40 shadow-2xl backdrop-blur-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono font-bold text-[#f3e5ab]">
                    Bank Grade Authenticated
                  </span>
                </div>
              </div>

              {/* Floating Badge 2 (Bottom-Left): 100% Genuine Quality & Trust Guarantee */}
              <div className="absolute -bottom-4 -left-2 sm:-left-5 z-40 animate-float-reverse pointer-events-none">
                <div className="flex items-center gap-2.5 p-2 pr-4 rounded-2xl bg-[#18130e]/95 border border-[#d4af37]/45 shadow-2xl backdrop-blur-md">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#d4af37] shrink-0 bg-gradient-to-br from-[#2a2217] to-[#120e0a] flex items-center justify-center">
                    <Image
                      src="/images/logo.jpg"
                      alt="Official Quality Seal"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#d4af37] font-bold">
                      100% Genuine Quality
                    </span>
                    <span className="text-xs font-sans font-bold text-[#f8f6f0]">
                      Guaranteed Trust &amp; Provenance
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 3 (Bottom-Right): Insured Collector Dispatch */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 z-40 animate-float-slow pointer-events-none hidden sm:block">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#14100c]/95 border border-[#d4af37]/40 shadow-2xl backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
                  <div className="text-left leading-tight">
                    <span className="block text-[10px] font-mono text-[#a69d8d]">
                      Insured Collector Delivery
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#f3e5ab]">
                      Islandwide in 24h
                    </span>
                  </div>
                </div>
              </div>

              {/* Splayed 3D Banknote Stack */}
              <div id="heroNoteStack" className="relative w-full h-full">
                {/* Note 4: 1979 2 Rupees Ceylon Fauna (Butterfly & Skink) */}
                <div className="stack-card note-n4 absolute top-[28%] left-[4%] w-[54%] sm:w-[50%] max-w-[260px] aspect-[16/9.4] rounded-xl overflow-hidden shadow-2xl border border-[#c39a52]/40 bg-[#1c1610] -rotate-[19deg] z-0 transition-transform duration-500 group-hover:rotate-[-24deg] group-hover:translate-x-2 group-hover:translate-y-2">
                  <Image
                    src="/images/note_2_ceylon_fauna_1979.jpg"
                    alt="1979 Central Bank of Ceylon 2 Rupees Fauna"
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                </div>

                {/* Note 1: 1982 10 Rupees Temple of the Tooth */}
                <div className="stack-card note-n1 absolute top-[6%] left-[2%] w-[60%] sm:w-[58%] max-w-[300px] aspect-[16/9.4] rounded-xl overflow-hidden shadow-2xl border border-[#c39a52]/40 bg-[#1c1610] -rotate-[11deg] z-10 transition-transform duration-500 group-hover:rotate-[-16deg] group-hover:-translate-x-4 group-hover:translate-y-1">
                  <Image
                    src="/images/note_10_ceylon_1982.jpg"
                    alt="1982 Central Bank of Ceylon 10 Rupees Temple"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>

                {/* Note 2: 1954 100 Rupees Queen Elizabeth II */}
                <div className="stack-card note-n2 absolute top-[16%] left-[16%] w-[66%] sm:w-[64%] max-w-[330px] aspect-[16/9.4] rounded-xl overflow-hidden shadow-2xl border border-[#c39a52]/50 bg-[#1c1610] -rotate-[2deg] z-20 transition-transform duration-500 group-hover:rotate-0 group-hover:-translate-y-2">
                  <Image
                    src="/images/note_100_ceylon_qeii.jpg"
                    alt="1954 Central Bank of Ceylon 100 Rupees Queen Elizabeth II"
                    fill
                    sizes="330px"
                    className="object-cover"
                  />
                </div>

                {/* Note 3: 1998 200 Rupees Temple of the Tooth 50th Independence */}
                <div className="stack-card note-n3 absolute top-[2%] left-[34%] w-[68%] sm:w-[66%] max-w-[340px] aspect-[16/9.4] rounded-xl overflow-hidden shadow-2xl border border-[#c39a52]/60 bg-[#1c1610] rotate-[9deg] z-30 transition-transform duration-500 group-hover:rotate-[6deg] group-hover:translate-x-3">
                  <Image
                    src="/images/note_200_temple_tooth_1998.jpg"
                    alt="1998 Sri Lanka 200 Rupees Temple of Tooth"
                    fill
                    sizes="340px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Banknote Bundle Currency Strap */}
                <div className="banknote-strap-bar absolute top-1/2 left-[-4%] right-[-4%] h-[40px] sm:h-[44px] -translate-y-1/2 -rotate-[4deg] bg-gradient-to-r from-[#071710] via-[#133827] to-[#071710] border-y-2 border-[#d4af37] shadow-2xl z-40 flex items-center justify-between px-4 sm:px-6 pointer-events-none transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
                  <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-[#f3e5ab] drop-shadow">
                    THAMBAPANNI NANAKA · AUTHENTICATED
                  </span>
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-[#f3e5ab] shadow-md shrink-0">
                    <Image
                      src="/images/logo.jpg"
                      alt="Official Seal"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Magnifying Loupe Following Cursor */}
              {lensActive && (
                <div
                  className="pointer-events-none absolute z-50 rounded-full border-[3px] border-[#d4af37] overflow-hidden shadow-[0_14px_35px_rgba(0,0,0,0.8),inset_0_0_18px_rgba(0,0,0,0.5)] bg-[#120e0a]"
                  style={{
                    width: `${LENS_SIZE}px`,
                    height: `${LENS_SIZE}px`,
                    left: `${lensPos.x - LENS_SIZE / 2}px`,
                    top: `${lensPos.y - LENS_SIZE / 2}px`,
                  }}
                >
                  {/* Zoomed Clone Container */}
                  <div
                    className="absolute"
                    style={{
                      width: `${(heroArtRef.current?.offsetWidth || 440) * ZOOM}px`,
                      height: `${(heroArtRef.current?.offsetHeight || 380) * ZOOM}px`,
                      left: `${-(lensPos.x * ZOOM - LENS_SIZE / 2)}px`,
                      top: `${-(lensPos.y * ZOOM - LENS_SIZE / 2)}px`,
                      transformOrigin: "0 0",
                    }}
                  >
                    {/* Zoomed Note 4 */}
                    <div className="absolute top-[28%] left-[4%] w-[50%] aspect-[16/9.4] rounded-xl overflow-hidden -rotate-[19deg]">
                      <Image
                        src="/images/note_2_ceylon_fauna_1979.jpg"
                        alt="Fauna Zoomed"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Zoomed Note 1 */}
                    <div className="absolute top-[6%] left-[2%] w-[58%] aspect-[16/9.4] rounded-xl overflow-hidden -rotate-[11deg]">
                      <Image
                        src="/images/note_10_ceylon_1982.jpg"
                        alt="Temple Zoomed"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Zoomed Note 2 */}
                    <div className="absolute top-[16%] left-[16%] w-[64%] aspect-[16/9.4] rounded-xl overflow-hidden -rotate-[2deg]">
                      <Image
                        src="/images/note_100_ceylon_qeii.jpg"
                        alt="QEII Zoomed"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Zoomed Note 3 */}
                    <div className="absolute top-[2%] left-[34%] w-[66%] aspect-[16/9.4] rounded-xl overflow-hidden rotate-[9deg]">
                      <Image
                        src="/images/note_200_temple_tooth_1998.jpg"
                        alt="Temple Zoomed"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Brass Loupe Bezel Glare & Glass Reflection */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            {/* Interactive Loupe Guidance Pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16120d]/80 border border-[#d4af37]/25 text-[11px] font-mono text-[#a69d8d]">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span>Hover cursor over banknotes to inspect micro-print intaglio</span>
            </div>
          </div>
        </div>

        {/* Real-time Multi-attribute Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-12 p-4 sm:p-6 rounded-2xl bg-[#16120d]/90 border border-[#d4af37]/30 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end backdrop-blur-md"
        >
          <div className="lg:col-span-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#b8af9e] mb-1.5">
              Category / Type (වර්ගය)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0c0a] border border-[#d4af37]/30 text-sm text-[#f8f6f0] focus:border-[#d4af37] focus:outline-none"
            >
              <option value="all">All Collectibles (සියල්ල)</option>
              <option value="banknote">💵 Banknotes (මුදල් නෝට්ටු)</option>
              <option value="coin">🪙 Coins (කාසි)</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#b8af9e] mb-1.5">
              Era / Period (යුගය)
            </label>
            <select
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0c0a] border border-[#d4af37]/30 text-sm text-[#f8f6f0] focus:border-[#d4af37] focus:outline-none"
            >
              <option value="all">All Eras (සියලු යුග)</option>
              <option value="ancient">🏛️ Ancient Kingdoms (ක්‍රි.පූ. 300 – 1505)</option>
              <option value="dutch">⛵ Portuguese &amp; Dutch VOC (1505 – 1796)</option>
              <option value="british_ceylon">👑 British Ceylon Era (1796 – 1948)</option>
              <option value="dominion">🇱🇰 Early Ceylon &amp; Republic (1948 – 1977)</option>
              <option value="flora_fauna">🌿 Flora &amp; Fauna / History Series (1978 – 1990)</option>
              <option value="modern_heritage">✨ Sri Lankan Heritage &amp; Modern (1991 – Present)</option>
              <option value="commemorative">🎖️ Commemorative &amp; Special Issues</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#b8af9e] mb-1.5">
              Keyword / SKU / Note Code
            </label>
            <input
              type="text"
              placeholder="e.g. Kahavanu, 1941, George VI, 100 Rupees…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0c0a] border border-[#d4af37]/30 text-sm text-[#f8f6f0] placeholder-[#6b6255] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e5c158] text-[#0c0a08] font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
